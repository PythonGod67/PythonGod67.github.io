'use client'

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronDown } from 'lucide-react';
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"

const FeatureCard = ({ title, description }: { title: string, description: string }) => (
  <Card className="w-full">
    <CardHeader>
      <CardTitle>{title}</CardTitle>
    </CardHeader>
    <CardContent>
      <CardDescription>{description}</CardDescription>
    </CardContent>
  </Card>
);

const HeroSection = () => (
  <section className="relative h-screen flex items-center justify-center overflow-hidden">
    <div className="relative z-10 text-center">
      <motion.h1 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="text-5xl font-bold mb-4 text-white"
      >
        Welcome to Medelen
      </motion.h1>
      <motion.p 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.2 }}
        className="text-xl mb-8 text-white"
      >
        Revolutionizing access to physical therapy equipment
      </motion.p>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.4 }}
      >
        <Button size="lg">Get Started</Button>
      </motion.div>
    </div>
    <div className="absolute inset-0 z-0">
      <video
        autoPlay
        loop
        muted
        className="w-full h-full object-cover"
      >
        <source src="/api/placeholder/400/320" type="video/mp4" />
        Your browser does not support the video tag.
      </video>
    </div>
  </section>
);

const Features = () => (
  <section className="py-16 bg-gray-100">
    <div className="container mx-auto px-4">
      <h2 className="text-3xl font-bold mb-8 text-center">Our Features</h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <FeatureCard
          title="Easy Equipment Sharing"
          description="Connect with local equipment owners and rent what you need."
        />
        <FeatureCard
          title="Affordable Pricing"
          description="Save money by renting equipment instead of buying."
        />
        <FeatureCard
          title="Wide Selection"
          description="Find a variety of physical therapy equipment to suit your needs."
        />
      </div>
    </div>
  </section>
);

const HowItWorks = () => {
  const steps = [
    { title: "Sign Up", description: "Create your Medelen account" },
    { title: "Browse", description: "Find equipment in your area" },
    { title: "Connect", description: "Contact equipment owners" },
    { title: "Rent", description: "Arrange rental details and pick up" },
    { title: "Return", description: "Return the equipment when done" }
  ];

  return (
    <section className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">How It Works</h2>
        <div className="flex flex-col items-center">
          {steps.map((step, index) => (
            <div key={index} className="flex items-center mb-4">
              <div className="bg-blue-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                {index + 1}
              </div>
              <div>
                <h3 className="font-semibold">{step.title}</h3>
                <p>{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const [activeIndex, setActiveIndex] = useState(null);

  const faqs = [
    {
      question: "How does Medelen work?",
      answer: "Medelen connects people who need physical therapy equipment with those who have equipment to rent. Users can browse available items, contact owners, and arrange rentals directly through our platform."
    },
    {
      question: "Is it safe to rent equipment from strangers?",
      answer: "We prioritize safety and have measures in place to protect our users. All equipment owners are verified, and we encourage users to review safety guidelines before using any rented equipment."
    },
    {
      question: "What if the equipment is damaged during my rental period?",
      answer: "We have a protection policy in place. Renters are responsible for any damage beyond normal wear and tear. We recommend discussing any concerns with the equipment owner before finalizing the rental."
    }
  ];

  const toggleFAQ = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold mb-8 text-center">Frequently Asked Questions</h2>
        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <div key={index} className="border-b border-gray-200 pb-4">
              <button
                className="flex justify-between items-center w-full text-left"
                onClick={() => toggleFAQ(index)}
              >
                <span className="font-semibold">{faq.question}</span>
                <ChevronDown
                  className={`w-5 h-5 transition-transform ${
                    activeIndex === index ? "transform rotate-180" : ""
                  }`}
                />
              </button>
              {activeIndex === index && (
                <p className="mt-2 text-gray-600">{faq.answer}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

const Footer = () => (
  <footer className="bg-gray-800 text-white py-8">
    <div className="container mx-auto px-4">
      <div className="flex flex-wrap justify-between">
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <h3 className="text-xl font-bold mb-2">Medelen</h3>
          <p>Revolutionizing physical therapy equipment access</p>
        </div>
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <h4 className="text-lg font-semibold mb-2">Quick Links</h4>
          <ul>
            <li><a href="#" className="hover:text-gray-300">Home</a></li>
            <li><a href="#" className="hover:text-gray-300">About Us</a></li>
            <li><a href="#" className="hover:text-gray-300">Services</a></li>
            <li><a href="#" className="hover:text-gray-300">Contact</a></li>
          </ul>
        </div>
        <div className="w-full md:w-1/4 mb-6 md:mb-0">
          <h4 className="text-lg font-semibold mb-2">Contact Us</h4>
          <p>Email: info@medelen.com</p>
          <p>Phone: (555) 123-4567</p>
        </div>
        <div className="w-full md:w-1/4">
          <h4 className="text-lg font-semibold mb-2">Follow Us</h4>
          <div className="flex space-x-4">
            {/* Add social media icons here */}
          </div>
        </div>
      </div>
      <div className="mt-8 text-center">
        <p>&copy; 2024 Medelen. All rights reserved.</p>
      </div>
    </div>
  </footer>
);

const HomePage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <HeroSection />
      <Features />
      <HowItWorks />
      <FAQ />
      <Footer />
    </div>
  );
};

export default HomePage;