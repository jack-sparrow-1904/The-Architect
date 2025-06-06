import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dumbbell, Coffee, CalendarCheck2 } from 'lucide-react';
import { Workout, Log, PrescriptiveSystemKey } from '@/types';
import { format } from 'date-fns';

interface WorkoutCardProps {
  currentDate: Date;
  onLogChange: (log: Omit<Log, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  initialLog?: Log | null;
}

const WORKOUT_A: Workout = {
  name: "Workout A: Strength Focus",
  exercises: [
    { name: "Squats", sets: "3", reps: "5-8" },
    { name: "Bench Press", sets: "3", reps: "5-8" },
    { name: "Barbell Row", sets: "3", reps: "5-8" },
  ],
};

const WORKOUT_B: Workout = {
  name: "Workout B: Power & Core",
  exercises: [
    { name: "Squats", sets: "3", reps: "5-8" },
    { name: "Overhead Press", sets: "3", reps: "5-8" },
    { name: "Deadlifts", sets: "1", reps: "5" },
  ],
};

const PRESCRIPTIVE_KEY: PrescriptiveSystemKey = 'WORKOUT';

const WorkoutCard: React.FC<WorkoutCardProps> = ({ currentDate, onLogChange, initialLog }) => {
  const [isCompleted, setIsCompleted] = useState(!!initialLog?.value_boolean);
  const dayOfWeek = currentDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

  useEffect(() => {
    setIsCompleted(!!initialLog?.value_boolean);
  }, [initialLog]);

  const getWorkoutForDay = (): Workout | null => {
    if (dayOfWeek === 1 || dayOfWeek === 5) return WORKOUT_A; // Monday, Friday
    if (dayOfWeek === 3) return WORKOUT_B; // Wednesday
    return null; // Other days are rest days
  };

  const currentWorkout = getWorkoutForDay();

  const handleCheckboxChange = async (checked: boolean) => {
    setIsCompleted(checked);
    await onLogChange({
      prescriptive_system_key: PRESCRIPTIVE_KEY,
      log_date: format(currentDate, 'yyyy-MM-dd'),
      value_boolean: checked,
      value_numeric: null, // Not applicable for this binary tracker
    });
  };

  return (
    <Card className="bg-surface/70 border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold text-text">
          {currentWorkout ? `Today's Workout: ${currentWorkout.name}` : "Rest Day"}
        </CardTitle>
        {currentWorkout ? <Dumbbell className="h-6 w-6 text-primary" /> : <Coffee className="h-6 w-6 text-secondary" />}
      </CardHeader>
      <CardContent>
        {currentWorkout ? (
          <div className="space-y-4">
            <ul className="space-y-2 text-sm text-textSecondary">
              {currentWorkout.exercises.map((ex, index) => (
                <li key={index} className="flex justify-between">
                  <span>{ex.name}</span>
                  <span className="font-medium">{ex.sets} sets of {ex.reps} reps</span>
                </li>
              ))}
            </ul>
            <div className="flex items-center space-x-2 pt-4 border-t border-border/50">
              <Checkbox
                id="workout-completed"
                checked={isCompleted}
                onCheckedChange={(checked) => handleCheckboxChange(Boolean(checked))}
                className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
              />
              <Label htmlFor="workout-completed" className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70 text-text">
                I did it!
              </Label>
            </div>
          </div>
        ) : (
          <p className="text-sm text-textSecondary">
            Active recovery: go for a walk or do some light stretching. Enjoy your rest!
          </p>
        )}
        <CardDescription className="text-xs text-textSecondary/70 pt-3 flex items-center">
          <CalendarCheck2 className="h-3 w-3 mr-1" />
          Consistency is key. Keep showing up!
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;
