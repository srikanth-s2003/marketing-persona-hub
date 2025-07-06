import { gemini } from "@/lib/gemini-provider"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { persona, message, conversationHistory } = await req.json()

    // Build conversation context
    const conversationContext = conversationHistory
      .map((msg: any) => `${msg.role === "user" ? "User" : persona.name}: ${msg.content}`)
      .join("\n")

    const prompt = `You are ${persona.name}, ${persona.title}. 

PERSONA DETAILS:
- Age: ${persona.age}
- Background: ${persona.background}
- Personality: ${persona.personality}

CONVERSATION HISTORY:
${conversationContext}

User: ${message}

Respond as ${persona.name} would, staying true to your personality, background, and perspective. Be conversational, authentic, and provide insights based on your persona's characteristics. If asked about marketing materials, give honest feedback from your persona's viewpoint.

${persona.name}:`

    const { text } = await generateText({
      model: gemini("gemini-1.5-flash"),
      prompt,
    })

    return Response.json({ response: text })
  } catch (error: any) {
    console.error("Error in persona chat:", error)

    if (error.message?.includes("quota") || error.message?.includes("rate")) {
      return Response.json({ error: "API quota exceeded. Please try again later." }, { status: 429 })
    }

    return Response.json({ error: "Failed to generate response" }, { status: 500 })
  }
}
