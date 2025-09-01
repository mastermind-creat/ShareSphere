'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/lib/supabase';

type AuthFormMode = 'login' | 'signup';

export default function AuthForm({ mode }: { mode: AuthFormMode }) {
  const router = useRouter();
  const { toast } = useToast();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const title = mode === 'login' ? 'Welcome back!' : 'Create an account';
  const description =
    mode === 'login'
      ? 'Sign in to continue to ShareSphere.'
      : 'Join ShareSphere to start sharing files.';
  const buttonText = mode === 'login' ? 'Sign In' : 'Sign Up';
  const linkText =
    mode === 'login' ? "Don't have an account?" : 'Already have an account?';
  const linkHref = mode === 'login' ? '/signup' : '/login';
  const linkActionText = mode === 'login' ? 'Sign Up' : 'Sign In';

  const handleAuthAction = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp(
          { email, password },
          { data: { username } } // Optional user metadata
        );

        if (error) throw error;

        // Insert user profile into 'profiles' table
        if (data.user) {
          const { error: profileError } = await supabase
            .from('profiles')
            .insert([
              {
                id: data.user.id,
                email: data.user.email,
                username: username,
                status: 'Hey there! I am using ShareSphere.',
                created_at: new Date(),
              },
            ]);
          if (profileError) throw profileError;
        }

        toast({ title: 'Sign-up successful!', description: 'Check your email for confirmation.' });
      } else {
        const { error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) throw error;
      }
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Authentication Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({ provider: 'google' });
      if (error) throw error;

      // Redirect will be handled by Supabase OAuth
      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Google Sign-In Error',
        description: error.message,
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card>
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        <form onSubmit={handleAuthAction} className="grid gap-4">
          {mode === 'signup' && (
            <div className="grid gap-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="John Doe"
                required
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              type="email"
              placeholder="m@example.com"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === 'login' && (
                <Link href="/forgot-password" passHref>
                  <Button variant="link" className="p-0 h-auto text-xs">
                    Forgot password?
                  </Button>
                </Link>
              )}
            </div>
            <Input
              id="password"
              type="password"
              required
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading ? 'Loading...' : buttonText}
          </Button>
        </form>
        <div className="relative">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
          </div>
        </div>
        <div className="grid grid-cols-1 gap-2">
          <Button
            variant="outline"
            className="w-full"
            onClick={handleGoogleSignIn}
            disabled={isLoading}
          >
            Google
          </Button>
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <div className="text-sm text-center">
          {linkText}{' '}
          <Link href={linkHref} className="underline text-primary">
            {linkActionText}
          </Link>
        </div>
      </CardFooter>
    </Card>
  );
}
