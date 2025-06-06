import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Dumbbell, Coffee, CalendarCheck2, CheckCircle2 } from 'lucide-react';
import { Workout, Log, PrescriptiveSystemKey } from '@/types';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Progress } from '@/components/ui/progress';

interface WorkoutCardProps {
  currentDate: Date;
  onLogChange: (log: Omit<Log, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  initialLog?: Log | null;
}

const WORKOUT_A: Workout = {
  name: "Strength Focus",
  exercises: [
    { name: "Squats", sets: "3", reps: "5-8" },
    { name: "Bench Press", sets: "3", reps: "5-8" },
    { name: "Barbell Row", sets: "3", reps: "5-8" },
  ],
};

const WORKOUT_B: Workout = {
  name: "Power &amp; Core",
  exercises: [
    { name: "Squats", sets: "3", reps: "5-8" },
    { name: "Overhead Press", sets: "3", reps: "5-8" },
    { name: "Deadlifts", sets: "1", reps: "5" },
  ],
};

const PRESCRIPTIVE_KEY: PrescriptiveSystemKey = 'WORKOUT';

const WorkoutCard: React.FC<WorkoutCardProps> = ({ currentDate, onLogChange, initialLog }) => {
  const dayOfWeek = currentDate.getDay(); // Sunday = 0, Monday = 1, ..., Saturday = 6

  const getWorkoutForDay = (): Workout | null => {
    if (dayOfWeek === 1 || dayOfWeek === 5) return WORKOUT_A; // Monday, Friday
    if (dayOfWeek === 3) return WORKOUT_B; // Wednesday
    return null; // Other days are rest days
  };

  const currentWorkout = getWorkoutForDay();
  const [checkedExercises, setCheckedExercises] = useState<Set<string>>(new Set());

  const isCompleted = currentWorkout ? checkedExercises.size === currentWorkout.exercises.length : false;
  const progress = currentWorkout ? (checkedExercises.size / currentWorkout.exercises.length) * 100 : 0;

  useEffect(() => {
    // Initialize state based on the log from the database
    if (initialLog?.value_boolean && currentWorkout) {
      setCheckedExercises(new Set(currentWorkout.exercises.map(ex => ex.name)));
    } else {
      setCheckedExercises(new Set());
    }
  }, [initialLog, currentWorkout]);

  useEffect(() => {
    // This effect triggers the database update when the completion status changes.
    const wasInitiallyCompleted = !!initialLog?.value_boolean;
    if (isCompleted !== wasInitiallyCompleted) {
      onLogChange({
        prescriptive_system_key: PRESCRIPTIVE_KEY,
        log_date: format(currentDate, 'yyyy-MM-dd'),
        value_boolean: isCompleted,
        value_numeric: null,
      });
    }
  }, [isCompleted, initialLog, onLogChange, currentDate]);

  const handleExerciseCheckChange = (exerciseName: string, checked: boolean) => {
    setCheckedExercises(prev => {
      const newSet = new Set(prev);
      if (checked) {
        newSet.add(exerciseName);
      } else {
        newSet.delete(exerciseName);
      }
      return newSet;
    });
  };

  return (
    <Card className={cn(
      "bg-surface/70 border-border shadow-lg hover:shadow-xl transition-all duration-300",
      isCompleted && "border-primary shadow-primary/20"
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-semibold text-text">
            {currentWorkout ? `Workout: ${currentWorkout.name}` : "Rest Day"}
          </CardTitle>
          <CardDescription className="text-xs text-muted-foreground">
            {currentWorkout ? "Check off exercises as you complete them." : "Active recovery or full rest."}
          </CardDescription>
        </div>
        {currentWorkout ? <Dumbbell className="h-6 w-6 text-primary" /> : <Coffee className="h-6 w-6 text-secondary" />}
      </CardHeader>
      <CardContent>
        {currentWorkout ? (
          <div className="space-y-4">
            <ul className="space-y-3 text-sm text-textSecondary">
              {currentWorkout.exercises.map((ex, index) => (
                <li key={index} className="flex items-center space-x-3">
                  <Checkbox
                    id={`ex-${index}`}
                    checked={checkedExercises.has(ex.name)}
                    onCheckedChange={(checked) => handleExerciseCheckChange(ex.name, Boolean(checked))}
                    className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
                  />
                  <Label 
                    htmlFor={`ex-${index}`} 
                    className={cn(
                      "flex justify-between w-full transition-colors",
                      checkedExercises.has(ex.name) && "text-muted-foreground line-through"
                    )}
                  >
                    <span>{ex.name}</span>
                    <span className="font-medium text-text">{ex.sets} x {ex.reps}</span>
                  </Label>
                </li>
              ))}
            </ul>
            <div className="pt-4 border-t border-border/50">
              {isCompleted ? (
                 <div className="flex items-center text-primary font-medium">
                   <CheckCircle2 className="h-5 w-5 mr-2"/>
                   <span>Completed! Great work.</span>
                 </div>
              ) : (
                <div>
                  <div className="flex justify-between items-center mb-1">
                    <Label className="text-xs text-muted-foreground">Progress</Label>
                    <span className="text-xs font-semibold text-primary">{checkedExercises.size} / {currentWorkout.exercises.length}</span>
                  </div>
                  <Progress value={progress} className="h-2 [&>*]:bg-primary" />
                </div>
              )}
            </div>
          </div>
        ) : (
          <p className="text-sm text-textSecondary">
            Enjoy your rest! Go for a walk, stretch, or just relax.
          </p>
        )}
      </CardContent>
    </Card>
  );
};

export default WorkoutCard;
