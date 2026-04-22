import { createBrowserRouter, RouterProvider } from 'react-router-dom';
import { ProtectedRoute, GuestRoute, PremiumRoute, AdminRoute } from './ProtectedRoute';
import AppLayout from '@/shared/components/layout/AppLayout';
import LoginPage from '@/features/auth/pages/LoginPage';
import RegisterPage from '@/features/auth/pages/RegisterPage';
import ForgotPasswordPage from '@/features/auth/pages/ForgotPasswordPage';
import ResetPasswordPage from '@/features/auth/pages/ResetPasswordPage';
import VerifyEmailPage from '@/features/auth/pages/VerifyEmailPage';
import AuthSuccessPage from '@/features/auth/pages/AuthSuccessPage';
import DashboardPage from '@/features/user/pages/DashboardPage';
import SettingsPage from '@/features/settings/pages/SettingsPage';
import Setup2FAPage from '@/features/settings/pages/Setup2FAPage';
import PremiumPage from '@/features/payment/pages/PremiumPage';
import ContentPage from '@/features/content/pages/ContentPage';
import AdminDashboardPage from '@/features/admin/pages/AdminDashboardPage';
import NotFoundPage from './NotFoundPage';

const router = createBrowserRouter([
  {
    path: '/',
    element: <GuestRoute><LoginPage /></GuestRoute>,
  },
  {
    path: '/login',
    element: <GuestRoute><LoginPage /></GuestRoute>,
  },
  {
    path: '/register',
    element: <GuestRoute><RegisterPage /></GuestRoute>,
  },
  {
    path: '/forgot-password',
    element: <GuestRoute><ForgotPasswordPage /></GuestRoute>,
  },
  {
    path: '/reset-password',
    element: <GuestRoute><ResetPasswordPage /></GuestRoute>,
  },
  {
    path: '/verify-email',
    element: <VerifyEmailPage />,
  },
  {
    path: '/auth-success',
    element: <AuthSuccessPage />,
  },
  {
    path: '/dashboard',
    element: <ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>,
  },
  {
    path: '/settings',
    element: <ProtectedRoute><AppLayout><SettingsPage /></AppLayout></ProtectedRoute>,
  },
  {
    path: '/settings/2fa',
    element: <ProtectedRoute><AppLayout><Setup2FAPage /></AppLayout></ProtectedRoute>,
  },
  {
    path: '/premium',
    element: <ProtectedRoute><AppLayout><PremiumPage /></AppLayout></ProtectedRoute>,
  },
  {
    path: '/content',
    element: <ProtectedRoute><AppLayout><ContentPage /></AppLayout></ProtectedRoute>,
  },
  {
    path: '/admin',
    element: <AdminRoute><AppLayout><AdminDashboardPage /></AppLayout></AdminRoute>,
  },
  {
    path: '*',
    element: <NotFoundPage />,
  },
]);

export function AppRoutes() {
  return <RouterProvider router={router} />;
}