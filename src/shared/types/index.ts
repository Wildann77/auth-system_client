export interface User {
  id: string;
  email: string;
  firstName: string | null;
  lastName: string | null;
  role: 'USER' | 'ADMIN';
  provider: 'LOCAL' | 'GOOGLE';
  isEmailVerified: boolean;
  twoFactorEnabled: boolean;
  isPremium: boolean;
  premiumUntil: string | null;
  lastLoginAt: string | null;
  createdAt: string;
  updatedAt: string;
}

export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T | null;
  error: {
    code: string;
    details?: Record<string, string[]>;
  } | null;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface LoginRequest {
  email: string;
  password: string;
  otp?: string;
}

export interface LoginResponse {
  user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'role'>;
  accessToken: string;
  requires2FA?: boolean;
}

export interface RegisterRequest {
  email: string;
  password: string;
  firstName?: string;
  lastName?: string;
}

export interface VerifyEmailRequest {
  token: string;
}

export interface ResendVerificationRequest {
  email: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface Enable2FAResponse {
  success: boolean;
  qrCode: string;
  backupCodes: string[];
}

export interface Confirm2FARequest {
  code: string;
}

export interface Disable2FARequest {
  code: string;
  password: string;
}

export interface UpdateProfileRequest {
  firstName?: string;
  lastName?: string;
}

export interface AdminUpdateRoleRequest {
  role: 'USER' | 'ADMIN';
}

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
}

export interface CheckoutRequest {
  amount: number;
  provider: 'midtrans' | 'stripe';
  orderType: 'GENERAL' | 'PREMIUM_UPGRADE';
  items?: OrderItem[];
}

export interface CheckoutResponse {
  orderId: string;
  snapToken?: string;
  snapUrl?: string;
  checkoutUrl?: string;
}

export interface Content {
  id: string;
  title: string;
  description: string | null;
  content: string;
  contentType: 'text' | 'url' | 'html';
  isPremium: boolean;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface AdminStats {
  totalUsers: number;
  verifiedUsers: number;
  adminCount: number;
  premiumCount: number;
  usersByDay: { date: string; count: number }[];
}
