import dotenv from "dotenv";
import { z } from "zod";

dotenv.config({ quiet: true });

const envSchema = z.object({
  APP_NAME: z.string().default("Backend"),
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  PORT: z.preprocess((val) => {
    if (typeof val === "string" && val.trim() !== "") return Number(val);
    if (typeof val === "number") return val;
    return undefined;
  }, z.number().int().positive().default(5000)),
  DATABASE_URL: z.url(),
  OPENROUTER_URL: z
    .url()
    .default("https://openrouter.ai/api/v1/chat/completions"),
  OPENROUTER_API_KEY: z.string().min(1),
  OPENROUTER_MODEL: z
    .string()
    .min(1)
    .default("meta-llama/llama-3.3-70b-instruct:free"),
});

// Validate
const result = envSchema.safeParse(process.env);

if (!result.success) {
  console.error("[server]: Invalid environment variables");
  // readable error details:
  console.error(result.error.format());
  process.exit(1);
}

export const env = result.data;
export type Env = z.infer<typeof envSchema>;
