import { z } from "zod";

export const EnvSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  PORT: z.string().default("3001"),
  DATABASE_URL: z.string().url(),
  FRONTEND_URL: z.string().url().optional(),
});
export type Env = z.infer<typeof EnvSchema>;
