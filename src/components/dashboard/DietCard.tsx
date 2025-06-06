import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { UtensilsCrossed, Salad, CheckSquare } from 'lucide-react';
import { DietMeal, Log, PrescriptiveSystemKey } from '@/types';
import { format } from 'date-fns';

interface DietCardProps {
  currentDate: Date;
  onLogChange: (log: Omit<Log, 'id' | 'user_id' | 'created_at'>) => Promise<void>;
  initialLog?: Log | null;
}

const MEALS: DietMeal[] = [
  { name: "Chicken, Rice & Broccoli", imageUrl: "https://images.pexels.com/photos/106343/pexels-photo-106343.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", ingredients: ["Chicken Breast", "Brown Rice", "Frozen Broccoli", "Soy Sauce"] },
  { name: "Lentil Soup", imageUrl: "https://images.pexels.com/photos/5848299/pexels-photo-5848299.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", ingredients: ["Red Lentils", "Vegetable Broth", "Carrots", "Celery", "Onion", "Spices"] },
  { name: "Oatmeal with Berries & Nuts", imageUrl: "https://images.pexels.com/photos/162101/pexels-photo-162101.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", ingredients: ["Rolled Oats", "Mixed Berries", "Almonds", "Chia Seeds", "Milk/Water"] },
  { name: "Scrambled Eggs & Spinach", imageUrl: "https://images.pexels.com/photos/10352180/pexels-photo-10352180.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", ingredients: ["Eggs", "Fresh Spinach", "Whole Wheat Toast (optional)", "Salt & Pepper"] },
  { name: "Tuna Salad Sandwich (Whole Wheat)", imageUrl: "https://images.pexels.com/photos/1400172/pexels-photo-1400172.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", ingredients: ["Canned Tuna", "Greek Yogurt/Mayo", "Celery", "Whole Wheat Bread", "Lettuce"] },
  { name: "Black Bean Burgers", imageUrl: "https://images.pexels.com/photos/1556698/pexels-photo-1556698.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", ingredients: ["Canned Black Beans", "Breadcrumbs", "Onion", "Spices", "Whole Wheat Buns"] },
  { name: "Quinoa Salad with Veggies", imageUrl: "https://images.pexels.com/photos/1152237/pexels-photo-1152237.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1", ingredients: ["Quinoa", "Cucumber", "Tomatoes", "Bell Peppers", "Lemon Vinaigrette"] },
];

const PRESCRIPTIVE_KEY: PrescriptiveSystemKey = 'DIET';

const DietCard: React.FC<DietCardProps> = ({ currentDate, onLogChange, initialLog }) => {
  const [isCompleted, setIsCompleted] = useState(!!initialLog?.value_boolean);
  const mealIndex = currentDate.getDate() % MEALS.length; // Simple way to cycle through meals daily
  const currentMeal = MEALS[mealIndex];

  useEffect(() => {
    setIsCompleted(!!initialLog?.value_boolean);
  }, [initialLog]);

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
        <CardTitle className="text-xl font-semibold text-text">Simple Meal Idea</CardTitle>
        <UtensilsCrossed className="h-6 w-6 text-primary" />
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          <img src={currentMeal.imageUrl} alt={currentMeal.name} className="w-full h-40 object-cover rounded-md mb-3" />
          <h4 className="text-lg font-medium text-text">{currentMeal.name}</h4>
          <div>
            <p className="text-sm font-medium text-textSecondary mb-1">Ingredients:</p>
            <ul className="list-disc list-inside text-xs text-textSecondary space-y-0.5">
              {currentMeal.ingredients.map((ing, idx) => <li key={idx}>{ing}</li>)}
            </ul>
          </div>
          <div className="flex items-center space-x-2 pt-4 border-t border-border/50">
            <Checkbox
              id="diet-completed"
              checked={isCompleted}
              onCheckedChange={(checked) => handleCheckboxChange(Boolean(checked))}
              className="data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground"
            />
            <Label htmlFor="diet-completed" className="text-sm font-medium text-text">
              I cooked a healthy meal today
            </Label>
          </div>
        </div>
        <CardDescription className="text-xs text-textSecondary/70 pt-3 flex items-center">
          <Salad className="h-3 w-3 mr-1" />
          Fuel your body right. Simple can be powerful.
        </CardDescription>
      </CardContent>
    </Card>
  );
};

export default DietCard;
