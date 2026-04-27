import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  Users,
  Shield,
  Crown,
  CheckCircle,
  ChevronLeft,
  ChevronRight,
  Loader2,
  Trash2,
  Search,
  AlertTriangle,
  TrendingUp,
} from 'lucide-react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Button } from '@/shared/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/shared/components/ui/card';
import { Badge } from '@/shared/components/ui/badge';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/shared/components/ui/select';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/shared/components/ui/table';
import { Skeleton } from '@/shared/components/ui/skeleton';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/shared/components/ui/dialog';
import { toast } from 'sonner';
import { adminApi } from '@/features/auth/api/auth.api';
import type { User, AdminStats } from '@/shared/types';
import { USER_ROLE, AUTH_PROVIDER } from '@/shared/constants';

const STAT_CARDS = (stats: AdminStats | undefined) => [
  {
    label: 'Total Pengguna',
    value: stats?.totalUsers ?? 0,
    icon: Users,
    color: 'text-info',
    bg: 'bg-info/10',
    border: 'border-l-info',
  },
  {
    label: 'Email Terverifikasi',
    value: stats?.verifiedUsers ?? 0,
    icon: CheckCircle,
    color: 'text-success',
    bg: 'bg-success/10',
    border: 'border-l-success',
  },
  {
    label: 'Administrator',
    value: stats?.adminCount ?? 0,
    icon: Shield,
    color: 'text-primary',
    bg: 'bg-primary/10',
    border: 'border-l-primary',
  },
  {
    label: 'Pengguna Premium',
    value: stats?.premiumCount ?? 0,
    icon: Crown,
    color: 'text-warning',
    bg: 'bg-warning/10',
    border: 'border-l-warning',
  },
];

export default function AdminDashboardPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [page, setPage] = useState(1);
  const [limit] = useState(10);
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [verifiedFilter, setVerifiedFilter] = useState<string>('all');
  const [providerFilter, setProviderFilter] = useState<string>('all');
  const [searchInput, setSearchInput] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');

  const [confirmRole, setConfirmRole] = useState<{ userId: string; name: string } | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<{ userId: string; name: string } | null>(null);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchInput);
      setPage(1);
    }, 500);
    return () => clearTimeout(timer);
  }, [searchInput]);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: () => adminApi.getStats(),
  });

  const { data: usersData, isLoading: usersLoading } = useQuery({
    queryKey: ['admin-users', page, limit, roleFilter, verifiedFilter, providerFilter, debouncedSearch],
    queryFn: () => adminApi.getUsers({
      page, limit,
      role: roleFilter === 'all' ? undefined : roleFilter as any,
      isEmailVerified: verifiedFilter === 'all' ? undefined : verifiedFilter as any,
      provider: providerFilter === 'all' ? undefined : providerFilter as any,
      search: debouncedSearch || undefined,
    }),
  });

  const updateRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: typeof USER_ROLE[keyof typeof USER_ROLE] }) =>
      adminApi.updateUserRole(userId, { role }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Role berhasil diperbarui');
      setConfirmRole(null);
    },
  });

  const deleteUserMutation = useMutation({
    mutationFn: (userId: string) => adminApi.deleteUser(userId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['admin-users'] });
      queryClient.invalidateQueries({ queryKey: ['admin-stats'] });
      toast.success('Pengguna berhasil dihapus');
      setConfirmDelete(null);
    },
  });

  const statsData = stats?.data;

  /* Chart data — gunakan usersByDay jika tersedia */
  const chartData = statsData && 'usersByDay' in statsData
    ? (statsData as any).usersByDay ?? []
    : [];

  const getUserInitials = (u: User) => {
    if (u.firstName && u.lastName) return `${u.firstName[0]}${u.lastName[0]}`.toUpperCase();
    return u.email[0].toUpperCase();
  };

  return (
    <div className="p-6 space-y-6">

      {/* ── Header ── */}
      <div className="flex items-center gap-4 animate-slide-up">
        <Button variant="ghost" size="sm" onClick={() => navigate('/dashboard')}>
          ← Kembali
        </Button>
        <div>
          <h1 className="text-2xl font-bold">Admin Dashboard</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Kelola pengguna dan statistik sistem
          </p>
        </div>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 animate-slide-up animate-delay-100">
        {STAT_CARDS(statsData).map(({ label, value, icon: Icon, color, bg, border }) => (
          <Card key={label} className={`glass shadow-md border-l-4 ${border}`}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-xs font-medium text-muted-foreground">{label}</CardTitle>
              <div className={`p-1.5 rounded-lg ${bg}`}>
                <Icon className={`h-3.5 w-3.5 ${color}`} />
              </div>
            </CardHeader>
            <CardContent>
              {statsLoading ? (
                <Skeleton className="h-8 w-16" />
              ) : (
                <div className="text-3xl font-bold">{value.toLocaleString('id-ID')}</div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Chart (usersByDay) ── */}
      {(chartData.length > 0 || statsLoading) && (
        <Card className="glass shadow-md animate-slide-up animate-delay-200">
          <CardHeader>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4 text-primary" />
              <CardTitle className="text-base">Pendaftaran Pengguna</CardTitle>
            </div>
            <CardDescription>Registrasi per hari dalam 30 hari terakhir</CardDescription>
          </CardHeader>
          <CardContent>
            {statsLoading ? (
              <Skeleton className="h-48 w-full" />
            ) : (
              <ResponsiveContainer width="100%" height={200}>
                <AreaChart data={chartData} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradCount" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="var(--color-primary)" stopOpacity={0.3} />
                      <stop offset="95%" stopColor="var(--color-primary)" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" />
                  <XAxis
                    dataKey="date"
                    tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                    tickLine={false}
                    axisLine={false}
                  />
                  <YAxis
                    tick={{ fontSize: 10, fill: 'var(--color-muted-foreground)' }}
                    tickLine={false}
                    axisLine={false}
                    allowDecimals={false}
                  />
                  <Tooltip
                    contentStyle={{
                      background: 'var(--color-card)',
                      border: '1px solid var(--color-border)',
                      borderRadius: '8px',
                      fontSize: '12px',
                    }}
                    labelStyle={{ color: 'var(--color-foreground)' }}
                    cursor={{ stroke: 'var(--color-primary)', strokeWidth: 1 }}
                  />
                  <Area
                    type="monotone"
                    dataKey="count"
                    name="Pengguna"
                    stroke="var(--color-primary)"
                    strokeWidth={2}
                    fill="url(#gradCount)"
                    dot={false}
                    activeDot={{ r: 4, fill: 'var(--color-primary)' }}
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </CardContent>
        </Card>
      )}

      {/* ── Users Table ── */}
      <Card className="glass shadow-md animate-slide-up animate-delay-200">
        <CardHeader>
          <CardTitle>Daftar Pengguna</CardTitle>
          <CardDescription>Kelola semua pengguna dalam sistem</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">

          {/* Filters */}
          <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
            <div className="flex flex-wrap gap-3 items-center">
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground whitespace-nowrap">Role:</Label>
                <Select value={roleFilter} onValueChange={setRoleFilter}>
                  <SelectTrigger className="h-8 w-[110px] text-xs">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value={USER_ROLE.USER}>User</SelectItem>
                    <SelectItem value={USER_ROLE.ADMIN}>Admin</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground whitespace-nowrap">Status:</Label>
                <Select value={verifiedFilter} onValueChange={setVerifiedFilter}>
                  <SelectTrigger className="h-8 w-[130px] text-xs">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value="true">Terverifikasi</SelectItem>
                    <SelectItem value="false">Belum</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center gap-2">
                <Label className="text-xs text-muted-foreground whitespace-nowrap">Provider:</Label>
                <Select value={providerFilter} onValueChange={setProviderFilter}>
                  <SelectTrigger className="h-8 w-[110px] text-xs">
                    <SelectValue placeholder="Semua" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Semua</SelectItem>
                    <SelectItem value={AUTH_PROVIDER.LOCAL}>Local</SelectItem>
                    <SelectItem value={AUTH_PROVIDER.GOOGLE}>Google</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <div className="relative w-full sm:w-64">
              <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Cari email atau nama..."
                className="pl-8 h-8 text-xs"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
              />
            </div>
          </div>

          {/* Table */}
          <div className="rounded-xl border border-border overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/40">
                  <TableHead className="text-xs">Pengguna</TableHead>
                  <TableHead className="text-xs">Role</TableHead>
                  <TableHead className="text-xs">Provider</TableHead>
                  <TableHead className="text-xs">Premium</TableHead>
                  <TableHead className="text-xs">Status</TableHead>
                  <TableHead className="text-xs text-right">Aksi</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {usersLoading ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                      <TableCell><div className="flex items-center gap-2"><Skeleton className="h-8 w-8 rounded-full" /><Skeleton className="h-4 w-32" /></div></TableCell>
                      <TableCell><Skeleton className="h-5 w-14" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-14" /></TableCell>
                      <TableCell><Skeleton className="h-4 w-4" /></TableCell>
                      <TableCell><Skeleton className="h-5 w-16" /></TableCell>
                      <TableCell><Skeleton className="h-7 w-20 ml-auto" /></TableCell>
                    </TableRow>
                  ))
                ) : usersData?.data?.items.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center py-12 text-muted-foreground text-sm">
                      Tidak ada pengguna ditemukan
                    </TableCell>
                  </TableRow>
                ) : (
                  usersData?.data?.items.map((user) => (
                    <TableRow key={user.id} className="hover:bg-muted/30 transition-colors">
                      <TableCell>
                        <div className="flex items-center gap-2.5">
                          <Avatar className="h-8 w-8 shrink-0">
                            <AvatarImage src={user.avatarUrl || ''} alt={user.firstName || ''} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary font-semibold">
                              {getUserInitials(user)}
                            </AvatarFallback>
                          </Avatar>
                          <div className="min-w-0">
                            <p className="text-xs font-medium truncate max-w-[160px]">
                              {user.firstName && user.lastName
                                ? `${user.firstName} ${user.lastName}`
                                : user.firstName || user.email.split('@')[0]}
                            </p>
                            <p className="text-[10px] text-muted-foreground truncate max-w-[160px]">{user.email}</p>
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.role === USER_ROLE.ADMIN ? 'default' : 'secondary'} className="text-[10px]">
                          {user.role}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="text-[10px]">{user.provider}</Badge>
                      </TableCell>
                      <TableCell>
                        {user.isPremium
                          ? <Crown className="h-4 w-4 text-warning" />
                          : <span className="text-muted-foreground text-xs">—</span>
                        }
                      </TableCell>
                      <TableCell>
                        <Badge variant={user.isEmailVerified ? 'success' : 'warning'} className="text-[10px]">
                          {user.isEmailVerified ? 'Verified' : 'Pending'}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-1.5 justify-end">
                          {user.role !== USER_ROLE.ADMIN && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="h-7 text-xs px-2"
                              onClick={() => setConfirmRole({ userId: user.id, name: user.email })}
                              disabled={updateRoleMutation.isPending}
                            >
                              <Shield className="h-3 w-3 mr-1" />
                              Jadikan Admin
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="destructive"
                            className="h-7 w-7 p-0"
                            onClick={() => setConfirmDelete({ userId: user.id, name: user.email })}
                            disabled={deleteUserMutation.isPending}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>

          {/* Pagination */}
          {usersData?.data && (
            <div className="flex items-center justify-between text-xs text-muted-foreground pt-1">
              <p>
                Menampilkan {(page - 1) * limit + 1}–{Math.min(page * limit, usersData.data.total)} dari {usersData.data.total}
              </p>
              <div className="flex items-center gap-1.5">
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={page === 1}
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </Button>
                <span className="px-2">Hal. {page} / {usersData.data.totalPages}</span>
                <Button
                  variant="outline"
                  size="sm"
                  className="h-7 w-7 p-0"
                  onClick={() => setPage((p) => p + 1)}
                  disabled={page >= usersData.data.totalPages}
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* ── Confirm Role Dialog ── */}
      <Dialog open={!!confirmRole} onOpenChange={() => setConfirmRole(null)}>
        <DialogContent className="glass max-w-sm">
          <DialogHeader>
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
              <Shield className="h-6 w-6 text-primary" />
            </div>
            <DialogTitle className="text-center">Jadikan Administrator?</DialogTitle>
            <DialogDescription className="text-center text-sm">
              <span className="font-medium text-foreground">{confirmRole?.name}</span> akan mendapatkan akses penuh sebagai Administrator. Tindakan ini dapat diubah kembali.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmRole(null)}>
              Batal
            </Button>
            <Button
              className="flex-1"
              onClick={() => confirmRole && updateRoleMutation.mutate({ userId: confirmRole.userId, role: USER_ROLE.ADMIN })}
              disabled={updateRoleMutation.isPending}
            >
              {updateRoleMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ya, Jadikan Admin'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ── Confirm Delete Dialog ── */}
      <Dialog open={!!confirmDelete} onOpenChange={() => setConfirmDelete(null)}>
        <DialogContent className="glass max-w-sm">
          <DialogHeader>
            <div className="w-12 h-12 rounded-xl bg-destructive/10 flex items-center justify-center mx-auto mb-2">
              <AlertTriangle className="h-6 w-6 text-destructive" />
            </div>
            <DialogTitle className="text-center">Hapus Pengguna?</DialogTitle>
            <DialogDescription className="text-center text-sm">
              <span className="font-medium text-foreground">{confirmDelete?.name}</span> akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1" onClick={() => setConfirmDelete(null)}>
              Batal
            </Button>
            <Button
              variant="destructive"
              className="flex-1"
              onClick={() => confirmDelete && deleteUserMutation.mutate(confirmDelete.userId)}
              disabled={deleteUserMutation.isPending}
            >
              {deleteUserMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : 'Ya, Hapus'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}