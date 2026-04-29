import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Crown, CreditCard, CheckCircle, Loader2, Shield, ChevronDown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { paymentApi } from '@/features/auth/api/auth.api';
import { toast } from 'sonner';
import { FINANCIALS, ORDER_TYPE, PAYMENT_PROVIDER } from '@/shared/constants';

const PREMIUM_PRICE = FINANCIALS.PREMIUM_UPGRADE_PRICE;

const FEATURES = [
  'Akses konten eksklusif premium',
  'Download tanpa batasan',
  'Priority support 24/7',
  'Early access ke fitur baru',
  'Analitik lanjutan',
  'Tidak ada iklan',
];

const FAQ = [
  {
    q: 'Bagaimana cara upgrade ke Premium?',
    a: 'Pilih metode pembayaran (Midtrans atau Stripe), klik "Upgrade Sekarang", dan ikuti petunjuk pada halaman pembayaran. Setelah berhasil, status Premium Anda akan langsung aktif.',
  },
  {
    q: 'Apakah pembayaran aman?',
    a: 'Ya, pembayaran diproses oleh Midtrans dan Stripe — dua payment gateway terpercaya dengan standar keamanan PCI-DSS tertinggi.',
  },
  {
    q: 'Apakah ada refund?',
    a: 'Karena ini adalah produk digital, kami tidak menyediakan refund. Namun Anda dapat mencoba layanan kami secara gratis terlebih dahulu sebelum upgrade.',
  },
  {
    q: 'Bagaimana jika saya butuh bantuan?',
    a: 'Pengguna Premium mendapatkan priority support 24/7. Hubungi tim kami melalui email atau chat kapan saja.',
  },
];

export default function PremiumPage() {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);
  const updateUser = useAuthStore((state) => state.updateUser);
  const [provider, setProvider] = useState<typeof PAYMENT_PROVIDER[keyof typeof PAYMENT_PROVIDER]>(PAYMENT_PROVIDER.MIDTRANS);
  const [isLoading, setIsLoading] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleUpgrade = async () => {
    if (!user) return;
    setIsLoading(true);
    try {
      const response = await paymentApi.checkout({
        amount: PREMIUM_PRICE,
        provider,
        orderType: ORDER_TYPE.PREMIUM_UPGRADE,
        items: [{
          id: FINANCIALS.PREMIUM_ITEM_ID,
          name: FINANCIALS.PREMIUM_ITEM_NAME,
          price: PREMIUM_PRICE,
          quantity: 1,
        }],
      });
      if (response.data) {
        if (provider === PAYMENT_PROVIDER.MIDTRANS && response.data.snapUrl) {
          window.location.href = response.data.snapUrl;
        } else if (provider === PAYMENT_PROVIDER.STRIPE && response.data.checkoutUrl) {
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
      <div className="p-6 flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="p-6 space-y-10">

      {/* ── Hero ── */}
      <div className="text-center max-w-2xl mx-auto space-y-4 animate-slide-up">
        <div className="w-20 h-20 rounded-3xl bg-warning/15 flex items-center justify-center mx-auto glow-gold">
          <Crown className="h-10 w-10 text-warning" />
        </div>
        <h1 className="text-4xl font-bold">Upgrade ke Premium</h1>
        <p className="text-muted-foreground text-lg">
          Dapatkan akses penuh ke semua konten premium dan fitur eksklusif
        </p>
        {user.isPremium && (
          <Badge variant="success" className="text-sm px-4 py-1.5 gap-1.5">
            <CheckCircle className="h-3.5 w-3.5" />
            Anda sudah Premium
          </Badge>
        )}
      </div>

      {/* ── Cards ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 max-w-4xl mx-auto animate-slide-up animate-delay-100">

        {/* Features Card */}
        <Card className="glass shadow-md">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="h-5 w-5 text-success" />
              Semua yang Anda Dapatkan
            </CardTitle>
            <CardDescription>Fitur premium yang siap Anda nikmati</CardDescription>
          </CardHeader>
          <CardContent>
            <ul className="space-y-3">
              {FEATURES.map((feature, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="h-5 w-5 rounded-full bg-success/15 flex items-center justify-center shrink-0">
                    <CheckCircle className="h-3 w-3 text-success" />
                  </div>
                  <span className="text-sm">{feature}</span>
                </li>
              ))}
            </ul>
          </CardContent>
        </Card>

        {/* Pricing / Admin Card */}
        {user.role === 'ADMIN' ? (
          <Card className="glass border-primary/20 flex flex-col justify-center items-center p-8 text-center space-y-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center">
              <Shield className="h-8 w-8 text-primary opacity-60" />
            </div>
            <CardTitle className="text-xl">Akun Administrator</CardTitle>
            <CardDescription className="text-base leading-relaxed">
              Sebagai Administrator, tugas Anda adalah mengelola sistem dan konten.
              Akun Admin tidak diperbolehkan melakukan transaksi pembelian premium.
            </CardDescription>
            <Button variant="outline" className="glass" onClick={() => navigate('/admin')}>
              Buka Admin Dashboard
            </Button>
          </Card>
        ) : (
          <Card className="glass-gold shadow-lg glow-gold">
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Crown className="h-5 w-5 text-warning" />
                  Premium Plan
                </CardTitle>
                <Badge className="bg-warning/20 text-warning border-warning/30 text-xs">
                  Bulanan
                </Badge>
              </div>
              <CardDescription>Akses premium selama 30 hari</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="text-center py-2">
                <div className="text-5xl font-bold">
                  Rp {PREMIUM_PRICE.toLocaleString('id-ID')}
                </div>
                <p className="text-sm text-muted-foreground mt-1">Berlaku selama 1 bulan</p>
              </div>

              {/* Payment Method Selector */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Pilih Metode Pembayaran
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {[
                    { key: PAYMENT_PROVIDER.MIDTRANS, label: 'Midtrans', desc: 'Transfer, e-wallet, dll' },
                    { key: PAYMENT_PROVIDER.STRIPE, label: 'Stripe', desc: 'Kartu kredit/debit' },
                  ].map(({ key, label, desc }) => (
                    <button
                      key={key}
                      type="button"
                      onClick={() => setProvider(key)}
                      className={`p-3 rounded-xl border text-left transition-all ${
                        provider === key
                          ? 'border-warning bg-warning/10 ring-1 ring-warning/50'
                          : 'border-border hover:border-warning/40 hover:bg-warning/5'
                      }`}
                    >
                      <CreditCard className={`h-5 w-5 mb-1 ${provider === key ? 'text-warning' : 'text-muted-foreground'}`} />
                      <p className="text-xs font-semibold">{label}</p>
                      <p className="text-[10px] text-muted-foreground">{desc}</p>
                    </button>
                  ))}
                </div>
              </div>

              <Button
                className="w-full glow-gold bg-warning text-warning-foreground hover:bg-warning/90"
                size="lg"
                onClick={handleUpgrade}
                disabled={isLoading || user.isPremium}
              >
                {isLoading ? (
                  <><Loader2 className="h-4 w-4 mr-2 animate-spin" />Memproses...</>
                ) : user.isPremium ? (
                  'Sudah Premium ✓'
                ) : (
                  <><Crown className="h-4 w-4 mr-2" />Upgrade Sekarang</>
                )}
              </Button>

              <p className="text-[10px] text-muted-foreground text-center">
                🔒 Pembayaran aman via {provider === PAYMENT_PROVIDER.MIDTRANS ? 'Midtrans' : 'Stripe'}
              </p>
            </CardContent>
          </Card>
        )}
      </div>

      {/* ── FAQ Accordion ── */}
      <div className="max-w-2xl mx-auto space-y-3 animate-slide-up animate-delay-200">
        <h2 className="text-xl font-bold text-center mb-6">Pertanyaan Umum</h2>
        {FAQ.map((item, i) => (
          <div
            key={i}
            className="glass rounded-xl overflow-hidden"
          >
            <button
              type="button"
              className="w-full flex items-center justify-between px-5 py-4 text-left hover:bg-muted/20 transition-colors"
              onClick={() => setOpenFaq(openFaq === i ? null : i)}
            >
              <span className="font-medium text-sm">{item.q}</span>
              <ChevronDown
                className={`h-4 w-4 text-muted-foreground shrink-0 transition-transform duration-200 ${
                  openFaq === i ? 'rotate-180' : ''
                }`}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-200 ${
                openFaq === i ? 'max-h-40' : 'max-h-0'
              }`}
            >
              <p className="px-5 pb-4 text-sm text-muted-foreground leading-relaxed">{item.a}</p>
            </div>
          </div>
        ))}
      </div>

    </div>
  );
}