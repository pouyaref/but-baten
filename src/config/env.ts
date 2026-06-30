// src/config/env.ts

interface EnvConfig {
  OPENAI_API_KEY: string;
  MISTRAL_API_KEY: string;
  GROQ_API_KEY: string;
  MAX_TOKENS: number;
  POLLINATIONS_URL: string;
  POLLINATIONS_IMAGE_URL: string;
}

const config: EnvConfig = {
  OPENAI_API_KEY: import.meta.env.VITE_OPENAI_API_KEY || '',
  MISTRAL_API_KEY: import.meta.env.VITE_MISTRAL_API_KEY || '',
  GROQ_API_KEY: import.meta.env.VITE_GROQ_API_KEY || '',
  MAX_TOKENS: Number(import.meta.env.VITE_MAX_TOKENS) || 2000,
  POLLINATIONS_URL: import.meta.env.VITE_POLLINATIONS_URL || 'https://text.pollinations.ai',
  POLLINATIONS_IMAGE_URL: import.meta.env.VITE_POLLINATIONS_IMAGE_URL || 'https://image.pollinations.ai',
};

export const ENV = config;
export default config;