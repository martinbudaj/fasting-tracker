/** @OnlyCurrentDoc */

const KEY = 'change-me-123';

function doGet(e) { return handle(e); }
function doPost(e) { return handle(e); }

function handle(e) {
  if (e.parameter.key !== KEY) return out('Invalid key');
  const ss = SpreadsheetApp.getActive();
  const sh = ss.getSheetByName('Fasting') || ss.insertSheet('Fasting');
  if (sh.getLastRow() === 0) sh.appendRow(['Start', 'End', 'Duration (h)']);

  const now = new Date();
  const last = sh.getLastRow();
  const row = sh.getRange(last, 1, 1, 3).getValues()[0];
  const running = last > 1 && row[0] && !row[1];
  const tz = Session.getScriptTimeZone();

  if (e.parameter.action === 'status') {
    if (!running) return out('No fast running');
    return out('Fasting for ' + ((now - new Date(row[0])) / 36e5).toFixed(1) + ' h');
  }

  if (running) {
    const h = (now - new Date(row[0])) / 36e5;
    sh.getRange(last, 2, 1, 2).setValues([[now, Math.round(h * 100) / 100]]);
    return out('Fast ended: ' + h.toFixed(1) + ' h');
  }
  sh.appendRow([now, '', '']);
  return out('Fast started at ' + Utilities.formatDate(now, tz, 'HH:mm'));
}

function out(t) { return ContentService.createTextOutput(t); }
