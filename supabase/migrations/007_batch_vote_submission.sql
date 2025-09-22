-- Optimized PostgreSQL function for batch vote submission
-- This processes multiple votes in a single transaction

CREATE OR REPLACE FUNCTION submit_batch_votes_optimized(
  user_id_param UUID,
  votes_param JSON,
  user_display_name TEXT DEFAULT 'Anonymous',
  user_avatar_url TEXT DEFAULT NULL
)
RETURNS JSON
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
  vote_item JSON;
  category_id_val UUID;
  nominee_id_val UUID;
  vote_result RECORD;
  results JSON[] := '{}';
  ballot_info RECORD;
  valid_votes JSON[] := '{}';
  error_message TEXT;
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

  -- Parse and validate all votes first
  FOR vote_item IN SELECT * FROM json_array_elements(votes_param)
  LOOP
    -- Extract vote data
    category_id_val := (vote_item->>'category_id')::UUID;
    nominee_id_val := (vote_item->>'nominee_id')::UUID;
    
    -- Validate nominee and category in one query
    PERFORM 1
    FROM nominees n
    INNER JOIN categories c ON n.category_id = c.id
    WHERE n.id = nominee_id_val 
      AND n.category_id = category_id_val
      AND c.is_active = true
      AND (c.voting_start IS NULL OR c.voting_start <= NOW())
      AND (c.voting_end IS NULL OR c.voting_end >= NOW());

    IF NOT FOUND THEN
      error_message := 'INVALID_VOTE: Invalid nominee ' || nominee_id_val::text || ' for category ' || category_id_val::text;
      RAISE EXCEPTION '%', error_message;
    END IF;
    
    -- Add to valid votes array
    valid_votes := valid_votes || vote_item;
  END LOOP;

  -- Process all valid votes in batch
  FOR vote_item IN SELECT * FROM unnest(valid_votes)
  LOOP
    category_id_val := (vote_item->>'category_id')::UUID;
    nominee_id_val := (vote_item->>'nominee_id')::UUID;
    
    -- Submit the vote (upsert)
    INSERT INTO votes (user_id, category_id, nominee_id, is_final)
    VALUES (user_id_param, category_id_val, nominee_id_val, false)
    ON CONFLICT (user_id, category_id) 
    DO UPDATE SET
      nominee_id = EXCLUDED.nominee_id,
      is_final = EXCLUDED.is_final,
      updated_at = NOW()
    RETURNING * INTO vote_result;

    -- Add result to array
    results := results || json_build_object(
      'id', vote_result.id,
      'user_id', vote_result.user_id,
      'category_id', vote_result.category_id,
      'nominee_id', vote_result.nominee_id,
      'is_final', vote_result.is_final,
      'created_at', vote_result.created_at,
      'updated_at', vote_result.updated_at
    );
  END LOOP;

  -- Ensure ballot exists (upsert)
  INSERT INTO ballots (user_id, is_final)
  VALUES (user_id_param, false)
  ON CONFLICT (user_id) 
  DO UPDATE SET updated_at = NOW();

  -- Return all results as JSON array
  RETURN array_to_json(results);
END;
$$;

-- Grant execute permission to authenticated users
GRANT EXECUTE ON FUNCTION submit_batch_votes_optimized(UUID, JSON, TEXT, TEXT) TO authenticated;

-- Create index for batch operations if not exists
CREATE INDEX IF NOT EXISTS idx_votes_batch_operations 
ON votes(user_id, updated_at DESC) INCLUDE (id, category_id, nominee_id, is_final);

-- Update table statistics
ANALYZE votes;
ANALYZE ballots;
