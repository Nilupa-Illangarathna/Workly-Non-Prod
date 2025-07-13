import { z } from "zod";

export const PromotePartnerSchema = z.object({
  userId: z.string().uuid(),
  commission: z
    .number()
    .min(0)
    .max(4800)
    .refine((val) => Number(val.toFixed(2))),
  companyname: z.string().min(2).max(50).optional(),
  level: z.number().int().positive(),
});

export type PromotePartnerType = z.infer<typeof PromotePartnerSchema>;
