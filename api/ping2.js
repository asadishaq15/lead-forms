// /pages/api/ping2.js
export default async function handler(req, res) {
  try {
    const { 
      trackdrive_number, 
      traffic_source_id, 
      caller_id,
      zip,
      age,
      first_name,
      last_name 
    } = req.query;
    
    // Validate required parameters
    if (!trackdrive_number || !traffic_source_id || !caller_id) {
      return res.status(400).json({
        success: false,
        status: "error",
        errors: ["Missing required parameters"]
      });
    }
    
    // Build the base URL with required query parameters
    let apiUrl = `https://growxmarketingservices.trackdrive.com/api/v1/inbound_webhooks/ping/check_for_available_buyers?trackdrive_number=${encodeURIComponent(trackdrive_number)}&traffic_source_id=${encodeURIComponent(traffic_source_id)}&caller_id=${encodeURIComponent(caller_id)}`;
    
    // Add the additional parameters to the URL if they exist
    if (zip) apiUrl += `&zip=${encodeURIComponent(zip)}`;
    if (age) apiUrl += `&age=${encodeURIComponent(age)}`;
    if (first_name) apiUrl += `&first_name=${encodeURIComponent(first_name)}`;
    if (last_name) apiUrl += `&last_name=${encodeURIComponent(last_name)}`;
    
    // Make the request to Growx Marketing Services
    const response = await fetch(apiUrl);
    
    // Get the response data
    const data = await response.json();
    
    // Return the API response to the client
    return res.status(response.status).json(data);
  } catch (error) {
    console.error('Error in ping2 API:', error);
    return res.status(500).json({
      success: false,
      status: "error",
      errors: ["Server error: " + error.message]
    });
  }
}