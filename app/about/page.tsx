'use client'

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient";

const AboutUsPage: React.FC = () => {
  const fadeInUp = {
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6 }
  };

  const staggeredFadeInUp = (delay: number) => ({
    initial: { opacity: 0, y: 60 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.6, delay }
  });

  return (
    <div className="relative w-screen h-screen overflow-auto">
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
      <div className="absolute inset-0 overflow-auto">
        <div className="container mx-auto px-4 py-12">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
          >
            <Card className="max-w-4xl mx-auto shadow-lg overflow-hidden backdrop-filter backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl">
              <CardHeader className="bg-gradient-to-r from-sky-500/80 to-blue-500/80 text-white p-8">
                <motion.div
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="flex justify-center mb-6"
                >
                  <Image
                    src="/transparentbg-white-medelen-logo.png"
                    alt="Medelen Logo"
                    width={180}
                    height={180}
                  />
                </motion.div>
                <motion.div {...staggeredFadeInUp(0.4)}>
                  <CardTitle className="text-4xl font-bold mb-4 text-center">About Medelen</CardTitle>
                  <p className="text-xl text-center">Connecting People with Quality Physical Therapy Equipment!</p>
                </motion.div>
              </CardHeader>
              <CardContent className="p-8">
                <motion.div {...staggeredFadeInUp(0.6)} className="mb-12">
                  <h2 className="text-3xl font-semibold text-sky-700 mb-4">Our Mission</h2>
                  <p className="text-lg text-gray-800">
                    At Medelen, we&apos;re on a mission to make physical therapy equipment accessible to everyone. 
                    We believe that recovery and rehabilitation should not be hindered by the high costs or 
                    limited availability of essential equipment.
                  </p>
                </motion.div>

                <motion.div {...staggeredFadeInUp(0.8)} className="mb-12">
                  <h2 className="text-3xl font-semibold text-sky-700 mb-4">Our Story</h2>
                  <div className="flex flex-col md:flex-row items-center gap-8">
                    <div className="md:w-1/2">
                      <p className="text-gray-800 mb-4">
                        Medelen was founded in 2024 by a team of aspirational high school students who 
                        saw a gap in the market. They realized that many patients struggled to access the 
                        equipment they needed for their recovery journey.
                      </p>
                      <p className="text-gray-800">
                        Inspired by the sharing economy, they created a platform where people could easily 
                        rent out their unused physical therapy equipment to those in need, creating a 
                        win-win situation for equipment owners and patients alike.
                      </p>
                    </div>
                    <motion.div
                      className="md:w-1/2"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ duration: 0.8, delay: 1 }}
                    >
                      <Image
                        src="/about-us-image.jpg"
                        alt="Medelen founders"
                        width={500}
                        height={300}
                        className="rounded-lg shadow-md"
                      />
                    </motion.div>
                  </div>
                </motion.div>

                <motion.div {...staggeredFadeInUp(1.2)} className="mb-12">
                  <h2 className="text-3xl font-semibold text-sky-700 mb-4">Our Impact</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Successful Rentals', 'Happy Customers', 'Saved in Equipment Costs'].map((item, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.6, delay: 1.4 + index * 0.2 }}
                      >
                        <Card className="bg-sky-100/50 backdrop-blur-sm p-6 text-center">
                          <h3 className="text-2xl font-bold text-sky-700 mb-2">stat</h3>
                          <p className="text-gray-800">{item}</p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div {...staggeredFadeInUp(1.8)} className="mb-12">
                  <h2 className="text-3xl font-semibold text-sky-700 mb-4">Our Team</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {['Kunaal Purohit', 'Karthik Thallam', 'Kavin Murugesan'].map((name, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.6, delay: 2 + index * 0.2 }}
                      >
                        <Card className="p-4 text-center bg-white/50 backdrop-blur-sm">
                          <Image
                            src={`/team-member-${index + 1}.jpeg`}
                            alt={name}
                            width={150}
                            height={150}
                            className="rounded-full mx-auto mb-4"
                          />
                          <h3 className="text-xl font-semibold text-sky-700 mb-2">{name}</h3>
                          <p className="text-gray-800">Co-founder</p>
                        </Card>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>

                <motion.div {...staggeredFadeInUp(2.6)}>
                  <h2 className="text-3xl font-semibold text-sky-700 mb-4">Join Our Mission</h2>
                  <p className="text-gray-800 mb-6">
                    Whether you&apos;re looking to rent equipment for your recovery or you have equipment 
                    to share, join us in our mission to make physical therapy more accessible for everyone.
                  </p>
                  <div className="flex justify-center">
                    <Link href="/">
                      <motion.div
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Button 
                          className="bg-sky-600 hover:bg-sky-700 text-white font-bold py-3 px-8 rounded-full text-lg transition duration-300 shadow-lg hover:shadow-xl"
                        >
                          Get Started
                        </Button>
                      </motion.div>
                    </Link>
                  </div>
                </motion.div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default AboutUsPage;