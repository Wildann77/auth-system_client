# Auth System - Frontend

A professional, high-performance authentication system frontend built with **React**, **TypeScript**, and **Vite**. This project features a robust design system using **Tailwind CSS v4**, seamless state management with **Zustand**, and efficient data fetching via **TanStack Query**.

## 🚀 Quick Start

Ensure you have [Bun](https://bun.sh/) installed.

```bash
# Install dependencies and start development server
bun dev

# Build for production
bun build:prod

# Lint the codebase
bun lint

# Preview production build
bun preview
```

## 🛠️ Tech Stack

- **Core:** React 18+ (Vite)
- **Language:** TypeScript
- **State Management:** Zustand (with Persist middleware)
- **Data Fetching:** TanStack Query (React Query)
- **Styling:** Tailwind CSS v4 (Oxide engine, CSS-first)
- **Components:** Radix UI primitives
- **Icons:** Lucide React
- **Forms:** React Hook Form + Zod
- **Routing:** React Router v6
- **HTTP Client:** Axios (with Interceptors)

## ✨ Key Features

- **Robust Auth Flow:** Registration, Login, Email Verification, and Password Reset.
- **Security:** Support for **Two-Factor Authentication (2FA)** with TOTP.
- **Premium System:** Monthly subscription model (99.000 IDR) with automatic renewal and seamless status updates.
- **Admin Dashboard:** Comprehensive user management, role updates, and statistics.
- **Aesthetics:** Dark Mode by default, Glassmorphism effects, and **Fluid Animations** (0.2s - 0.3s).
- **Localization:** Full **Bahasa Indonesia** support for UI labels, messages, and validation.

## 📂 Project Structure

```text
src/
├── features/          # Feature-based modules (auth, user, admin, payment)
│   └── [feature]/
│       ├── components/
│       ├── store/     # Zustand stores
│       └── types/     # Zod schemas & interfaces
├── shared/            # Common resources
│   ├── api/           # Axios & QueryClient configuration
│   ├── components/    # Reusable UI components (shadcn-like) & Layouts
│   ├── constants/     # Business logic constants (Roles, Financials)
│   └── routes/        # Route definitions & Protection guards
├── App.tsx            # Main application component
└── main.tsx           # Entry point
```

## 🔒 Route Protection

| Route Type | Description |
|------------|-------------|
| **Public** | Accessible by everyone (e.g., Verify Email). |
| **GuestRoute** | Redirects to Dashboard if user is already logged in. |
| **ProtectedRoute** | Requires authentication. Shows skeletons during hydration. |
| **AdminRoute** | Requires `ADMIN` role. |
| **PremiumRoute** | Requires active premium subscription. |

## 🎨 Theme & Design System

- **Colors:** Modern OKLCH format for precise color control.
  - Primary: `oklch(0.6397 0.1720 36.4421)`
  - Secondary: `oklch(0.9670 0.0029 264.5419)`
- **Typography:** Inter (Sans), Source Serif 4 (Serif), JetBrains Mono (Mono).
- **Animations:** Optimized for smoothness. All delayed elements use `opacity: 0` to prevent layout flicker.
- **Dark Mode:** Native Tailwind v4 support via `.dark` class on the root element.

## 🔧 Important Patterns

1. **Hydration Guard:** Uses `_hasHydrated` state to prevent premature redirects or flickering during app initialization.
2. **Seamless Session:** Access tokens are automatically updated in the store after sensitive actions (like changing passwords) to maintain continuity.
3. **Global Error Handling:** Centrally managed via TanStack Query `MutationCache`, showing toast notifications automatically for API errors.
4. **Reactive Redirection:** Redirects are handled reactively by state changes in `ProtectedRoute` rather than `window.location.href`.

--
*Last updated: April 2026*
