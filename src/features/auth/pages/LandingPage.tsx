import { Link } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle, Zap, Users, Lock, Crown } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';

const FEATURES = [
  {
    icon: Lock,
    title: 'Keamanan Tinggi',
    description: 'Two-Factor Authentication dan enkripsi end-to-end untuk keamanan akun Anda.',
    color: 'text-primary',
    bg: 'bg-primary/10',
  },
  {
    icon: Zap,
    title: 'Login Mudah',
    description: 'Masuk dengan email/password atau gunakan Google OAuth dalam hitungan detik.',
    color: 'text-info',
    bg: 'bg-info/10',
  },
  {
    icon: Crown,
    title: 'Konten Premium',
    description: 'Akses konten eksklusif premium dengan proses upgrade yang mudah dan aman.',
    color: 'text-warning',
    bg: 'bg-warning/10',
  },
  {
    icon: Users,
    title: 'Manajemen Mudah',
    description: 'Dashboard intuitif untuk mengelola akun, keamanan, dan langganan Anda.',
    color: 'text-success',
    bg: 'bg-success/10',
  },
];

const TRUST_ITEMS = [
  '2FA & Google OAuth',
  'Enkripsi end-to-end',
  'Data tersimpan aman',
  'Support prioritas',
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background bg-mesh overflow-x-hidden">

      {/* ── Header ── */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 py-3">
        <div className="max-w-7xl mx-auto">
          <div className="glass rounded-2xl px-5 py-3 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="p-1.5 rounded-lg bg-primary/10">
                <Shield className="h-5 w-5 text-primary" />
              </div>
              <span className="text-lg font-bold tracking-tight">AuthApp</span>
            </div>
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm" asChild>
                <Link to="/login">Masuk</Link>
              </Button>
              <Button size="sm" className="glow-primary" asChild>
                <Link to="/register">
                  Daftar Gratis
                  <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* ── Hero Section ── */}
      <section className="pt-36 pb-24 px-4">
        <div className="max-w-5xl mx-auto text-center">

          {/* Badge */}
          <div className="inline-flex items-center gap-2 glass rounded-full px-4 py-1.5 mb-8 animate-fade-in">
            <span className="h-1.5 w-1.5 rounded-full bg-success animate-pulse" />
            <span className="text-sm text-muted-foreground font-medium">
              Platform autentikasi modern & aman
            </span>
          </div>

          {/* Heading */}
          <h1 className="text-5xl md:text-7xl font-bold leading-[1.08] tracking-tight mb-6 animate-slide-up">
            Autentikasi Modern
            <br />
            <span className="text-gradient-primary">Tanpa Kompleksitas</span>
          </h1>

          <p className="text-xl text-muted-foreground max-w-2xl mx-auto mb-10 leading-relaxed animate-slide-up animate-delay-100">
            Platform autentikasi yang aman dengan fitur lengkap — 2FA, Google OAuth,
            dan manajemen premium untuk pengalaman terbaik.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row gap-3 justify-center mb-12 animate-slide-up animate-delay-200">
            <Button size="lg" className="glow-primary text-base px-8" asChild>
              <Link to="/register">
                Mulai Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" className="glass text-base px-8" asChild>
              <Link to="/login">Sudah Punya Akun</Link>
            </Button>
          </div>

          {/* Trust indicators */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 animate-fade-in animate-delay-300">
            {TRUST_ITEMS.map((item) => (
              <div key={item} className="flex items-center gap-1.5 text-sm text-muted-foreground">
                <CheckCircle className="h-3.5 w-3.5 text-success shrink-0" />
                <span>{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Features Section ── */}
      <section className="py-24 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-14">
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Semua yang Anda Butuhkan
            </h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Fitur lengkap untuk mengamankan akun dan memberikan pengalaman
              autentikasi terbaik bagi pengguna Anda.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
            {FEATURES.map((feature, i) => (
              <div
                key={i}
                className={`glass rounded-2xl p-6 flex flex-col gap-4 animate-slide-up`}
                style={{ animationDelay: `${i * 0.08}s` }}
              >
                <div className={`w-10 h-10 rounded-xl ${feature.bg} flex items-center justify-center shrink-0`}>
                  <feature.icon className={`h-5 w-5 ${feature.color}`} />
                </div>
                <div>
                  <h3 className="font-semibold text-base mb-1.5">{feature.title}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{feature.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Section ── */}
      <section className="py-24 px-4">
        <div className="max-w-3xl mx-auto">
          <div className="glass-gold rounded-3xl p-12 text-center">
            <div className="w-14 h-14 rounded-2xl bg-warning/20 flex items-center justify-center mx-auto mb-6">
              <Crown className="h-7 w-7 text-warning" />
            </div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4">
              Siap Memulai?
            </h2>
            <p className="text-muted-foreground text-lg mb-8 max-w-md mx-auto">
              Bergabung sekarang, gratis. Upgrade ke Premium kapan saja
              untuk akses fitur eksklusif.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="glow-primary px-8" asChild>
                <Link to="/register">
                  Daftar Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button size="lg" variant="outline" className="glass px-8" asChild>
                <Link to="/login">Masuk ke Akun</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* ── Footer ── */}
      <footer className="py-8 px-4 border-t border-border/50">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="p-1 rounded-md bg-primary/10">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <span className="font-semibold text-sm">AuthApp</span>
          </div>
          <div className="flex items-center gap-6">
            <Link to="/login" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Masuk
            </Link>
            <Link to="/register" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Daftar
            </Link>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2025 AuthApp. All rights reserved.
          </p>
        </div>
      </footer>

    </div>
  );
}