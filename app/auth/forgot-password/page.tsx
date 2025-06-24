"use client";

import { useState } from 'react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft, CheckCircle } from 'lucide-react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    // Simulate API call
    setTimeout(() => {
      setEmailSent(true);
      setIsLoading(false);
      toast.success('Password reset email sent successfully!');
    }, 1500);
  };

  if (emailSent) {
    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="w-full max-w-md space-y-6"
        >
          <Card>
            <CardHeader className="text-center space-y-4">
              <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
                <CheckCircle className="h-8 w-8 text-green-600" />
              </div>
              <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
              <p className="text-muted-foreground">
                We've sent a password reset link to{' '}
                <span className="font-medium text-foreground">{email}</span>
              </p>
            </CardHeader>
            
            <CardContent className="space-y-6">
              <div className="text-center text-sm text-muted-foreground space-y-2">
                <p>Didn't receive the email? Check your spam folder.</p>
                <p>
                  If you still don't see it,{' '}
                  <button
                    onClick={() => setEmailSent(false)}
                    className="text-primary hover:underline"
                  >
                    try again
                  </button>
                </p>
              </div>

              <div className="flex flex-col space-y-3">
                <Link href="/auth/signin">
                  <Button className="w-full">
                    Back to Sign In
                  </Button>
                </Link>
                <Link href="/">
                  <Button variant="outline" className="w-full">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Home
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="w-full max-w-md space-y-6"
      >
        {/* Back to Sign In */}
        <Link href="/auth/signin" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground transition-colors">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Sign In
        </Link>

        <Card>
          <CardHeader className="text-center space-y-2">
            <CardTitle className="text-2xl font-bold">Forgot Password?</CardTitle>
            <p className="text-muted-foreground">
              No worries, we'll send you reset instructions
            </p>
          </CardHeader>
          
          <CardContent className="space-y-6">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <label htmlFor="email" className="text-sm font-medium">
                  Email
                </label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                    placeholder="Enter your email address"
                    className="pl-10"
                  />
                </div>
              </div>

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Instructions'}
              </Button>
            </form>

            <div className="text-center text-sm">
              <span className="text-muted-foreground">Remember your password? </span>
              <Link href="/auth/signin" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}