import React from 'react';
import { Sparkles } from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';

export function Welcome() {
  const { welcome, couple } = weddingConfig;

  return (
    <section id="welcome" className="py-20 sm:py-28 px-4 sm:px-6 lg:px-8 bg-ambient-temple relative">
      <div className="max-w-6xl mx-auto">
        {/* Feathered Royal Background Welcome Card */}
        <div className="relative rounded-3xl p-6 sm:p-10 lg:p-12 overflow-hidden bg-gradient-to-br from-[#1C0508]/85 via-[#26080D]/80 to-[#180406]/90 backdrop-blur-md border border-brass/35 shadow-[0_0_50px_15px_rgba(18,3,6,0.65),0_20px_50px_rgba(10,2,4,0.75)] transition-all duration-500">
          {/* Soft inner radial vignette feathering */}
          <div className="absolute inset-0 bg-radial from-transparent via-[#1A0407]/15 to-[#120204]/50 pointer-events-none rounded-3xl" />

          {/* Ornamental Indian corner flourishes */}
          <div className="corner-ornament corner-tl" />
          <div className="corner-ornament corner-tr" />
          <div className="corner-ornament corner-bl" />
          <div className="corner-ornament corner-br" />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center relative z-10">
            {/* Royal Parents' Invitation Arch Card */}
            <div className="lg:col-span-5 flex justify-center">
              <div className="relative group max-w-sm w-full">
                {/* Ornate Brass Frame with Arch Top */}
                <div className="relative rounded-t-[140px] rounded-b-2xl overflow-hidden border-2 border-brass/80 p-2.5 bg-gradient-to-b from-brass-soft via-brass to-brass-deep shadow-[0_15px_35px_rgba(20,3,5,0.6)]">
                  <div className="rounded-t-[132px] rounded-b-xl overflow-hidden min-h-[420px] relative bg-gradient-to-b from-[#2A080C] via-[#1F0407] to-[#140204] p-6 flex flex-col items-center justify-between text-center border border-brass/40">
                    {/* Background Subtle Watermark */}
                    <div 
                      className="absolute inset-0 bg-cover bg-center opacity-10 pointer-events-none"
                      style={{ backgroundImage: `url('/images/hero-flatlay.jpg')` }}
                    />
                    
                    {/* Top Auspicious Seal */}
                    <div className="relative z-10 pt-4">
                      <div className="inline-flex items-center space-x-1 px-3 py-1 rounded-full bg-maroon-deep/90 border border-brass/60 shadow-xs mb-3">
                        <span className="text-[10px] font-serif text-brass-glow tracking-[0.2em] uppercase font-semibold">
                          ॥ Sri Ganeshaya Namaha ॥
                        </span>
                      </div>
                      
                      <div className="w-14 h-14 rounded-full border border-brass/80 bg-gradient-to-tr from-maroon-deep via-maroon-rich to-maroon-deep mx-auto flex items-center justify-center shadow-md my-2">
                        <span className="font-serif text-lg font-bold text-brass-glow tracking-wider">
                          {couple.monogram}
                        </span>
                      </div>
                    </div>

                    {/* Parents Invitation Body */}
                    <div className="relative z-10 py-3 space-y-3">
                      <div>
                        <span className="text-[10px] uppercase tracking-[0.25em] text-[#FFCF5C] font-semibold block mb-1">
                          Cordially Invited By
                        </span>
                        <div className="text-sm font-serif font-bold text-[#FFFDF0] tracking-wide">
                          {couple.groomParents}
                        </div>
                        <span className="text-[10px] text-brass-soft/80 italic block">
                          (Parents of the Groom)
                        </span>
                      </div>

                      <div className="flex items-center justify-center my-1">
                        <span className="w-8 h-[1px] bg-gradient-to-r from-transparent via-brass to-transparent mr-2" />
                        <span className="text-xs font-serif text-brass-soft">&amp;</span>
                        <span className="w-8 h-[1px] bg-gradient-to-l from-transparent via-brass to-transparent ml-2" />
                      </div>

                      <div>
                        <div className="text-sm font-serif font-bold text-[#FFFDF0] tracking-wide">
                          {couple.brideParents}
                        </div>
                        <span className="text-[10px] text-brass-soft/80 italic block">
                          (Parents of the Bride)
                        </span>
                      </div>

                      <div className="pt-2 border-t border-brass/25">
                        <span className="text-[10px] uppercase tracking-[0.2em] text-[#FFD77D] font-medium block">
                          For the wedding of
                        </span>
                        <h3 className="font-serif text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#FFD77D] to-[#D49E35] mt-1">
                          {couple.fullName}
                        </h3>
                      </div>
                    </div>

                    {/* Bottom Venue / Date Tag */}
                    <div className="relative z-10 pb-2 border-t border-brass/25 pt-2 w-full">
                      <span className="text-[10px] uppercase tracking-widest text-[#FFCF5C] font-semibold block">
                        Muhurtham: Dec 23, 2026 • 9:30 AM
                      </span>
                      <span className="text-[10px] text-[#FFF6D8]/80 block">
                        Royal Albert's Palace • Fords, NJ
                      </span>
                    </div>
                  </div>
                </div>

                {/* Floating Brass Monogram Badge */}
                <div className="absolute -bottom-3.5 left-1/2 -translate-x-1/2 bg-[#160305]/95 backdrop-blur-md px-5 py-1.5 rounded-full border border-brass/80 shadow-md whitespace-nowrap z-10">
                  <span className="font-serif text-xs uppercase tracking-[0.25em] font-bold text-[#FFD77D]">
                    {couple.fullName}
                  </span>
                </div>
              </div>
            </div>

            {/* Welcome Text Content in Radiant Gold & Warm Ivory */}
            <div className="lg:col-span-7 text-center lg:text-left pt-6 lg:pt-0">
              {/* Central Top Motif */}
              <div className="flex justify-center lg:justify-start mb-4">
                <div className="w-10 h-10 rounded-full border border-brass/50 flex items-center justify-center bg-[#24060A]/85 shadow-xs">
                  <Sparkles className="w-5 h-5 text-[#FFD77D]" />
                </div>
              </div>

              <span className="text-xs uppercase tracking-[0.3em] text-[#FFD77D] font-semibold block mb-2 drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                {welcome.subtitle}
              </span>

              <h2 className="font-serif text-3xl sm:text-4xl md:text-5xl font-bold mb-4 leading-tight text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#FFD77D] to-[#D49E35] filter drop-shadow-[0_2px_10px_rgba(0,0,0,0.85)]">
                {welcome.title}
              </h2>

              <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-brass to-transparent mb-6 mx-auto lg:mx-0" />

              {/* Welcome Message */}
              <div className="space-y-4 font-sans text-base sm:text-lg leading-relaxed">
                <p className="italic font-serif text-[#FFE29A] text-lg sm:text-xl md:text-2xl leading-relaxed drop-shadow-[0_1px_4px_rgba(0,0,0,0.8)]">
                  "With the blessings of our parents and elders, and the love of those closest to our hearts, we invite you to celebrate the holy union of Satish Reddy &amp; Alekhya."
                </p>
                <p className="text-[#FFF6D8]/90 leading-relaxed font-light text-sm sm:text-base drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                  Together with their families, <strong>Sandhya &amp; Jeevan Reddy Sadhu</strong> and <strong>Sujatha &amp; Rajagopalacharyulu Thirumala</strong> warmly request the pleasure of your gracious company as our children begin their sacred journey of marriage.
                </p>
                <p className="text-[#FFF6D8]/90 leading-relaxed font-light text-sm sm:text-base drop-shadow-[0_1px_4px_rgba(0,0,0,0.7)]">
                  From traditional pre-wedding ceremonies at our residence in Avenel to the sacred wedding Muhurtham and grand reception at Royal Albert's Palace in Fords, New Jersey, your presence will make our celebrations truly unforgettable.
                </p>
              </div>

              {/* Couple's Calligraphy Signature */}
              <div className="mt-8 pt-6 border-t border-brass/30 flex flex-col items-center lg:items-start">
                <div className="font-script text-3xl sm:text-4xl text-[#FFD77D] drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
                  Satish &amp; Alekhya
                </div>
                <div className="flex items-center space-x-2 mt-2 text-xs uppercase tracking-widest text-[#FFF6D8]/75">
                  <span>Royal Albert's Palace</span>
                  <span className="text-brass">•</span>
                  <span>Fords &amp; Avenel</span>
                  <span className="text-brass">•</span>
                  <span>New Jersey</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default Welcome;
