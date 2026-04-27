import { useMutation } from '@tanstack/react-query';
import { toast } from 'sonner';
import { authApi } from '../../api/auth.api';
import type { ApiResponse } from '@/shared/types';

export function useVerifyEmail() {
  return useMutation({
    mutationFn: async (token: string) => {
      const response = await authApi.verifyEmail({ token });
      return response;
    },
    onSuccess: (response: ApiResponse<null>) => {
      if (response.success) {
        toast.success('Email berhasil diverifikasi!');
      }
    },
  });
}

export function useResendVerification() {
  return useMutation({
    mutationFn: async (email: string) => {
      const response = await authApi.resendVerification({ email });
      return response;
    },
    onSuccess: (response: ApiResponse<null>) => {
      if (response.success) {
        toast.success('Email verifikasi telah dikirim ulang');
      }
    },
  });
}
