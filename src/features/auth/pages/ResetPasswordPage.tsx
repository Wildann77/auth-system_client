import { useState, useEffect } from 'react';
import { Link, useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Lock, CheckCircle, XCircle, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { useResetPassword } from '../hooks/mutations/useLogin';
import { resetPasswordSchema, type ResetPasswordFormData } from '../types/auth.types';
import { calculatePasswordStrength } from '@/shared/lib/utils';

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
    defaultValues: {
      password: '',
      confirmPassword: '',
    },
  });

  useEffect(() => {
    if (!token) {
      navigate('/forgot-password');
    }
  }, [token, navigate]);

  const password = watch('password');
  const passwordStrength = calculatePasswordStrength(password || '');

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!token) return;

    await resetPassword.mutateAsync({
      token,
      password: data.password,
    } as { token: string; password: string });
  };

  if (!token) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
        <Card className="w-full max-w-md backdrop-blur-sm bg-white/5 border-white/10">
          <CardContent className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 p-4">
      <Card className="w-full max-w-md backdrop-blur-sm bg-white/5 border-white/10">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-bold text-center">Reset Password</CardTitle>
          <CardDescription className="text-center">
            Buat password baru untuk akun Anda
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="password">Password Baru</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.password && (
                <p className="text-sm text-red-500">{errors.password.message}</p>
              )}
            </div>

            {password && (
              <div className="space-y-1">
                <div className="flex justify-between text-sm">
                  <span>Kekuatan password:</span>
                  <span className={passwordStrength.color}>{passwordStrength.label}</span>
                </div>
                <div className="h-1.5 w-full bg-muted rounded-full overflow-hidden">
                  <div
                    className={`h-full transition-all ${
                      passwordStrength.score < 2 ? 'bg-red-500' :
                      passwordStrength.score < 4 ? 'bg-yellow-500' : 'bg-green-500'
                    }`}
                    style={{ width: `${(passwordStrength.score / 5) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="space-y-2">
              <Label htmlFor="confirmPassword">Konfirmasi Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
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
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="h-4 w-4" />
                  ) : (
                    <Eye className="h-4 w-4" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
              )}
            </div>

            <div className="text-sm text-muted-foreground space-y-1">
              <p>Password harus memiliki:</p>
              <ul className="list-disc list-inside space-y-0.5">
                <li className={password?.length >= 8 ? 'text-green-500' : ''}>
                  <span className="flex items-center gap-1">
                    {password?.length >= 8 ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3" />}
                    Minimal 8 karakter
                  </span>
                </li>
                <li className={/[A-Z]/.test(password || '') ? 'text-green-500' : ''}>
                  <span className="flex items-center gap-1">
                    {/[A-Z]/.test(password || '') ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3" />}
                    1 huruf besar
                  </span>
                </li>
                <li className={/[a-z]/.test(password || '') ? 'text-green-500' : ''}>
                  <span className="flex items-center gap-1">
                    {/[a-z]/.test(password || '') ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3" />}
                    1 huruf kecil
                  </span>
                </li>
                <li className={/[0-9]/.test(password || '') ? 'text-green-500' : ''}>
                  <span className="flex items-center gap-1">
                    {/[0-9]/.test(password || '') ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3" />}
                    1 angka
                  </span>
                </li>
                <li className={/[!@#$%^&*(),.?":{}|<>]/.test(password || '') ? 'text-green-500' : ''}>
                  <span className="flex items-center gap-1">
                    {/[!@#$%^&*(),.?":{}|<>]/.test(password || '') ? <CheckCircle className="h-3 w-3 text-green-500" /> : <XCircle className="h-3 w-3" />}
                    1 karakter spesial
                  </span>
                </li>
              </ul>
            </div>

            <Button type="submit" className="w-full" disabled={resetPassword.isPending}>
              {resetPassword.isPending ? 'Memuat...' : 'Reset Password'}
            </Button>
          </form>
        </CardContent>
        <CardFooter className="flex flex-col space-y-2">
          <Link
            to="/login"
            className="text-sm text-muted-foreground hover:text-foreground"
          >
            Kembali ke halaman masuk
          </Link>
        </CardFooter>
      </Card>
    </div>
  );
}
