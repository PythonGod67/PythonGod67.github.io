import React from 'react';

interface LampEffectProps {
  children: React.ReactNode;
  className?: string;
}

export const LampEffect: React.FC<LampEffectProps> = ({ children, className = '' }) => {
  return (
    <div className={`relative ${className}`}>
      <div className="absolute -inset-0.5 bg-gradient-to-r from-sky-600 to-blue-600 rounded-lg blur opacity-75 group-hover:opacity-100 transition duration-1000 group-hover:duration-200 animate-tilt"></div>
      <div className="relative">
        {children}
      </div>
    </div>
  );
};