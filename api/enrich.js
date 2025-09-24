// api/enrich.js
export default async function handler(req, res) {
  // Only accept POST (your frontend posts to /api/enrich)
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const { caller_id, zip_code } = req.body || {};
    if (!caller_id || !zip_code) {
      res.status(400).json({ error: 'Missing caller_id or zip_code' });
      return;
    }

    // sanitize
    const sanitized = String(caller_id).replace(/[^0-9]/g, '');
    const base = 'https://display.ringba.com/enrich/2785652522243590019';
    const url = `${base}?phone=${encodeURIComponent(sanitized)}&zip_code=${encodeURIComponent(zip_code)}`;

    // Optional auth from env (set on Vercel dashboard): e.g. "Bearer <token>"
    const headers = { Accept: 'application/json' };
    if (process.env.RINGBA_AUTH) {
      headers.Authorization = process.env.RINGBA_AUTH;
    }

    // perform request (GET because that worked locally)
    const resp = await fetch(url, { method: 'GET', headers });

    // read body safely
    const contentType = (resp.headers.get('content-type') || '').toLowerCase();
    let body;
    if (contentType.includes('application/json')) {
      try {
        body = await resp.json();
      } catch (e) {
        // invalid JSON despite content-type
        const txt = await resp.text().catch(() => '');
        body = txt;
      }
    } else {
      // often returns text that contains JSON — try to parse it
      const txt = await resp.text().catch(() => '');
      const trimmed = (typeof txt === 'string') ? txt.trim() : txt;
      if (typeof trimmed === 'string' && (trimmed.startsWith('{') || trimmed.startsWith('['))) {
        try {
          body = JSON.parse(trimmed);
        } catch (e) {
          body = trimmed;
        }
      } else {
        body = trimmed;
      }
    }

    if (!resp.ok) {
      // return Ringba's status + message for easier debugging
      res.status(resp.status).json({ error: 'Ringba error', status: resp.status, body });
      return;
    }

    // success: return parsed JSON (object) if available, else return text under `text`
    if (typeof body === 'object') {
      res.status(200).json(body);
    } else {
      res.status(200).json({ text: String(body) });
    }
  } catch (err) {
    console.error('enrich handler error:', err);
    res.status(500).json({ error: String(err) });
  }
}
