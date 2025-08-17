import { NextRequest, NextResponse } from 'next/server'
import sgMail from '@sendgrid/mail'

// Initialize SendGrid
if (process.env.SENDGRID_API_KEY) {
  sgMail.setApiKey(process.env.SENDGRID_API_KEY)
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { name, email, message } = body

    // Validate required fields
    if (!name || !email || !message) {
      return NextResponse.json({
        error: 'All fields are required'
      }, { status: 400 })
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    if (!emailRegex.test(email)) {
      return NextResponse.json({
        error: 'Invalid email format'
      }, { status: 400 })
    }

    console.log('🔥 Processing contact form submission from:', email)

    // Check if SendGrid is configured
    if (!process.env.SENDGRID_API_KEY) {
      console.log('📧 SendGrid not configured, simulating email send')

      // Simulate email sending for development
      return NextResponse.json({
        success: true,
        message: 'Message sent successfully (simulated)',
        data: { name, email, messageLength: message.length }
      })
    }

    // Prepare email content
    const emailContent = {
      to: process.env.SMTP_FROM || 'support@miky.ai',
      from: process.env.SMTP_FROM || 'support@miky.ai',
      subject: `New Contact Form Message from ${name}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e293b;">Contact Details</h3>
            <p><strong>Name:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin: 0 0 15px 0; color: #1e293b;">Message</h3>
            <div style="white-space: pre-wrap; line-height: 1.6;">${message}</div>
          </div>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
            <p>This message was sent via the Miky.ai contact form.</p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

From: ${name} (${email})
Date: ${new Date().toLocaleString()}

Message:
${message}

---
This message was sent via the Miky.ai contact form.
      `
    }

    // Send email via SendGrid
    await sgMail.send(emailContent)

    console.log('📧 Contact email sent successfully to support')

    // Optional: Send confirmation email to user
    const confirmationEmail = {
      to: email,
      from: process.env.SMTP_FROM || 'support@miky.ai',
      subject: 'Thank you for contacting Miky.ai',
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank you for contacting us!</h2>

          <p>Hi ${name},</p>

          <p>We've received your message and our team will get back to you shortly. Here's a copy of what you sent:</p>

          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <div style="white-space: pre-wrap; line-height: 1.6; color: #64748b;">${message}</div>
          </div>

          <p>We typically respond within 24 hours during business days.</p>

          <p>Best regards,<br>The Miky.ai Team</p>

          <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; color: #64748b; font-size: 12px;">
            <p>This is an automated confirmation email from Miky.ai</p>
          </div>
        </div>
      `
    }

    try {
      await sgMail.send(confirmationEmail)
      console.log('📧 Confirmation email sent to user')
    } catch (confirmError) {
      console.warn('⚠️ Failed to send confirmation email to user:', confirmError)
      // Don't fail the main request if confirmation email fails
    }

    return NextResponse.json({
      success: true,
      message: 'Message sent successfully! Our team will get back to you shortly.'
    })

  } catch (error) {
    console.error('🚨 Contact API error:', error)

    let errorMessage = 'Failed to send message'

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
