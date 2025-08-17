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
  try {
    console.log('🔥 Stripe manage subscription API called')
    const body = await request.json()
    const { action, planName } = body // action: 'downgrade' | 'cancel'

    // Get user from request headers
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile with subscription info
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (!profile?.stripe_customer_id) {
      return NextResponse.json({ error: 'No subscription found' }, { status: 400 })
    }

    console.log('🔥 Managing subscription for user:', user.id, 'action:', action)

    // Get current subscription
    const subscriptions = await stripe.subscriptions.list({
      customer: profile.stripe_customer_id,
      status: 'active',
      limit: 1
    })

    if (subscriptions.data.length === 0) {
      return NextResponse.json({ error: 'No active subscription found' }, { status: 400 })
    }

    const subscription = subscriptions.data[0]

    if (action === 'cancel' || planName === 'free') {
      // Cancel subscription at period end
      await stripe.subscriptions.update(subscription.id, {
        cancel_at_period_end: true
      })

      // Update profile to reflect pending cancellation
      await supabase
        .from('profiles')
        .update({
          subscription_status: 'cancel_at_period_end',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      const periodEnd = new Date((subscription as any).current_period_end * 1000)

      return NextResponse.json({
        success: true,
        message: 'Subscription will be cancelled at the end of the current period',
        effectiveDate: periodEnd.toISOString(),
        newPlan: 'free'
      })

    } else if (action === 'downgrade') {
      // Handle downgrade to a different paid plan
      let newPriceId = ''

      switch (planName?.toLowerCase()) {
        case 'plus':
          newPriceId = process.env.STRIPE_PRICE_PLUS!
          break
        case 'pro':
          newPriceId = process.env.STRIPE_PRICE_PRO!
          break
        default:
          return NextResponse.json({ error: 'Invalid plan for downgrade' }, { status: 400 })
      }

      // Update subscription to new plan
      await stripe.subscriptions.update(subscription.id, {
        items: [{
          id: subscription.items.data[0].id,
          price: newPriceId
        }],
        proration_behavior: 'create_prorations'
      })

      // Update profile
      await supabase
        .from('profiles')
        .update({
          subscription_plan: planName.toLowerCase(),
          subscription_status: 'active',
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      return NextResponse.json({
        success: true,
        message: `Subscription changed to ${planName} plan`,
        newPlan: planName.toLowerCase()
      })
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 })

  } catch (error) {
    console.error('🚨 Stripe manage subscription error:', error)
    return NextResponse.json({
      error: `Subscription management error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 })
  }
}
