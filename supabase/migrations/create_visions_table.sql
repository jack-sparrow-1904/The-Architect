/*
  # Create Vision &amp; Goals Table

  This migration introduces the `visions` table to store the user's high-level
  strategic direction, including their vision, core values, and long-term goals.
  This table is designed to have a one-to-one relationship with the `users` table.

  1. New Tables
     - `visions`
       - `id` (uuid, primary key): Unique identifier for the vision record.
       - `user_id` (uuid, foreign key, unique): References `auth.users.id`, ensuring one vision record per user.
       - `higher_self` (text): A long-form description of the user's desired identity.
       - `core_values` (jsonb): An array of strings representing the user's core values.
       - `long_term_goals` (jsonb): An array of objects for long-term goals, each with a title and description.
       - `created_at` (timestamptz): Timestamp of creation.
       - `updated_at` (timestamptz): Timestamp of the last update.

  2. Functions &amp; Triggers
     - `moddatetime` trigger on `updated_at` to automatically update the timestamp on any row modification.

  3. Security
     - Enable Row Level Security (RLS) on the `visions` table.
     - Policies for `visions`:
       - Users can perform CRUD operations only on their own vision record.

*/

-- Create visions table
CREATE TABLE IF NOT EXISTS visions (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL UNIQUE,
  higher_self TEXT,
  core_values JSONB DEFAULT '[]'::jsonb,
  long_term_goals JSONB DEFAULT '[]'::jsonb,
  created_at TIMESTAMPTZ DEFAULT now(),
  updated_at TIMESTAMPTZ DEFAULT now()
);

-- Create extension for moddatetime function
CREATE EXTENSION IF NOT EXISTS moddatetime;

-- Function and Trigger to automatically update `updated_at`
CREATE OR REPLACE FUNCTION handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER on_visions_update
BEFORE UPDATE ON visions
FOR EACH ROW
EXECUTE PROCEDURE handle_updated_at();


-- Enable RLS for visions table
ALTER TABLE visions ENABLE ROW LEVEL SECURITY;

-- Policies for visions table
CREATE POLICY "Users can view their own vision"
  ON visions
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own vision"
  ON visions
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own vision"
  ON visions
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own vision"
  ON visions
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);
