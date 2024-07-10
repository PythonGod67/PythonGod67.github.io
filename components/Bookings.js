import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { useMutation } from '@tanstack/react-query';
import { createBooking } from '@/utils/vendorUtils';
import { createPaymentIntent, confirmPayment } from '@/utils/stripeUtils';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { CardElement, useStripe, useElements } from '@stripe/react-stripe-js';

const schema = yup.object().shape({
  startDate: yup.date().required('Start date is required'),
  endDate: yup.date().min(yup.ref('startDate'), "End date can't be before start date").required('End date is required'),
});

export const Booking = ({ listing, onSuccess }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    resolver: yupResolver(schema)
  });

  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);

  const createBookingMutation = useMutation(createBooking, {
    onSuccess: () => {
      alert('Booking created successfully!');
      onSuccess();
    },
    onError: (error) => {
      alert(`Error creating booking: ${error.message}`);
    }
  });

  const onSubmit = async (data) => {
    if (!stripe || !elements) {
      return;
    }

    setIsProcessing(true);

    try {
      const amount = calculateTotalAmount(data.startDate, data.endDate, listing.price);
      const { clientSecret } = await createPaymentIntent(amount);

      const { paymentIntent, error } = await stripe.confirmCardPayment(clientSecret, {
        payment_method: {
          card: elements.getElement(CardElement),
        }
      });

      if (error) {
        throw new Error(error.message);
      }

      if (paymentIntent.status === 'succeeded') {
        createBookingMutation.mutate({
          ...data,
          listingId: listing.id,
          totalAmount: amount,
          paymentIntentId: paymentIntent.id
        });
      }
    } catch (error) {
      alert(`Payment failed: ${error.message}`);
    } finally {
      setIsProcessing(false);
    }
  };

  const calculateTotalAmount = (startDate, endDate, pricePerDay) => {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const days = Math.ceil((end - start) / (1000 * 60 * 60 * 24));
    return days * pricePerDay;
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <Input {...register('startDate')} type="date" />
        {errors.startDate && <p className="text-red-500">{errors.startDate.message}</p>}
      </div>
      <div>
        <Input {...register('endDate')} type="date" />
        {errors.endDate && <p className="text-red-500">{errors.endDate.message}</p>}
      </div>
      <div>
        <CardElement />
      </div>
      <Button type="submit" disabled={isProcessing || createBookingMutation.isLoading}>
        {isProcessing ? 'Processing...' : 'Book Now'}
      </Button>
    </form>
  );
};