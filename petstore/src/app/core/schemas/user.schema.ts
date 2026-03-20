import { z } from 'zod';

export const createUserSchema = z.object({
  username: z
    .string()
    .min(1, 'Username wajib diisi')
    .refine((val) => !val.includes(' '), 'Username tidak boleh mengandung spasi'),
  firstName: z.string().min(1, 'First name wajib diisi'),
  lastName: z.string().min(1, 'Last name wajib diisi'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  password: z
    .string()
    .min(8, 'Minimal 8 karakter')
    .refine((val) => /[A-Z]/.test(val), 'Harus ada huruf besar')
    .refine((val) => /[0-9]/.test(val), 'Harus ada angka')
    .refine((val) => /[!@#$%^&*]/.test(val), 'Harus ada karakter spesial (!@#$%^&*)'),
  phone: z
    .string()
    .min(1, 'Phone wajib diisi')
    .refine((val) => /^[+]?[0-9]{8,15}$/.test(val), 'Format nomor tidak valid'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
});

export const editUserSchema = z.object({
  firstName: z.string().min(1, 'First name wajib diisi'),
  lastName: z.string().min(1, 'Last name wajib diisi'),
  email: z.string().min(1, 'Email wajib diisi').email('Format email tidak valid'),
  phone: z
    .string()
    .min(1, 'Phone wajib diisi')
    .refine((val) => /^[+]?[0-9]{8,15}$/.test(val), 'Format nomor tidak valid'),
  password: z
    .string()
    .min(8, 'Minimal 8 karakter')
    .refine((val) => /[A-Z]/.test(val), 'Harus ada huruf besar')
    .refine((val) => /[0-9]/.test(val), 'Harus ada angka')
    .refine((val) => /[!@#$%^&*]/.test(val), 'Harus ada karakter spesial (!@#$%^&*)'),
  confirmPassword: z.string().min(1, 'Konfirmasi password wajib diisi'),
});
