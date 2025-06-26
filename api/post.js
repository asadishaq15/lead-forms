export default async function handler(req, res) {
    if (req.method !== "POST") {
      res.status(405).json({ error: "Method not allowed" });
      return;
    }
  
    // Get the body from the request
    let body = req.body;
    // If body is a string (Vercel edge case), parse it as JSON
    if (typeof body === "string") {
      try {
        body = JSON.parse(body);
      } catch (err) {
        res.status(400).json({ error: "Invalid JSON" });
        return;
      }
    }
  
    try {
      const response = await fetch(
        "https://kbb-sales-group-llc.trackdrive.com/api/v1/inbound_webhooks/post/check_for_available_aca_buyers",
        {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(body),
        }
      );
      const data = await response.json();
      res.status(response.status).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }