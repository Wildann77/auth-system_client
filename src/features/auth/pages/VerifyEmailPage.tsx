import { useEffect, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { CheckCircle, XCircle, Loader2, Mail } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useVerifyEmail } from '../hooks/mutations/useRegister';
import { useResendVerification } from '../hooks/mutations/useRegister';

export default function VerifyEmailPage() {
  const [searchParams] = useSearchParams();
  const verifyEmail = useVerifyEmail();
  const resendVerification = useResendVerification();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [canResend, setCanResend] = useState(false);

  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      verifyEmail.mutateAsync(token)
        .then(() => setStatus('success'))
        .catch(() => setStatus('error'));
    } else {
      setStatus('error');
    }
  }, [token]);

  useEffect(() => {
    if (status !== 'loading') {
      const timer = setTimeout(() => setCanResend(true), 5000);
      return () => clearTimeout(timer);
    }
  }, [status]);

  const handleResend = async () => {
    // In a real app, you would need the email from somewhere
    // For now, just show a success message
    setCanResend(false);
    setTimeout(() => setCanResend(true), 60000);
  };

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
        <Card className="w-full max-w-md glass shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Loader2 className="h-12 w-12 animate-spin text-primary" />
            <p className="text-muted-foreground">Memverifikasi email...</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
      <Card className="w-full max-w-md glass shadow-md">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {status === 'success' ? (
              <div className="h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600 dark:text-green-400" />
              </div>
            ) : (
              <div className="h-16 w-16 rounded-full bg-red-100 dark:bg-red-900 flex items-center justify-center">
                <XCircle className="h-8 w-8 text-red-600 dark:text-red-400" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {status === 'success' ? 'Email Diverifikasi!' : 'Verifikasi Gagal'}
          </CardTitle>
          <CardDescription>
            {status === 'success'
              ? 'Email Anda telah berhasil diverifikasi. Sekarang Anda bisa masuk ke akun.'
              : 'Terjadi kesalahan saat memverifikasi email. Silakan coba lagi atau hubungi support.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          {status === 'success' ? (
            <Button asChild className="w-full">
              <Link to="/login">Masuk Sekarang</Link>
            </Button>
          ) : (
            <div className="space-y-4">
              {canResend && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleResend}
                  disabled={resendVerification.isPending}
                >
                  <Mail className="mr-2 h-4 w-4" />
                  {resendVerification.isPending ? 'Mengirim...' : 'Kirim Ulang Email Verifikasi'}
                </Button>
              )}
              <Button asChild variant="secondary" className="w-full">
                <Link to="/login">Kembali ke Halaman Masuk</Link>
              </Button>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
