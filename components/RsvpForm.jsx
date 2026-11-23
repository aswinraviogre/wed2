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

// Direct Submission Handler to Google Sheets Web App
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

      // 1. Submit directly to Google Sheets Web App
      const sheetUrl = weddingConfig.rsvpGoogleSheet?.scriptUrl || (typeof process !== 'undefined' ? process.env.NEXT_PUBLIC_GOOGLE_SHEET_URL : '');
      if (sheetUrl && sheetUrl.trim().length > 0 && !sheetUrl.includes('YOUR_GOOGLE')) {
        try {
          await fetch(sheetUrl.trim(), {
            method: 'POST',
            mode: 'no-cors',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(payload),
          });
        } catch (sheetError) {
          console.warn('Google Sheets submission handler notice:', sheetError);
        }
      }

      // 2. Save client-side in localStorage for safety and reference
      try {
        const saved = JSON.parse(localStorage.getItem('wedding_rsvps') || '[]');
        saved.unshift({ ...payload, submitted: true });
        localStorage.setItem('wedding_rsvps', JSON.stringify(saved.slice(0, 50)));
      } catch (err) {}

      // Slight natural feedback delay for smooth UX
      await new Promise((resolve) => setTimeout(resolve, 500));

      // 3. Trigger success confirmation modal
      if (onSuccessSubmission) {
        onSuccessSubmission({
          guest_name: payload.guest_name,
          attendance_status: payload.attendance_status,
          attendees_count: payload.attendees_count,
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
                  : 'bg-gradient-to-r from-maroon-deep via-maroon-temple to-maroon-deep hover:from-maroon-night hover:via-maroon-deep hover:to-maroon-night text-paper hover:shadow-[0_15px_35px_rgba(90,24,39,0.4)] border border-brass/50 transform hover:-translate-y-0.5'
              }`}
            >
              {isSubmitting ? (
                <span className="flex items-center justify-center space-x-2">
                  <Loader2 className="w-4 h-4 animate-spin text-brass" />
                  <span>Submitting RSVP...</span>
                </span>
              ) : (
                <span className="flex items-center justify-center space-x-2.5">
                  <Check className="w-5 h-5 text-brass stroke-[2.5]" />
                  <span>CONFIRM &amp; SUBMIT RSVP</span>
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
