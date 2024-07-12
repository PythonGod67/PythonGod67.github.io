'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { User, updateProfile } from 'firebase/auth';
import { doc, updateDoc, getDoc } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient";
import { ArrowLeft } from 'lucide-react';
import { toast } from 'react-hot-toast';
import { auth, db, storage } from '@/firebase-config';

const UserSettingsPage = () => {
  const router = useRouter();
  const [user, setUser] = useState<User | null>(null);
  const [displayName, setDisplayName] = useState('');
  const [email, setEmail] = useState('');
  const [phoneNumber, setPhoneNumber] = useState('');
  const [notificationsEnabled, setNotificationsEnabled] = useState(false);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [profileImageUrl, setProfileImageUrl] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged(async (user) => {
      if (user) {
        setUser(user);
        setDisplayName(user.displayName || '');
        setEmail(user.email || '');
        setProfileImageUrl(user.photoURL || '');

        // Fetch additional user data from Firestore
        const userDoc = await getDoc(doc(db, 'users', user.uid));
        if (userDoc.exists()) {
          const userData = userDoc.data();
          setPhoneNumber(userData.phoneNumber || '');
          setNotificationsEnabled(userData.notificationsEnabled || false);
          setDarkModeEnabled(userData.darkModeEnabled || false);
        }
      } else {
        router.push('/signin');
      }
    });

    return () => unsubscribe();
  }, [router]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setProfileImage(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      if (user) {
        // Update display name
        await updateProfile(user, { displayName });

        // Update profile image if changed
        if (profileImage) {
          const imageRef = ref(storage, `profileImages/${user.uid}`);
          await uploadBytes(imageRef, profileImage);
          const downloadURL = await getDownloadURL(imageRef);
          await updateProfile(user, { photoURL: downloadURL });
          setProfileImageUrl(downloadURL);
        }

        // Update additional user data in Firestore
        await updateDoc(doc(db, 'users', user.uid), {
          phoneNumber,
          notificationsEnabled,
          darkModeEnabled,
        });

        toast.success('Profile updated successfully!');
      }
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
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
        className="absolute inset-0"
      />
      <div className="absolute inset-0 flex justify-center items-center p-4 z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-4xl relative"
        >
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="absolute top-4 left-4 z-20"
          >
            <Link href="/home">
              <Button
                variant="ghost"
                className="bg-white/20 backdrop-filter backdrop-blur-lg border border-white/30 rounded-full px-4 py-2 text-white hover:bg-white/30 transition-all duration-300"
              >
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Home
              </Button>
            </Link>
          </motion.div>
          
          <Card className="w-full bg-white/20 backdrop-filter backdrop-blur-lg border border-white/30 shadow-lg rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sky-500/80 to-blue-500/80 text-white p-8 pt-16">
              <motion.div
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.4 }}
                className="flex justify-center mb-4"
              >
                <Image src="/transparentbg-white-medelen-logo.png" alt="Medelen Logo" width={120} height={120} />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 0.6 }}
              >
                <CardTitle className="text-3xl font-bold text-center">User Settings</CardTitle>
              </motion.div>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                  className="flex justify-center mb-6"
                >
                  <Image
                    src={profileImageUrl || '/default-avatar.png'}
                    alt="Profile"
                    width={100}
                    height={100}
                    className="rounded-full"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.7 }}
                >
                  <Label htmlFor="profileImage">Profile Image</Label>
                  <Input
                    id="profileImage"
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="bg-white/50 border-white/30"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-white/50 border-white/30"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.9 }}
                >
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    className="bg-white/50 border-white/30"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1 }}
                >
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-white/50 border-white/30"
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.1 }}
                  className="flex items-center justify-between"
                >
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.2 }}
                  className="flex items-center justify-between"
                >
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <Switch
                    id="darkMode"
                    checked={darkModeEnabled}
                    onCheckedChange={setDarkModeEnabled}
                  />
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 1.5 }}
                >
                  <Button
                    type="submit"
                    className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                    disabled={isLoading}
                  >
                    {isLoading ? 'Updating...' : 'Save Changes'}
                  </Button>
                </motion.div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserSettingsPage;