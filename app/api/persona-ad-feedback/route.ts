import { gemini } from "@/lib/gemini-provider"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { persona, adContent } = await req.json()

    const prompt = `You are ${persona.name}, ${persona.title}.

PERSONA DETAILS:
- Age: ${persona.age}
- Background: ${persona.background}
- Personality: ${persona.personality}

Please review this advertisement/marketing material from your perspective:

"${adContent}"

Provide detailed feedback as ${persona.name} would, including:

1. **First Impression**: What's your immediate reaction?
2. **What Catches Your Eye**: What elements stand out to you?
3. **Credibility**: Do you trust this message? Why or why not?
4. **Relevance**: How relevant is this to your needs/interests?
5. **Emotional Response**: How does this make you feel?
6. **Action Likelihood**: Would you click/buy/engage? Why?
7. **Improvements**: What would make this more appealing to you?
8. **Overall Rating**: Rate this ad from 1-10 and explain why.

Be honest, specific, and true to your persona's characteristics. Use "I" statements and speak from your personal perspective.`

    const { text } = await generateText({
      model: gemini("gemini-1.5-flash"),
      prompt,
    })

    return Response.json({ feedback: text })
  } catch (error: any) {
    console.error("Error generating ad feedback:", error)

    if (error.message?.includes("quota") || error.message?.includes("rate")) {
      return Response.json({ error: "API quota exceeded. Please try again later." }, { status: 429 })
    }

    return Response.json({ error: "Failed to generate feedback" }, { status: 500 })
  }
}
