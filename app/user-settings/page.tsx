'use client'

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
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
    <div className="relative min-h-screen overflow-hidden">
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

      <div className="relative z-10 container mx-auto px-4 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Card className="max-w-2xl mx-auto backdrop-filter backdrop-blur-lg bg-white/20 border border-white/30 shadow-xl rounded-3xl overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-sky-500/80 to-blue-500/80 text-white p-8">
              <CardTitle className="text-3xl font-bold text-center">User Settings</CardTitle>
            </CardHeader>
            <CardContent className="p-8">
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="flex justify-center mb-6">
                  <motion.div
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                  >
                    <Image
                      src={profileImageUrl || '/default-avatar.png'}
                      alt="Profile"
                      width={100}
                      height={100}
                      className="rounded-full"
                    />
                  </motion.div>
                </div>

                <div>
                  <Label htmlFor="profileImage">Profile Image</Label>
                  <Input
                    id="profileImage"
                    type="file"
                    onChange={handleImageChange}
                    accept="image/*"
                    className="bg-white/50 border-white/30"
                  />
                </div>

                <div>
                  <Label htmlFor="displayName">Display Name</Label>
                  <Input
                    id="displayName"
                    type="text"
                    value={displayName}
                    onChange={(e) => setDisplayName(e.target.value)}
                    className="bg-white/50 border-white/30"
                  />
                </div>

                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    readOnly
                    className="bg-white/50 border-white/30"
                  />
                </div>

                <div>
                  <Label htmlFor="phoneNumber">Phone Number</Label>
                  <Input
                    id="phoneNumber"
                    type="tel"
                    value={phoneNumber}
                    onChange={(e) => setPhoneNumber(e.target.value)}
                    className="bg-white/50 border-white/30"
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="notifications">Enable Notifications</Label>
                  <Switch
                    id="notifications"
                    checked={notificationsEnabled}
                    onCheckedChange={setNotificationsEnabled}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <Label htmlFor="darkMode">Dark Mode</Label>
                  <Switch
                    id="darkMode"
                    checked={darkModeEnabled}
                    onCheckedChange={setDarkModeEnabled}
                  />
                </div>

                <Button
                  type="submit"
                  className="w-full bg-gradient-to-r from-sky-500 to-blue-500 hover:from-sky-600 hover:to-blue-600 text-white font-bold py-2 px-4 rounded-full transition duration-300 transform hover:-translate-y-1 hover:shadow-lg"
                  disabled={isLoading}
                >
                  {isLoading ? 'Updating...' : 'Save Changes'}
                </Button>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
};

export default UserSettingsPage;