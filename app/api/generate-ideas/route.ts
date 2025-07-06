import { gemini } from "@/lib/gemini-provider"
import { generateObject } from "ai"
import { z } from "zod"

const ideasSchema = z.object({
  quickWins: z.array(
    z.object({
      title: z.string(),
      description: z.string(),
      timeline: z.string(),
      difficulty: z.enum(["low", "medium", "high"]),
    }),
  ),
  campaigns: z.array(
    z.object({
      name: z.string(),
      concept: z.string(),
      execution: z.string(),
      impact: z.string(),
      creativity: z.enum(["low", "medium", "high"]),
    }),
  ),
  contentIdeas: z.array(
    z.object({
      type: z.string(),
      description: z.string(),
      platform: z.string(),
    }),
  ),
  implementationTips: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    const { business, challenge, audience, budget, timeframe, creativity, additionalInfo } = await req.json()

    const prompt = `Generate creative marketing ideas for:

BUSINESS: ${business}
CHALLENGE: ${challenge}
TARGET AUDIENCE: ${audience}
BUDGET: ${budget}
TIMEFRAME: ${timeframe}
CREATIVITY LEVEL: ${creativity}
ADDITIONAL CONTEXT: ${additionalInfo}

Generate a comprehensive set of marketing ideas including:

1. QUICK WINS: 3-4 low-effort, high-impact ideas that can be implemented quickly
2. CAMPAIGN IDEAS: 2-3 larger campaign concepts with detailed execution plans
3. CONTENT IDEAS: 4-6 specific content pieces across different platforms
4. IMPLEMENTATION TIPS: Practical advice for executing these ideas

Tailor the creativity level to match the requested approach (${creativity}). Make ideas specific, actionable, and relevant to the target audience and business context.`

    const { object: ideas } = await generateObject({
      model: gemini("gemini-1.5-flash"),
      schema: ideasSchema,
      prompt,
    })

    return Response.json({ ideas })
  } catch (error: any) {
    console.error("Error generating ideas:", error)

    if (error.message?.includes("quota") || error.message?.includes("rate")) {
      return Response.json(
        { error: "API quota exceeded. Please try again later or upgrade your plan." },
        { status: 429 },
      )
    }

    return Response.json({ error: "Failed to generate ideas" }, { status: 500 })
  }
}
