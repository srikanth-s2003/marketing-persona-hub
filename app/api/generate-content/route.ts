import { gemini } from "@/lib/gemini-provider"
import { generateText } from "ai"

export async function POST(req: Request) {
  try {
    const { contentType, topic, tone, audience, additionalInfo } = await req.json()

    const typePrompt = {
      "social-media": "Create an engaging social media post",
      "blog-post": "Write a compelling blog post introduction and outline",
      "product-description": "Write a persuasive product description",
      "ad-copy": "Create compelling advertisement copy",
      newsletter: "Write engaging newsletter content",
      "landing-page": "Write persuasive landing page copy",
    }[contentType as keyof typeof typePrompt]

    const prompt = `${typePrompt} about "${topic}".
Target audience: ${audience}
Tone: ${tone}
Additional requirements: ${additionalInfo}

Make it engaging, relevant, and actionable. Include strong calls-to-action where suitable.`

    const { text } = await generateText({
      model: gemini("gemini-1.5-flash"), // Using the free tier model
      prompt,
    })

    return Response.json({ content: text })
  } catch (error: any) {
    console.error("Error generating content:", error)

    // Handle quota errors specifically
    if (error.message?.includes("quota") || error.message?.includes("rate")) {
      return Response.json(
        { error: "API quota exceeded. Please try again later or upgrade your plan." },
        { status: 429 },
      )
    }

    return Response.json({ error: "Failed to generate content" }, { status: 500 })
  }
}
