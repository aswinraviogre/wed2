'use client';

import React, { useState, useEffect } from 'react';
import { GopuramOpening } from '../components/GopuramOpening';
import { AmbientParticles } from '../components/AmbientParticles';
import { Navbar } from '../components/Navbar';
import { Hero } from '../components/Hero';
import { ScratchToReveal } from '../components/ScratchToReveal';
import { DivineBlessing } from '../components/DivineBlessing';
import { Welcome } from '../components/Welcome';
import { EventTimeline } from '../components/EventTimeline';
import { RsvpForm } from '../components/RsvpForm';
import { SuccessModal } from '../components/SuccessModal';
import { AudioPlayer } from '../components/AudioPlayer';
import { Footer } from '../components/Footer';

export default function HomePage() {
  const [preselectedEventId, setPreselectedEventId] = useState(null);
  const [successSubmissionData, setSuccessSubmissionData] = useState(null);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isGopuramOpen, setIsGopuramOpen] = useState(true);

  // Lock body scroll when Temple Gopuram gateway is open
  useEffect(() => {
    if (isGopuramOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isGopuramOpen]);

  const handlePreselectEvent = (eventId) => {
    setPreselectedEventId(eventId);
  };

  const handleRsvpSuccess = (submissionData) => {
    setSuccessSubmissionData(submissionData);
    setIsSuccessModalOpen(true);
  };

  return (
    <div className="min-h-screen bg-[#240609] text-[#FFF6D8] flex flex-col font-sans selection:bg-[#C9922F] selection:text-[#2A0B0E] relative overflow-x-hidden">
      {/* 0. Full Immersive Wedding Background Canvas */}
      <div 
        className="fixed inset-0 z-0 pointer-events-none overflow-hidden" 
        aria-hidden="true"
      >
        <div 
          className="absolute inset-0 bg-cover bg-center sm:bg-top bg-no-repeat transition-transform duration-1000 ease-out"
          style={{ 
            backgroundImage: `url('/images/wedding-bg.jpg')`,
            backgroundColor: '#240609',
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-[#180406]/55 via-[#2A080C]/25 to-[#160405]/70" />
        <div className="absolute inset-0 shadow-[inset_0_0_120px_rgba(15,2,4,0.75)]" />
      </div>

      {/* 1. Ambient Floating Golden Embers & Jasmine Flower Petals */}
      <div className="relative z-10 pointer-events-none">
        <AmbientParticles />
      </div>

      {/* 2. South Indian Temple Tower (Gopuram) Gateway Reveal Experience */}
      <GopuramOpening
        isOpen={isGopuramOpen}
        onComplete={() => setIsGopuramOpen(false)}
        onSkip={() => setIsGopuramOpen(false)}
      />

      {/* 3. Luxury Navigation Header */}
      <Navbar onReplayGopuram={() => setIsGopuramOpen(true)} />

      <main className="flex-1 relative z-20">
        {/* 4. Hero Section with Satish Reddy & Alekhya and Live Countdown */}
        <Hero />

        {/* 4b. Interactive Scratch-to-Reveal: Couple Photo & Main Wedding Date */}
        <ScratchToReveal />

        {/* 5. Auspicious Divine Blessings Emblem */}
        <DivineBlessing />

        {/* 6. Welcome Message & Parents' Cordial Invitation */}
        <Welcome />

        {/* 7. Six Wedding Celebration Event Cards with Themed Illustrations */}
        <EventTimeline onSelectEventRsvp={handlePreselectEvent} />

        {/* 8. Pure Frontend Multi-Event RSVP Form */}
        <RsvpForm
          preselectedEventId={preselectedEventId}
          onSuccessSubmission={handleRsvpSuccess}
        />
      </main>

      {/* 9. Footer with Non-Breaking S & A Royal Seal Emblem */}
      <Footer />

      {/* 10. Success Confirmation Modal */}
      <SuccessModal
        isOpen={isSuccessModalOpen}
        onClose={() => setIsSuccessModalOpen(false)}
        submissionData={successSubmissionData}
      />

      {/* 11. Ambient Indian Wedding Instrumental Audio Player */}
      <AudioPlayer />
    </div>
  );
}
