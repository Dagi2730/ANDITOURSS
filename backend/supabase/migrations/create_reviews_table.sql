-- ============================================================
-- Andi Tours — Public Reviews Table (run in Supabase SQL Editor)
-- ============================================================

CREATE TABLE IF NOT EXISTS public.reviews (
  id          UUID          DEFAULT gen_random_uuid() PRIMARY KEY,
  tour_name   TEXT          NOT NULL,
  user_name   TEXT          NOT NULL,
  user_country TEXT         DEFAULT '',
  rating      INTEGER       NOT NULL CHECK (rating >= 1 AND rating <= 5),
  comment     TEXT          NOT NULL,
  travel_date DATE,
  is_approved BOOLEAN       DEFAULT false,
  created_at  TIMESTAMPTZ   DEFAULT now()
);

-- Enable Row-Level Security
ALTER TABLE public.reviews ENABLE ROW LEVEL SECURITY;

-- Anyone can read approved reviews (public feed)
CREATE POLICY "Anyone can read approved reviews"
  ON public.reviews
  FOR SELECT
  USING (is_approved = true);

-- Anyone can insert a new review (moderation queue)
CREATE POLICY "Anyone can insert reviews"
  ON public.reviews
  FOR INSERT
  WITH CHECK (true);

-- Service-role key (backend) bypasses RLS, so admin endpoints work automatically.
-- If you need an admin UI policy via the Supabase dashboard, add:
-- CREATE POLICY "Admins can do everything"
--   ON public.reviews
--   FOR ALL
--   USING (auth.role() = 'service_role');
