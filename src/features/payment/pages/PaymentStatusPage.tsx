import { useEffect, useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useAuthStore } from '@/features/auth/store/auth.store';
import api from '@/shared/api/axios';
import type { ApiResponse, User } from '@/shared/types';

export default function PaymentStatusPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const updateUser = useAuthStore((state) => state.updateUser);
  const [status, setStatus] = useState<'loading' | 'success' | 'failed'>('loading');
  const [message, setMessage] = useState('');

  const orderId = searchParams.get('order_id') || searchParams.get('id');
  const isSuccess = window.location.pathname.includes('success');

  useEffect(() => {
    const verifyPayment = async () => {
      if (!isSuccess) {
        setStatus('failed');
        setMessage('Pembayaran dibatalkan atau gagal.');
        return;
      }

      try {
        // Polling or fetch latest user status to confirm premium
        const response = await api.get<ApiResponse<User>>('/auth/me');
        if (response.data?.data?.isPremium) {
          updateUser({ isPremium: true });
          setStatus('success');
          setMessage('Selamat! Akun Anda sekarang sudah Premium.');
        } else {
          // If not yet premium, maybe wait a bit or just show success if we trust the redirect
          setStatus('success');
          setMessage('Pembayaran sedang diproses. Status premium Anda akan aktif segera.');
        }
      } catch (error) {
        setStatus('success'); // Still show success if it's the success route
        setMessage('Terima kasih! Pembayaran Anda sedang diproses.');
      }
    };

    verifyPayment();
  }, [isSuccess, orderId, updateUser]);

  return (
    <div className="min-h-[80vh] flex items-center justify-center p-6">
      <Card className="max-w-md w-full backdrop-blur-sm bg-white/5 border-white/10 text-center">
        <CardHeader>
          <div className="flex justify-center mb-4">
            {status === 'loading' && <Loader2 className="h-16 w-16 animate-spin text-primary" />}
            {status === 'success' && <CheckCircle className="h-16 w-16 text-green-500" />}
            {status === 'failed' && <XCircle className="h-16 w-16 text-red-500" />}
          </div>
          <CardTitle className="text-2xl">
            {status === 'loading' && 'Memverifikasi Pembayaran...'}
            {status === 'success' && 'Pembayaran Berhasil!'}
            {status === 'failed' && 'Pembayaran Gagal'}
          </CardTitle>
          <CardDescription>
            Order ID: {orderId || 'Tidak diketahui'}
          </CardDescription>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">
            {message}
          </p>
        </CardContent>
        <CardFooter className="flex flex-col gap-2">
          <Button className="w-full" onClick={() => navigate('/dashboard')}>
            Ke Dashboard
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
          <Button variant="ghost" className="w-full" onClick={() => navigate('/premium')}>
            Lihat Detail Paket
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
