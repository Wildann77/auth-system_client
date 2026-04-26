import api from '@/shared/api/axios';
import type {
  ApiResponse,
  User,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  VerifyEmailRequest,
  ResendVerificationRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  Enable2FAResponse,
  Confirm2FARequest,
  Disable2FARequest,
  UpdateProfileRequest,
  AdminUpdateRoleRequest,
} from '@/shared/types';

export const authApi = {
  register: async (data: RegisterRequest) => {
    const response = await api.post<ApiResponse<{ user: Pick<User, 'id' | 'email' | 'firstName' | 'lastName' | 'role'> }>>('/auth/register', data);
    return response.data;
  },

  login: async (data: LoginRequest) => {
    const response = await api.post<ApiResponse<LoginResponse>>('/auth/login', data);
    return response.data;
  },

  verifyEmail: async (data: VerifyEmailRequest) => {
    const response = await api.post<ApiResponse<null>>('/auth/verify-email', data);
    return response.data;
  },

  resendVerification: async (data: ResendVerificationRequest) => {
    const response = await api.post<ApiResponse<null>>('/auth/resend-verification', data);
    return response.data;
  },

  forgotPassword: async (data: ForgotPasswordRequest) => {
    const response = await api.post<ApiResponse<null>>('/auth/forgot-password', data);
    return response.data;
  },

  resetPassword: async (data: ResetPasswordRequest) => {
    const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/reset-password', data);
    return response.data;
  },

  refreshToken: async () => {
    const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/refresh-token', {});
    return response.data;
  },

  logout: async (allDevices: boolean = false) => {
    const response = await api.post<ApiResponse<null>>('/auth/logout', { allDevices });
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get<ApiResponse<User>>('/auth/me');
    return response.data;
  },

  changePassword: async (data: ChangePasswordRequest) => {
    const response = await api.post<ApiResponse<{ accessToken: string }>>('/auth/change-password', data);
    return response.data;
  },

  enable2FA: async (password: string) => {
    const response = await api.post<ApiResponse<Enable2FAResponse>>('/auth/2fa/enable', { password });
    return response.data;
  },

  confirm2FA: async (data: Confirm2FARequest) => {
    const response = await api.post<ApiResponse<null>>('/auth/2fa/verify', data);
    return response.data;
  },

  disable2FA: async (data: Disable2FARequest) => {
    const response = await api.post<ApiResponse<null>>('/auth/2fa/disable', data);
    return response.data;
  },

  getGoogleAuthUrl: () => {
    return `${import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'}/auth/google`;
  },
};

export const userApi = {
  getProfile: async () => {
    const response = await api.get<ApiResponse<User>>('/user/me');
    return response.data;
  },

  updateProfile: async (data: UpdateProfileRequest) => {
    const response = await api.patch<ApiResponse<User>>('/user/me', data);
    return response.data;
  },
};

export const adminApi = {
  getUsers: async (params: {
    page?: number;
    limit?: number;
    role?: 'USER' | 'ADMIN';
    isEmailVerified?: 'true' | 'false';
    provider?: 'LOCAL' | 'GOOGLE';
    search?: string;
  }) => {
    const response = await api.get<ApiResponse<{
      items: User[];
      total: number;
      page: number;
      limit: number;
      totalPages: number;
    }>>('/admin/users', { params });
    return response.data;
  },

  getStats: async () => {
    const response = await api.get<ApiResponse<{
      totalUsers: number;
      verifiedUsers: number;
      adminCount: number;
      premiumCount: number;
      usersByDay: { date: string; count: number }[];
    }>>('/admin/stats');
    return response.data;
  },

  updateUserRole: async (userId: string, data: AdminUpdateRoleRequest) => {
    const response = await api.patch<ApiResponse<User>>(`/admin/users/${userId}/role`, data);
    return response.data;
  },

  deleteUser: async (userId: string) => {
    const response = await api.delete<ApiResponse<null>>(`/admin/users/${userId}`);
    return response.data;
  },
};

export const paymentApi = {
  checkout: async (data: {
    amount: number;
    provider: 'midtrans' | 'stripe';
    orderType: 'GENERAL' | 'PREMIUM_UPGRADE';
    items?: Array<{ id: string; name: string; price: number; quantity: number }>;
  }) => {
    const response = await api.post<ApiResponse<{
      orderId: string;
      snapToken?: string;
      snapUrl?: string;
      checkoutUrl?: string;
    }>>('/payment/checkout', data);
    return response.data;
  },

  cancelSubscription: async () => {
    const response = await api.post<ApiResponse<null>>('/payment/cancel');
    return response.data;
  },
};

export const contentApi = {
  getExclusiveContent: async () => {
    const response = await api.get<ApiResponse<Array<{
      id: string;
      title: string;
      description: string | null;
      content: string;
      contentType: 'text' | 'url' | 'html';
      isPremium: boolean;
      tags: string[];
    }>>>('/content/exclusive');
    return response.data;
  },
};
