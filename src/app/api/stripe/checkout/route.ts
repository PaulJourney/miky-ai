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
    console.log('🔥 Stripe checkout API called')
    const body = await request.json()
    const { planName, credits, returnUrl } = body

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

    console.log('🔥 User authenticated for Stripe checkout:', user.id)

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    const sessionData: any = {
      payment_method_types: ['card'],
      mode: '',
      customer_email: user.email,
      success_url: `${process.env.APP_BASE_URL || 'https://miky.ai'}/pricing?success=true&session_id={CHECKOUT_SESSION_ID}`,
      cancel_url: `${process.env.APP_BASE_URL || 'https://miky.ai'}/pricing?canceled=true`,
      metadata: {
        userId: user.id,
        type: credits ? 'credits' : 'subscription'
      }
    }

    if (credits) {
      // Credits purchase - one-time payment
      const creditsAmount = parseInt(credits)
      const price = Math.round(creditsAmount * 0.019 * 100) // 0.019 per credit in cents

      sessionData.mode = 'payment'
      sessionData.line_items = [{
        price_data: {
          currency: 'usd',
          product_data: {
            name: `${creditsAmount.toLocaleString()} Miky Credits`,
            description: `Add ${creditsAmount.toLocaleString()} credits to your account`
          },
          unit_amount: price
        },
        quantity: 1
      }]
      sessionData.metadata.credits = creditsAmount

    } else {
      // Subscription plan
      sessionData.mode = 'subscription'

      let priceId = ''
      switch (planName?.toLowerCase()) {
        case 'plus':
          priceId = process.env.STRIPE_PRICE_PLUS!
          break
        case 'pro':
          priceId = process.env.STRIPE_PRICE_PRO!
          break
        default:
          return NextResponse.json({ error: 'Invalid plan' }, { status: 400 })
      }

      sessionData.line_items = [{
        price: priceId,
        quantity: 1
      }]
      sessionData.metadata.planName = planName

      // If customer already has a subscription, handle upgrade/downgrade
      if (profile?.stripe_customer_id) {
        sessionData.customer = profile.stripe_customer_id
      }
    }

    console.log('🔥 Creating Stripe checkout session:', sessionData)

    const session = await stripe.checkout.sessions.create(sessionData)

    console.log('🔥 Stripe session created:', session.id)

    return NextResponse.json({
      success: true,
      sessionId: session.id,
      checkoutUrl: session.url
    })

  } catch (error) {
    console.error('🚨 Stripe checkout error:', error)
    return NextResponse.json({
      error: `Checkout error: ${error instanceof Error ? error.message : 'Unknown error'}`
    }, { status: 500 })
  }
}
