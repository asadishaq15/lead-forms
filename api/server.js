// api/server.js (ESM) - debug version
import express from "express";
import axios from "axios";
import cors from "cors";
import dotenv from "dotenv";

dotenv.config();

const app = express();
app.use(cors({ origin: process.env.CORS_ORIGIN || "*" }));
app.use(express.json({ limit: "200kb" })); // increase if payload larger

const RTB_ID = process.env.RTB_ID || "2811826747329218291";
const RTB_URL = `https://rtb.ringba.com/v1/production/${RTB_ID}.json`;

app.post("/api/submit-lead", async (req, res) => {
  try {
    console.log("== Received request to /api/submit-lead ==");
    console.log("Incoming body (first 2000 chars):", JSON.stringify(req.body).slice(0, 2000));

    // Basic validation before forwarding
    if (!req.body || !req.body.phone) {
      return res.status(400).json({ error: "Missing payload or phone" });
    }

    // Ensure phone/CID are digits-only strings (Ringba typically expects digits)
    const digits = String(req.body.phone).replace(/\D/g, "");
    const forwardedPayload = {
      ...req.body,
      phone: digits,
      CID: (req.body.CID || digits).toString()
    };

    console.log("Forwarding to Ringba URL:", RTB_URL);
    console.log("Forwarding payload (first 2000 chars):", JSON.stringify(forwardedPayload).slice(0, 2000));

    const response = await axios.post(RTB_URL, forwardedPayload, {
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        "User-Agent": "lead-forwarder/1.0"
      },
      timeout: 15000,
    });

    console.log("Ringba returned status:", response.status);
    // forward Ringba response as-is
    return res.status(response.status).json(response.data || { success: true, info: "no body" });
  }catch (err) {
    console.error("Error forwarding request to Ringba:", err);
    if (err.response) {
      console.error("Ringba response status:", err.response.status);
      console.error("Ringba response headers:", JSON.stringify(err.response.headers));
      console.error("Ringba response data:", err.response.data);
      // Send back the full error data
      return res.status(err.response.status || 500).json({
        error: "Error processing request",
        ringbaStatus: err.response.status,
        ringbaData: err.response.data,
        message: err.message
      });
    } else {
      console.error("Axios/Network error:", err.message);
      return res.status(500).json({ 
        error: "Network error", 
        message: err.message || "unknown error"
      });
    }
  }
});

const PORT = process.env.PORT || 5001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
