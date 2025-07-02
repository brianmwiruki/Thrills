'use client';

import { useState, useEffect } from 'react';
import { useCartStore } from '@/lib/store/cart';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  CreditCard, 
  Truck, 
  Shield, 
  CheckCircle,
  Lock
} from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { calculateShipping } from '@/lib/printify';
import { PayPalButton } from '@/components/PayPalButton';
import countryList from 'react-select-country-list';
import Select from 'react-select';

interface CheckoutForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
}

const COUNTRIES = [
  { value: 'United States', label: 'United States' },
  { value: 'United Kingdom', label: 'United Kingdom' },
  { value: 'Germany', label: 'Germany' },
];
const US_STATES = [
  { value: 'AL', label: 'Alabama' },
  { value: 'AK', label: 'Alaska' },
  { value: 'AZ', label: 'Arizona' },
  { value: 'AR', label: 'Arkansas' },
  { value: 'CA', label: 'California' },
  { value: 'CO', label: 'Colorado' },
  { value: 'CT', label: 'Connecticut' },
  { value: 'DE', label: 'Delaware' },
  { value: 'FL', label: 'Florida' },
  { value: 'GA', label: 'Georgia' },
  { value: 'HI', label: 'Hawaii' },
  { value: 'ID', label: 'Idaho' },
  { value: 'IL', label: 'Illinois' },
  { value: 'IN', label: 'Indiana' },
  { value: 'IA', label: 'Iowa' },
  { value: 'KS', label: 'Kansas' },
  { value: 'KY', label: 'Kentucky' },
  { value: 'LA', label: 'Louisiana' },
  { value: 'ME', label: 'Maine' },
  { value: 'MD', label: 'Maryland' },
  { value: 'MA', label: 'Massachusetts' },
  { value: 'MI', label: 'Michigan' },
  { value: 'MN', label: 'Minnesota' },
  { value: 'MS', label: 'Mississippi' },
  { value: 'MO', label: 'Missouri' },
  { value: 'MT', label: 'Montana' },
  { value: 'NE', label: 'Nebraska' },
  { value: 'NV', label: 'Nevada' },
  { value: 'NH', label: 'New Hampshire' },
  { value: 'NJ', label: 'New Jersey' },
  { value: 'NM', label: 'New Mexico' },
  { value: 'NY', label: 'New York' },
  { value: 'NC', label: 'North Carolina' },
  { value: 'ND', label: 'North Dakota' },
  { value: 'OH', label: 'Ohio' },
  { value: 'OK', label: 'Oklahoma' },
  { value: 'OR', label: 'Oregon' },
  { value: 'PA', label: 'Pennsylvania' },
  { value: 'RI', label: 'Rhode Island' },
  { value: 'SC', label: 'South Carolina' },
  { value: 'SD', label: 'South Dakota' },
  { value: 'TN', label: 'Tennessee' },
  { value: 'TX', label: 'Texas' },
  { value: 'UT', label: 'Utah' },
  { value: 'VT', label: 'Vermont' },
  { value: 'VA', label: 'Virginia' },
  { value: 'WA', label: 'Washington' },
  { value: 'WV', label: 'West Virginia' },
  { value: 'WI', label: 'Wisconsin' },
  { value: 'WY', label: 'Wyoming' },
];

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}
function isValidPhone(phone: string) {
  // Accepts numbers, spaces, dashes, parentheses, and plus sign
  return /^[+]?[(]?[0-9]{1,4}[)]?[-\s0-9]*$/.test(phone) && phone.length >= 7;
}

export default function CheckoutClient() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [formData, setFormData] = useState<CheckoutForm>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    address: '',
    city: '',
    state: '',
    zipCode: '',
    country: 'United States'
  });
  const [isProcessing, setIsProcessing] = useState(false);

  // Shipping integration state
  const [shippingCost, setShippingCost] = useState<number | null>(null);
  const [shippingLoading, setShippingLoading] = useState(false);
  const [shippingError, setShippingError] = useState<string | null>(null);

  // Green donation state
  const initialGreenDonation = Number(searchParams.get('greenDonation')) || 2;
  const [greenDonation, setGreenDonation] = useState<number>(initialGreenDonation);
  const [greenError, setGreenError] = useState<string>("");

  const subtotal = getTotalPrice();
  // TEMPORARY FIX: Use fixed shipping price of $6 unless subtotal is above free shipping threshold
  const shipping = subtotal > 70 ? 0 : 6;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax + (greenDonation > 0 ? greenDonation : 0);

  const handleInputChange = (field: keyof CheckoutForm, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const validateShippingFields = () => {
    if (!formData.firstName || !formData.lastName || !formData.email || !formData.phone || !formData.address || !formData.city || !formData.state || !formData.zipCode || !formData.country) {
      setShippingError('Please fill in all required fields.');
      return false;
    }
    if (!isValidEmail(formData.email)) {
      setShippingError('Please enter a valid email address.');
      return false;
    }
    if (!isValidPhone(formData.phone)) {
      setShippingError('Please enter a valid phone number.');
      return false;
    }
    if (formData.country === 'United States' && formData.state.length !== 2) {
      setShippingError('Please select a valid US state.');
      return false;
    }
    return true;
  };

  // TEMPORARY FIX: Disable shipping calculation on ZIP blur
  const handleZipBlur = () => {
    // No-op for now
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate form
    const requiredFields = ['firstName', 'lastName', 'email', 'address', 'city', 'state', 'zipCode'];
    const missingFields = requiredFields.filter(field => !formData[field as keyof CheckoutForm]);
    
    if (missingFields.length > 0) {
      toast.error('Please fill in all required fields');
      return;
    }

    if (items.length === 0) {
      toast.error('Your cart is empty');
      return;
    }

    const res2 = await fetch('/api/validate-cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ items }),
    });
    const validation2 = await res2.json();
    if (!validation2.valid) {
      toast.error(validation2.message);
      return;
    }

    setIsProcessing(true);
    
    try {
      // TODO: Integrate with Stripe payment
      // For now, simulate payment processing
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // TODO: Submit order to Printify API
      // For now, just clear cart and redirect to success
      clearCart();
      toast.success('Order placed successfully!');
      
      // Redirect to success page
      router.push('/checkout/success');
    } catch (error) {
      toast.error('Payment failed. Please try again.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-20">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center space-y-6"
        >
          <div className="mx-auto w-24 h-24 bg-muted rounded-full flex items-center justify-center">
            <CreditCard className="h-12 w-12 text-muted-foreground" />
          </div>
          <div className="space-y-2">
            <h1 className="text-3xl font-bold">Your cart is empty</h1>
            <p className="text-muted-foreground">
              Add some items to your cart before proceeding to checkout.
            </p>
          </div>
          <Link href="/shop">
            <Button size="lg">
              Continue Shopping
            </Button>
          </Link>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="space-y-8"
      >
        {/* Header */}
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Checkout</h1>
          <Link href="/cart">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Cart
            </Button>
          </Link>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Checkout Form */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Shipping Information</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="firstName">First Name *</Label>
                      <Input
                        id="firstName"
                        value={formData.firstName}
                        onChange={(e) => handleInputChange('firstName', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="lastName">Last Name *</Label>
                      <Input
                        id="lastName"
                        value={formData.lastName}
                        onChange={(e) => handleInputChange('lastName', e.target.value)}
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange('email', e.target.value)}
                        required
                      />
                    </div>
                    <div>
                      <Label htmlFor="phone">Phone</Label>
                      <Input
                        id="phone"
                        type="tel"
                        value={formData.phone}
                        onChange={(e) => handleInputChange('phone', e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="address">Address *</Label>
                    <Input
                      id="address"
                      value={formData.address}
                      onChange={(e) => handleInputChange('address', e.target.value)}
                      required
                      placeholder="1775 Wells Road"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your street address. Example: 1775 Wells Road
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="city">City *</Label>
                      <Input
                        id="city"
                        value={formData.city}
                        onChange={(e) => handleInputChange('city', e.target.value)}
                        required
                        placeholder="Orange Park"
                      />
                      <p className="text-xs text-muted-foreground mt-1">
                        Enter your city. Example: Orange Park
                      </p>
                    </div>
                    <div>
                      <Label htmlFor="country">Country *</Label>
                      <Select
                        id="country"
                        options={COUNTRIES}
                        value={COUNTRIES.find(c => c.value === formData.country)}
                        onChange={option => handleInputChange('country', option?.value || '')}
                        isSearchable={false}
                        required
                      />
                    </div>
                    <div>
                      {formData.country === 'United States' ? (
                        <div>
                          <Label htmlFor="state">State *</Label>
                          <Select
                            id="state"
                            options={US_STATES}
                            value={US_STATES.find(s => s.value === formData.state)}
                            onChange={option => handleInputChange('state', option?.value || '')}
                            required
                            placeholder="FL"
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Select your state. Example: FL
                          </p>
                        </div>
                      ) : (
                        <div>
                          <Label htmlFor="state">Region/State *</Label>
                          <Input
                            id="state"
                            value={formData.state}
                            onChange={e => handleInputChange('state', e.target.value)}
                            required
                            placeholder={formData.country === 'United Kingdom' ? 'England' : formData.country === 'Germany' ? 'Bavaria' : ''}
                          />
                          <p className="text-xs text-muted-foreground mt-1">
                            Enter your region or state. Example: {formData.country === 'United Kingdom' ? 'England' : formData.country === 'Germany' ? 'Bavaria' : ''}
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div>
                    <Label htmlFor="zipCode">ZIP Code *</Label>
                    <Input
                      id="zipCode"
                      value={formData.zipCode}
                      onChange={(e) => handleInputChange('zipCode', e.target.value)}
                      required
                      placeholder="32073"
                      onBlur={handleZipBlur}
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Enter your postal code. Example: 32073
                    </p>
                  </div>
                </form>
              </CardContent>
            </Card>

            {/* Green Movement Donation Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <span className="text-2xl">🌱</span>
                  <span>Support the Green Movement</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col gap-2">
                  <p className="text-green-900 text-sm mb-2">
                    Let's make every order a little greener. Add a donation to help plant trees, reduce carbon, and create a cleaner future for all. Every small act counts—will you join us?
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-green-700 font-medium">$</span>
                    <Input
                      type="number"
                      min={0}
                      step={1}
                      value={greenDonation}
                      onChange={e => {
                        const val = Number(e.target.value);
                        setGreenDonation(val);
                        if (isNaN(val) || val < 0) setGreenError("Please enter a valid amount (minimum $0)");
                        else setGreenError("");
                      }}
                      className="w-24 text-center"
                      aria-label="Donation amount"
                    />
                    <span className="text-green-700">for the planet</span>
                  </div>
                  {greenError && <div className="text-red-600 text-sm mt-1">{greenError}</div>}
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="h-4 w-4" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="p-4 border rounded-lg bg-muted/50">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CreditCard className="h-4 w-4" />
                        <span className="font-medium">Credit Card</span>
                      </div>
                      <Badge variant="secondary">Secure</Badge>
                    </div>
                    <p className="text-sm text-muted-foreground mt-2">
                      We'll redirect you to our secure payment processor
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Order Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Order Items */}
                <div className="space-y-3">
                  {items.map((item) => (
                    <div key={item.id} className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2">
                          <span className="font-medium">{item.product.name}</span>
                          <span className="text-sm text-muted-foreground">x{item.quantity}</span>
                        </div>
                        {item.product.selectedVariant && (
                          <Badge variant="outline" className="text-xs mt-1">
                            {item.product.selectedVariant.title}
                          </Badge>
                        )}
                      </div>
                      <span className="font-medium">
                        ${(item.product.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>
                
                <Separator />
                
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Subtotal</span>
                    <span>${subtotal.toFixed(2)}</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <div className="flex items-center gap-2">
                      <span>Shipping</span>
                      {shipping === 0 && (
                        <Badge variant="secondary" className="text-xs">Free</Badge>
                      )}
                      {/* Shipping calculation temporarily disabled */}
                    </div>
                    <span>${shipping.toFixed(2)}</span>
                  </div>
                  
                  {greenDonation > 0 && (
                    <div className="flex justify-between">
                      <span className="text-green-700">Green Movement Donation</span>
                      <span className="text-green-700 font-medium">+${greenDonation.toFixed(2)}</span>
                    </div>
                  )}
                  
                  <div className="flex justify-between">
                    <span>Tax</span>
                    <span>${tax.toFixed(2)}</span>
                  </div>
                  
                  <Separator />
                  
                  <div className="flex justify-between font-bold text-lg">
                    <span>Total</span>
                    <span>${total.toFixed(2)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Security & Trust */}
            <Card>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <Shield className="h-4 w-4 text-green-600" />
                    <span className="text-sm">Secure Payment</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Truck className="h-4 w-4 text-blue-600" />
                    <span className="text-sm">Free Shipping on Orders Over $70</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-600" />
                    <span className="text-sm">30-Day Return Policy</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Place Order Button */}
            <Button 
              size="lg" 
              className="w-full" 
              onClick={handleSubmit}
              disabled={isProcessing /* || shippingLoading || (shippingCost === null && subtotal <= 70) */}
            >
              {isProcessing ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Processing...
                </>
              ) : (
                <>
                  <Lock className="h-4 w-4 mr-2" />
                  Place Order - ${total.toFixed(2)}
                </>
              )}
            </Button>

            {/* PayPal Button */}
            <PayPalButton
              order={{
                intent: 'CAPTURE',
                purchase_units: [
                  {
                    amount: {
                      currency_code: 'USD',
                      value: total.toFixed(2),
                      breakdown: {
                        item_total: { currency_code: 'USD', value: subtotal.toFixed(2) },
                        shipping: { currency_code: 'USD', value: shipping.toFixed(2) },
                        tax_total: { currency_code: 'USD', value: tax.toFixed(2) },
                      },
                    },
                    items: items.map(item => ({
                      name: item.product.name,
                      unit_amount: { currency_code: 'USD', value: item.product.price.toFixed(2) },
                      quantity: item.quantity.toString(),
                    })),
                    shipping: {
                      address: {
                        address_line_1: formData.address,
                        admin_area_2: formData.city,
                        admin_area_1: formData.state,
                        postal_code: formData.zipCode,
                        country_code: 'US',
                      },
                    },
                  },
                ],
                payer: {
                  name: {
                    given_name: formData.firstName,
                    surname: formData.lastName,
                  },
                  email_address: formData.email,
                },
              }}
              onSuccess={() => {
                clearCart();
                toast.success('Order placed successfully!');
                router.push('/checkout/success');
              }}
              onError={(error) => {
                toast.error('PayPal payment failed. Please try again.');
              }}
              className="w-full mt-4"
            />
          </div>
        </div>
      </motion.div>
    </div>
  );
} 