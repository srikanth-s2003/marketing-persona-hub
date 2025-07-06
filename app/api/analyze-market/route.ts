import { gemini } from "@/lib/gemini-provider"
import { generateObject } from "ai"
import { z } from "zod"

const marketAnalysisSchema = z.object({
  overview: z.string(),
  marketSize: z.string(),
  trends: z.array(
    z.object({
      type: z.enum(["positive", "negative"]),
      description: z.string(),
    }),
  ),
  competitors: z.array(
    z.object({
      name: z.string(),
      marketShare: z.string(),
      description: z.string(),
      strengths: z.array(z.string()),
    }),
  ),
  opportunities: z.array(z.string()),
  challenges: z.array(z.string()),
  recommendations: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    const { industry, product, targetMarket, competitors, additionalInfo } = await req.json()

    const prompt = `Conduct a comprehensive market analysis for:

INDUSTRY: ${industry}
PRODUCT/SERVICE: ${product}
TARGET MARKET: ${targetMarket}
KNOWN COMPETITORS: ${competitors}
ADDITIONAL CONTEXT: ${additionalInfo}

Provide a detailed market analysis including:
- Market overview and current state
- Market size and growth projections
- Key market trends (positive and negative)
- Competitive landscape analysis
- Market opportunities
- Market challenges and barriers
- Strategic recommendations

Be specific, data-driven where possible, and provide actionable insights for market entry or expansion.`

    const { object: analysis } = await generateObject({
      model: gemini("gemini-1.5-flash"),
      schema: marketAnalysisSchema,
      prompt,
    })

    return Response.json({ analysis })
  } catch (error: any) {
    console.error("Error analyzing market:", error)

    if (error.message?.includes("quota") || error.message?.includes("rate")) {
      return Response.json(
        { error: "API quota exceeded. Please try again later or upgrade your plan." },
        { status: 429 },
      )
    }

    return Response.json({ error: "Failed to analyze market" }, { status: 500 })
  }
}
