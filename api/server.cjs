// api/server.js
import express from 'express';
import fetch from 'node-fetch';
import cors from 'cors';

const app = express();
app.use(cors());
app.use(express.json());

app.post('/api/auto-insurance-submit', async (req, res) => {
  try {
    const apiResponse = await fetch('https://evolvetech-innovations.trackdrive.com/api/v1/leads', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(req.body),
    });
    const data = await apiResponse.json();
    res.status(apiResponse.status).json(data);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error. Could not submit lead.' });
  }
});

app.listen(3000, () => {
  console.log('API proxy listening on http://localhost:3000');
});