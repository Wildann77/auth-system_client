import { Link } from 'react-router-dom';
import { zodResolver } from '@hookform/resolvers/zod';
import { Mail, ArrowLeft, ArrowRight, Shield, SendHorizonal } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useForgotPassword } from '../hooks/mutations/useLogin';
import { forgotPasswordSchema, type ForgotPasswordFormData } from '../types/auth.types';
import { useForm } from 'react-hook-form';

export default function ForgotPasswordPage() {
  const forgotPassword = useForgotPassword();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' },
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    await forgotPassword.mutateAsync(data);
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-mesh p-4">
      <div className="w-full max-w-md animate-scale-in">

        {/* Back link */}
        <Link
          to="/login"
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground transition-colors mb-8"
        >
          <ArrowLeft className="h-4 w-4" />
          Kembali ke halaman masuk
        </Link>

        {/* Card */}
        <div className="glass rounded-2xl p-8 space-y-6">

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <SendHorizonal className="h-7 w-7 text-primary" />
          </div>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold mb-1.5">Lupa Password?</h1>
            <p className="text-muted-foreground text-sm leading-relaxed">
              Tidak masalah. Masukkan email Anda dan kami akan mengirimkan link untuk mereset password.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="email">Alamat Email</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="email"
                  type="email"
                  placeholder="nama@email.com"
                  className="pl-10"
                  {...register('email')}
                />
              </div>
              {errors.email && (
                <p className="text-xs text-destructive">{errors.email.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full glow-primary"
              size="lg"
              disabled={forgotPassword.isPending}
            >
              {forgotPassword.isPending ? 'Mengirim...' : (
                <>
                  Kirim Link Reset <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          {/* Footer hint */}
          <p className="text-xs text-muted-foreground text-center">
            Ingat password Anda?{' '}
            <Link to="/login" className="text-primary hover:underline font-medium">
              Masuk
            </Link>
          </p>
        </div>

        {/* AuthApp logo */}
        <div className="flex items-center justify-center gap-2 mt-8">
          <div className="p-1 rounded-md bg-primary/10">
            <Shield className="h-3.5 w-3.5 text-primary" />
          </div>
          <span className="text-xs text-muted-foreground font-medium">AuthApp</span>
        </div>
      </div>
    </div>
  );
}
