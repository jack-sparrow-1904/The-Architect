export interface System {
  id: string;
  user_id: string;
  name: string;
  tracker_type: 'BINARY' | 'NUMERIC';
  created_at: string;
}

export interface Log {
  id?: string;
  system_id?: string | null; // Nullable for prescriptive systems
  user_id: string;
  log_date: string; // YYYY-MM-DD
  value_numeric?: number | null;
  value_boolean?: boolean | null;
  prescriptive_system_key?: string | null; // e.g., 'WORKOUT', 'READING'
  created_at?: string;
}

export type PrescriptiveSystemKey = 'WORKOUT' | 'READING' | 'DIET' | 'SOCIAL';

export interface Workout {
  name: string;
  exercises: { name: string; sets: string; reps: string }[];
}

export interface DietMeal {
  name: string;
  imageUrl: string;
  ingredients: string[];
}

export interface SocialMission {
  id: string;
  description: string;
}

// For daily logs, combining prescriptive and custom
export interface DailyLog extends Log {
  // For custom systems
  system_name?: string; 
  tracker_type?: 'BINARY' | 'NUMERIC';
}
