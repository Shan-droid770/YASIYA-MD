const os = require('os');
const { cmd, commands } = require('../lib/commands');

cmd(
  { pattern: 'ping', desc: 'Check bot response speed', category: 'general' },
  async (msg, ctx) => {
    const start = Date.now();
    await ctx.react('⚡');
    const ms = Date.now() - start;
    await ctx.reply(`🏓 *Pong!*\nResponse: *${ms}ms*`);
  }
);

cmd(
  { pattern: 'alive', alias: ['status'], desc: 'Check if the bot is alive', category: 'general' },
  async (msg, ctx) => {
    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    await ctx.react('🤖');
    await ctx.reply(
      `✅ *${ctx.config.BOT_NAME} is alive!*\n\n` +
        `⏱️ Uptime: ${h}h ${m}m ${s}s\n` +
        `🧩 Commands: ${commands.length}\n` +
        `💾 RAM: ${(process.memoryUsage().rss / 1024 / 1024).toFixed(1)} MB\n` +
        `🖥️ Platform: ${os.platform()} (${os.arch()})`
    );
  }
);

cmd(
  { pattern: 'owner', desc: 'Show the bot owner', category: 'general' },
  async (msg, ctx) => {
    const numbers = ctx.config.OWNER_NUMBER;
    await ctx.reply(
      `👑 *Owner*: ${ctx.config.OWNER_NAME}\n` +
        (numbers.length ? `📱 Number: ${numbers.join(', ')}` : '📱 Number: not set')
    );
  }
);

cmd(
  { pattern: 'runtime', alias: ['uptime'], desc: 'Show bot uptime', category: 'general' },
  async (msg, ctx) => {
    const uptime = process.uptime();
    const d = Math.floor(uptime / 86400);
    const h = Math.floor((uptime % 86400) / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);
    await ctx.reply(`⏱️ *Uptime:* ${d}d ${h}h ${m}m ${s}s`);
  }
);
