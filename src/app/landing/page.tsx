'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center p-4 overflow-hidden">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="text-center space-y-8 relative"
      >
        <div className="absolute -top-40 -left-40 w-72 h-72 bg-primary/10 rounded-full filter blur-xl opacity-70 animate-blob"></div>
        <div className="absolute -bottom-40 -right-40 w-72 h-72 bg-accent/10 rounded-full filter blur-xl opacity-70 animate-blob animation-delay-4000"></div>
        
        <div className="flex justify-center relative z-10">
          <Logo />
        </div>
        
        <motion.h1 
          className="text-4xl md:text-6xl font-bold tracking-tighter text-foreground relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
        >
          Seamlessly Share Your Resources.
        </motion.h1>

        <motion.p 
          className="max-w-2xl mx-auto text-lg text-muted-foreground relative z-10"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.4, ease: "easeOut" }}
        >
          ShareSphere is the modern solution for fast, secure, and intelligent file sharing and collaboration. Upload, chat, and connect with ease.
        </motion.p>

        <motion.div 
          className="flex gap-4 justify-center relative z-10"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
        >
          <Button asChild size="lg">
            <Link href="/signup">Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg">
            <Link href="/login">Sign In</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
