'use client';

import React, { useEffect } from 'react';
import { Heart, X } from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingConfig } from '../config/weddingConfig';

export function SuccessModal({ isOpen, onClose, submissionData }) {
  const { rsvpConfirmation, couple } = weddingConfig;

  useEffect(() => {
    if (isOpen) {
      try {
        confetti({
          particleCount: 90,
          spread: 80,
          origin: { y: 0.6 },
          colors: ['#C9922F', '#7B1F2B', '#FFCF5C', '#1F6B4A', '#FFF6D8'],
        });
      } catch (err) {}
    }
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-maroon-night/85 backdrop-blur-md animate-fade-in">
      <div
        className="relative w-full max-w-lg paper-cut-card bg-paper rounded-3xl p-8 sm:p-12 text-center border-2 border-brass shadow-2xl text-ink"
        role="dialog"
        aria-modal="true"
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-ink/50 hover:text-ink rounded-full hover:bg-paper-warm transition-colors cursor-pointer"
          aria-label="Close confirmation dialog"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Indian corner ornaments */}
        <div className="corner-ornament corner-tl" />
        <div className="corner-ornament corner-tr" />
        <div className="corner-ornament corner-bl" />
        <div className="corner-ornament corner-br" />

        {/* Central Icon */}
        <div className="w-16 h-16 rounded-full bg-paper-warm border-2 border-brass flex items-center justify-center mx-auto mb-6 text-maroon-deep shadow-sm">
          <Heart className="w-8 h-8 fill-maroon-temple text-maroon-temple animate-pulse" />
        </div>

        {/* Title */}
        <h3 className="font-serif text-2xl sm:text-3xl font-bold text-maroon-deep mb-2">
          {rsvpConfirmation.title}
        </h3>

        {/* Subtitle */}
        <p className="text-sm font-semibold uppercase tracking-widest text-maroon-temple mb-4">
          {rsvpConfirmation.subtitle}
        </p>

        <div className="w-16 h-0.5 bg-brass mx-auto mb-6" />

        {/* Body */}
        <p className="text-ink/85 text-base sm:text-lg leading-relaxed mb-6 font-light">
          {rsvpConfirmation.body}
        </p>

        {/* Guest acknowledgment tag */}
        {submissionData && (
          <div className="inline-block px-4 py-1.5 rounded-full bg-paper-warm border border-brass/40 text-xs text-ink/75 mb-6">
            Response recorded for <strong className="text-maroon-deep">{submissionData.guest_name}</strong>
          </div>
        )}

        {/* WhatsApp Direct Action Button (if popup was blocked or needs re-opening) */}
        {submissionData?.whatsappUrl && (
          <div className="mb-6 p-4 rounded-2xl bg-emerald-50/70 border border-emerald-300/60 max-w-sm mx-auto shadow-sm">
            <a
              href={submissionData.whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center space-x-2 w-full py-3 px-5 rounded-full bg-[#25D366] hover:bg-[#20BD5A] text-white font-bold text-xs uppercase tracking-wider shadow-md hover:shadow-lg transition-transform transform hover:-translate-y-0.5 cursor-pointer"
            >
              <svg className="w-4 h-4 fill-current shrink-0" viewBox="0 0 24 24">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.13 19.76 7.86 19.01L7.56 18.83L4.44 19.65L5.27 16.61L5.07 16.3C4.24 14.98 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.05 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.39C16.32 14.27 15.11 13.67 14.88 13.58C14.66 13.5 14.5 13.46 14.34 13.7C14.18 13.95 13.71 14.5 13.57 14.67C13.43 14.83 13.28 14.85 13.04 14.73C12.79 14.61 11.99 14.35 11.04 13.5C10.3 12.84 9.8 12.03 9.66 11.78C9.52 11.54 9.64 11.41 9.77 11.29C9.88 11.17 10.02 10.99 10.15 10.84C10.27 10.68 10.31 10.56 10.39 10.39C10.47 10.23 10.43 10.09 10.37 9.97C10.31 9.84 9.83 8.66 9.62 8.17C9.43 7.69 9.23 7.76 9.08 7.75C8.93 7.74 8.77 7.74 8.61 7.74C8.44 7.74 8.18 7.8 7.95 8.05C7.72 8.3 7.08 8.9 7.08 10.12C7.08 11.34 7.97 12.52 8.09 12.68C8.22 12.84 9.84 15.34 12.33 16.41C12.92 16.67 13.38 16.82 13.74 16.94C14.34 17.13 14.88 17.1 15.31 17.04C15.79 16.97 16.78 16.44 16.99 15.86C17.19 15.27 17.19 14.77 17.13 14.67C17.07 14.56 16.82 14.51 16.57 14.39Z" />
              </svg>
              <span>Send Message in WhatsApp</span>
            </a>
            <p className="text-[11px] text-[#144724] mt-2 font-medium">
              Sends to: <strong>{submissionData.whatsappDisplay || '+91 95731 33550'}</strong>
            </p>
          </div>
        )}

        {/* Signature */}
        <div className="font-script text-3xl sm:text-4xl text-maroon-deep mb-1">
          {couple.fullName}
        </div>
        <p className="text-xs uppercase tracking-widest text-maroon-temple font-semibold mb-8">
          With Blessings from Sandhya &amp; Jeevan Reddy and Sujatha &amp; Rajagopal Thirumala
        </p>

        <div>
          <button
            onClick={onClose}
            className="px-8 py-3 rounded-full bg-maroon-temple hover:bg-maroon-deep text-paper text-xs uppercase tracking-widest font-semibold transition-all shadow-md border border-brass/50 cursor-pointer"
          >
            Return to Invitation
          </button>
        </div>
      </div>
    </div>
  );
}

export default SuccessModal;
