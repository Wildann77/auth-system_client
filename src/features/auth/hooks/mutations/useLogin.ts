import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/auth.store';
import type { LoginFormData, RegisterFormData, ForgotPasswordFormData } from '../../types/auth.types';
import type { LoginRequest, RegisterRequest, ForgotPasswordRequest, ApiResponse, User } from '@/shared/types';

export function useLogin() {
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);

  return useMutation({
    mutationFn: async (data: LoginFormData) => {
      const request: LoginRequest = {
        email: data.email,
        password: data.password,
        otp: data.otp,
      };
      const response = await authApi.login(request);
      return response;
    },
    onSuccess: (response: ApiResponse<{ user: User; accessToken: string; requires2FA?: boolean }>) => {
      if (response.data?.user && response.data?.accessToken) {
        setAuth(response.data.user, response.data.accessToken);
        toast.success('Login berhasil!');
        navigate('/dashboard');
      }
      return response;
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Login gagal');
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (data: RegisterFormData) => {
      const request: RegisterRequest = {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
      };
      const response = await authApi.register(request);
      return response;
    },
    onSuccess: (response: ApiResponse<{ user: { id: string; email: string; firstName: string | null; lastName: string | null; role: 'USER' | 'ADMIN' } }>) => {
      if (response.success) {
        toast.success('Registrasi berhasil! Silakan cek email untuk verifikasi.');
        navigate('/login');
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Registrasi gagal');
    },
  });
}

export function useForgotPassword() {
  return useMutation({
    mutationFn: async (data: ForgotPasswordFormData) => {
      const request: ForgotPasswordRequest = {
        email: data.email,
      };
      const response = await authApi.forgotPassword(request);
      return response;
    },
    onSuccess: (response: ApiResponse<null>) => {
      if (response.success) {
        toast.success('Email reset password telah dikirim jika akun exists');
      }
    },
    onError: () => {
      toast.error('Terjadi kesalahan');
    },
  });
}

export function useResetPassword() {
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async ({ token, password }: { token: string; password: string }) => {
      const response = await authApi.resetPassword({ token, password });
      return response;
    },
    onSuccess: (response: ApiResponse<null>) => {
      if (response.success) {
        toast.success('Password berhasil direset!');
        navigate('/login');
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Reset password gagal');
    },
  });
}

export function useLogout() {
  const clearAuth = useAuthStore((state) => state.clearAuth);
  const navigate = useNavigate();

  return useMutation({
    mutationFn: async (allDevices: boolean = false) => {
      const response = await authApi.logout(allDevices);
      return response;
    },
    onSuccess: () => {
      clearAuth();
      toast.success('Logout berhasil!');
      navigate('/login');
    },
    onError: () => {
      clearAuth();
      navigate('/login');
    },
  });
}
