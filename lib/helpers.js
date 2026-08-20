// Message parsing helpers for SAHAN-MD PRO
const { downloadMediaMessage } = require('@whiskeysockets/baileys');

function getMessageType(message) {
  if (!message) return null;
  return Object.keys(message)[0];
}

function extractText(msg) {
  const m = msg.message;
  if (!m) return '';
  return (
    m.conversation ||
    m.extendedTextMessage?.text ||
    m.imageMessage?.caption ||
    m.videoMessage?.caption ||
    m.buttonsResponseMessage?.selectedButtonId ||
    m.listResponseMessage?.singleSelectReply?.selectedRowId ||
    m.templateButtonReplyMessage?.selectedId ||
    ''
  );
}

function getQuoted(msg) {
  const ctx = msg.message?.extendedTextMessage?.contextInfo;
  if (ctx?.quotedMessage) {
    return {
      key: {
        remoteJid: msg.key.remoteJid,
        id: ctx.stanzaId,
        participant: ctx.participant,
        fromMe: false,
      },
      message: ctx.quotedMessage,
    };
  }
  return null;
}

async function downloadMedia(fullMsg) {
  return downloadMediaMessage(fullMsg, 'buffer', {});
}

module.exports = { getMessageType, extractText, getQuoted, downloadMedia };
