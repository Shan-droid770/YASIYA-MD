const { cmd } = require('../lib/commands');

cmd(
  { pattern: 'echo', alias: ['say'], desc: 'Repeat your text', category: 'tools' },
  async (msg, ctx) => {
    if (!ctx.text) return ctx.reply(`Usage: ${ctx.prefix}echo <text>`);
    await ctx.reply(ctx.text);
  }
);

cmd(
  { pattern: 'calc', desc: 'Simple calculator, e.g. .calc 2+2*5', category: 'tools' },
  async (msg, ctx) => {
    if (!ctx.text) return ctx.reply(`Usage: ${ctx.prefix}calc 2 + 2 * 5`);
    // Only allow safe math characters
    if (!/^[0-9+\-*/().\s%]+$/.test(ctx.text)) {
      return ctx.reply('❌ Only numbers and + - * / ( ) % are allowed.');
    }
    try {
      // eslint-disable-next-line no-new-func
      const result = Function(`"use strict"; return (${ctx.text})`)();
      await ctx.reply(`🧮 ${ctx.text} = *${result}*`);
    } catch {
      await ctx.reply('❌ Invalid expression.');
    }
  }
);

cmd(
  { pattern: 'tts', desc: 'Text preview (upper) — demo tool', category: 'tools' },
  async (msg, ctx) => {
    if (!ctx.text) return ctx.reply(`Usage: ${ctx.prefix}tts <text>`);
    await ctx.reply(ctx.text.toUpperCase());
  }
);

cmd(
  { pattern: 'jid', desc: 'Show the current chat JID', category: 'tools', ownerOnly: false },
  async (msg, ctx) => {
    await ctx.reply(
      `📇 *Chat JID:* ${ctx.from}\n` +
        `👤 *Sender:* ${ctx.sender}\n` +
        `👥 *Group:* ${ctx.isGroup ? 'yes' : 'no'}`
    );
  }
);
