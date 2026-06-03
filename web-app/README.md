# Minimalist — Web App

Frontend for the Minimalist store. Built with Next.js 16, Tailwind CSS v4, and shadcn/ui.

## Stack

| Layer | Technology |
|---|---|
| Framework | Next.js 16 (App Router) |
| Styling | Tailwind CSS v4 |
| Components | shadcn/ui + Radix UI |
| Fonts | DM Sans, Cormorant Garamond |
| Icons | Lucide React |
| Linter / Formatter | Biome |
| Package manager | pnpm |

## Getting started

```bash
pnpm install
pnpm dev
```

The app runs at `http://localhost:3000`.

## Scripts

```bash
pnpm dev       # start development server
pnpm build     # production build
pnpm start     # start production server
pnpm lint      # lint with Biome
pnpm format    # auto-format with Biome
pnpm check     # lint + format in one pass
```

## Project structure

```
src/
├── app/
│   ├── (auth)/          # login, signup
│   ├── (store)/         # cart, orders
│   ├── globals.css      # design tokens, animations
│   ├── layout.tsx       # root layout
│   └── page.tsx         # homepage
├── components/
│   ├── layout/          # SiteHeader, SiteFooter
│   └── ui/              # shadcn/ui components
├── hooks/               # custom React hooks
├── lib/                 # utilities (cn, etc.)
└── types/               # shared TypeScript types
```

## Docker

Build and run with Docker:

```bash
docker build -t minimalist-web .
docker run -p 3000:3000 minimalist-web
```

The image uses a multi-stage build and outputs a standalone Next.js bundle.
