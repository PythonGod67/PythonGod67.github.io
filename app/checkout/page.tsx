'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useCart } from '@/hooks/useCart';
import { toast } from 'react-hot-toast';

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { clearCart } = useCart();
  const router = useRouter();
  const [customerInfo, setCustomerInfo] = useState({
    name: '',
    email: '',
    address: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setCustomerInfo(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();

    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);
    setError(null);

    const cardElement = elements.getElement(CardElement);

    if (!cardElement) {
      setError("An error occurred. Please try again.");
      setIsProcessing(false);
      return;
    }

    try {
      // Create PaymentMethod
      const { error: stripeError, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
        billing_details: {
          name: customerInfo.name,
          email: customerInfo.email,
          address: {
            line1: customerInfo.address,
          },
        },
      });

      if (stripeError) {
        setError(stripeError.message || "An error occurred. Please try again.");
        setIsProcessing(false);
        return;
      }

      // Send PaymentMethod ID to your server
      const response = await fetch('/api/create-subscription', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          paymentMethodId: paymentMethod.id,
          customerInfo,
          amount: totalAmount,
        }),
      });

      if (!response.ok) {
        throw new Error('Server error');
      }

      const { clientSecret, subscriptionId } = await response.json();

      // Confirm the subscription
      const { error: confirmError } = await stripe.confirmCardPayment(clientSecret);

      if (confirmError) {
        setError(confirmError.message || "An error occurred. Please try again.");
      } else {
        toast.success('Subscription created successfully!');
        clearCart();
        router.push(`/thank-you?subscription=${subscriptionId}`);
      }
    } catch (err) {
      setError('An unexpected error occurred.');
      console.error('Checkout error:', err);
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <Input
        type="text"
        name="name"
        placeholder="Full Name"
        required
        value={customerInfo.name}
        onChange={handleInputChange}
      />
      <Input
        type="email"
        name="email"
        placeholder="Email Address"
        required
        value={customerInfo.email}
        onChange={handleInputChange}
      />
      <Input
        type="text"
        name="address"
        placeholder="Billing Address"
        required
        value={customerInfo.address}
        onChange={handleInputChange}
      />
      <CardElement options={{style: {base: {fontSize: '16px'}}}} />
      {error && <div className="text-red-500">{error}</div>}
      <Button 
        type="submit" 
        disabled={isProcessing || !stripe} 
        className="w-full"
      >
        {isProcessing ? 'Processing...' : `Subscribe - $${totalAmount.toFixed(2)}/month`}
      </Button>
    </form>
  );
};

const CheckoutPage = () => {
  const { cart } = useCart();
  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity * item.rentalDuration, 0);

  return (
    <div className="container mx-auto px-4 py-8">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Checkout</CardTitle>
        </CardHeader>
        <CardContent>
          <Elements stripe={stripePromise}>
            <CheckoutForm totalAmount={totalAmount} />
          </Elements>
        </CardContent>
      </Card>
    </div>
  );
};

export default CheckoutPage;