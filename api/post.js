export default async function handler(req, res) {
  if (req.method !== "POST") {
    res.status(405).json({ success: false, errors: ["Method not allowed"] });
    return;
  }

  // Get the body from the request
  let body = req.body;
  // If body is a string (Vercel edge case), parse it as JSON
  if (typeof body === "string") {
    try {
      body = JSON.parse(body);
    } catch (err) {
      res.status(400).json({ success: false, errors: ["Invalid JSON in request body"] });
      return;
    }
  }

  // Validate required fields
  if (!body.trackdrive_number || !body.traffic_source_id || !body.caller_id || !body.ping_id) {
    return res.status(400).json({
      success: false,
      errors: ["Missing required fields. Must include trackdrive_number, traffic_source_id, caller_id, and ping_id"]
    });
  }

  try {
    console.log("Sending POST request with body:", JSON.stringify(body));
    
    const response = await fetch(
      "https://growxmarketingservices.trackdrive.com/api/v1/inbound_webhooks/post/check_for_available_buyers",
      {
        method: "POST",
        headers: { "Content-Type": "application/json", Accept: "application/json" },
        body: JSON.stringify(body),
      }
    );
    
    // Check response type from content-type header
    const contentType = response.headers.get("content-type");
    
    // Get the response text first
    const responseText = await response.text();
    console.log("Response status:", response.status);
    console.log("Content-Type:", contentType);
    console.log("Response text (first 500 chars):", responseText.substring(0, 500));
    
    // If not JSON, return an error with details
    if (!contentType || !contentType.includes("application/json")) {
      return res.status(response.status || 500).json({
        success: false,
        errors: [`External API responded with non-JSON content (${contentType})`],
        statusCode: response.status,
        responsePreview: responseText.substring(0, 200)
      });
    }
    
    // If we got here, try to parse JSON
    let data;
    try {
      data = JSON.parse(responseText);
    } catch (e) {
      return res.status(500).json({
        success: false,
        errors: ["Failed to parse API response as JSON"],
        responsePreview: responseText.substring(0, 200)
      });
    }
    
    res.status(response.status).json(data);
  } catch (error) {
    console.error("POST Error:", error);
    res.status(500).json({ success: false, errors: [error.message || "An unexpected error occurred"] });
  }
}