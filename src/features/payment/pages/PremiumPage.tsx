import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, CreditCard, CheckCircle, Loader2, Shield } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { paymentApi } from '@/features/auth/api/auth.api';
import { toast } from 'sonner';
import { PAYMENT_CONSTANTS } from '../constants';

const PREMIUM_PRICE = PAYMENT_CONSTANTS.PREMIUM_UPGRADE_PRICE; // Rp 99,000

const FEATURES = [
  'Akses konten eksklusif premium',
  'Download tanpa batasan',
  'Priority support 24/7',
  'Early access ke fitur baru',
  'Analitik lanjutan',
  'Tidak ada iklan',
];

export default function PremiumPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [provider, setProvider] = useState<'midtrans' | 'stripe'>('midtrans');
  const [isLoading, setIsLoading] = useState(false);

  const handleUpgrade = async () => {
    if (!user) return;

    setIsLoading(true);
    try {
      const response = await paymentApi.checkout({
        amount: PREMIUM_PRICE,
        provider,
        orderType: 'PREMIUM_UPGRADE',
        items: [
          {
            id: 'premium-monthly',
            name: 'Premium Monthly',
            price: PREMIUM_PRICE,
            quantity: 1,
          },
        ],
      });

      if (response.data) {
        if (provider === 'midtrans' && response.data.snapUrl) {
          window.location.href = response.data.snapUrl;
        } else if (provider === 'stripe' && response.data.checkoutUrl) {
          window.location.href = response.data.checkoutUrl;
        } else {
          toast.success('Pesanan dibuat! Mohon refresh halaman setelah payment.');
          updateUser({ isPremium: true });
        }
      }
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } } };
      toast.error(err.response?.data?.message || 'Gagal membuat pesanan');
    } finally {
      setIsLoading(false);
    }
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
      <div className="text-center max-w-2xl mx-auto">
        <div className="flex justify-center mb-4">
          <div className="p-4 rounded-full bg-yellow-500/20">
            <Crown className="h-12 w-12 text-yellow-500" />
          </div>
        </div>
        <h1 className="text-4xl font-bold">Upgrade ke Premium</h1>
        <p className="text-muted-foreground mt-4 text-lg">
          Dapatkan akses ke semua konten premium dan fitur eksklusif
        </p>
        {user.isPremium && (
          <Badge variant="success" className="mt-4 text-sm">
            Anda sudah Premium
          </Badge>
        )}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-4xl mx-auto">
        {/* Features Card */}
        <Card className="backdrop-blur-sm bg-white/5 border-white/10">
          <CardHeader>
            <CardTitle>Fitur Premium</CardTitle>
            <CardDescription>
              Semua yang Anda butuhkan untuk pengalaman terbaik
            </CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {FEATURES.map((feature, i) => (
                <li key={i} className="flex items-start gap-3">
                  <CheckCircle className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pricing Card / Admin Message */}
        {user.role === 'ADMIN' ? (
          <Card className="backdrop-blur-sm bg-primary/5 border-primary/20 flex flex-col justify-center items-center p-8 text-center space-y-4">
            <Shield className="h-16 w-16 text-primary opacity-50" />
            <CardTitle className="text-xl">Akun Administrator</CardTitle>
            <CardDescription className="text-base">
              Sebagai Administrator, tugas Anda adalah mengelola sistem dan konten. 
              Akun Admin tidak diperbolehkan melakukan transaksi pembelian premium.
            </CardDescription>
            <Button variant="outline" onClick={() => navigate('/admin')}>
              Buka Admin Dashboard
            </Button>
          </Card>
        ) : (
          <Card className="backdrop-blur-sm bg-gradient-to-br from-yellow-500/10 to-orange-500/10 border-yellow-500/20">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Crown className="h-5 w-5 text-yellow-500" />
                Premium Plan
              </CardTitle>
              <CardDescription>
                Satu pembayaran untuk akses seumur hidup
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center">
                <div className="text-5xl font-bold">
                  Rp {PREMIUM_PRICE.toLocaleString('id-ID')}
                </div>
                <p className="text-muted-foreground mt-2">Sekali bayar</p>
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Pilih Metode Pembayaran</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => setProvider('midtrans')}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      provider === 'midtrans'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <CreditCard className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-sm">Midtrans</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => setProvider('stripe')}
                    className={`p-3 rounded-lg border text-center transition-colors ${
                      provider === 'stripe'
                        ? 'border-primary bg-primary/10'
                        : 'border-border hover:border-primary/50'
                    }`}
                  >
                    <CreditCard className="h-6 w-6 mx-auto mb-1" />
                    <span className="text-sm">Stripe</span>
                  </button>
                </div>
              </div>

              <Button
                className="w-full"
                size="lg"
                onClick={handleUpgrade}
                disabled={isLoading || user.isPremium}
              >
                {isLoading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Memproses...
                  </>
                ) : user.isPremium ? (
                  'Sudah Premium'
                ) : (
                  <>
                    <Crown className="h-4 w-4 mr-2" />
                    Upgrade Sekarang
                  </>
                )}
              </Button>

              <p className="text-xs text-muted-foreground text-center">
                Pembayaran aman melalui {provider === 'midtrans' ? 'Midtrans' : 'Stripe'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* FAQ Section */}
      <div className="max-w-2xl mx-auto space-y-4">
        <h2 className="text-2xl font-bold text-center">Pertanyaan Umum</h2>
        <Card className="backdrop-blur-sm bg-white/5 border-white/10">
          <CardContent className="space-y-4">
            <div>
              <h3 className="font-medium">Bagaimana cara upgrade?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Pilih metode pembayaran, lalu Anda akan diarahkan ke halaman payment.
                Setelah payment berhasil, status premium akan aktif.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Apakah pembayaran aman?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Ya, pembayaran diproses oleh Midtrans dan Stripe yang merupakan
                payment gateway terpercaya dengan standar keamanan tinggi.
              </p>
            </div>
            <div>
              <h3 className="font-medium">Bagaimana jika saya butuh bantuan?</h3>
              <p className="text-sm text-muted-foreground mt-1">
                Hubungi tim support kami melalui email atau chat untuk bantuan apapun.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}