# Melbourne University Ultimate Frisbee Club

A modern web application for the Melbourne University Ultimate Frisbee Club, built with Next.js 15, TypeScript, and Tailwind CSS. This platform serves as the official website for club management, member communication, and community engagement.

## 🏆 About the Club

The Melbourne University Ultimate Frisbee Club has been promoting the spirit of the game and building a vibrant community since 1995. We compete in local and national tournaments while fostering a welcoming environment for players of all skill levels.

### Key Features

- **Competitive Spirit**: Compete in local and national tournaments
- **Community**: Welcoming environment for all skill levels
- **Fitness & Fun**: Regular practices and social events
- **Spirit of the Game**: Emphasis on sportsmanship and self-officiating

## 🚀 Features

### Public Pages

- **Home**: Club overview and quick links
- **About**: Club history, mission, values, and leadership
- **Announcements**: Club news and updates
- **Events**: Practice schedules and tournament information
- **Contact**: Get in touch with club leadership

### Protected Member Features

- **Profile Management**: Update personal information
- **Team Roster**: View current club members
- **Alumni Network**: Connect with former members

### Admin Features

- **User Management**: Manage member accounts and roles
- **Content Management**: Create and edit announcements and events
- **Database Administration**: Access to club data

## 🛠️ Tech Stack

- **Framework**: [Next.js 15](https://nextjs.org/) with App Router
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **Authentication**: [NextAuth.js](https://next-auth.js.org/)
- **Database**: [MongoDB](https://www.mongodb.com/) with [Mongoose](https://mongoosejs.com/)
- **UI Components**: Custom components with [Lucide React](https://lucide.dev/) icons
- **Deployment**: [Vercel](https://vercel.com/)

## 📋 Prerequisites

- Node.js 18+
- npm, yarn, pnpm, or bun
- MongoDB database
- Environment variables configured

## 🚀 Getting Started

### 1. Clone the Repository

```bash
git clone https://github.com/your-username/melb-uni-ultimate.git
cd melb-uni-ultimate
```

### 2. Install Dependencies

```bash
npm install
# or
yarn install
# or
pnpm install
# or
bun install
```

### 3. Environment Setup

Create a `.env.local` file in the root directory with the following variables:

```env
# Database
MONGODB_URI=your_mongodb_connection_string

# NextAuth
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret

# Email (optional)
EMAIL_SERVER_HOST=your_smtp_host
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER=your_email_user
EMAIL_SERVER_PASSWORD=your_email_password
EMAIL_FROM=noreply@yourdomain.com
```

### 4. Run the Development Server

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## 📁 Project Structure

```
melb-uni-ultimate/
├── app/                    # Next.js App Router
│   ├── (protected)/       # Protected routes (members only)
│   ├── (public)/          # Public routes
│   ├── admin/             # Admin panel
│   ├── api/               # API routes
│   └── layout.tsx         # Root layout
├── components/            # Reusable UI components
│   ├── admin/            # Admin-specific components
│   ├── announcement/     # Announcement components
│   ├── event/            # Event components
│   ├── layout/           # Layout components
│   ├── roster/           # Roster components
│   └── ui/               # Generic UI components
├── lib/                   # Utility libraries
│   ├── auth/             # Authentication utilities
│   ├── db/               # Database models and connection
│   └── utils.ts          # General utilities
├── public/               # Static assets
└── styles/               # Global styles
```

## 🔧 Available Scripts

- `npm run dev` - Start development server with Turbopack
- `npm run build` - Build the application for production
- `npm run start` - Start the production server
- `npm run lint` - Run ESLint for code quality

## 🗄️ Database Models

The application uses MongoDB with the following main models:

- **User**: Member accounts and authentication
- **Player**: Player profiles and statistics
- **Announcement**: Club news and updates
- **Event**: Practices, tournaments, and social events
- **Alumni**: Former member information

## 🔐 Authentication & Authorization

The application uses NextAuth.js with role-based access control:

- **Public**: Anyone can view public pages
- **Member**: Authenticated users can access protected features
- **Admin**: Administrators can manage content and users

## 🚀 Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repository to Vercel
3. Configure environment variables in Vercel dashboard
4. Deploy automatically on push to main branch

### Manual Deployment

```bash
npm run build
npm run start
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 📞 Contact

For questions about the club, visit our [Contact page](http://localhost:3000/contact) or reach out to the club leadership.

For technical issues with the website, please open an issue on GitHub.

---

**Go Ultimate! 🥏**
