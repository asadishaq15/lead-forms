// api/environedu-submit.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Accept both GET and POST methods
  const formData = req.method === 'GET' ? req.query : req.body;

  try {
    // Build the query string with the correct field names
    const params = new URLSearchParams();
    
    // Map form fields to API fields
    if (formData.first_name) params.append('fname', formData.first_name);
    if (formData.last_name) params.append('lname', formData.last_name);
    if (formData.city) params.append('city', formData.city || 'Not Provided');
    if (formData.state) params.append('state', formData.state);
    if (formData.zip) params.append('zip', formData.zip);
    if (formData.email) params.append('email', formData.email);
    if (formData.caller_id) params.append('p1', formData.caller_id);
    if (formData.dob) {
      params.append('date_of_birth', formData.dob);
      params.append('dob', formData.dob);
    }
    
    // Add tracking parameters
    if (formData.jornaya_leadid) params.append('LeadID', formData.jornaya_leadid);
    
    // Add required fields with default values if not provided
    params.append('OptInIp', req.headers['x-forwarded-for'] || '127.0.0.1');
    params.append('subid', formData.traffic_source_id || '74');
    params.append('lid', '20250714001');
    params.append('SignupURL', req.headers.referer || 'lead-forms-ten.vercel.app');
    params.append('ConsentURL', req.headers.referer || 'lead-forms-ten.vercel.app');
    params.append('xxTrustedFormToken', 'https://cert.trustedform.com/blank');
    params.append('RecordID', Date.now().toString());

    // Compose the EnvironEdu API URL
    const url = `https://environedu.com/webpost/post?${params.toString()}`;
    
    console.log("Sending request to:", url);

    // Make the GET request to EnvironEdu
    const response = await fetch(url);
    const responseText = await response.text();
    
    console.log("Response from EnvironEdu:", responseText);

    // If response is not ok or contains common error phrases
    if (responseText.includes('Failed for selected list ID') || !response.ok) {
      return res.status(400).send(responseText);
    }

    return res.status(200).send(responseText);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).send(`Server error: ${error.message}`);
  }
}