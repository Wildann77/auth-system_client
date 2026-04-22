import { Link } from 'react-router-dom';
import { Shield, ArrowRight, CheckCircle } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

const FEATURES = [
  {
    title: 'Keamanan Tinggi',
    description: 'Two-Factor Authentication dan enkripsi end-to-end untuk keamanan akun Anda.',
  },
  {
    title: 'Login Mudah',
    description: 'Masuk dengan email/password atau gunakan Google OAuth.',
  },
  {
    title: 'Premium Content',
    description: 'Akses konten eksklusif premium dengan upgrade mudah.',
  },
  {
    title: 'Manajemen Mudah',
    description: 'Dashboard intuitif untuk mengelola akun dan keamanan.',
  },
];

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900">
      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-40 px-4 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold">AuthApp</span>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" asChild>
              <Link to="/login">Masuk</Link>
            </Button>
            <Button asChild>
              <Link to="/register">Daftar</Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-4">
        <div className="max-w-4xl mx-auto text-center space-y-6">
          <h1 className="text-5xl md:text-6xl font-bold leading-tight">
            Autentikasi Modern<br />
            <span className="text-primary">Tanpa Kompleksitas</span>
          </h1>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Platform autentikasi yang aman dengan fitur lengkap termasuk 2FA,
            Google OAuth, dan manajemen premium untuk pengalaman terbaik.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" asChild>
              <Link to="/register">
                Mulai Gratis
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button size="lg" variant="outline" asChild>
              <Link to="/login">Masuk</Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">
            Fitur Unggulan
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {FEATURES.map((feature, i) => (
              <Card key={i} className="backdrop-blur-sm bg-white/5 border-white/10">
                <CardHeader>
                  <CardTitle className="text-lg">{feature.title}</CardTitle>
                  <CardDescription>{feature.description}</CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <Card className="backdrop-blur-sm bg-gradient-to-br from-primary/20 to-primary/5 border-primary/20">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">
                Siap Memulai?
              </h2>
              <p className="text-muted-foreground mb-8">
                Bergabung sekarang dan dapatkan akses ke semua fitur premium.
              </p>
              <Button size="lg" asChild>
                <Link to="/register">
                  Daftar Sekarang
                  <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 border-t">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Shield className="h-5 w-5 text-primary" />
            <span className="font-semibold">AuthApp</span>
          </div>
          <p className="text-sm text-muted-foreground">
            © 2024 AuthApp. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}