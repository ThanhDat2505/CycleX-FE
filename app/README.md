# App Directory Structure

## Overview
This is a Next.js App Router project. File naming follows Next.js conventions.

## Page Routes

| Route | File | Screen ID | Description |
|-------|------|-----------|-------------|
| `/` | `page.tsx` | S-01 | **Trang Chủ (Home)** - Main landing page |
| `/login` | `login/page.tsx` | S-02 | Đăng Nhập (Login) |
| `/register` | `register/page.tsx` | S-03 | Đăng Ký (Register) |
| `/search` | `search/page.tsx` | S-30 | Tìm Kiếm (Search) - *Not implemented* |
| `/listing/[id]` | `listing/[id]/page.tsx` | S-31 | Chi Tiết Xe (Listing Detail) - *Not implemented* |

## Folder Structure

```
app/
├── page.tsx              # S-01 HOME PAGE (/)
├── layout.tsx            # Root layout (header, footer wrapper)
├── globals.css           # Global styles
│
├── login/                # S-02 Login
│   ├── page.tsx
│   └── LoginForm.tsx
│
├── register/             # S-03 Register
│   ├── page.tsx
│   └── RegisterForm.tsx
│
├── components/           # Reusable components
│   ├── ui/               # Generic UI components
│   │   ├── Badge.tsx
│   │   ├── SectionHeader.tsx
│   │   ├── Button.tsx
│   │   ├── Input.tsx
│   │   └── ...
│   ├── Header.tsx        # Site header (navigation)
│   ├── Footer.tsx        # Site footer
│   ├── HeroSection.tsx   # Home hero section
│   ├── FeaturesSection.tsx
│   ├── CategorySection.tsx
│   ├── ListingCard.tsx
│   ├── ListingGrid.tsx
│   └── Pagination.tsx
│
├── services/             # API services
│   ├── authService.ts
│   └── listingService.ts
│
├── types/                # TypeScript interfaces
│   ├── auth.ts
│   └── listing.ts
│
├── hooks/                # Custom React hooks
│   └── useAuth.ts
│
├── utils/                # Utility functions
│   ├── scroll.ts
│   └── format.ts
│
└── constants/            # Static constants
    ├── pagination.ts
    ├── categories.ts
    └── navigation.ts
```

## Naming Conventions

- **Pages**: `page.tsx` (Next.js convention)
- **Components**: PascalCase (e.g., `ListingCard.tsx`)
- **Hooks**: camelCase with `use` prefix (e.g., `useAuth.ts`)
- **Services**: camelCase with `Service` suffix (e.g., `authService.ts`)
- **Types**: camelCase (e.g., `listing.ts`)
- **Utils/Constants**: camelCase (e.g., `scroll.ts`)

## Screen ID Reference

| Screen ID | Name | Status |
|-----------|------|--------|
| S-01 | Trang Chủ | ✅ Implemented |
| S-02 | Đăng Nhập | ✅ Implemented |
| S-03 | Đăng Ký | ✅ Implemented |
| S-04 | Quên Mật Khẩu | ⬜ Not started |
| S-30 | Tìm Kiếm | ⬜ Not started |
| S-31 | Chi Tiết Xe | ⬜ Not started |
