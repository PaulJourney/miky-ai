import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { AuthRequest } from '../middleware/auth';
import Stripe from 'stripe';

const prisma = new PrismaClient();
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2024-11-20.acacia'
});

// Stripe price IDs (these would be set up in your Stripe dashboard)
const PRICE_IDS = {
  plus: process.env.STRIPE_PLUS_PRICE_ID || 'price_plus_monthly',
  business: process.env.STRIPE_BUSINESS_PRICE_ID || 'price_business_monthly'
};

// Create subscription
export const createSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { priceId, plan } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create or retrieve Stripe customer
    let customerId = user.stripeCustomerId;
    if (!customerId) {
      const customer = await stripe.customers.create({
        email: user.email,
        name: user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : undefined,
        metadata: { userId }
      });
      
      customerId = customer.id;
      await prisma.user.update({
        where: { id: userId },
        data: { stripeCustomerId: customerId }
      });
    }

    // Create subscription
    const subscription = await stripe.subscriptions.create({
      customer: customerId,
      items: [{ price: priceId }],
      payment_behavior: 'default_incomplete',
      payment_settings: { save_default_payment_method: 'on_subscription' },
      expand: ['latest_invoice.payment_intent'],
      metadata: { userId, plan }
    });

    const invoice = subscription.latest_invoice as Stripe.Invoice;
    const paymentIntent = invoice.payment_intent as Stripe.PaymentIntent;

    res.json({
      subscriptionId: subscription.id,
      clientSecret: paymentIntent.client_secret,
      status: subscription.status
    });
  } catch (error) {
    console.error('Create subscription error:', error);
    res.status(500).json({ error: 'Failed to create subscription' });
  }
};

// Update subscription
export const updateSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { newPriceId, newPlan } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.subscriptionId) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    if (newPlan === 'free') {
      // Cancel subscription for downgrade to free
      await stripe.subscriptions.cancel(user.subscriptionId);
      
      await prisma.user.update({
        where: { id: userId },
        data: {
          plan: 'FREE',
          subscriptionId: null,
          subscriptionStatus: 'cancelled',
          credits: 100 // Reset to free plan credits
        }
      });
    } else {
      // Update subscription with new price
      const subscription = await stripe.subscriptions.retrieve(user.subscriptionId);
      
      await stripe.subscriptions.update(user.subscriptionId, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId
        }],
        metadata: { userId, plan: newPlan }
      });
    }

    res.json({ message: 'Subscription updated successfully' });
  } catch (error) {
    console.error('Update subscription error:', error);
    res.status(500).json({ error: 'Failed to update subscription' });
  }
};

// Cancel subscription
export const cancelSubscription = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user || !user.subscriptionId) {
      return res.status(404).json({ error: 'No active subscription found' });
    }

    // Cancel at period end
    await stripe.subscriptions.update(user.subscriptionId, {
      cancel_at_period_end: true
    });

    await prisma.user.update({
      where: { id: userId },
      data: {
        subscriptionStatus: 'cancel_at_period_end'
      }
    });

    res.json({ message: 'Subscription will be cancelled at the end of the billing period' });
  } catch (error) {
    console.error('Cancel subscription error:', error);
    res.status(500).json({ error: 'Failed to cancel subscription' });
  }
};

// Buy credits
export const buyCredits = async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user!.id;
    const { credits, amount } = req.body;

    const user = await prisma.user.findUnique({
      where: { id: userId }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    // Create payment intent
    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount * 100), // Convert to cents
      currency: 'usd',
      customer: user.stripeCustomerId,
      metadata: { userId, credits: credits.toString(), type: 'credits' }
    });

    // Create pending transaction
    await prisma.transaction.create({
      data: {
        userId,
        type: 'CREDITS',
        amount,
        credits,
        stripePaymentIntentId: paymentIntent.id,
        status: 'PENDING'
      }
    });

    res.json({
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id
    });
  } catch (error) {
    console.error('Buy credits error:', error);
    res.status(500).json({ error: 'Failed to create payment' });
  }
};

// Stripe webhook
export const stripeWebhook = async (req: Request, res: Response) => {
  const sig = req.headers['stripe-signature']!;
  let event: Stripe.Event;

  try {
    event = stripe.webhooks.constructEvent(req.body, sig, process.env.STRIPE_WEBHOOK_SECRET!);
  } catch (err) {
    console.error('Webhook signature verification failed:', err);
    return res.status(400).send('Webhook Error');
  }

  try {
    switch (event.type) {
      case 'payment_intent.succeeded':
        const paymentIntent = event.data.object as Stripe.PaymentIntent;
        await handlePaymentSuccess(paymentIntent);
        break;

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice;
        await handleSubscriptionPayment(invoice);
        break;

      case 'customer.subscription.updated':
      case 'customer.subscription.deleted':
        const subscription = event.data.object as Stripe.Subscription;
        await handleSubscriptionChange(subscription);
        break;

      default:
        console.log(`Unhandled event type ${event.type}`);
    }

    res.json({ received: true });
  } catch (error) {
    console.error('Webhook handling error:', error);
    res.status(500).json({ error: 'Webhook handling failed' });
  }
};

// Helper functions
async function handlePaymentSuccess(paymentIntent: Stripe.PaymentIntent) {
  const { userId, credits } = paymentIntent.metadata;

  if (credits) {
    // Credit purchase
    await prisma.user.update({
      where: { id: userId },
      data: { credits: { increment: parseInt(credits) } }
    });

    await prisma.transaction.updateMany({
      where: { stripePaymentIntentId: paymentIntent.id },
      data: { status: 'COMPLETED' }
    });
  }
}

async function handleSubscriptionPayment(invoice: Stripe.Invoice) {
  const subscription = await stripe.subscriptions.retrieve(invoice.subscription as string);
  const { userId, plan } = subscription.metadata;

  const creditsByPlan = {
    plus: 1000,
    business: 5000
  };

  await prisma.user.update({
    where: { id: userId },
    data: {
      plan: plan.toUpperCase() as any,
      credits: creditsByPlan[plan as keyof typeof creditsByPlan],
      subscriptionStatus: subscription.status
    }
  });
}

async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const { userId } = subscription.metadata;

  await prisma.user.update({
    where: { id: userId },
    data: {
      subscriptionStatus: subscription.status,
      ...(subscription.status === 'canceled' && {
        plan: 'FREE',
        subscriptionId: null,
        credits: 100
      })
    }
  });
}