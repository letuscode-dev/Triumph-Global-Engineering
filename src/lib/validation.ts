import { z } from "zod";

const optionalText = (max: number) =>
  z
    .string()
    .trim()
    .max(max)
    .optional()
    .transform((v) => (v === "" ? undefined : v));

const phoneSchema = z
  .string()
  .trim()
  .min(6, "Phone number is too short.")
  .max(30, "Phone number is too long.")
  .refine(
    (v) => /^[\d\s+\-().]+$/.test(v) && v.replace(/\D/g, "").length >= 6,
    "Enter a valid phone number."
  );

const emailSchema = z.preprocess(
  (value) => (value === "" || value === null || value === undefined ? undefined : value),
  z.string().email("Enter a valid email address.").max(254).optional()
);

export const leadInputSchema = z.object({
  name: z.string().trim().min(1, "Name is required.").max(120),
  phone: phoneSchema,
  message: z.string().trim().min(1, "Message is required.").max(5000),
  company: optionalText(200),
  email: emailSchema,
  location: optionalText(200),
  service: optionalText(200),
  budget: optionalText(100),
  source: z.enum(["quote", "contact"]).default("quote"),
  website: z.string().optional(),
  company_url: z.string().optional(),
});

export type LeadInput = z.infer<typeof leadInputSchema>;

export const adminLoginSchema = z.object({
  password: z.string().min(1, "Password is required.").max(256),
});

export const leadStatusSchema = z.object({
  id: z.string().min(1),
  status: z.enum(["new", "contacted", "quoted", "won", "lost"]),
});

const hourEntrySchema = z.object({
  day: z.string().trim().min(1).max(80),
  time: z.string().trim().min(1).max(80),
});

export const siteSettingsSchema = z.object({
  name: z.string().trim().min(1).max(120),
  shortName: z.string().trim().min(1).max(60),
  slogan: z.string().trim().min(1).max(200),
  description: z.string().trim().min(1).max(500),
  email: z.string().trim().email().max(254),
  phones: z.array(z.string().trim().min(6).max(30)).min(1).max(4),
  phoneIntl: z.array(z.string().trim().min(9).max(15)).min(1).max(4),
  whatsapp: z.string().trim().min(9).max(15),
  address: z.string().trim().min(1).max(200),
  hours: z.array(hourEntrySchema).min(1).max(7),
  socials: z.object({
    facebook: z.string().trim().url().max(500),
    linkedin: z.string().trim().url().max(500),
    youtube: z.string().trim().url().max(500),
  }),
});

export type SiteSettingsInput = z.infer<typeof siteSettingsSchema>;

export function parseJsonBody<T>(
  schema: z.ZodType<T>,
  body: unknown
): { ok: true; data: T } | { ok: false; error: string } {
  const result = schema.safeParse(body);
  if (result.success) return { ok: true, data: result.data };
  const first = result.error.issues[0];
  return { ok: false, error: first?.message ?? "Invalid request." };
}
