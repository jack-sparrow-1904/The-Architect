import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { MessageSquareHeart, Users, Smile } from 'lucide-react';
import { SocialMission, Log, PrescriptiveSystemKey } from '@/types';
import { format } from 'date-fns';

interface SocialCardProps {
  currentDate: Date;
  onLogChange: (log: Omit<Log, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  initialLog?: Log | null;
  // We'll manage recently completed missions within the component or a higher-level state if needed for persistence across sessions beyond just today.
  // For MVP, we'll pick one based on date to ensure it changes daily but is consistent for the same day.
}

const MISSIONS: SocialMission[] = [
  { id: "sm01", description: "Ask a colleague an open-ended question about their weekend (and actively listen to the answer)." },
  { id: "sm02", description: "Give a genuine, specific compliment to someone. (e.g., 'That was a really clever solution in the meeting.')" },
  { id: "sm03", description: "At a store, make eye contact with the cashier and say 'Have a good day' with a smile." },
  { id: "sm04", description: "In a team meeting, rephrase someone else's point to show you understand it. (e.g., 'So if I'm hearing you right, you're saying...')" },
  { id: "sm05", description: "Share a small, positive observation with someone you don't usually talk to." },
  { id: "sm06", description: "Reach out to an old friend or acquaintance you haven't spoken to in a while with a simple 'Thinking of you!' message." },
  { id: "sm07", description: "Thank someone specifically for something they did that you appreciated, no matter how small." },
  { id: "sm08", description: "During a conversation, consciously try to maintain eye contact for a comfortable duration." },
  { id: "sm09", description: "Ask for a small, low-stakes piece of help or advice from someone." },
  { id: "sm10", description: "Offer help to someone without them asking, if you see an opportunity." },
  { id: "sm11", description: "Introduce yourself to someone new in a social or professional setting." },
  { id: "sm12", description: "Practice active listening: summarize what someone said before offering your own thoughts." },
  { id: "sm13", description: "Share a brief, appropriate personal anecdote related to a conversation topic." },
  { id: "sm14", description: "If you disagree with someone, express your differing opinion respectfully and calmly." },
  { id: "sm15", description: "End a conversation gracefully by summarizing a key point or suggesting a follow-up." },
];

const PRESCRIPTIVE_KEY: PrescriptiveSystemKey = 'SOCIAL';

const SocialCard: React.FC<SocialCardProps> = ({ currentDate, onLogChange, initialLog }) => {
  const [isCompleted, setIsCompleted] = useState(!!initialLog?.value_boolean);

  useEffect(() => {
    setIsCompleted(!!initialLog?.value_boolean);
  }, [initialLog]);

  const currentMission = useMemo(() => {
    // Use day of year to cycle through missions, ensuring it's consistent for the day
    // but changes daily.
    const dayOfYear = parseInt(format(currentDate, 'D')); // Day of year (1-366)
    return MISSIONS[dayOfYear % MISSIONS.length];
  }, [currentDate]);

  const handleCheckboxChange = async (checked: boolean) => {
    setIsCompleted(checked);
    await onLogChange({
      prescriptive_system_key: PRESCRIPTIVE_KEY,
      log_date: format(currentDate, 'yyyy-MM-dd'),
      value_boolean: checked,
      value_numeric: null,
    });
  };

  return (
    <Card className="bg-surface/70 border-border shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-xl font-semibold text-text">Today's Social Mission</CardTitle>
        <MessageSquareHeart className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <p className="text-sm text-textSecondary leading-relaxed min-h-[60px]">{currentMission.description}</p>
          <div className="flex items-center space-x-2 pt-4 border-t border-border/50">
            <Checkbox
              id="social-mission-completed"
              checked={isCompleted}
              onCheckedChange={(checked) => handleCheckboxChange(Boolean(checked))}
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <Label htmlFor="social-mission-completed" className="text-sm font-medium text-text">
              Mission Accomplished!
            </Label>
          </div>
        </div>
        <CardDescription className="text-xs text-textSecondary/70 pt-3 flex items-center">
          <Smile className="h-3 w-3 mr-1" />
          Small steps, big connections. Practice makes progress.
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default SocialCard;
