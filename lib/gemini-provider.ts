import { createGoogleGenerativeAI } from "@ai-sdk/google"

const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set');
}


// Build a keyed provider once
const provider = createGoogleGenerativeAI({ apiKey })

export function gemini(model = "gemini-1.5-flash") {
  return provider(model)
}
