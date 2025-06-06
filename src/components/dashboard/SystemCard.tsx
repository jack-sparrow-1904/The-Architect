import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Settings2, CheckCircle, ListChecks } from 'lucide-react';
import { System, Log } from '@/types';
import { format } from 'date-fns';

interface SystemCardProps {
  system: System;
  currentDate: Date;
  onLogChange: (log: Omit<Log, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  initialLog?: Log | null;
}

const SystemCard: React.FC<SystemCardProps> = ({ system, currentDate, onLogChange, initialLog }) => {
  const [isCompleted, setIsCompleted] = useState(initialLog?.value_boolean ?? false);
  const [numericValue, setNumericValue] = useState<string>(initialLog?.value_numeric?.toString() || '');

  useEffect(() => {
    setIsCompleted(initialLog?.value_boolean ?? false);
    setNumericValue(initialLog?.value_numeric?.toString() || '');
  }, [initialLog]);

  const handleBinaryChange = async (checked: boolean) => {
    setIsCompleted(checked);
    await onLogChange({
      system_id: system.id,
      log_date: format(currentDate, 'yyyy-MM-dd'),
      value_boolean: checked,
      value_numeric: null,
    });
  };

  const handleNumericLog = async () => {
    const value = parseInt(numericValue);
    if (isNaN(value)) {
      alert("Please enter a valid number.");
      return;
    }
    await onLogChange({
      system_id: system.id,
      log_date: format(currentDate, 'yyyy-MM-dd'),
      value_numeric: value,
      value_boolean: value > 0, // Or some other logic if needed
    });
  };

  return (
    <Card className="bg-surface/70 border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold text-text">{system.name}</CardTitle>
        {system.tracker_type === 'BINARY' ? (
          <CheckCircle className="h-6 w-6 text-primary" />
        ) : (
          <ListChecks className="h-6 w-6 text-primary" />
        )}
      </CardHeader>
      <CardContent>
        {system.tracker_type === 'BINARY' ? (
          <div className="flex items-center space-x-2">
            <Checkbox
              id={`system-${system.id}`}
              checked={isCompleted}
              onCheckedChange={(checked) => handleBinaryChange(Boolean(checked))}
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <Label htmlFor={`system-${system.id}`} className="text-sm font-medium text-text">
              Mark as completed
            </Label>
          </div>
        ) : (
          <div className="space-y-2">
            <Label htmlFor={`system-numeric-${system.id}`} className="text-sm text-textSecondary">
              Enter value:
            </Label>
            <div className="flex items-center space-x-2">
              <Input
                id={`system-numeric-${system.id}`}
                type="number"
                value={numericValue}
                onChange={(e) => setNumericValue(e.target.value)}
                placeholder="e.g., 10"
                className="bg-background/50 border-border focus:ring-primary"
              />
              <Button onClick={handleNumericLog} className="bg-primary hover:bg-primary/90 text-primary-foreground">
                Log
              </Button>
            </div>
          </div>
        )}
        <CardDescription className="text-xs text-textSecondary/70 pt-3 flex items-center">
          <Settings2 className="h-3 w-3 mr-1" />
          Custom system. Track your progress your way.
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default SystemCard;
