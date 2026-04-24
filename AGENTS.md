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
- **Path alias**: `@` -> `./src`
- **Build**: Vite + React + TypeScript
- **State**: Zustand (`src/features/*/store/*.store.ts`)
- **API Client**: Axios with interceptors for auth refresh
- **Data Fetching**: TanStack Query
- **UI**: Radix UI + Tailwind CSS v4 (CSS-first, shadcn/ui pattern, style: new-york)
- **Icons**: Lucide React
- **Forms**: React Hook Form + Zod validation
- **Notifications**: Sonner (Toast)
- **Routing**: React Router v6
- **Localization**: UI uses **Bahasa Indonesia** (Indonesian) for all labels and messages.

## Feature Structure

```
src/features/
  auth/           # Login, Register, 2FA, password reset
  user/           # Dashboard, user data
  admin/          # User management, stats
  payment/       # Premium features, checkout
  settings/       # User settings, 2FA setup
  content/        # Exclusive content
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
1. **Instant App Load**: App starts immediately using persisted authentication state from localStorage (Zustand persist middleware)
2. **Background Verification**: Token validity is verified asynchronously without blocking UI
3. **Tokens stored in Zustand store (`useAuthStore`)** - always store access token before authenticated API calls
4. **Access token passed via Authorization header**
5. **Automatic token refresh on 401 response**
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
GET  /admin/users        # Paginated user list
GET  /admin/stats      # Dashboard stats
PATCH /admin/users/:id/role
DELETE /admin/users/:id

Payment API:
POST /payment/checkout

Content API:
GET  /content/exclusive

Payment Constants:
Price: 99.000 IDR (PREMIUM_UPGRADE_PRICE)
Currency: IDR

## Types

```typescript
User {
  id, email, firstName, lastName
  role: 'USER' | 'ADMIN'
  provider: 'LOCAL' | 'GOOGLE'
  isEmailVerified, twoFactorEnabled
  isPremium, premiumUntil
}

ApiResponse<T> {
  success, message, data: T | null, error: { code, details? }
}
```

## Theme
 
- **Tailwind Version**: v4 (Oxide engine)
- **Configuration**: CSS-first via `@theme` in `src/index.css`. No `tailwind.config.js`.
- **Primary color**: `#2B5D3A` (forest green)
- **Secondary color**: `#4A90E2` (blue)
- **Accent color**: `#F5A623` (orange)
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

1. **Auth Store Injection**: Store is exposed to window for axios interceptor access (`window.__authStore`)
2. **Persist Middleware**: Zustand persist middleware handles authentication state restoration from localStorage on app start
3. **Instant Auth UX**: App renders immediately with persisted state; no loading screens for returning users
4. **Background Verification**: Token validation occurs asynchronously without blocking UI
5. **Component Export**: Use `react-refresh/only-export-components` for HMR
6. **Token Ordering**: Always store access tokens in Zustand store before making authenticated API calls, as axios interceptors rely on store state
7. **2FA Error Handling**: Catch 400 errors with "2FA code required" message in login flow to trigger OTP input UI
8. **Response Validation**: Use `result.data?.requires2FA` for consistent API response checking in auth flows
9. **Dark Mode**: Managed in `AppLayout.tsx` by toggling `.dark` class on `document.documentElement`. Default is dark.
10. **UI Language**: Always use **Bahasa Indonesia** for user-facing text (buttons, labels, messages).

## Konteks AI untuk Konsistensi

Untuk AI Agent yang bekerja di repositori ini, harap perhatikan aturan berikut:

1.  **Instant Auth UX**: App mulai langsung dengan state yang dipersist; tidak ada layar loading untuk user yang kembali.
2.  **Persist Middleware**: Zustand persist middleware menangani restorasi state auth dari localStorage saat app start.
3.  **Background Verification**: Validasi token terjadi asynchronous tanpa memblokir UI.
4.  **Pola Auth Store**: Gunakan `window.__authStore` jika ingin mengakses state auth di luar komponen React (seperti di Axios interceptor).
5.  **Penanganan Error API**: Selalu periksa format `ApiResponse<T>`. Backend melempar error dalam format JSON, bukan hanya status code.
6.  **Urutan Token**: Saat mendapatkan token baru (dari refresh atau OAuth), simpan ke store **sebelum** melakukan pemanggilan API berikutnya yang membutuhkan otentikasi.
7.  **Skema Validasi**: Jaga konsistensi antara skema Zod di frontend (`features/auth/types/auth.types.ts`) dan backend. Jika ada perubahan aturan validasi di satu sisi, wajib update di sisi lainnya.
8.  **Multi-step Auth**: Jangan asumsikan login selalu sukses dalam satu langkah. Selalu tangani kondisi `requires2FA` atau `emailNotVerified`.
9.  **2FA Error Handling**: Tangkap error 400 dengan pesan "2FA code required" di alur login untuk memicu UI input OTP.
10. **Validasi Response**: Gunakan `result.data?.requires2FA` untuk pemeriksaan response API yang konsisten di alur auth.
11. **Bahasa UI**: Gunakan **Bahasa Indonesia** untuk semua teks yang terlihat oleh user (labels, placeholders, toast messages).
12. **Tailwind v4**: Jangan gunakan `tailwind.config.js`. Semua kustomisasi tema harus dilakukan di `src/index.css` di dalam block `@theme`.
13. **Form Validation**: Selalu gunakan Zod schema yang didefinisikan di `features/*/types/*.ts` dan integrasikan dengan React Hook Form.
