import { z } from 'zod';

export const SectionType = z.enum(['hero', 'services', 'gallery', 'pricing', 'map', 'contact']);

export const LayoutSchema = z.object({
  id: z.string(),
  title: z.string(),
  sections: z.array(SectionType),
  seo: z.object({ title: z.string(), description: z.string(), keywords: z.array(z.string()).optional() }).optional(),
  theme: z.object({ colors: z.array(z.string()), font: z.string().optional() }).optional()
});

export type Layout = z.infer<typeof LayoutSchema>;
