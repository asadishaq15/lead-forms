// /pages/api/post3.js
export default async function handler(req, res) {
    // Only allow POST requests
    if (req.method !== 'POST') {
      return res.status(405).json({ 
        success: false, 
        status: "error", 
        errors: ["Method not allowed"] 
      });
    }
    
    try {
      const { 
        ping_id,
        trackdrive_number,
        traffic_source_id,
        caller_id,
        zip,
        dob_mm,
        dob_dd,
        dob_yyyy
      } = req.body;
      
      // Validate required fields
      if (!ping_id || !trackdrive_number || !traffic_source_id || !caller_id || !zip || !dob_mm || !dob_dd || !dob_yyyy) {
        return res.status(400).json({
          success: false,
          status: "error",
          errors: ["Missing required fields"]
        });
      }
      
      // Define the URL for the POST request
      const apiUrl = "https://growxmarketingservices.trackdrive.com/api/v1/inbound_webhooks/post/check_for_available_buyers";
      
      // Make the POST request to Growx Marketing Services
      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(req.body)
      });
      
      // Get the response data
      const data = await response.json();
      
      // Return the API response to the client
      return res.status(response.status).json(data);
    } catch (error) {
      console.error('Error in post3 API:', error);
      return res.status(500).json({
        success: false,
        status: "error",
        errors: ["Server error: " + error.message]
      });
    }
  }