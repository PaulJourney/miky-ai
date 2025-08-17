import sgMail from '@sendgrid/mail'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

const FROM_EMAIL = process.env.SMTP_FROM || 'support@miky.ai'
const APP_NAME = 'Miky.ai'
const APP_URL = process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : (process.env.APP_BASE_URL || 'https://miky.ai')

// Send email verification
export async function sendVerificationEmail(email: string, fullName: string, verificationToken?: string) {
  try {
    const msg = {
      to: email,
      from: FROM_EMAIL,
      subject: `Welcome to ${APP_NAME} - Please verify your email`,
      tracking_settings: {
        click_tracking: {
          enable: false
        }
      },
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Welcome to ${APP_NAME}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #0f172a; color: #e2e8f0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: bold; color: #3b82f6; margin-bottom: 20px; }
            .content { background-color: #1e293b; border-radius: 12px; padding: 40px; }
            .button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .footer { text-align: center; margin-top: 40px; font-size: 14px; color: #64748b; }
            .water-badge { background-color: #0ea5e9; color: white; padding: 8px 16px; border-radius: 20px; font-size: 14px; font-weight: 600; display: inline-block; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${APP_NAME}</div>
              <h1>Welcome to the AI revolution!</h1>
            </div>

            <div class="content">
              <h2>Hi ${fullName}! 👋</h2>

              <p>Welcome to ${APP_NAME}! We're excited to have you join our community of AI enthusiasts who are making a real difference for our planet.</p>

              <div class="water-badge">🌊 Every message = 1L ocean water cleaned</div>

              <p>You've just taken the first step toward:</p>
              <ul>
                <li><strong>Professional AI assistance</strong> with our specialized personas</li>
                <li><strong>Making environmental impact</strong> with every conversation</li>
                <li><strong>Access to cutting-edge AI technology</strong> from OpenAI</li>
              </ul>

              <p>To get started, please verify your email address by clicking the button below:</p>

              <div style="text-align: center;">
                <a href="${APP_URL}/auth/verify?token=${verificationToken || 'invalid'}" class="button">
                  Verify Email Address
                </a>
              </div>

              <p>Once verified, you'll get instant access to your free credits and can start chatting with our AI specialists!</p>

              <p>Best regards,<br>The ${APP_NAME} Team</p>
            </div>

            <div class="footer">
              <p>This email was sent by ${APP_NAME}. If you didn't sign up for an account, you can safely ignore this email.</p>
              <p>${APP_URL}</p>
            </div>
          </div>
        </body>
        </html>
      `,
      text: `
        Welcome to ${APP_NAME}!

        Hi ${fullName},

        Welcome to ${APP_NAME}! We're excited to have you join our community.

        Every message you send helps clean 1 liter of ocean water!

        Please verify your email address by visiting: ${APP_URL}/auth/verify?token=${verificationToken || 'invalid'}

        Best regards,
        The ${APP_NAME} Team

        ${APP_URL}
      `
    }

    await sgMail.send(msg)
    console.log('Verification email sent to:', email)
  } catch (error) {
    console.error('Error sending verification email:', error)
    throw error
  }
}

// Send welcome email after verification
export async function sendWelcomeEmail(email: string, fullName: string, credits: number = 100) {
  try {
    const msg = {
      to: email,
      from: FROM_EMAIL,
      subject: `🎉 Your ${APP_NAME} account is ready!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Account Verified - ${APP_NAME}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #0f172a; color: #e2e8f0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: bold; color: #3b82f6; margin-bottom: 20px; }
            .content { background-color: #1e293b; border-radius: 12px; padding: 40px; }
            .button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
            .credits-badge { background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 16px; border-radius: 12px; text-align: center; margin: 20px 0; }
            .features { background-color: #334155; border-radius: 8px; padding: 20px; margin: 20px 0; }
            .feature { margin: 10px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${APP_NAME}</div>
              <h1>🎉 You're all set!</h1>
            </div>

            <div class="content">
              <h2>Congratulations ${fullName}!</h2>

              <p>Your email has been verified and your ${APP_NAME} account is now active.</p>

              <div class="credits-badge">
                <h3>💎 ${credits} Credits Added</h3>
                <p>Ready to start your AI journey!</p>
              </div>

              <div class="features">
                <h3>🚀 What you can do now:</h3>
                <div class="feature">✅ Chat with specialized AI personas</div>
                <div class="feature">✅ Upload files for analysis</div>
                <div class="feature">✅ Use voice input</div>
                <div class="feature">✅ Organize conversations in folders</div>
                <div class="feature">✅ Track your ocean impact</div>
                ${credits > 100 ? '<div class="feature">🎁 Bonus credits from referral!</div>' : ''}
              </div>

              <div style="text-align: center;">
                <a href="${APP_URL}/dashboard" class="button">
                  Start Chatting Now
                </a>
              </div>

              <p>Remember: Every message you send helps clean 1 liter of ocean water through our partnership with The Ocean Cleanup! 🌊</p>

              <p>Ready to make an impact?</p>

              <p>Best regards,<br>The ${APP_NAME} Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    await sgMail.send(msg)
    console.log('Welcome email sent to:', email)
  } catch (error) {
    console.error('Error sending welcome email:', error)
    throw error
  }
}

// Send referral bonus notification
export async function sendReferralBonusEmail(email: string, fullName: string, referrerName: string, bonusAmount: number) {
  try {
    const msg = {
      to: email,
      from: FROM_EMAIL,
      subject: `🎁 Referral bonus earned - $${bonusAmount} from ${referrerName}!`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Referral Bonus - ${APP_NAME}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #0f172a; color: #e2e8f0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: bold; color: #3b82f6; margin-bottom: 20px; }
            .content { background-color: #1e293b; border-radius: 12px; padding: 40px; }
            .bonus-badge { background: linear-gradient(135deg, #10b981, #059669); color: white; padding: 20px; border-radius: 12px; text-align: center; margin: 20px 0; }
            .button { display: inline-block; background: linear-gradient(135deg, #3b82f6, #1d4ed8); color: white; padding: 16px 32px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${APP_NAME}</div>
              <h1>🎁 Referral Bonus Earned!</h1>
            </div>

            <div class="content">
              <h2>Great news ${fullName}!</h2>

              <p>You've earned a referral bonus because <strong>${referrerName}</strong> upgraded their subscription!</p>

              <div class="bonus-badge">
                <h3>💰 $${bonusAmount} Added</h3>
                <p>Available for payout in 7 days</p>
              </div>

              <p>Your referral earnings are building up! Keep sharing your referral link to earn even more.</p>

              <div style="text-align: center;">
                <a href="${APP_URL}/dashboard/referrals" class="button">
                  View Earnings
                </a>
              </div>

              <p>Thank you for being part of the ${APP_NAME} community!</p>

              <p>Best regards,<br>The ${APP_NAME} Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    await sgMail.send(msg)
    console.log('Referral bonus email sent to:', email)
  } catch (error) {
    console.error('Error sending referral bonus email:', error)
    throw error
  }
}

// Send payout notification
export async function sendPayoutNotification(email: string, fullName: string, amount: number, paypalEmail: string) {
  try {
    const msg = {
      to: email,
      from: FROM_EMAIL,
      subject: `💸 Payout request received - $${amount}`,
      html: `
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>Payout Request - ${APP_NAME}</title>
          <style>
            body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; margin: 0; padding: 0; background-color: #0f172a; color: #e2e8f0; }
            .container { max-width: 600px; margin: 0 auto; padding: 40px 20px; }
            .header { text-align: center; margin-bottom: 40px; }
            .logo { font-size: 32px; font-weight: bold; color: #3b82f6; margin-bottom: 20px; }
            .content { background-color: #1e293b; border-radius: 12px; padding: 40px; }
            .payout-details { background-color: #334155; border-radius: 8px; padding: 20px; margin: 20px 0; }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <div class="logo">${APP_NAME}</div>
              <h1>💸 Payout Request Received</h1>
            </div>

            <div class="content">
              <h2>Hi ${fullName}!</h2>

              <p>We've received your payout request and it's being processed.</p>

              <div class="payout-details">
                <h3>Payout Details:</h3>
                <p><strong>Amount:</strong> $${amount}</p>
                <p><strong>PayPal Email:</strong> ${paypalEmail}</p>
                <p><strong>Processing Time:</strong> 2-5 business days</p>
              </div>

              <p>You'll receive another email once the payment has been sent to your PayPal account.</p>

              <p>Thank you for being part of the ${APP_NAME} referral program!</p>

              <p>Best regards,<br>The ${APP_NAME} Team</p>
            </div>
          </div>
        </body>
        </html>
      `
    }

    await sgMail.send(msg)
    console.log('Payout notification sent to:', email)
  } catch (error) {
    console.error('Error sending payout notification:', error)
    throw error
  }
}
