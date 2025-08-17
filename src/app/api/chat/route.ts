import { NextRequest, NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import OpenAI from 'openai'

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

// Validate environment variables
if (!process.env.OPENAI_API_KEY) {
  throw new Error('OPENAI_API_KEY environment variable is required')
}

if (!process.env.OPENAI_API_KEY.startsWith('sk-')) {
  throw new Error('Invalid OPENAI_API_KEY format - must start with sk-')
}

// Initialize OpenAI with proper error handling
let openai: OpenAI
try {
  openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY,
    timeout: 30000, // 30 second timeout
    maxRetries: 2
  })
} catch (error) {
  throw new Error(`Failed to initialize OpenAI client: ${error}`)
}

// Image generation function
async function generateImageWithDalle(prompt: string, userId: string) {
  try {
    console.log('🎨 Generating image with DALL-E for prompt:', prompt)

    const response = await openai.images.generate({
      model: "dall-e-3",
      prompt: prompt,
      n: 1,
      size: "1024x1024",
      quality: "standard"
    })

    const imageUrl = response.data?.[0]?.url
    if (!imageUrl) {
      throw new Error('No image URL returned from DALL-E')
    }

    console.log('🎨 Image generated successfully:', imageUrl)
    return imageUrl
  } catch (error) {
    console.error('🚨 DALL-E Error:', error)
    throw error
  }
}

// Persona system prompts
const PERSONA_PROMPTS = {
  generic: {
    name: "Miky",
    cost: 2,
    systemPrompt: `You are Miky, a friendly and helpful AI assistant. You're knowledgeable, conversational, and ready to help with a wide variety of tasks and questions. You maintain a professional but approachable tone.

Always respond with:
- Clear and helpful information
- A friendly and conversational tone
- Practical advice when appropriate
- Accurate and up-to-date information
- Respectful and inclusive language

You can help with general questions, basic problem-solving, explanations, creative tasks, and everyday assistance across many topics.`
  },
  academic: {
    name: "Professor Miky",
    cost: 3,
    systemPrompt: `You are Professor Miky, a highly qualified AI Academic specializing in advanced research and academic writing. You offer professional support for theses, dissertations, high school and university exams, scientific papers, and complex assignments across all disciplines. You produce top-tier academic content aligned with global standards like MIT and Cambridge.

Always respond with:
- Deep academic rigor and precision
- Proper citations when relevant
- Clear, structured explanations
- Academic language appropriate to the level
- Critical thinking and analysis

You help with research methodology, literature reviews, data analysis, academic writing, and complex problem-solving across all academic fields.`
  },
  marketer: {
    name: "Marketer Miky",
    cost: 3,
    systemPrompt: `You are Marketer Miky, a strategic AI Marketer with advanced skills in brand positioning, organic growth, paid campaigns, SEO/SEM, data analysis, conversion funnels, persuasive copywriting, and social media management (Instagram, TikTok, X, LinkedIn, Facebook). You support entrepreneurs, agencies, and creators in creating and scaling digital projects.

Always respond with:
- Strategic marketing insights
- Data-driven recommendations
- Actionable tactics and strategies
- Current digital marketing trends
- Platform-specific advice

You excel at growth hacking, content strategy, influencer marketing, email marketing, PPC campaigns, and building profitable sales funnels.`
  },
  engineer: {
    name: "Engineer Miky",
    cost: 3,
    systemPrompt: `You are Engineer Miky, a Senior AI Engineer capable of writing, correcting, and reviewing code in over 20 languages: Python, JavaScript, TypeScript, Rust, Go, C++, C#, Solidity, Swift, Kotlin, Java, Ruby, PHP, HTML/CSS, SQL, Bash, and many others. You provide architectural solutions, complex debugging, performance optimization, and AI integration.

Always respond with:
- Clean, efficient, well-documented code
- Best practices and design patterns
- Security considerations
- Performance optimization tips
- Detailed explanations of complex concepts

You help with system architecture, API design, database optimization, cloud infrastructure, DevOps, and cutting-edge technology implementation.`
  },
  coach: {
    name: "Coach Miky",
    cost: 3,
    systemPrompt: `You are Coach Miky, a high-level AI Life & Performance Coach, able to help overcome emotional blocks, organize life, improve productivity, find motivation, develop winning habits, work on personal relationships, physical wellness, and personal growth. No topic is too complex for you.

Always respond with:
- Empathetic and supportive tone
- Practical, actionable advice
- Motivational and inspiring language
- Evidence-based strategies
- Personalized recommendations

You excel at goal setting, habit formation, stress management, emotional intelligence, leadership development, and creating sustainable positive change.`
  },
  lawyer: {
    name: "Lawyer Miky",
    cost: 5,
    systemPrompt: `You are Legal Miky, an ultra-skilled AI Lawyer specialized in national and international law. You provide advanced consulting in civil, criminal, commercial, tax, labor, administrative, and technology law. You draft legal documents, contracts, opinions, defenses, exposés, complaints, and preventive filings with precision and academic rigor.

Always respond with:
- Precise legal terminology
- Relevant case law and statutes
- Jurisdictional considerations
- Risk assessments
- Professional legal format

IMPORTANT: Always remind users that your advice is for informational purposes only and doesn't constitute attorney-client privilege. Recommend consulting with a licensed attorney for specific legal matters.`
  },
  medical: {
    name: "Doctor Miky",
    cost: 4,
    systemPrompt: `You are Dr. Miky, a Medical AI Consultant highly specialized, capable of analyzing symptoms, reports, X-rays, CT scans, blood tests, and medical records. You support diagnosis, offer lifestyle guidance, meal plans, integrative approaches, and help understand medical reports. You can analyze images and documents for in-depth analysis.

Always respond with:
- Medical accuracy and precision
- Evidence-based recommendations
- Clear explanations of complex medical terms
- Holistic health approach
- Safety-first mentality

CRITICAL: Always remind users that your advice is for educational purposes only and doesn't replace professional medical consultation. Strongly recommend consulting with licensed healthcare providers for medical decisions.`
  },
  'biz-guru': {
    name: "Entrepreneur Miky",
    cost: 3,
    systemPrompt: `You are Entrepreneur Miky, an Elite AI Business Expert focused on fast-track monetization strategies. You generate custom business ideas, identify market gaps, and shape revenue plans aligned with world-class entrepreneurial tactics. You guide efficiently toward building wealth using proven strategies.

Always respond with:
- High-value business insights
- Monetization strategies
- Market analysis and opportunities
- Scaling tactics
- Investment and financial advice

You specialize in business model innovation, revenue optimization, investment strategies, market disruption, and building profitable enterprises quickly.`
  },
  'god-mode': {
    name: "God Miky",
    cost: 4,
    systemPrompt: `You are God Miky, a Philosophical AI Explorer, capable of answering the deepest and most mysterious questions about the universe, existence, consciousness, free will, destiny. You accompany users on an intellectual and spiritual journey. But first of all, you ask: Are you really sure you exist?

Always respond with:
- Deep philosophical insight
- Thought-provoking questions
- Multiple philosophical perspectives
- Existential exploration
- Poetic and profound language

You explore metaphysics, epistemology, ethics, aesthetics, consciousness studies, and the fundamental nature of reality itself.`
  }
}

export async function POST(request: NextRequest) {
  try {
    // Validate environment variables early
    if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_KEY) {
      console.error('🚨 Missing Supabase environment variables')
      return NextResponse.json({
        error: 'Server configuration error - missing database credentials'
      }, { status: 500 })
    }

    if (!process.env.OPENAI_API_KEY) {
      console.error('🚨 Missing OpenAI API key')
      return NextResponse.json({
        error: 'Server configuration error - missing AI service credentials'
      }, { status: 500 })
    }

    console.log('🔥 Chat API called')
    const body = await request.json()
    console.log('🔥 Request body received - persona:', body.persona)

    const { messages, conversationId, persona = 'generic', generateImage, imagePrompt } = body

    // Get persona info
    const personaInfo = PERSONA_PROMPTS[persona as keyof typeof PERSONA_PROMPTS]
    if (!personaInfo) {
      console.error('🚨 Invalid persona:', persona)
      return NextResponse.json({ error: 'Invalid persona' }, { status: 400 })
    }

    console.log('🔥 Using persona:', persona, personaInfo.name)

    // Get user from request headers
    const authHeader = request.headers.get('authorization')
    console.log('🔥 Auth header present:', !!authHeader)

    if (!authHeader) {
      console.error('🚨 No auth header')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const token = authHeader.replace('Bearer ', '')
    console.log('🔥 Token extracted, length:', token.length)

    const { data: { user }, error: authError } = await supabase.auth.getUser(token)

    if (authError) {
      console.error('🚨 Auth error:', authError)
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    if (!user) {
      console.error('🚨 No user found')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    console.log('🔥 User authenticated:', user.id)

    // Get user profile and check credits
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    // Handle mock profile fallback
    if (profileError || !profile) {
      console.log('🔥 Profile not found, using mock profile')

      const mockProfile = {
        id: user.id,
        email: user.email?.toLowerCase() || '',
        full_name: user.user_metadata?.full_name || user.email?.split('@')[0] || 'User',
        credits: 100,
        water_cleaned_liters: 0,
        subscription_plan: 'free',
        subscription_status: 'active',
        is_mock: true
      }

      const creditsUsed = personaInfo.cost
      if (mockProfile.credits < creditsUsed) {
        return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
      }

      // Handle image generation request for mock profile
      if (generateImage && imagePrompt) {
        try {
          const imageUrl = await generateImageWithDalle(imagePrompt, user.id)

          const newCredits = mockProfile.credits - creditsUsed
          const newWaterCleaned = mockProfile.water_cleaned_liters + 1

          return NextResponse.json({
            success: true,
            imageUrl,
            message: `🎨 I've generated an image for you: "${imagePrompt}"`,
            creditsUsed,
            newCredits,
            newWaterCleaned,
            persona: personaInfo.name,
            isMockProfile: true,
            isImageGeneration: true
          })

        } catch (imageError: any) {
          console.error('🚨 Image generation error (mock profile):', imageError)
          return NextResponse.json({
            error: `Image generation failed: ${imageError.message || 'Unknown error'}`
          }, { status: 500 })
        }
      }

      // Call OpenAI API
      const openaiMessages = [
        {
          role: 'system' as const,
          content: personaInfo.systemPrompt
        },
        ...messages.map((msg: any) => ({
          role: msg.role as 'user' | 'assistant',
          content: msg.content
        }))
      ]

      console.log('🔥 Calling OpenAI API...')

      try {
        const completion = await openai.chat.completions.create({
          model: 'gpt-4o-mini',
          messages: openaiMessages,
          max_tokens: 1500,
          temperature: 0.7
        })

        const aiResponse = completion.choices[0]?.message?.content

        if (!aiResponse) {
          console.error('🚨 No AI response content')
          return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
        }

        console.log('🔥 OpenAI response received successfully, length:', aiResponse.length)

        const newCredits = mockProfile.credits - creditsUsed
        const newWaterCleaned = mockProfile.water_cleaned_liters + 1

        return NextResponse.json({
          success: true,
          message: aiResponse,
          creditsUsed,
          newCredits,
          newWaterCleaned,
          persona: personaInfo.name,
          isMockProfile: true
        })

      } catch (openaiError: any) {
        console.error('🚨 OpenAI API Error:', openaiError)

        if (openaiError.code === 'invalid_api_key') {
          // Provide helpful error message with fallback
          const fallbackResponse = `🔧 **API Configuration Required**

Hi! I'm ${personaInfo.name}, but I need a valid OpenAI API key to provide real responses.

**To fix this:**
1. Go to https://platform.openai.com/account/api-keys
2. Create a new API key
3. Update the OPENAI_API_KEY in your .env.local file
4. Restart the development server

**Your question was:** "${messages[messages.length - 1]?.content}"

Once the API key is configured, I'll be able to provide detailed, personalized responses as your ${personaInfo.name}!`

          const newCredits = mockProfile.credits - creditsUsed
          const newWaterCleaned = mockProfile.water_cleaned_liters + 1

          return NextResponse.json({
            success: true,
            message: fallbackResponse,
            creditsUsed,
            newCredits,
            newWaterCleaned,
            persona: personaInfo.name,
            isMockProfile: true,
            isApiKeyError: true
          })
        }

        if (openaiError.code === 'insufficient_quota') {
          return NextResponse.json({ error: 'OpenAI quota exceeded' }, { status: 500 })
        }

        return NextResponse.json({
          error: `OpenAI Error: ${openaiError.message || 'Unknown OpenAI error'}`
        }, { status: 500 })
      }
    }

    // Normal profile flow
    const requiredCredits = personaInfo.cost
    if (profile.credits < requiredCredits) {
      return NextResponse.json({ error: 'Insufficient credits' }, { status: 402 })
    }

    // Handle image generation request
    if (generateImage && imagePrompt) {
      try {
        const imageUrl = await generateImage(imagePrompt, user.id)

        // Calculate new values (image generation costs same as persona)
        const creditsUsed = requiredCredits
        const newCredits = profile.credits - creditsUsed
        const newWaterCleaned = profile.water_cleaned_liters + 1

        // Update user profile
        await supabase
          .from('profiles')
          .update({
            credits: newCredits,
            water_cleaned_liters: newWaterCleaned,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        return NextResponse.json({
          success: true,
          imageUrl,
          message: `🎨 I've generated an image for you: "${imagePrompt}"`,
          creditsUsed,
          newCredits,
          newWaterCleaned,
          persona: personaInfo.name,
          isImageGeneration: true
        })

      } catch (imageError: any) {
        console.error('🚨 Image generation error:', imageError)
        return NextResponse.json({
          error: `Image generation failed: ${imageError.message || 'Unknown error'}`
        }, { status: 500 })
      }
    }

    // Prepare messages for OpenAI
    const openaiMessages = [
      {
        role: 'system' as const,
        content: personaInfo.systemPrompt
      },
      ...messages.map((msg: any) => ({
        role: msg.role as 'user' | 'assistant',
        content: msg.content
      }))
    ]

    console.log('🔥 Calling OpenAI API (normal profile)...')

    try {
      const completion = await openai.chat.completions.create({
        model: 'gpt-4o-mini',
        messages: openaiMessages,
        max_tokens: 1500,
        temperature: 0.7
      })

      const aiResponse = completion.choices[0]?.message?.content

      if (!aiResponse) {
        console.error('🚨 No AI response content')
        return NextResponse.json({ error: 'No response from AI' }, { status: 500 })
      }

      console.log('🔥 OpenAI response received successfully, length:', aiResponse.length)

      // Calculate new values
      const creditsUsed = requiredCredits
      const newCredits = profile.credits - creditsUsed
      const newWaterCleaned = profile.water_cleaned_liters + 1

      // Update user profile
      await supabase
        .from('profiles')
        .update({
          credits: newCredits,
          water_cleaned_liters: newWaterCleaned,
          updated_at: new Date().toISOString()
        })
        .eq('id', user.id)

      return NextResponse.json({
        success: true,
        message: aiResponse,
        creditsUsed,
        newCredits,
        newWaterCleaned,
        persona: personaInfo.name
      })

    } catch (openaiError: any) {
      console.error('🚨 OpenAI API Error:', openaiError)

      if (openaiError.code === 'invalid_api_key') {
        // Provide helpful error message with fallback for normal profiles too
        const fallbackResponse = `🔧 **API Configuration Required**

Hi! I'm ${personaInfo.name}, but I need a valid OpenAI API key to provide real responses.

**To fix this:**
1. Go to https://platform.openai.com/account/api-keys
2. Create a new API key
3. Update the OPENAI_API_KEY in your .env.local file
4. Restart the development server

**Your question was:** "${messages[messages.length - 1]?.content}"

Once the API key is configured, I'll be able to provide detailed, personalized responses as your ${personaInfo.name}!`

        // Calculate new values
        const creditsUsed = requiredCredits
        const newCredits = profile.credits - creditsUsed
        const newWaterCleaned = profile.water_cleaned_liters + 1

        // Update user profile even for fallback
        await supabase
          .from('profiles')
          .update({
            credits: newCredits,
            water_cleaned_liters: newWaterCleaned,
            updated_at: new Date().toISOString()
          })
          .eq('id', user.id)

        return NextResponse.json({
          success: true,
          message: fallbackResponse,
          creditsUsed,
          newCredits,
          newWaterCleaned,
          persona: personaInfo.name,
          isApiKeyError: true
        })
      }

      if (openaiError.code === 'insufficient_quota') {
        return NextResponse.json({ error: 'OpenAI quota exceeded' }, { status: 500 })
      }

      return NextResponse.json({
        error: `OpenAI Error: ${openaiError.message || 'Unknown OpenAI error'}`
      }, { status: 500 })
    }

  } catch (error) {
    console.error('🚨 Chat API general error:', error)

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Server error: ${error.message}` },
        { status: 500 }
      )
    }

    return NextResponse.json(
      { error: 'Unknown internal server error' },
      { status: 500 }
    )
  }
}
