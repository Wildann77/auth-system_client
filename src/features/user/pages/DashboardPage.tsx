import { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Settings,
  CreditCard,
  Crown,
  Shield,
  ChevronRight,
  CheckCircle,
  Clock,
  AlertTriangle,
  Loader2,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { formatDateTime } from '@/shared/lib/utils';
import { USER_ROLE, AUTH_PROVIDER } from '@/shared/constants';
import { toast } from 'sonner';

/* Greeting berdasarkan waktu */
const getGreeting = () => {
  const hour = new Date().getHours();
  if (hour < 11) return 'Selamat pagi';
  if (hour < 15) return 'Selamat siang';
  if (hour < 18) return 'Selamat sore';
  return 'Selamat malam';
};

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const handleCancelSubscription = async () => {
    setCancelling(true);
    try {
      const { paymentApi } = await import('@/features/auth/api/auth.api');
      await paymentApi.cancelSubscription();
      toast.success('Langganan berhasil dibatalkan. Akses Premium tetap aktif hingga akhir periode.');
      useAuthStore.getState().initializeAuth();
    } catch (e: any) {
      toast.error(e.response?.data?.message || 'Gagal membatalkan langganan');
    } finally {
      setCancelling(false);
      setShowCancelDialog(false);
    }
  };

  if (!user) return <DashboardSkeleton />;

  return (
    <div className="p-6 space-y-8">

      {/* ── Welcome Section ── */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 animate-slide-up">
        <div className="flex items-center gap-4">
          <div className="h-14 w-14 rounded-2xl bg-primary/10 flex items-center justify-center text-xl font-bold text-primary shrink-0">
            {user.firstName?.[0]?.toUpperCase() || user.email[0].toUpperCase()}
          </div>
          <div>
            <p className="text-sm text-muted-foreground">{getGreeting()},</p>
            <h1 className="text-2xl font-bold">
              {user.firstName ? `${user.firstName} ${user.lastName || ''}`.trim() : user.email.split('@')[0]}!
            </h1>
          </div>
        </div>
        {!user.isEmailVerified && (
          <Badge variant="warning" className="self-start md:self-auto text-sm gap-1.5 px-3 py-1.5">
            <Clock className="h-3.5 w-3.5" />
            Email belum diverifikasi
          </Badge>
        )}
      </div>

      {/* ── Quick Stats ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up animate-delay-100">

        {/* 2FA Status */}
        <Card className={`glass shadow-md border-l-4 ${user.twoFactorEnabled ? 'border-l-success' : 'border-l-warning'}`}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Keamanan 2FA</CardTitle>
            <Shield className={`h-4 w-4 ${user.twoFactorEnabled ? 'text-success' : 'text-warning'}`} />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {user.twoFactorEnabled
                ? <CheckCircle className="h-5 w-5 text-success" />
                : <AlertTriangle className="h-5 w-5 text-warning" />
              }
              <span className="font-semibold text-sm">
                {user.twoFactorEnabled ? '2FA Aktif' : '2FA Nonaktif'}
              </span>
            </div>
            {!user.twoFactorEnabled && (
              <p className="text-xs text-muted-foreground mt-1">
                Aktifkan untuk keamanan lebih
              </p>
            )}
          </CardContent>
        </Card>

        {/* Premium Status */}
        {user.role !== USER_ROLE.ADMIN && (
          <Card className={`glass shadow-md border-l-4 ${user.isPremium ? 'border-l-warning' : 'border-l-border'}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">Status Premium</CardTitle>
              <Crown className={`h-4 w-4 ${user.isPremium ? 'text-warning' : 'text-muted-foreground'}`} />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {user.isPremium
                  ? <Crown className="h-5 w-5 text-warning" />
                  : <CreditCard className="h-5 w-5 text-muted-foreground" />
                }
                <span className="font-semibold text-sm">
                  {user.isPremium ? 'Premium Aktif' : 'Free Plan'}
                </span>
              </div>
              {user.premiumUntil && (
                <p className="text-xs text-muted-foreground mt-1">
                  Berakhir: {formatDateTime(user.premiumUntil)}
                </p>
              )}
              {user.isPremium && (
                <p className="text-xs mt-1">
                  Perpanjangan:{' '}
                  <span className={user.autoRenew ? 'text-success font-medium' : 'text-destructive font-medium'}>
                    {user.autoRenew ? 'Aktif' : 'Nonaktif'}
                  </span>
                </p>
              )}
            </CardContent>
          </Card>
        )}

        {/* Provider */}
        <Card className="glass shadow-md border-l-4 border-l-info">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Metode Login</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge
              variant={user.provider === AUTH_PROVIDER.GOOGLE ? 'secondary' : 'outline'}
              className="text-sm px-3 py-1"
            >
              {user.provider === AUTH_PROVIDER.GOOGLE ? '🔵 Google' : '✉️ Email'}
            </Badge>
          </CardContent>
        </Card>

        {/* Last Login */}
        <Card className="glass shadow-md border-l-4 border-l-border">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-xs font-medium text-muted-foreground">Terakhir Login</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <p className="font-semibold text-sm">
              {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* ── Quick Actions ── */}
      <div className="space-y-3 animate-slide-up animate-delay-200">
        <h2 className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">Aksi Cepat</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">

          {/* Settings */}
          <Link to="/settings">
            <Card className="glass shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-primary/10">
                    <Settings className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-base">Pengaturan</CardTitle>
                </div>
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>Ubah profil, password, dan keamanan akun</CardDescription>
              </CardContent>
            </Card>
          </Link>

          {/* Upgrade to Premium (non-premium, non-admin) */}
          {user.role !== USER_ROLE.ADMIN && !user.isPremium && (
            <Link to="/premium">
              <Card className="glass-gold shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-warning/20">
                      <Crown className="h-5 w-5 text-warning" />
                    </div>
                    <CardTitle className="text-base">Upgrade Premium</CardTitle>
                  </div>
                  <ChevronRight className="h-4 w-4 text-warning" />
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>Akses konten eksklusif dan fitur premium</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Premium Content (premium users) */}
          {user.role !== USER_ROLE.ADMIN && user.isPremium && (
            <Link to="/content">
              <Card className="glass shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-warning/15">
                      <Crown className="h-5 w-5 text-warning" />
                    </div>
                    <CardTitle className="text-base">Konten Premium</CardTitle>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>Lihat konten eksklusif premium Anda</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )}

          {/* Cancel Subscription (premium + autoRenew) */}
          {user.role !== USER_ROLE.ADMIN && user.isPremium && user.autoRenew && (
            <Card
              className="glass shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer border-destructive/20"
              onClick={() => setShowCancelDialog(true)}
            >
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div className="flex items-center gap-3">
                  <div className="p-2.5 rounded-xl bg-destructive/10">
                    <CreditCard className="h-5 w-5 text-destructive" />
                  </div>
                  <CardTitle className="text-base text-destructive">Batalkan Langganan</CardTitle>
                </div>
              </CardHeader>
              <CardContent className="pt-0">
                <CardDescription>Hentikan perpanjangan otomatis</CardDescription>
              </CardContent>
            </Card>
          )}

          {/* Admin Panel */}
          {user.role === USER_ROLE.ADMIN && (
            <Link to="/admin">
              <Card className="glass shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all cursor-pointer">
                <CardHeader className="flex flex-row items-center justify-between pb-3">
                  <div className="flex items-center gap-3">
                    <div className="p-2.5 rounded-xl bg-primary/10">
                      <Shield className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">Admin Panel</CardTitle>
                  </div>
                  <ChevronRight className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent className="pt-0">
                  <CardDescription>Kelola pengguna dan lihat statistik sistem</CardDescription>
                </CardContent>
              </Card>
            </Link>
          )}
        </div>
      </div>

      {/* ── Cancel Subscription Dialog ── */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent className="glass max-w-sm">
          <DialogHeader>
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">Batalkan Langganan?</DialogTitle>
            <DialogDescription className="text-center">
              Perpanjangan otomatis akan dihentikan. Anda tetap dapat menikmati akses Premium hingga akhir periode berjalan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => setShowCancelDialog(false)}
              disabled={cancelling}
            >
              Tidak, Tetap Aktif
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={handleCancelSubscription}
              disabled={cancelling}
            >
              {cancelling ? (
                <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Memproses...</>
              ) : 'Ya, Batalkan'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-8">
      <div className="flex items-center gap-4">
        <Skeleton className="h-14 w-14 rounded-2xl" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-7 w-48" />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-28 rounded-xl" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-xl" />
        ))}
      </div>
    </div>
  );
}
