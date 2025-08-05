// api/environedu-submit.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const formData = req.body;

  try {
    // Create a new URLSearchParams object for the query string
    const params = new URLSearchParams();
    
    // Map frontend field names to EnvironEdu API field names
    // Handle required fields directly
    params.append('fname', formData.first_name || formData.fname || '');
    params.append('lname', formData.last_name || formData.lname || '');
    params.append('city', formData.city || '');
    params.append('state', formData.state || '');
    params.append('zip', formData.zip || '');
    params.append('email', formData.email || '');
    params.append('p1', formData.caller_id || formData.p1 || '');
    params.append('date_of_birth', formData.dob || formData.date_of_birth || '');
    params.append('dob', formData.dob || formData.date_of_birth || '');
    
    // Optional fields
    params.append('a1', formData.a1 || '');
    params.append('a2', formData.a2 || '');
    params.append('gender', formData.gender || '');
    
    // Tracking parameters
    params.append('LeadID', formData.jornaya_leadid || formData.LeadID || '');
    params.append('OptInIp', formData.OptInIp || req.headers['x-forwarded-for'] || '127.0.0.1');
    params.append('subid', formData.traffic_source_id || formData.subid || '74');
    
    // Critical fix - ensure we have a valid list ID
    const lid = formData.lid || '20250714001'; // Use default if not provided
    params.append('lid', lid);
    
    // Other required tracking parameters
    params.append('SignupURL', formData.SignupURL || 'jobfindernews.com');
    params.append('ConsentURL', formData.ConsentURL || 'jobfindernews.com');
    params.append('xxTrustedFormToken', formData.lead_token || formData.xxTrustedFormToken || 'https://cert.trustedform.com/a1265e943029421f3fae37fc45fd4bd04a050400');
    params.append('RecordID', formData.RecordID || Math.floor(Math.random() * 1000000).toString());
    
    // Compose the EnvironEdu API URL
    const url = `https://environedu.com/webpost/post?${params.toString()}`;
    
    console.log("Sending request to:", url);

    // Make the request
    const response = await fetch(url);
    const responseText = await response.text();
    
    console.log("Response from EnvironEdu:", responseText);

    // Check if response contains error messages
    if (!response.ok || 
        responseText.includes('Failed for selected list ID') || 
        responseText.includes('error') || 
        responseText.includes('Error') ||
        responseText.includes('No valid list ID found')) {
      return res.status(400).send(responseText);
    }

    return res.status(200).send(responseText);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).send(`Server error: ${error.message}`);
  }
}