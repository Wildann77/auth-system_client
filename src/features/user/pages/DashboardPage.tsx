import { Link } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  CreditCard,
  Crown,
  Shield,
  ChevronRight,
  CheckCircle,
  Clock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Button } from '@/shared/components/ui/button';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { formatDateTime } from '@/shared/lib/utils';

export default function DashboardPage() {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="p-6 space-y-6">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            Selamat datang, {user.firstName || user.email.split('@')[0]}!
          </h1>
          <p className="text-muted-foreground mt-1">
            Berikut overview akun Anda
          </p>
        </div>
        {!user.isEmailVerified && (
          <Badge variant="warning" className="text-sm">
            <Clock className="h-4 w-4 mr-1" />
            Email belum diverifikasi
          </Badge>
        )}
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="glass shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Status</CardTitle>
            <Shield className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="flex items-center gap-2">
              {user.twoFactorEnabled ? (
                <>
                  <CheckCircle className="h-5 w-5 text-green-500" />
                  <span className="text-sm">2FA Aktif</span>
                </>
              ) : (
                <>
                  <Shield className="h-5 w-5 text-yellow-500" />
                  <span className="text-sm">2FA Nonaktif</span>
                </>
              )}
            </div>
          </CardContent>
        </Card>

        {user.role !== 'ADMIN' && (
          <Card className="glass shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Premium</CardTitle>
              <Crown className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2">
                {user.isPremium ? (
                  <>
                    <Crown className="h-5 w-5 text-yellow-500" />
                    <span className="text-sm">Premium Aktif</span>
                  </>
                ) : (
                  <>
                    <CreditCard className="h-5 w-5 text-muted-foreground" />
                    <span className="text-sm">Free Plan</span>
                  </>
                )}
              </div>
              {user.premiumUntil && (
                <p className="text-xs text-muted-foreground mt-1">
                  Berakhir: {formatDateTime(user.premiumUntil)}
                </p>
              )}
              {user.isPremium && (
                <p className="text-xs text-muted-foreground mt-1">
                  Perpanjangan Otomatis: <strong className={user.autoRenew ? 'text-green-500' : 'text-red-500'}>{user.autoRenew ? 'Aktif' : 'Nonaktif'}</strong>
                </p>
              )}
            </CardContent>
          </Card>
        )}

        <Card className="glass shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Provider</CardTitle>
          </CardHeader>
          <CardContent>
            <Badge variant={user.provider === 'GOOGLE' ? 'secondary' : 'outline'}>
              {user.provider}
            </Badge>
          </CardContent>
        </Card>

        <Card className="glass shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Terakhir Login</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm">
              {user.lastLoginAt ? formatDateTime(user.lastLoginAt) : '-'}
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <Link to="/settings">
          <Card className="glass shadow-md hover:shadow-lg transition-all cursor-pointer">
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Settings className="h-5 w-5 text-primary" />
                </div>
                <CardTitle className="text-lg">Pengaturan</CardTitle>
              </div>
              <ChevronRight className="h-5 w-5 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <CardDescription>
                Ubah profil, password, dan keamanan akun
              </CardDescription>
            </CardContent>
          </Card>
        </Link>

        {user.role !== 'ADMIN' && !user.isPremium && (
          <Link to="/premium">
            <Card className="backdrop-blur-sm bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20 hover:from-yellow-500/20 to-orange-500/20 transition-colors cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-yellow-500/20">
                    <Crown className="h-5 w-5 text-yellow-500" />
                  </div>
                  <CardTitle className="text-lg">Upgrade Premium</CardTitle>
                </div>
                <ChevronRight className="h-5 w-5 text-yellow-500" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Akses konten eksklusif dan fitur premium
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        )}

        {user.role !== 'ADMIN' && user.isPremium && (
          <Link to="/content">
            <Card className="glass shadow-md hover:shadow-lg transition-all cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-primary/10">
                    <Crown className="h-5 w-5 text-primary" />
                  </div>
                  <CardTitle className="text-lg">Konten Premium</CardTitle>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Lihat konten eksklusif premium
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        )}

        {user.role !== 'ADMIN' && user.isPremium && user.autoRenew && (
          <Card 
            className="glass shadow-md hover:shadow-lg transition-all cursor-pointer border-red-500/20"
            onClick={async () => {
              if (window.confirm('Apakah Anda yakin ingin membatalkan perpanjangan otomatis langganan Premium?')) {
                try {
                  const { paymentApi } = await import('@/features/auth/api/auth.api');
                  const { useAuthStore } = await import('@/features/auth/store/auth.store');
                  await paymentApi.cancelSubscription();
                  alert('Langganan berhasil dibatalkan. Anda tetap dapat menikmati akses Premium hingga akhir periode.');
                  useAuthStore.getState().initializeAuth();
                } catch (e: any) {
                  alert(e.response?.data?.message || 'Gagal membatalkan langganan');
                }
              }
            }}
          >
            <CardHeader className="flex flex-row items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-lg bg-red-500/10">
                  <CreditCard className="h-5 w-5 text-red-500" />
                </div>
                <CardTitle className="text-lg text-red-500">Batalkan Langganan</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <CardDescription>
                Hentikan perpanjangan otomatis
              </CardDescription>
            </CardContent>
          </Card>
        )}

        {user.role === 'ADMIN' && (
          <Link to="/admin">
            <Card className="glass shadow-md hover:shadow-lg transition-all cursor-pointer">
              <CardHeader className="flex flex-row items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-purple-500/10">
                    <Shield className="h-5 w-5 text-purple-500" />
                  </div>
                  <CardTitle className="text-lg">Admin Panel</CardTitle>
                </div>
                <ChevronRight className="h-5 w-5 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <CardDescription>
                  Kelola pengguna dan lihat statistik
                </CardDescription>
              </CardContent>
            </Card>
          </Link>
        )}
      </div>
    </div>
  );
}

function DashboardSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <Skeleton className="h-9 w-64" />
        <Skeleton className="h-5 w-48 mt-2" />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32" />
        ))}
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-40" />
        ))}
      </div>
    </div>
  );
}
