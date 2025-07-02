// Add this at the top to fix TS errors for window.paypal
declare global {
  interface Window {
    paypal?: any;
  }
}

import { useEffect, useRef } from 'react';

interface PayPalButtonProps {
  order: any; // The order details to send to /api/paypal/create-order
  onSuccess?: (details: any) => void;
  onError?: (error: any) => void;
  className?: string;
}

// Helper to load PayPal SDK script
function loadPayPalScript(clientId: string): Promise<void> {
  return new Promise((resolve, reject) => {
    if (window.paypal) return resolve();
    const script = document.createElement('script');
    script.src = `https://www.paypal.com/sdk/js?client-id=${clientId}&components=buttons`;
    script.async = true;
    script.onload = () => resolve();
    script.onerror = reject;
    document.body.appendChild(script);
  });
}

export function PayPalButton({ order, onSuccess, onError, className }: PayPalButtonProps) {
  const buttonRef = useRef<HTMLDivElement>(null);
  const clientId = process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID;

  useEffect(() => {
    if (!clientId || !order) return;
    let isMounted = true;
    loadPayPalScript(clientId).then(() => {
      if (!isMounted || !window.paypal || !buttonRef.current) return;
      window.paypal.Buttons({
        createOrder: async () => {
          const res = await fetch('/api/paypal/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(order),
          });
          const data = await res.json();
          if (!res.ok || !data.id) throw new Error(data.error || 'Failed to create PayPal order');
          return data.id;
        },
        onApprove: async (data: any, actions: any) => {
          try {
            const res = await fetch('/api/paypal/capture-order', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ orderID: data.orderID }),
            });
            const details = await res.json();
            if (!res.ok) throw new Error(details.error || 'Payment failed');
            onSuccess?.(details);
          } catch (err) {
            onError?.(err);
            alert('Payment failed. Please try again.');
          }
        },
        onError: (err: any) => {
          onError?.(err);
          alert('PayPal error: ' + (err?.message || err));
        },
        style: { layout: 'vertical', color: 'gold', shape: 'rect', label: 'paypal' },
      }).render(buttonRef.current);
    }).catch((err) => {
      onError?.(err);
      alert('Failed to load PayPal: ' + (err?.message || err));
    });
    return () => { isMounted = false; };
  }, [clientId, order, onSuccess, onError]);

  return <div ref={buttonRef} className={className} />;
}
