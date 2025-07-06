import { createGoogleGenerativeAI } from "@ai-sdk/google"
import { generateObject, generateText } from "ai"
import type { ZodSchema } from "zod"
import dotenv from 'dotenv';
dotenv.config();


const apiKey = process.env.GEMINI_API_KEY;

if (!apiKey) {
  throw new Error('GEMINI_API_KEY is not set');
}

// const apiKey = process.env.GEMINI_API_KEY;


// Build a keyed provider once
const provider = createGoogleGenerativeAI({ apiKey })

export function gemini(model: string) {
  return provider(model)
}

/**
 * Tries to generate an object with gemini-1.5-pro, falls back to gemini-pro when
 * rate-limited or out of quota. Returns `{ ok: boolean, data?: T, error?: string }`
 */
export async function generateObjectWithFallback<T>(
  schema: ZodSchema<T>,
  prompt: string,
): Promise<{ ok: true; data: T } | { ok: false; error: string }> {
  try {
    const { object } = await generateObject({ model: gemini("gemini-1.5-pro"), schema, prompt })
    return { ok: true, data: object }
  } catch (err: any) {
    if (typeof err?.message === "string" && err.message.toLowerCase().includes("quota")) {
      // fallback
      try {
        const { object } = await generateObject({ model: gemini("gemini-pro"), schema, prompt })
        return { ok: true, data: object }
      } catch (e2: any) {
        return { ok: false, error: e2?.message || "Quota exceeded" }
      }
    }
    return { ok: false, error: err?.message || "Unknown error" }
  }
}

/**
 * Same idea but for plain text generation.
 */
export async function generateTextWithFallback(
  prompt: string,
): Promise<{ ok: true; data: string } | { ok: false; error: string }> {
  try {
    const { text } = await generateText({ model: gemini("gemini-1.5-pro"), prompt })
    return { ok: true, data: text }
  } catch (err: any) {
    if (typeof err?.message === "string" && err.message.toLowerCase().includes("quota")) {
      try {
        const { text } = await generateText({ model: gemini("gemini-pro"), prompt })
        return { ok: true, data: text }
      } catch (e2: any) {
        return { ok: false, error: e2?.message || "Quota exceeded" }
      }
    }
    return { ok: false, error: err?.message || "Unknown error" }
  }
}
