// api/server.js (ESM) - combined routes + static serve
import express from "express";
import axios from "axios";
import cors from "cors";
import path from "path";
import { fileURLToPath } from "url";
import fs from "fs";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();

// ---------- Hardcoded configuration (no environment variables) --------------
// NOTE: storing secrets/config in source is convenient for local testing but NOT
// recommended for production. Replace these values if needed.
const CORS_ORIGIN = "*"; // or "http://localhost:3000"
const PORT = 5001;
const RTB_ID = "2811826747329218291";

// GrowXForm2 configuration
const TRACKDRIVE_NUMBER_2 = "+18775902476";
const TRAFFIC_SOURCE_ID_2 = "1000";

// GrowXForm3 configuration
const TRACKDRIVE_NUMBER_3 = "+18778383452";
const TRAFFIC_SOURCE_ID_3 = "1000";
// ---------------------------------------------------------------------------

app.use(cors({ origin: CORS_ORIGIN }));
app.use(express.json({ limit: "200kb" }));

// ------------ Existing Ringba forwarder -------------
const RTB_URL = `https://rtb.ringba.com/v1/production/${RTB_ID}.json`;

app.post("/api/submit-lead", async (req, res) => {
  try {
    console.log("== Received request to /api/submit-lead ==");
    console.log("Incoming body (first 2000 chars):", JSON.stringify(req.body).slice(0, 2000));

    if (!req.body || !req.body.phone) {
      return res.status(400).json({ error: "Missing payload or phone" });
    }

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
    return res.status(response.status).json(response.data || { success: true, info: "no body" });
  } catch (err) {
    console.error("Error forwarding request to Ringba:", err);
    if (err.response) {
      return res.status(err.response.status || 500).json({
        error: "Error processing request",
        ringbaStatus: err.response.status,
        ringbaData: err.response.data,
        message: err.message
      });
    } else {
      return res.status(500).json({
        error: "Network error",
        message: err.message || "unknown error"
      });
    }
  }
});

// ------------ Helper function for Trackdrive APIs -------------
// Helper: call upstream with timeout using axios
async function axiosWithTimeout(url, opts = {}, timeoutMs = 8000) {
  const source = axios.CancelToken.source();
  const timer = setTimeout(() => {
    source.cancel(`Timeout after ${timeoutMs}ms`);
  }, timeoutMs);

  try {
    const response = await axios({
      url,
      cancelToken: source.token,
      ...opts,
    });
    clearTimeout(timer);
    return response;
  } catch (err) {
    clearTimeout(timer);
    throw err;
  }
}

// ------------ GrowXForm2 Trackdrive ping and post endpoints -------------
// GET /api/ping2?caller_id=+1XXXXXXXXXX
app.get("/api/ping2", async (req, res) => {
  // Validate config presence (hardcoded above)
  if (!TRACKDRIVE_NUMBER_2 || !TRAFFIC_SOURCE_ID_2) {
    console.error("Missing TRACKDRIVE_NUMBER_2 or TRAFFIC_SOURCE_ID_2 (hardcoded)");
    return res.status(500).json({ success: false, status: "error", errors: ["Server misconfiguration"] });
  }

  const { caller_id } = req.query;
  if (!caller_id || !/^\+1\d{10}$/.test(caller_id)) {
    return res.status(400).json({ success: false, status: "error", errors: ["Invalid or missing caller_id. Expected +1XXXXXXXXXX"] });
  }

  const apiUrl = `https://growxmarketingservices.trackdrive.com/api/v1/inbound_webhooks/ping/check_for_available_buyers?trackdrive_number=${encodeURIComponent(TRACKDRIVE_NUMBER_2)}&traffic_source_id=${encodeURIComponent(TRAFFIC_SOURCE_ID_2)}&caller_id=${encodeURIComponent(caller_id)}`;

  try {
    const upstream = await axiosWithTimeout(apiUrl, { method: "GET" }, 8000);
    return res.status(upstream.status).json(upstream.data);
  } catch (err) {
    console.error("Ping upstream error:", err.message || err);

    if (axios.isCancel(err)) {
      return res.status(504).json({ success: false, status: "timeout", errors: ["Upstream request timed out"] });
    }

    if (err.response) {
      return res.status(err.response.status || 502).json({
        success: false,
        status: "upstream_error",
        errors: [err.response.data?.errors?.join?.(", ") || err.response.data?.status || `Upstream status ${err.response.status}`],
      });
    }

    return res.status(500).json({ success: false, status: "error", errors: ["Server error: " + (err.message || "unknown")] });
  }
});

// POST /api/post2
app.post("/api/post2", async (req, res) => {
  if (!TRACKDRIVE_NUMBER_2 || !TRAFFIC_SOURCE_ID_2) {
    console.error("Missing TRACKDRIVE_NUMBER_2 or TRAFFIC_SOURCE_ID_2 (hardcoded)");
    return res.status(500).json({ success: false, status: "error", errors: ["Server misconfiguration"] });
  }

  try {
    const body = req.body || {};
    const required = ["ping_id", "caller_id", "first_name", "last_name", "zip", "age"];
    const missing = required.filter(k => !body[k]);
    if (missing.length) {
      return res.status(400).json({ success: false, status: "error", errors: ["Missing required fields: " + missing.join(", ")] });
    }

    const payload = {
      ...body,
      trackdrive_number: TRACKDRIVE_NUMBER_2,
      traffic_source_id: TRAFFIC_SOURCE_ID_2,
    };

    const apiUrl = "https://growxmarketingservices.trackdrive.com/api/v1/inbound_webhooks/post/check_for_available_buyers";

    const upstream = await axiosWithTimeout(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(payload),
    }, 10000);

    return res.status(upstream.status).json(upstream.data);
  } catch (err) {
    console.error("Post upstream error:", err.message || err);
    if (axios.isCancel(err)) {
      return res.status(504).json({ success: false, status: "timeout", errors: ["Upstream request timed out"] });
    }
    if (err.response) {
      return res.status(err.response.status || 502).json({
        success: false,
        status: "upstream_error",
        errors: [err.response.data?.errors?.join?.(", ") || err.response.data?.status || `Upstream status ${err.response.status}`],
      });
    }
    return res.status(500).json({ success: false, status: "error", errors: ["Server error: " + (err.message || "unknown")] });
  }
});

// ------------ GrowXForm3 Trackdrive ping and post endpoints -------------
// GET /api/ping3?caller_id=+1XXXXXXXXXX
app.get("/api/ping3", async (req, res) => {
  // Validate config presence (hardcoded above)
  if (!TRACKDRIVE_NUMBER_3 || !TRAFFIC_SOURCE_ID_3) {
    console.error("Missing TRACKDRIVE_NUMBER_3 or TRAFFIC_SOURCE_ID_3 (hardcoded)");
    return res.status(500).json({ success: false, status: "error", errors: ["Server misconfiguration"] });
  }

  const { caller_id, zip, dob_mm, dob_dd, dob_yyyy } = req.query;
  if (!caller_id || !/^\+1\d{10}$/.test(caller_id)) {
    return res.status(400).json({ success: false, status: "error", errors: ["Invalid or missing caller_id. Expected +1XXXXXXXXXX"] });
  }

  // Build the base URL with required parameters
  let apiUrl = `https://growxmarketingservices.trackdrive.com/api/v1/inbound_webhooks/ping/check_for_available_buyers?trackdrive_number=${encodeURIComponent(TRACKDRIVE_NUMBER_3)}&traffic_source_id=${encodeURIComponent(TRAFFIC_SOURCE_ID_3)}&caller_id=${encodeURIComponent(caller_id)}`;
  
  // Add additional parameters if provided
  if (zip) apiUrl += `&zip=${encodeURIComponent(zip)}`;
  if (dob_mm && dob_dd && dob_yyyy) {
    apiUrl += `&dob_mm=${encodeURIComponent(dob_mm)}&dob_dd=${encodeURIComponent(dob_dd)}&dob_yyyy=${encodeURIComponent(dob_yyyy)}`;
  }

  try {
    const upstream = await axiosWithTimeout(apiUrl, { method: "GET" }, 8000);
    return res.status(upstream.status).json(upstream.data);
  } catch (err) {
    console.error("Ping3 upstream error:", err.message || err);

    if (axios.isCancel(err)) {
      return res.status(504).json({ success: false, status: "timeout", errors: ["Upstream request timed out"] });
    }

    if (err.response) {
      return res.status(err.response.status || 502).json({
        success: false,
        status: "upstream_error",
        errors: [err.response.data?.errors?.join?.(", ") || err.response.data?.status || `Upstream status ${err.response.status}`],
      });
    }

    return res.status(500).json({ success: false, status: "error", errors: ["Server error: " + (err.message || "unknown")] });
  }
});

// POST /api/post3
app.post("/api/post3", async (req, res) => {
  if (!TRACKDRIVE_NUMBER_3 || !TRAFFIC_SOURCE_ID_3) {
    console.error("Missing TRACKDRIVE_NUMBER_3 or TRAFFIC_SOURCE_ID_3 (hardcoded)");
    return res.status(500).json({ success: false, status: "error", errors: ["Server misconfiguration"] });
  }

  try {
    const body = req.body || {};
    const required = ["ping_id", "caller_id", "zip", "dob_mm", "dob_dd", "dob_yyyy"];
    const missing = required.filter(k => !body[k]);
    if (missing.length) {
      return res.status(400).json({ success: false, status: "error", errors: ["Missing required fields: " + missing.join(", ")] });
    }

    const payload = {
      ...body,
      trackdrive_number: TRACKDRIVE_NUMBER_3,
      traffic_source_id: TRAFFIC_SOURCE_ID_3,
    };

    const apiUrl = "https://growxmarketingservices.trackdrive.com/api/v1/inbound_webhooks/post/check_for_available_buyers";

    const upstream = await axiosWithTimeout(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      data: JSON.stringify(payload),
    }, 10000);

    return res.status(upstream.status).json(upstream.data);
  } catch (err) {
    console.error("Post3 upstream error:", err.message || err);
    if (axios.isCancel(err)) {
      return res.status(504).json({ success: false, status: "timeout", errors: ["Upstream request timed out"] });
    }
    if (err.response) {
      return res.status(err.response.status || 502).json({
        success: false,
        status: "upstream_error",
        errors: [err.response.data?.errors?.join?.(", ") || err.response.data?.status || `Upstream status ${err.response.status}`],
      });
    }
    return res.status(500).json({ success: false, status: "error", errors: ["Server error: " + (err.message || "unknown")] });
  }
});

// ----- Serve built frontend in production -----
// Vite typically outputs to `dist` by default. Adjust if you changed it.
const distPath = path.join(__dirname, "..", "dist");

if (fs.existsSync(distPath)) {
  console.log("Serving static files from:", distPath);
  app.use(express.static(distPath));

  // catch-all: return index.html for client routing (SPA)
  app.get("*", (req, res) => {
    res.sendFile(path.join(distPath, "index.html"));
  });
} else {
  console.log("Dist folder not found; skipping static file serving (dev mode).");
}

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));