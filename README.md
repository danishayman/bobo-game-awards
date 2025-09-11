# Gaming Awards - Community Voting Platform

A polished community gaming awards voting web app built with Next.js 14, Supabase, and TailwindCSS. Users can vote for their favorite games across multiple categories, with a clean wizard-style voting flow and real-time results.

## Features

### 🎮 User Experience
- **Authentication**: Google and Twitch OAuth integration
- **Voting Wizard**: Step-by-step category voting with progress tracking
- **Ballot Management**: Draft votes with final submission
- **Real-time Results**: Live vote counting and winner displays
- **Mobile-Friendly**: Responsive design for all devices

### 🔐 Security & Access Control
- **Row Level Security**: Supabase RLS policies for data protection
- **Role-Based Access**: Admin vs. regular user permissions
- **Vote Integrity**: One vote per category per user
- **Ballot Finalization**: Prevents vote changes after submission

### 👨‍💼 Admin Features
- **Category Management**: Create, edit, and organize award categories
- **Nominee Management**: Add and manage game nominees
- **Voting Controls**: Set voting start/end times
- **Live Analytics**: Real-time voting results and statistics

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 19, TypeScript
- **Styling**: TailwindCSS, shadcn/ui components
- **Backend**: Supabase (PostgreSQL + Auth + Real-time)
- **Authentication**: Supabase Auth with OAuth providers
- **Database**: PostgreSQL with Row Level Security

## Getting Started

### Prerequisites

- Node.js 18+ and npm
- Supabase account and project
- Google OAuth app (optional)
- Twitch OAuth app (optional)

### 1. Clone and Install

```bash
git clone <your-repo-url>
cd bobo-game-awards
npm install
```

### 2. Set up Supabase

1. Create a new Supabase project at [supabase.com](https://supabase.com)
2. Go to Project Settings > API to get your keys
3. Run the database migrations:

```sql
-- Copy and paste the contents of:
-- supabase/migrations/001_initial_schema.sql
-- supabase/migrations/002_rls_policies.sql  
-- supabase/migrations/003_functions.sql
```

### 3. Configure Environment Variables

Create a `.env.local` file:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OAuth Providers (configure in Supabase Auth settings)
GOOGLE_CLIENT_ID=your_google_client_id
GOOGLE_CLIENT_SECRET=your_google_client_secret
TWITCH_CLIENT_ID=your_twitch_client_id
TWITCH_CLIENT_SECRET=your_twitch_client_secret
```

### 4. Set up Authentication Providers

In your Supabase dashboard:

1. Go to Authentication > Providers
2. Enable Google and/or Twitch
3. Add your OAuth app credentials
4. Set redirect URL to: `https://your-domain.com/auth/callback`

### 5. Create Your First Admin User

After signing up through the app:

```sql
-- In Supabase SQL Editor, make yourself an admin:
UPDATE public.users 
SET is_admin = true 
WHERE id = 'your-user-id';
```

### 6. Run the Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see your app!

## Database Schema

The app uses 5 main tables:

- **`users`**: User profiles linked to Supabase auth
- **`categories`**: Award categories (Game of the Year, etc.)
- **`nominees`**: Games nominated in each category
- **`votes`**: Individual user votes (one per category per user)
- **`ballots`**: Tracks user voting completion and finalization

## Key Features Walkthrough

### Voting Flow
1. User signs in with Google/Twitch
2. Browses categories on home page
3. Enters voting wizard (`/vote/category/[slug]`)
4. Votes are saved as drafts automatically
5. User can review and finalize ballot
6. After finalization, votes are locked

### Admin Workflow
1. Admin creates categories with slugs
2. Adds nominees to each category
3. Sets voting start/end times (optional)
4. Monitors results in real-time
5. Results become public after voting ends

### Results Display
- Live vote counts and percentages
- Winner highlighting with crown icons
- Category-by-category breakdown
- Public access only after voting ends (unless admin)

## API Routes

- `GET /api/categories` - List all categories
- `GET /api/categories/[slug]` - Get category with nominees
- `POST /api/votes` - Cast or update a vote
- `POST /api/ballot/finalize` - Finalize user's ballot
- `GET /api/results` - Get voting results (with access control)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Connect your repo to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy!

### Other Platforms

The app works on any platform that supports Next.js:
- Netlify
- Railway  
- DigitalOcean App Platform
- AWS Amplify

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

## License

MIT License - see LICENSE file for details

## Support

For issues and questions:
1. Check the GitHub issues
2. Create a new issue with details
3. Include error messages and steps to reproduce

---

Built with ❤️ for the gaming community