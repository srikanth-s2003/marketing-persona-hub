import { gemini } from "@/lib/gemini-provider"
import { generateObject } from "ai"
import { z } from "zod"

const analysisSchema = z.object({
  emotionalSummary: z.string().describe("Overall emotional summary of how the persona feels about the content"),
  whatTheyNotice: z.array(z.string()).describe("What elements they notice first, in order of attention"),
  whatTheyClick: z.array(z.string()).describe("What buttons, links, or elements they're likely to click"),
  whatTurnsThemOff: z.array(z.string()).describe("What elements or aspects turn them off or create friction"),
  wouldConvert: z.boolean().describe("Whether they would ultimately convert/buy based on this content"),
  emotionalResponse: z.string().describe("Detailed emotional response and feelings about the content"),
  prosAndCons: z.object({
    pros: z.array(z.string()).describe("Positive aspects from the persona's perspective"),
    cons: z.array(z.string()).describe("Negative aspects or concerns from the persona's perspective"),
  }),
  conversionLikelihood: z.number().min(0).max(100).describe("Conversion likelihood score out of 100"),
  improvementSuggestions: z.array(z.string()).describe("Specific suggestions to improve conversion for this persona"),
  confidenceLevel: z.number().min(0).max(100).describe("Confidence level in this analysis (0-100)"),
})

export async function POST(req: Request) {
  try {
    const { marketingContent, personaContext, contentType } = await req.json()

    const prompt = `You are simulating how a specific persona would interact with marketing content. Analyze this ${contentType} from their perspective.

PERSONA PROFILE:
${personaContext}

MARKETING CONTENT TO ANALYZE:
${marketingContent}

Simulate this persona's interaction with the content step by step:

1. ATTENTION: What catches their eye first? What do they notice immediately?
2. ENGAGEMENT: What elements would they click on or interact with?
3. FRICTION: What turns them off, creates doubt, or makes them want to leave?
4. EMOTION: How does the content make them feel? What's their emotional journey?
5. DECISION: Would they ultimately convert/buy? Why or why not?

Provide a detailed analysis that includes:
- Their emotional response and feelings
- What they notice first (in order of attention)
- What they would click on
- What creates friction or turns them off
- Pros and cons from their perspective
- Conversion likelihood (0-100 score)
- Specific improvement suggestions
- Your confidence level in this analysis

Be specific and realistic based on the persona's demographics, psychographics, pain points, and behavioral patterns.`

    const { object: analysis } = await generateObject({
      model: gemini("gemini-1.5-flash"),
      schema: analysisSchema,
      prompt,
    })

    return Response.json({ analysis })
  } catch (error: any) {
    console.error("Error analyzing content:", error)

    if (error.message?.includes("quota") || error.message?.includes("rate")) {
      return Response.json(
        { error: "API quota exceeded. Please try again later or upgrade your plan." },
        { status: 429 },
      )
    }

    return Response.json({ error: "Failed to analyze content" }, { status: 500 })
  }
}
