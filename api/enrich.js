app.post('/api/enrich', async (req, res) => {
  try {
    const { caller_id, zip_code } = req.body || {};
    if (!caller_id || !zip_code) {
      return res.status(400).json({ error: 'Missing caller_id or zip_code' });
    }

    const sanitizedCallerId = String(caller_id).replace(/[^0-9]/g, '');
    const ringbaUrl = `https://display.ringba.com/enrich/2785652522243590019?phone=${sanitizedCallerId}&zip_code=${zip_code}`;

    // Try GET first (many enrich endpoints accept GET with query params).
    // If the API requires POST, change method to "POST" and provide required body/headers per docs.
    const response = await fetch(ringbaUrl, {
      method: 'GET', // <- switch to POST if Ringba docs require POST
      headers: {
        'Accept': 'application/json',
        // add Authorization or other headers here if required by Ringba
      },
    });

    const contentType = response.headers.get('content-type') || '';
    let parsedBody;
    if (contentType.includes('application/json')) {
      // safe JSON parse
      parsedBody = await response.json();
    } else {
      // read as text for debugging
      parsedBody = await response.text();
    }

    // If not ok, return status + body text for debugging
    if (!response.ok) {
      console.error('Ringba error', { status: response.status, body: parsedBody });
      return res.status(response.status).json({
        error: 'Ringba returned an error',
        status: response.status,
        body: parsedBody,
      });
    }

    // success: return the parsed JSON (or text if it was text)
    return res.status(200).json(parsedBody);
  } catch (err) {
    console.error('enrich handler error', err);
    return res.status(500).json({ error: err.message || 'Internal error' });
  }
});