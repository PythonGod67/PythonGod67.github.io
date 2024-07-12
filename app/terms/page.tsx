'use client'

import React, { useState, useEffect } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Button } from "@/components/ui/button";
import { ChevronRight, ArrowLeft } from 'lucide-react';
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient";

const TermsAndConditionsPage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);
  const [backLink, setBackLink] = useState('/');
  const router = useRouter();

  useEffect(() => {
    const referrer = document.referrer;
    if (referrer.includes('/home')) {
      setBackLink('/home');
    } else {
      setBackLink('/');
    }
  }, []);

  const sections = [
    {
      title: "1. Acceptance of Terms",
      content: "By accessing or using Medelen's services, you agree to be bound by these Terms and Conditions. If you disagree with any part of the terms, you may not access the service."
    },
    {
      title: "2. Description of Service",
      content: "Medelen provides a platform for users to rent and lend physical therapy equipment. We do not own, sell, resell, furnish, provide, repair, or manage any equipment listed on our platform."
    },
    {
      title: "3. User Accounts",
      content: (
        <>
          <p>When you create an account with us, you must provide accurate, complete, and current information at all times. Failure to do so constitutes a breach of the Terms, which may result in immediate termination of your account on our service.</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>You are responsible for safeguarding the password you use to access the service and for any activities or actions under your password.</li>
            <li>You agree not to disclose your password to any third party.</li>
            <li>You must notify us immediately upon becoming aware of any breach of security or unauthorized use of your account.</li>
          </ul>
        </>
      )
    },
    {
      title: "4. User Responsibilities",
      content: (
        <>
          <p>As a user of Medelen, you agree to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Provide accurate and complete information about yourself and any equipment you list.</li>
            <li>Maintain and promptly update your account information.</li>
            <li>Ensure that any equipment you list is in good working condition and suitable for its intended use.</li>
            <li>Communicate honestly and promptly with other users regarding rentals.</li>
            <li>Comply with all applicable laws and regulations.</li>
          </ul>
        </>
      )
    },
    {
      title: "5. Prohibited Activities",
      content: (
        <>
          <p>You agree not to engage in any of the following prohibited activities:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Using the service for any illegal purpose or in violation of any local, state, national, or international law.</li>
            <li>Harassing, abusing, or harming another person.</li>
            <li>Impersonating another user or person.</li>
            <li>Posting false or misleading information about equipment.</li>
            <li>Attempting to circumvent any security features of the service.</li>
          </ul>
        </>
      )
    },
    {
      title: "6. Intellectual Property",
      content: "The service and its original content (excluding content provided by users), features, and functionality are and will remain the exclusive property of Medelen and its licensors. The service is protected by copyright, trademark, and other laws of both the United States and foreign countries."
    },
    {
      title: "7. Termination",
      content: "We may terminate or suspend your account immediately, without prior notice or liability, for any reason whatsoever, including without limitation if you breach the Terms. Upon termination, your right to use the service will immediately cease."
    },
    {
      title: "8. Limitation of Liability",
      content: "In no event shall Medelen, nor its directors, employees, partners, agents, suppliers, or affiliates, be liable for any indirect, incidental, special, consequential or punitive damages, including without limitation, loss of profits, data, use, goodwill, or other intangible losses, resulting from your access to or use of or inability to access or use the service."
    },
    {
      title: "9. Disclaimer",
      content: "Your use of the service is at your sole risk. The service is provided on an 'AS IS' and 'AS AVAILABLE' basis. The service is provided without warranties of any kind, whether express or implied, including, but not limited to, implied warranties of merchantability, fitness for a particular purpose, non-infringement or course of performance."
    },
    {
      title: "10. Governing Law",
      content: "These Terms shall be governed and construed in accordance with the laws of [Your State/Country], without regard to its conflict of law provisions. Our failure to enforce any right or provision of these Terms will not be considered a waiver of those rights."
    },
    {
      title: "11. Changes to Terms",
      content: "We reserve the right, at our sole discretion, to modify or replace these Terms at any time. What constitutes a material change will be determined at our sole discretion. By continuing to access or use our service after those revisions become effective, you agree to be bound by the revised terms."
    },
    {
      title: "12. Contact Us",
      content: (
        <>
          <p>If you have any questions about these Terms, please contact us at:</p>
          <p className="mt-2">
            Email: legal@medelen.com<br />
            Address: [Medelen's Physical Address]<br />
            Phone: [Medelen's Contact Number]
          </p>
        </>
      )
    }
  ];

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
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5 }}
            className="relative"
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="absolute top-4 left-4 z-20"
            >
              <Link href={backLink}>
                <Button
                  variant="ghost"
                  className="bg-white/20 backdrop-filter backdrop-blur-lg border border-white/30 rounded-full px-4 py-2 text-white hover:bg-white/30 transition-all duration-300"
                >
                  <ArrowLeft className="mr-2 h-4 w-4" />
                  Back
                </Button>
              </Link>
            </motion.div>

            <Card className="max-w-4xl mx-auto shadow-lg backdrop-filter backdrop-blur-lg bg-white/20 border border-white/30 rounded-3xl overflow-hidden">
              <CardHeader className="bg-gradient-to-r from-blue-600/80 to-blue-400/80 text-white p-8">
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
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8, delay: 0.4 }}
                >
                  <CardTitle className="text-3xl font-bold text-center">Medelen Terms and Conditions</CardTitle>
                </motion.div>
              </CardHeader>
              <CardContent className="p-8">
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
                  className="text-blue-800 mb-6 text-lg"
                >
                  Welcome to Medelen. These Terms and Conditions govern your use of our website and services. 
                  Please read them carefully before using our platform.
                </motion.p>
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.8 }}
                >
                  <Accordion type="single" collapsible className="space-y-4">
                    {sections.map((section, index) => (
                      <AccordionItem key={index} value={`item-${index}`} className="border border-blue-200/50 rounded-xl overflow-hidden">
                        <AccordionTrigger
                          className="text-xl font-semibold text-blue-700 hover:text-blue-900 transition-colors duration-200 px-6 py-3 bg-blue-100/40"
                          onClick={() => setExpandedSection(expandedSection === `item-${index}` ? null : `item-${index}`)}
                        >
                          <span className="flex items-center">
                            <motion.div
                              animate={{ rotate: expandedSection === `item-${index}` ? 90 : 0 }}
                              transition={{ duration: 0.2 }}
                            >
                              <ChevronRight className="mr-2 h-5 w-5" />
                            </motion.div>
                            {section.title}
                          </span>
                        </AccordionTrigger>
                        <AnimatePresence>
                          {expandedSection === `item-${index}` && (
                            <AccordionContent forceMount>
                              <motion.div
                                initial={{ opacity: 0, height: 0 }}
                                animate={{ opacity: 1, height: "auto" }}
                                exit={{ opacity: 0, height: 0 }}
                                transition={{ duration: 0.3 }}
                                className="text-blue-900 mt-2 px-6 py-4"
                              >
                                {section.content}
                              </motion.div>
                            </AccordionContent>
                          )}
                        </AnimatePresence>
                      </AccordionItem>
                    ))}
                  </Accordion>
                </motion.div>
                <motion.p
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 1 }}
                  className="text-sm text-blue-700 mt-8 text-center"
                >
                  Last updated: {new Date().toLocaleDateString()}
                </motion.p>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default TermsAndConditionsPage;