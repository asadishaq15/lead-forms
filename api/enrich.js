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

    const BASE = 'https://display.ringba.com/enrich/2785652522243590019';
    const auth = process.env.RINGBA_AUTH || null;
    const commonHeaders = { Accept: 'application/json' };
    if (auth) commonHeaders.Authorization = auth;

    // Create common phone formats to try
    const digits = String(caller_id).replace(/[^0-9]/g, '');
    const phonesToTry = new Set();
    if (digits.length === 10) {
      phonesToTry.add(digits);
      phonesToTry.add('1' + digits);
      phonesToTry.add('+' + '1' + digits);
    } else {
      phonesToTry.add(digits);
      phonesToTry.add('+' + digits);
      if (digits.startsWith('1') && digits.length === 11) phonesToTry.add(digits.slice(1));
    }
    phonesToTry.add(String(caller_id));
    const phones = Array.from(phonesToTry);

    // Only these param name combos (not exhaustive)
    const phoneParams = ['phone', 'caller_id'];
    const zipParams = ['zip_code', 'zip'];

    // Try GET first (worked earlier), then POST JSON if GET fails
    for (const phoneVal of phones) {
      for (const pName of phoneParams) {
        for (const zName of zipParams) {
          // GET with query params
          const q = new URLSearchParams({ [pName]: phoneVal, [zName]: zip_code }).toString();
          const getUrl = `${BASE}?${q}`;
          let resp;
          try {
            resp = await fetch(getUrl, { method: 'GET', headers: commonHeaders });
          } catch (e) {
            // network error - try next
            continue;
          }

          // read body safely
          const ct = (resp.headers.get('content-type') || '').toLowerCase();
          let body;
          if (ct.includes('application/json')) {
            try { body = await resp.json(); } catch (e) { body = await resp.text().catch(() => String(e)); }
          } else {
            const txt = await resp.text().catch(() => '');
            const t = (typeof txt === 'string') ? txt.trim() : txt;
            if (typeof t === 'string' && (t.startsWith('{') || t.startsWith('['))) {
              try { body = JSON.parse(t); } catch (e) { body = t; }
            } else { body = t; }
          }

          if (resp.ok) {
            return (typeof body === 'object') ? res.status(200).json(body) : res.status(200).json({ text: String(body) });
          }

          // If GET returned non-ok, try POST JSON for same params
          try {
            const postResp = await fetch(BASE, {
              method: 'POST',
              headers: { ...commonHeaders, 'Content-Type': 'application/json' },
              body: JSON.stringify({ [pName]: phoneVal, [zName]: zip_code })
            });

            const ct2 = (postResp.headers.get('content-type') || '').toLowerCase();
            let body2;
            if (ct2.includes('application/json')) {
              try { body2 = await postResp.json(); } catch(e){ body2 = await postResp.text().catch(()=>''); }
            } else {
              const txt2 = await postResp.text().catch(() => '');
              const t2 = (typeof txt2 === 'string') ? txt2.trim() : txt2;
              if (typeof t2 === 'string' && (t2.startsWith('{') || t2.startsWith('['))) {
                try { body2 = JSON.parse(t2); } catch(e) { body2 = t2; }
              } else body2 = t2;
            }

            if (postResp.ok) {
              return (typeof body2 === 'object') ? res.status(200).json(body2) : res.status(200).json({ text: String(body2) });
            }
          } catch (e) {
            // ignore and try next combo
          }
        }
      }
    }

    // If none succeeded — return last helpful message
    return res.status(400).json({ error: 'Ringba error', status: 400, body: 'Bad Request (all tried variants failed)' });
  } catch (err) {
    console.error('enrich handler error:', err);
    return res.status(500).json({ error: String(err) });
  }
}
