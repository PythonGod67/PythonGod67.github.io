'use client'

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { useCart } from '@/hooks/useCart';
import { loadStripe } from '@stripe/stripe-js';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { toast } from 'react-hot-toast';
import { Minus, Plus, X } from 'lucide-react';
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient";

const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);

const CheckoutForm = ({ totalAmount }) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const { clearCart } = useCart();
  const router = useRouter();

  const handleSubmit = async (event) => {
    event.preventDefault();
    if (!stripe || !elements) return;

    setIsProcessing(true);

    const { error, paymentMethod } = await stripe.createPaymentMethod({
      type: 'card',
      card: elements.getElement(CardElement)!,
    });

    if (error) {
      console.error('Error:', error);
      toast.error('Payment failed. Please try again.');
    } else {
      console.log('PaymentMethod:', paymentMethod);
      toast.success('Payment successful!');
      clearCart();
      router.push('/thank-you');
    }

    setIsProcessing(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mt-4">
      <CardElement className="bg-white p-3 rounded-md shadow-sm" />
      <Button 
        type="submit" 
        disabled={!stripe || isProcessing} 
        className="mt-4 w-full bg-sky-600 hover:bg-sky-700 text-white"
      >
        {isProcessing ? 'Processing...' : `Pay $${totalAmount.toFixed(2)}`}
      </Button>
    </form>
  );
};

const CartItem = ({ item, updateQuantity, removeFromCart }) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    exit={{ opacity: 0, y: -20 }}
    transition={{ duration: 0.3 }}
  >
    <Card className="mb-4 hover:shadow-md transition-shadow duration-200 bg-white/20 backdrop-filter backdrop-blur-lg border border-white/30">
      <CardContent className="flex items-center p-4">
        <Image src={item.imageUrl} alt={item.title} width={80} height={80} className="rounded-md mr-4 object-cover" />
        <div className="flex-grow">
          <h3 className="text-lg font-semibold text-sky-700">{item.title}</h3>
          <p className="text-sky-600">${item.price}/day</p>
          <div className="flex items-center mt-2">
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
              className="h-8 w-8"
            >
              <Minus className="h-4 w-4" />
            </Button>
            <Input 
              type="number" 
              min="1" 
              value={item.quantity} 
              onChange={(e) => updateQuantity(item.id, parseInt(e.target.value))}
              className="w-16 mx-2 text-center"
            />
            <Button
              variant="outline"
              size="icon"
              onClick={() => updateQuantity(item.id, item.quantity + 1)}
              className="h-8 w-8"
            >
              <Plus className="h-4 w-4" />
            </Button>
            <span className="ml-4 text-gray-600">for</span>
            <Input 
              type="number" 
              min="1" 
              value={item.rentalDuration} 
              onChange={(e) => updateQuantity(item.id, item.quantity, parseInt(e.target.value))}
              className="w-16 mx-2 text-center"
            />
            <span className="text-gray-600">days</span>
          </div>
        </div>
        <div className="flex flex-col items-end">
          <Button variant="ghost" size="icon" onClick={() => removeFromCart(item.id)} className="text-gray-400 hover:text-red-500">
            <X className="h-5 w-5" />
          </Button>
          <p className="mt-2 font-semibold text-lg">${(item.price * item.quantity * item.rentalDuration).toFixed(2)}</p>
        </div>
      </CardContent>
    </Card>
  </motion.div>
);

const CartPage: React.FC = () => {
  const { cart, removeFromCart, updateQuantity } = useCart();
  const router = useRouter();

  const totalAmount = cart.reduce((total, item) => total + item.price * item.quantity * item.rentalDuration, 0);

  return (
    <div className="min-h-screen relative">
      <div className="absolute inset-0 z-0">
        <BackgroundGradientAnimation
          gradientBackgroundStart="rgb(120, 180, 255)"
          gradientBackgroundEnd="rgb(180, 230, 255)"
          firstColor="18, 113, 255"
          secondColor="100, 180, 255"
          thirdColor="160, 220, 255"
          fourthColor="200, 240, 255"
          fifthColor="220, 250, 255"
          pointerColor="140, 200, 255"
          size="80%"
          blendingValue="normal"
        />
      </div>
      <div className="relative z-10 container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-8">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center"
          >
            <Image 
              src="/transparentbg-white-medelen-logo.png" 
              alt="Medelen Logo" 
              width={75} 
              height={75} 
              className="mr-4"
            />
            <h1 className="text-3xl font-bold text-sky-800">Your Cart</h1>
          </motion.div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Button 
              onClick={() => router.push('/home')} 
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              Continue Shopping
            </Button>
          </motion.div>
        </div>
        {cart.length === 0 ? (
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="text-center py-16 bg-white/70 backdrop-filter backdrop-blur-lg rounded-lg"
          >
            <p className="text-xl text-gray-600 mb-4">Your cart is empty.</p>
            <Button 
              onClick={() => router.push('/home')} 
              className="bg-sky-600 hover:bg-sky-700 text-white"
            >
              Start Shopping
            </Button>
          </motion.div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-2"
            >
              {cart.map((item) => (
                <CartItem 
                  key={item.id} 
                  item={item} 
                  updateQuantity={updateQuantity} 
                  removeFromCart={removeFromCart} 
                />
              ))}
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:col-span-1"
            >
              <Card className="sticky top-4 bg-white/70 backdrop-filter backdrop-blur-lg">
                <CardContent className="p-6">
                  <h2 className="text-2xl font-semibold mb-4 text-sky-800">Order Summary</h2>
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between">
                      <span>Subtotal</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Total</span>
                      <span>${totalAmount.toFixed(2)}</span>
                    </div>
                  </div>
                  <Elements stripe={stripePromise}>
                    <CheckoutForm totalAmount={totalAmount} />
                  </Elements>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CartPage;