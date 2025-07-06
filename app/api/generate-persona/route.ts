import { gemini } from "@/lib/gemini-provider"
import { generateObject } from "ai"
import { z } from "zod"

const personaSchema = z.object({
  name: z.string(),
  title: z.string(),
  age: z.string(),
  location: z.string(),
  income: z.string(),
  background: z.string(),
  goals: z.array(z.string()),
  painPoints: z.array(z.string()),
  marketingTips: z.array(z.string()),
})

export async function POST(req: Request) {
  try {
    const {
      industry,
      product,
      age,
      gender,
      location,
      income,
      profession,
      education,
      personalityType,
      lifestyle,
      coreValues,
      decisionMaking,
      painPoints,
      shoppingMotivation,
      devices,
      socialPlatforms,
      contentType,
      brandTrust,
      trustLevel,
      innovationLevel,
      priceVsQuality,
      socialLevel,
      personalitySeed,
      additionalInfo,
    } = await req.json()

    const prompt = `Create a detailed marketing persona for a ${industry} business that offers ${product}.

DEMOGRAPHICS:
- Age: ${age}
- Gender: ${gender}
- Location: ${location}
- Income: ${income}
- Profession: ${profession}
- Education: ${education}

PSYCHOGRAPHICS:
- Personality Type: ${personalityType}
- Lifestyle: ${lifestyle}
- Core Values: ${coreValues}
- Decision Making: ${decisionMaking}
- Pain Points: ${painPoints}
- Shopping Motivation: ${shoppingMotivation}

MEDIA HABITS:
- Devices: ${devices}
- Social Platforms: ${socialPlatforms}
- Content Type: ${contentType}
- Brand Trust: ${brandTrust}

PERSONALITY TRAITS (1-10 scale):
- Trust Level: ${trustLevel}/10
- Innovation Level: ${innovationLevel}/10
- Price vs Quality Focus: ${priceVsQuality}/10
- Social Level: ${socialLevel}/10

${personalitySeed ? `PERSONALITY SEED TEXT: ${personalitySeed}` : ""}

Additional context: ${additionalInfo}

Generate a comprehensive, realistic persona that incorporates ALL the provided information. Include specific behavioral patterns, communication preferences, and detailed marketing recommendations based on the complete profile.`

    const { object: persona } = await generateObject({
      model: gemini("gemini-1.5-flash"), // Using the free tier model
      schema: personaSchema,
      prompt,
    })

    return Response.json({ persona })
  } catch (error: any) {
    console.error("Error generating persona:", error)

    // Handle quota errors specifically
    if (error.message?.includes("quota") || error.message?.includes("rate")) {
      return Response.json(
        { error: "API quota exceeded. Please try again later or upgrade your plan." },
        { status: 429 },
      )
    }

    return Response.json({ error: "Failed to generate persona" }, { status: 500 })
  }
}
