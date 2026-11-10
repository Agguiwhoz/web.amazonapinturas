/**
 * Amazona Pinturas – recepção de pedidos de orçamento no Google Sheets.
 * Cole este código em Extensões > Apps Script de uma folha de cálculo Google.
 */
var SHEET_NAME = 'Pedidos';
var NOTIFY_EMAIL = 'geral@amazonapinturas.com'; // deixe '' para não enviar email
var HEADERS = ['Data', 'Nome', 'Telefone', 'Email', 'Empresa', 'Serviço', 'Área (m²)', 'Prazo', 'Local', 'Mensagem', 'Origem'];

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    var p = (e && e.parameter) || {};
    if (p.website) return out_({ ok: true });            // campo-armadilha anti-spam
    if (!p.nome || !p.telefone) return out_({ ok: false, error: 'dados em falta' });

    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sh = ss.getSheetByName(SHEET_NAME) || ss.insertSheet(SHEET_NAME);
    if (sh.getLastRow() === 0) {
      sh.appendRow(HEADERS);
      sh.setFrozenRows(1);
      sh.getRange(1, 1, 1, HEADERS.length).setFontWeight('bold').setBackground('#FFC20E');
      sh.getRange('C:C').setNumberFormat('@');            // telefone como texto
    }
    var row = [
      new Date(), clean_(p.nome), String(p.telefone || '').replace(/[^\d+ ]/g, '').slice(0, 25),
      clean_(p.email), clean_(p.empresa), clean_(p.servico), clean_(p.area),
      clean_(p.prazo), clean_(p.local), clean_(p.mensagem), clean_(p.origem)
    ];
    sh.appendRow(row);

    if (NOTIFY_EMAIL) {
      MailApp.sendEmail(NOTIFY_EMAIL, 'Novo pedido de orçamento: ' + row[1],
        HEADERS.map(function (h, i) { return h + ': ' + row[i]; }).join('\n'));
    }
    return out_({ ok: true });
  } catch (err) {
    return out_({ ok: false, error: String(err) });
  } finally {
    lock.releaseLock();
  }
}

function doGet() { return out_({ ok: true, msg: 'Endpoint da Amazona Pinturas activo' }); }

function clean_(v) {
  v = String(v || '').trim().slice(0, 1000);
  return /^[=+\-@]/.test(v) ? "'" + v : v;               // evita fórmulas injectadas
}
function out_(o) {
  return ContentService.createTextOutput(JSON.stringify(o)).setMimeType(ContentService.MimeType.JSON);
}
