"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { PayPalButton } from '@/components/PayPalButton';

interface GreenDonationFormProps {
  compact?: boolean;
}

export default function GreenDonationForm({ compact = false }: GreenDonationFormProps) {
  const [amount, setAmount] = useState(2);
  const [error, setError] = useState("");
  const [thankYou, setThankYou] = useState(false);
  const [loading, setLoading] = useState(false);
  const [paypalSuccess, setPaypalSuccess] = useState(false);
  let thankYouTimeout: NodeJS.Timeout | null = null;

  const handleDonate = async () => {
    if (isNaN(amount) || amount < 2) {
      setError("Please enter a valid amount (minimum $2)");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res = await fetch("/api/donate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount }),
      });
      const data = await res.json();
      if (data.success) {
        setThankYou(true);
        setAmount(2);
        thankYouTimeout = setTimeout(() => setThankYou(false), 3500);
      } else {
        setError(data.message || "Donation failed. Please try again.");
      }
    } catch (err) {
      setError("Donation failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  // Clean up timeout if component unmounts
  // (not strictly necessary for this simple use, but good practice)
  // useEffect(() => () => { if (thankYouTimeout) clearTimeout(thankYouTimeout); }, []);

  return (
    <div className={`flex flex-col items-center gap-2 w-full max-w-xs ${compact ? 'py-1' : ''}`}>
      <div className={`flex items-center gap-2 w-full ${compact ? 'text-sm' : ''}`}>
        <span className="text-green-700 font-medium">$</span>
        <Input
          type="number"
          min={2}
          step={1}
          value={amount}
          onChange={e => setAmount(Number(e.target.value))}
          className={`w-20 text-center ${compact ? 'h-8 px-2 py-1 text-sm' : ''}`}
          aria-label="Donation amount"
          disabled={thankYou || loading || paypalSuccess}
        />
        <span className="text-green-700">for the planet</span>
      </div>
      {error && <div className="text-red-600 text-xs mt-1">{error}</div>}
      <Button onClick={handleDonate} className={`mt-2 w-full ${compact ? 'h-8 text-sm' : ''}`} size={compact ? 'sm' : 'lg'} disabled={thankYou || loading || paypalSuccess}>
        {loading ? 'Processing...' : thankYou ? 'Thank you!' : 'Donate'}
      </Button>
      {/* PayPal Donation Button */}
      <div className="w-full mt-2">
        <PayPalButton
          order={{
            intent: 'CAPTURE',
            purchase_units: [
              {
                amount: {
                  currency_code: 'USD',
                  value: amount.toFixed(2),
                },
                description: 'Green Movement Donation',
              },
            ],
          }}
          onSuccess={() => {
            setPaypalSuccess(true);
            setThankYou(true);
            setAmount(2);
            setTimeout(() => {
              setThankYou(false);
              setPaypalSuccess(false);
            }, 3500);
          }}
          onError={() => setError('PayPal payment failed. Please try again.')}
          className="w-full flex justify-center"
        />
      </div>
      {thankYou && (
        <div className="text-green-700 text-xs mt-1 text-center">Thank you for supporting the green movement! 🌱</div>
      )}
    </div>
  );
} 