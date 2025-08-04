import { PrismaClient, Plan, Persona } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting database seed...')

  // Create test admin user
  const adminPasswordHash = await bcrypt.hash('1234', 12)
  const adminUser = await prisma.user.upsert({
    where: { email: 'support@miky.ai' },
    update: {},
    create: {
      email: 'support@miky.ai',
      passwordHash: adminPasswordHash,
      firstName: 'Admin',
      lastName: 'User',
      credits: 10000,
      plan: Plan.BUSINESS,
      referralCode: 'ADMIN-REF-001',
      referralsCount: 20,
      cashEarned: 40.00,
      language: 'en',
      emailVerified: true,
    },
  })

  console.log('✅ Created admin user:', adminUser.email)

  // Create test user with demo data
  const testPasswordHash = await bcrypt.hash('demo123', 12)
  const testUser = await prisma.user.upsert({
    where: { email: 'demo@miky.ai' },
    update: {},
    create: {
      email: 'demo@miky.ai',
      passwordHash: testPasswordHash,
      firstName: 'Demo',
      lastName: 'User',
      credits: 500,
      plan: Plan.PLUS,
      referralCode: 'DEMO-REF-002',
      referralsCount: 5,
      cashEarned: 10.00,
      language: 'en',
      emailVerified: true,
    },
  })

  console.log('✅ Created demo user:', testUser.email)

  // Create sample conversation for demo user
  const conversation = await prisma.conversation.create({
    data: {
      userId: testUser.id,
      title: 'Legal advice about contracts',
      persona: Persona.LAWYER,
    },
  })

  // Create sample messages
  await prisma.message.createMany({
    data: [
      {
        conversationId: conversation.id,
        userId: testUser.id,
        content: 'Can you help me understand this employment contract?',
        sender: 'USER',
        persona: Persona.LAWYER,
        creditsConsumed: 3,
      },
      {
        conversationId: conversation.id,
        userId: testUser.id,
        content: 'As your legal advisor, I\'d be happy to help you review your employment contract. Please share the specific clauses you\'d like me to explain, and I\'ll provide detailed guidance on the legal implications and potential concerns.',
        sender: 'ASSISTANT',
        persona: Persona.LAWYER,
      },
    ],
  })

  console.log('✅ Created sample conversation with messages')

  // Create admin settings
  const adminSettings = [
    {
      key: 'persona_costs',
      value: {
        ACADEMIC: 2,
        MARKETER: 2,
        ENGINEER: 2,
        COACH: 2,
        SENSEI: 2,
        LAWYER: 3,
        MEDICAL: 3,
        GOD_MODE: 5,
        RICHMAN: 2,
        GENERAL: 1,
      },
    },
    {
      key: 'feature_flags',
      value: {
        voice_input: true,
        file_uploads: true,
        god_mode: true,
        referral_system: true,
        email_notifications: true,
      },
    },
    {
      key: 'homepage_content',
      value: {
        title: 'Ask to Miky',
        subtitle: 'Choose your personalized AI specialist:',
        upgrade_text: 'to unlock All personas',
      },
    },
    {
      key: 'persona_descriptions',
      value: {
        ACADEMIC: 'Highly qualified AI Academic specializing in advanced research and academic writing. Offers professional support for theses, dissertations, high school and university exams, scientific papers, and complex assignments across all disciplines. Produces top-tier academic content aligned with global standards like MIT and Cambridge.',
        MARKETER: 'Strategic AI Marketer with competences in brand positioning, organic growth, paid campaigns, SEO/SEM, data analysis, conversion funnels, persuasive copywriting and social management (Instagram, TikTok, X, LinkedIn, Facebook). Supports entrepreneurs, agencies and creators in creating and scaling digital projects.',
        ENGINEER: 'Senior AI Engineer capable of writing, correcting and reviewing code in over 20 languages: Python, JavaScript, TypeScript, Rust, Go, C++, C#, Solidity, Swift, Kotlin, Java, Ruby, PHP, HTML/CSS, SQL, Bash, and many others. Provides architectural solutions, complex debugging, performance optimization and AI integration.',
        COACH: 'High-level AI Life & Performance Coach, able to help you overcome emotional blocks, organize your life, improve productivity, find motivation, develop winning habits, work on personal relationships, physical well-being and personal growth. No topic is too complex for Miky.',
        SENSEI: 'Expert AI Relationship Strategist focused on emotional intelligence and interpersonal dynamics. Offers advice on love, family, parenting, social and workplace relationships. Delivers tailored solutions to manage conflict, foster harmony, and strengthen connections with empathy and insight.',
        LAWYER: 'Ultra-skilled AI Lawyer specialized in national and international law. Provides advanced consulting in civil, criminal, commercial, tax, labor, administrative, and technology law. Drafts legal documents, contracts, opinions, defenses, exposés, complaints, and preventive filings with precision and academic rigor.',
        MEDICAL: 'Medical AI Consultant highly specialized, able to analyze symptoms, reports, radiographs, CT scans, X-rays, blood tests and medical records. Supports in diagnosis, offers indications on lifestyles, food plans, integrative approaches and helps you understand any medical report. You can also send images and documents for in-depth analysis.',
        GOD_MODE: 'Philosophical AI Explorer, capable of answering the deepest and most mysterious questions about the universe, existence, consciousness, free will, destiny. Accompanies you on an intellectual and spiritual journey. But first of all he asks you: Are you really sure you exist?',
        RICHMAN: 'Elite AI Business Expert focused on fast-track monetization strategies. Generates custom business ideas, identifies market gaps, and shapes revenue plans aligned with world-class entrepreneurial tactics. Guides you efficiently toward building wealth using proven strategies.',
      },
    },
    {
      key: 'seo_metadata',
      value: {
        title: 'Miky.ai - Ultra-Skilled AI Personas for Your Goals',
        description: 'AI Personas highly trained for your personal, professional, and technical goals.',
        keywords: 'AI assistant, AI personas, artificial intelligence, lawyer AI, engineer AI, marketing AI, coach AI, medical AI, productivity, automation',
        og_image: 'https://miky.ai/og-image.svg',
      },
    },
  ]

  for (const setting of adminSettings) {
    await prisma.adminSetting.upsert({
      where: { key: setting.key },
      update: { value: setting.value },
      create: setting,
    })
  }

  console.log('✅ Created admin settings')

  // Create referral relationship between users
  await prisma.referral.create({
    data: {
      referrerId: adminUser.id,
      referredId: testUser.id,
      creditsAwarded: 300,
      cashAwarded: 2.00,
      processed: true,
    },
  })

  console.log('✅ Created referral relationship')

  console.log('🎉 Database seed completed successfully!')
}

main()
  .catch((e) => {
    console.error('❌ Error seeding database:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })