'use client';

import { useState } from 'react';
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
import { useRouter } from 'next/navigation';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword, 
  GoogleAuthProvider, 
  signInWithPopup 
} from 'firebase/auth';
import { doc, setDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { auth, db } from '@/lib/firebase';
import { useToast } from '@/hooks/use-toast';
import { Smartphone } from 'lucide-react';

type AuthFormMode = 'login' | 'signup';

const GoogleIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg viewBox="0 0 48 48" {...props}>
    <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
    <path fill="#FF3D00" d="M6.306 14.691c2.242-4.337 6.424-7.465 11.091-8.588L6.306 14.691z" />
    <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
    <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303c-.792 2.237-2.231 4.166-4.087 5.571l6.19 5.238C42.099 32.626 44 27.643 44 24c0-1.341-.138-2.65-.389-3.917z" />
  </svg>
);

const FacebookIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="#1877F2" viewBox="0 0 24 24" {...props}>
        <path d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.879V14.89h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v7.024C18.343 21.128 22 16.991 22 12z" />
    </svg>
);

const XIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg fill="#000000" viewBox="0 0 24 24" {...props}>
        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
);

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
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const user = userCredential.user;
        const userRef = doc(db, 'users', user.uid);
        await setDoc(userRef, {
          username: username,
          email: user.email,
          photoURL: `https://picsum.photos/seed/${user.uid}/100`,
          status: 'Hey there! I am using ShareSphere.', // Default status
          createdAt: serverTimestamp(),
        });
      } else {
        await signInWithEmailAndPassword(auth, email, password);
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
    const provider = new GoogleAuthProvider();
    provider.addScope('https://www.googleapis.com/auth/drive.readonly');
    
    try {
      const result = await signInWithPopup(auth, provider);
      
      const credential = GoogleAuthProvider.credentialFromResult(result);
      const accessToken = credential?.accessToken;

      const user = result.user;
      const userRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(userRef);

      if (!docSnap.exists()) {
        await setDoc(userRef, {
          username: user.displayName,
          email: user.email,
          photoURL: user.photoURL,
          status: 'Hey there! I am using ShareSphere.',
          driveAccessToken: accessToken,
          createdAt: serverTimestamp(),
        });
      } else {
         await setDoc(userRef, { driveAccessToken: accessToken }, { merge: true });
      }
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

  const handleSocialSignIn = (provider: string) => {
    toast({
      title: 'Coming Soon!',
      description: `${provider} sign-in is not yet available.`,
    });
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
              <Input id="username" placeholder="John Doe" required value={username} onChange={(e) => setUsername(e.target.value)} />
            </div>
          )}
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input id="email" type="email" placeholder="m@example.com" required value={email} onChange={(e) => setEmail(e.target.value)} />
          </div>
          <div className="grid gap-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password">Password</Label>
              {mode === 'login' && (
                <Link href="/forgot-password" passHref>
                  <Button variant="link" className="p-0 h-auto text-xs">Forgot password?</Button>
                </Link>
              )}
            </div>
            <Input id="password" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
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
            <span className="bg-background px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
            <Button variant="outline" className="w-full" onClick={handleGoogleSignIn} disabled={isLoading}>
                <GoogleIcon className="mr-2 h-4 w-4" />
                Google
            </Button>
             <Button variant="outline" className="w-full" onClick={() => handleSocialSignIn('Phone')} disabled={isLoading}>
                <Smartphone className="mr-2 h-4 w-4" />
                Phone
            </Button>
        </div>
         <div className="grid grid-cols-2 gap-2">
             <Button variant="outline" className="w-full" onClick={() => handleSocialSignIn('Facebook')} disabled={isLoading}>
                <FacebookIcon className="mr-2 h-4 w-4" />
                Facebook
            </Button>
             <Button variant="outline" className="w-full" onClick={() => handleSocialSignIn('X')} disabled={isLoading}>
                <XIcon className="mr-2 h-4 w-4" />
                X
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
