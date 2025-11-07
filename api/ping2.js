// /pages/api/ping.js
export default async function handler(req, res) {
    try {
      const { trackdrive_number, traffic_source_id, caller_id } = req.query;
      
      // Validate required parameters
      if (!trackdrive_number || !traffic_source_id || !caller_id) {
        return res.status(400).json({
          success: false,
          status: "error",
          errors: ["Missing required parameters"]
        });
      }
      
      // Build the URL with query parameters
      const apiUrl = `https://growxmarketingservices.trackdrive.com/api/v1/inbound_webhooks/ping/check_for_available_buyers?trackdrive_number=${encodeURIComponent(trackdrive_number)}&traffic_source_id=${encodeURIComponent(traffic_source_id)}&caller_id=${encodeURIComponent(caller_id)}`;
      
      // Make the request to Growx Marketing Services
      const response = await fetch(apiUrl);
      
      // Get the response data
      const data = await response.json();
      
      // Return the API response to the client
      return res.status(response.status).json(data);
    } catch (error) {
      console.error('Error in ping API:', error);
      return res.status(500).json({
        success: false,
        status: "error",
        errors: ["Server error: " + error.message]
      });
    }
  }