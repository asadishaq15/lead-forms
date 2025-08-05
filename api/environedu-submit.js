// api/environedu-submit.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const formData = req.body;
  console.log("Received form data:", formData);

  try {
    // Create a new URLSearchParams object for the query string
    const params = new URLSearchParams();
    
    // Map all required fields from the form data to EnvironEdu API parameters
    params.append('fname', formData.first_name || '');
    params.append('lname', formData.last_name || '');
    params.append('city', formData.city || '');
    params.append('state', formData.state || '');
    params.append('zip', formData.zip || '');
    params.append('email', formData.email || '');
    params.append('p1', formData.caller_id || '');
    params.append('date_of_birth', formData.dob || '');
    params.append('dob', formData.dob || '');
    
    // Optional fields
    params.append('a1', formData.a1 || '');
    params.append('a2', formData.a2 || '');
    params.append('gender', formData.gender || '');
    
    // Tracking parameters
    params.append('LeadID', formData.jornaya_leadid || '');
    params.append('OptInIp', formData.OptInIp || req.headers['x-forwarded-for'] || '34.228.200.245');
    params.append('subid', formData.traffic_source_id || '74');
    
    // Important: Add a valid list ID
    // Generate a list ID in format YYYYMMDDXXX where XXX is a 3-digit number
    const today = new Date();
    const year = today.getFullYear();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const randomNum = Math.floor(Math.random() * 999) + 1;
    const formattedRandomNum = String(randomNum).padStart(3, '0');
    const lid = `${year}${month}${day}${formattedRandomNum}`;
    
    params.append('lid', lid);
    
    // Other required tracking parameters
    params.append('SignupURL', 'jobfindernews.com');
    params.append('ConsentURL', 'jobfindernews.com');
    params.append('xxTrustedFormToken', formData.lead_token || 'https://cert.trustedform.com/a1265e943029421f3fae37fc45fd4bd04a050400');
    params.append('RecordID', Math.floor(Math.random() * 1000000).toString());
    
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