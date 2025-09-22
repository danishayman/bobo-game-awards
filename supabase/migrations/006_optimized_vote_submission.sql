-- Optimized PostgreSQL function for vote submission
-- This combines all validation and submission steps into a single database call

CREATE OR REPLACE FUNCTION submit_vote_optimized(
  user_id_param UUID,
  category_id_param UUID,
  nominee_id_param UUID,
  user_display_name TEXT DEFAULT 'Anonymous',
  user_avatar_url TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  vote_result RECORD;
  category_info RECORD;
  nominee_info RECORD;
  ballot_info RECORD;
  result JSON;
BEGIN
  -- First, ensure user exists (upsert)
  INSERT INTO users (id, display_name, avatar_url)
  VALUES (user_id_param, user_display_name, user_avatar_url)
  ON CONFLICT (id) DO UPDATE SET
    display_name = COALESCE(EXCLUDED.display_name, users.display_name),
    avatar_url = COALESCE(EXCLUDED.avatar_url, users.avatar_url),
    updated_at = NOW();

  -- Check if ballot is already finalized
  SELECT is_final INTO ballot_info
  FROM ballots 
  WHERE user_id = user_id_param;
  
  IF ballot_info.is_final = true THEN
    RAISE EXCEPTION 'BALLOT_FINALIZED: Ballot is already finalized';
  END IF;

  -- Validate nominee and category in one query
  SELECT 
    n.id as nominee_id,
    n.category_id,
    c.is_active,
    c.voting_start,
    c.voting_end
  INTO nominee_info
  FROM nominees n
  INNER JOIN categories c ON n.category_id = c.id
  WHERE n.id = nominee_id_param 
    AND n.category_id = category_id_param;

  IF NOT FOUND THEN
    RAISE EXCEPTION 'INVALID_NOMINEE: Nominee does not exist or does not belong to category';
  END IF;

  -- Check if category is active
  IF nominee_info.is_active = false THEN
    RAISE EXCEPTION 'CATEGORY_INACTIVE: Voting is not active for this category';
  END IF;

  -- Check voting timing
  IF nominee_info.voting_start IS NOT NULL AND nominee_info.voting_start > NOW() THEN
    RAISE EXCEPTION 'VOTING_NOT_STARTED: Voting has not started yet';
  END IF;

  IF nominee_info.voting_end IS NOT NULL AND nominee_info.voting_end < NOW() THEN
    RAISE EXCEPTION 'VOTING_ENDED: Voting has ended for this category';
  END IF;

  -- Submit the vote (upsert)
  INSERT INTO votes (user_id, category_id, nominee_id, is_final)
  VALUES (user_id_param, category_id_param, nominee_id_param, false)
  ON CONFLICT (user_id, category_id) 
  DO UPDATE SET
    nominee_id = EXCLUDED.nominee_id,
    is_final = EXCLUDED.is_final,
    updated_at = NOW()
  RETURNING * INTO vote_result;

  -- Ensure ballot exists (upsert)
  INSERT INTO ballots (user_id, is_final)
  VALUES (user_id_param, false)
  ON CONFLICT (user_id) 
  DO UPDATE SET updated_at = NOW();

  -- Return the vote data
  SELECT json_build_object(
    'id', vote_result.id,
    'user_id', vote_result.user_id,
    'category_id', vote_result.category_id,
    'nominee_id', vote_result.nominee_id,
    'is_final', vote_result.is_final,
    'created_at', vote_result.created_at,
    'updated_at', vote_result.updated_at
  ) INTO result;

  RETURN result;
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION submit_vote_optimized(UUID, UUID, UUID, TEXT, TEXT) TO authenticated;

-- Create additional index for the combined validation query
CREATE INDEX IF NOT EXISTS idx_nominees_validation 
ON nominees(id, category_id) INCLUDE (category_id);

-- Update table statistics for better query planning
ANALYZE votes;
ANALYZE ballots;
ANALYZE users;
