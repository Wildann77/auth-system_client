# AGENTS.md

## Commands

```bash
bun dev          # Start dev server
bun build        # Build with TypeScript check
bun build:prod   # Production build (sets BUILD_MODE=prod)
bun lint        # Run ESLint
bun preview     # Preview built app
```

**Note**: All scripts prepend `bun install`. Run manually if needed.

## Architecture

- **Entry**: `src/main.tsx` -> `src/App.tsx` -> `src/shared/routes/index.tsx`
- **Initialization**: `src/shared/components/layout/AppInitializer.tsx`
- **API Config**: `src/shared/api/query-client.ts`, `src/shared/api/axios.ts`
- **Path alias**: `@` -> `./src`
- **Build**: Vite + React + TypeScript
- **State**: Zustand (`src/features/*/store/*.store.ts`)
- **Data Fetching**: TanStack Query
- **UI**: Radix UI + Tailwind CSS v4 (CSS-first, shadcn/ui pattern)
- **Skeletons**: `src/shared/components/skeletons/`
- **Routing**: React Router v6
- **Localization**: UI uses **Bahasa Indonesia** (Indonesian) for all labels and messages.

## Feature Structure

```
src/features/    # Feature modules
src/shared/
  api/          # Axios & QueryClient config
  components/
    layout/     # AppLayout, AppInitializer
    skeletons/  # Reusable loading states
    ui/         # shadcn/ui components
  routes/       # Route definitions & Protection
```

## Routes

| Path | Route Type | Description |
|------|------------|-------------|
| `/` | GuestRoute | Login page |
| `/login` | GuestRoute | Login |
| `/register` | GuestRoute | Registration |
| `/forgot-password` | GuestRoute | Password reset request |
| `/reset-password` | GuestRoute | Password reset form |
| `/verify-email` | Public | Email verification |
| `/auth-success` | Public | OAuth success |
| `/dashboard` | ProtectedRoute | User dashboard |
| `/settings` | ProtectedRoute | User settings |
| `/settings/2fa` | ProtectedRoute | 2FA setup |
| `/premium` | ProtectedRoute | Premium upgrade |
| `/content` | ProtectedRoute | Exclusive content |
| `/payment/success` | ProtectedRoute | Payment success feedback |
| `/admin` | AdminRoute | Admin dashboard |

## Route Protection

- **ProtectedRoute**: Requires authenticated user
- **GuestRoute**: Redirect to dashboard if authenticated
- **PremiumRoute**: Requires authenticated + premium user
- **AdminRoute**: Requires authenticated + ADMIN role

## API Integration

### Base URL
```
VITE_API_URL=http://localhost:3000/api/v1
```
Configured in `.env`

### Auth Flow
1. **Hydration First**: App starts with `_hasHydrated: false`.
2. **Instant App Load**: Once hydrated from `localStorage` (Zustand persist), `_hasHydrated` becomes `true`.
3. **ProtectedRoute Guard**: Routes are blocked by `!_hasHydrated` and show Skeletons instead of redirecting.
4. **Background Verification**: `initializeAuth()` is called once on mount (guarded against Strict Mode) to verify tokens asynchronously.
5. **Reactive Redirection**: Axios interceptor calls `clearAuth()` on 401, which triggers `ProtectedRoute` to redirect to `/login` via React Router (no hard refresh).
6. **Refresh token uses HTTP-only cookie**
7. **Failed refresh redirects to `/login`**
8. **2FA login**: Handle 400 errors with "2FA code required" message

### API Endpoints

```
Auth API:
POST /auth/register         # Register new user
POST /auth/login          # Login with credentials
POST /auth/verify-email  # Verify email token
POST /auth/resend-verification
POST /auth/forgot-password
POST /auth/reset-password
POST /auth/refresh-token  # Auto-refresh on init
POST /auth/logout
GET  /auth/me            # Current user
POST /auth/change-password
POST /auth/2fa/enable    # Get QR code
POST /auth/2fa/verify    # Confirm 2FA
POST /auth/2fa/disable
GET  /auth/google        # OAuth redirect

User API:
GET  /user/me
PATCH /user/me

Admin API:
GET  /admin/users        # Paginated user list with search/filters
GET  /admin/stats      # Dashboard stats
PATCH /admin/users/:id/role
DELETE /admin/users/:id

Payment API:
POST /payment/checkout
POST /payment/cancel     # Cancel active premium subscription

Content API:
GET  /content/exclusive

Payment Constants:
Price: 99.000 IDR (PREMIUM_UPGRADE_PRICE)
Currency: IDR
```

## Types

```typescript
User {
  id, email, firstName, lastName
  role: 'USER' | 'ADMIN'
  provider: 'LOCAL' | 'GOOGLE'
  isEmailVerified, twoFactorEnabled
  isPremium, autoRenew, premiumUntil, lastLoginAt, tokenVersion, avatarUrl, createdAt, updatedAt
}

ApiResponse<T> {
  success, message, data: T | null, error: { code, details? }
}

AdminStats {
  totalUsers, verifiedUsers, adminCount, premiumCount, usersByDay: { date, count }[]
}
```

## Theme
 
- **Tailwind Version**: v4 (Oxide engine)
- **Configuration**: CSS-first via `@theme inline` in `src/index.css`. No `tailwind.config.js`.
- **Colors**: Menggunakan OKLCH format (Primary: `oklch(0.6397 0.1720 36.4421)`, Secondary: `oklch(0.9670 0.0029 264.5419)`, Accent: `oklch(0.9119 0.0222 243.8174)`)
- **Fonts**: `Inter` (Sans), `Source Serif 4` (Serif), `JetBrains Mono` (Mono).
- **Dark mode**: Native Tailwind v4 support, toggled via `.dark` class.
- **Plugins**: `tailwindcss-animate` integrated via `@plugin`.

## Build Modes

- **Development**: Default, includes source identifier plugin
- **Production**: `BUILD_MODE=prod`, no source identifiers

## ESLint

Flat config (`eslint.config.js`). No type-aware rules.
- Ignores: `dist`
- Rules: react-hooks recommended, react-refresh warnings

## Important Patterns

1. **Hydration Guard**: Use `_hasHydrated` in all protected/guest routes to prevent premature redirects during app boot.
2. **Strict Mode Protection**: `initializeAuth` is guarded in both the store and `AppInitializer` to prevent token rotation conflicts in development.
3. **Reactive Auth**: Avoid `window.location.href` for auth redirects; let `ProtectedRoute` react to state changes in the store.
4. **Persist Middleware**: Zustand persist middleware handles authentication state restoration from localStorage on app start.
5. **Component Export**: Use `react-refresh/only-export-components` for HMR
6. **Token Ordering**: Always store access tokens in Zustand store before making authenticated API calls, as axios interceptors rely on store state
7. **2FA Error Handling**: Catch 400 errors with "2FA code required" message in login flow to trigger OTP input UI
8. **Response Validation**: Use `result.data?.requires2FA` for consistent API response checking in auth flows
9. **Dark Mode**: Managed in `AppLayout.tsx` by toggling `.dark` class on `document.documentElement`. Default is dark.
10. **UI Language**: Always use **Bahasa Indonesia** for user-facing text (buttons, labels, messages).

## Konteks AI untuk Konsistensi

Untuk AI Agent yang bekerja di repositori ini, harap perhatikan aturan berikut:

1.  **Hydration Guard**: Gunakan `_hasHydrated` di semua route untuk menahan render/redirect sampai state dari localStorage siap.
2.  **Concurrency Guard**: `initializeAuth` dilindungi agar tidak dieksekusi ganda (mencegah bug pada Refresh Token Rotation).
3.  **No Hard Redirects**: Jangan gunakan `window.location.href` di interceptor; biarkan `ProtectedRoute` yang menangani navigasi.
4.  **Pola Auth Store**: Gunakan `window.__authStore` jika ingin mengakses state auth di luar komponen React (seperti di Axios interceptor).
5.  **Background Verification**: Validasi token terjadi asynchronous tanpa memblokir UI.
6.  **Urutan Token**: Saat mendapatkan token baru (dari refresh atau OAuth), simpan ke store **sebelum** melakukan pemanggilan API berikutnya yang membutuhkan otentikasi.
7.  **Skema Validasi**: Jaga konsistensi antara skema Zod di frontend (`features/auth/types/auth.types.ts`) dan backend. Jika ada perubahan aturan validasi di satu sisi, wajib update di sisi lainnya.
8.  **Multi-step Auth**: Jangan asumsikan login selalu sukses dalam satu langkah. Selalu tangani kondisi `requires2FA` atau `emailNotVerified`.
9.  **2FA Error Handling**: Tangkap error 400 dengan pesan "2FA code required" di alur login untuk memicu UI input OTP.
10. **Validasi Response**: Gunakan `result.data?.requires2FA` untuk pemeriksaan response API yang konsisten di alur auth.
11. **Bahasa UI**: Gunakan **Bahasa Indonesia** untuk semua teks yang terlihat oleh user (labels, placeholders, toast messages).
12. **Tailwind v4**: Jangan gunakan `tailwind.config.js`. Semua kustomisasi tema harus dilakukan di `src/index.css` di dalam block `@theme`.
13. **Form Validation**: Selalu gunakan Zod schema yang didefinisikan di `features/*/types/*.ts` dan integrasikan dengan React Hook Form.
14. **Theme Colors & UI**: Hindari penggunaan warna hardcoded (seperti `bg-slate-900` atau `bg-white/5`) pada background dan card. Gunakan variabel tema Tailwind v4 (contoh: `bg-background`, `bg-card`) atau utility `.glass` yang sudah disediakan di `index.css` agar mendukung transisi Dark/Light Mode dengan sempurna.
15. **Seamless Session Continuity**: Setiap response sukses dari update sensitif (seperti ganti password) akan berisi `accessToken` baru dari backend. Wajib perbarui `accessToken` di store menggunakan `setAccessToken` agar user tidak terkena error 401 dan tidak perlu login ulang. Update status Premium tidak lagi memicu *logout* paksa; sistem akan melakukan verifikasi latar belakang secara otomatis.
16. **Premium Auto-Renew UI**: Pada `DashboardPage`, UI bereaksi pada status `autoRenew`. Jika `user.isPremium` & `user.autoRenew` aktif, tampilkan tombol "Batalkan Langganan". Aksi ini akan memanggil `/payment/cancel` lalu menjalankan `initializeAuth` untuk me-refresh data tanpa reload penuh.
17. **Payment Success Auto-Refresh**: Halaman `/payment/success` secara otomatis memicu `initializeAuth()` saat dimuat (*mount*). Ini menjamin bahwa state premium terbaru dari server langsung ditarik ke dalam aplikasi, sehingga saat pengguna pindah ke Dasbor, status premium sudah ter-sinkronisasi tanpa perlu muat ulang halaman manual.
