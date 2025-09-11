# Supabase Auth Providers Setup Guide

This guide will help you configure all the authentication providers for your Gaming Awards application.

## Overview

Your application now supports 4 authentication providers:
- **Google** - Wide user base, reliable
- **Twitch** - Perfect for gaming community
- **Discord** - Popular among gamers
- **GitHub** - Great for developers and tech-savvy users

## Prerequisites

1. A Supabase project set up
2. Your app deployed or running locally
3. Admin access to create OAuth applications

## Environment Variables

Make sure you have these in your `.env.local`:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Provider Configuration

### 1. Google OAuth Setup

1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select existing one
3. Enable Google+ API
4. Go to "Credentials" → "Create Credentials" → "OAuth 2.0 Client ID"
5. Set application type to "Web application"
6. Add authorized redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)

**In Supabase Dashboard:**
1. Go to Authentication → Providers
2. Enable Google provider
3. Add your Google Client ID and Client Secret
4. Set redirect URL: `https://your-domain.com/auth/callback`

### 2. Twitch OAuth Setup

1. Go to [Twitch Developers](https://dev.twitch.tv/console)
2. Register your application
3. Set OAuth Redirect URLs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
4. Set Category to "Website Integration"

**In Supabase Dashboard:**
1. Go to Authentication → Providers
2. Enable Twitch provider
3. Add your Twitch Client ID and Client Secret
4. Set redirect URL: `https://your-domain.com/auth/callback`

### 3. Discord OAuth Setup

1. Go to [Discord Developer Portal](https://discord.com/developers/applications)
2. Create a new application
3. Go to OAuth2 section
4. Add redirect URIs:
   - `https://your-project-ref.supabase.co/auth/v1/callback`
   - `http://localhost:3000/auth/callback` (for development)
5. Note your Client ID and Client Secret

**In Supabase Dashboard:**
1. Go to Authentication → Providers
2. Enable Discord provider
3. Add your Discord Client ID and Client Secret
4. Set redirect URL: `https://your-domain.com/auth/callback`

### 4. GitHub OAuth Setup

1. Go to GitHub Settings → Developer settings → OAuth Apps
2. Click "New OAuth App"
3. Fill in application details:
   - Homepage URL: `https://your-domain.com`
   - Authorization callback URL: `https://your-project-ref.supabase.co/auth/v1/callback`
4. For development, create another app with callback: `http://localhost:3000/auth/callback`

**In Supabase Dashboard:**
1. Go to Authentication → Providers
2. Enable GitHub provider
3. Add your GitHub Client ID and Client Secret
4. Set redirect URL: `https://your-domain.com/auth/callback`

## Database Setup

Ensure your users table exists and matches the type definitions:

```sql
-- This should already exist from your migrations
CREATE TABLE IF NOT EXISTS users (
    id UUID PRIMARY KEY REFERENCES auth.users(id),
    email TEXT,
    name TEXT,
    avatar_url TEXT,
    provider TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" ON users
    FOR SELECT USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" ON users
    FOR UPDATE USING (auth.uid() = id);
```

## Testing the Setup

1. Start your development server: `npm run dev`
2. Navigate to `/login`
3. Try each authentication provider
4. Check that users are created in your Supabase users table
5. Verify the auth callback works correctly

## Troubleshooting

### Common Issues:

1. **"Invalid redirect URI"**
   - Check that your redirect URIs match exactly in both the provider and Supabase
   - Ensure you're using the correct Supabase project reference

2. **"Provider not enabled"**
   - Verify the provider is enabled in Supabase Dashboard
   - Check that Client ID and Secret are correctly set

3. **"Auth code error"**
   - Users will be redirected to `/auth/auth-code-error` page
   - Check browser network tab for specific error details
   - Verify your environment variables are set correctly

4. **CORS Issues**
   - Add your domain to Supabase allowed origins
   - Check Site URL in Supabase Auth settings

### Development vs Production

- Use different OAuth apps for development and production
- Update redirect URIs when deploying
- Ensure environment variables are set in production

## Security Best Practices

1. **Never expose Client Secrets** in client-side code
2. **Use HTTPS** in production for all redirect URIs
3. **Regularly rotate** OAuth credentials
4. **Monitor** authentication logs in Supabase
5. **Implement rate limiting** for auth endpoints if needed

## Additional Features

Your auth setup includes:
- ✅ Multiple provider support
- ✅ Automatic user creation
- ✅ Error handling with custom error page
- ✅ Loading states for better UX
- ✅ Responsive design with gaming-focused UI
- ✅ Session management with middleware
- ✅ Type-safe auth context

## Next Steps

1. Configure your chosen providers in Supabase Dashboard
2. Test each provider thoroughly
3. Deploy your application
4. Monitor authentication metrics
5. Consider adding additional providers like Steam (if available) for gaming community

## Support

If you encounter issues:
1. Check Supabase logs in Dashboard
2. Review provider-specific documentation
3. Test with different browsers/devices
4. Check network connectivity and firewall settings

