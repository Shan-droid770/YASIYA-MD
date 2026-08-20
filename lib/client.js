// WhatsApp client manager for SAHAN-MD PRO
const {
  default: makeWASocket,
  useMultiFileAuthState,
  fetchLatestBaileysVersion,
  DisconnectReason,
  makeCacheableSignalKeyStore,
  Browsers,
} = require('@whiskeysockets/baileys');
const { Boom } = require('@hapi/boom');
const pino = require('pino');
const path = require('path');
const qrcode = require('qrcode');

const config = require('../config');
const { extractText, getQuoted, downloadMedia } = require('./helpers');
const { findCommand, commands } = require('./commands');

const logger = pino({ level: 'silent' });

// Shared state the web dashboard reads from
const state = {
  status: 'starting', // starting | qr | pairing | connected | disconnected
  qr: null, // data URL of the current QR
  pairingCode: null,
  me: null, // { id, name }
  startedAt: Date.now(),
  lastError: null,
};

let sock = null;
let pairingRequested = false;
let pairingNumber = null;

function ownerJids() {
  return config.OWNER_NUMBER.map((n) => n.replace(/\D/g, '') + '@s.whatsapp.net');
}

function isOwner(jid, msg) {
  const num = (jid || '').split('@')[0];
  if (msg?.key?.fromMe) return true;
  return config.OWNER_NUMBER.includes(num);
}

/** Request a pairing code for a specific phone number (digits only). */
function requestPairing(number) {
  pairingNumber = String(number || '').replace(/\D/g, '');
  pairingRequested = true;
  state.status = 'pairing';
  state.pairingCode = null;
  // If a socket is already up and not registered, ask immediately
  if (sock && !sock.authState.creds.registered && pairingNumber) {
    doRequestPairing();
  }
  return true;
}

async function doRequestPairing() {
  try {
    const code = await sock.requestPairingCode(pairingNumber);
    state.pairingCode = code?.match(/.{1,4}/g)?.join('-') || code;
    console.log('🔗 Pairing code:', state.pairingCode);
  } catch (e) {
    state.lastError = 'Pairing failed: ' + e.message;
    console.error(state.lastError);
  }
}

async function start() {
  const { state: authState, saveCreds } = await useMultiFileAuthState(
    path.resolve(config.SESSION_DIR)
  );
  const { version } = await fetchLatestBaileysVersion();

  sock = makeWASocket({
    version,
    logger,
    printQRInTerminal: false,
    auth: {
      creds: authState.creds,
      keys: makeCacheableSignalKeyStore(authState.keys, logger),
    },
    browser: Browsers.macOS('Safari'),
    markOnlineOnConnect: config.ALWAYS_ONLINE,
    generateHighQualityLinkPreview: true,
  });

  // If a pairing request was queued before the socket existed
  if (pairingRequested && !sock.authState.creds.registered && pairingNumber) {
    setTimeout(doRequestPairing, 2500);
  }

  sock.ev.on('creds.update', saveCreds);

  sock.ev.on('connection.update', async (update) => {
    const { connection, lastDisconnect, qr } = update;

    if (qr && !pairingRequested) {
      state.status = 'qr';
      state.qr = await qrcode.toDataURL(qr);
    }

    if (connection === 'open') {
      state.status = 'connected';
      state.qr = null;
      state.pairingCode = null;
      state.me = {
        id: sock.user?.id,
        name: sock.user?.name || config.BOT_NAME,
      };
      console.log(`✅ ${config.BOT_NAME} connected as ${state.me.name}`);

      // Greet the owner / self
      try {
        const to = ownerJids()[0] || sock.user.id;
        await sock.sendMessage(to, {
          text:
            `✅ *${config.BOT_NAME}* is now online!\n\n` +
            `• Prefix: *${config.PREFIX}*\n` +
            `• Mode: *${config.MODE}*\n` +
            `• Commands: *${commands.length}*\n\n` +
            `Type *${config.PREFIX}menu* to see everything.`,
        });
      } catch {}
    }

    if (connection === 'close') {
      const code = new Boom(lastDisconnect?.error)?.output?.statusCode;
      state.status = 'disconnected';
      const loggedOut = code === DisconnectReason.loggedOut;
      console.log(`⚠️ Connection closed (code ${code}).`, loggedOut ? 'Logged out.' : 'Reconnecting...');
      if (!loggedOut) {
        setTimeout(start, 3000);
      } else {
        state.lastError = 'Logged out. Delete the session and re-login.';
      }
    }
  });

  sock.ev.on('messages.upsert', async ({ messages, type }) => {
    if (type !== 'notify') return;
    for (const msg of messages) {
      try {
        await handleMessage(msg);
      } catch (e) {
        console.error('handleMessage error:', e);
      }
    }
  });

  return sock;
}

async function handleMessage(msg) {
  if (!msg.message) return;
  const from = msg.key.remoteJid;
  if (from === 'status@broadcast') return;

  if (config.AUTO_READ) {
    try { await sock.readMessages([msg.key]); } catch {}
  }

  const body = extractText(msg);
  if (!body) return;

  const prefix = config.PREFIX;
  if (!body.startsWith(prefix)) return;

  const args = body.slice(prefix.length).trim().split(/\s+/);
  const cmdName = (args.shift() || '').toLowerCase();
  const command = findCommand(cmdName);
  if (!command) return;

  const isGroup = from.endsWith('@g.us');
  const sender = isGroup ? msg.key.participant : from;
  const owner = isOwner(sender, msg);

  // Private mode: only owner can use the bot
  if (config.MODE === 'private' && !owner) return;
  if (command.ownerOnly && !owner) {
    await sock.sendMessage(from, { text: '🔒 This command is owner-only.' }, { quoted: msg });
    return;
  }

  const context = {
    sock,
    msg,
    from,
    sender,
    isGroup,
    isOwner: owner,
    args,
    body,
    text: args.join(' '),
    prefix,
    quoted: getQuoted(msg),
    config,
    commands,
    reply: (text, opts = {}) =>
      sock.sendMessage(from, { text: String(text) }, { quoted: msg, ...opts }),
    react: (emoji) =>
      sock.sendMessage(from, { react: { text: emoji, key: msg.key } }),
    downloadMedia,
  };

  await command.handler(msg, context);
}

module.exports = { start, state, requestPairing, config };
