const express = require('express');
const cors = require('cors');
const fetch = require('node-fetch');

const app = express();
const PORT = 3001;

app.use(cors());
app.use(express.json());

// Proxy for verification (ping)
app.get('/api/ping', async (req, res) => {
  const { caller_id } = req.query;
  const url = `https://kbb-sales-group-llc.trackdrive.com/api/v1/inbound_webhooks/ping/check_for_available_aca_buyers?trackdrive_number=%2B18883700548&traffic_source_id=1013&caller_id=${caller_id}`;
  
  try {
    const response = await fetch(url);
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error" });
  }
});

// Proxy for form submission (post)
app.post('/api/submit', async (req, res) => {
  const url = 'https://kbb-sales-group-llc.trackdrive.com/api/v1/inbound_webhooks/post/check_for_available_aca_buyers';
  const formData = req.body;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      body: new URLSearchParams(formData),
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' }
    });
    const data = await response.json();
    res.json(data);
  } catch (error) {
    res.status(500).json({ error: "Proxy error" });
  }
});

app.listen(PORT, () => console.log(`Proxy server running on port ${PORT}`));