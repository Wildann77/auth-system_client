import { z } from 'zod';

export const loginSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Email tidak valid'),
  password: z.string().min(1, 'Password wajib diisi'),
  otp: z.string().optional(),
});

export const registerSchema = z.object({
  email: z
    .string()
    .min(1, 'Email wajib diisi')
    .email('Email tidak valid')
    .max(255, 'Email maksimal 255 karakter'),
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(128, 'Password maksimal 128 karakter')
    .regex(/[A-Z]/, 'Password harus memiliki minimal 1 huruf besar')
    .regex(/[a-z]/, 'Password harus memiliki minimal 1 huruf kecil')
    .regex(/[0-9]/, 'Password harus memiliki minimal 1 angka')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password harus memiliki minimal 1 karakter spesial'),
  firstName: z
    .string()
    .max(100, 'Nama depan maksimal 100 karakter')
    .optional(),
  lastName: z
    .string()
    .max(100, 'Nama belakang maksimal 100 karakter')
    .optional(),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email wajib diisi').email('Email tidak valid'),
});

export const resetPasswordSchema = z.object({
  password: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(128, 'Password maksimal 128 karakter')
    .regex(/[A-Z]/, 'Password harus memiliki minimal 1 huruf besar')
    .regex(/[a-z]/, 'Password harus memiliki minimal 1 huruf kecil')
    .regex(/[0-9]/, 'Password harus memiliki minimal 1 angka')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password harus memiliki minimal 1 karakter spesial'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmPassword'],
});

export const changePasswordSchema = z.object({
  currentPassword: z.string().min(1, 'Password saat ini wajib diisi'),
  newPassword: z
    .string()
    .min(8, 'Password minimal 8 karakter')
    .max(128, 'Password maksimal 128 karakter')
    .regex(/[A-Z]/, 'Password harus memiliki minimal 1 huruf besar')
    .regex(/[a-z]/, 'Password harus memiliki minimal 1 huruf kecil')
    .regex(/[0-9]/, 'Password harus memiliki minimal 1 angka')
    .regex(/[!@#$%^&*(),.?":{}|<>]/, 'Password harus memiliki minimal 1 karakter spesial'),
  confirmNewPassword: z.string(),
}).refine((data) => data.newPassword === data.confirmNewPassword, {
  message: 'Konfirmasi password tidak cocok',
  path: ['confirmNewPassword'],
});

export const updateProfileSchema = z.object({
  firstName: z
    .string()
    .max(100, 'Nama depan maksimal 100 karakter')
    .optional(),
  lastName: z
    .string()
    .max(100, 'Nama belakang maksimal 100 karakter')
    .optional(),
});

export const enable2FASchema = z.object({
  password: z.string().min(1, 'Password wajib diisi'),
});

export const confirm2FASchema = z.object({
  code: z
    .string()
    .length(6, 'Kode OTP harus 6 digit')
    .regex(/^\d+$/, 'Kode OTP harus berupa angka'),
});

export const disable2FASchema = z.object({
  code: z
    .string()
    .length(6, 'Kode OTP harus 6 digit')
    .regex(/^\d+$/, 'Kode OTP harus berupa angka'),
  password: z.string().min(1, 'Password wajib diisi'),
});

export const checkoutSchema = z.object({
  amount: z.number().positive('Jumlah harus positif'),
  provider: z.enum(['midtrans', 'stripe']),
  orderType: z.enum(['GENERAL', 'PREMIUM_UPGRADE']),
  items: z.array(z.object({
    id: z.string(),
    name: z.string(),
    price: z.number(),
    quantity: z.number(),
  })).optional(),
});

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type UpdateProfileFormData = z.infer<typeof updateProfileSchema>;
export type Enable2FAFormData = z.infer<typeof enable2FASchema>;
export type Confirm2FAFormData = z.infer<typeof confirm2FASchema>;
export type Disable2FAFormData = z.infer<typeof disable2FASchema>;
export type CheckoutFormData = z.infer<typeof checkoutSchema>;
