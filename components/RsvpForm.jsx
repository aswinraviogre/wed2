'use client';

import React, { useState, useEffect } from 'react';
import {
  Check,
  Users,
  Mail,
  User,
  Phone,
  Utensils,
  MessageSquare,
  Sparkles,
  AlertCircle,
  Loader2,
} from 'lucide-react';
import { weddingConfig } from '../config/weddingConfig';

export function RsvpForm({ preselectedEventId, onSuccessSubmission }) {
  const { events } = weddingConfig;

  // Form State
  const [formData, setFormData] = useState({
    guest_name: '',
    guest_email: '',
    phone_number: '',
    attendance_status: 'attending', // 'attending' | 'declined'
    attendees_count: 1,
    additional_guests: '',
    selected_events: [],
    dietary_requirements: '',
    special_requests: '',
  });

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Handle external preselection from event card click
  useEffect(() => {
    if (preselectedEventId) {
      setFormData((prev) => {
        const currentEvents = new Set(prev.selected_events);
        currentEvents.add(preselectedEventId);
        return {
          ...prev,
          attendance_status: 'attending',
          selected_events: Array.from(currentEvents),
        };
      });

      // Clear event error if present
      setErrors((prev) => {
        const next = { ...prev };
        delete next.selected_events;
        return next;
      });
    }
  }, [preselectedEventId]);

  // Event Checkbox Toggle
  const toggleEvent = (eventId) => {
    setFormData((prev) => {
      const exists = prev.selected_events.includes(eventId);
      const nextEvents = exists
        ? prev.selected_events.filter((id) => id !== eventId)
        : [...prev.selected_events, eventId];

      return { ...prev, selected_events: nextEvents };
    });

    if (errors.selected_events) {
      setErrors((prev) => {
        const next = { ...prev };
        delete next.selected_events;
        return next;
      });
    }
  };

  // Form Validation
  const validateForm = () => {
    const errs = {};

    // Validate email format ONLY IF provided
    if (formData.guest_email && formData.guest_email.trim().length > 0) {
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      if (!emailRegex.test(formData.guest_email.trim())) {
        errs.guest_email = 'Please provide a valid email address.';
      }
    }

    // Optional phone validation: if provided, must match valid international pattern
    if (formData.phone_number && formData.phone_number.trim().length > 0) {
      const cleanPhone = formData.phone_number.trim();
      const phoneRegex = /^\+?[0-9\s\-().]{7,25}$/;
      const digitsOnly = cleanPhone.replace(/\D/g, '');
      if (!phoneRegex.test(cleanPhone) || digitsOnly.length < 7 || digitsOnly.length > 15) {
        errs.phone_number = 'Please enter a valid phone number (e.g. +1 (555) 123-4567).';
      }
    }

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

// Pure Frontend Submission Handler with Direct WhatsApp Route (+91 95731 33550)
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) {
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        ...formData,
        id: `rsvp-${Date.now()}`,
        guest_name: formData.guest_name.trim() || 'Valued Guest',
        guest_email: formData.guest_email.trim(),
        phone_number: formData.phone_number.trim() ? formData.phone_number.trim() : null,
        attendees_count: isAttending ? (parseInt(formData.attendees_count, 10) || 1) : 0,
        created_at: new Date().toISOString(),
      };

      // 1. Build Elegant WhatsApp Message for +91 95731 33550
      const eventsMap = new Map(events.map((evt) => [evt.id, evt]));
      const attendingEvents = (payload.selected_events || [])
        .map((id) => eventsMap.get(id))
        .filter(Boolean)
        .map((evt) => `  • ${evt.title} (${evt.dateLabel} @ ${evt.time})`);

      const msgLines = [
        '✨ *WEDDING RSVP — Satish Reddy & Alekhya* ✨',
        '-----------------------------------------',
        `👤 *Guest Name:* ${payload.guest_name}`,
        `💌 *Response:* ${isAttending ? 'Joyfully Accept ✅' : 'Regretfully Decline ❌'}`,
      ];

      if (isAttending) {
        msgLines.push(`👥 *Total Attendees:* ${payload.attendees_count}`);
        if (payload.additional_guests && payload.additional_guests.trim()) {
          msgLines.push(`📝 *Additional Guests:* ${payload.additional_guests.trim()}`);
        }
        if (payload.phone_number) {
          msgLines.push(`📞 *Phone:* ${payload.phone_number}`);
        }
        if (payload.guest_email) {
          msgLines.push(`📧 *Email:* ${payload.guest_email}`);
        }
        if (attendingEvents.length > 0) {
          msgLines.push('', `🎉 *Celebrations Attending (${attendingEvents.length}):*`);
          attendingEvents.forEach((line) => msgLines.push(line));
        } else {
          msgLines.push('', '🎉 *Celebrations Attending:* All Celebrations');
        }
        if (payload.dietary_requirements && payload.dietary_requirements.trim()) {
          msgLines.push('', `🍽️ *Dietary Preferences:* ${payload.dietary_requirements.trim()}`);
        }
      }

      if (payload.special_requests && payload.special_requests.trim()) {
        msgLines.push('', `💬 *Wishes / Message:* "${payload.special_requests.trim()}"`);
      }

      msgLines.push('', '-----------------------------------------');
      msgLines.push('💒 *Sacred Muhurtham:* Wed, Dec 23, 2026 @ 9:30 AM');
      msgLines.push('📍 *Venue:* Royal Albert\'s Palace, Fords, NJ');
      msgLines.push('Sent via Satish & Alekhya Wedding Portal');

      const whatsappText = msgLines.join('\n');
      const whatsappPhone = weddingConfig.rsvpWhatsapp?.phoneNumber || '919573133550';
      const whatsappDisplay = weddingConfig.rsvpWhatsapp?.displayNumber || '+91 95731 33550';
      const whatsappUrl = `https://api.whatsapp.com/send?phone=${whatsappPhone}&text=${encodeURIComponent(whatsappText)}`;

      // 2. Save client-side in localStorage for safety and reference
      try {
        const saved = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        saved.unshift({ ...payload, whatsappSent: true });
        localStorage.setItem('wedding_rsvps', JSON.stringify(saved.slice(0, 50)));
      } catch (err) {}

      // 3. Open WhatsApp directly in new window / tab
      if (typeof window !== 'undefined') {
        window.open(whatsappUrl, '_blank', 'noopener,noreferrer');
      }

      // Slight natural feedback delay
      await new Promise((resolve) => setTimeout(resolve, 400));

      // 4. Trigger success confirmation modal with direct link fallback
      if (onSuccessSubmission) {
        onSuccessSubmission({
          guest_name: payload.guest_name,
          attendance_status: payload.attendance_status,
          whatsappUrl,
          whatsappDisplay,
        });
      }

      // Reset form
      setFormData({
        guest_name: '',
        guest_email: '',
        phone_number: '',
        attendance_status: 'attending',
        attendees_count: 1,
        additional_guests: '',
        selected_events: [],
        dietary_requirements: '',
        special_requests: '',
      });
      setErrors({});
    } finally {
      setIsSubmitting(false);
    }
  };

  const isAttending = formData.attendance_status === 'attending';

  return (
    <section id="rsvp" className="py-24 px-4 sm:px-6 lg:px-8 bg-ambient-temple relative">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <div className="inline-flex items-center space-x-2 px-5 py-1.5 rounded-full bg-maroon-night/90 border border-brass/55 text-brass-soft text-xs font-semibold uppercase tracking-[0.2em] mb-4 shadow-sm backdrop-blur-md">
            <Sparkles className="w-3.5 h-3.5 text-brass" />
            <span>Celebrate With Us</span>
            <Sparkles className="w-3.5 h-3.5 text-brass" />
          </div>
          <h2 className="font-serif text-4xl sm:text-5xl md:text-6xl font-bold mb-3 text-transparent bg-clip-text bg-gradient-to-b from-[#FFFDF0] via-[#FFD77D] to-[#D49E35] filter drop-shadow-[0_4px_14px_rgba(0,0,0,0.9)]">
            Wedding RSVP
          </h2>
          <div className="w-20 h-0.5 bg-gradient-to-r from-transparent via-brass to-transparent mx-auto mb-4" />
          <p className="text-paper/95 text-sm sm:text-base font-light drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]">
            Kindly respond by November 2026. Please let us know which celebrations you will be attending so we can welcome you warmly in New Jersey.
          </p>
        </div>

        {/* Form Container in Paper-Cut Card Aesthetic */}
        <form
          onSubmit={handleSubmit}
          noValidate
          className="paper-cut-card rounded-3xl p-6 sm:p-10 md:p-12 relative shadow-[0_25px_60px_-15px_rgba(15,3,5,0.85),0_0_35px_rgba(201,146,47,0.18)] border border-brass/45 bg-paper text-ink"
        >
          {/* Traditional corner flourishes */}
          <div className="corner-ornament corner-tl" />
          <div className="corner-ornament corner-tr" />
          <div className="corner-ornament corner-bl" />
          <div className="corner-ornament corner-br" />

          {/* Section 1: Attendance Decision */}
          <div className="mb-10 text-center">
            <label className="block font-serif text-2xl sm:text-3xl font-bold text-maroon-deep mb-2">
              Will you be joining us for the celebrations?
            </label>
            <p className="text-xs uppercase tracking-widest text-maroon-temple font-semibold mb-6">
              Please choose your response
            </p>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-lg mx-auto">
              {/* Option A: Joyfully Accept */}
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    attendance_status: 'attending',
                    attendees_count: prev.attendees_count && Number(prev.attendees_count) > 0 ? prev.attendees_count : 1,
                  }));
                  setErrors((prev) => {
                    const next = { ...prev };
                    delete next.attendance_status;
                    return next;
                  });
                }}
                className={`flex items-center justify-center space-x-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer ${
                  isAttending
                    ? 'border-leaf bg-leaf/10 text-leaf-deep shadow-sm ring-2 ring-leaf/25'
                    : 'border-brass/30 hover:border-brass bg-paper-parchment text-ink/80'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    isAttending ? 'bg-leaf border-leaf text-white' : 'border-brass/40'
                  }`}
                >
                  {isAttending && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="font-serif text-lg font-bold">Joyfully Accept</div>
              </button>

              {/* Option B: Regretfully Decline */}
              <button
                type="button"
                onClick={() => {
                  setFormData((prev) => ({
                    ...prev,
                    attendance_status: 'declined',
                    selected_events: [],
                    attendees_count: 0,
                  }));
                  setErrors({});
                }}
                className={`flex items-center justify-center space-x-3 p-4 rounded-2xl border-2 transition-all duration-200 text-left cursor-pointer ${
                  !isAttending
                    ? 'border-maroon-temple bg-maroon-temple/10 text-maroon-deep shadow-sm ring-2 ring-maroon-temple/25'
                    : 'border-brass/30 hover:border-brass bg-paper-parchment text-ink/80'
                }`}
              >
                <div
                  className={`w-6 h-6 rounded-full flex items-center justify-center border ${
                    !isAttending ? 'bg-maroon-temple border-maroon-temple text-white' : 'border-brass/40'
                  }`}
                >
                  {!isAttending && <Check className="w-4 h-4 stroke-[3]" />}
                </div>
                <div className="font-serif text-lg font-bold">Regretfully Decline</div>
              </button>
            </div>
          </div>

          {/* Section 2: Guest Contact Information */}
          <div className="space-y-6 pt-6 border-t border-brass/25 mb-10">
            <h3 className="font-serif text-2xl font-bold text-maroon-deep">
              Guest Information
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Full Name */}
              <div>
                <label htmlFor="guest_name" className="block text-xs uppercase tracking-wider text-ink/85 font-semibold mb-2 cursor-pointer">
                  Full Name <span className="text-ink/50 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brass-deep">
                    <User className="w-4 h-4" />
                  </div>
                  <input
                    id="guest_name"
                    name="guest_name"
                    type="text"
                    autoComplete="name"
                    placeholder="e.g. Ramesh Kumar"
                    value={formData.guest_name}
                    onChange={(e) => {
                      setFormData({ ...formData, guest_name: e.target.value });
                      if (errors.guest_name) {
                        setErrors({ ...errors, guest_name: null });
                      }
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-paper-parchment focus:outline-none focus:ring-2 transition-all text-sm text-ink ${
                      errors.guest_name
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-brass/40 focus:border-brass focus:ring-brass/20'
                    }`}
                  />
                </div>
                {errors.guest_name && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 inline" />
                    <span>{errors.guest_name}</span>
                  </p>
                )}
              </div>

              {/* Email Address */}
              <div>
                <label htmlFor="guest_email" className="block text-xs uppercase tracking-wider text-ink/85 font-semibold mb-2 cursor-pointer">
                  Email Address <span className="text-ink/50 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brass-deep">
                    <Mail className="w-4 h-4" />
                  </div>
                  <input
                    id="guest_email"
                    name="guest_email"
                    type="email"
                    autoComplete="email"
                    placeholder="e.g. guest@example.com"
                    value={formData.guest_email}
                    onChange={(e) => {
                      setFormData({ ...formData, guest_email: e.target.value });
                      if (errors.guest_email) {
                        setErrors({ ...errors, guest_email: null });
                      }
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-paper-parchment focus:outline-none focus:ring-2 transition-all text-sm text-ink ${
                      errors.guest_email
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-brass/40 focus:border-brass focus:ring-brass/20'
                    }`}
                  />
                </div>
                {errors.guest_email && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 inline" />
                    <span>{errors.guest_email}</span>
                  </p>
                )}
              </div>

              {/* Phone Number */}
              <div>
                <label htmlFor="phone_number" className="block text-xs uppercase tracking-wider text-ink/85 font-semibold mb-2 cursor-pointer">
                  Phone Number <span className="text-ink/50 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brass-deep">
                    <Phone className="w-4 h-4" />
                  </div>
                  <input
                    id="phone_number"
                    name="phone_number"
                    type="tel"
                    autoComplete="tel"
                    placeholder="e.g. +1 (555) 123-4567"
                    value={formData.phone_number}
                    onChange={(e) => {
                      setFormData({ ...formData, phone_number: e.target.value });
                      if (errors.phone_number) {
                        setErrors({ ...errors, phone_number: null });
                      }
                    }}
                    className={`w-full pl-10 pr-4 py-3 rounded-xl border bg-paper-parchment focus:outline-none focus:ring-2 transition-all text-sm text-ink ${
                      errors.phone_number
                        ? 'border-red-400 focus:ring-red-200'
                        : 'border-brass/40 focus:border-brass focus:ring-brass/20'
                    }`}
                  />
                </div>
                {errors.phone_number && (
                  <p className="text-xs text-red-600 mt-1.5 flex items-center space-x-1">
                    <AlertCircle className="w-3.5 h-3.5 shrink-0 inline" />
                    <span>{errors.phone_number}</span>
                  </p>
                )}
              </div>

              {/* Number of Attendees */}
              {isAttending && (
                <div>
                  <label htmlFor="attendees_count" className="block text-xs uppercase tracking-wider text-ink/85 font-semibold mb-2 cursor-pointer">
                    Total Number of Attendees <span className="text-ink/50 font-normal">(Optional)</span>
                  </label>
                  <div className="flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => {
                        const current = parseInt(formData.attendees_count, 10) || 1;
                        const next = Math.max(1, current - 1);
                        setFormData((prev) => ({ ...prev, attendees_count: next }));
                        if (errors.attendees_count) {
                          setErrors((prev) => ({ ...prev, attendees_count: null }));
                        }
                      }}
                      className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border border-brass/50 bg-paper-parchment hover:bg-brass/20 text-maroon-deep font-bold text-xl transition-all active:scale-95 cursor-pointer shadow-xs select-none"
                      title="Decrease attendees"
                      aria-label="Decrease attendees"
                    >
                      −
                    </button>
                    <div className="relative flex-1">
                      <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brass-deep">
                        <Users className="w-4 h-4" />
                      </div>
                      <input
                        id="attendees_count"
                        name="attendees_count"
                        type="number"
                        min="1"
                        placeholder="1"
                        value={formData.attendees_count}
                        onChange={(e) => {
                          const val = e.target.value;
                          if (val === '' || /^\d+$/.test(val)) {
                            setFormData((prev) => ({ ...prev, attendees_count: val }));
                            if (errors.attendees_count) {
                              setErrors((prev) => ({ ...prev, attendees_count: null }));
                            }
                          }
                        }}
                        onBlur={() => {
                          if (!formData.attendees_count || parseInt(formData.attendees_count, 10) < 1) {
                            setFormData((prev) => ({ ...prev, attendees_count: 1 }));
                          }
                        }}
                        className="w-full pl-10 pr-4 py-3 rounded-xl border border-brass/40 bg-paper-parchment focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 transition-all text-sm font-semibold text-ink"
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => {
                        const current = parseInt(formData.attendees_count, 10) || 1;
                        const next = current + 1;
                        setFormData((prev) => ({ ...prev, attendees_count: next }));
                        if (errors.attendees_count) {
                          setErrors((prev) => ({ ...prev, attendees_count: null }));
                        }
                      }}
                      className="w-11 h-11 shrink-0 flex items-center justify-center rounded-xl border border-brass/50 bg-paper-parchment hover:bg-brass/20 text-maroon-deep font-bold text-xl transition-all active:scale-95 cursor-pointer shadow-xs select-none"
                      title="Increase attendees"
                      aria-label="Increase attendees"
                    >
                      +
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Additional Guest Names */}
            {isAttending && (
              <div>
                <label htmlFor="additional_guests" className="block text-xs uppercase tracking-wider text-ink/85 font-semibold mb-2 cursor-pointer">
                  Names of Additional Guests in Your Party <span className="text-ink/50 font-normal">(Optional)</span>
                </label>
                <input
                  id="additional_guests"
                  name="additional_guests"
                  type="text"
                  placeholder="e.g. Priya Kumar, Arjun Kumar"
                  value={formData.additional_guests}
                  onChange={(e) => setFormData({ ...formData, additional_guests: e.target.value })}
                  className="w-full px-4 py-3 rounded-xl border border-brass/40 bg-paper-parchment focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 transition-all text-sm text-ink"
                />
              </div>
            )}
          </div>

          {/* Section 3: Event Selection Checkboxes */}
          {isAttending && (
            <div className="space-y-6 pt-6 border-t border-brass/25 mb-10">
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1">
                <div>
                  <h3 className="font-serif text-2xl font-bold text-maroon-deep">
                    Select Celebrations to Attend
                  </h3>
                  <p className="text-xs text-ink/65 font-light mt-0.5">
                    Select any combination of celebrations you will be joining.
                  </p>
                </div>
                <div className="flex items-center space-x-3 mt-1 sm:mt-0">
                  <button
                    type="button"
                    onClick={() => {
                      if (formData.selected_events.length === events.length) {
                        setFormData((prev) => ({ ...prev, selected_events: [] }));
                      } else {
                        setFormData((prev) => ({ ...prev, selected_events: events.map((e) => e.id) }));
                      }
                    }}
                    className="text-xs uppercase tracking-wider font-semibold text-maroon-temple hover:text-brass-deep transition-colors underline cursor-pointer"
                  >
                    {formData.selected_events.length === events.length ? 'Clear All' : 'Select All 6 Events'}
                  </button>
                  <span className="text-xs text-maroon-temple font-semibold uppercase tracking-wider">
                    ({formData.selected_events.length} of {events.length} Selected)
                  </span>
                </div>
              </div>

              {errors.selected_events && (
                <div className="p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-700 flex items-center space-x-2">
                  <AlertCircle className="w-4 h-4 shrink-0 text-red-600" />
                  <span>{errors.selected_events}</span>
                </div>
              )}

              {/* Event Checkbox Cards */}
              <div className="space-y-3">
                {events.map((event) => {
                  const isChecked = formData.selected_events.includes(event.id);

                  return (
                    <div
                      key={event.id}
                      onClick={() => toggleEvent(event.id)}
                      className={`cursor-pointer rounded-2xl p-4 sm:p-5 border-2 transition-all duration-200 flex items-start space-x-4 ${
                        isChecked
                          ? 'border-brass bg-paper-warm shadow-xs ring-1 ring-brass/30'
                          : 'border-brass/30 hover:border-brass bg-paper-parchment/60'
                      }`}
                    >
                      {/* Checkbox box */}
                      <div
                        className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 mt-1 border transition-colors ${
                          isChecked
                            ? 'bg-maroon-deep border-maroon-deep text-brass-glow'
                            : 'border-brass/40 bg-paper'
                        }`}
                      >
                        {isChecked && <Check className="w-4 h-4 stroke-[3]" />}
                      </div>

                      <div className="flex-1">
                        <div className="flex flex-wrap items-center gap-2 mb-1">
                          <h4 className="font-serif text-lg sm:text-xl font-bold text-maroon-deep">
                            {event.eventLabel ? `${event.eventLabel}: ${event.title}` : event.title}
                          </h4>
                          {event.isMainEvent && (
                            <span className="text-[10px] uppercase font-semibold px-2 py-0.5 rounded-full bg-maroon-temple/15 text-maroon-deep border border-maroon-temple/30">
                              Main Ceremony
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-ink/75 space-y-0.5 sm:space-y-0 sm:flex sm:items-center sm:space-x-3">
                          <span className="font-semibold text-ink">{event.dateLabel}</span>
                          <span className="hidden sm:inline text-brass">•</span>
                          <span>{event.time}</span>
                          <span className="hidden sm:inline text-brass">•</span>
                          <span className="text-ink/65">{event.place || event.venue}</span>
                        </div>
                        {event.scheduleNote && (
                          <div className="text-[11px] text-maroon-temple font-medium mt-1">
                            {event.scheduleNote}
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Section 4: Dietary & Special Requests */}
          <div className="space-y-6 pt-6 border-t border-brass/25 mb-10">
            <h3 className="font-serif text-2xl font-bold text-maroon-deep">
              Preferences &amp; Message
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {/* Dietary Requirements */}
              <div>
                <label htmlFor="dietary_requirements" className="block text-xs uppercase tracking-wider text-ink/85 font-semibold mb-2 cursor-pointer">
                  Dietary Requirements <span className="text-ink/50 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-brass-deep">
                    <Utensils className="w-4 h-4" />
                  </div>
                  <input
                    id="dietary_requirements"
                    name="dietary_requirements"
                    type="text"
                    placeholder="e.g. Vegetarian, Vegan, Nut allergy, Jain food"
                    value={formData.dietary_requirements}
                    onChange={(e) => setFormData({ ...formData, dietary_requirements: e.target.value })}
                    className="w-full pl-10 pr-4 py-3 rounded-xl border border-brass/40 bg-paper-parchment focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 transition-all text-sm text-ink"
                  />
                </div>
              </div>

              {/* Special Requests or Message */}
              <div>
                <label htmlFor="special_requests" className="block text-xs uppercase tracking-wider text-ink/85 font-semibold mb-2 cursor-pointer">
                  Warm Wishes / Message for the Families <span className="text-ink/50 font-normal">(Optional)</span>
                </label>
                <div className="relative">
                  <div className="absolute top-3 left-3.5 pointer-events-none text-brass-deep">
                    <MessageSquare className="w-4 h-4" />
                  </div>
                  <textarea
                    id="special_requests"
                    name="special_requests"
                    rows={2}
                    placeholder="Share your blessings, warm wishes, or congratulations!"
                    value={formData.special_requests}
                    onChange={(e) => setFormData({ ...formData, special_requests: e.target.value })}
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-brass/40 bg-paper-parchment focus:outline-none focus:border-brass focus:ring-2 focus:ring-brass/20 transition-all text-sm text-ink resize-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Submit Action Button */}
          <div className="text-center pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full sm:w-auto min-w-[320px] px-8 py-4 rounded-full text-sm font-bold uppercase tracking-wider transition-all duration-300 shadow-temple cursor-pointer ${
                isSubmitting
                  ? 'bg-stone-300 text-stone-500 cursor-not-allowed'
                  : 'bg-gradient-to-r from-[#19592E] via-[#25D366] to-[#19592E] hover:from-[#144724] hover:via-[#20BD5A] hover:to-[#144724] text-white hover:shadow-[0_15px_35px_rgba(37,211,102,0.4)] border border-emerald-300/40 transform hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-white" />
                  <span>Opening WhatsApp...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2.5">
                  <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
                    <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.03 14.69 2 12.04 2ZM12.05 20.16C10.57 20.16 9.13 19.76 7.86 19.01L7.56 18.83L4.44 19.65L5.27 16.61L5.07 16.3C4.24 14.98 3.81 13.47 3.81 11.91C3.81 7.37 7.5 3.68 12.05 3.68C14.25 3.68 16.31 4.54 17.87 6.1C19.42 7.66 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.16 12.05 20.16ZM16.57 14.39C16.32 14.27 15.11 13.67 14.88 13.58C14.66 13.5 14.5 13.46 14.34 13.7C14.18 13.95 13.71 14.5 13.57 14.67C13.43 14.83 13.28 14.85 13.04 14.73C12.79 14.61 11.99 14.35 11.04 13.5C10.3 12.84 9.8 12.03 9.66 11.78C9.52 11.54 9.64 11.41 9.77 11.29C9.88 11.17 10.02 10.99 10.15 10.84C10.27 10.68 10.31 10.56 10.39 10.39C10.47 10.23 10.43 10.09 10.37 9.97C10.31 9.84 9.83 8.66 9.62 8.17C9.43 7.69 9.23 7.76 9.08 7.75C8.93 7.74 8.77 7.74 8.61 7.74C8.44 7.74 8.18 7.8 7.95 8.05C7.72 8.3 7.08 8.9 7.08 10.12C7.08 11.34 7.97 12.52 8.09 12.68C8.22 12.84 9.84 15.34 12.33 16.41C12.92 16.67 13.38 16.82 13.74 16.94C14.34 17.13 14.88 17.1 15.31 17.04C15.79 16.97 16.78 16.44 16.99 15.86C17.19 15.27 17.19 14.77 17.13 14.67C17.07 14.56 16.82 14.51 16.57 14.39Z" />
                  </svg>
                  <span>CONFIRM &amp; SEND RSVP VIA WHATSAPP</span>
                </span>
              )}
            </button>
          </div>
        </form>
      </div>
    </section>
  );
}

export default RsvpForm;
