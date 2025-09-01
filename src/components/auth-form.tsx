'use client';

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

type AuthFormMode = 'login' | 'signup';

export default function AuthForm({ mode }: { mode: AuthFormMode }) {
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

  return (
    <Card className="w-full max-w-sm">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl">{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {mode === 'signup' && (
           <div className="grid gap-2">
            <Label htmlFor="name">Full Name</Label>
            <Input id="name" placeholder="John Doe" required />
          </div>
        )}
        <div className="grid gap-2">
          <Label htmlFor="email">Email</Label>
          <Input id="email" type="email" placeholder="m@example.com" required />
        </div>
        <div className="grid gap-2">
          <Label htmlFor="password">Password</Label>
          <Input id="password" type="password" required />
        </div>
      </CardContent>
      <CardFooter className="flex flex-col gap-4">
        <Button className="w-full">{buttonText}</Button>
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
