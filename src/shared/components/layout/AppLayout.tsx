import { Link, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  Settings,
  Crown,
  Shield,
  LogOut,
  Menu,
  X,
  Moon,
  Sun,
  ChevronDown,
  Bell,
} from 'lucide-react';
import { useState } from 'react';
import { Button } from '@/shared/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown-menu';
import { useAuthStore } from '@/features/auth/store/auth.store';
import { useLogout } from '@/features/auth/hooks/mutations/useLogin';
import { useTheme } from 'next-themes';

interface AppLayoutProps {
  children: React.ReactNode;
}

/* ── Nav section config ── */
const NAV_SECTIONS = (userRole: string | undefined, isPremium: boolean | undefined) => [
  {
    label: 'Utama',
    items: [
      { path: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
      { path: '/settings', label: 'Pengaturan', icon: Settings },
    ],
  },
  ...(userRole !== 'ADMIN' ? [{
    label: 'Premium',
    items: [
      { path: '/premium', label: 'Upgrade Premium', icon: Crown, badge: isPremium ? 'Aktif' : undefined, badgeVariant: 'success' as const },
      ...(isPremium ? [{ path: '/content', label: 'Konten Premium', icon: Crown }] : []),
    ],
  }] : []),
  ...(userRole === 'ADMIN' ? [{
    label: 'Administrasi',
    items: [
      { path: '/admin', label: 'Admin Panel', icon: Shield },
    ],
  }] : []),
];

export default function AppLayout({ children }: AppLayoutProps) {
  const location = useLocation();
  const user = useAuthStore((state) => state.user);
  const logout = useLogout();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { theme, setTheme } = useTheme();

  const sections = NAV_SECTIONS(user?.role, user?.isPremium);

  const handleLogout = () => logout.mutate(false);

  const getInitials = () => {
    if (user?.firstName && user?.lastName)
      return `${user.firstName[0]}${user.lastName[0]}`.toUpperCase();
    return user?.email?.[0]?.toUpperCase() || 'U';
  };

  const getPageTitle = () => {
    const map: Record<string, string> = {
      '/dashboard': 'Dashboard',
      '/settings': 'Pengaturan',
      '/settings/2fa': 'Pengaturan 2FA',
      '/premium': 'Premium',
      '/content': 'Konten Premium',
      '/admin': 'Admin Panel',
      '/payment/success': 'Pembayaran Berhasil',
    };
    return map[location.pathname] ?? 'AuthApp';
  };

  const UserDropdownContent = () => (
    <DropdownMenuContent align="end" className="w-56 glass">
      <DropdownMenuLabel className="font-normal">
        <div className="flex flex-col gap-1">
          <p className="text-sm font-semibold">
            {user?.firstName && user?.lastName
              ? `${user.firstName} ${user.lastName}`
              : user?.firstName || user?.email?.split('@')[0]}
          </p>
          <p className="text-xs text-muted-foreground">{user?.email}</p>
        </div>
      </DropdownMenuLabel>
      <DropdownMenuSeparator />
      <DropdownMenuItem asChild>
        <Link to="/settings" className="cursor-pointer">
          <Settings className="mr-2 h-4 w-4" />
          Pengaturan
        </Link>
      </DropdownMenuItem>
      <DropdownMenuSeparator />
      <DropdownMenuItem onClick={handleLogout} className="text-destructive focus:text-destructive cursor-pointer">
        <LogOut className="mr-2 h-4 w-4" />
        Keluar
      </DropdownMenuItem>
    </DropdownMenuContent>
  );

  return (
    <div className="min-h-screen bg-background">

      {/* ── Mobile Header ── */}
      <header className="lg:hidden fixed top-0 left-0 right-0 z-40 flex items-center justify-between px-4 h-14 glass border-b border-border/50">
        <button
          onClick={() => setSidebarOpen(true)}
          className="p-2 hover:bg-accent rounded-lg transition-colors"
          aria-label="Buka menu"
        >
          <Menu className="h-5 w-5" />
        </button>
        <Link to="/dashboard" className="flex items-center gap-2">
          <div className="p-1 rounded-md bg-primary/10">
            <Shield className="h-4 w-4 text-primary" />
          </div>
          <span className="font-semibold text-sm">AuthApp</span>
        </Link>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
        >
          {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
        </Button>
      </header>

      {/* ── Mobile Sidebar Overlay ── */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 z-40 bg-black/50 backdrop-blur-sm"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* ── Sidebar ── */}
      <aside
        className={`fixed top-0 left-0 z-50 h-full w-64 bg-sidebar border-r border-sidebar-border transition-transform duration-300 ease-in-out lg:translate-x-0 flex flex-col ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        {/* Logo */}
        <div className="flex items-center justify-between h-14 px-5 border-b border-sidebar-border shrink-0">
          <Link to="/dashboard" className="flex items-center gap-2.5" onClick={() => setSidebarOpen(false)}>
            <div className="p-1.5 rounded-lg bg-primary/15">
              <Shield className="h-4 w-4 text-primary" />
            </div>
            <span className="font-bold text-base">AuthApp</span>
          </Link>
          <button
            onClick={() => setSidebarOpen(false)}
            className="lg:hidden p-1.5 hover:bg-sidebar-accent rounded-lg transition-colors"
          >
            <X className="h-4 w-4" />
          </button>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-5 overflow-y-auto">
          {sections.map((section) => (
            <div key={section.label}>
              <p className="px-2 mb-1.5 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
                {section.label}
              </p>
              <div className="space-y-0.5">
                {section.items.map((item) => {
                  const isActive = location.pathname === item.path || location.pathname.startsWith(`${item.path}/`);
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setSidebarOpen(false)}
                      className={`flex items-center gap-2.5 px-3 py-2 rounded-lg text-sm transition-all ${
                        isActive
                          ? 'bg-primary/10 text-primary font-medium'
                          : 'text-sidebar-foreground hover:bg-sidebar-accent'
                      }`}
                    >
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="flex-1">{item.label}</span>
                      {'badge' in item && item.badge && (
                        <Badge variant={item.badgeVariant as any} className="text-[10px] px-1.5 py-0">
                          {item.badge}
                        </Badge>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* User footer */}
        <div className="p-3 border-t border-sidebar-border shrink-0">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-2.5 w-full p-2.5 rounded-xl hover:bg-sidebar-accent transition-colors text-left">
                <Avatar className="h-8 w-8 shrink-0">
                  <AvatarImage src={user?.avatarUrl || ''} alt={user?.firstName || ''} />
                  <AvatarFallback className="text-xs bg-primary/15 text-primary font-semibold">{getInitials()}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold truncate">
                    {user?.firstName && user?.lastName
                      ? `${user.firstName} ${user.lastName}`
                      : user?.email?.split('@')[0]}
                  </p>
                  <p className="text-[10px] text-muted-foreground truncate">{user?.email}</p>
                </div>
                <ChevronDown className="h-3.5 w-3.5 text-muted-foreground shrink-0" />
              </button>
            </DropdownMenuTrigger>
            <UserDropdownContent />
          </DropdownMenu>
        </div>
      </aside>

      {/* ── Main Content ── */}
      <main className="lg:pl-64 pt-14 lg:pt-0 min-h-screen flex flex-col">

        {/* Top bar (desktop) */}
        <div className="hidden lg:flex items-center justify-between px-6 py-3 border-b border-border/50 bg-background/80 backdrop-blur-sm sticky top-0 z-30">
          <h2 className="text-sm font-semibold text-muted-foreground">{getPageTitle()}</h2>
          <div className="flex items-center gap-2">
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            >
              {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
            </Button>
            <Button variant="ghost" size="icon" className="h-8 w-8 relative">
              <Bell className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="gap-2 h-8 px-2">
                  <Avatar className="h-6 w-6">
                    <AvatarImage src={user?.avatarUrl || ''} alt={user?.firstName || ''} />
                    <AvatarFallback className="text-[10px] bg-primary/15 text-primary font-semibold">{getInitials()}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium max-w-28 truncate">
                    {user?.firstName || user?.email?.split('@')[0]}
                  </span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </Button>
              </DropdownMenuTrigger>
              <UserDropdownContent />
            </DropdownMenu>
          </div>
        </div>

        {/* Page content */}
        <div className="flex-1">{children}</div>
      </main>
    </div>
  );
}