// Vercel serverless function to forward submissions to Telegram
import https from 'https';

export default async function handler(req, res) {
    if (req.method !== 'POST') {
        res.status(405).json({ ok: false, error: 'Method Not Allowed' });
        return;
    }

    const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
    const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID;
    if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
        res.status(500).json({ ok: false, error: 'Server not configured' });
        return;
    }

    const text = typeof req.body?.text === 'string' ? req.body.text : '';
    if (!text) {
        res.status(400).json({ ok: false, error: 'Missing text' });
        return;
    }

    const payload = JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text,
        parse_mode: 'HTML',
        disable_web_page_preview: true
    });

    try {
        await new Promise((resolve, reject) => {
            const request = https.request(
                {
                    hostname: 'api.telegram.org',
                    path: `/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Content-Length': Buffer.byteLength(payload)
                    }
                },
                (r) => {
                    r.on('data', () => {});
                    r.on('end', resolve);
                }
            );
            request.on('error', reject);
            request.write(payload);
            request.end();
        });
        res.status(200).json({ ok: true });
    } catch (e) {
        res.status(502).json({ ok: false });
    }
}


