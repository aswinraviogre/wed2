/**
 * =========================================================================
 * WEDDING RSVP GOOGLE APPS SCRIPT
 * Couple: Satish Reddy & Alekhya
 * Wedding Dates: December 21–23, 2026
 * =========================================================================
 * 
 * Instructions:
 * 1. Open Google Sheets (https://sheets.new)
 * 2. Click Extensions > Apps Script
 * 3. Replace all code in Code.gs with this script
 * 4. Select "setup" from the dropdown and click "Run" (authorize when prompted)
 * 5. Click Deploy > New deployment > Web app
 *    - Execute as: Me
 *    - Who has access: Anyone
 * 6. Copy the Web App URL and paste it into config/weddingConfig.js -> rsvpGoogleSheet.scriptUrl
 */

// Target Sheet Tab Name
const SHEET_NAME = 'RSVP Responses';

// Defined Headers matching RsvpForm.jsx fields exactly
const HEADERS = [
  'Timestamp',
  'Guest Name',
  'Status',
  'Total Guests',
  'Accompanying Guests',
  'Phone Number',
  'Email Address',
  'Attending Events',
  'Dietary Preferences',
  'Wishes & Blessings',
  'RSVP ID'
];

// Mapping event IDs to human-readable celebration titles
const EVENT_NAMES = {
  'mehendi': '1. Mehandi (Dec 21, 6:00 PM)',
  'haldi': '2. Haldi (Dec 22, 10:00 AM)',
  'bride_ceremony': '3. Bride Ceremony (Dec 22, 5:00 PM)',
  'groom_ceremony': '4. Groom Ceremony (Dec 22, 6:30 PM)',
  'wedding': '5. Sacred Wedding Muhurtham (Dec 23, 9:30 AM)',
  'reception': '6. Grand Reception (Dec 23, 7:00 PM)'
};

/**
 * 1. ONE-CLICK INITIAL SETUP FUNCTION
 * Run this from the Apps Script editor toolbar to set up sheet headers & styling.
 */
function setup() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  let sheet = ss.getSheetByName(SHEET_NAME);
  
  if (!sheet) {
    sheet = ss.getActiveSheet();
    sheet.setName(SHEET_NAME);
  }

  initializeHeaders(sheet);
  SpreadsheetApp.flush();
  Logger.log('✅ Setup completed successfully! Headers created and styled.');
}

/**
 * Internal helper to create and format header row
 */
function initializeHeaders(sheet) {
  // Ensure enough columns
  if (sheet.getMaxColumns() < HEADERS.length) {
    sheet.insertColumnsAfter(sheet.getMaxColumns(), HEADERS.length - sheet.getMaxColumns());
  }

  // Set header row values
  const headerRange = sheet.getRange(1, 1, 1, HEADERS.length);
  headerRange.setValues([HEADERS]);

  // Apply elegant styling (Royal Maroon & Warm Gold wedding palette)
  headerRange
    .setBackground('#5A1827') // Royal Maroon
    .setFontColor('#FFD77D')  // Warm Gold
    .setFontWeight('bold')
    .setFontFamily('Arial')
    .setFontSize(11)
    .setHorizontalAlignment('center')
    .setVerticalAlignment('middle')
    .setWrap(true);

  sheet.setRowHeight(1, 40);
  sheet.setFrozenRows(1);

  // Set optimal column widths
  const columnWidths = [
    180, // Timestamp
    200, // Guest Name
    130, // Status
    100, // Total Guests
    220, // Accompanying Guests
    160, // Phone Number
    220, // Email Address
    300, // Attending Events
    200, // Dietary Preferences
    320, // Wishes & Blessings
    180  // RSVP ID
  ];

  columnWidths.forEach((width, index) => {
    sheet.setColumnWidth(index + 1, width);
  });
}

/**
 * 2. POST WEBHOOK HANDLER
 * Receives RSVP data when guests submit the form on your website.
 */
function doPost(e) {
  // Concurrency lock to prevent simultaneous submissions from colliding
  const lock = LockService.getScriptLock();
  
  try {
    // Wait up to 30 seconds for concurrent submissions
    lock.waitLock(30000);

    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME);
    if (!sheet) {
      sheet = ss.getActiveSheet();
      sheet.setName(SHEET_NAME);
    }

    // Auto-create headers if sheet is empty or row 1 is blank
    if (sheet.getLastRow() === 0 || sheet.getRange(1, 1).getValue() === '') {
      initializeHeaders(sheet);
    }

    // Parse incoming data (handles raw JSON or form-urlencoded payload)
    let data = {};
    if (e && e.postData && e.postData.contents) {
      try {
        data = JSON.parse(e.postData.contents);
      } catch (parseErr) {
        data = e.parameter || {};
      }
    } else if (e && e.parameter) {
      data = e.parameter;
    }

    // Extract and sanitize fields matching RsvpForm.jsx
    const guestName = (data.guest_name || 'Valued Guest').toString().trim();
    const statusRaw = (data.attendance_status || 'attending').toString().trim().toLowerCase();
    const isAttending = statusRaw === 'attending';
    const statusFormatted = isAttending ? 'Joyfully Accept ✅' : 'Regretfully Decline ❌';
    
    const attendeesCount = isAttending ? (Number(data.attendees_count) || 1) : 0;
    const additionalGuests = (data.additional_guests || '').toString().trim() || '-';
    const phoneNumber = (data.phone_number || '').toString().trim() || '-';
    const guestEmail = (data.guest_email || '').toString().trim() || '-';
    
    // Format attending events list
    let formattedEvents = '-';
    if (isAttending) {
      let eventsArr = [];
      if (Array.isArray(data.selected_events)) {
        eventsArr = data.selected_events;
      } else if (typeof data.selected_events === 'string' && data.selected_events.trim().length > 0) {
        try {
          eventsArr = JSON.parse(data.selected_events);
        } catch (_) {
          eventsArr = data.selected_events.split(',').map(s => s.trim());
        }
      }

      if (eventsArr && eventsArr.length > 0) {
        formattedEvents = eventsArr
          .map(id => EVENT_NAMES[id] || id)
          .join('\n');
      } else {
        formattedEvents = 'All Celebrations';
      }
    }

    const dietaryRequirements = (data.dietary_requirements || '').toString().trim() || '-';
    const specialRequests = (data.special_requests || '').toString().trim() || '-';
    const rsvpId = (data.id || `rsvp-${Date.now()}`).toString().trim();

    // Format current timestamp in Eastern Time (Wedding Timezone)
    const now = new Date();
    const formattedTimestamp = Utilities.formatDate(
      now,
      'America/New_York',
      'yyyy-MM-dd HH:mm:ss'
    ) + ' ET';

    // Construct row array matching HEADERS order
    const rowData = [
      formattedTimestamp,
      guestName,
      statusFormatted,
      attendeesCount,
      additionalGuests,
      phoneNumber,
      guestEmail,
      formattedEvents,
      dietaryRequirements,
      specialRequests,
      rsvpId
    ];

    // Non-destructive append
    sheet.appendRow(rowData);

    // Apply clean styling to the newly appended row
    const newRowIndex = sheet.getLastRow();
    const newRowRange = sheet.getRange(newRowIndex, 1, 1, HEADERS.length);
    newRowRange
      .setFontFamily('Arial')
      .setFontSize(10)
      .setVerticalAlignment('middle')
      .setWrap(true);

    // Subtle background color based on attendance status
    const statusCell = sheet.getRange(newRowIndex, 3);
    if (isAttending) {
      statusCell.setBackground('#E8F5E9').setFontColor('#1B5E20').setFontWeight('bold');
    } else {
      statusCell.setBackground('#FFEBEE').setFontColor('#B71C1C').setFontWeight('bold');
    }

    sheet.getRange(newRowIndex, 4).setHorizontalAlignment('center'); // Total Guests centered
    sheet.setRowHeight(newRowIndex, 32);

    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'success',
        message: 'RSVP recorded successfully',
        rsvpId: rsvpId
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    Logger.log('Error recording RSVP: ' + error.toString());
    return ContentService
      .createTextOutput(JSON.stringify({
        status: 'error',
        message: error.toString()
      }))
      .setMimeType(ContentService.MimeType.JSON);

  } finally {
    // Always release lock
    lock.releaseLock();
  }
}

/**
 * 3. GET HEALTH CHECK HANDLER
 * Allows testing in your browser to verify the Web App deployment is active.
 */
function doGet(e) {
  return ContentService
    .createTextOutput(JSON.stringify({
      status: 'active',
      wedding: 'Satish Reddy & Alekhya Wedding RSVP Endpoint',
      timestamp: Utilities.formatDate(new Date(), 'America/New_York', 'yyyy-MM-dd HH:mm:ss') + ' ET'
    }))
    .setMimeType(ContentService.MimeType.JSON);
}
