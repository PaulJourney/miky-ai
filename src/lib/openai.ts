// OpenAI Integration for Miky.ai - ACTIVE
import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: import.meta.env.VITE_OPENAI_API_KEY,
  dangerouslyAllowBrowser: true // Only for client-side usage
})

// Persona configurations
const PERSONA_PROMPTS = {
  ACADEMIC: {
    system: "You are an academic researcher and educator. You help with research, writing, analysis, and academic questions. You provide detailed, well-sourced responses with a scholarly tone.",
    model: "gpt-4o-mini"
  },
  MARKETER: {
    system: "You are a marketing expert. You help with marketing strategies, brand development, campaigns, and growth tactics. You provide actionable marketing advice.",
    model: "gpt-4o-mini"
  },
  ENGINEER: {
    system: "You are a senior software engineer. You help with coding, architecture, debugging, and technical solutions. You provide clear, practical technical advice.",
    model: "gpt-4o-mini"
  },
  COACH: {
    system: "You are a personal development coach. You help with goal setting, motivation, productivity, and personal growth. You provide supportive and actionable guidance.",
    model: "gpt-4o-mini"
  },
  SENSEI: {
    system: "You are a relationship and interpersonal dynamics expert. You help with communication, relationships, and social situations. You provide wise and empathetic advice.",
    model: "gpt-4o-mini"
  },
  LAWYER: {
    system: "You are a legal advisor. You help with legal questions, contract analysis, and legal guidance. Note: This is for informational purposes only and not actual legal advice.",
    model: "gpt-4o-mini"
  },
  MEDICAL: {
    system: "You are a health and wellness advisor. You help with general health questions and wellness tips. Note: This is for informational purposes only and not medical advice.",
    model: "gpt-4o-mini"
  },
  GOD_MODE: {
    system: "You are a philosophical advisor with deep insight into existential questions. You help with life's big questions, meaning, purpose, and philosophical exploration.",
    model: "gpt-4o-mini"
  },
  RICHMAN: {
    system: "You are a wealth and financial advisor. You help with investment strategies, financial planning, and wealth building. You provide practical financial guidance.",
    model: "gpt-4o-mini"
  },
  GENERAL: {
    system: "You are a helpful AI assistant. You can help with various questions and tasks across different domains.",
    model: "gpt-4o-mini"
  }
}

export async function generateAIResponse(
  message: string,
  persona: string,
  conversationHistory: Array<{ role: 'user' | 'assistant', content: string }> = []
): Promise<{ response: string; tokensUsed: number }> {
  try {
    // Fallback to mock if no API key is provided
    if (!import.meta.env.VITE_OPENAI_API_KEY || import.meta.env.VITE_OPENAI_API_KEY === 'your-openai-key-here') {
      console.log('Using mock OpenAI response - no API key configured')
      return mockResponse(message, persona)
    }

    const personaConfig = PERSONA_PROMPTS[persona as keyof typeof PERSONA_PROMPTS] || PERSONA_PROMPTS.GENERAL

    const messages = [
      { role: 'system' as const, content: personaConfig.system },
      ...conversationHistory.slice(-10), // Keep only last 10 messages for context
      { role: 'user' as const, content: message }
    ]

    const completion = await openai.chat.completions.create({
      model: personaConfig.model,
      messages,
      max_tokens: 1500,
      temperature: 0.7,
    })

    const response = completion.choices[0]?.message?.content || 'Sorry, I could not generate a response.'
    const tokensUsed = completion.usage?.total_tokens || 0

    return {
      response,
      tokensUsed
    }
  } catch (error) {
    console.error('OpenAI API Error:', error)
    console.log('Falling back to mock response due to API error')
    return mockResponse(message, persona)
  }
}

// Mock fallback function
function mockResponse(message: string, persona: string): { response: string; tokensUsed: number } {
  const responses = {
    ACADEMIC: `[Demo Mode] As an academic researcher, I understand your question about "${message}". This is a demo response. Add your OpenAI API key to activate real AI responses.`,
    MARKETER: `[Demo Mode] From a marketing perspective on "${message}": This is a demo response. Add your OpenAI API key to activate real AI responses.`,
    ENGINEER: `[Demo Mode] Looking at "${message}" from a technical standpoint: This is a demo response. Add your OpenAI API key to activate real AI responses.`,
    COACH: `[Demo Mode] I hear you asking about "${message}". This is a demo response. Add your OpenAI API key to activate real AI responses.`,
    SENSEI: `[Demo Mode] Your question about "${message}" touches on important dynamics. This is a demo response. Add your OpenAI API key to activate real AI responses.`,
    LAWYER: `[Demo Mode] Regarding your legal inquiry about "${message}": This is a demo response. Add your OpenAI API key to activate real AI responses.`,
    MEDICAL: `[Demo Mode] About your health question on "${message}": This is a demo response. Add your OpenAI API key to activate real AI responses.`,
    GOD_MODE: `[Demo Mode] Your profound question about "${message}" invites deep reflection. This is a demo response. Add your OpenAI API key to activate real AI responses.`,
    RICHMAN: `[Demo Mode] Your financial question about "${message}" is important. This is a demo response. Add your OpenAI API key to activate real AI responses.`,
    GENERAL: `[Demo Mode] Thank you for your question about "${message}". This is a demo response. Add your OpenAI API key to activate real AI responses.`
  }

  const response = responses[persona as keyof typeof responses] || responses.GENERAL

  return {
    response,
    tokensUsed: 150 // Mock token usage
  }
}

export function calculateCreditsFromTokens(tokens: number): number {
  // 1 credit = ~100 tokens (adjust based on your pricing model)
  return Math.ceil(tokens / 100)
}
