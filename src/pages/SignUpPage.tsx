import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { DraftingCompass, UserPlus } from 'lucide-react';

const SignUpPage: React.FC = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setError("Passwords don't match.");
      return;
    }
    setLoading(true);
    setError(null);
    setSuccess(null);
    try {
      const { error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo: window.location.origin,
        },
      });
      if (error) throw error;
      setSuccess('Account created! Please check your email to confirm your account if required, then log in.');
    } catch (error: any) {
      setError(error.message || 'Failed to sign up. Please try again.');
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
            <UserPlus className="h-8 w-8 text-secondary ml-1 -mt-4" />
          </div>
          <CardTitle className="text-3xl font-bold text-text">Create Your Architect Account</CardTitle>
          <CardDescription className="text-textSecondary">Start building your best self, one day at a time.</CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSignUp} className="space-y-6">
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
                placeholder="•••••••• (min. 6 characters)"
                required
                className="bg-background/50 border-border focus:ring-primary"
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="confirm-password" className="text-textSecondary">Confirm Password</Label>
              <Input
                id="confirm-password"
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                required
                className="bg-background/50 border-border focus:ring-primary"
              />
            </div>
            {error && <p className="text-sm text-error bg-error/10 p-2 rounded-md">{error}</p>}
            {success && <p className="text-sm text-success bg-success/10 p-2 rounded-md">{success}</p>}
            <Button type="submit" className="w-full bg-primary hover:bg-primary/90 text-primary-foreground" disabled={loading}>
              {loading ? 'Creating Account...' : 'Sign Up'}
            </Button>
          </form>
          <p className="mt-6 text-center text-sm text-textSecondary">
            Already have an account?{' '}
            <Link to="/login" className="font-medium text-primary hover:underline">
              Log in
            </Link>
          </p>
        </CardContent>
      </Card>
    </div>
  );
};

export default SignUpPage;
