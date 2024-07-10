'use client'

import React from 'react';
import { motion, AnimatePresence, useScroll, useTransform } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { Button as MovingBorderButton } from "@/components/ui/moving-border";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { CardContainer, CardBody, CardItem } from "@/components/ui/3d-card";
import { FlipWords } from "@/components/ui/flip-words";
import { HeroHighlight, Highlight } from "@/components/ui/hero-highlight";

const AnimatedCard = ({ children }) => (
  <motion.div
    initial={{ opacity: 0, y: 50 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true }}
    transition={{ duration: 0.5 }}
  > 
    {children}
  </motion.div>
);

const FeatureCard = ({ title, description }: { title: string, description: string }) => (
  <AnimatedCard>
    <Card className="w-full bg-white shadow-lg hover:shadow-xl transition-shadow duration-300">
      <CardHeader>
        <CardTitle className="text-sky-600">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <CardDescription className="text-gray-600">{description}</CardDescription>
      </CardContent>
    </Card>
  </AnimatedCard>
);

const HeroSection = () => {
  const router = useRouter();

  const handleGetStarted = () => {
    // Trigger the page transition
    document.body.style.overflow = 'hidden';
    setTimeout(() => {
      router.push('/signin');
    }, 500); // Adjust this delay to match your animation duration
  };

  return (
    <HeroHighlight className="w-full">
      <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="relative z-10 text-center">
          <motion.h1 
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl font-bold mb-4 text-sky-600"
          >
            Welcome to <Highlight className="from-yellow-200 to-yellow-300 dark:from-yellow-300 dark:to-yellow-400">Medelen</Highlight>
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="text-xl mb-8 text-sky-500"
          >
            Revolutionizing access to{' '}
            <FlipWords
              words={['physical_therapy_equipment!', 'healthcare_solutions!', 'affordable_rentals!']}
              className="text-sky-600 font-bold"
            />
          </motion.p>
          <motion.div
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
          >
            <MovingBorderButton 
              size="lg" 
              onClick={handleGetStarted}
              className="bg-sky-500 hover:bg-sky-600 text-white"
              containerClassName="rounded-lg"
              borderRadius="1.25rem" 
              duration={2000}
              borderClassName="your-border-class"
            >
              Get Started
            </MovingBorderButton>
          </motion.div>
        </div>
      </section>
      <AnimatePresence>
        {router.pathname === '/' && (
          <motion.div
            key="overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.5 }}
            className="fixed inset-0 bg-sky-500 z-50"
          />
        )}
      </AnimatePresence>
    </HeroHighlight>
  );
};

const Features = () => (
  <section className="py-16 bg-sky-50">
    <div className="container mx-auto px-4">
      <motion.h2 
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
        className="text-3xl font-bold mb-8 text-center text-sky-700"
      >
        Our Features
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {[
          { title: "Easy Equipment Sharing", description: "Connect with local equipment owners and rent what you need.", image: "/easy-sharing.webp" },
          { title: "Affordable Pricing", description: "Save money by renting equipment instead of buying.", image: "/affordable-pricing.webp" },
          { title: "Wide Selection", description: "Find a variety of physical therapy equipment to suit your needs.", image: "/wide-selection.webp" }
        ].map((feature, index) => (
          <CardContainer key={index}>
            <CardBody className="bg-white relative group/card dark:hover:shadow-2xl dark:hover:shadow-emerald-500/[0.1] dark:bg-black dark:border-white/[0.2] border-black/[0.1] w-auto sm:w-[30rem] h-auto rounded-xl p-6 border">
              <CardItem
                translateZ="50"
                className="text-xl font-bold text-neutral-600 dark:text-white"
              >
                {feature.title}
              </CardItem>
              <CardItem
                as="p"
                translateZ="60"
                className="text-neutral-500 text-sm max-w-sm mt-2 dark:text-neutral-300"
              >
                {feature.description}
              </CardItem>
              <CardItem translateZ="100" className="w-full mt-4">
                <Image
                  src={feature.image}
                  alt={feature.title}
                  width={400}
                  height={200}
                  className="h-60 w-full object-cover rounded-xl group-hover/card:shadow-xl"
                />
              </CardItem>
            </CardBody>
          </CardContainer>
        ))}
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
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-center text-sky-700"
        >
          How It Works
        </motion.h2>
        <div className="flex flex-col items-center">
          {steps.map((step, index) => (
            <motion.div 
              key={index} 
              className="flex items-center mb-4"
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <div className="bg-sky-500 text-white rounded-full w-8 h-8 flex items-center justify-center mr-4">
                {index + 1}
              </div>
              <div>
                <h3 className="font-semibold text-sky-600">{step.title}</h3>
                <p className="text-gray-600">{step.description}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FAQ = () => {
  const faqItems = [
    {
      question: "How does Medelen work?",
      answer: "Medelen connects people who need physical therapy equipment with those who have equipment to rent. Browse available items, contact owners, and arrange rentals directly through our platform."
    },
    {
      question: "Is it safe to rent equipment from strangers?",
      answer: "We prioritize safety and have measures in place to protect our users. All equipment owners are verified, and we encourage users to review safety guidelines before using any rented equipment."
    },
    {
      question: "What if the equipment is damaged during my rental period?",
      answer: "We have a protection policy in place. Renters are responsible for any damage beyond normal wear and tear. We recommend discussing any concerns with the equipment owner before finalizing the rental."
    },
    {
      question: "How do I list my equipment for rent?",
      answer: "To list your equipment, sign up for an account and click on the 'Sell' button in the navigation menu. You'll be guided through the process of creating a listing, including adding photos, descriptions, and setting your rental price."
    }
  ];

  return (
    <section className="py-16 bg-sky-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-8 text-center text-sky-700"
        >
          Frequently Asked Questions
        </motion.h2>
        <Accordion type="single" collapsible className="w-full">
          {faqItems.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <AccordionItem value={`item-${index}`}>
                <AccordionTrigger className="text-sky-600">{item.question}</AccordionTrigger>
                <AccordionContent className="text-gray-600">{item.answer}</AccordionContent>
              </AccordionItem>
            </motion.div>
          ))}
        </Accordion>
      </div>
    </section>
  );
};

const MeetTheFounders = () => {
  const founders = [
    { name: "Kavin Murugesan", role: "Co-Founder", image: "/kavin.jpeg" },
    { name: "Karthik Thallam", role: "Co-Founder", image: "/karthik.jpeg" },
    { name: "Kunaal Purohit", role: "Co-Founder", image: "/kunaal.jpeg" },
  ];

  return (
    <section className="py-16 bg-white">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-12 text-center text-sky-700"
        >
          Meet the Founders
        </motion.h2>
        <div className="flex flex-wrap justify-center gap-8">
          {founders.map((founder, index) => (
            <motion.div
              key={index}
              className="w-64 text-center"
              initial={{ opacity: 0, scale: 0.5 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.2 }}
            >
              <Image
                src={founder.image}
                alt={founder.name}
                width={200}
                height={200}
                className="rounded-full mx-auto mb-4 shadow-lg"
              />
              <h3 className="text-xl font-semibold text-sky-600">{founder.name}</h3>
              <p className="text-gray-600">{founder.role}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const FloatingShapes = () => {
  return (
    <div className="fixed inset-0 pointer-events-none" style={{ zIndex: 1 }}>
      {[...Array(20)].map((_, i) => (
        <motion.div
          key={i}
          className="absolute w-4 h-4 bg-sky-300 rounded-full opacity-30"
          initial={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          animate={{
            x: Math.random() * window.innerWidth,
            y: Math.random() * window.innerHeight,
          }}
          transition={{
            duration: Math.random() * 10 + 20,
            repeat: Infinity,
            repeatType: "reverse",
          }}
        />
      ))}
    </div>
  );
};

const Testimonials = () => {
  const testimonials = [
    {
      name: "Sarah J.",
      role: "Physical Therapist",
      content: "Medelen has revolutionized how I access equipment for my patients. It's cost-effective and incredibly convenient!"
    },
    {
      name: "Mike T.",
      role: "Patient",
      content: "Thanks to Medelen, I was able to continue my therapy at home without breaking the bank. Highly recommended!"
    },
    {
      name: "Dr. Emily R.",
      role: "Rehabilitation Specialist",
      content: "The variety of equipment available on Medelen is impressive. It's been a game-changer for my practice and patients."
    }
  ];

  return (
    <section className="py-16 bg-sky-50">
      <div className="container mx-auto px-4">
        <motion.h2 
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-3xl font-bold mb-12 text-center text-sky-700"
        >
          What Our Users Say
        </motion.h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
            >
              <Card className="h-full flex flex-col">
                <CardHeader>
                  <CardTitle className="text-sky-600">{testimonial.name}</CardTitle>
                  <CardDescription>{testimonial.role}</CardDescription>
                </CardHeader>
                <CardContent className="flex-grow">
                  <p className="text-gray-600 italic">"{testimonial.content}"</p>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

const LandingPage = () => {
  const { scrollYProgress } = useScroll();
  const headerOpacity = useTransform(scrollYProgress, [0, 0.1], [1, 0]);

  return (
    <div className="min-h-screen flex flex-col relative">
      <style jsx global>{`
        .bg-grid-animation {
          background-color: #f0f9ff;
          background-image: 
            linear-gradient(to right, #e0f2fe 1px, transparent 1px),
            linear-gradient(to bottom, #e0f2fe 1px, transparent 1px);
          background-size: 20px 20px;
          animation: moveGrid 15s linear infinite;
        }
        @keyframes moveGrid {
          0% {
            background-position: 0 0;
          }
          100% {
            background-position: 20px 20px;
          }
        }
        .frosted-glass {
          background: rgba(255, 255, 255, 0.5);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
        }
      `}</style>
      <FloatingShapes />
      <motion.header 
        style={{ opacity: headerOpacity }}
        className="fixed top-0 left-0 right-0 z-50 flex justify-between items-center p-4 frosted-glass"
      >
        <div className="flex items-center">
          <Image src="/transparentbg-medelen-logo.png" alt="Medelen Logo" width={50} height={50} className="mr-4" />
          <h1 className="text-3xl font-bold text-sky-600">Medelen</h1>
        </div>
      </motion.header>
      <HeroSection />
      <div className="relative" style={{ zIndex: 1 }}>
        <Features />
        <HowItWorks />
        <Testimonials />
        <MeetTheFounders />
        <FAQ />
      </div>
    </div>
  );
};

export default LandingPage;