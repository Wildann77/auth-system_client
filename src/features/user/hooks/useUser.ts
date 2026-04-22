import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userApi, authApi } from '@/features/auth/api/auth.api';
import { useAuthStore } from '@/features/auth/store/auth.store';
import type { ApiResponse, User, UpdateProfileRequest } from '@/shared/types';

export function useUser() {
  const accessToken = useAuthStore((state) => state.accessToken);

  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const response = await authApi.getCurrentUser();
      return response;
    },
    enabled: !!accessToken,
    staleTime: 5 * 60 * 1000,
    gcTime: Infinity,
    select: (data: ApiResponse<User>) => data.data,
  });
}

export function useUpdateProfile() {
  const queryClient = useQueryClient();
  const updateUser = useAuthStore((state) => state.updateUser);

  return useMutation({
    mutationFn: async (data: UpdateProfileRequest) => {
      const response = await userApi.updateProfile(data);
      return response;
    },
    onSuccess: (response: ApiResponse<User>) => {
      if (response.data) {
        updateUser(response.data);
        queryClient.invalidateQueries({ queryKey: ['user'] });
        toast.success('Profil berhasil diperbarui!');
      }
    },
    onError: (error: { response?: { data?: { message?: string } } }) => {
      toast.error(error.response?.data?.message || 'Gagal memperbarui profil');
    },
  });
}
