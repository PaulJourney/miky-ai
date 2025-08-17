import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { userId, email, paypalEmail, amount, userStats } = body

    // Validate required fields
    if (!userId || !email || !paypalEmail || !amount) {
      return NextResponse.json({
        error: 'Missing required fields'
      }, { status: 400 })
    }

    // Validate amount
    if (amount < 25) {
      return NextResponse.json({
        error: 'Minimum withdrawal amount is $25'
      }, { status: 400 })
    }

    console.log('🔥 Processing withdrawal request:', { userId, email, amount, paypalEmail })

    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('📧 SendGrid not configured, simulating withdrawal request')
      return NextResponse.json({
        success: true,
        message: 'Withdrawal request submitted successfully (simulated)',
        data: { userId, email, amount, paypalEmail }
      })
    }

    // Email to support
    const supportEmail = {
      to: process.env.SMTP_FROM || 'support@miky.ai',
      from: process.env.SMTP_FROM || 'support@miky.ai',
      subject: `💰 Withdrawal Request - $${amount} - ${email}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Withdrawal Request</h2>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e293b;">Request Details</h3>
            <p><strong>User ID:</strong> ${userId}</p>
            <p><strong>User Email:</strong> ${email}</p>
            <p><strong>PayPal Email:</strong> ${paypalEmail}</p>
            <p><strong>Amount:</strong> $${amount}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e293b;">User Statistics</h3>
            <p><strong>Total Earnings:</strong> $${userStats?.totalEarnings || 0}</p>
            <p><strong>Available for Withdrawal:</strong> $${userStats?.availableForWithdraw || 0}</p>
            <p><strong>Total Referrals:</strong> ${userStats?.totalReferrals || 0}</p>
            <p><strong>This Month Earnings:</strong> $${userStats?.thisMonthEarnings || 0}</p>
          </div>

          <div style="background: #fef3c7; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #92400e;">Action Required</h3>
            <p style="margin: 0; color: #92400e;">Please process this withdrawal request via PayPal and confirm completion to the user.</p>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
            <p>This withdrawal request was generated automatically from Miky.ai referral dashboard.</p>
          </div>
        </div>
      `,
      text: `
New Withdrawal Request

User Details:
- User ID: ${userId}
- Email: ${email}
- PayPal Email: ${paypalEmail}
- Amount: $${amount}
- Date: ${new Date().toLocaleString()}

User Statistics:
- Total Earnings: $${userStats?.totalEarnings || 0}
- Available for Withdrawal: $${userStats?.availableForWithdraw || 0}
- Total Referrals: ${userStats?.totalReferrals || 0}
- This Month Earnings: $${userStats?.thisMonthEarnings || 0}

ACTION REQUIRED: Please process this withdrawal request via PayPal.

---
Generated automatically from Miky.ai referral dashboard.
      `
    }

    // Confirmation email to user
    const userEmail = {
      to: email,
      from: process.env.SMTP_FROM || 'support@miky.ai',
      subject: 'Withdrawal Request Confirmed - Miky.ai',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Withdrawal Request Confirmed</h2>

          <p>Hi there,</p>

          <p>We've received your withdrawal request and it's being processed by our team.</p>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e293b;">Request Summary</h3>
            <p><strong>Amount:</strong> $${amount}</p>
            <p><strong>PayPal Email:</strong> ${paypalEmail}</p>
            <p><strong>Request Date:</strong> ${new Date().toLocaleDateString()}</p>
            <p><strong>Status:</strong> <span style="color: #f59e0b;">Processing</span></p>
          </div>

          <div style="background: #ecfdf5; padding: 20px; border-radius: 8px; margin: 20px 0; border-left: 4px solid #10b981;">
            <h3 style="margin: 0 0 15px 0; color: #065f46;">What's Next?</h3>
            <ul style="margin: 0; color: #065f46;">
              <li>Our team will process your request within 1-2 business days</li>
              <li>You'll receive an email confirmation when payment is sent</li>
              <li>PayPal transfers typically take 1-3 business days to complete</li>
              <li>You can track your earnings anytime in your referral dashboard</li>
            </ul>
          </div>

          <p>Thanks for being part of the Miky.ai community!</p>

          <p>Best regards,<br>The Miky.ai Team</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
            <p>This is an automated confirmation email from Miky.ai</p>
          </div>
        </div>
      `
    }

    // Send support email
    await sgMail.send(supportEmail)
    console.log('📧 Support notification email sent')

    // Send user confirmation email
    try {
      await sgMail.send(userEmail)
      console.log('📧 User confirmation email sent')
    } catch (confirmError) {
      console.warn('⚠️ Failed to send user confirmation email:', confirmError)
      // Don't fail the main request if confirmation email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Withdrawal request submitted successfully! You\'ll receive a confirmation email shortly.'
    })

  } catch (error) {
    console.error('🚨 Withdrawal request API error:', error)

    let errorMessage = 'Failed to process withdrawal request'

    if (error && typeof error === 'object' && 'response' in error) {
      const sgError = error as any
      errorMessage = `Email service error: ${sgError.response?.body?.errors?.[0]?.message || 'Unknown error'}`
    } else if (error instanceof Error) {
      errorMessage = `Service error: ${error.message}`
    }

    return NextResponse.json({
      error: errorMessage
    }, { status: 500 })
  }
}
