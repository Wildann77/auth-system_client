import { useQuery } from '@tanstack/react-query';
import { Crown, ExternalLink, Loader2, Lock } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { contentApi } from '@/features/auth/api/auth.api';

export default function ContentPage() {
  const { data: contentData, isLoading, error } = useQuery({
    queryKey: ['exclusive-content'],
    queryFn: () => contentApi.getExclusiveContent(),
  });

  if (isLoading) {
    return <ContentSkeleton />;
  }

  if (error) {
    return (
      <div className="p-6">
        <Card className="max-w-md mx-auto glass shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Lock className="h-12 w-12 text-muted-foreground" />
            <p className="text-center text-muted-foreground">
              Gagal memuat konten. Pastikan Anda adalah premium user.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Crown className="h-8 w-8 text-yellow-500" />
        <div>
          <h1 className="text-3xl font-bold">Konten Premium</h1>
          <p className="text-muted-foreground mt-1">
            Konten eksklusif untuk pengguna premium
          </p>
        </div>
      </div>

      {contentData?.data && Array.isArray(contentData.data) && contentData.data.length === 0 ? (
        <Card className="max-w-2xl mx-auto glass shadow-md">
          <CardContent className="flex flex-col items-center justify-center py-12 space-y-4">
            <Crown className="h-12 w-12 text-muted-foreground" />
            <h3 className="text-lg font-semibold">Belum Ada Konten</h3>
            <p className="text-center text-muted-foreground">
              Konten premium akan segera hadir. Stay tuned!
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.isArray(contentData?.data) && contentData.data.map((content) => (
            <Card key={content.id} className="glass shadow-md overflow-hidden">
              <CardHeader>
                <div className="flex items-start justify-between">
                  <CardTitle className="text-lg">{content.title}</CardTitle>
                  <Badge variant="success" className="shrink-0">
                    <Crown className="h-3 w-3 mr-1" />
                    Premium
                  </Badge>
                </div>
                {content.description && (
                  <CardDescription>{content.description}</CardDescription>
                )}
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex flex-wrap gap-1">
                  {content.tags.map((tag, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                </div>

                {content.contentType === 'url' && (
                  <a
                    href={content.content}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 text-primary hover:underline"
                  >
                    <ExternalLink className="h-4 w-4" />
                    Buka Link
                  </a>
                )}

                {content.contentType === 'text' && (
                  <div className="text-sm text-muted-foreground line-clamp-3">
                    {content.content}
                  </div>
                )}

                {content.contentType === 'html' && (
                  <div
                    className="text-sm prose prose-sm dark:prose-invert max-w-none"
                    dangerouslySetInnerHTML={{ __html: content.content }}
                  />
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

function ContentSkeleton() {
  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center gap-3">
        <Skeleton className="h-10 w-10" />
        <div className="space-y-2">
          <Skeleton className="h-8 w-48" />
          <Skeleton className="h-4 w-32" />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Card key={i} className="glass shadow-md">
            <CardHeader>
              <Skeleton className="h-6 w-3/4" />
              <Skeleton className="h-4 w-full mt-2" />
            </CardHeader>
            <CardContent className="space-y-3">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-2/3" />
              <Skeleton className="h-10 w-full" />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}