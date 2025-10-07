## near-gift.com – Setup & Deploy (Hidden Telegram Credentials)

This project serves a static frontend and proxies submissions to Telegram via a Node backend endpoint `/api/submit` so your Telegram token and chat ID never appear in the browser or DevTools.

### What you change
- Server-side only in `server.js`:
  - `TELEGRAM_BOT_TOKEN`
  - `TELEGRAM_CHAT_ID`
  - `PORT` (optional; default 3000)

### Local development
1. Install Node.js 18+.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Edit `server.js` and set your Telegram details:
   ```js
   const TELEGRAM_BOT_TOKEN = 'YOUR_TOKEN';
   const TELEGRAM_CHAT_ID = 'YOUR_CHAT_ID';
   ```
4. Start the server:
   ```bash
   npm start
   ```
5. Open `http://localhost:3000`. The frontend posts to `/api/submit` and the server forwards to Telegram securely.

### Production hosting options

#### IIS (Windows) with iisnode
1. Ensure IIS has iisnode and URL Rewrite installed.
2. Upload all project files to your site directory.
3. `web.config` is included and routes all requests to `server.js`.
4. Edit `server.js` on the server to set your `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
5. Start/browse the site. Client calls `/api/submit`; secrets remain server-side.

#### cPanel or any Node-capable host
1. Create a Node app pointing to `server.js` (or use a process manager like PM2 if available).
2. Upload project files.
3. Edit `server.js` to set `TELEGRAM_BOT_TOKEN` and `TELEGRAM_CHAT_ID`.
4. Run `npm install` and start the app.

#### Netlify (serverless alternative)
If you cannot run Node on the host, use a serverless function instead (not included here). Create a serverless function that accepts POST at `/api/submit` and forwards to Telegram with your token/chat ID embedded on the serverless side. Point the frontend to that path.

### Security notes
- Secrets live only in `server.js` on the server; they are never sent to the client.
- `server.js`, `.env`, and config files are blocked from HTTP in the Node server and via `web.config`.

### Troubleshooting
- 400 on `/api/submit`: Ensure the client sends JSON `{ "text": "..." }`.
- 500 on `/api/submit`: Verify your token/chat ID in `server.js` and that the server has outbound internet access.
- `/api/submit` 404: Ensure the Node server is running and `web.config`/routing is active.


