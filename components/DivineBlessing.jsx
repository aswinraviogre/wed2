import React from 'react';

export function DivineBlessing() {
  return (
    <section
      id="divine-blessings"
      className="scroll-mt-24 py-8 sm:py-10 px-4 bg-ambient-temple flex flex-col items-center justify-center relative overflow-hidden"
    >
      {/* Subtle divine golden aura in background */}
      <div className="absolute w-48 sm:w-64 h-48 sm:h-64 rounded-full bg-brass/10 blur-[80px] pointer-events-none" />

      {/* Decorative top brass ornament separator */}
      <div className="flex items-center justify-center space-x-3 mb-4 w-full max-w-xs opacity-75 pointer-events-none">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brass to-brass-deep" />
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 rotate-45 bg-brass" />
          <div className="w-2 h-2 rotate-45 border border-brass bg-brass-soft" />
          <div className="w-1.5 h-1.5 rotate-45 bg-brass" />
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-brass to-brass-deep" />
      </div>

      {/* Sacred Divine Blessing of Lord Venkateshwara */}
      <div className="relative group flex flex-col items-center text-center px-4 my-2">
        <div className="inline-flex items-center space-x-2.5 px-5 sm:px-6 py-2.5 rounded-full bg-maroon-night/95 border border-brass/65 shadow-md backdrop-blur-md transition-all duration-300 hover:border-brass hover:shadow-[0_0_20px_rgba(201,146,47,0.35)]">
          <span className="w-1.5 h-1.5 rounded-full bg-brass-glow animate-ping" />
          <p className="text-xs sm:text-sm font-serif text-transparent bg-clip-text bg-gradient-to-r from-[#FFFDF0] via-[#FFD77D] to-[#D49E35] tracking-[0.25em] uppercase font-semibold drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
            With the Divine Blessings of Lord Venkateshwara
          </p>
          <span className="w-1.5 h-1.5 rounded-full bg-brass-glow animate-ping" />
        </div>
      </div>

      {/* Decorative bottom brass ornament separator */}
      <div className="flex items-center justify-center space-x-3 mt-4 w-full max-w-xs opacity-75 pointer-events-none">
        <div className="h-[1px] flex-1 bg-gradient-to-r from-transparent via-brass to-brass-deep" />
        <div className="flex items-center space-x-1">
          <div className="w-1.5 h-1.5 rotate-45 bg-brass" />
          <div className="w-2 h-2 rotate-45 border border-brass bg-brass-soft" />
          <div className="w-1.5 h-1.5 rotate-45 bg-brass" />
        </div>
        <div className="h-[1px] flex-1 bg-gradient-to-l from-transparent via-brass to-brass-deep" />
      </div>
    </section>
  );
}

export default DivineBlessing;
