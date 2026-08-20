/*
 *  ███████╗ █████╗ ██╗  ██╗ █████╗ ███╗   ██╗    ███╗   ███╗██████╗
 *  ██╔════╝██╔══██╗██║  ██║██╔══██╗████╗  ██║    ████╗ ████║██╔══██╗
 *  ███████╗███████║███████║███████║██╔██╗ ██║    ██╔████╔██║██║  ██║
 *  ╚════██║██╔══██║██╔══██║██╔══██║██║╚██╗██║    ██║╚██╔╝██║██║  ██║
 *  ███████║██║  ██║██║  ██║██║  ██║██║ ╚████║    ██║ ╚═╝ ██║██████╔╝
 *  ╚══════╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═╝╚═╝  ╚═══╝    ╚═╝     ╚═╝╚═════╝
 *
 *  SAHAN-MD PRO — a self-owned WhatsApp bot built with Baileys.
 */

const express = require('express');
const path = require('path');
const config = require('./config');
const { loadPlugins, commands } = require('./lib/commands');
const client = require('./lib/client');

// 1) Load all command plugins
loadPlugins();

// 2) Start the WhatsApp connection
client.start().catch((e) => console.error('Startup error:', e));

// 3) Start the web dashboard (QR / pairing / status)
const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/api/status', (req, res) => {
  res.json({
    botName: config.BOT_NAME,
    status: client.state.status,
    qr: client.state.qr,
    pairingCode: client.state.pairingCode,
    me: client.state.me,
    commands: commands.length,
    prefix: config.PREFIX,
    mode: config.MODE,
    lastError: client.state.lastError,
  });
});

app.post('/api/pair', (req, res) => {
  const number = String(req.body?.number || '').replace(/\D/g, '');
  if (!number || number.length < 8) {
    return res.status(400).json({ ok: false, error: 'Enter a valid number with country code.' });
  }
  client.requestPairing(number);
  res.json({ ok: true });
});

app.listen(config.PORT, '0.0.0.0', () => {
  console.log(`🌐 ${config.BOT_NAME} dashboard on http://0.0.0.0:${config.PORT}`);
});
