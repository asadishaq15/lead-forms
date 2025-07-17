// api/environedu-submit.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Only accept POST method for form submissions
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const formData = req.body;
    
    // Validate required fields
    const requiredFields = ['fname', 'lname', 'city', 'state', 'zip', 'p1', 'date_of_birth', 'LeadID'];
    for (const field of requiredFields) {
      if (!formData[field]) {
        return res.status(400).json({ error: `Missing required field: ${field}` });
      }
    }

    // Build the query string with all necessary parameters
    const params = new URLSearchParams();
    
    // Add all form fields directly (this ensures we have all the required parameters)
    for (const [key, value] of Object.entries(formData)) {
      if (value !== undefined && value !== null) {
        params.append(key, value);
      }
    }
    
    // Make sure the date fields are properly formatted
    if (formData.date_of_birth) {
      params.set('date_of_birth', formData.date_of_birth);
      params.set('dob', formData.date_of_birth);
    }
    
    // Set dynamic TrustedFormToken if not provided
    if (!formData.xxTrustedFormToken) {
      params.set('xxTrustedFormToken', 'https://cert.trustedform.com/blank');
    }
    
    // Ensure we have a valid IP address
    if (!formData.OptInIp) {
      params.set('OptInIp', req.headers['x-forwarded-for'] || '127.0.0.1');
    }
    
    // Make sure SignupURL and ConsentURL are set
    const referer = req.headers.referer || 'lead-forms-ten.vercel.app';
    if (!formData.SignupURL) params.set('SignupURL', referer);
    if (!formData.ConsentURL) params.set('ConsentURL', referer);
    
    // Compose the EnvironEdu API URL
    const url = `https://environedu.com/webpost/post?${params.toString()}`;
    
    console.log("Sending request to:", url);

    // Make the GET request to EnvironEdu
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; LeadFormClient/1.0)',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8'
      }
    });
    
    const responseText = await response.text();
    console.log("Response from EnvironEdu:", responseText);

    // If response contains error messages
    if (
      !response.ok || 
      responseText.includes('Failed for selected list ID') ||
      responseText.includes('error') ||
      responseText.includes('invalid')
    ) {
      return res.status(400).send(responseText);
    }

    // Return success response
    return res.status(200).send(responseText || 'Form submitted successfully');
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).send(`Server error: ${error.message}`);
  }
}