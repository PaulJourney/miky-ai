import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2025-07-30.basil',
  typescript: true,
})

export const STRIPE_PLANS = {
  free: {
    name: 'Free',
    credits: 100,
    price: 0,
    priceId: '', // Will be populated by setup script
  },
  plus: {
    name: 'Plus',
    credits: 1000,
    price: 15,
    priceId: '', // Will be populated by setup script
  },
  pro: {
    name: 'Pro',
    credits: 5000,
    price: 45,
    priceId: '', // Will be populated by setup script
  },
} as const

export type StripePlan = keyof typeof STRIPE_PLANS

// Referral commission structure
export const REFERRAL_COMMISSIONS = {
  plus: {
    total: 5,
    levels: {
      1: 2.0,
      2: 1.5,
      3: 0.8,
      4: 0.5,
      5: 0.2,
    }
  },
  pro: {
    total: 15,
    levels: {
      1: 6.0,
      2: 4.0,
      3: 2.4,
      4: 1.2,
      5: 1.0,
    }
  }
} as const

export async function createStripeProducts() {
  try {
    console.log('Creating Stripe products...')

    // Create Plus product
    const plusProduct = await stripe.products.create({
      name: 'Miky.ai Plus',
      description: '1,000 monthly credits to harness AI power while cleaning the ocean',
      metadata: {
        plan: 'plus',
        credits: '1000'
      }
    })

    const plusPrice = await stripe.prices.create({
      product: plusProduct.id,
      unit_amount: 1500, // $15.00
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'plus'
      }
    })

    // Create Pro product
    const proProduct = await stripe.products.create({
      name: 'Miky.ai Pro',
      description: '5,000 monthly credits to harness AI power while cleaning the ocean',
      metadata: {
        plan: 'pro',
        credits: '5000'
      }
    })

    const proPrice = await stripe.prices.create({
      product: proProduct.id,
      unit_amount: 4500, // $45.00
      currency: 'usd',
      recurring: {
        interval: 'month'
      },
      metadata: {
        plan: 'pro'
      }
    })

    return {
      plus: {
        productId: plusProduct.id,
        priceId: plusPrice.id
      },
      pro: {
        productId: proProduct.id,
        priceId: proPrice.id
      }
    }
  } catch (error) {
    console.error('Error creating Stripe products:', error)
    throw error
  }
}

export function getCheckoutUrl(priceId: string, customerEmail?: string, referralCode?: string) {
  const params = new URLSearchParams({
    'price': priceId,
    'mode': 'subscription',
    'success_url': `${process.env.APP_BASE_URL}/dashboard?session_id={CHECKOUT_SESSION_ID}`,
    'cancel_url': `${process.env.APP_BASE_URL}/pricing`,
  })

  if (customerEmail) {
    params.append('prefilled_email', customerEmail)
  }

  if (referralCode) {
    params.append('client_reference_id', referralCode)
  }

  return `https://checkout.stripe.com/pay/${params.toString()}`
}
