import { z } from "zod";

const envSchema = z.object({
  NODE_ENV: z.enum(["development", "test", "production"]).default("development"),
  DATABASE_URL: z.string().optional().default(""),
  DIRECT_URL: z.string().optional().default(""),
  NEXTAUTH_URL: z.string().optional().default(""),
  NEXTAUTH_SECRET: z.string().optional().default(""),
  GOOGLE_CLIENT_ID: z.string().optional().default(""),
  GOOGLE_CLIENT_SECRET: z.string().optional().default(""),
  ADMIN_EMAIL: z.string().optional().default("admin@example.com"),
  ADMIN_PASSWORD: z.string().optional().default("admin123"),
  AWS_ACCESS_KEY_ID: z.string().optional().default(""),
  AWS_SECRET_ACCESS_KEY: z.string().optional().default(""),
  AWS_REGION: z.string().optional().default(""),
  AWS_BUCKET: z.string().optional().default(""),
  NEXT_PUBLIC_ADSENSE_PUBLISHER_ID: z.string().optional().default(""),
});

export const env = envSchema.parse(process.env);
