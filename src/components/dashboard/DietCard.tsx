import React, { useState, useEffect, useMemo } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Salad, Shuffle, CheckCircle2, ChefHat } from 'lucide-react';
import { DietMeal, Log, PrescriptiveSystemKey } from '@/types';
import { format, getDayOfYear } from 'date-fns';
import { cn } from '@/lib/utils';

interface DietCardProps {
  currentDate: Date;
  onLogChange: (log: Omit<Log, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  initialLog?: Log | null;
}

const MEALS: DietMeal[] = [
  {
    name: "Grilled Chicken Salad",
    imageUrl: "https://images.unsplash.com/photo-1551248429-4097c942a565?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Chicken Breast", "Romaine Lettuce", "Cherry Tomatoes", "Cucumber", "Vinaigrette"],
  },
  {
    name: "Salmon & Asparagus",
    imageUrl: "https://images.unsplash.com/photo-1519708227418-c8fd9a32b7a2?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Salmon Fillet", "Asparagus", "Lemon", "Olive Oil", "Garlic"],
  },
  {
    name: "Quinoa Power Bowl",
    imageUrl: "https://images.unsplash.com/photo-1512058564366-185109023959?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Quinoa", "Black Beans", "Corn", "Avocado", "Lime"],
  },
  {
    name: "Hearty Lentil Soup",
    imageUrl: "https://images.unsplash.com/photo-1623059509422-63521725789d?q=80&w=800&auto=format&fit=crop",
    ingredients: ["Brown Lentils", "Carrots", "Celery", "Onion", "Vegetable Broth"],
  },
];

const PRESCRIPTIVE_KEY: PrescriptiveSystemKey = 'DIET';

const DietCard: React.FC<DietCardProps> = ({ currentDate, onLogChange, initialLog }) => {
  const [isCompleted, setIsCompleted] = useState(!!initialLog?.value_boolean);

  // Stable meal suggestion for the day, but allows for shuffling
  const dailyMealIndex = useMemo(() => getDayOfYear(currentDate) % MEALS.length, [currentDate]);
  const [currentMealIndex, setCurrentMealIndex] = useState(dailyMealIndex);

  useEffect(() => {
    setCurrentMealIndex(getDayOfYear(currentDate) % MEALS.length);
  }, [currentDate]);

  const currentMeal = MEALS[currentMealIndex];

  useEffect(() => {
    setIsCompleted(!!initialLog?.value_boolean);
  }, [initialLog]);

  const handleCheckChange = (checked: boolean) => {
    setIsCompleted(checked);
    onLogChange({
      prescriptive_system_key: PRESCRIPTIVE_KEY,
      log_date: format(currentDate, 'yyyy-MM-dd'),
      value_boolean: checked,
      value_numeric: null,
    });
  };

  const shuffleMeal = () => {
    let newIndex;
    do {
      newIndex = Math.floor(Math.random() * MEALS.length);
    } while (newIndex === currentMealIndex);
    setCurrentMealIndex(newIndex);
  };

  return (
    <Card className={cn(
      "bg-surface/70 border-border shadow-lg hover:shadow-xl transition-all duration-300 flex flex-col",
      isCompleted && "border-green-500 shadow-green-500/20"
    )}>
      <CardHeader className="flex flex-row items-start justify-between space-y-0 pb-2">
        <div>
          <CardTitle className="text-xl font-semibold text-text">Healthy Meal</CardTitle>
          <CardDescription className="text-xs text-muted-foreground">A suggestion for your main meal.</CardDescription>
        </div>
        <Salad className="h-6 w-6 text-green-500" />
      </CardHeader>
      <CardContent className="flex-grow flex flex-col justify-between">
        <div className="flex-grow">
          <div className="relative mb-4">
            <img src={currentMeal.imageUrl} alt={currentMeal.name} className="w-full h-40 object-cover rounded-lg shadow-md" />
            <div className="absolute bottom-0 left-0 w-full h-1/2 bg-gradient-to-t from-black/80 to-transparent rounded-b-lg p-3 flex items-end">
              <h3 className="text-lg font-bold text-white">{currentMeal.name}</h3>
            </div>
          </div>
          <div className="flex justify-between items-center mb-4">
            <h4 className="text-sm font-semibold text-text">Ingredients:</h4>
            <Button variant="ghost" size="sm" onClick={shuffleMeal} className="text-muted-foreground hover:text-primary">
              <Shuffle className="h-4 w-4 mr-2" />
              Shuffle
            </Button>
          </div>
          <ul className="space-y-1 text-sm text-textSecondary list-disc list-inside">
            {currentMeal.ingredients.map((item, i) => <li key={i}>{item}</li>)}
          </ul>
        </div>

        <div className="pt-4 mt-4 border-t border-border/50">
          <div className="flex items-center space-x-3 p-3 rounded-lg bg-muted/50">
            <Checkbox
              id="diet-check"
              checked={isCompleted}
              onCheckedChange={(checked) => handleCheckChange(Boolean(checked))}
              className="data-[state=checked]:bg-green-500 data-[state=checked]:text-primary-foreground"
            />
            <Label 
              htmlFor="diet-check" 
              className={cn(
                "text-base font-medium transition-colors w-full",
                isCompleted ? "text-green-500" : "text-text"
              )}
            >
              {isCompleted ? (
                <div className="flex items-center">
                  <CheckCircle2 className="h-5 w-5 mr-2"/>
                  <span>Meal Logged! Well done.</span>
                </div>
              ) : (
                 <div className="flex items-center">
                  <ChefHat className="h-5 w-5 mr-2"/>
                  <span>I cooked a healthy meal.</span>
                </div>
              )}
            </Label>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DietCard;
