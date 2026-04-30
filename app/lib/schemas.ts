import {z} from 'zod';

// Schema compartido entre el form (cliente, react-hook-form) y la action
// que crea customers en Shopify (server). NO marcar como .server.ts.

export const formSchema = z.object({
  nombre: z.string().min(2, 'Mínimo 2 caracteres'),
  email: z.string().email('Email inválido'),
  whatsapp: z
    .string()
    .min(8, 'Teléfono inválido')
    .regex(/^[+]?[\d\s()-]+$/, 'Formato de teléfono inválido'),
  businessUrl: z.string().optional(),
  marketingChannels: z
    .array(z.string())
    .min(1, 'Selecciona al menos una opción'),
  adsInvestment: z.string().min(1, 'Selecciona una opción'),
  monthlyRevenue: z.string().min(1, 'Selecciona una opción'),
  goal90Days: z.string().optional().default(''),
  startWhen: z.string().min(1, 'Selecciona una opción'),
  mainObstacle: z.string().optional().default(''),
});

export type FormData = z.infer<typeof formSchema>;

// Campos a validar por step del form multi-paso.
export const STEP_FIELDS: Record<number, (keyof FormData)[]> = {
  1: ['nombre'],
  2: ['email'],
  3: ['whatsapp'],
  4: [], // optional, no validation required
  5: ['marketingChannels'],
  6: ['adsInvestment'],
  7: ['monthlyRevenue'],
  8: ['goal90Days'],
  9: ['startWhen'],
  10: [], // optional, no validation required
};
