/*
      # Create Weekly Review &amp; Action Items Tables

      This migration introduces the `weekly_reviews` and `action_items` tables,
      which are essential for the weekly feedback and planning loop.

      1. New Tables
         - `weekly_reviews`
           - `id` (uuid, primary key): Unique identifier for the review.
           - `user_id` (uuid, foreign key): Links to the user.
           - `week_start_date` (date): The start date of the week being reviewed.
           - `wins` (jsonb): An array of strings detailing the week's successes.
           - `challenges` (jsonb): An array of strings for the week's obstacles.
           - `learnings` (jsonb): An array of strings for key insights.
           - `next_week_focus` (text): A summary of the main goal for the upcoming week.
           - `rating` (integer): A user's rating of their week, from 1 to 5.
           - `created_at` (timestamptz): Timestamp of creation.
           - `updated_at` (timestamptz): Timestamp of the last update.
         - `action_items`
           - `id` (uuid, primary key): Unique identifier for the action item.
           - `user_id` (uuid, foreign key): Links to the user.
           - `weekly_review_id` (uuid, foreign key, nullable): Links to the weekly review it originated from.
           - `description` (text): The task to be done.
           - `status` (text): The current status ('pending', 'in_progress', 'completed').
           - `due_date` (date, nullable): The target completion date.
           - `created_at` (timestamptz): Timestamp of creation.
           - `updated_at` (timestamptz): Timestamp of the last update.

      2. Functions &amp; Triggers
         - The `handle_updated_at` trigger is applied to both new tables to manage the `updated_at` column.

      3. Security
         - RLS is enabled on both tables.
         - Policies are added to ensure users can only perform CRUD operations on their own records.
    */

    -- Create weekly_reviews table
    CREATE TABLE IF NOT EXISTS weekly_reviews (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      week_start_date DATE NOT NULL,
      wins JSONB DEFAULT '[]'::jsonb,
      challenges JSONB DEFAULT '[]'::jsonb,
      learnings JSONB DEFAULT '[]'::jsonb,
      next_week_focus TEXT,
      rating INTEGER CHECK (rating >= 1 AND rating <= 5),
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now(),
      CONSTRAINT unique_user_week_review UNIQUE (user_id, week_start_date)
    );

    -- Create action_items table
    CREATE TABLE IF NOT EXISTS action_items (
      id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
      user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
      weekly_review_id uuid REFERENCES weekly_reviews(id) ON DELETE SET NULL,
      description TEXT NOT NULL,
      status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed')),
      due_date DATE,
      created_at TIMESTAMPTZ DEFAULT now(),
      updated_at TIMESTAMPTZ DEFAULT now()
    );

    -- Add indexes
    CREATE INDEX IF NOT EXISTS idx_weekly_reviews_user_id ON weekly_reviews(user_id);
    CREATE INDEX IF NOT EXISTS idx_action_items_user_id ON action_items(user_id);
    CREATE INDEX IF NOT EXISTS idx_action_items_status ON action_items(status);

    -- Apply the update trigger to weekly_reviews
    CREATE TRIGGER on_weekly_reviews_update
    BEFORE UPDATE ON weekly_reviews
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

    -- Apply the update trigger to action_items
    CREATE TRIGGER on_action_items_update
    BEFORE UPDATE ON action_items
    FOR EACH ROW
    EXECUTE PROCEDURE handle_updated_at();

    -- Enable RLS for weekly_reviews table
    ALTER TABLE weekly_reviews ENABLE ROW LEVEL SECURITY;

    -- Policies for weekly_reviews table
    CREATE POLICY "Users can manage their own weekly reviews"
      ON weekly_reviews
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);

    -- Enable RLS for action_items table
    ALTER TABLE action_items ENABLE ROW LEVEL SECURITY;

    -- Policies for action_items table
    CREATE POLICY "Users can manage their own action items"
      ON action_items
      FOR ALL
      TO authenticated
      USING (auth.uid() = user_id)
      WITH CHECK (auth.uid() = user_id);
