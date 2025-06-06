import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { BookOpen, Flame, TrendingUp } from 'lucide-react';
import { Log, PrescriptiveSystemKey } from '@/types';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/contexts/AuthContext';
import { format, subDays, isSameDay, parseISO } from 'date-fns';

interface ReadingCardProps {
  currentDate: Date;
  onLogChange: (log: Omit<Log, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  initialLog?: Log | null;
}

const PRESCRIPTIVE_KEY: PrescriptiveSystemKey = 'READING';

const ReadingCard: React.FC<ReadingCardProps> = ({ currentDate, onLogChange, initialLog }) => {
  const { user } = useAuth();
  const [pagesRead, setPagesRead] = useState<string>(initialLog?.value_numeric?.toString() || '');
  const [streak, setStreak] = useState(0);
  const [isLoggedToday, setIsLoggedToday] = useState(!!initialLog);

  useEffect(() => {
    setPagesRead(initialLog?.value_numeric?.toString() || '');
    setIsLoggedToday(!!initialLog);
  }, [initialLog]);

  const calculateStreak = useCallback(async () => {
    if (!user) return;

    const { data, error } = await supabase
      .from('logs')
      .select('log_date')
      .eq('user_id', user.id)
      .eq('prescriptive_system_key', PRESCRIPTIVE_KEY)
      .or('value_numeric.gt.0,value_boolean.is.true') // Assuming reading log means pages > 0
      .order('log_date', { ascending: false });

    if (error) {
      console.error('Error fetching reading logs for streak:', error);
      return;
    }

    if (!data || data.length === 0) {
      setStreak(0);
      return;
    }

    let currentStreak = 0;
    let expectedDate = currentDate;

    // Check if today is logged
    const todayLogged = data.some(log => isSameDay(parseISO(log.log_date), currentDate) && (initialLog?.value_numeric || parseInt(pagesRead) > 0));
    if (todayLogged) {
        currentStreak = 1;
        expectedDate = subDays(currentDate, 1);
    } else {
        // If not logged today, check if yesterday was logged to start streak from there
        const yesterdayLogged = data.some(log => isSameDay(parseISO(log.log_date), subDays(currentDate,1)));
        if (yesterdayLogged) {
            currentStreak = 0; // Streak will be calculated from yesterday
            expectedDate = subDays(currentDate, 1);
        } else {
            setStreak(0); // No log today or yesterday
            return;
        }
    }


    for (const log of data) {
      const logDate = parseISO(log.log_date);
      if (isSameDay(logDate, expectedDate)) {
        if(!todayLogged && isSameDay(logDate, subDays(currentDate,1))) currentStreak++; // only increment if it's not today's initial check
        else if (todayLogged && !isSameDay(logDate, currentDate)) currentStreak++;

        expectedDate = subDays(expectedDate, 1);
      } else if (logDate < expectedDate) {
        // Gap in logs, streak broken
        break;
      }
    }
    setStreak(currentStreak);
  }, [user, currentDate, initialLog, pagesRead]);


  useEffect(() => {
    calculateStreak();
  }, [calculateStreak, isLoggedToday]);

  const handleLogPages = async () => {
    const numPages = parseInt(pagesRead);
    if (isNaN(numPages) || numPages < 0) {
      // Handle error: invalid input
      alert("Please enter a valid number of pages.");
      return;
    }
    await onLogChange({
      prescriptive_system_key: PRESCRIPTIVE_KEY,
      log_date: format(currentDate, 'yyyy-MM-dd'),
      value_numeric: numPages,
      value_boolean: numPages > 0,
    });
    setIsLoggedToday(true); // Assume log is successful
    await calculateStreak(); // Recalculate streak after logging
  };

  return (
    <Card className="bg-surface/70 border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold text-text">Daily Reading</CardTitle>
        <BookOpen className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div>
            <Label htmlFor="pages-read" className="text-sm text-textSecondary">How many pages did you read today?</Label>
            <div className="flex items-center space-x-2 mt-1">
              <Input
                id="pages-read"
                type="number"
                value={pagesRead}
                onChange={(e) => setPagesRead(e.target.value)}
                placeholder="e.g., 25"
                className="bg-background/50 border-border focus:ring-primary"
                min="0"
              />
              <Button onClick={handleLogPages} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Log
              </Button>
            </div>
          </div>
          {isLoggedToday && <p className="text-xs text-success">Pages logged for today!</p>}
          <div className="flex items-center justify-between pt-4 border-t border-border/50">
            <div className="flex items-center text-textSecondary">
              <Flame className="h-5 w-5 mr-1 text-accent" />
              <span className="text-sm font-medium">Streak:</span>
              <span className="text-lg font-bold ml-1 text-text">{streak}</span>
              <span className="text-sm ml-1">days</span>
            </div>
          </div>
        </div>
        <CardDescription className="text-xs text-textSecondary/70 pt-3 flex items-center">
          <TrendingUp className="h-3 w-3 mr-1" />
          Expand your mind, one page at a time.
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default ReadingCard;
