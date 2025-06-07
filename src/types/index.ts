export interface System {
  id: string;
  user_id: string;
  name: string;
  tracker_type: 'BINARY' | 'NUMERIC';
  created_at: string;
}

export interface Log {
  id: string;
  system_id: string | null;
  user_id: string;
  log_date: string;
  value_numeric: number | null;
  value_boolean: boolean | null;
  prescriptive_system_key: string | null;
  created_at: string;
}

export type Vision = {
  id: string;
  user_id: string;
  higher_self: string | null;
  core_values: string[];
  long_term_goals: Goal[];
  created_at: string;
  updated_at: string;
};

export type Goal = {
  id: string;
  title: string;
  description: string;
};

export type WeeklyReview = {
  id: string;
  user_id: string;
  week_start_date: string; // ISO date string
  wins: string[];
  challenges: string[];
  learnings: string[];
  next_week_focus: string | null;
  rating: number | null;
  created_at: string;
  updated_at: string;
};

export type ActionItem = {
  id: string;
  user_id: string;
  weekly_review_id: string | null;
  description: string;
  status: 'pending' | 'in_progress' | 'completed';
  due_date: string | null; // ISO date string
  created_at: string;
  updated_at: string;
};
