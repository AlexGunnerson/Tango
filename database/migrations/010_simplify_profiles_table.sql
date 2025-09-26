-- Remove unnecessary fields from profiles table for Tango app
-- We only need username and full_name for a gaming app

-- Drop the website and avatar_url columns
ALTER TABLE public.profiles DROP COLUMN IF EXISTS website;
ALTER TABLE public.profiles DROP COLUMN IF EXISTS avatar_url;

-- Update the trigger function to only insert full_name (remove avatar_url)
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO public.profiles (id, full_name)
  VALUES (new.id, new.raw_user_meta_data->>'full_name');
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
