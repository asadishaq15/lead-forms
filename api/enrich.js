// api/enrich.js
export default async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { caller_id, zip_code } = req.body || {};
    if (!caller_id || !zip_code) {
      return res.status(400).json({ error: 'Missing caller_id or zip_code' });
    }

    const sanitized = String(caller_id).replace(/[^0-9]/g, '');
    const base = 'https://display.ringba.com/enrich/2785652522243590019';
    const url = `${base}?phone=${encodeURIComponent(sanitized)}&zip_code=${encodeURIComponent(zip_code)}`;

    const headers = { Accept: 'application/json' };
    if (process.env.RINGBA_AUTH) headers.Authorization = process.env.RINGBA_AUTH;

    const resp = await fetch(url, { method: 'GET', headers });

    // Read body safely and tolerate "JSON-as-text"
    const contentType = (resp.headers.get('content-type') || '').toLowerCase();
    let body;
    if (contentType.includes('application/json')) {
      try {
        body = await resp.json();
      } catch (e) {
        const txt = await resp.text().catch(() => '');
        body = txt;
      }
    } else {
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
      // Return helpful debug info for non-2xx
      return res.status(resp.status).json({ error: 'Ringba error', status: resp.status, body });
    }

    // Success: return JSON object when available, otherwise wrap text
    if (typeof body === 'object') {
      return res.status(200).json(body);
    } else {
      return res.status(200).json({ text: String(body) });
    }
  } catch (err) {
    console.error('enrich handler error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
