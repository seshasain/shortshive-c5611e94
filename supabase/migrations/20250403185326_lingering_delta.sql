/*
  # Create profiles table and related tables

  1. New Tables
    - `profiles`
      - `id` (uuid, primary key, references auth.users)
      - `username` (text, unique)
      - `full_name` (text)
      - `avatar_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `animations`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `description` (text)
      - `status` (text)
      - `duration` (integer)
      - `thumbnail_url` (text)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)
    
    - `stories`
      - `id` (uuid, primary key)
      - `user_id` (uuid, references profiles)
      - `title` (text)
      - `content` (text)
      - `settings` (jsonb)
      - `created_at` (timestamp)
      - `updated_at` (timestamp)

  2. Security
    - Enable RLS on all tables
    - Add policies for authenticated users
*/

-- Create profiles table
CREATE TABLE IF NOT EXISTS profiles (
  id uuid PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  username text UNIQUE,
  full_name text,
  avatar_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create animations table
CREATE TABLE IF NOT EXISTS animations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  description text,
  status text NOT NULL DEFAULT 'draft',
  duration integer,
  thumbnail_url text,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES profiles ON DELETE CASCADE NOT NULL,
  title text NOT NULL,
  content text,
  settings jsonb DEFAULT '{}'::jsonb,
  created_at timestamptz DEFAULT now(),
  updated_at timestamptz DEFAULT now()
);

-- Enable RLS
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE animations ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;

-- Create policies
CREATE POLICY "Users can view own profile" 
  ON profiles FOR SELECT 
  TO authenticated 
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile" 
  ON profiles FOR UPDATE 
  TO authenticated 
  USING (auth.uid() = id);

-- Animations policies
CREATE POLICY "Users can view own animations" 
  ON animations FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own animations" 
  ON animations FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own animations" 
  ON animations FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own animations" 
  ON animations FOR DELETE 
  TO authenticated 
  USING (user_id = auth.uid());

-- Stories policies
CREATE POLICY "Users can view own stories" 
  ON stories FOR SELECT 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can insert own stories" 
  ON stories FOR INSERT 
  TO authenticated 
  WITH CHECK (user_id = auth.uid());

CREATE POLICY "Users can update own stories" 
  ON stories FOR UPDATE 
  TO authenticated 
  USING (user_id = auth.uid());

CREATE POLICY "Users can delete own stories" 
  ON stories FOR DELETE 
  TO authenticated 
  USING (user_id = auth.uid());

-- Create function to handle updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers for updated_at
CREATE TRIGGER update_profiles_updated_at
  BEFORE UPDATE ON profiles
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_animations_updated_at
  BEFORE UPDATE ON animations
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stories_updated_at
  BEFORE UPDATE ON stories
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();