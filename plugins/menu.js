const { cmd, commands } = require('../lib/commands');

cmd(
  {
    pattern: 'menu',
    alias: ['help', 'list', 'commands'],
    desc: 'Show all available commands',
    category: 'general',
  },
  async (msg, ctx) => {
    const { config, prefix } = ctx;

    // Group commands by category
    const byCat = {};
    for (const c of commands) {
      (byCat[c.category] ||= []).push(c);
    }

    const uptime = process.uptime();
    const h = Math.floor(uptime / 3600);
    const m = Math.floor((uptime % 3600) / 60);
    const s = Math.floor(uptime % 60);

    let text = `╭━━〔 *${config.BOT_NAME}* 〕━━┈⊷\n`;
    text += `┃ 👑 Owner : ${config.OWNER_NAME}\n`;
    text += `┃ ⚙️ Prefix : ${prefix}\n`;
    text += `┃ 🌐 Mode : ${config.MODE}\n`;
    text += `┃ 🧩 Commands : ${commands.length}\n`;
    text += `┃ ⏱️ Uptime : ${h}h ${m}m ${s}s\n`;
    text += `╰━━━━━━━━━━━━━━━┈⊷\n\n`;

    for (const cat of Object.keys(byCat).sort()) {
      text += `╭━━〔 *${cat.toUpperCase()}* 〕━┈⊷\n`;
      for (const c of byCat[cat].sort((a, b) => a.pattern.localeCompare(b.pattern))) {
        text += `┃ ◦ ${prefix}${c.pattern}${c.desc ? ` — ${c.desc}` : ''}\n`;
      }
      text += `╰━━━━━━━━━━━━━━━┈⊷\n\n`;
    }

    text += `> _Powered by ${config.BOT_NAME}_`;

    await ctx.react('📜');
    await ctx.reply(text);
  }
);
