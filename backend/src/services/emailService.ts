import nodemailer from 'nodemailer';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
}

class EmailService {
  private transporter: nodemailer.Transporter;

  constructor() {
    this.transporter = nodemailer.createTransporter({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
  }

  async sendEmail(options: EmailOptions): Promise<boolean> {
    try {
      await this.transporter.sendMail({
        from: process.env.EMAIL_FROM || 'noreply@miky.ai',
        to: options.to,
        subject: options.subject,
        html: options.html,
      });
      return true;
    } catch (error) {
      console.error('Email sending failed:', error);
      return false;
    }
  }

  async sendVerificationEmail(email: string, token: string): Promise<boolean> {
    const verificationUrl = `${process.env.FRONTEND_URL}/verify-email?token=${token}`;
    
    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
        <div style="text-align: center; padding: 40px 0;">
          <h1 style="color: #7FFF00; font-size: 32px; margin-bottom: 10px;">Miky.ai</h1>
          <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 30px;">Verify Your Email</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #cccccc;">
            Welcome to Miky.ai! Please verify your email address to activate your account and start using our ultra-skilled AI personas.
          </p>
          
          <a href="${verificationUrl}" style="background-color: #7FFF00; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin-bottom: 30px;">
            Verify Email Address
          </a>
          
          <p style="font-size: 14px; color: #666666; margin-top: 30px;">
            If you didn't create an account with Miky.ai, you can safely ignore this email.
          </p>
          
          <p style="font-size: 12px; color: #666666; margin-top: 40px; border-top: 1px solid #333333; padding-top: 20px;">
            © 2025 Miky.ai - Ultra‑Skilled AI Personas<br>
            Neuronica Srl, Via del Serrone 62, 47890 Repubblica di San Marino
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Verify your Miky.ai account',
      html
    });
  }

  async sendPasswordResetEmail(email: string, resetCode: string): Promise<boolean> {
    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
        <div style="text-align: center; padding: 40px 0;">
          <h1 style="color: #7FFF00; font-size: 32px; margin-bottom: 10px;">Miky.ai</h1>
          <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 30px;">Reset Your Password</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #cccccc;">
            You requested a password reset for your Miky.ai account. Use the code below to reset your password:
          </p>
          
          <div style="background-color: #1a1a1a; border: 2px solid #7FFF00; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
            <span style="font-size: 28px; font-weight: bold; color: #7FFF00; letter-spacing: 3px;">${resetCode}</span>
          </div>
          
          <p style="font-size: 14px; color: #666666; margin-top: 30px;">
            This code will expire in 1 hour. If you didn't request a password reset, you can safely ignore this email.
          </p>
          
          <p style="font-size: 12px; color: #666666; margin-top: 40px; border-top: 1px solid #333333; padding-top: 20px;">
            © 2025 Miky.ai - Ultra‑Skilled AI Personas<br>
            Neuronica Srl, Via del Serrone 62, 47890 Repubblica di San Marino
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Reset your Miky.ai password',
      html
    });
  }

  async sendWelcomeEmail(email: string, firstName?: string): Promise<boolean> {
    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 600px; margin: 0 auto; background-color: #0a0a0a; color: #ffffff; padding: 20px;">
        <div style="text-align: center; padding: 40px 0;">
          <h1 style="color: #7FFF00; font-size: 32px; margin-bottom: 10px;">Miky.ai</h1>
          <h2 style="color: #ffffff; font-size: 24px; margin-bottom: 30px;">Welcome${firstName ? `, ${firstName}` : ''}!</h2>
          
          <p style="font-size: 16px; line-height: 1.6; margin-bottom: 30px; color: #cccccc;">
            🎉 Your account is now active! You've joined the future of AI assistance with ultra-skilled AI personas ready to help you achieve your goals.
          </p>
          
          <div style="background-color: #1a1a1a; border: 1px solid #333333; padding: 20px; border-radius: 8px; margin-bottom: 30px; text-align: left;">
            <h3 style="color: #7FFF00; margin-bottom: 15px;">What's included in your Free plan:</h3>
            <ul style="color: #cccccc; line-height: 1.8;">
              <li>100 credits per month</li>
              <li>Access to 5 specialized AI personas</li>
              <li>Text input and conversation history</li>
              <li>Community support</li>
            </ul>
          </div>
          
          <a href="${process.env.FRONTEND_URL}" style="background-color: #7FFF00; color: #000000; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; display: inline-block; margin-bottom: 30px;">
            Start Chatting Now
          </a>
          
          <p style="font-size: 14px; color: #666666; margin-top: 30px;">
            Need help getting started? Check out our tutorials or contact support at support@miky.ai
          </p>
          
          <p style="font-size: 12px; color: #666666; margin-top: 40px; border-top: 1px solid #333333; padding-top: 20px;">
            © 2025 Miky.ai - Ultra‑Skilled AI Personas<br>
            Neuronica Srl, Via del Serrone 62, 47890 Repubblica di San Marino
          </p>
        </div>
      </div>
    `;

    return this.sendEmail({
      to: email,
      subject: 'Welcome to Miky.ai - Your AI personas are ready!',
      html
    });
  }
}

export const emailService = new EmailService();