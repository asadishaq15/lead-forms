export default async function handler(req, res) {
  try {
    const { trackdrive_number, traffic_source_id, caller_id } = req.query;
  
    if (!trackdrive_number || !traffic_source_id || !caller_id) {
      return res.status(400).json({ 
        success: false, 
        errors: ["Missing required parameters. Must include trackdrive_number, traffic_source_id, and caller_id"] 
      });
    }
  
    const url = `https://growxmarketingservices.trackdrive.com/api/v1/inbound_webhooks/ping/check_for_available_buyers?trackdrive_number=${encodeURIComponent(trackdrive_number)}&traffic_source_id=${encodeURIComponent(traffic_source_id)}&caller_id=${encodeURIComponent(caller_id)}`;
  
    console.log("Making request to:", url);
    
    const response = await fetch(url);
    
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
    
    return res.status(200).json(data);
  } catch (error) {
    console.error("API Error:", error);
    return res.status(500).json({ 
      success: false, 
      errors: [error.message || "An unexpected error occurred"] 
    });
  }
}