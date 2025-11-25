// /pages/api/ping4.js
export default async function handler(req, res) {
    try {
      const { 
        trackdrive_number, 
        traffic_source_id, 
        caller_id,
        first_name,
        last_name,
        email,
        address,
        city,
        state,
        zip,
        dob,
        dob_mm,
        dob_dd,
        dob_yyyy,
        trusted_form_cert_url
      } = req.query;
      
      // Validate required parameters
      if (!trackdrive_number || !traffic_source_id || !caller_id || !dob) {
        return res.status(400).json({
          success: false,
          status: "error",
          errors: ["Missing required parameters: trackdrive_number, traffic_source_id, caller_id, and dob are required"]
        });
      }
      
      // Build the base URL with required query parameters
      let apiUrl = `https://growxmarketingservices.trackdrive.com/api/v1/inbound_webhooks/ping/check_for_available_ssdi_cpa_dm_buyers?trackdrive_number=${encodeURIComponent(trackdrive_number)}&traffic_source_id=${encodeURIComponent(traffic_source_id)}&caller_id=${encodeURIComponent(caller_id)}&dob=${encodeURIComponent(dob)}`;
      
      // Add all additional parameters to the URL if they exist
      if (first_name) apiUrl += `&first_name=${encodeURIComponent(first_name)}`;
      if (last_name) apiUrl += `&last_name=${encodeURIComponent(last_name)}`;
      if (email) apiUrl += `&email=${encodeURIComponent(email)}`;
      if (address) apiUrl += `&address=${encodeURIComponent(address)}`;
      if (city) apiUrl += `&city=${encodeURIComponent(city)}`;
      if (state) apiUrl += `&state=${encodeURIComponent(state)}`;
      if (zip) apiUrl += `&zip=${encodeURIComponent(zip)}`;
      if (trusted_form_cert_url) apiUrl += `&trusted_form_cert_url=${encodeURIComponent(trusted_form_cert_url)}`;
      
      // Make the request to Growx Marketing Services
      const response = await fetch(apiUrl);
      
      // Get the response data
      const data = await response.json();
      
      // Return the API response to the client
      return res.status(response.status).json(data);
    } catch (error) {
      console.error('Error in ping4 API:', error);
      return res.status(500).json({
        success: false,
        status: "error",
        errors: ["Server error: " + error.message]
      });
    }
}