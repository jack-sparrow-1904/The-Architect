/*
  # Initial Schema Setup for The Architect MVP

  This migration sets up the initial tables required for The Architect MVP,
  including `systems` for user-defined tracking systems and `logs` for
  recording daily progress.

  1. New Tables
     - `systems`
       - `id` (uuid, primary key): Unique identifier for the system.
       - `user_id` (uuid, foreign key): References `auth.users.id`, linking the system to a user.
       - `name` (text, not null): The name of the system (e.g., "Daily Meditation").
       - `tracker_type` (text, not null): Type of tracker ('BINARY' or 'NUMERIC').
       - `created_at` (timestamptz, default now()): Timestamp of creation.
     - `logs`
       - `id` (uuid, primary key): Unique identifier for the log entry.
       - `system_id` (uuid, foreign key): References `systems.id`, linking the log to a specific system.
       - `user_id` (uuid, foreign key): References `auth.users.id`, linking the log to a user.
       - `log_date` (date, not null): The date for which the log entry is made.
       - `value_numeric` (integer, nullable): Numeric value for 'NUMERIC' trackers.
       - `value_boolean` (boolean, nullable): Boolean value for 'BINARY' trackers.
       - `created_at` (timestamptz, default now()): Timestamp of creation.
       - `prescriptive_system_key` (text, nullable): Identifier for hardcoded systems (e.g., 'WORKOUT', 'READING').

  2. Indexes
     - On `systems(user_id)` for efficient querying of user-specific systems.
     - On `logs(user_id, log_date)` for efficient querying of daily logs per user.
     - On `logs(system_id)` for efficient querying of logs for a specific system.
     - On `logs(user_id, prescriptive_system_key, log_date)` for prescriptive systems.

  3. Security
     - Enable Row Level Security (RLS) on both `systems` and `logs` tables.
     - Policies for `systems`:
       - Users can perform CRUD operations on their own systems.
     - Policies for `logs`:
       - Users can perform CRUD operations on their own logs.

  4. Constraints
     - Unique constraint on `logs(user_id, system_id, log_date)` to prevent duplicate logs for the same system on the same day.
     - Unique constraint on `logs(user_id, prescriptive_system_key, log_date)` for prescriptive systems.
     - Check constraint on `systems(tracker_type)` to ensure it's either 'BINARY' or 'NUMERIC'.
*/

-- Create systems table
CREATE TABLE IF NOT EXISTS systems (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  name TEXT NOT NULL,
  tracker_type TEXT NOT NULL CHECK (tracker_type IN ('BINARY', 'NUMERIC')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- Create logs table
CREATE TABLE IF NOT EXISTS logs (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  system_id uuid REFERENCES systems(id) ON DELETE CASCADE, -- Nullable for prescriptive systems
  user_id uuid REFERENCES auth.users(id) ON DELETE CASCADE NOT NULL,
  log_date DATE NOT NULL,
  value_numeric INTEGER,
  value_boolean BOOLEAN,
  prescriptive_system_key TEXT, -- For hardcoded systems like 'WORKOUT', 'READING', 'DIET', 'SOCIAL'
  created_at TIMESTAMPTZ DEFAULT now(),
  CONSTRAINT unique_user_system_date UNIQUE (user_id, system_id, log_date),
  CONSTRAINT unique_user_prescriptive_date UNIQUE (user_id, prescriptive_system_key, log_date)
);

-- Add indexes
CREATE INDEX IF NOT EXISTS idx_systems_user_id ON systems(user_id);
CREATE INDEX IF NOT EXISTS idx_logs_user_id_log_date ON logs(user_id, log_date);
CREATE INDEX IF NOT EXISTS idx_logs_system_id ON logs(system_id);
CREATE INDEX IF NOT EXISTS idx_logs_user_prescriptive_date ON logs(user_id, prescriptive_system_key, log_date);


-- Enable RLS for systems table
ALTER TABLE systems ENABLE ROW LEVEL SECURITY;

-- Policies for systems table
CREATE POLICY "Users can view their own systems"
  ON systems
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own systems"
  ON systems
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own systems"
  ON systems
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own systems"
  ON systems
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);


-- Enable RLS for logs table
ALTER TABLE logs ENABLE ROW LEVEL SECURITY;

-- Policies for logs table
CREATE POLICY "Users can view their own logs"
  ON logs
  FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own logs"
  ON logs
  FOR INSERT
  TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own logs"
  ON logs
  FOR UPDATE
  TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own logs"
  ON logs
  FOR DELETE
  TO authenticated
  USING (auth.uid() = user_id);