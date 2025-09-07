# Community Gaming Awards

A polished voting website built with Next.js, TailwindCSS, NextAuth, and Supabase for community-driven gaming awards.

## 🌟 Features

### 🔐 Authentication
- **NextAuth.js** with Google and Twitch OAuth providers
- User session management with JWT strategy
- Automatic user creation in Supabase database

### 🗄️ Database (Supabase)
- **PostgreSQL** with Row Level Security (RLS)
- Complete schema with users, categories, nominees, votes, and settings
- Proper foreign key relationships and constraints
- One vote per user per category enforcement

### 📄 Pages
- **Landing Page** (`/`) - Beautiful hero section with auth integration
- **Voting Dashboard** (`/vote`) - Interactive voting interface with progress tracking
- **Results Page** (`/results`) - Animated charts showing voting results
- **Admin Panel** (`/admin`) - Complete management interface for categories and nominees

### 🎨 UI/UX
- **TailwindCSS** with custom design system
- **shadcn/ui** components for consistent styling
- **Framer Motion** animations throughout
- **Dark mode** support with next-themes
- **Fully responsive** design (mobile-first approach)

### ✨ Extra Polish
- **Countdown Timer** until voting closes
- **Confetti Animation** when voting is completed
- **Social Sharing** capabilities
- **OpenGraph** images for better social media presence
- **Real-time Progress** tracking
- **Loading States** and error handling

## 🚀 Tech Stack

- **Frontend**: Next.js 15 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Animations**: Framer Motion
- **Authentication**: NextAuth.js
- **Database**: Supabase (PostgreSQL)
- **State Management**: React hooks
- **Form Handling**: Native React forms
- **Icons**: Lucide React

## 🛠️ Complete Setup Guide

### Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- A Supabase account
- Google Developer Console access (for Google OAuth)
- Twitch Developer Console access (for Twitch OAuth)

### Step 1: Clone and Install

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd bobo-game-awards
   ```

2. **Install dependencies**
   ```bash
   npm install
   # or
   yarn install
   ```

### Step 2: Set up Supabase Database

1. **Create a new Supabase project**
   - Go to [supabase.com](https://supabase.com)
   - Click "New Project"
   - Choose your organization and create the project
   - Wait for the project to be ready

2. **Set up the database schema**
   - Go to the SQL Editor in your Supabase dashboard
   - Copy the entire contents of `db/schema.sql`
   - Paste and run the SQL script
   - This will create all tables, RLS policies, and indexes

3. **Configure Authentication**
   - Go to Authentication > Settings in Supabase
   - Under "Auth Providers", enable Google and Twitch
   - We'll configure the OAuth credentials later

4. **Get your Supabase credentials**
   - Go to Settings > API in your Supabase dashboard
   - Copy the Project URL and anon public key
   - Save these for the environment variables

### Step 3: Set up Google OAuth

1. **Go to Google Cloud Console**
   - Visit [console.cloud.google.com](https://console.cloud.google.com)
   - Create a new project or select existing one

2. **Enable Google+ API**
   - Go to APIs & Services > Library
   - Search for "Google+ API" and enable it

3. **Create OAuth credentials**
   - Go to APIs & Services > Credentials
   - Click "Create Credentials" > "OAuth client ID"
   - Choose "Web application"
   - Add authorized redirect URIs:
     - `http://localhost:3000/api/auth/callback/google` (for development)
     - `https://yourdomain.com/api/auth/callback/google` (for production)
   - Save the Client ID and Client Secret

4. **Configure in Supabase**
   - Go back to Supabase Authentication > Settings
   - Under Google provider, add your Client ID and Secret
   - Save the configuration

### Step 4: Set up Twitch OAuth

1. **Go to Twitch Developers Console**
   - Visit [dev.twitch.tv](https://dev.twitch.tv)
   - Log in with your Twitch account

2. **Create a new application**
   - Click "Register Your Application"
   - Fill in the application details
   - Add OAuth Redirect URLs:
     - `http://localhost:3000/api/auth/callback/twitch` (for development)
     - `https://yourdomain.com/api/auth/callback/twitch` (for production)
   - Save and get your Client ID and Secret

3. **Configure in Supabase**
   - Go to Supabase Authentication > Settings
   - Under Twitch provider, add your Client ID and Secret
   - Save the configuration

### Step 5: Environment Variables

1. **Create environment file**
   ```bash
   cp .env.example .env.local
   ```

2. **Fill in your credentials**
   ```env
   # NextAuth Configuration
   NEXTAUTH_URL=http://localhost:3000
   NEXTAUTH_SECRET=your-super-secret-key-here-use-openssl-rand-base64-32
   
   # Google OAuth (from Google Cloud Console)
   GOOGLE_CLIENT_ID=your-google-client-id
   GOOGLE_CLIENT_SECRET=your-google-client-secret
   
   # Twitch OAuth (from Twitch Developer Console)
   TWITCH_CLIENT_ID=your-twitch-client-id
   TWITCH_CLIENT_SECRET=your-twitch-client-secret
   
   # Supabase Configuration (from Supabase Dashboard)
   NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
   ```

3. **Generate NextAuth Secret**
   ```bash
   openssl rand -base64 32
   ```
   Use the output as your `NEXTAUTH_SECRET`

### Step 6: Configure Admin Access

1. **Update admin check**
   Open `app/admin/page.tsx` and update line 29:
   ```typescript
   const isAdmin = session?.user?.email === 'your-admin-email@example.com'
   ```
   Replace with your actual admin email address.

### Step 7: Run the Application

1. **Start the development server**
   ```bash
   npm run dev
   # or
   yarn dev
   ```

2. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

3. **Test the setup**
   - Try signing in with Google or Twitch
   - Check that user data appears in Supabase
   - Access the admin panel with your admin email

### Step 8: Initial Data Setup (Optional)

To get started quickly, you can add some sample data:

1. **Sign in as admin** and go to `/admin`
2. **Create categories** like:
   - "Game of the Year"
   - "Best Indie Game" 
   - "Best Multiplayer Game"
   - "Best Art Direction"

3. **Add nominees** for each category with:
   - Game titles
   - Descriptions
   - Image URLs (use game cover art or screenshots)

4. **Configure voting settings**:
   - Set voting to "Open"
   - Set an end date for voting
   - Save settings

### Troubleshooting

#### Common Issues

**OAuth Errors:**
- Make sure redirect URIs exactly match in OAuth provider settings
- Check that environment variables are correctly set
- Verify that OAuth providers are enabled in Supabase

**Database Errors:**
- Ensure RLS policies are properly set up
- Check that all tables were created from the schema
- Verify Supabase URL and anon key are correct

**Build Errors:**
- Clear `.next` folder and rebuild: `rm -rf .next && npm run build`
- Check all environment variables are set
- Ensure Node.js version is 18+

**Admin Access Issues:**
- Verify your email exactly matches the admin check
- Make sure you're signed in with the correct account
- Check browser console for any authentication errors

#### Getting Help

If you encounter issues:
1. Check the browser console for error messages
2. Review Supabase logs in the dashboard
3. Verify all environment variables are set correctly
4. Ensure OAuth providers are properly configured

## 📁 Project Structure

```
bobo-game-awards/
├── app/                    # Next.js App Router pages
│   ├── admin/             # Admin panel
│   ├── results/           # Results page
│   ├── vote/              # Voting page
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Landing page
├── components/
│   ├── admin/             # Admin-specific components
│   ├── results/           # Results components
│   ├── voting/            # Voting components
│   ├── shared/            # Shared components
│   └── ui/                # Base UI components
├── lib/
│   ├── auth.ts            # NextAuth configuration
│   ├── supabase.ts        # Supabase client
│   ├── db-queries.ts      # Database query functions
│   ├── admin-queries.ts   # Admin-specific queries
│   └── utils.ts           # Utility functions
└── db/
    └── schema.sql         # Database schema
```

## 🎯 Usage

### For Voters
1. **Sign in** with Google or Twitch
2. **Browse categories** and nominees
3. **Cast votes** for your favorite games
4. **Track progress** across all categories
5. **View results** when voting closes

### For Administrators
1. **Access admin panel** at `/admin`
2. **Manage categories** - create, edit, delete
3. **Manage nominees** - add games with images and descriptions
4. **Control voting** - open/close voting and set end dates
5. **Monitor statistics** - view vote counts and user engagement

## 🔧 Configuration

### Admin Access
By default, admin access is restricted. Update the admin check in `app/admin/page.tsx`:

```typescript
const isAdmin = session?.user?.email === 'your-admin@email.com'
```

### Voting Settings
- Control voting periods through the admin panel
- Set automatic closing dates
- Toggle voting on/off manually

### Customization
- Modify the color scheme in `app/globals.css`
- Update branding in the navigation component
- Customize animations in component files

## 📱 Mobile Responsiveness

The application is built with a mobile-first approach:
- **Responsive navigation** with mobile-optimized layout
- **Touch-friendly** voting interface
- **Adaptive grids** that work across all screen sizes
- **Optimized typography** for readability on all devices

## 🚀 Deployment

The application is ready for deployment on platforms like:
- **Vercel** (recommended for Next.js)
- **Netlify**
- **Railway**
- **Any Node.js hosting platform**

### Environment Setup
Ensure all environment variables are configured in your deployment platform.

### Database Setup
Make sure your Supabase database is properly configured with:
- RLS policies enabled
- Proper authentication settings
- Database schema applied

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🙏 Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [shadcn/ui](https://ui.shadcn.com/)
- Database powered by [Supabase](https://supabase.com/)
- Authentication via [NextAuth.js](https://next-auth.js.org/)
- Icons from [Lucide](https://lucide.dev/)