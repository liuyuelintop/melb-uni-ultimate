# 🥏 Melbourne University Ultimate Frisbee Club

[![GitHub Stars](https://img.shields.io/github/stars/liuyuelintop/melb-uni-ultimate?style=social)](https://github.com/liuyuelintop/melb-uni-ultimate/stargazers)
[![Forks](https://img.shields.io/github/forks/liuyuelintop/melb-uni-ultimate?style=social)](https://github.com/liuyuelintop/melb-uni-ultimate/network/members)
[![Contributors](https://img.shields.io/github/contributors/liuyuelintop/melb-uni-ultimate)](https://github.com/liuyuelintop/melb-uni-ultimate/graphs/contributors)
[![Next.js](https://img.shields.io/badge/Next.js-15-blue?logo=nextdotjs)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-4.9-blue?logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.3-38bdf8?logo=tailwindcss)](https://tailwindcss.com/)
[![MongoDB](https://img.shields.io/badge/MongoDB-6.0-47A248?logo=mongodb)](https://www.mongodb.com/)
[![Vercel](https://img.shields.io/badge/Deployed_on-Vercel-black?logo=vercel)](https://vercel.com/)
[![MIT License](https://img.shields.io/badge/License-MIT-green.svg)](LICENSE)

> **A modern, open-source web platform for ultimate frisbee clubs. Built for the Melbourne University Ultimate community—ready for your team!**

---

## 🌍 Live Demo

**Try it now:** [https://melb-uni-ultimate.vercel.app](https://melb-uni-ultimate.vercel.app)
_(Or deploy your own in minutes!)_

---

## ✨ Why Star This Project?

- **Beautiful, modern UI** with Tailwind, shadcn/ui, and Lucide icons
- **All-in-one club management**: events, announcements, roster, alumni, tournaments, and more
- **Admin dashboard** for easy content and user management
- **Feature-based architecture** with clean, maintainable code organization
- **Open source, MIT licensed** – ready for your club or team!
- **Easy deploy to Vercel** (or your own server)
- **Active development & welcoming to contributors**
- **Trusted by the Melbourne University Ultimate community**

---

## 🎬 Demo

| Home Page                          | Admin Dashboard                      | Events Calendar                        | Video Management              |
| ---------------------------------- | ------------------------------------ | -------------------------------------- | ----------------------------- |
| ![Home](docs/screenshots/home.png) | ![Admin](docs/screenshots/admin.png) | ![Events](docs/screenshots/events.png) | _Video features coming soon!_ |

---

## 🏆 Who's Using This?

- **Melbourne University Ultimate Frisbee Club**
- _Your club here! [Open a PR to add yours!]_

---

## 🚀 Features

### 🏠 Public Pages

- **Home**: Club intro, quick links, and highlights
- **About**: Club history, values, and leadership
- **Announcements**: News, updates, and important info
- **Events**: Practice, tournament, and social event calendar
- **Videos**: Training videos, game highlights, and educational content
- **Roster**: Public team roster with gender/role badges and filters
- **Alumni**: Connect with past members
- **Contact**: Easy contact form for inquiries

### 🔒 Member & Admin Features

- **Profile**: Secure member profiles
- **Admin Dashboard**: Manage announcements, events, videos, players, alumni, and tournaments in one place
- **Video Management**: Upload, edit, and organize YouTube videos with role-based access control
- **CRUD**: Create, edit, and delete content with confirmation dialogs and notifications
- **Role-based access**: NextAuth.js with admin/member/public roles
- **Modern UI/UX**: Responsive, accessible, and mobile-friendly

---

## 🛠️ Tech Stack

- **Next.js 15** (App Router, SSR, API routes)
- **TypeScript** (strict types everywhere)
- **Tailwind CSS** + **shadcn/ui** (customizable, beautiful components)
- **MongoDB** + **Mongoose** (robust data models)
- **NextAuth.js** (secure authentication)
- **Lucide React** (iconography)
- **Jest** (unit tests)
- **ESLint, Prettier, Husky** (code quality)

---

## ⚡ Quick Start

```bash
git clone https://github.com/your-username/melb-uni-ultimate.git
cd melb-uni-ultimate
npm install
cp docs/env.template .env.local # or set up your own env vars
npm run dev
```

- Visit [http://localhost:3000](http://localhost:3000)
- Sign up as a new user, or log in as admin (see docs/DEPLOYMENT_READY.md for admin setup)

---

## 🗂️ Project Structure

```
melb-uni-ultimate/
├── src/
│   ├── app/                    # Next.js App Router
│   │   ├── (admin)/           # Admin pages (dashboard, update-role)
│   │   ├── (auth)/            # Authentication pages (login, signup, unauthorized)
│   │   ├── (dev)/             # Development pages (debug-session)
│   │   ├── (protected)/       # Protected member pages (profile)
│   │   ├── (public)/          # Public pages (about, announcements, events, videos, etc.)
│   │   ├── api/               # API routes
│   │   │   ├── (admin)/       # Admin API routes (dashboard, debug, seed)
│   │   │   ├── (auth)/        # Auth API routes (refresh, signup, update-role)
│   │   │   ├── (protected)/   # Protected API routes (players, tournaments, user)
│   │   │   ├── (public)/      # Public API routes (alumni, announcements, events, roster, videos)
│   │   │   └── auth/          # NextAuth.js routes
│   │   ├── layout.tsx         # Root layout
│   │   ├── page.tsx           # Home page
│   │   └── providers.tsx      # App providers
│   ├── features/              # Feature-based components and logic
│   │   ├── about/             # About page components
│   │   ├── admin/             # Admin dashboard components
│   │   ├── alumni/            # Alumni management components
│   │   ├── announcements/     # Announcements components
│   │   ├── events/            # Events components
│   │   ├── roster/            # Roster management components
│   │   ├── tournaments/       # Tournament management components
│   │   └── videos/            # Video management components
│   ├── shared/                # Shared utilities and components
│   │   ├── components/        # Reusable UI components
│   │   ├── context/           # React contexts
│   │   ├── data/              # Static data
│   │   ├── hooks/             # Custom React hooks
│   │   ├── lib/               # Database, auth, and utility libraries
│   │   └── types/             # TypeScript type definitions
│   ├── styles/                # Global styles
│   └── middleware.ts          # Next.js middleware
├── public/                    # Static assets
├── docs/                      # Documentation and deployment guides
└── package.json               # Dependencies and scripts
```

### 🏗️ Architecture Highlights

- **Feature-based organization**: Each feature (alumni, events, videos, etc.) has its own directory with components, hooks, and utilities
- **Route groups**: Next.js route groups `()` organize pages by access level without affecting URLs
- **API organization**: API routes grouped by access level for better security and organization
- **Shared resources**: Common components, hooks, and utilities in `shared/` directory
- **Type safety**: Comprehensive TypeScript types for all data models and components

### 🎥 Video Management System

- **YouTube Integration**: Seamlessly embed and manage YouTube videos
- **Role-based Access**: Control video visibility (public, user, admin)
- **Smart URL Parsing**: Automatically extract YouTube IDs from URLs
- **Preview System**: Instant video previews in admin interface
- **Search & Filtering**: Find videos by title, description, or tags
- **Mobile Responsive**: Optimized viewing experience on all devices
- **Dashboard Integration**: Manage videos alongside other content in admin tabs

---

## 🛡️ Authentication & Roles

- **Public**: Anyone can view public pages
- **Member**: Authenticated users get access to protected features
- **Admin**: Full access to dashboard and management tools

---

## 🏗️ Deployment

### Vercel (Recommended)

- Push to GitHub
- Connect repo to Vercel
- Set environment variables ([see template](docs/env.template))
- Deploy!

### Manual

```bash
npm run build
npm start
```

---

## 🤔 Why Ultimate Frisbee?

Ultimate Frisbee is a fast-growing, inclusive sport that builds teamwork, spirit, and fitness. This project aims to empower clubs and communities worldwide with modern tools—join us and help grow the sport!

---

## 🧑‍💻 Contributing

We welcome contributions! To get started:

1. Fork this repo
2. Create a feature branch (`git checkout -b feature/your-feature`)
3. Commit and push your changes
4. Open a Pull Request

**Please read [docs/DEPLOYMENT_READY.md](docs/DEPLOYMENT_READY.md) for workflow and code standards.**

### Development Workflow

- **Feature branches**: All development happens on feature branches
- **Merge to develop**: Features are merged into the develop branch first
- **Merge to main**: After testing, develop is merged into main for production
- **Backup strategy**: Main branch backups are created before major merges

---

## 💬 Community & Support

- [Contact page](http://localhost:3000/contact) for club questions
- [GitHub Issues](https://github.com/your-username/melb-uni-ultimate/issues) for bugs/feature requests
- [Vercel Discussion](https://vercel.com/support) for deployment help

---

## 🙋 FAQ

**Q: Can I use this for my own club?**
A: Yes! It's open source and easy to customize.

**Q: Is it free?**
A: 100% MIT licensed.

**Q: How do I get admin access?**
A: See [docs/DEPLOYMENT_READY.md](docs/DEPLOYMENT_READY.md).

**Q: What's the new src/ directory structure?**
A: We've reorganized the codebase for better maintainability with feature-based architecture and clear separation of concerns.

---

## 🙏 Sponsors & Backers

_Sponsor this project and help us grow Ultimate!_
[Become a sponsor](https://github.com/sponsors/your-username)

---

## 📄 License

MIT License. See [LICENSE](LICENSE).

---

## ⭐️ Star This Project!

If you like this project, please **star it on GitHub** and share it with your club or team. Your support helps us grow the Ultimate community!

---

**Go Ultimate! 🥏**
