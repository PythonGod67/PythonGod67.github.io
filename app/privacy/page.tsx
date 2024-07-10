'use client'

import React, { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChevronRight } from 'lucide-react';
import { BackgroundGradientAnimation } from "@/components/ui/background-gradient";

const PrivacyPolicyPage: React.FC = () => {
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const sections = [
    {
      title: "1. Introduction",
      content: "Welcome to Medelen. We are committed to protecting your personal information and your right to privacy. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our website and services."
    },
    {
      title: "2. Information We Collect",
      content: (
        <>
          <p>We collect personal information that you provide to us, including but not limited to:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Name, email address, and contact information</li>
            <li>Payment and billing information</li>
            <li>Profile information and equipment listings</li>
            <li>Communication data through our chat feature</li>
            <li>Usage data and device information</li>
          </ul>
        </>
      )
    },
    {
      title: "3. How We Use Your Information",
      content: (
        <>
          <p>We use your personal information for purposes including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>Providing and maintaining our services</li>
            <li>Processing transactions and rental agreements</li>
            <li>Communicating with you about our services</li>
            <li>Improving our website and user experience</li>
            <li>Ensuring the security and integrity of our platform</li>
          </ul>
        </>
      )
    },
    {
      title: "4. Sharing of Your Information",
      content: (
        <>
          <p>We may share your information with third parties in certain situations, such as:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>With your consent</li>
            <li>To comply with legal obligations</li>
            <li>With service providers who assist in our operations</li>
            <li>In connection with a business transaction (e.g., merger or acquisition)</li>
          </ul>
        </>
      )
    },
    {
      title: "5. Data Security",
      content: "We implement appropriate technical and organizational measures to protect your personal information. However, no method of transmission over the internet or electronic storage is 100% secure, and we cannot guarantee absolute security."
    },
    {
      title: "6. Your Privacy Rights",
      content: (
        <>
          <p>Depending on your location, you may have certain rights regarding your personal information, including:</p>
          <ul className="list-disc pl-6 mt-2 space-y-1">
            <li>The right to access your personal information</li>
            <li>The right to rectify inaccurate information</li>
            <li>The right to request deletion of your information</li>
            <li>The right to restrict or object to processing</li>
            <li>The right to data portability</li>
          </ul>
        </>
      )
    },
    {
      title: "7. Children's Privacy",
      content: "Our services are not intended for individuals under the age of 18. We do not knowingly collect personal information from children. If you are a parent or guardian and believe your child has provided us with personal information, please contact us."
    },
    {
      title: "8. Updates to This Policy",
      content: "We may update this Privacy Policy from time to time. We will notify you of any changes by posting the new Privacy Policy on this page and updating the 'Last updated' date."
    },
    {
      title: "9. Contact Us",
      content: (
        <>
          <p>If you have any questions about this Privacy Policy or our data practices, please contact us at:</p>
          <p className="mt-2">
            Email: privacy@medelen.com<br />
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
          >
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
                  <CardTitle className="text-3xl font-bold text-center">Medelen Privacy Policy</CardTitle>
                </motion.div>
              </CardHeader>
              <CardContent className="p-8">
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.8, delay: 0.6 }}
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
                  transition={{ duration: 0.8, delay: 0.8 }}
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

export default PrivacyPolicyPage;