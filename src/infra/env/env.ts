import { z } from 'zod';

export const envSchema = z.object({
  PORT: z.coerce.number().default(3333),
});

export type EnvSchema = z.infer<typeof envSchema>;
