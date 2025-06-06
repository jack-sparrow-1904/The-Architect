import React, { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PlusCircle } from 'lucide-react';
import { System } from '@/types';

interface NewSystemModalProps {
  onAddSystem: (system: Omit<System, 'id' | 'user_id' | 'created_at'>) => Promise<System | null>;
}

const NewSystemModal: React.FC<NewSystemModalProps> = ({ onAddSystem }) => {
  const [open, setOpen] = useState(false);
  const [systemName, setSystemName] = useState('');
  const [trackerType, setTrackerType] = useState<'BINARY' | 'NUMERIC'>('BINARY');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!systemName.trim()) {
      alert("System name cannot be empty.");
      return;
    }
    setLoading(true);
    const newSystem = await onAddSystem({ name: systemName, tracker_type: trackerType });
    if (newSystem) {
      setSystemName('');
      setTrackerType('BINARY');
      setOpen(false);
    }
    setLoading(false);
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="bg-accent hover:bg-accent/90 text-accent-foreground fixed bottom-8 right-8 rounded-full p-4 shadow-lg z-40">
          <PlusCircle className="h-6 w-6 mr-2" /> Add New System
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] bg-card border-border text-foreground">
        <DialogHeader>
          <DialogTitle className="text-2xl">Add New System</DialogTitle>
          <DialogDescription className="text-muted-foreground">
            Create a custom system to track your unique goals and habits.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="name" className="text-right text-muted-foreground">
              System Name
            </Label>
            <Input
              id="name"
              value={systemName}
              onChange={(e) => setSystemName(e.target.value)}
              className="col-span-3 bg-background/50 border-input focus:ring-ring"
              placeholder="e.g., Daily Meditation"
            />
          </div>
          <div className="grid grid-cols-4 items-center gap-4">
            <Label htmlFor="trackerType" className="text-right text-muted-foreground">
              Tracking Type
            </Label>
            <Select value={trackerType} onValueChange={(value: 'BINARY' | 'NUMERIC') => setTrackerType(value)}>
              <SelectTrigger className="col-span-3 bg-background/50 border-input focus:ring-ring">
                <SelectValue placeholder="Select tracking type" />
              </SelectTrigger>
              <SelectContent className="bg-popover border-border text-popover-foreground">
                <SelectItem value="BINARY" className="focus:bg-primary/20">Binary (Yes/No)</SelectItem>
                <SelectItem value="NUMERIC" className="focus:bg-primary/20">Numeric (e.g., Count, Time)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)} className="border-border hover:bg-muted/50 text-muted-foreground">Cancel</Button>
          <Button type="submit" onClick={handleSubmit} disabled={loading} className="bg-primary hover:bg-primary/90 text-primary-foreground">
            {loading ? 'Adding...' : 'Add System'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default NewSystemModal;
