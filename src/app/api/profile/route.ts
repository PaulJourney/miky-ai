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

// GET: Fetch user profile with stats
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

    // Get profile data
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (profileError) {
      return NextResponse.json({ error: 'Profile not found' }, { status: 404 })
    }

    // Get conversation count
    const { count: conversationCount } = await supabase
      .from('conversations')
      .select('*', { count: 'exact', head: true })
      .eq('user_id', user.id)
      .eq('is_archived', false)

    // Get total messages sent by user
    const { data: userConversations } = await supabase
      .from('conversations')
      .select('id')
      .eq('user_id', user.id)

    let messageCount = 0
    if (userConversations && userConversations.length > 0) {
      const conversationIds = userConversations.map(c => c.id)
      const { count } = await supabase
        .from('messages')
        .select('*', { count: 'exact', head: true })
        .in('conversation_id', conversationIds)
        .eq('role', 'user')
      messageCount = count || 0
    }

    // Get referral count (people directly referred by this user)
    const { count: directReferrals } = await supabase
      .from('profiles')
      .select('*', { count: 'exact', head: true })
      .eq('referred_by', profile.referral_code)

    // Get network size (all levels)
    const { data: networkData } = await supabase
      .from('profiles')
      .select('id, referral_level, total_referral_earnings, referred_by')
      .or(`referred_by.eq.${profile.referral_code}`)

    // Calculate network stats
    const networkStats = {
      level1: 0,
      level2: 0,
      level3: 0,
      level4: 0,
      level5: 0,
      totalNetworkSize: networkData?.length || 0,
      totalEarnings: profile.total_referral_earnings || 0,
      pendingPayout: profile.pending_payout || 0
    }

    // Count users by level
    networkData?.forEach(user => {
      if (user.referral_level >= 1 && user.referral_level <= 5) {
        networkStats[`level${user.referral_level}` as keyof typeof networkStats] += 1
      }
    })

    return NextResponse.json({
      profile: {
        ...profile,
        email: user.email,
        email_confirmed_at: user.email_confirmed_at,
        stats: {
          conversations: conversationCount || 0,
          messages: messageCount || 0,
          directReferrals: directReferrals || 0,
          networkStats
        }
      }
    })

  } catch (error) {
    console.error('Profile GET error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// PATCH: Update user profile
export async function PATCH(request: NextRequest) {
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

    const { full_name, avatar_url, language, paypal_email } = await request.json()

    const updates: any = {
      updated_at: new Date().toISOString()
    }

    if (full_name !== undefined) updates.full_name = full_name
    if (avatar_url !== undefined) updates.avatar_url = avatar_url
    if (language !== undefined) updates.language = language
    if (paypal_email !== undefined) updates.paypal_email = paypal_email

    const { data: profile, error } = await supabase
      .from('profiles')
      .update(updates)
      .eq('id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating profile:', error)
      return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 })
    }

    return NextResponse.json({ profile })

  } catch (error) {
    console.error('Profile PATCH error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}

// DELETE: Delete user account
export async function DELETE(request: NextRequest) {
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

    // Delete user data in order (conversations will cascade delete messages)
    await supabase.from('conversations').delete().eq('user_id', user.id)
    await supabase.from('usage_logs').delete().eq('user_id', user.id)
    await supabase.from('transactions').delete().eq('user_id', user.id)
    await supabase.from('referral_commissions').delete().eq('referrer_id', user.id)
    await supabase.from('profiles').delete().eq('id', user.id)

    // Delete auth user
    const { error: deleteError } = await supabase.auth.admin.deleteUser(user.id)

    if (deleteError) {
      console.error('Error deleting user:', deleteError)
      return NextResponse.json({ error: 'Failed to delete account' }, { status: 500 })
    }

    return NextResponse.json({ success: true })

  } catch (error) {
    console.error('Profile DELETE error:', error)
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 })
  }
}
