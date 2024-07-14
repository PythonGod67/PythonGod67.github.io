import React, { useState, useEffect, useCallback } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import cn from 'classnames';

type FlipWordsProps = {
  words: string[];
  duration?: number;
  className?: string;
};

export const FlipWords: React.FC<FlipWordsProps> = ({ words = [], duration = 3000, className }) => {
  /*if (!Array.isArray(words) || words.length === 0) {
    console.error("The 'words' prop should be a non-empty array.");
    return null;
  }*/

  const [currentWord, setCurrentWord] = useState(words[0]);
  const [isAnimating, setIsAnimating] = useState<boolean>(false);

  const startAnimation = useCallback(() => {
    const currentIndex = words.indexOf(currentWord);
    const nextWord = currentIndex + 1 < words.length ? words[currentIndex + 1] : words[0];
    setCurrentWord(nextWord);
    setIsAnimating(true);
  }, [currentWord, words]);

  useEffect(() => {
    if (!isAnimating) {
      const timer = setTimeout(startAnimation, duration);
      return () => clearTimeout(timer);
    }
  }, [isAnimating, duration, startAnimation]);

  return (
    <AnimatePresence
      onExitComplete={() => {
        setIsAnimating(false);
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, ease: 'easeInOut', type: 'spring', stiffness: 100, damping: 10 }}
        exit={{ opacity: 0, y: -40, x: 40, filter: 'blur(8px)', scale: 2, position: 'absolute' }}
        className={cn('z-10 inline-block relative text-left text-neutral-900 dark:text-neutral-100 px-2', className)}
        key={currentWord}
      >
        {currentWord.split('').map((letter, index) => (
          <motion.span
            key={currentWord + index}
            initial={{ opacity: 0, y: 10, filter: 'blur(8px)' }}
            animate={{ opacity: 1, y: 0, filter: 'blur(0px)' }}
            transition={{ delay: index * 0.08, duration: 0.4 }}
            className="inline-block"
          >
            {letter}
          </motion.span>
        ))}
      </motion.div>
    </AnimatePresence>
  );
};