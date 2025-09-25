import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

// Initialize Express
const app = express();

// Allow CORS for Vite dev server during development
app.use(cors());

// Parse JSON bodies
app.use(express.json());

// ----- GET /api/ping -----
app.get('/api/ping', async (req, res) => {
  try {
    const { trackdrive_number, traffic_source_id, caller_id } = req.query;

    if (!trackdrive_number || !traffic_source_id || !caller_id) {
      return res.status(400).json({ success: false, errors: ["Missing required parameters"] });
    }

    const url = `https://growxmarketingservices.trackdrive.com/api/v1/inbound_webhooks/ping/check_for_available_buyers?trackdrive_number=${encodeURIComponent(trackdrive_number)}&traffic_source_id=${encodeURIComponent(traffic_source_id)}&caller_id=${encodeURIComponent(caller_id)}`;

    console.log("PING: Making request to:", url);

    const response = await fetch(url);

    // Get raw response text, not just JSON
    const responseText = await response.text();
    console.log("PING: Response text:", responseText);

    if (!responseText) {
      return res.status(500).json({
        success: false,
        errors: ["Received empty response from external API"]
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return res.status(500).json({
        success: false,
        errors: ["Failed to parse API response as JSON"],
        responseText: responseText.substring(0, 200)
      });
    }

    return res.status(200).json(data);

  } catch (error) {
    console.error("PING: API Error:", error);
    return res.status(500).json({
      success: false,
      errors: [error.message || "An unexpected error occurred"]
    });
  }
});

// ----- POST /api/post -----
app.post('/api/post', async (req, res) => {
  // Accept both JSON and stringified JSON bodies
  let body = req.body;
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (err) {
      return res.status(400).json({ success: false, errors: ["Invalid JSON in request body"] });
    }
  }

  try {
    console.log("POST: Sending POST request with body:", JSON.stringify(body));

    const response = await fetch(
      "https://growxmarketingservices.trackdrive.com/api/v1/inbound_webhooks/post/check_for_available_buyers",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      }
    );

    const responseText = await response.text();
    console.log("POST: Response text:", responseText);

    if (!responseText) {
      return res.status(500).json({
        success: false,
        errors: ["Received empty response from external API"]
      });
    }

    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return res.status(500).json({
        success: false,
        errors: ["Failed to parse API response as JSON"],
        responseText: responseText.substring(0, 200)
      });
    }

    res.status(response.status).json(data);

  } catch (error) {
    console.error("POST: API Error:", error);
    res.status(500).json({ success: false, errors: [error.message || "An unexpected error occurred"] });
  }
});

// ----- Start Server -----
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`✅ Express API listening on http://localhost:${PORT}`);
});