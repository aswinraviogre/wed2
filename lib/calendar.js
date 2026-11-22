/**
 * Calendar utilities for Google Calendar and downloadable .ics files
 */

// Format date to ISO compact format: YYYYMMDDTHHmmSSZ
function formatDateToIcsString(isoDateStr) {
  const d = new Date(isoDateStr);
  return d.toISOString().replace(/[-:]/g, '').replace(/\.\d{3}/, '');
}

/**
 * Generate Google Calendar URL
 */
export function createGoogleCalendarUrl(event, coupleName = 'Satish & Alekhya') {
  const startStr = formatDateToIcsString(event.startIso);
  const endStr = formatDateToIcsString(event.endIso);

  const title = encodeURIComponent(`${event.title} — ${coupleName} Wedding`);
  const details = encodeURIComponent(
    `${event.description}\n\nAttire: ${event.attire || 'Festive Indian Attire'}\n\nRSVP & Details: ${coupleName} Wedding Celebrations`
  );
  const location = encodeURIComponent(`${event.venue}, ${event.address}`);

  return `https://calendar.google.com/calendar/render?action=TEMPLATE&text=${title}&dates=${startStr}/${endStr}&details=${details}&location=${location}&ctz=America/New_York`;
}

/**
 * Generate RFC 5545 compliant ICS file and trigger browser download
 */
export function downloadIcsFile(event, coupleName = 'Satish & Alekhya') {
  const startStr = formatDateToIcsString(event.startIso);
  const endStr = formatDateToIcsString(event.endIso);
  const nowStr = formatDateToIcsString(new Date().toISOString());

  const uid = `${event.id}-2026@satish-alekhya-wedding.com`;

  const icsContent = [
    'BEGIN:VCALENDAR',
    'VERSION:2.0',
    `PRODID:-//${coupleName} Wedding//EN`,
    'CALSCALE:GREGORIAN',
    'METHOD:PUBLISH',
    'BEGIN:VEVENT',
    `UID:${uid}`,
    `DTSTAMP:${nowStr}`,
    `DTSTART:${startStr}`,
    `DTEND:${endStr}`,
    `SUMMARY:${event.title} — ${coupleName} Wedding`,
    `DESCRIPTION:${event.description.replace(/\n/g, '\\n')} (Attire: ${event.attire || 'Festive'})`,
    `LOCATION:${event.venue}, ${event.address}`,
    'STATUS:CONFIRMED',
    'END:VEVENT',
    'END:VCALENDAR',
  ].join('\r\n');

  const blob = new Blob([icsContent], { type: 'text/calendar;charset=utf-8' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.setAttribute('download', `${event.id}_satish_alekhya_wedding.ics`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  window.URL.revokeObjectURL(link.href);
}
