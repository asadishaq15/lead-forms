// api/enrich.js (diagnostic version for Vercel)
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

    // Build phone variants
    const digits = String(caller_id).replace(/[^0-9]/g, '');
    const phoneVariants = new Set();
    if (digits.length === 10) {
      phoneVariants.add(digits);
      phoneVariants.add('1' + digits);
      phoneVariants.add('+' + '1' + digits);
    } else {
      phoneVariants.add(digits);
      phoneVariants.add('+' + digits);
      if (digits.startsWith('1') && digits.length === 11) phoneVariants.add(digits.slice(1));
    }
    phoneVariants.add(String(caller_id));
    const phones = Array.from(phoneVariants);

    const phoneParamNames = ['phone', 'phone_number', 'caller_id', 'callerid', 'caller'];
    const zipParamNames = ['zip_code', 'zip', 'zipcode', 'postal_code', 'postalcode'];

    const auth = process.env.RINGBA_AUTH || null;
    const commonHeaders = {
      Accept: 'application/json',
      'User-Agent': 'vercel-enricher/1.0'
    };
    if (auth) commonHeaders.Authorization = auth;

    const attempts = [];

    async function readBodySafely(resp) {
      const ct = (resp.headers.get('content-type') || '').toLowerCase();
      try {
        if (ct.includes('application/json')) {
          return { parsed: true, data: await resp.json() };
        }
      } catch (e) {
        // fallthrough
      }
      try {
        const text = await resp.text();
        // if text looks like JSON, try parse
        const t = (typeof text === 'string') ? text.trim() : text;
        if (typeof t === 'string' && (t.startsWith('{') || t.startsWith('['))) {
          try {
            return { parsed: true, data: JSON.parse(t) };
          } catch (e) {
            // not valid JSON
          }
        }
        return { parsed: false, data: text };
      } catch (e) {
        return { parsed: false, data: String(e) };
      }
    }

    // Try GET -> POST JSON -> POST FORM
    const methods = ['GET', 'POST_JSON', 'POST_FORM'];

    for (const method of methods) {
      for (const phone of phones) {
        for (const phoneParam of phoneParamNames) {
          for (const zipParam of zipParamNames) {
            let url = BASE;
            let opts = { method: 'GET', headers: { ...commonHeaders } };

            if (method === 'GET') {
              const q = new URLSearchParams({ [phoneParam]: phone, [zipParam]: zip_code }).toString();
              url = `${BASE}?${q}`;
              opts = { method: 'GET', headers: { ...commonHeaders } };
            } else if (method === 'POST_JSON') {
              opts = {
                method: 'POST',
                headers: { ...commonHeaders, 'Content-Type': 'application/json' },
                body: JSON.stringify({ [phoneParam]: phone, [zipParam]: zip_code }),
              };
            } else { // POST_FORM
              const form = new URLSearchParams({ [phoneParam]: phone, [zipParam]: zip_code }).toString();
              opts = {
                method: 'POST',
                headers: { ...commonHeaders, 'Content-Type': 'application/x-www-form-urlencoded' },
                body: form,
              };
            }

            // Log attempt (appears in Vercel logs)
            console.log('[ringba:attempt]', { method, phoneParam, zipParam, phone, url, headers: opts.headers });

            let resp;
            try {
              resp = await fetch(url, opts);
            } catch (err) {
              console.error('[ringba:network-error]', String(err));
              attempts.push({ method, phoneParam, zipParam, phone, url, error: String(err) });
              continue;
            }

            const { parsed, data } = await readBodySafely(resp);
            const a = {
              method, phoneParam, zipParam, phone, url,
              status: resp.status, ok: resp.ok,
              contentType: resp.headers.get('content-type'),
              parsed, body: data
            };
            attempts.push(a);

            // If success, return immediately
            if (resp.ok) {
              console.log('[ringba:success]', a);
              if (parsed && typeof data === 'object') return res.status(200).json(data);
              return res.status(200).json({ text: String(data) });
            }

            // slight delay to not hammer
            await new Promise(r => setTimeout(r, 120));
          }
        }
      }
    }

    // No success — return attempts for debugging
    console.warn('[ringba:all-failed]', attempts);
    return res.status(400).json({ error: 'Ringba error', status: attempts.length ? attempts[0].status : 500, attempts });
  } catch (err) {
    console.error('enrich:error', err);
    return res.status(500).json({ error: String(err) });
  }
}
