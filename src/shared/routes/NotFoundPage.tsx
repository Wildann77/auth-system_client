import { Link } from 'react-router-dom';
import { Home, ArrowLeft } from 'lucide-react';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';

export default function NotFoundPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
      <Card className="w-full max-w-md glass shadow-2xl text-center">
        <CardHeader>
          <CardTitle className="text-8xl font-bold text-primary">404</CardTitle>
          <CardDescription className="text-xl">
            Halaman Tidak Ditemukan
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-muted-foreground">
            Maaf, halaman yang Anda cari tidak dapat ditemukan.
          </p>
          <div className="flex flex-col sm:flex-row gap-2 justify-center">
            <Button asChild>
              <Link to="/dashboard">
                <Home className="mr-2 h-4 w-4" />
                Ke Dashboard
              </Link>
            </Button>
            <Button variant="outline" onClick={() => window.history.back()}>
              <ArrowLeft className="mr-2 h-4 w-4" />
              Kembali
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}