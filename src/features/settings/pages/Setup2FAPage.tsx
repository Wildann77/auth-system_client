import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Shield, CheckCircle, Copy, Eye, EyeOff, AlertTriangle } from 'lucide-react';
import { QRCodeSVG } from 'qrcode.react';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/shared/components/ui/dialog';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useEnable2FA, useConfirm2FA, useDisable2FA } from '@/features/auth/hooks/mutations/use2fa';
import { enable2FASchema, confirm2FASchema, disable2FASchema, type Enable2FAFormData, type Confirm2FAFormData, type Disable2FAFormData } from '@/features/auth/types/auth.types';
import { toast } from 'sonner';

export default function Setup2FAPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const enable2FA = useEnable2FA();
  const confirm2FA = useConfirm2FA();
  const disable2FA = useDisable2FA();

  const [step, setStep] = useState<'initial' | 'qrcode' | 'confirm' | 'disabled'>('initial');
  const [qrCode, setQrCode] = useState<string>('');
  const [backupCodes, setBackupCodes] = useState<string[]>([]);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [showDisableModal, setShowDisableModal] = useState(false);
  const [password, setPassword] = useState('');

  const confirmForm = useForm<Confirm2FAFormData>({
    resolver: zodResolver(confirm2FASchema),
    defaultValues: { code: '' },
  });

  const disableForm = useForm<Disable2FAFormData>({
    resolver: zodResolver(disable2FASchema),
    defaultValues: { code: '', password: '' },
  });

  const handleEnable2FA = async () => {
    try {
      const response = await enable2FA.mutateAsync(password);
      if (response.data) {
        setQrCode(response.data.qrCode);
        setBackupCodes(response.data.backupCodes);
        setStep('qrcode');
      }
      setShowPasswordModal(false);
      setPassword('');
    } catch {
      // Error handled in mutation
    }
  };

  const handleConfirm2FA = async (data: Confirm2FAFormData) => {
    await confirm2FA.mutateAsync(data.code);
    setStep('confirm');
  };

  const handleDisable2FA = async (data: Disable2FAFormData) => {
    await disable2FA.mutateAsync({ code: data.code, password: data.password });
    setShowDisableModal(false);
    setStep('disabled');
  };

  const copyBackupCodes = () => {
    navigator.clipboard.writeText(backupCodes.join('\n'));
    toast.success('Backup codes berhasil disalin!');
  };

  if (!user) {
    return <div>Loading...</div>;
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="ghost" onClick={() => navigate('/settings')}>
          ← Kembali
        </Button>
        <div>
          <h1 className="text-3xl font-bold">Pengaturan 2FA</h1>
          <p className="text-muted-foreground mt-1">
            Kelola Two-Factor Authentication
          </p>
        </div>
      </div>

      <Card className="backdrop-blur-sm bg-white/5 border-white/10 max-w-2xl">
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Two-Factor Authentication
          </CardTitle>
          <CardDescription>
            {user.twoFactorEnabled
              ? '2FA sedang aktif. Nonaktifkan jika tidak diperlukan.'
              : 'Tambahkan lapisan keamanan tambahan untuk akun Anda.'}
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg bg-muted/50">
            <div className="flex items-center gap-3">
              <Shield className={`h-10 w-10 ${user.twoFactorEnabled ? 'text-green-500' : 'text-muted-foreground'}`} />
              <div>
                <p className="font-medium text-lg">Status 2FA</p>
                <p className="text-sm text-muted-foreground">
                  {user.twoFactorEnabled ? 'Aktif dan melindungi akun Anda' : 'Belum diaktifkan'}
                </p>
              </div>
            </div>
            <Badge variant={user.twoFactorEnabled ? 'success' : 'secondary'} className="text-sm">
              {user.twoFactorEnabled ? 'Aktif' : 'Nonaktif'}
            </Badge>
          </div>

          {!user.twoFactorEnabled ? (
            <div className="space-y-4">
              <div className="text-sm text-muted-foreground space-y-2">
                <p>Untuk mengaktifkan 2FA:</p>
                <ol className="list-decimal list-inside space-y-1">
                  <li>Unduh aplikasi authenticator (Google Authenticator, Authy, dll)</li>
                  <li>Pindai QR code yang akan muncul</li>
                  <li>Masukkan kode verifikasi untuk konfirmasi</li>
                </ol>
              </div>

              <Button onClick={() => setShowPasswordModal(true)}>
                Aktifkan 2FA
              </Button>
            </div>
          ) : (
            <div className="space-y-4">
              <p className="text-sm text-muted-foreground">
                Jika Anda ingin menonaktifkan 2FA, Anda harus memasukkan kode dari aplikasi authenticator dan password Anda.
              </p>
              <Button variant="destructive" onClick={() => setShowDisableModal(true)}>
                Nonaktifkan 2FA
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Password Modal for Enable 2FA */}
      <Dialog open={showPasswordModal} onOpenChange={setShowPasswordModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Verifikasi Password</DialogTitle>
            <DialogDescription>
              Masukkan password Anda untuk melanjutkan
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="enable-password">Password</Label>
              <Input
                id="enable-password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPasswordModal(false)}>
                Batal
              </Button>
              <Button onClick={handleEnable2FA} disabled={enable2FA.isPending || !password}>
                {enable2FA.isPending ? 'Memuat...' : 'Lanjutkan'}
              </Button>
            </DialogFooter>
          </div>
        </DialogContent>
      </Dialog>

      {/* QR Code Modal */}
      <Dialog open={step === 'qrcode'} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Pindai QR Code</DialogTitle>
            <DialogDescription>
              Pindai QR code berikut dengan aplikasi authenticator Anda
            </DialogDescription>
          </DialogHeader>
          <div className="flex flex-col items-center space-y-4">
            <div className="p-4 bg-white rounded-lg">
              <QRCodeSVG value={qrCode} size={200} />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <Label>Backup Codes</Label>
                <Button variant="ghost" size="sm" onClick={copyBackupCodes}>
                  <Copy className="h-4 w-4 mr-1" />
                  Salin
                </Button>
              </div>
              <div className="grid grid-cols-2 gap-2 bg-muted p-3 rounded-lg">
                {backupCodes.map((code, i) => (
                  <code key={i} className="text-xs font-mono bg-background px-2 py-1 rounded">
                    {code}
                  </code>
                ))}
              </div>
              <p className="text-xs text-yellow-600 mt-2 flex items-center gap-1">
                <AlertTriangle className="h-3 w-3" />
                Simpan backup codes di tempat yang aman!
              </p>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Confirm 2FA Modal */}
      <Dialog open={step === 'confirm' || qrCode !== ''} onOpenChange={() => {}}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Verifikasi Kode</DialogTitle>
            <DialogDescription>
              Masukkan kode 6 digit dari aplikasi authenticator
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={confirmForm.handleSubmit(handleConfirm2FA)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="confirm-code">Kode Verifikasi</Label>
              <Input
                id="confirm-code"
                type="text"
                maxLength={6}
                placeholder="000000"
                className="text-center text-2xl tracking-widest"
                {...confirmForm.register('code')}
              />
              {confirmForm.formState.errors.code && (
                <p className="text-sm text-red-500">{confirmForm.formState.errors.code.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button type="submit" disabled={confirm2FA.isPending}>
                {confirm2FA.isPending ? 'Memuat...' : 'Verifikasi'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Disable 2FA Modal */}
      <Dialog open={showDisableModal} onOpenChange={setShowDisableModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nonaktifkan 2FA</DialogTitle>
            <DialogDescription>
              Masukkan kode dari authenticator dan password Anda
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={disableForm.handleSubmit(handleDisable2FA)} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="disable-code">Kode 2FA</Label>
              <Input
                id="disable-code"
                type="text"
                maxLength={6}
                placeholder="000000"
                {...disableForm.register('code')}
              />
              {disableForm.formState.errors.code && (
                <p className="text-sm text-red-500">{disableForm.formState.errors.code.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="disable-password">Password</Label>
              <Input
                id="disable-password"
                type="password"
                placeholder="••••••••"
                {...disableForm.register('password')}
              />
              {disableForm.formState.errors.password && (
                <p className="text-sm text-red-500">{disableForm.formState.errors.password.message}</p>
              )}
            </div>
            <DialogFooter>
              <Button variant="outline" type="button" onClick={() => setShowDisableModal(false)}>
                Batal
              </Button>
              <Button type="submit" variant="destructive" disabled={disable2FA.isPending}>
                {disable2FA.isPending ? 'Memuat...' : 'Nonaktifkan'}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}