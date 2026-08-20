// Simple command registry + plugin loader for SAHAN-MD PRO
const fs = require('fs');
const path = require('path');

const commands = [];

/**
 * Register a command.
 * @param {Object} info
 * @param {string} info.pattern - primary command name (without prefix)
 * @param {string[]} [info.alias] - alternative names
 * @param {string} [info.desc] - description shown in menu
 * @param {string} [info.category] - menu category
 * @param {boolean} [info.ownerOnly] - restrict to owner
 * @param {Function} handler - async (msg, context) => {}
 */
function cmd(info, handler) {
  const entry = {
    pattern: info.pattern,
    alias: info.alias || [],
    desc: info.desc || '',
    category: info.category || 'misc',
    ownerOnly: info.ownerOnly || false,
    handler,
  };
  commands.push(entry);
  return entry;
}

function findCommand(name) {
  name = (name || '').toLowerCase();
  return commands.find(
    (c) => c.pattern.toLowerCase() === name || c.alias.map((a) => a.toLowerCase()).includes(name)
  );
}

function loadPlugins(dir = path.join(__dirname, '..', 'plugins')) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir).filter((f) => f.endsWith('.js'));
  for (const file of files) {
    try {
      require(path.join(dir, file));
    } catch (e) {
      console.error(`❌ Failed to load plugin ${file}:`, e.message);
    }
  }
  console.log(`✅ Loaded ${commands.length} commands from ${files.length} plugin files`);
}

module.exports = { cmd, commands, findCommand, loadPlugins };
