const { cmd } = require('../lib/commands');

cmd(
  { pattern: 'mode', desc: 'Switch public/private (owner)', category: 'owner', ownerOnly: true },
  async (msg, ctx) => {
    const val = (ctx.text || '').toLowerCase();
    if (val !== 'public' && val !== 'private') {
      return ctx.reply(
        `Current mode: *${ctx.config.MODE}*\nUsage: ${ctx.prefix}mode public | private`
      );
    }
    ctx.config.MODE = val;
    await ctx.reply(`✅ Mode set to *${val}* (until next restart).`);
  }
);

cmd(
  { pattern: 'broadcast', alias: ['bc'], desc: 'Send a message to yourself (demo)', category: 'owner', ownerOnly: true },
  async (msg, ctx) => {
    if (!ctx.text) return ctx.reply(`Usage: ${ctx.prefix}broadcast <message>`);
    await ctx.reply(`📢 *Broadcast preview:*\n\n${ctx.text}`);
  }
);

cmd(
  { pattern: 'shutdown', alias: ['restart'], desc: 'Restart the bot process (owner)', category: 'owner', ownerOnly: true },
  async (msg, ctx) => {
    await ctx.reply('♻️ Restarting... (host must auto-restart the process)');
    setTimeout(() => process.exit(0), 1500);
  }
);
