'use client';

import React, { useRef, useState, useEffect, useCallback } from 'react';
import {
  Sparkles,
  Eye,
  RotateCcw,
  Calendar,
  MapPin,
  Heart,
  CalendarPlus,
  Download,
  Clock,
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { weddingConfig } from '../config/weddingConfig';
import { createGoogleCalendarUrl, downloadIcsFile } from '../lib/calendar';

export function ScratchToReveal() {
  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [isRevealed, setIsRevealed] = useState(false);
  const [percentScratched, setPercentScratched] = useState(0);

  const isScratchingRef = useRef(false);
  const lastPointRef = useRef(null);
  const isRevealedRef = useRef(false);
  const hasConfettiFiredRef = useRef(false);
  const lastCheckTimeRef = useRef(0);

  const { couple, events } = weddingConfig;
  const weddingEvent = events.find((e) => e.id === 'wedding') || events[4];

  // Paint the regal royal maroon & golden scratch foil
  const drawFoil = useCallback((canvas, ctx) => {
    const rect = canvas.getBoundingClientRect();
    if (!rect.width || !rect.height) return;

    const dpr = typeof window !== 'undefined' ? window.devicePixelRatio || 1 : 1;

    canvas.width = rect.width * dpr;
    canvas.height = rect.height * dpr;
    ctx.scale(dpr, dpr);

    const w = rect.width;
    const h = rect.height;

    // Reset composite operation to paint the foil
    ctx.globalCompositeOperation = 'source-over';

    // 1. Rich Royal Maroon Base with Shimmering Metallic Gold Gradient
    const grad = ctx.createLinearGradient(0, 0, w, h);
    grad.addColorStop(0, '#4A0E17');     // Royal maroon
    grad.addColorStop(0.25, '#6D1926');  // Deep temple crimson
    grad.addColorStop(0.48, '#C9922F');  // Antique gold leaf shimmer
    grad.addColorStop(0.52, '#FFDF73');  // Bright gold highlight streak
    grad.addColorStop(0.56, '#C9922F');  // Antique gold
    grad.addColorStop(0.8, '#6D1926');   // Deep temple crimson
    grad.addColorStop(1, '#33080E');     // Deep night maroon
    ctx.fillStyle = grad;
    ctx.fillRect(0, 0, w, h);

    // 1b. Subtle diagonal golden shimmer lines
    ctx.strokeStyle = 'rgba(255, 215, 125, 0.12)';
    ctx.lineWidth = 1;
    for (let i = -h; i < w + h; i += 28) {
      ctx.beginPath();
      ctx.moveTo(i, 0);
      ctx.lineTo(i + h, h);
      ctx.stroke();
    }

    // 2. Ornate Traditional South Indian Gold Frame Border
    ctx.strokeStyle = '#FFD77D';
    ctx.lineWidth = 3;
    ctx.strokeRect(12, 12, w - 24, h - 24);

    ctx.strokeStyle = 'rgba(201, 146, 47, 0.65)';
    ctx.lineWidth = 1.5;
    ctx.strokeRect(18, 18, w - 36, h - 36);

    // Corner Medallions
    const drawCornerMedallion = (cx, cy) => {
      ctx.fillStyle = '#FFD77D';
      ctx.beginPath();
      ctx.arc(cx, cy, 5.5, 0, Math.PI * 2);
      ctx.fill();
      ctx.strokeStyle = '#2A080C';
      ctx.lineWidth = 1.5;
      ctx.stroke();

      ctx.fillStyle = '#C9922F';
      ctx.beginPath();
      ctx.arc(cx, cy, 2.5, 0, Math.PI * 2);
      ctx.fill();
    };

    drawCornerMedallion(18, 18);
    drawCornerMedallion(w - 18, 18);
    drawCornerMedallion(18, h - 18);
    drawCornerMedallion(w - 18, h - 18);

    // Center calculations
    const centerX = w / 2;
    const centerY = h / 2;

    // 3. Top Auspicious Inscription
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.font = '600 11px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#FFD77D';
    ctx.letterSpacing = '2px';
    ctx.fillText('॥ SRI GANESHAYA NAMAHA • SHUBH VIVAH ॥', centerX, 36);

    // 4. Center Monogram Crest
    const crestRadius = Math.min(38, Math.max(30, h * 0.08));
    const crestY = centerY - 46;

    const circleGrad = ctx.createRadialGradient(centerX, crestY, 8, centerX, crestY, crestRadius + 6);
    circleGrad.addColorStop(0, '#FFD77D');
    circleGrad.addColorStop(0.5, '#C9922F');
    circleGrad.addColorStop(1, '#2A080C');

    ctx.fillStyle = circleGrad;
    ctx.beginPath();
    ctx.arc(centerX, crestY, crestRadius + 5, 0, Math.PI * 2);
    ctx.fill();

    ctx.fillStyle = '#220508';
    ctx.beginPath();
    ctx.arc(centerX, crestY, crestRadius, 0, Math.PI * 2);
    ctx.fill();

    ctx.strokeStyle = '#FFD77D';
    ctx.lineWidth = 2;
    ctx.stroke();

    ctx.font = 'bold 18px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#FFD77D';
    ctx.fillText('S & A', centerX, crestY);

    // 5. Main Scratch Callout Typography
    ctx.font = 'bold 18px "Cinzel", Georgia, serif';
    ctx.fillStyle = '#FFFDF0';
    ctx.shadowColor = 'rgba(0, 0, 0, 0.85)';
    ctx.shadowBlur = 8;
    ctx.fillText('✨ SCRATCH TO REVEAL ✨', centerX, centerY + 18);

    ctx.font = '600 12px "Karla", sans-serif';
    ctx.fillStyle = '#FFD77D';
    ctx.shadowBlur = 4;
    ctx.fillText('Main Wedding Date & Couple Photo', centerX, centerY + 42);

    ctx.font = 'italic 11px Georgia, serif';
    ctx.fillStyle = '#FFF6D8';
    ctx.shadowBlur = 0;
    ctx.fillText('(Rub quickly with finger or mouse to scratch)', centerX, centerY + 64);

    // 6. Bottom Auspicious Couple Banner
    ctx.font = 'bold 12px "Cinzel", Georgia, serif';
    ctx.fillStyle = 'rgba(255, 215, 125, 0.8)';
    ctx.fillText('Satish Reddy  weds  Alekhya', centerX, h - 32);
  }, []);

  // Initialize canvas
  const initCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    isRevealedRef.current = false;
    hasConfettiFiredRef.current = false;
    setIsRevealed(false);
    setPercentScratched(0);

    drawFoil(canvas, ctx);
  }, [drawFoil]);

  // Handle Resize and Container Observer
  useEffect(() => {
    const timer = setTimeout(() => {
      initCanvas();
    }, 80);

    const handleResize = () => {
      if (!isRevealedRef.current) {
        initCanvas();
      }
    };

    window.addEventListener('resize', handleResize);

    // Observe container size to ensure exact fit
    let observer;
    if (typeof ResizeObserver !== 'undefined' && containerRef.current) {
      observer = new ResizeObserver(() => {
        if (!isRevealedRef.current) {
          initCanvas();
        }
      });
      observer.observe(containerRef.current);
    }

    return () => {
      clearTimeout(timer);
      window.removeEventListener('resize', handleResize);
      if (observer) observer.disconnect();
    };
  }, [initCanvas]);

  // Fire celebratory wedding confetti
  const fireConfetti = useCallback(() => {
    if (hasConfettiFiredRef.current) return;
    hasConfettiFiredRef.current = true;

    try {
      confetti({
        particleCount: 110,
        spread: 90,
        origin: { y: 0.6 },
        colors: ['#FFD77D', '#C9922F', '#8B202E', '#FFF6D8', '#FFFFFF', '#D49E35'],
      });

      setTimeout(() => {
        confetti({
          particleCount: 60,
          angle: 60,
          spread: 55,
          origin: { x: 0.2, y: 0.65 },
          colors: ['#FFD77D', '#C9922F', '#FFFDF0'],
        });
        confetti({
          particleCount: 60,
          angle: 120,
          spread: 55,
          origin: { x: 0.8, y: 0.65 },
          colors: ['#FFD77D', '#C9922F', '#FFFDF0'],
        });
      }, 250);
    } catch (e) {
      // Failsafe
    }
  }, []);

  // Calculate percentage scratched to trigger auto-reveal
  const checkScratchPercentage = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealedRef.current) return 0;
    const ctx = canvas.getContext('2d');
    if (!ctx) return 0;

    try {
      const imgData = ctx.getImageData(0, 0, canvas.width, canvas.height);
      const data = imgData.data;
      let transparentPixels = 0;
      const totalPixels = data.length / 4;
      const step = 64; // High-performance sample step for 60fps responsiveness

      for (let i = 3; i < data.length; i += step * 4) {
        if (data[i] < 128) {
          transparentPixels++;
        }
      }

      const percent = Math.round((transparentPixels / (totalPixels / step)) * 100);
      setPercentScratched(percent);

      // Fast auto-reveal trigger at 22% threshold
      if (percent >= 22 && !isRevealedRef.current) {
        isRevealedRef.current = true;
        setIsRevealed(true);
        setPercentScratched(100);
        fireConfetti();
      }

      return percent;
    } catch (err) {
      return 0;
    }
  }, [fireConfetti]);

  // Throttled percentage checker to keep scratching silky smooth without GPU lock
  const throttledCheck = useCallback(() => {
    const now = Date.now();
    if (now - lastCheckTimeRef.current > 100) {
      lastCheckTimeRef.current = now;
      checkScratchPercentage();
    }
  }, [checkScratchPercentage]);

  // Scratch stroke drawing helper with wider brush for fast scratching
  const scratch = useCallback((clientX, clientY) => {
    const canvas = canvasRef.current;
    if (!canvas || isRevealedRef.current) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = clientX - rect.left;
    const y = clientY - rect.top;

    // Generous wide brush size (68px on mobile, 88px on desktop) for rapid fast reveal
    const isMobile = typeof window !== 'undefined' && window.innerWidth < 640;
    const brushSize = isMobile ? 68 : 88;

    ctx.globalCompositeOperation = 'destination-out';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';

    if (lastPointRef.current) {
      ctx.beginPath();
      ctx.moveTo(lastPointRef.current.x, lastPointRef.current.y);
      ctx.lineTo(x, y);
      ctx.stroke();
    } else {
      ctx.beginPath();
      ctx.arc(x, y, brushSize / 2, 0, Math.PI * 2);
      ctx.fill();
    }

    lastPointRef.current = { x, y };
  }, []);

  // Mouse Scratch Handlers
  const handleMouseDown = (e) => {
    if (isRevealed) return;
    isScratchingRef.current = true;
    scratch(e.clientX, e.clientY);
  };

  const handleMouseMove = (e) => {
    if (!isScratchingRef.current || isRevealed) return;
    scratch(e.clientX, e.clientY);
    throttledCheck();
  };

  const handleMouseUp = () => {
    isScratchingRef.current = false;
    lastPointRef.current = null;
    checkScratchPercentage();
  };

  // Touch Scratch Handlers with non-passive touchmove for accurate swipe tracking
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleTouchStart = (e) => {
      if (isRevealedRef.current || e.touches.length === 0) return;
      isScratchingRef.current = true;
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
    };

    const handleTouchMove = (e) => {
      if (!isScratchingRef.current || isRevealedRef.current || e.touches.length === 0) return;
      if (e.cancelable) e.preventDefault();
      const touch = e.touches[0];
      scratch(touch.clientX, touch.clientY);
      throttledCheck();
    };

    const handleTouchEnd = () => {
      isScratchingRef.current = false;
      lastPointRef.current = null;
      checkScratchPercentage();
    };

    canvas.addEventListener('touchstart', handleTouchStart, { passive: true });
    canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
    canvas.addEventListener('touchend', handleTouchEnd, { passive: true });

    return () => {
      canvas.removeEventListener('touchstart', handleTouchStart);
      canvas.removeEventListener('touchmove', handleTouchMove);
      canvas.removeEventListener('touchend', handleTouchEnd);
    };
  }, [scratch, throttledCheck, checkScratchPercentage]);

  // Instant full reveal button
  const handleRevealInstantly = () => {
    if (isRevealedRef.current) return;
    isRevealedRef.current = true;
    setIsRevealed(true);
    setPercentScratched(100);
    fireConfetti();
  };

  // Google Calendar URL
  const gcalUrl = createGoogleCalendarUrl(weddingEvent, couple.fullName);

  return (
    <section id="scratch-reveal" className="py-12 sm:py-16 px-4 sm:px-6 lg:px-8 bg-ambient-temple relative">
      <div className="max-w-4xl mx-auto text-center">
        {/* Section Header */}
        <div className="inline-flex items-center space-x-2 px-4 py-1 rounded-full bg-maroon-night/90 border border-brass/55 text-brass-soft text-xs font-semibold uppercase tracking-[0.22em] mb-3 shadow-sm backdrop-blur-md">
          <Sparkles className="w-3.5 h-3.5 text-brass" />
          <span>Interactive Wedding Reveal</span>
          <Sparkles className="w-3.5 h-3.5 text-brass" />
        </div>

        <h2 className="font-serif text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight mb-1 text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#FFD77D] to-[#D49E35] filter drop-shadow-[0_4px_16px_rgba(0,0,0,0.9)]">
          Scratch to Reveal
        </h2>
        <p className="font-serif italic text-[#FFCF5C] text-sm sm:text-base mb-6">
          Our Main Wedding Date &amp; Couple Photo
        </p>

        {/* Scratch Card Outer Wrapper: Designed to be fully visible on screen */}
        <div
          ref={containerRef}
          className="relative max-w-lg md:max-w-3xl mx-auto rounded-3xl overflow-hidden border-2 border-brass/90 shadow-[0_20px_60px_-15px_rgba(15,3,5,0.9),0_0_40px_rgba(201,146,47,0.35)] bg-gradient-to-b from-[#1C0508] via-[#2A080C] to-[#120204]"
        >
          {/* UNDERNEATH LAYER: The Revealed Couple Image & Wedding Date */}
          <div className="relative w-full p-4 sm:p-6 text-center select-none flex flex-col items-center">
            {/* 1. Auspicious Blessing Header */}
            <div className="inline-flex items-center space-x-1.5 px-3.5 py-1 rounded-full bg-[#180306]/95 border border-brass/70 backdrop-blur-md shadow-xs mb-4">
              <Heart className="w-3 h-3 text-brass-glow fill-brass-glow animate-pulse" />
              <span className="text-[10px] sm:text-[11px] font-serif text-[#FFD77D] tracking-[0.2em] uppercase font-bold">
                ॥ Sri Ganeshaya Namaha • Shubh Vivah ॥
              </span>
              <Heart className="w-3 h-3 text-brass-glow fill-brass-glow animate-pulse" />
            </div>

            {/* 2. Responsive 2-Column Layout on md+ so entire card fits on screen without scrolling */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 items-center w-full">
              {/* Left: Revealed Couple Photo */}
              <div className="relative w-full max-w-[280px] sm:max-w-xs mx-auto rounded-2xl overflow-hidden border-2 border-brass/85 shadow-[0_12px_35px_rgba(0,0,0,0.85)] group">
                <img
                  src="/images/couple.jpg"
                  alt="Satish Reddy & Alekhya"
                  onLoad={initCanvas}
                  className="w-full h-56 sm:h-64 md:h-80 object-cover object-top transition-transform duration-700 group-hover:scale-105"
                />

                <div className="absolute inset-0 ring-1 ring-inset ring-brass/40 rounded-2xl pointer-events-none" />
                <div className="absolute bottom-0 inset-x-0 h-14 bg-gradient-to-t from-[#140305]/95 via-[#140305]/50 to-transparent pointer-events-none" />

                <div className="absolute bottom-2.5 inset-x-0 flex items-center justify-center">
                  <span className="bg-[#140305]/90 border border-brass/70 text-[#FFD77D] text-[10px] font-serif tracking-[0.2em] uppercase px-3 py-0.5 rounded-full shadow-md backdrop-blur-md">
                    Together in Love
                  </span>
                </div>
              </div>

              {/* Right: Sacred Wedding Ceremony Details */}
              <div className="flex flex-col justify-center text-center md:text-left space-y-3 px-1 sm:px-2">
                <div>
                  <span className="text-[11px] font-serif text-[#FFCF5C] uppercase tracking-[0.22em] font-medium">
                    The Sacred Union
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#FFD77D] to-[#D49E35] filter drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)]">
                    Satish Reddy &amp; Alekhya
                  </h3>
                </div>

                {/* Wedding Date & Muhurtham Box */}
                <div className="bg-[#180306]/90 border border-brass/75 rounded-2xl p-3.5 sm:p-4 shadow-xl backdrop-blur-md">
                  <div className="flex items-center justify-center md:justify-start space-x-2 text-xs uppercase tracking-wider font-semibold text-[#FFD77D] mb-1">
                    <Calendar className="w-4 h-4 text-brass shrink-0" />
                    <span className="font-bold">Wednesday, December 23, 2026</span>
                  </div>

                  <div className="inline-flex items-center space-x-1.5 px-3 py-1 rounded-full bg-maroon-night/90 border border-brass/50 text-xs font-bold text-[#FFD77D] tracking-wider uppercase my-1.5">
                    <Clock className="w-3.5 h-3.5 text-brass shrink-0" />
                    <span>Sacred Muhurtham: 9:30 AM (ET)</span>
                  </div>

                  <div className="pt-2.5 mt-2 border-t border-brass/30 flex items-center justify-center md:justify-start space-x-1.5 text-xs text-[#FFF6D8]/95">
                    <MapPin className="w-3.5 h-3.5 text-brass shrink-0" />
                    <span className="font-medium text-[11px] sm:text-xs">Royal Albert's Palace, Fords, NJ</span>
                  </div>
                </div>

                {/* Action Buttons for Revealed Card */}
                <div className="flex flex-wrap items-center justify-center md:justify-start gap-2 pt-1">
                  <a
                    href={gcalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-brass/65 hover:border-brass bg-[#180306] hover:bg-brass/25 text-[#FFF6D8] text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  >
                    <CalendarPlus className="w-3.5 h-3.5 text-brass" />
                    <span>Google Cal</span>
                  </a>

                  <button
                    type="button"
                    onClick={() => downloadIcsFile(weddingEvent, couple.fullName)}
                    className="inline-flex items-center space-x-1.5 px-3.5 py-1.5 rounded-full border border-brass/65 hover:border-brass bg-[#180306] hover:bg-brass/25 text-[#FFF6D8] text-[11px] font-semibold uppercase tracking-wider transition-colors shadow-sm cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-brass" />
                    <span>.ICS</span>
                  </button>

                  <a
                    href="#rsvp"
                    className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-gradient-to-r from-maroon-temple via-[#912433] to-maroon-temple hover:from-maroon-royal hover:to-maroon-deep text-[#FFFDF8] text-[11px] font-bold uppercase tracking-wider transition-all shadow-md hover:shadow-luxury-hover border border-brass/70 cursor-pointer"
                  >
                    <span>RSVP for Wedding</span>
                  </a>
                </div>
              </div>
            </div>
          </div>

          {/* TOP LAYER: Interactive Scratch Foil Canvas */}
          <canvas
            ref={canvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onMouseLeave={handleMouseUp}
            className={`absolute inset-0 w-full h-full z-20 touch-none cursor-pointer transition-opacity duration-700 ${
              isRevealed ? 'opacity-0 pointer-events-none' : 'opacity-100'
            }`}
            style={{ touchAction: 'none' }}
          />
        </div>

        {/* Scratch Progress & Controls */}
        <div className="mt-5 flex flex-wrap items-center justify-center gap-3">
          {!isRevealed ? (
            <>
              <button
                type="button"
                onClick={handleRevealInstantly}
                className="inline-flex items-center space-x-2 px-5 py-2 rounded-full bg-gradient-to-r from-maroon-temple via-[#8B202E] to-maroon-temple hover:from-maroon-royal hover:to-maroon-deep text-paper text-xs uppercase tracking-wider font-bold transition-all shadow-md hover:shadow-luxury-hover border border-brass/70 cursor-pointer transform hover:-translate-y-0.5"
              >
                <Eye className="w-4 h-4 text-brass-glow" />
                <span>Reveal Instantly</span>
              </button>

              {percentScratched > 0 && (
                <div className="text-xs text-brass-soft font-semibold px-4 py-1 rounded-full bg-[#1A0407] border border-brass/50 shadow-xs">
                  {percentScratched}% Scratched
                </div>
              )}
            </>
          ) : (
            <div className="flex items-center space-x-3 animate-fade-in">
              <span className="text-xs font-semibold text-emerald-400 bg-emerald-950/85 px-4 py-1.5 rounded-full border border-emerald-500/50 flex items-center space-x-1.5 shadow-md">
                <span>✨</span>
                <span>Date &amp; Couple Revealed!</span>
              </span>

              <button
                type="button"
                onClick={initCanvas}
                className="inline-flex items-center space-x-1.5 px-4 py-1.5 rounded-full bg-[#180306] hover:bg-maroon-deep text-paper text-xs uppercase tracking-wider font-semibold border border-brass/70 transition-colors shadow-sm cursor-pointer"
                title="Scratch card again"
              >
                <RotateCcw className="w-3.5 h-3.5 text-brass" />
                <span>Scratch Again</span>
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}

export default ScratchToReveal;
