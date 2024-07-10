'use client'

import React, { useState } from 'react';
import { signInWithPopup, GoogleAuthProvider } from 'firebase/auth';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient";
import { auth } from '../../firebase-config';

const SignIn = () => {
  const router = useRouter();
  const [error, setError] = useState('');

  const signInWithGoogle = async () => {
    console.log('Starting Google sign-in');
    const provider = new GoogleAuthProvider();
    try {
      console.log('Calling signInWithPopup');
      const result = await signInWithPopup(auth, provider);
      console.log('Sign-in successful', result);
      router.push('/home');
    } catch (error) {
      console.error('Detailed error object:', error);
      setError(`Failed to sign in. Error: ${error.message || 'Unknown error'}`);
    }
  };

  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <BackgroundGradientAnimation
        gradientBackgroundStart="rgb(100, 170, 255)"
        gradientBackgroundEnd="rgb(200, 240, 255)"
        firstColor="18, 113, 255"
        secondColor="80, 150, 255"
        thirdColor="140, 200, 255"
        fourthColor="200, 240, 255"
        fifthColor="220, 250, 255"
        pointerColor="140, 200, 255"
        size="100%"
        blendingValue="hard-light"
        className="duration-[1500ms]"
      />
      <div className="absolute inset-0 flex justify-center items-center p-4 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="w-full max-w-md bg-white/20 backdrop-filter backdrop-blur-lg border border-white/30 shadow-lg rounded-3xl overflow-hidden">
            <CardHeader>
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.2 }}
                className="flex justify-center mb-4"
              >
                <Image src="/transparentbg-medelen-logo.png" alt="Medelen Logo" width={180} height={180} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
              >
                <CardTitle className="text-4xl font-bold text-center text-sky-600">Sign In to Medelen!</CardTitle>
                <CardDescription className="text-center text-sky-700 mt-2">Use your Google Account for Secure Authentication</CardDescription>
              </motion.div>
            </CardHeader>
            <CardContent>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                className="flex justify-center"
              >
                <MovingBorderButton
                  onClick={signInWithGoogle}
                  className="bg-sky-500 hover:bg-sky-600 text-white"
                  containerClassName="rounded-lg"
                  borderRadius="1.25rem"
                  duration={2000}
                >
                  Sign In with Google
                </MovingBorderButton>
              </motion.div>
              {error && (
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.3 }}
                  className="text-red-500 mt-4 text-center"
                >
                  {error}
                </motion.p>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default SignIn;