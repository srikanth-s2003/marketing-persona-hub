import { gemini } from "@/lib/gemini-provider"
import { generateObject } from "ai"
import { z } from "zod"

const campaignSchema = z.object({
  name: z.string(),
  tagline: z.string(),
  overview: z.string(),
  phases: z.array(
    z.object({
      name: z.string(),
      duration: z.string(),
      description: z.string(),
    }),
  ),
  channels: z.array(z.string()),
  budget: z.array(
    z.object({
      category: z.string(),
      percentage: z.string(),
    }),
  ),
  kpis: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    const { product, targetAudience, budget, duration, goals, channels, additionalInfo } = await req.json()

    const prompt = `Create a comprehensive marketing campaign strategy for:

PRODUCT/SERVICE: ${product}
TARGET AUDIENCE: ${targetAudience}
BUDGET: ${budget}
DURATION: ${duration}
PRIMARY GOAL: ${goals}
PREFERRED CHANNELS: ${channels}
ADDITIONAL INFO: ${additionalInfo}

Generate a detailed campaign strategy that includes:
- Campaign name and tagline
- Campaign overview and strategy
- Campaign phases with timeline
- Marketing channels to use
- Budget allocation breakdown
- Key performance indicators (KPIs)

Make it actionable, realistic, and tailored to the specific goals and constraints provided.`

    const { object: campaign } = await generateObject({
      model: gemini("gemini-1.5-flash"),
      schema: campaignSchema,
      prompt,
    })

    return Response.json({ campaign })
  } catch (error: any) {
    console.error("Error generating campaign:", error)

    if (error.message?.includes("quota") || error.message?.includes("rate")) {
      return Response.json(
        { error: "API quota exceeded. Please try again later or upgrade your plan." },
        { status: 429 },
      )
    }

    return Response.json({ error: "Failed to generate campaign" }, { status: 500 })
  }
}
