const { cmd } = require('../lib/commands');

let Sticker, StickerTypes;
try {
  ({ Sticker, StickerTypes } = require('wa-sticker-formatter'));
} catch {
  Sticker = null; // library (or its native 'sharp' dep) not installed in this environment
}

cmd(
  {
    pattern: 'sticker',
    alias: ['s', 'stiker'],
    desc: 'Convert an image/video to a sticker (reply or send with caption)',
    category: 'converter',
  },
  async (msg, ctx) => {
    if (!Sticker) {
      return ctx.reply(
        '⚠️ Sticker maker is unavailable here (the `wa-sticker-formatter` / `sharp` ' +
          'native library is not installed). Run `npm install wa-sticker-formatter` on ' +
          'your host to enable it.'
      );
    }
    const target = ctx.quoted || msg;
    const m = target.message || {};
    const isImage = m.imageMessage;
    const isVideo = m.videoMessage;

    if (!isImage && !isVideo) {
      return ctx.reply(
        `🖼️ Send an image/short video with caption *${ctx.prefix}sticker*, ` +
          `or reply to one.`
      );
    }

    await ctx.react('🪄');
    try {
      const buffer = await ctx.downloadMedia(target);
      const sticker = new Sticker(buffer, {
        pack: ctx.config.BOT_NAME,
        author: ctx.config.OWNER_NAME,
        type: StickerTypes.FULL,
        quality: 60,
      });
      const out = await sticker.toBuffer();
      await ctx.sock.sendMessage(ctx.from, { sticker: out }, { quoted: msg });
    } catch (e) {
      await ctx.reply('❌ Failed to make sticker: ' + e.message);
    }
  }
);
