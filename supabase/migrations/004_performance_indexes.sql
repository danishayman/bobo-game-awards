-- Performance optimization indexes for voting queries
-- Run this in your Supabase SQL Editor

-- Composite index for votes by user and category (most common query pattern)
CREATE INDEX IF NOT EXISTS idx_votes_user_category_composite 
ON public.votes(user_id, category_id, nominee_id);

-- Index for category slug lookups with nominees (very common)
CREATE INDEX IF NOT EXISTS idx_categories_slug_active 
ON public.categories(slug, is_active) WHERE is_active = true;

-- Index for nominees by category (for category pages)
CREATE INDEX IF NOT EXISTS idx_nominees_category_display 
ON public.nominees(category_id, display_order, id);

-- Index for ballot lookups by user
CREATE INDEX IF NOT EXISTS idx_ballots_user_final 
ON public.ballots(user_id, is_final);

-- Index for auth user lookups (admin checks)
CREATE INDEX IF NOT EXISTS idx_users_admin 
ON public.users(id, is_admin) WHERE is_admin = true;

-- Optimize votes query with partial index for final votes only
CREATE INDEX IF NOT EXISTS idx_votes_final_category_nominee 
ON public.votes(category_id, nominee_id, user_id) WHERE is_final = true;

-- Add statistics gathering for better query planning
ANALYZE public.categories;
ANALYZE public.nominees;
ANALYZE public.votes;
ANALYZE public.ballots;
ANALYZE public.users;
