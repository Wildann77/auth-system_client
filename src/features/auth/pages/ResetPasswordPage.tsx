import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, CheckCircle, XCircle, Loader2, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useResetPassword } from '../hooks/mutations/useLogin';
import { resetPasswordSchema, type ResetPasswordFormData } from '../types/auth.types';
import { calculatePasswordStrength } from '@/shared/lib/utils';

const PASSWORD_RULES: { label: string; test: (pw: string) => boolean }[] = [
  { label: 'Minimal 8 karakter', test: (pw) => pw.length >= 8 },
  { label: '1 huruf besar', test: (pw) => /[A-Z]/.test(pw) },
  { label: '1 huruf kecil', test: (pw) => /[a-z]/.test(pw) },
  { label: '1 angka', test: (pw) => /[0-9]/.test(pw) },
  { label: '1 karakter spesial', test: (pw) => /[!@#$%^&*(),.?":{}|<>]/.test(pw) },
];

export default function ResetPasswordPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const resetPassword = useResetPassword();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const token = searchParams.get('token');

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
    defaultValues: { password: '', confirmPassword: '' },
  });

  useEffect(() => {
    if (!token) navigate('/forgot-password');
  }, [token, navigate]);

  const password = watch('password') || '';
  const passwordStrength = calculatePasswordStrength(password);

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;
    await resetPassword.mutateAsync({ token, password: data.password } as any);
  };

  const strengthColors: Record<number, string> = {
    0: 'bg-destructive', 1: 'bg-destructive',
    2: 'bg-warning', 3: 'bg-warning',
    4: 'bg-success', 5: 'bg-success',
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background bg-mesh p-4">
        <div className="glass rounded-2xl p-12 flex items-center gap-3 animate-pulse">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
          <span className="text-muted-foreground">Memuat...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-background bg-mesh p-4">
      <div className="w-full max-w-md animate-scale-in">

        {/* Card */}
        <div className="glass rounded-2xl p-8 space-y-6">

          {/* Icon */}
          <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center">
            <Lock className="h-7 w-7 text-primary" />
          </div>

          {/* Header */}
          <div>
            <h1 className="text-2xl font-bold mb-1.5">Buat Password Baru</h1>
            <p className="text-muted-foreground text-sm">
              Buat password yang kuat untuk mengamankan akun Anda.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            {/* New Password */}
            <div className="space-y-1.5">
              <Label htmlFor="password">Password Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register('password')}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.password && (
                <p className="text-xs text-destructive">{errors.password.message}</p>
              )}
            </div>

            {/* Strength */}
            {password && (
              <div className="space-y-2 animate-fade-in">
                <div className="flex justify-between text-xs">
                  <span className="text-muted-foreground">Kekuatan password:</span>
                  <span className={
                    passwordStrength.score < 2 ? 'text-destructive' :
                    passwordStrength.score < 4 ? 'text-warning' : 'text-success'
                  }>{passwordStrength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all duration-300 ${strengthColors[passwordStrength.score] ?? 'bg-destructive'}`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
                <div className="grid grid-cols-2 gap-x-4 gap-y-1 pt-1">
                  {PASSWORD_RULES.map(({ label, test }) => {
                    const passed = test(password);
                    return (
                      <div key={label} className="flex items-center gap-1.5 text-xs">
                        {passed
                          ? <CheckCircle className="h-3 w-3 text-success shrink-0" />
                          : <XCircle className="h-3 w-3 text-muted-foreground shrink-0" />
                        }
                        <span className={passed ? 'text-success' : 'text-muted-foreground'}>{label}</span>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
                <Input
                  id="confirmPassword"
                  type={showConfirmPassword ? 'text' : 'password'}
                  placeholder="••••••••"
                  className="pl-10 pr-10"
                  {...register('confirmPassword')}
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-xs text-destructive">{errors.confirmPassword.message}</p>
              )}
            </div>

            <Button
              type="submit"
              className="w-full glow-primary"
              size="lg"
              disabled={resetPassword.isPending}
            >
              {resetPassword.isPending ? 'Menyimpan...' : (
                <>
                  Reset Password <ArrowRight className="ml-2 h-4 w-4" />
                </>
              )}
            </Button>
          </form>

          <p className="text-xs text-muted-foreground text-center">
            Ingat password lama Anda?{' '}
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
