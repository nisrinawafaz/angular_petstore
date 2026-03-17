import z from 'zod';

export const orderSchema = z.object({
  pet: z.object(
    {
      id: z.number(),
      name: z.string(),
    },
    { error: 'Pet wajib dipilih' },
  ),
  quantity: z.number({ error: 'Quantity wajib diisi' }).min(1, 'Minimal 1'),
  shipDate: z.string().min(1, 'Ship date wajib diisi'),
  status: z.enum(['placed', 'approved', 'delivered'] as const, {
    message: 'Status wajib dipilih',
  }),
});
