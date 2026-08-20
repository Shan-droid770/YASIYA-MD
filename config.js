const fs = require('fs');
if (fs.existsSync('.env')) require('dotenv').config();
if (fs.existsSync('config.env')) require('dotenv').config({ path: './config.env' });

function toBool(v, def = false) {
  if (v === undefined || v === null || v === '') return def;
  return ['true', 'yes', '1', 'on'].includes(String(v).toLowerCase());
}

module.exports = {
  // Branding
  BOT_NAME: process.env.BOT_NAME || 'SAHAN-MD PRO',
  OWNER_NAME: process.env.OWNER_NAME || 'Sahan Dissanayaka',

  // Owner number(s) in international format, comma separated, no + or spaces. e.g. 9471XXXXXXX
  OWNER_NUMBER: (process.env.OWNER_NUMBER || '94710927228').split(',').map(s => s.trim()).filter(Boolean),

  // Command prefix
  PREFIX: process.env.PREFIX || '/',

  // Behaviour
  MODE: (process.env.MODE || 'private').toLowerCase(), // 'public' or 'private'
  AUTO_READ: toBool(process.env.AUTO_READ, false),
  ALWAYS_ONLINE: toBool(process.env.ALWAYS_ONLINE, true),

  // Server / session
  PORT: process.env.PORT || 8000,
  SESSION_DIR: process.env.SESSION_DIR || './session',
};
