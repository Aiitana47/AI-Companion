import { NextRequest, NextResponse } from 'next/server'
import ZAI from 'z-ai-web-dev-sdk'

const SYSTEM_PROMPT = `You are an AI Emotional Companion for an elderly user named Martha. You are warm, caring, and always supportive. You speak in a gentle, unhurried manner with simple language. You are proactive but not intrusive. You help with:
- Medication reminders and health check-ins
- Emotional support and mood monitoring
- Social connection facilitation (calling family)
- Daily activity suggestions
- Emergency detection and escalation

Keep your responses short (1-3 sentences), warm, and easy to understand. Use Martha's name occasionally. Never use technical jargon. If Martha seems distressed or mentions physical symptoms, gently suggest using the emergency button or contacting family.`

export async function POST(request: NextRequest) {
  try {
    const { message, context } = await request.json()

    if (!message) {
      return NextResponse.json(
        { error: 'Message is required' },
        { status: 400 }
      )
    }

    const zai = await ZAI.create()

    const messages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = [
      { role: 'system', content: SYSTEM_PROMPT },
    ]

    if (context) {
      messages.push({ role: 'user', content: `Context: ${context}` })
    }

    messages.push({ role: 'user', content: message })

    const response = await zai.chat.completions.create({
      messages,
      model: 'glm-4.1',
    })

    const aiMessage = response.choices?.[0]?.message?.content || 
      "I'm here for you, Martha. How can I help?"

    return NextResponse.json({ message: aiMessage })
  } catch (error) {
    console.error('Companion AI error:', error)
    return NextResponse.json(
      { error: 'Failed to get AI response' },
      { status: 500 }
    )
  }
}
