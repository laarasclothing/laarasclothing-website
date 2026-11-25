/**
 * Laara's Clothing by aRu — website orders → Google Sheet + email.
 *
 * Setup (once):
 * 1. Create a Google Sheet named "Laara's Website Orders".
 * 2. Extensions → Apps Script. Delete the sample code and paste this whole file. Save.
 * 3. Deploy → New deployment → type "Web app".
 *    Execute as: Me · Who has access: Anyone → Deploy → allow the permissions.
 * 4. Copy the Web app URL (ends in /exec) and send it to Claude, who puts it in
 *    site/shop.html as ORDER_ENDPOINT.
 * After editing this script later: Deploy → Manage deployments → Edit → Version: New version.
 */
const ADMIN_EMAIL = 'admin@laarasclothing.in';
const SHEET_NAME = 'Orders';
const COLS = ['ref', 'name', 'mobile', 'address', 'pickup_slot', 'need_by', 'notes',
              'items', 'delivery', 'extras', 'estimated_total'];

function doPost(e) {
  const p = (e && e.parameter) || {};
  if (p['bot-field']) return ok_();          // spam trap filled in → ignore
  if (!p.ref || !p.mobile) return ok_();

  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
  if (sh.getLastRow() === 0) {
    sh.appendRow(['received'].concat(COLS).concat(['status']));
    sh.setFrozenRows(1);
  }
  const row = [new Date()].concat(COLS.map(c => safe_(p[c]))).concat(['New']);
  sh.appendRow(row);

  const body = COLS.map(c => c.replace(/_/g, ' ').toUpperCase() + ': ' + (p[c] || '-')).join('\n\n');
  MailApp.sendEmail({
    to: ADMIN_EMAIL,
    subject: 'New website order ' + p.ref + ' · ' + (p.name || '') + ' · ' + (p.estimated_total || ''),
    body: 'A new order was placed on laarasclothing.in\n\n' + body +
          '\n\nWhatsApp the customer: https://wa.me/91' + String(p.mobile).slice(-10) +
          '\nAll orders: ' + ss.getUrl()
  });
  return ok_();
}

// Keep text as text (stops numbers losing digits and blocks formulas typed into the form).
function safe_(v) {
  v = String(v || '').slice(0, 2000);
  return /^[=+\-@0-9]/.test(v) ? "'" + v : v;
}

function ok_() {
  return ContentService.createTextOutput('ok');
}
