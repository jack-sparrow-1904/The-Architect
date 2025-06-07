import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { ArrowLeft, BookOpenCheck } from 'lucide-react';

const WeeklyReviewPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-surface text-foreground p-4 md:p-8">
      <header className="flex items-center justify-between mb-8">
        <Button asChild variant="ghost" className="text-muted-foreground hover:text-primary">
          <Link to="/">
            <ArrowLeft className="h-5 w-5 mr-2" />
            Back to Dashboard
          </Link>
        </Button>
        <div className="flex items-center space-x-2">
          <BookOpenCheck className="h-8 w-8 text-primary" />
          <h1 className="text-3xl md:text-4xl font-bold">Weekly Review</h1>
        </div>
        <div className="w-40"></div> {/* Spacer */}
      </header>
      <main>
        <div className="text-center p-12 bg-card/50 backdrop-blur-sm rounded-xl shadow-xl border border-border">
          <h2 className="text-2xl font-semibold mb-4 text-foreground">Feature Under Construction</h2>
          <p className="text-muted-foreground max-w-md mx-auto">
            The interface for creating and viewing your weekly reviews and action items is being built. Soon, you'll be able to reflect on your progress and plan for the week ahead right here.
          </p>
        </div>
      </main>
    </div>
  );
};

export default WeeklyReviewPage;
