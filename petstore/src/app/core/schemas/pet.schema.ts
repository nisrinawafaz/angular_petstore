import { z } from 'zod';

export const petSchema = z.object({
  name: z.string().min(1, 'Nama pet wajib diisi'),
  categoryName: z.string().optional(),
  status: z.enum(['available', 'pending', 'sold'] as const, {
    message: 'Status wajib dipilih',
  }),
});
