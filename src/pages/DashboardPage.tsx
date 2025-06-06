import React, { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { LogOut, CalendarIcon, ChevronLeft, ChevronRight, Settings, UserCircle, DraftingCompass } from 'lucide-react';
import { format, addDays, subDays, startOfDay } from 'date-fns';
import { useDailyLogs } from '@/hooks/useDailyLogs';
import { Log, System } from '@/types';

import WorkoutCard from '@/components/dashboard/WorkoutCard';
import ReadingCard from '@/components/dashboard/ReadingCard';
import DietCard from '@/components/dashboard/DietCard';
import SocialCard from '@/components/dashboard/SocialCard';
import SystemCard from '@/components/dashboard/SystemCard';
import NewSystemModal from '@/components/dashboard/NewSystemModal';

const DashboardPage: React.FC = () => {
  const { user, signOut } = useAuth();
  const [currentDate, setCurrentDate] = useState<Date>(startOfDay(new Date()));
  const { logs, customSystems, loading, error, upsertLog, addSystem } = useDailyLogs(currentDate);

  const handleDateChange = (date?: Date) => {
    if (date) {
      setCurrentDate(startOfDay(date));
    }
  };

  const goToPreviousDay = () => {
    setCurrentDate(prev => startOfDay(subDays(prev, 1)));
  };

  const goToNextDay = () => {
    setCurrentDate(prev => startOfDay(addDays(prev, 1)));
  };
  
  const goToToday = () => {
    setCurrentDate(startOfDay(new Date()));
  };

  const handleLogChange = async (logEntry: Omit<Log, 'id' | 'user_id' | 'created_at'>) => {
    await upsertLog(logEntry);
  };

  const handleAddSystem = async (systemData: Omit<System, 'id' | 'user_id' | 'created_at'>) => {
    return await addSystem(systemData);
  };

  const getLogForSystem = (systemKeyOrId: string, isPrescriptive: boolean): Log | undefined => {
    if (isPrescriptive) {
      return logs.find(log => log.prescriptive_system_key === systemKeyOrId);
    }
    return logs.find(log => log.system_id === systemKeyOrId);
  };


  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface text-foreground p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-2">
          <DraftingCompass className="h-10 w-10 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">The Architect</h1>
        </div>
        <div className="flex items-center space-x-3">
           <span className="text-sm text-muted-foreground hidden md:inline">
            {user?.email}
          </span>
          <UserCircle className="h-7 w-7 text-muted-foreground md:hidden" />
          <Button variant="ghost" size="icon" onClick={signOut} className="text-muted-foreground hover:text-primary">
            <LogOut className="h-5 w-5" />
          </Button>
        </div>
      </header>

      <div className="mb-8 p-6 bg-card/50 backdrop-blur-sm rounded-xl shadow-xl border border-border">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <Button variant="outline" size="icon" onClick={goToPreviousDay} className="border-border hover:bg-muted/50">
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-[200px] sm:w-[280px] justify-start text-left font-normal border-border hover:bg-muted/50"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(currentDate, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0 bg-popover border-border text-popover-foreground" align="start">
                <Calendar
                  mode="single"
                  selected={currentDate}
                  onSelect={handleDateChange}
                  initialFocus
                  className="[&_button:focus]:bg-primary/20"
                  classNames={{
                    day_selected: "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
                    day_today: "bg-accent text-accent-foreground",
                  }}
                />
              </PopoverContent>
            </Popover>
            <Button variant="outline" size="icon" onClick={goToNextDay} className="border-border hover:bg-muted/50">
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <Button onClick={goToToday} variant="outline" className="border-border hover:bg-muted/50 text-sm">
            Go to Today
          </Button>
        </div>
      </div>
      
      {loading && (
        <div className="flex justify-center items-center h-64">
          <Settings className="h-12 w-12 animate-spin text-primary" />
          <p className="ml-3 text-lg">Loading your day...</p>
        </div>
      )}
      {error && <p className="text-center text-destructive bg-destructive/10 p-3 rounded-md">Error: {error}</p>}

      {!loading && !error && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <WorkoutCard 
            currentDate={currentDate} 
            onLogChange={handleLogChange}
            initialLog={getLogForSystem('WORKOUT', true)}
          />
          <ReadingCard 
            currentDate={currentDate} 
            onLogChange={handleLogChange}
            initialLog={getLogForSystem('READING', true)}
          />
          <DietCard 
            currentDate={currentDate} 
            onLogChange={handleLogChange}
            initialLog={getLogForSystem('DIET', true)}
          />
          <SocialCard 
            currentDate={currentDate} 
            onLogChange={handleLogChange}
            initialLog={getLogForSystem('SOCIAL', true)}
          />
          {customSystems.map(system => (
            <SystemCard
              key={system.id}
              system={system}
              currentDate={currentDate}
              onLogChange={handleLogChange}
              initialLog={getLogForSystem(system.id, false)}
            />
          ))}
           {customSystems.length === 0 && logs.filter(l => l.system_id).length === 0 && (
             <Card className="md:col-span-2 lg:col-span-1 bg-card/70 border-border border-dashed flex flex-col items-center justify-center p-8 min-h-[200px]">
                <CardHeader className="text-center">
                    <CardTitle className="text-xl font-semibold text-foreground">No Custom Systems Yet</CardTitle>
                </CardHeader>
                <CardContent className="text-center">
                    <CardDescription className="text-muted-foreground">
                        Click the "Add New System" button to create your first personalized tracker!
                    </CardDescription>
                </CardContent>
            </Card>
           )}
        </div>
      )}
      <NewSystemModal onAddSystem={handleAddSystem} />
    </div>
  );
};

export default DashboardPage;
