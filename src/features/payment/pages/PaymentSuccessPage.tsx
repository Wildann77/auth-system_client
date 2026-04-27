import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CheckCircle, ArrowRight, LayoutDashboard } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useAuthStore } from '@/features/auth/store/auth.store';

const PaymentSuccessPage: React.FC = () => {
  const initializeAuth = useAuthStore((state) => state.initializeAuth);

  useEffect(() => {
    // Refresh user session to get updated premium status from backend
    initializeAuth();
  }, [initializeAuth]);

  return (
    <div className="container max-w-2xl mx-auto py-20 px-4">
      <Card className="glass shadow-2xl border-primary/20 text-center animate-in fade-in zoom-in duration-500">
        <CardHeader>
          <div className="flex justify-center mb-6">
            <div className="rounded-full bg-primary/10 p-4 ring-8 ring-primary/5">
              <CheckCircle className="h-16 w-16 text-primary" />
            </div>
          </div>
          <CardTitle className="text-3xl font-bold tracking-tight">Pembayaran Berhasil!</CardTitle>
          <CardDescription className="text-lg mt-2">
            Terima kasih telah berlangganan Premium. Akun Anda telah berhasil diperbarui.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4 py-6">
          <p className="text-muted-foreground">
            Sekarang Anda memiliki akses penuh ke fitur eksklusif, konten premium, 
            dan dukungan prioritas kami.
          </p>
          <div className="bg-primary/5 rounded-lg p-4 border border-primary/10 flex items-start gap-3 text-left">
            <div className="bg-primary/20 rounded-full p-1 mt-0.5">
              <ArrowRight className="h-4 w-4 text-primary" />
            </div>
            <p className="text-sm">
              Status premium Anda sudah aktif. Klik tombol di bawah untuk mulai menjelajah.
            </p>
          </div>
        </CardContent>
        <CardFooter className="flex flex-col sm:flex-row gap-3 justify-center pb-10">
          <Button asChild size="lg" className="w-full sm:w-auto shadow-lg shadow-primary/20">
            <Link to="/dashboard">
              <LayoutDashboard className="mr-2 h-4 w-4" />
              Ke Dashboard
            </Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="w-full sm:w-auto glass">
            <Link to="/content">
              Jelajahi Konten
            </Link>
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default PaymentSuccessPage;
