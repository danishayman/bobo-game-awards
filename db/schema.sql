-- Community Gaming Awards Database Schema

-- Users table
CREATE TABLE users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  email TEXT UNIQUE NOT NULL,
  provider TEXT NOT NULL CHECK (provider IN ('google', 'twitch')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT UNIQUE NOT NULL,
  description TEXT NOT NULL
);

-- Nominees table
CREATE TABLE nominees (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  image_url TEXT NOT NULL
);

-- Votes table
CREATE TABLE votes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  category_id UUID NOT NULL REFERENCES categories(id) ON DELETE CASCADE,
  nominee_id UUID NOT NULL REFERENCES nominees(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  
  -- Ensure one vote per user per category
  UNIQUE(user_id, category_id)
);

-- Voting settings table
CREATE TABLE voting_settings (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  voting_open BOOLEAN DEFAULT true,
  voting_end_date TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default voting settings
INSERT INTO voting_settings (voting_open, voting_end_date) 
VALUES (true, NOW() + INTERVAL '30 days');

-- Indexes for better performance
CREATE INDEX idx_votes_user_category ON votes(user_id, category_id);
CREATE INDEX idx_votes_category ON votes(category_id);
CREATE INDEX idx_nominees_category ON nominees(category_id);

-- Row Level Security (RLS) policies
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE nominees ENABLE ROW LEVEL SECURITY;
ALTER TABLE votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE voting_settings ENABLE ROW LEVEL SECURITY;

-- Users can read their own data
CREATE POLICY "Users can read own data" ON users FOR SELECT USING (auth.uid()::text = id);

-- Everyone can read categories and nominees
CREATE POLICY "Anyone can read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Anyone can read nominees" ON nominees FOR SELECT USING (true);

-- Users can insert their own votes
CREATE POLICY "Users can insert own votes" ON votes FOR INSERT WITH CHECK (auth.uid()::text = user_id);

-- Users can read all votes (for results)
CREATE POLICY "Anyone can read votes" ON votes FOR SELECT USING (true);

-- Everyone can read voting settings
CREATE POLICY "Anyone can read voting settings" ON voting_settings FOR SELECT USING (true);

-- Only authenticated users can access most tables (additional security)
CREATE POLICY "Authenticated users only" ON users FOR ALL USING (auth.role() = 'authenticated');
CREATE POLICY "Authenticated users only" ON votes FOR ALL USING (auth.role() = 'authenticated');



