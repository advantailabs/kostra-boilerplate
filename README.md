# Peon - Minimalistic Project and Task Management System

A minimalistic project and task management system built with Next.js, TypeScript, and Tailwind CSS. Peon helps you organize projects, track tasks, and boost productivity with a clean and intuitive interface.

## 🚀 Features

- ⚡️ Next.js 14 with App Router
- 🎨 Tailwind CSS for styling
- 🔒 Authentication with Clerk
- 📊 Data visualization with Recharts
- 🎯 TypeScript for type safety
- 🎭 Dark/Light mode support
- 📱 Responsive design
- 🔄 State management with Zustand
- 🎨 UI Components with Radix UI
- 📦 Database with Prisma and Supabase

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Git

## 🛠️ Installation

1. Clone the repository:

```bash
git clone https://github.com/yourusername/tracko.git
cd tracko
```

2. Install dependencies:

```bash
pnpm install
```

3. Set up environment variables:

```bash
cp .env.example .env
```

Then edit the `.env` file and add your configuration values:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=your_clerk_publishable_key
CLERK_SECRET_KEY=your_clerk_secret_key
DATABASE_URL=your_database_url
```

4. Initialize the database:

```bash
pnpm migrate
pnpm seed
```

5. Start the development server:

```bash
pnpm dev
```

The application will be available at `http://localhost:3000`

## 📁 Project Structure

```
tracko/
├── src/
│   ├── app/                    # Next.js app router pages and layouts
│   │   ├── api/               # API routes and endpoints
│   │   ├── (auth)/           # Authentication related pages
│   │   └── (dashboard)/      # Dashboard related pages
│   │
│   ├── components/            # Reusable UI components
│   │   ├── atom/             # Basic building blocks (buttons, inputs, etc.)
│   │   ├── molecules/        # Combinations of atoms (form fields, cards, etc.)
│   │   ├── organisms/        # Complex UI components (forms, tables, etc.)
│   │   ├── icons/            # SVG icons and icon components
│   │   └── branding/         # Landing page components
│   │
│   ├── lib/                  # Utility functions and shared logic
│   │   ├── prisma/          # Database client and utilities
│   │   ├── utils/           # Helper functions
│   │   └── constants/       # Application constants
│   │
│   ├── providers/           # Context providers and wrappers
│   │   ├── auth/           # Authentication providers
│   │   └── theme/          # Theme providers
│   │
│   ├── services/           # API services and external integrations
│   │   ├── api/           # API client and endpoints
│   │   └── external/      # Third-party service integrations
│   │
│   ├── store/             # Zustand store configurations
│   │   ├── auth/         # Authentication state
│   │   └── ui/           # UI state management
│   │
│   ├── types/            # TypeScript type definitions
│   │   ├── api/         # API types
│   │   └── models/      # Data model types
│   │
│   ├── data/            # Static data and constants
│   │   ├── mock/       # Mock data for development
│   │   └── config/     # Configuration data
│   │
│   └── styles/         # Global styles and Tailwind configurations
│       ├── globals/    # Global CSS
│       └── themes/     # Theme configurations
│
├── prisma/             # Database schema and migrations
│   ├── migrations/    # Database migration files
│   └── seed/         # Database seed data
│
├── public/            # Static assets
│   ├── images/       # Image assets
│   └── fonts/        # Font files
│
└── supabase/         # Supabase configurations
    ├── functions/    # Edge functions
    └── config/      # Supabase configuration files
```

### Component Architecture

The project follows Atomic Design principles for component organization:

- **Atom**: Basic building blocks (buttons, inputs, labels)
- **Molecules**: Combinations of atoms (form fields, search bars)
- **Organisms**: Complex UI components (navigation, forms, tables)
- **Features**: Feature-specific components that combine organisms
- **Icons**: Reusable icon components
- **Branding**: All components for landing page.

## 🎯 Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm migrate` - Run database migrations
- `pnpm seed` - Seed the database
- `pnpm generate` - Generate Prisma client

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a new branch (`git checkout -b feature/amazing-feature`)
3. Make your changes
4. Commit your changes (`git commit -m 'Add amazing feature'`)
5. Push to the branch (`git push origin feature/amazing-feature`)
6. Open a Pull Request

### Code Style Guidelines

- Follow the TypeScript best practices
- Use meaningful variable and function names
- Write comments for complex logic
- Follow the existing code formatting (Prettier is configured)
- Write tests for new features

## 📝 Extending the Project

### Adding New Features

1. **New Pages**

   - Create new routes in `src/app`
   - Follow the existing layout patterns
   - Add necessary components in `src/components`

2. **New Components**

   - Create components in `src/components`
   - Use Radix UI primitives for accessibility
   - Follow the existing component patterns
   - Add TypeScript types in `src/types`

3. **New API Routes**

   - Add API routes in `src/app/api`
   - Use the existing service patterns
   - Add proper error handling
   - Document the API endpoints

4. **Database Changes**
   - Modify the schema in `prisma/schema.prisma`
   - Run migrations using `pnpm migrate`
   - Update types using `pnpm generate`

### Best Practices

- Keep components small and focused
- Use TypeScript for type safety
- Follow the existing project structure
- Write clean, maintainable code
- Add proper documentation
- Test your changes thoroughly

## 📄 License

This project is proprietary and licensed to Advant. All rights reserved. Unauthorized copying, modification, distribution, or use of this software, via any medium, is strictly prohibited.

## 🙏 Acknowledgments

- [Next.js](https://nextjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Radix UI](https://www.radix-ui.com/)
- [Clerk](https://clerk.com/)
- [Prisma](https://www.prisma.io/)
- [Supabase](https://supabase.com/)


## Environment Variables

Required environment variables:

- `OPENAI_API_KEY`: Your OpenAI API key for assistant creation and management
  - Get it from: https://platform.openai.com/api-keys
  - Format: `sk-...`

Copy `.env.example` to `.env` and fill in your values.
