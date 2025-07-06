import { google } from "@ai-sdk/google"

/**
 * Returns a Gemini model instance with API key configured.
 */
export function gemini(modelName = "gemini-1.5-pro") {
  // Using your provided API key for the hackathon demo
  const apiKey = process.env.GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error('GEMINI_API_KEY is not set');
  }
  return google(modelName, { apiKey })
}
