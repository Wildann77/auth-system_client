import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Eye, EyeOff, Mail, Lock, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { useLogin } from '../hooks/mutations/useLogin';
import { loginSchema, type LoginFormData } from '../types/auth.types';
import { authApi } from '../api/auth.api';

export default function LoginPage() {
  const [searchParams] = useSearchParams();
  const login = useLogin();
  const [showPassword, setShowPassword] = useState(false);
  const [showOTP, setShowOTP] = useState(false);
  const [requires2FA, setRequires2FA] = useState(false);
  const [pendingCredentials, setPendingCredentials] = useState<{ email: string; password: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: searchParams.get('email') || '',
      password: '',
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    if (requires2FA && !data.otp) {
      setShowOTP(true);
      return;
    }
    try {
      const result = await login.mutateAsync(data);
      if (result.data?.requires2FA) {
        setRequires2FA(true);
        setPendingCredentials({ email: data.email, password: data.password });
        setShowOTP(true);
        return;
      }
    } catch (error: any) {
      if (error.response?.status === 400 && error.response?.data?.message?.includes('2FA code required')) {
        setRequires2FA(true);
        setPendingCredentials({ email: data.email, password: data.password });
        setShowOTP(true);
        return;
      }
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = authApi.getGoogleAuthUrl();
  };

  const handleOTPComplete = async (otp: string) => {
    if (!pendingCredentials) return;
    try {
      await login.mutateAsync({
        email: pendingCredentials.email,
        password: pendingCredentials.password,
        otp,
      });
    } catch {
      // Error toast handled by useLogin.ts
    }
  };

  return (
    <div className="min-h-screen flex bg-background bg-mesh">

      {/* ── Left Panel — Branding ── */}
      <div className="hidden lg:flex lg:w-1/2 relative overflow-hidden items-center justify-center p-12">
        <div className="relative z-10 flex flex-col items-start max-w-md animate-fade-in">
          <div className="flex items-center gap-2.5 mb-12">
            <div className="p-2 rounded-xl bg-primary/15">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <span className="text-xl font-bold">AuthApp</span>
          </div>
          <h2 className="text-4xl font-bold leading-tight mb-4">
            Selamat datang
            <br />
            <span className="text-gradient-primary">kembali!</span>
          </h2>
          <p className="text-muted-foreground text-lg leading-relaxed mb-10">
            Masuk ke akun Anda dan nikmati semua fitur autentikasi yang aman dan mudah.
          </p>
          <div className="space-y-3 w-full">
            {['2FA & enkripsi end-to-end', 'Login Google OAuth', 'Konten Premium eksklusif'].map((item) => (
              <div key={item} className="glass rounded-xl px-4 py-3 flex items-center gap-3 animate-slide-in-right">
                <div className="h-1.5 w-1.5 rounded-full bg-primary shrink-0" />
                <span className="text-sm">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* ── Right Panel — Form ── */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md animate-scale-in">

          {/* Mobile logo */}
          <div className="flex items-center gap-2.5 mb-8 lg:hidden">
            <div className="p-1.5 rounded-lg bg-primary/10">
              <Shield className="h-5 w-5 text-primary" />
            </div>
            <span className="text-lg font-bold">AuthApp</span>
          </div>

          <div className="mb-8">
            <h1 className="text-3xl font-bold mb-1">Masuk</h1>
            <p className="text-muted-foreground">Masuk ke akun Anda untuk melanjutkan</p>
          </div>

          {/* OTP View */}
          {showOTP ? (
            <div className="space-y-6 animate-scale-in">
              <div className="glass rounded-2xl p-6 text-center space-y-2">
                <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-7 w-7 text-primary" />
                </div>
                <p className="font-semibold">Verifikasi 2FA</p>
                <p className="text-sm text-muted-foreground">
                  Masukkan kode 6 digit dari aplikasi authenticator Anda
                </p>
              </div>
              <OTPInput
                length={6}
                onComplete={handleOTPComplete}
                disabled={login.isPending}
              />
              <Button
                variant="ghost"
                className="w-full text-muted-foreground"
                onClick={() => { setShowOTP(false); setRequires2FA(false); }}
              >
                ← Kembali ke login
              </Button>
            </div>
          ) : (
            /* Login Form */
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
              <div className="space-y-1.5">
                <Label htmlFor="email">Email</Label>
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

              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link
                    to="/forgot-password"
                    className="text-xs text-primary hover:underline"
                  >
                    Lupa password?
                  </Link>
                </div>
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

              <Button type="submit" className="w-full glow-primary" size="lg" disabled={login.isPending}>
                {login.isPending ? 'Memproses...' : (
                  <>
                    Masuk <ArrowRight className="ml-2 h-4 w-4" />
                  </>
                )}
              </Button>

              <div className="relative my-2">
                <div className="absolute inset-0 flex items-center">
                  <span className="w-full border-t border-border" />
                </div>
                <div className="relative flex justify-center text-xs">
                  <span className="bg-background px-3 text-muted-foreground">atau</span>
                </div>
              </div>

              <Button
                type="button"
                variant="outline"
                className="w-full glass"
                size="lg"
                onClick={handleGoogleLogin}
              >
                <svg className="mr-2 h-4 w-4 shrink-0" viewBox="0 0 24 24">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
                </svg>
                Masuk dengan Google
              </Button>

              <p className="text-sm text-muted-foreground text-center">
                Belum punya akun?{' '}
                <Link to="/register" className="text-primary font-medium hover:underline">
                  Daftar gratis
                </Link>
              </p>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}

/* ── OTP Input Component ── */
function OTPInput({
  length = 6,
  onComplete,
  disabled,
}: {
  length?: number;
  onComplete: (otp: string) => void;
  disabled?: boolean;
}) {
  const [otp, setOtp] = useState<string[]>(new Array(length).fill(''));

  const handleChange = (element: HTMLInputElement, index: number) => {
    if (!/^\d*$/.test(element.value)) return;
    const newOtp = [...otp];
    newOtp[index] = element.value.slice(-1);
    setOtp(newOtp);
    if (element.value && index < length - 1) {
      const container = element.closest('.flex');
      const inputs = container?.querySelectorAll('input');
      (inputs?.[index + 1] as HTMLInputElement | undefined)?.focus();
    }
    if (newOtp.every((d) => d !== '')) onComplete(newOtp.join(''));
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const data = e.clipboardData.getData('text').slice(0, length).replace(/\D/g, '');
    const newOtp = [...otp];
    data.split('').forEach((char, i) => { newOtp[i] = char; });
    setOtp(newOtp);
    if (data.length === length) onComplete(data);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      const container = e.currentTarget.closest('.flex');
      const inputs = container?.querySelectorAll('input');
      (inputs?.[index - 1] as HTMLInputElement | undefined)?.focus();
    }
  };

  return (
    <div className="flex justify-center gap-2">
      {otp.map((digit, index) => (
        <input
          key={index}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={digit}
          onChange={(e) => handleChange(e.target, index)}
          onKeyDown={(e) => handleKeyDown(e, index)}
          onPaste={handlePaste}
          className="w-12 h-14 text-center text-xl font-bold border border-input rounded-xl bg-background focus:outline-none focus:ring-2 focus:ring-primary transition-all disabled:opacity-50"
          disabled={disabled}
        />
      ))}
    </div>
  );
}
