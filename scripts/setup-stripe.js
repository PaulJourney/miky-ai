require('dotenv').config({ path: '.env.local' })
const Stripe = require('stripe')

const stripe = new Stripe(process.env.STRIPE_SECRET_KEY, {
  apiVersion: '2024-12-18.acacia',
})

async function setupStripeProducts() {
  try {
    console.log('🔵 Setting up Stripe products in LIVE mode...')

    // Create Plus product
    console.log('Creating Plus product...')
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
    console.log('Creating Pro product...')
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

    console.log('✅ Products created successfully!')
    console.log('Plus Price ID:', plusPrice.id)
    console.log('Pro Price ID:', proPrice.id)

    console.log('\n📝 Add these to your environment variables:')
    console.log(`STRIPE_PRICE_PLUS=${plusPrice.id}`)
    console.log(`STRIPE_PRICE_PRO=${proPrice.id}`)

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
    console.error('❌ Error setting up Stripe products:', error)
    throw error
  }
}

setupStripeProducts().catch(console.error)
