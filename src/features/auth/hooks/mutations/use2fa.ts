import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '../../api/auth.api';
import { useAuthStore } from '../../store/auth.store';
import type { ApiResponse, Enable2FAResponse } from '@/shared/types';

export function useEnable2FA() {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (password: string) => {
      const response = await authApi.enable2FA(password);
      return response;
    },
    onSuccess: (response: ApiResponse<Enable2FAResponse>) => {
      if (response.success && response.data) {
        toast.success('2FA berhasil diaktifkan!');
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Gagal mengaktifkan 2FA');
    },
  });
}

export function useConfirm2FA() {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (code: string) => {
      const response = await authApi.confirm2FA({ code });
      return response;
    },
    onSuccess: (response: ApiResponse<null>) => {
      if (response.success) {
        updateUser({ twoFactorEnabled: true });
        toast.success('2FA berhasil dikonfirmasi!');
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Verifikasi 2FA gagal');
    },
  });
}

export function useDisable2FA() {
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async ({ code, password }: { code: string; password: string }) => {
      const response = await authApi.disable2FA({ code, password });
      return response;
    },
    onSuccess: (response: ApiResponse<null>) => {
      if (response.success) {
        updateUser({ twoFactorEnabled: false });
        toast.success('2FA berhasil dinonaktifkan!');
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Gagal menonaktifkan 2FA');
    },
  });
}

export function useChangePassword() {
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  return useMutation({
    mutationFn: async ({ currentPassword, newPassword }: { currentPassword: string; newPassword: string }) => {
      const response = await authApi.changePassword({ currentPassword, newPassword });
      return response;
    },
    onSuccess: (response) => {
      if (response.success) {
        if (response.data?.accessToken) {
          setAccessToken(response.data.accessToken);
        }
        toast.success('Password berhasil diubah!');
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Gagal mengubah password');
    },
  });
}
