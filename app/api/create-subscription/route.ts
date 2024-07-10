import { NextRequest, NextResponse } from 'next/server';
import Stripe from 'stripe';

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16', 
});

export async function POST(req: NextRequest) {
  if (req.method === 'POST') {
    try {
      const { paymentMethodId, customerInfo, amount } = await req.json();

      // Create or retrieve a customer
      const customer = await stripe.customers.create({
        payment_method: paymentMethodId,
        email: customerInfo.email,
        name: customerInfo.name,
        address: {
          line1: customerInfo.address,
        },
        invoice_settings: {
          default_payment_method: paymentMethodId,
        },
      });

      // Create a subscription
      const subscription = await stripe.subscriptions.create({
        customer: customer.id,
        items: [
          {
            price_data: {
              currency: 'usd',
              unit_amount: Math.round(amount * 100), // Convert to cents
              recurring: {
                interval: 'month',
              },
              product_data: {
                name: 'Medelen Equipment Rental',
              },
            },
          },
        ],
        payment_settings: {
          payment_method_types: ['card'],
          save_default_payment_method: 'on_subscription',
        },
        expand: ['latest_invoice.payment_intent'],
      });

      const invoice = subscription.latest_invoice as Stripe.Invoice;
      const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

      return NextResponse.json({
        subscriptionId: subscription.id,
        clientSecret: paymentIntent.client_secret,
      });
    } catch (error) {
      console.error('Subscription creation error:', error);
      return NextResponse.json({ error: 'An error occurred while creating the subscription.' }, { status: 500 });
    }
  } else {
    return NextResponse.json({ error: 'Method not allowed' }, { status: 405 });
  }
}