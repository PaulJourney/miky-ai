import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'

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

// GET: Fetch user's referral network data
export async function GET(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    // Get user profile with referral info
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get all users in the network (5 levels deep)
    const { data: networkUsers, error: networkError } = await supabase
      .from('profiles')
      .select('id, full_name, email, referral_code, referred_by, referral_level, total_referral_earnings, subscription_plan, created_at')
      .eq('referred_by', profile.referral_code)

    if (networkError) {
      console.error('Network query error:', networkError)
      return NextResponse.json({ error: 'Failed to fetch network' }, { status: 500 })
    }

    // Get referral commissions
    const { data: commissions, error: commissionsError } = await supabase
      .from('referral_commissions')
      .select('*')
      .eq('referrer_id', user.id)
      .order('created_at', { ascending: false })

    if (commissionsError) {
      console.error('Commissions query error:', commissionsError)
    }

    // Get payout history
    const { data: payouts, error: payoutsError } = await supabase
      .from('payouts')
      .select('*')
      .eq('user_id', user.id)
      .order('requested_at', { ascending: false })

    if (payoutsError) {
      console.error('Payouts query error:', payoutsError)
    }

    // Calculate network statistics
    const networkStats = {
      level1: { count: 0, earnings: 0, users: [] as any[] },
      level2: { count: 0, earnings: 0, users: [] as any[] },
      level3: { count: 0, earnings: 0, users: [] as any[] },
      level4: { count: 0, earnings: 0, users: [] as any[] },
      level5: { count: 0, earnings: 0, users: [] as any[] },
      totalUsers: networkUsers?.length || 0,
      totalEarnings: profile.total_referral_earnings || 0,
      pendingPayout: profile.pending_payout || 0,
      monthlyGrowth: 0,
      activeUsers: 0
    }

    // Process network users
    if (networkUsers) {
      networkUsers.forEach(user => {
        const level = user.referral_level
        if (level >= 1 && level <= 5) {
          networkStats[`level${level}` as keyof typeof networkStats].count += 1
          networkStats[`level${level}` as keyof typeof networkStats].users.push({
            id: user.id,
            name: user.full_name,
            email: user.email,
            plan: user.subscription_plan,
            joinedAt: user.created_at,
            earnings: user.total_referral_earnings || 0
          })
        }
      })
    }

    // Calculate monthly growth (simplified - users joined in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)
    const recentUsers = networkUsers?.filter(u => new Date(u.created_at) > thirtyDaysAgo) || []
    networkStats.monthlyGrowth = recentUsers.length

    // Calculate active users (users with subscription plans other than free)
    networkStats.activeUsers = networkUsers?.filter(u => u.subscription_plan !== 'free').length || 0

    // Format commission history
    const formattedCommissions = commissions?.map(comm => ({
      id: comm.id,
      amount: comm.commission_amount,
      level: comm.level,
      status: comm.status,
      date: comm.created_at,
      paidAt: comm.paid_at
    })) || []

    // Format payout history
    const formattedPayouts = payouts?.map(payout => ({
      id: payout.id,
      amount: payout.amount_usd,
      paypalEmail: payout.paypal_email,
      status: payout.status,
      requestedAt: payout.requested_at,
      processedAt: payout.processed_at,
      transactionId: payout.paypal_transaction_id
    })) || []

    // Calculate earnings timeline (last 12 months)
    const earningsTimeline = []
    for (let i = 11; i >= 0; i--) {
      const date = new Date()
      date.setMonth(date.getMonth() - i)
      const monthStart = new Date(date.getFullYear(), date.getMonth(), 1)
      const monthEnd = new Date(date.getFullYear(), date.getMonth() + 1, 0)

      const monthCommissions = commissions?.filter(c => {
        const commDate = new Date(c.created_at)
        return commDate >= monthStart && commDate <= monthEnd && c.status === 'paid'
      }) || []

      const monthEarnings = monthCommissions.reduce((sum, c) => sum + parseFloat(c.commission_amount), 0)

      earningsTimeline.push({
        month: date.toLocaleString('default', { month: 'short', year: 'numeric' }),
        earnings: monthEarnings,
        commissions: monthCommissions.length
      })
    }

    return NextResponse.json({
      networkStats,
      commissions: formattedCommissions,
      payouts: formattedPayouts,
      earningsTimeline,
      referralCode: profile.referral_code
    })

  } catch (error) {
    console.error('Network GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// POST: Request payout
export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    if (!authHeader) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError || !user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const { amount, paypalEmail } = await request.json()

    if (!amount || !paypalEmail) {
      return NextResponse.json({ error: 'Amount and PayPal email are required' }, { status: 400 })
    }

    // Get user profile
    const { data: profile } = await supabase
      .from('profiles')
      .select('total_referral_earnings, pending_payout')
      .eq('id', user.id)
      .single()

    if (!profile) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Check minimum payout amount ($25)
    if (amount < 25) {
      return NextResponse.json({ error: 'Minimum payout amount is $25' }, { status: 400 })
    }

    // Check if user has enough available earnings
    const availableEarnings = profile.total_referral_earnings - profile.pending_payout
    if (amount > availableEarnings) {
      return NextResponse.json({ error: 'Insufficient available earnings' }, { status: 400 })
    }

    // Create payout request
    const { data: payout, error: payoutError } = await supabase
      .from('payouts')
      .insert({
        user_id: user.id,
        amount_usd: amount,
        paypal_email: paypalEmail,
        status: 'pending',
        requested_at: new Date().toISOString()
      })
      .select()
      .single()

    if (payoutError) {
      console.error('Error creating payout:', payoutError)
      return NextResponse.json({ error: 'Failed to create payout request' }, { status: 500 })
    }

    // Update pending payout amount
    await supabase
      .from('profiles')
      .update({
        pending_payout: profile.pending_payout + amount,
        updated_at: new Date().toISOString()
      })
      .eq('id', user.id)

    return NextResponse.json({
      success: true,
      payout: {
        id: payout.id,
        amount: payout.amount_usd,
        status: payout.status,
        requestedAt: payout.requested_at
      }
    })

  } catch (error) {
    console.error('Network POST error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
