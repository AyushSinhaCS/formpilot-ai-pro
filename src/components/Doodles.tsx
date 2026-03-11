import React from 'react';

export const DoodleArrow = ({ className }: { className?: string }) => (
  <svg className={className} width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 80 Q 50 30 80 20 M 60 20 L 80 20 L 75 40" />
  </svg>
);

export const DoodleStar = ({ className }: { className?: string }) => (
  <svg className={className} width="60" height="60" viewBox="0 0 60 60" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M30 5 C30 20 40 30 55 30 C40 30 30 40 30 55 C30 40 20 30 5 30 C20 30 30 20 30 5 Z" />
  </svg>
);

export const DoodleSwirl = ({ className }: { className?: string }) => (
  <svg className={className} width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M 20 50 C 20 20 80 20 80 50 C 80 80 20 80 20 50 C 20 35 60 35 60 50 C 60 60 40 60 40 50" />
  </svg>
);

export const DoodleZigZag = ({ className }: { className?: string }) => (
  <svg className={className} width="100" height="40" viewBox="0 0 100 40" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="5,20 20,5 35,35 50,5 65,35 80,5 95,20" />
  </svg>
);

export const DoodleCircle = ({ className }: { className?: string }) => (
  <svg className={className} width="100" height="100" viewBox="0 0 100 100" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
    <path d="M 50 10 C 80 10 90 40 80 70 C 70 90 30 90 15 70 C 0 50 10 20 40 15 C 60 10 75 25 75 45" />
  </svg>
);

export const DoodleBackground = () => (
  <div className="fixed inset-0 pointer-events-none overflow-hidden z-0 flex items-center justify-center">
    <div className="w-full max-w-7xl h-full relative opacity-60">
      <DoodleStar className="absolute top-24 left-[5%] text-gray-300 w-12 h-12 -rotate-12" />
      <DoodleSwirl className="absolute top-40 right-[8%] text-gray-300 w-24 h-24 rotate-12" />
      <DoodleZigZag className="absolute bottom-1/4 left-[10%] text-gray-300 w-20 h-8 -rotate-6" />
      <DoodleArrow className="absolute bottom-1/3 right-[12%] text-gray-300 w-16 h-16 rotate-[120deg]" />
      <DoodleCircle className="absolute top-1/3 left-[2%] text-gray-300 w-32 h-32 opacity-50" />
      <DoodleStar className="absolute bottom-20 right-[40%] text-gray-300 w-8 h-8 rotate-45" />
    </div>
  </div>
);
