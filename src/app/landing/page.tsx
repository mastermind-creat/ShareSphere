'use client';

import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import Link from 'next/link';

export default function LandingPage() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-background via-muted to-background relative overflow-hidden">
      {/* Background gradient accents */}
      <div className="absolute inset-0 -z-10 flex justify-center items-center">
        <div className="w-[600px] h-[600px] bg-primary/20 rounded-full blur-3xl opacity-30 animate-pulse" />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="text-center space-y-8 px-6 relative z-10"
      >
        {/* Logo */}
        <div className="flex justify-center">
          <Logo className="h-16 w-auto" />
        </div>

        {/* Title */}
        <motion.h1 
          className="text-4xl md:text-6xl font-extrabold tracking-tight text-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Seamlessly Share Your Resources
        </motion.h1>

        {/* Subtitle */}
        <motion.p 
          className="max-w-2xl mx-auto text-lg md:text-xl text-muted-foreground"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          ShareSphere makes file sharing effortless — fast, secure, and collaborative. Upload, chat, and connect with ease.
        </motion.p>

        {/* Buttons */}
        <motion.div 
          className="flex gap-4 justify-center mt-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <Button asChild size="lg" className="px-6 py-3 text-base font-medium shadow-md hover:shadow-lg transition">
            <Link href="/signup">🚀 Get Started</Link>
          </Button>
          <Button asChild variant="outline" size="lg" className="px-6 py-3 text-base font-medium">
            <Link href="/login">Sign In</Link>
          </Button>
        </motion.div>
      </motion.div>
    </div>
  );
}
