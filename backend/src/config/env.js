export const env = Object.freeze({
  port: Number(process.env.PORT) || 5001,
  nodeEnv: process.env.NODE_ENV || 'development',

  // MongoDB Atlas
  mongodbUri: process.env.MONGODB_URI || '',

  // Primary LLM — Gemini
  geminiApiKey: process.env.GEMINI_API_KEY || '',
  geminiModel: process.env.GEMINI_MODEL || 'gemini-2.5-flash',
  geminiTimeoutMs: Number(process.env.GEMINI_TIMEOUT_MS) || 60_000,

  // Secondary LLM — Groq (preferred when set)
  groqApiKey: process.env.GROQ_API_KEY || '',
  groqModel: process.env.GROQ_MODEL || 'llama-3.3-70b-versatile',
  groqTimeoutMs: Number(process.env.GROQ_TIMEOUT_MS) || 60_000,

  // Secondary LLM — OpenRouter (used when Groq is not configured)
  openRouterApiKey: process.env.OPENROUTER_API_KEY || '',
  openRouterModel:
    process.env.OPENROUTER_MODEL || 'meta-llama/llama-3.3-70b-instruct',
  openRouterTimeoutMs: Number(process.env.OPENROUTER_TIMEOUT_MS) || 60_000,
  openRouterSiteUrl: process.env.OPENROUTER_SITE_URL || '',
  openRouterAppName: process.env.OPENROUTER_APP_NAME || 'Gilora',

  // Cascade retry / backoff
  llmRetries: Number(process.env.LLM_RETRIES) || 1,
  llmBackoffBaseMs: Number(process.env.LLM_BACKOFF_BASE_MS) || 500,
  llmBackoffMaxMs: Number(process.env.LLM_BACKOFF_MAX_MS) || 8_000,
})
