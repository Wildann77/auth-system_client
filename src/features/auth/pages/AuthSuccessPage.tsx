import { useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/shared/components/ui/card';
import { useAuthStore } from '../store/auth.store';
import { authApi } from '../api/auth.api';

export default function AuthSuccessPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const setAuth = useAuthStore((state) => state.setAuth);
  const setAccessToken = useAuthStore((state) => state.setAccessToken);

  useEffect(() => {
    const token = searchParams.get('token');

    if (token) {
      // Store the token in Zustand first
      setAccessToken(token);

      // Then fetch user data
      authApi.getCurrentUser()
        .then((response) => {
          if (response.data) {
            setAuth(response.data, token);
            navigate('/dashboard');
          } else {
            navigate('/login');
          }
        })
        .catch(() => {
          navigate('/login');
        });
    } else {
      navigate('/login');
    }
  }, [searchParams, navigate, setAuth, setAccessToken]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-muted/50 to-background p-4">
      <Card className="w-full max-w-md glass shadow-md">
        <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
          <Loader2 className="h-12 w-12 animate-spin text-primary" />
          <p className="text-muted-foreground">Memproses login...</p>
        </CardContent>
      </Card>
    </div>
  );
}
