import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { User, Lock, Shield, Save, Eye, EyeOff, Loader2 } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/shared/components/ui/tabs';
import { Badge } from '@/shared/components/ui/badge';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useUpdateProfile } from '@/features/user/hooks/useUser';
import { useChangePassword } from '@/features/auth/hooks/mutations/use2fa';
import { updateProfileSchema, changePasswordSchema, type UpdateProfileFormData, type ChangePasswordFormData } from '@/features/auth/types/auth.types';

export default function SettingsPage() {
  const user = useAuthStore((state) => state.user);
  const updateProfile = useUpdateProfile();
  const changePassword = useChangePassword();
  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);

  const profileForm = useForm<UpdateProfileFormData>({
    resolver: zodResolver(updateProfileSchema),
    defaultValues: {
      firstName: user?.firstName || '',
      lastName: user?.lastName || '',
    },
  });

  const passwordForm = useForm<ChangePasswordFormData>({
    resolver: zodResolver(changePasswordSchema),
    defaultValues: {
      currentPassword: '',
      newPassword: '',
      confirmNewPassword: '',
    },
  });

  const onProfileSubmit = async (data: UpdateProfileFormData) => {
    await updateProfile.mutateAsync(data);
  };

  const onPasswordSubmit = async (data: ChangePasswordFormData) => {
    await changePassword.mutateAsync({
      currentPassword: data.currentPassword,
      newPassword: data.newPassword,
    });
    passwordForm.reset();
  };

  if (!user) {
    return (
      <div className="p-6 flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Pengaturan</h1>
        <p className="text-muted-foreground mt-1">
          Kelola profil dan keamanan akun Anda
        </p>
      </div>

      <Tabs defaultValue="profile" className="w-full">
        <TabsList>
          <TabsTrigger value="profile">
            <User className="h-4 w-4 mr-2" />
            Profil
          </TabsTrigger>
          {user.provider === 'LOCAL' && (
            <TabsTrigger value="security">
              <Lock className="h-4 w-4 mr-2" />
              Keamanan
            </TabsTrigger>
          )}
          <TabsTrigger value="2fa">
            <Shield className="h-4 w-4 mr-2" />
            2FA
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile" className="mt-6">
          <Card className="glass shadow-md">
            <CardHeader>
              <CardTitle>Informasi Profil</CardTitle>
              <CardDescription>
                Perbarui informasi profil Anda
              </CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Nama Depan</Label>
                    <Input
                      id="firstName"
                      {...profileForm.register('firstName')}
                    />
                    {profileForm.formState.errors.firstName && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.firstName.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nama Belakang</Label>
                    <Input
                      id="lastName"
                      {...profileForm.register('lastName')}
                    />
                    {profileForm.formState.errors.lastName && (
                      <p className="text-sm text-red-500">
                        {profileForm.formState.errors.lastName.message}
                      </p>
                    )}
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={user.email}
                    disabled
                    className="bg-muted"
                  />
                  <p className="text-sm text-muted-foreground">
                    Email tidak dapat diubah
                  </p>
                </div>

                <div className="flex items-center gap-2">
                  <Badge variant={user.isEmailVerified ? 'success' : 'warning'}>
                    {user.isEmailVerified ? 'Terverifikasi' : 'Belum Terverifikasi'}
                  </Badge>
                  <span className="text-sm text-muted-foreground">
                    {user.provider === 'GOOGLE' ? `Login dengan ${user.provider}` : 'Login dengan email'}
                  </span>
                </div>

                <Button type="submit" disabled={updateProfile.isPending}>
                  <Save className="h-4 w-4 mr-2" />
                  {updateProfile.isPending ? 'Menyimpan...' : 'Simpan Perubahan'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {user.provider === 'LOCAL' && (
          <TabsContent value="security" className="mt-6">
            <Card className="glass shadow-md">
              <CardHeader>
                <CardTitle>Ubah Password</CardTitle>
                <CardDescription>
                  Perbarui password Anda secara berkala untuk keamanan
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={passwordForm.handleSubmit(onPasswordSubmit)} className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="currentPassword">Password Saat Ini</Label>
                    <div className="relative">
                      <Input
                        id="currentPassword"
                        type={showCurrentPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...passwordForm.register('currentPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowCurrentPassword(!showCurrentPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showCurrentPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.currentPassword && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.currentPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="newPassword">Password Baru</Label>
                    <div className="relative">
                      <Input
                        id="newPassword"
                        type={showNewPassword ? 'text' : 'password'}
                        placeholder="••••••••"
                        {...passwordForm.register('newPassword')}
                      />
                      <button
                        type="button"
                        onClick={() => setShowNewPassword(!showNewPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
                      >
                        {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {passwordForm.formState.errors.newPassword && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.newPassword.message}
                      </p>
                    )}
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="confirmNewPassword">Konfirmasi Password Baru</Label>
                    <Input
                      id="confirmNewPassword"
                      type="password"
                      placeholder="••••••••"
                      {...passwordForm.register('confirmNewPassword')}
                    />
                    {passwordForm.formState.errors.confirmNewPassword && (
                      <p className="text-sm text-red-500">
                        {passwordForm.formState.errors.confirmNewPassword.message}
                      </p>
                    )}
                  </div>

                  <Button type="submit" disabled={changePassword.isPending}>
                    <Lock className="h-4 w-4 mr-2" />
                    {changePassword.isPending ? 'Menyimpan...' : 'Ubah Password'}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </TabsContent>
        )}

        <TabsContent value="2fa" className="mt-6">
          <Card className="glass shadow-md">
            <CardHeader>
              <CardTitle>Two-Factor Authentication (2FA)</CardTitle>
              <CardDescription>
                Tambahkan lapisan keamanan tambahan dengan 2FA
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Shield className={`h-8 w-8 ${user.twoFactorEnabled ? 'text-green-500' : 'text-muted-foreground'}`} />
                  <div>
                    <p className="font-medium">Status 2FA</p>
                    <p className="text-sm text-muted-foreground">
                      {user.twoFactorEnabled ? '2FA sedang aktif' : '2FA belum diaktifkan'}
                    </p>
                  </div>
                </div>
                <Badge variant={user.twoFactorEnabled ? 'success' : 'secondary'}>
                  {user.twoFactorEnabled ? 'Aktif' : 'Nonaktif'}
                </Badge>
              </div>

              <div className="text-sm text-muted-foreground">
                {user.twoFactorEnabled ? (
                  <p>
                    2FA sedang melindungi akun Anda. Gunakan aplikasi authenticator untuk mendapatkan kode verifikasi saat login.
                  </p>
                ) : (
                  <p>
                    Aktifkan 2FA untuk menambahkan lapisan keamanan tambahan. Anda akan memerlukan aplikasi authenticator seperti Google Authenticator atau Authy.
                  </p>
                )}
              </div>

              <Button asChild variant={user.twoFactorEnabled ? 'destructive' : 'default'}>
                <Link to="/settings/2fa">
                  {user.twoFactorEnabled ? 'Kelola 2FA' : 'Aktifkan 2FA'}
                </Link>
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}