# SaaS Boilerplate - Modern Web Application

A comprehensive SaaS boilerplate built with Next.js, TypeScript, and Tailwind CSS. This boilerplate provides a solid foundation for building modern web applications with authentication, file management, and scalable architecture. It includes all the essential features you need to get started quickly while maintaining clean code and best practices.

## 🚀 Features

- ⚡️ Next.js 14 with App Router
- 🎨 Tailwind CSS for styling
- 🔒 Authentication with Google OAuth
- 📊 Data visualization with Recharts
- 🎯 TypeScript for type safety
- 🎭 Dark/Light mode support
- 📱 Responsive design
- 🔄 State management with Zustand
- 🎨 UI Components with Radix UI
- 📦 Database with Prisma and Supabase
- 🐳 Docker support for deployment
- 🧪 Jest testing framework
- 📝 Rich text editor with TipTap
- 💳 Stripe payment integration
- 📁 File upload with AWS S3
- 🤖 OpenAI integration for AI features
- 📈 Sentry error monitoring
- 🎨 Framer Motion animations
- 📋 Data tables with TanStack Table
- 🔍 Advanced search and filtering
- 🎨 Drag and drop with Atlaskit Pragmatic Drag and Drop
- 📅 Date picker with React Aria
- 🎨 Gradient buttons and modern UI components
- 📱 Mobile-responsive sidebar navigation
- 🔐 JWT-based authentication
- 📊 Credit system for usage tracking
- 🎯 Blog management system
- 📂 Category management
- 👥 User management with admin panel
- 📦 Package management with admin panel
- 📄 SEO optimization with sitemap and robots.txt
- 🎨 Modern landing page with branding components
- 📱 Progressive Web App (PWA) support
- 🔧 Comprehensive error handling
- 📝 Form validation with Zod
- 🎨 Custom icon components
- 📊 Advanced data table with filtering and sorting
- 🎨 Interactive demos and showcases

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- Node.js (v18 or higher)
- pnpm (recommended) or npm
- Git

## 🛠️ Installation

1. Clone the repository:

```bash
git clone git@github.com:advantailabs/sass-boilerplate.git
cd saas-boilerplate
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
# Database
POSTGRES_URL=your_database_url

# Authentication
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
JWT_SECRET=your_jwt_secret

# OpenAI
OPENAI_API_KEY=your_openai_api_key

# AWS S3
AWS_ACCESS_KEY_ID=your_aws_access_key
AWS_SECRET_ACCESS_KEY=your_aws_secret_key
AWS_REGION=your_aws_region
AWS_S3_BUCKET=your_s3_bucket_name

# Stripe
STRIPE_SECRET_KEY=your_stripe_secret_key
STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=your_stripe_webhook_secret

# Sentry (Optional)
SENTRY_DSN=your_sentry_dsn
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

## 🐳 Docker Support

This boilerplate includes Docker support for easy deployment and development:

### Development with Docker

```bash
# Build and run with Docker Compose
docker-compose up --build

# Run in detached mode
docker-compose up -d
```

### Production Deployment

```bash
# Build production image
docker build -f infra/Dockerfile -t saas-boilerplate .

# Run production container
docker run -p 3000:3000 saas-boilerplate
```

### Local Development with Docker

```bash
# Build local development image
docker build -f infra/Dockerfile-local.dockerfile -t saas-boilerplate-local .

# Run local development container
docker run -p 3000:3000 saas-boilerplate-local
```

## 📁 Project Structure

```
saas-boilerplate/
├── src/
│   ├── app/                    # Next.js app router pages and layouts
│   │   ├── api/               # API routes and endpoints
│   │   │   ├── admin/         # Admin API endpoints
│   │   │   │   └── users/     # User management endpoints
│   │   │   ├── auth/          # Authentication API endpoints
│   │   │   │   ├── [...nextauth]/ # NextAuth configuration
│   │   │   │   ├── google/    # Google OAuth endpoint
│   │   │   │   ├── logout/    # Logout endpoint
│   │   │   │   └── route.ts   # Auth route handler
│   │   │   ├── billing/       # Billing and payment endpoints
│   │   │   │   ├── checkout/  # Stripe checkout
│   │   │   │   └── portal/    # Stripe customer portal
│   │   │   ├── blogs/         # Blog management endpoints
│   │   │   │   ├── [id]/      # Individual blog endpoints
│   │   │   │   └── route.ts   # Blog route handler
│   │   │   ├── categories/    # Category management endpoints
│   │   │   │   ├── [id]/      # Individual category endpoints
│   │   │   │   └── route.ts   # Category route handler
│   │   │   ├── file-upload/   # File upload endpoints
│   │   │   │   └── presigned-url/ # S3 presigned URL generation
│   │   │   ├── files/         # File management endpoints
│   │   │   │   ├── [id]/      # Individual file endpoints
│   │   │   │   └── route.ts   # File route handler
│   │   │   ├── packages/      # Package endpoints
│   │   │   │   ├── [id]/      # Individual package endpoints
│   │   │   │   └── route.ts   # Package route handler
│   │   │   ├── users/         # User management endpoints
│   │   │   │   ├── credits/   # Credit management
│   │   │   │   └── data/      # User data endpoints
│   │   │   └── webhooks/      # Webhook endpoints
│   │   │       └── stripe/    # Stripe webhook handler
│   │   ├── (branding)/       # Landing page and marketing pages
│   │   │   ├── privacy-policy/ # Privacy policy page
│   │   │   ├── terms-of-services/ # Terms of service page
│   │   │   ├── layout.tsx    # Branding layout
│   │   │   └── page.tsx      # Landing page
│   │   ├── app/              # Main application pages
│   │   │   ├── admin/        # Admin dashboard pages
│   │   │   ├── blogs/        # Blog management pages
│   │   │   ├── categories/   # Category management pages
│   │   │   ├── credit-history/ # Credit transaction history
│   │   │   ├── details/      # User details page
│   │   │   ├── files/        # File management pages
│   │   │   ├── packages/     # Package management pages
│   │   │   ├── settings/     # User settings pages
│   │   │   ├── layout.tsx    # App layout
│   │   │   ├── not-found.tsx # 404 page
│   │   │   └── page.tsx      # Dashboard home
│   │   ├── auth/            # Authentication pages
│   │   │   └── signin/      # Sign-in page
│   │   ├── onboarding/      # User onboarding flow
│   │   ├── favicon.ico      # Favicon
│   │   ├── global-error.tsx # Global error boundary
│   │   ├── globals.css      # Global styles
│   │   ├── layout.tsx       # Root layout
│   │   ├── robots.ts        # Robots.txt generation
│   │   ├── siteConfig.ts    # Site configuration
│   │   └── sitemap.ts       # Sitemap generation
│   │
│   ├── components/            # Reusable UI components
│   │   ├── atom/             # Basic building blocks (buttons, inputs, etc.)
│   │   │   ├── Avatar.tsx   # User avatar component
│   │   │   ├── Badge.tsx    # Badge component
│   │   │   ├── Button.tsx   # Button component
│   │   │   ├── Card.tsx     # Card component
│   │   │   ├── Checkbox.tsx # Checkbox component
│   │   │   ├── CreditDisplay.tsx # Credit display component
│   │   │   ├── Divider.tsx  # Divider component
│   │   │   ├── Input.tsx    # Input component
│   │   │   ├── Label.tsx    # Label component
│   │   │   ├── LoadingScreen.tsx # Loading screen
│   │   │   ├── PillSelect.tsx # Pill select component
│   │   │   ├── ProgressBar.tsx # Progress bar
│   │   │   ├── ProgressCircle.tsx # Progress circle
│   │   │   ├── RadioCard.tsx # Radio card component
│   │   │   ├── SignInButton.tsx # Sign-in button
│   │   │   ├── Spinner.tsx  # Spinner component
│   │   │   ├── Switch.tsx   # Switch component
│   │   │   ├── Textarea.tsx # Textarea component
│   │   │   ├── Toast.tsx    # Toast component
│   │   │   ├── Tooltip.tsx  # Tooltip component
│   │   │   └── UserProfilePicture.tsx # User profile picture
│   │   ├── molecules/        # Combinations of atoms (form fields, cards, etc.)
│   │   │   ├── blogs/       # Blog-specific molecules
│   │   │   │   ├── BlogCard.tsx # Blog card component
│   │   │   │   └── BlogGrid.tsx # Blog grid component
│   │   │   ├── chat/        # Chat-related molecules
│   │   │   ├── common/      # Common reusable molecules
│   │   │   │   ├── Calendar.tsx # Calendar component
│   │   │   │   ├── CommandBar.tsx # Command bar
│   │   │   │   ├── CreditPurchaseModal.tsx # Credit purchase modal
│   │   │   │   ├── DatePicker.tsx # Date picker
│   │   │   │   ├── DeleteDialog.tsx # Delete confirmation dialog
│   │   │   │   ├── Dialog.tsx # Dialog component
│   │   │   │   ├── Drawer.tsx # Drawer component
│   │   │   │   ├── Dropdown.tsx # Dropdown component
│   │   │   │   ├── GoogleSignInButton.tsx # Google sign-in button
│   │   │   │   ├── GradientCtaButton.tsx # Gradient CTA button
│   │   │   │   ├── Modal.tsx # Modal component
│   │   │   │   ├── PageHeader.tsx # Page header
│   │   │   │   ├── PageHeaderWithAction.tsx # Page header with action
│   │   │   │   ├── Pagination.tsx # Pagination component
│   │   │   │   ├── Popover.tsx # Popover component
│   │   │   │   ├── Searchbar.tsx # Search bar
│   │   │   │   ├── Select.tsx # Select component
│   │   │   │   ├── Table.tsx # Table component
│   │   │   │   ├── TabNavigation.tsx # Tab navigation
│   │   │   │   ├── UnifiedSearchBar.tsx # Unified search bar
│   │   │   │   └── UserDetailsList.tsx # User details list
│   │   │   ├── editor/      # Rich text editor components
│   │   │   │   └── Editor.tsx # TipTap editor
│   │   │   ├── files/      # File-related molecules
│   │   │   │   ├── FileCard.tsx # File card
│   │   │   │   ├── FileDetailsModal.tsx # File details modal
│   │   │   │   └── FileFilterModal.tsx # File filter modal
│   │   │   ├── form/      # Form-specific molecules
│   │   │   │   ├── BlogFormFields.tsx # Blog form fields
│   │   │   │   ├── BlogImageUpload.tsx # Blog image upload
│   │   │   │   ├── FormTagInput.tsx # Form tag input
│   │   │   │   └── TagInput.tsx # Tag input component
│   │   │   └── SignInModal.tsx # Sign-in modal
│   │   ├── organisms/        # Complex UI components (forms, tables, etc.)
│   │   │   ├── modules/      # Feature-specific organisms
│   │   │   │   ├── admin/    # Admin module components
│   │   │   │   │   ├── ModalAddUser.tsx # Add user modal
│   │   │   │   │   ├── ModalDeleteUser.tsx # Delete user modal
│   │   │   │   │   ├── ModalEditUser.tsx # Edit user modal
│   │   │   │   │   ├── ModalUserDetails.tsx # User details modal
│   │   │   │   │   ├── UsersPage.tsx # Users page
│   │   │   │   │   └── UsersTable.tsx # Users table
│   │   │   │   ├── blogs/    # Blog module components
│   │   │   │   │   ├── BlogModal.tsx # Blog modal
│   │   │   │   │   ├── BlogsPage.tsx # Blogs page
│   │   │   │   │   └── DeleteBlogDialog.tsx # Delete blog dialog
│   │   │   │   ├── categories/ # Category module components
│   │   │   │   │   ├── CategoriesPage.tsx # Categories page
│   │   │   │   │   ├── CategoriesTable.tsx # Categories table
│   │   │   │   │   ├── CategoryModal.tsx # Category modal
│   │   │   │   │   └── DeleteCategoryDialog.tsx # Delete category dialog
│   │   │   │   ├── files/    # File module components
│   │   │   │   │   ├── FileGrid.tsx # File grid
│   │   │   │   │   └── FileUploader.tsx # File uploader
│   │   │   │   ├── packages/ # Package module components
│   │   │   │   │   ├── PackageModal.tsx # Package modal
│   │   │   │   │   ├── PackagesPage.tsx # Packages page
│   │   │   │   │   ├── PackagesTable.tsx # Packages table
│   │   │   │   │   └── DeletePackageDialog.tsx # Delete package dialog
│   │   │   │   └── settings/ # Settings module components
│   │   │   │       └── ModalAddUser.tsx # Add user modal
│   │   │   └── shared/       # Shared organisms (navigation, data tables)
│   │   │       ├── data-table/ # Data table components
│   │   │       │   ├── columns.tsx # Table columns
│   │   │       │   ├── DataTable.tsx # Main data table
│   │   │       │   ├── DataTableBulkEditor.tsx # Bulk editor
│   │   │       │   ├── DataTableColumnHeader.tsx # Column header
│   │   │       │   ├── DataTableFilter.tsx # Table filter
│   │   │       │   ├── DataTableFilterbar.tsx # Filter bar
│   │   │       │   ├── DataTablePagination.tsx # Pagination
│   │   │       │   ├── DataTableRowActions.tsx # Row actions
│   │   │       │   ├── DataTableViewOptions.tsx # View options
│   │   │       │   └── TanstackTable.d.ts # Type definitions
│   │   │       └── navigation/ # Navigation components
│   │   │           ├── DropdownUserProfile.tsx # User profile dropdown
│   │   │           ├── MobileSidebar.tsx # Mobile sidebar
│   │   │           ├── Sidebar.tsx # Main sidebar
│   │   │           └── UserProfile.tsx # User profile component
│   │   ├── icons/            # SVG icons and icon components
│   │   │   ├── AmazonWebServices.tsx # AWS icon
│   │   │   ├── ArrowAnimated.tsx # Animated arrow
│   │   │   ├── Dropbox.tsx # Dropbox icon
│   │   │   ├── GoogleDrive.tsx # Google Drive icon
│   │   │   ├── JavaScript.tsx # JavaScript icon
│   │   │   ├── Onedrive.tsx # OneDrive icon
│   │   │   ├── Python.tsx # Python icon
│   │   │   ├── SharePoint.tsx # SharePoint icon
│   │   │   ├── Slack.tsx # Slack icon
│   │   │   ├── Swagger.tsx # Swagger icon
│   │   │   ├── Teams.tsx # Teams icon
│   │   │   └── Widget.tsx # Widget icon
│   │   └── branding/         # Landing page components
│   │       ├── cta-section.tsx # Call-to-action section
│   │       ├── DummySearchBox.tsx # Search box demo
│   │       ├── feature-card.tsx # Feature card
│   │       ├── footer.tsx # Footer component
│   │       ├── grid-background.tsx # Grid background
│   │       ├── hero-pattern.tsx # Hero pattern
│   │       ├── hero-section.tsx # Hero section
│   │       ├── innovative-hero.tsx # Innovative hero
│   │       ├── interactive-demo.tsx # Interactive demo
│   │       ├── minimal-features.tsx # Minimal features
│   │       ├── minimal-footer.tsx # Minimal footer
│   │       ├── modern-navigation.tsx # Modern navigation
│   │       ├── navigation.tsx # Navigation component
│   │       ├── pricing-section.tsx # Pricing section
│   │       ├── screenshot-showcase.tsx # Screenshot showcase
│   │       ├── security-section.tsx # Security section
│   │       ├── use-cases.tsx # Use cases
│   │       ├── userProfile.tsx # User profile
│   │       └── value-proposition.tsx # Value proposition
│   │
│   ├── hooks/               # Custom React hooks
│   │   ├── useAdminUsers.ts # Admin users hook
│   │   ├── useApiMutation.ts # API mutation hook
│   │   ├── useBlogForm.ts # Blog form hook
│   │   ├── useBlogs.ts # Blogs hook
│   │   ├── useCategories.ts # Categories hook
│   │   ├── useCredits.ts # Credits hook
│   │   ├── useFiles.ts # Files hook
│   │   ├── useFileUpload.ts # File upload hook
│   │   ├── useGoogleSignIn.ts # Google sign-in hook
│   │   ├── useLogout.ts # Logout hook
│   │   ├── usePackages.ts # Packages hook
│   │   ├── useSignInModal.ts # Sign-in modal hook
│   │   └── useStripe.ts # Stripe hook
│   │
│   ├── lib/                 # Utility functions and shared logic
│   │   ├── auth/            # Authentication utilities
│   │   │   └── jwt.ts       # JWT utilities
│   │   ├── constants/       # Application constants
│   │   │   ├── admin.ts     # Admin constants
│   │   │   ├── cors.ts      # CORS constants
│   │   │   ├── credits.ts   # Credits constants
│   │   │   └── sidebar-navigation.ts # Sidebar navigation
│   │   ├── prisma/          # Database client and utilities
│   │   │   └── index.ts     # Prisma client
│   │   ├── routes/          # Route configuration and utilities
│   │   │   ├── config.ts    # Route configuration
│   │   │   ├── cors.ts      # CORS configuration
│   │   │   ├── index.ts     # Route index
│   │   │   ├── permissions.ts # Route permissions
│   │   │   ├── types.ts     # Route types
│   │   │   └── utils.ts     # Route utilities
│   │   ├── utils/           # Helper functions
│   │   │   ├── error-handler.ts # Error handling
│   │   │   ├── errors.ts    # Error definitions
│   │   │   ├── password.ts  # Password utilities
│   │   │   ├── README-error-handling.md # Error handling docs
│   │   │   ├── response.ts  # Response utilities
│   │   │   └── validation.ts # Validation utilities
│   │   ├── axios.ts         # Axios configuration
│   │   ├── css-utils.ts     # CSS utilities
│   │   ├── file-upload-config.ts # File upload configuration
│   │   ├── file-upload-README.md # File upload documentation
│   │   ├── file-utils.test.ts # File utilities tests
│   │   ├── file-utils.ts    # File utilities
│   │   ├── format-utils.ts  # Format utilities
│   │   ├── presigned-upload.ts # Presigned upload utilities
│   │   ├── s3.test.ts       # S3 tests
│   │   ├── s3.ts            # S3 utilities
│   │   ├── stripe.ts        # Stripe utilities
│   │   ├── useOnWindowResize.tsx # Window resize hook
│   │   └── utils.ts         # General utilities
│   │
│   ├── providers/           # Context providers and wrappers
│   │   ├── AuthProvider.tsx # Authentication provider
│   │   ├── Providers.tsx    # Main providers wrapper
│   │   └── SignInModalProvider.tsx # Sign-in modal provider
│   │
│   ├── schemas/             # Zod validation schemas
│   │   ├── blog.schema.ts   # Blog validation schema
│   │   └── category.schema.ts # Category validation schema
│   │
│   ├── services/            # API services and external integrations
│   │   ├── api/             # API client and endpoints
│   │   │   ├── auth.ts      # Auth API service
│   │   │   ├── blogs.ts     # Blogs API service
│   │   │   ├── categories.ts # Categories API service
│   │   │   ├── credits.ts   # Credits API service
│   │   │   ├── file-upload.ts # File upload API service
│   │   │   ├── files.ts     # Files API service
│   │   │   └── packages.ts  # Packages API service
│   │   ├── external/        # Third-party service integrations
│   │   │   └── google/      # Google services
│   │   │       └── auth.ts  # Google auth service
│   │   ├── internal/        # Backend reusable services
│   │   │   ├── __tests__/   # Service tests
│   │   │   │   └── package.service.test.ts # Package service tests
│   │   │   ├── credit.ts    # Credit service
│   │   │   ├── file.ts      # File service
│   │   │   └── package.ts   # Package service
│   │   └── repositories/    # Database/ORM service calls
│   │       ├── blogs/       # Blog repository
│   │       │   └── index.ts # Blog repository implementation
│   │       ├── categories/  # Category repository
│   │       │   └── index.ts # Category repository implementation
│   │       ├── file/        # File repository
│   │       │   └── index.ts # File repository implementation
│   │       ├── package/     # Package repository
│   │       │   └── index.ts # Package repository implementation
│   │       └── user/        # User repository
│   │           └── index.ts # User repository implementation
│   │
│   ├── store/               # Zustand store configurations
│   │   ├── auth.ts          # Authentication state
│   │   ├── credits.ts       # Credits state
│   │   └── ui/              # UI state management
│   │       └── modals.ts    # Modal state
│   │
│   ├── test/                # Test configuration and utilities
│   │   ├── e2e-setup.ts     # E2E test setup
│   │   ├── global-setup.ts  # Global test setup
│   │   ├── global-teardown.ts # Global test teardown
│   │   └── setup.ts         # Test setup
│   │
│   ├── types/               # TypeScript type definitions
│   │   ├── blog.type.ts     # Blog types
│   │   ├── chat.ts          # Chat types
│   │   ├── file-upload.ts   # File upload types
│   │   ├── file.ts          # File types
│   │   └── user.ts          # User types
│   │
│   ├── validations/         # Form validation schemas
│   │   ├── admin.ts         # Admin validation
│   │   ├── files.ts         # File validation
│   │   └── persona.ts       # Persona validation
│   │
│   ├── data/                # Static data and constants
│   │   ├── config/          # Configuration data
│   │   │   └── plans.ts     # Subscription plans
│   │   ├── data.ts          # Static data
│   │   └── schema.ts        # Data schemas
│   │
│   ├── instrumentation-client.ts # Client instrumentation
│   ├── instrumentation.ts   # Server instrumentation
│   └── middleware.ts        # Next.js middleware
│
├── infra/                   # Infrastructure and deployment
│   ├── docker-compose.yml   # Docker Compose configuration
│   ├── Dockerfile           # Production Docker image
│   └── Dockerfile-local.dockerfile  # Local development Docker image
│
├── prisma/                  # Database schema and migrations
│   ├── migrations/          # Database migration files
│   │   ├── 20250903133736_add_initial_tables/ # Initial tables migration
│   │   ├── 20250909175907_add_password_to_users/ # Password migration
│   │   ├── 20250911082642_add_blog_management/ # Blog management migration
│   │   └── migration_lock.toml # Migration lock file
│   └── schema.prisma        # Database schema definition
│
├── public/                  # Static assets
│   ├── DatabaseLogo.tsx     # Database logo component
│   ├── favicon/             # Favicon files
│   │   ├── apple-touch-icon.png # Apple touch icon
│   │   ├── favicon-96x96.png # 96x96 favicon
│   │   ├── favicon.ico      # Standard favicon
│   │   ├── favicon.svg      # SVG favicon
│   │   ├── site.webmanifest # Web app manifest
│   │   ├── web-app-manifest-192x192.png # 192x192 manifest icon
│   │   └── web-app-manifest-512x512.png # 512x512 manifest icon
│   ├── logos/               # Application logos
│   │   ├── dark-full-logo.svg # Dark full logo
│   │   ├── dark-logo.svg    # Dark logo
│   │   ├── dark-symbol.png  # Dark symbol
│   │   ├── light-full-logo.svg # Light full logo
│   │   ├── light-logo.svg   # Light logo
│   │   └── light-symbol.png # Light symbol
│   └── screenshots/         # Application screenshots
│       ├── answers-with-citations.png # Answers with citations
│       ├── chat-interface.png # Chat interface
│       ├── file-management.png # File management
│       ├── persona-chat.jpg # Persona chat
│       ├── persona-management.png # Persona management
│       ├── search.png # Search interface
│       └── upload-file-to-knowledgebase.png # File upload
│
├── supabase/                # Supabase configurations
│   └── config.toml          # Supabase configuration
│
├── jest.config.js           # Jest configuration
├── jest.setup.js            # Jest setup
├── next-env.d.ts            # Next.js TypeScript definitions
├── next.config.mjs          # Next.js configuration
├── postcss.config.mjs       # PostCSS configuration
├── sentry.edge.config.ts    # Sentry edge configuration
├── sentry.server.config.ts  # Sentry server configuration
├── tailwind.config.ts       # Tailwind CSS configuration
├── task.md                  # Task documentation
├── tsconfig.json            # TypeScript configuration
└── tsconfig.tsbuildinfo     # TypeScript build info
```

### Component Architecture

The project follows Atomic Design principles for component organization:

- **Atom**: Basic building blocks (buttons, inputs, labels, cards, badges, etc.)

  - Located in `src/components/atom/`
  - Includes: Avatar, Badge, Button, Card, Checkbox, CreditDisplay, Divider, Input, Label, LoadingScreen, PillSelect, ProgressBar, ProgressCircle, RadioCard, SignInButton, Spinner, Switch, Textarea, Toast, Tooltip, UserProfilePicture

- **Molecules**: Combinations of atoms (form fields, search bars, modals, etc.)

  - Located in `src/components/molecules/`
  - Organized by feature: blogs, chat, common, editor, files, form
  - Includes: BlogCard, BlogGrid, PersonaCard, Calendar, CommandBar, CreditPurchaseModal, DatePicker, DeleteDialog, Dialog, Drawer, Dropdown, GoogleSignInButton, GradientCtaButton, Modal, PageHeader, Pagination, Popover, Searchbar, Select, Table, TabNavigation, UnifiedSearchBar, UserDetailsList, Editor, FileCard, FileDetailsModal, FileFilterModal, BlogFormFields, BlogImageUpload, FormTagInput, TagInput, SignInModal

- **Organisms**: Complex UI components (navigation, forms, tables, etc.)

  - Located in `src/components/organisms/`
  - **Modules**: Feature-specific organisms (admin, blogs, categories, files, personas, settings)
  - **Shared**: Shared organisms (data-table, navigation)
  - Includes: UsersPage, UsersTable, BlogsPage, CategoriesPage, CategoriesTable, FileGrid, FileUploader, PersonaModal, DataTable, Sidebar, MobileSidebar, DropdownUserProfile, UserProfile

- **Icons**: Reusable icon components

  - Located in `src/components/icons/`
  - Includes: AmazonWebServices, ArrowAnimated, Dropbox, GoogleDrive, JavaScript, Onedrive, Python, SharePoint, Slack, Swagger, Teams, Widget

- **Branding**: All components for landing page
  - Located in `src/components/branding/`
  - Includes: cta-section, DummySearchBox, feature-card, footer, grid-background, hero-pattern, hero-section, innovative-hero, interactive-demo, minimal-features, minimal-footer, modern-navigation, navigation, pricing-section, screenshot-showcase, security-section, use-cases, userProfile, value-proposition

## 🎯 Available Scripts

### Development

- `pnpm dev` - Start development server
- `pnpm build` - Build for production (includes sitemap verification)
- `pnpm start` - Start production server
- `pnpm build:only` - Build without verification

### Code Quality

- `pnpm lint` - Run ESLint
- `pnpm lint:fix` - Fix ESLint issues automatically
- `pnpm type-check` - Run TypeScript type checking
- `pnpm check` - Run both linting and type checking
- `pnpm format` - Format code with Prettier
- `pnpm format:check` - Check code formatting

### Database

- `pnpm migrate` - Run database migrations (development)
- `pnpm migrate:prod` - Run database migrations (production)
- `pnpm seed` - Seed the database
- `pnpm generate` - Generate Prisma client

### Testing

- `pnpm test` - Run Jest tests
- `pnpm test:watch` - Run tests in watch mode
- `pnpm test:coverage` - Run tests with coverage report

### SEO & Sitemap

- `pnpm verify-sitemap` - Verify sitemap generation
- `pnpm preview-sitemap` - Preview generated sitemap
- `pnpm preview-robots` - Preview generated robots.txt

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

This project is open source and available under the MIT License. See the LICENSE file for more details.

## 🙏 Acknowledgments

This boilerplate is built with amazing open-source technologies:

### Core Framework

- [Next.js](https://nextjs.org/) - React framework for production
- [React](https://reactjs.org/) - JavaScript library for building user interfaces
- [TypeScript](https://www.typescriptlang.org/) - Typed JavaScript

### Styling & UI

- [Tailwind CSS](https://tailwindcss.com/) - Utility-first CSS framework
- [Radix UI](https://www.radix-ui.com/) - Low-level UI primitives
- [Framer Motion](https://www.framer.com/motion/) - Animation library
- [Lucide React](https://lucide.dev/) - Beautiful icons

### Database & ORM

- [Prisma](https://www.prisma.io/) - Next-generation ORM
- [Supabase](https://supabase.com/) - Open source Firebase alternative

### Authentication & Payments

- [Google OAuth](https://developers.google.com/identity/protocols/oauth2) - Google authentication
- [Stripe](https://stripe.com/) - Payment processing

### AI & File Management

- [OpenAI](https://openai.com/) - AI platform
- [AWS S3](https://aws.amazon.com/s3/) - Object storage
- [TipTap](https://tiptap.dev/) - Rich text editor

### Development Tools

- [Jest](https://jestjs.io/) - Testing framework
- [ESLint](https://eslint.org/) - Code linting
- [Prettier](https://prettier.io/) - Code formatting
- [Docker](https://www.docker.com/) - Containerization

## 🔧 Environment Variables

The application requires several environment variables to function properly. All required variables are listed in the installation section above. Here are some additional details:

### Required Services

- **Database**: PostgreSQL database URL
- **Authentication**: Google OAuth credentials
- **AI Features**: OpenAI API key for AI functionality
- **File Storage**: AWS S3 credentials for file uploads
- **Payments**: Stripe credentials for payment processing

### Optional Services

- **Error Monitoring**: Sentry DSN for error tracking and monitoring

### Configuration Files

The project includes several important configuration files:

- `next.config.mjs` - Next.js configuration with Sentry integration
- `tailwind.config.ts` - Tailwind CSS configuration
- `postcss.config.mjs` - PostCSS configuration
- `jest.config.js` & `jest.setup.js` - Jest testing configuration
- `tsconfig.json` - TypeScript configuration
- `sentry.edge.config.ts` & `sentry.server.config.ts` - Sentry configuration
- `prisma/schema.prisma` - Database schema definition
- `supabase/config.toml` - Supabase configuration

Make sure to copy `.env.example` to `.env` and fill in all the required values before running the application.
