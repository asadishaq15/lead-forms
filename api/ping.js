export default async function handler(req, res) {
    try {
      const { trackdrive_number, traffic_source_id, caller_id } = req.query;
    
      if (!trackdrive_number || !traffic_source_id || !caller_id) {
        return res.status(400).json({ success: false, errors: ["Missing required parameters"] });
      }
    
      const url = `https://kbb-sales-group-llc.trackdrive.com/api/v1/inbound_webhooks/ping/check_for_available_aca_buyers?trackdrive_number=${encodeURIComponent(trackdrive_number)}&traffic_source_id=${encodeURIComponent(traffic_source_id)}&caller_id=${encodeURIComponent(caller_id)}`;
    
      const response = await fetch(url);
      
      // Check if response is ok
      if (!response.ok) {
        return res.status(response.status).json({ 
          success: false, 
          errors: [`External API responded with status: ${response.status}`] 
        });
      }
      
      const data = await response.json();
      return res.status(200).json(data);
    } catch (error) {
      console.error("API Error:", error);
      return res.status(500).json({ 
        success: false, 
        errors: [error.message || "An unexpected error occurred"] 
      });
    }
  }