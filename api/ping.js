export default async function handler(req, res) {
    const { trackdrive_number, traffic_source_id, caller_id } = req.query;
  
    if (!trackdrive_number || !traffic_source_id || !caller_id) {
      res.status(400).json({ error: "Missing required parameters" });
      return;
    }
  
    const url = `https://kbb-sales-group-llc.trackdrive.com/api/v1/inbound_webhooks/ping/check_for_available_aca_buyers?trackdrive_number=${encodeURIComponent(trackdrive_number)}&traffic_source_id=${encodeURIComponent(traffic_source_id)}&caller_id=${encodeURIComponent(caller_id)}`;
  
    try {
      const response = await fetch(url);
      const data = await response.json();
      res.status(200).json(data);
    } catch (error) {
      res.status(500).json({ error: error.message });
    }
  }