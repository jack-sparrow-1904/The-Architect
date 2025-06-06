import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DraftingCompass, Zap } from 'lucide-react';

const LoginPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      navigate('/');
    } catch (error: any) {
      setError(error.message || 'Failed to login. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background to-surface p-4">
      <Card className="w-full max-w-md shadow-2xl bg-surface/80 backdrop-blur-md border-border">
        <CardHeader className="text-center">
          <div className="flex justify-center items-center mb-4">
            <DraftingCompass className="h-12 w-12 text-primary" />
            <Zap className="h-8 w-8 text-secondary ml-1 -mt-4" />
          </div>
          <CardTitle className="text-3xl font-bold text-text">Welcome Back to The Architect</CardTitle>
          <CardDescription className="text-textSecondary">Your Daily Co-Pilot for building a better you.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleLogin} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="email" className="text-textSecondary">Email</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                required
                className="bg-background/50 border-border focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password" className="text-textSecondary">Password</Label>
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-background/50 border-border focus:ring-primary"
              />
            </div>
            {error && <p className="text-sm text-error bg-error/10 p-2 rounded-md">{error}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
              {loading ? 'Logging in...' : 'Log In'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-textSecondary">
            Don't have an account?{' '}
            <Link to="/signup" className="font-medium text-primary hover:underline">
              Sign up
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
