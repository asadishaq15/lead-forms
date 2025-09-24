// api/server.cjs
const express = require('express');
const cors = require('cors');

process.on('uncaughtException', (err) => {
  console.error('*** uncaughtException ***', err && err.stack ? err.stack : err);
});
process.on('unhandledRejection', (reason) => {
  console.error('*** unhandledRejection ***', reason);
});
process.on('exit', (code) => {
  console.log('Process exit event. code=', code);
});

const app = express();
app.use(cors());
app.use(express.json());

const BASE_URL = 'https://display.ringba.com/enrich/2785652522243590019';

// Helper: safe parse response according to content-type
async function readResponseBody(resp) {
  const ct = (resp.headers.get('content-type') || '').toLowerCase();
  if (ct.includes('application/json')) {
    try {
      return { parsed: true, body: await resp.json() };
    } catch (e) {
      return { parsed: false, body: `<<json-parse-error:${e.message}>>` };
    }
  }
  try {
    return { parsed: false, body: await resp.text() };
  } catch (e) {
    return { parsed: false, body: `<<text-read-error:${e.message}>>` };
  }
}

// Build phone variants (common formats)
function phoneVariants(raw) {
  // raw expected to be digits or include +. Normalize digits only
  const digits = String(raw).replace(/[^0-9]/g, '');
  const variants = new Set();

  if (!digits) return [];

  // 10-digit: no country code
  if (digits.length === 10) {
    variants.add(digits);           // 5551234567
    variants.add('1' + digits);    // 15551234567
    variants.add('+' + '1' + digits); // +15551234567
  } else {
    // if includes country code already
    variants.add(digits);
    variants.add('+' + digits);
    if (digits.startsWith('1') && digits.length === 11) {
      variants.add(digits.slice(1)); // drop leading 1
    }
  }

  // keep original raw as last resort
  variants.add(String(raw));

  return Array.from(variants);
}

app.post('/api/enrich', async (req, res) => {
  try {
    const { caller_id, zip_code } = req.body || {};
    if (!caller_id || !zip_code) {
      return res.status(400).json({ error: 'Missing caller_id or zip_code (body expects JSON)' });
    }

    // Parameter name candidate lists
    const phoneParamNames = ['phone', 'phone_number', 'caller_id', 'callerid', 'caller'];
    const zipParamNames = ['zip_code', 'zip', 'zipcode', 'postal_code', 'postalcode'];

    // Headers to try — you can set RINGBA_AUTH env var (e.g. "Bearer <token>") if needed
    const extraAuth = process.env.RINGBA_AUTH || null;
    const commonHeaders = {
      Accept: 'application/json',
      'User-Agent': 'local-dev-enricher/1.0 (+https://localhost)'
    };
    if (extraAuth) commonHeaders.Authorization = extraAuth;

    const phoneVals = phoneVariants(caller_id);
    const attempts = [];

    // Attempt order: GET -> POST JSON -> POST FORM
    const methods = ['GET', 'POST_JSON', 'POST_FORM'];

    outer:
    for (const method of methods) {
      for (const phoneVal of phoneVals) {
        for (const phoneParam of phoneParamNames) {
          for (const zipParam of zipParamNames) {
            let url = BASE_URL;
            let fetchOpts = { method: 'GET', headers: { ...commonHeaders } };
            if (method === 'GET') {
              const q = new URLSearchParams({ [phoneParam]: phoneVal, [zipParam]: zip_code }).toString();
              url = `${BASE_URL}?${q}`;
              fetchOpts = { method: 'GET', headers: { ...commonHeaders } };
            } else if (method === 'POST_JSON') {
              fetchOpts = {
                method: 'POST',
                headers: { ...commonHeaders, 'Content-Type': 'application/json' },
                body: JSON.stringify({ [phoneParam]: phoneVal, [zipParam]: zip_code }),
              };
            } else { // POST_FORM
              const form = new URLSearchParams({ [phoneParam]: phoneVal, [zipParam]: zip_code }).toString();
              fetchOpts = {
                method: 'POST',
                headers: { ...commonHeaders, 'Content-Type': 'application/x-www-form-urlencoded' },
                body: form,
              };
            }

            console.log(`[ringba] attempt method=${method} phoneParam=${phoneParam} zipParam=${zipParam} phoneVal=${phoneVal}`);
            let resp;
            try {
              resp = await fetch(url, fetchOpts);
            } catch (err) {
              console.error('[ringba] network error', err);
              attempts.push({
                method, phoneParam, zipParam, phoneVal, url, error: String(err)
              });
              continue;
            }

            const { parsed, body } = await readResponseBody(resp);
            const attempt = {
              method, phoneParam, zipParam, phoneVal, url,
              status: resp.status,
              ok: resp.ok,
              contentType: resp.headers.get('content-type'),
              parsed,
              body
            };
            attempts.push(attempt);

            // If server returned 200-299, return immediately
            if (resp.ok) {
              // If parsed JSON, return as-is. If not parsed, wrap text.
              if (parsed && typeof body === 'object') {
                console.log('[ringba] success', attempt);
                return res.status(200).json(body);
              } else {
                console.log('[ringba] success (text)', attempt);
                return res.status(200).json({ text: String(body) });
              }
            }

            // If 4xx/5xx — continue trying other combos
            // Small delay between attempts to avoid being rate-limited (optional)
            await new Promise(r => setTimeout(r, 120));
          }
        }
      }
    }

    // none succeeded — return full attempts array for debugging
    return res.status(502).json({
      error: 'All attempts to call Ringba failed (see attempts array)',
      attempts
    });
  } catch (err) {
    console.error('enrich handler top-level error', err);
    return res.status(500).json({ error: String(err) });
  }
});

const PORT = process.env.PORT || 3000;
const server = app.listen(PORT, () => {
  console.log(`API proxy listening on http://localhost:${PORT}`);
});
server.on('error', (err) => {
  console.error('Server listen error:', err);
});
