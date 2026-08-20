<div align="center">

# 🤖 SAHAN-MD PRO

**A self-owned, multi-device WhatsApp bot built with [Baileys](https://github.com/WhiskeySockets/Baileys).**

You own the code. You own the login. You own the commands.

![Node](https://img.shields.io/badge/Node.js-18+-68CC6B?style=for-the-badge&logo=node.js&logoColor=white)
![License](https://img.shields.io/badge/License-MIT-4ECDC4?style=for-the-badge)
![Baileys](https://img.shields.io/badge/Baileys-MD-00D9FF?style=for-the-badge)

</div>

---

## ✨ Features

- 🔐 **Login your own number** — QR code *or* pairing code, right from a web dashboard.
- 🧩 **Plugin command system** — drop a file in `plugins/` and it's live.
- 🌐 **Web dashboard** — live status, QR, pairing, command count.
- 👑 **Owner controls** — public/private mode, owner-only commands.
- 🖼️ **Sticker maker**, calculator, utilities, and more — all editable by you.

## 🚀 Quick start (local)

```bash
# 1. Install dependencies
npm install

# 2. Configure
cp .env.example .env
#   then edit .env — set OWNER_NUMBER to your number (digits only, with country code)

# 3. Run
npm start
```

Open **http://localhost:8000** and either:

- **Scan the QR** with WhatsApp → *Linked devices* → *Link a device*, **or**
- Enter your number and get a **pairing code** to type into WhatsApp.

Once connected, message your bot: `.menu`

## ⚙️ Configuration (`.env`)

| Variable | Meaning | Default |
|---|---|---|
| `BOT_NAME` | Display name | `SAHAN-MD PRO` |
| `OWNER_NAME` | Your name | `Sahan` |
| `OWNER_NUMBER` | Your number(s), digits only, comma-separated | – |
| `PREFIX` | Command prefix | `.` |
| `MODE` | `public` or `private` | `public` |
| `AUTO_READ` | Auto-read messages | `false` |
| `ALWAYS_ONLINE` | Keep presence online | `true` |
| `PORT` | Dashboard port | `8000` |

## 🧩 Adding a command

Create a file in `plugins/`, e.g. `plugins/hello.js`:

```js
const { cmd } = require('../lib/commands');

cmd(
  { pattern: 'hello', desc: 'Say hi', category: 'general' },
  async (msg, ctx) => {
    await ctx.reply(`Hi ${ctx.sender.split('@')[0]}! 👋`);
  }
);
```

Restart the bot — `.hello` now works and appears in `.menu`.

### The `ctx` helper object

| Field | Description |
|---|---|
| `ctx.reply(text)` | Reply to the message |
| `ctx.react(emoji)` | React to the message |
| `ctx.args` / `ctx.text` | Command arguments |
| `ctx.from` / `ctx.sender` | Chat & sender JID |
| `ctx.isGroup` / `ctx.isOwner` | Context flags |
| `ctx.quoted` | The quoted/replied message (if any) |
| `ctx.downloadMedia(m)` | Download media buffer |
| `ctx.sock` | Raw Baileys socket |

## 📦 Built-in commands

`menu`, `ping`, `alive`, `owner`, `runtime`, `echo`, `calc`, `tts`, `jid`, `sticker`, `mode` *(owner)*, `broadcast` *(owner)*, `shutdown` *(owner)*

## ☁️ Deploy

Works on any Node host (Render, Railway, VPS, Heroku, Docker). A `Dockerfile` and `app.json` are included. Set your env vars, deploy, then open the app URL to log in.

> ⚠️ Keep your `session/` folder private — it *is* your WhatsApp login.

---

<div align="center">

**Made with 💚 — SAHAN-MD PRO**

</div>
