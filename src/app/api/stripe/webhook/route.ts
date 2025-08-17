import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import Stripe from 'stripe'

// Initialize Stripe
const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil'
})

// Initialize Supabase
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_KEY!,
  {
    auth: {
      autoRefreshToken: false,
      persistSession: false
    }
  }
)

export async function POST(request: NextRequest) {
  const body = await request.text()
  const signature = request.headers.get('stripe-signature')

  if (!signature || !process.env.STRIPE_WEBHOOK_SECRET) {
    console.error('🚨 Stripe webhook signature missing')
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(body, signature, process.env.STRIPE_WEBHOOK_SECRET)
  } catch (error) {
    console.error('🚨 Stripe webhook signature verification failed:', error)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  console.log('🔥 Stripe webhook event:', event.type)

  try {
    switch (event.type) {
      case 'checkout.session.completed':
        await handleCheckoutCompleted(event.data.object as Stripe.Checkout.Session)
        break

      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        await handleSubscriptionUpdate(event.data.object as Stripe.Subscription)
        break

      case 'customer.subscription.deleted':
        await handleSubscriptionDeleted(event.data.object as Stripe.Subscription)
        break

      case 'invoice.payment_succeeded':
        await handlePaymentSucceeded(event.data.object as Stripe.Invoice)
        break

      default:
        console.log(`🔔 Unhandled Stripe event: ${event.type}`)
    }

    return NextResponse.json({ received: true })

  } catch (error) {
    console.error('🚨 Stripe webhook error:', error)
    return NextResponse.json({ error: 'Webhook handler failed' }, { status: 500 })
  }
}

async function handleCheckoutCompleted(session: Stripe.Checkout.Session) {
  console.log('🔥 Processing checkout completed:', session.id)

  const userId = session.metadata?.userId
  if (!userId) {
    console.error('🚨 No userId in session metadata')
    return
  }

  // Handle credits purchase
  if (session.metadata?.type === 'credits') {
    const creditsToAdd = parseInt(session.metadata.credits || '0')

    const { data: profile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    const newCredits = (profile?.credits || 0) + creditsToAdd

    await supabase
      .from('profiles')
      .update({
        credits: newCredits,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    console.log(`🔥 Added ${creditsToAdd} credits to user ${userId}`)
  }

  // Handle subscription
  if (session.metadata?.type === 'subscription') {
    const planName = session.metadata.planName?.toLowerCase()
    let creditsToAdd = 0

    switch (planName) {
      case 'plus':
        creditsToAdd = 1000
        break
      case 'pro':
        creditsToAdd = 5000
        break
    }

    // Get current profile to update credits properly
    const { data: currentProfile } = await supabase
      .from('profiles')
      .select('credits')
      .eq('id', userId)
      .single()

    const newCredits = (currentProfile?.credits || 0) + creditsToAdd

    await supabase
      .from('profiles')
      .update({
        subscription_plan: planName,
        subscription_status: 'active',
        stripe_customer_id: session.customer as string,
        credits: newCredits,
        updated_at: new Date().toISOString()
      })
      .eq('id', userId)

    console.log(`🔥 Updated user ${userId} to ${planName} plan with ${creditsToAdd} credits`)
  }
}

async function handleSubscriptionUpdate(subscription: Stripe.Subscription) {
  console.log('🔥 Processing subscription update:', subscription.id)

  const customerId = subscription.customer as string

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) {
    console.error('🚨 No profile found for customer:', customerId)
    return
  }

  // Get plan from subscription items
  const priceId = subscription.items.data[0]?.price.id
  let planName = 'free'

  if (priceId === process.env.STRIPE_PRICE_PLUS) {
    planName = 'plus'
  } else if (priceId === process.env.STRIPE_PRICE_PRO) {
    planName = 'pro'
  }

  await supabase
    .from('profiles')
    .update({
      subscription_plan: planName,
      subscription_status: subscription.status,
      updated_at: new Date().toISOString()
    })
    .eq('id', profile.id)

  console.log(`🔥 Updated subscription for user ${profile.id} to ${planName}`)
}

async function handleSubscriptionDeleted(subscription: Stripe.Subscription) {
  console.log('🔥 Processing subscription deletion:', subscription.id)

  const customerId = subscription.customer as string

  const { data: profile } = await supabase
    .from('profiles')
    .select('*')
    .eq('stripe_customer_id', customerId)
    .single()

  if (!profile) {
    console.error('🚨 No profile found for customer:', customerId)
    return
  }

  await supabase
    .from('profiles')
    .update({
      subscription_plan: 'free',
      subscription_status: 'canceled',
      updated_at: new Date().toISOString()
    })
    .eq('id', profile.id)

  console.log(`🔥 Canceled subscription for user ${profile.id}`)
}

async function handlePaymentSucceeded(invoice: Stripe.Invoice) {
  console.log('🔥 Processing payment succeeded:', invoice.id)

  // This handles recurring subscription payments
  // Could add logic here to add monthly credits, etc.
}
