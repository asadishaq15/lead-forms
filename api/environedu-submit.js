// api/environedu-submit.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  // Only accept POST method for form submissions
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const formData = req.body;

  try {
    // Build the query string with the correct field names expected by the API
    // Use the exact field names from the API documentation
    const params = new URLSearchParams();
    
    // Add all fields from formData directly - they should already match expected API fields
    Object.keys(formData).forEach(key => {
      if (formData[key] !== undefined && formData[key] !== null) {
        params.append(key, formData[key]);
      }
    });
    
    // Generate a new unique list ID for each submission to avoid duplication errors
    // This is likely the cause of the 400 error on second submission
    if (!params.has('lid')) {
      const today = new Date();
      const year = today.getFullYear();
      const month = String(today.getMonth() + 1).padStart(2, '0');
      const day = String(today.getDate()).padStart(2, '0');
      const randomNum = Math.floor(Math.random() * 999) + 1;
      const formattedRandomNum = String(randomNum).padStart(3, '0');
      params.append('lid', `${year}${month}${day}${formattedRandomNum}`);
    }
    
    // Ensure we have IP address
    if (!params.has('OptInIp') || !params.get('OptInIp')) {
      params.set('OptInIp', req.headers['x-forwarded-for'] || '127.0.0.1');
    }
    
    // Compose the EnvironEdu API URL - using GET method as specified in documentation
    const url = `https://environedu.com/webpost/post?${params.toString()}`;
    
    console.log("Sending request to:", url);

    // Make the GET request to EnvironEdu
    const response = await fetch(url);
    const responseText = await response.text();
    
    console.log("Response from EnvironEdu:", responseText);

    // Check if response contains error messages
    if (!response.ok || 
        responseText.includes('Failed for selected list ID') || 
        responseText.includes('error') || 
        responseText.includes('Error')) {
      return res.status(400).send(responseText);
    }

    return res.status(200).send(responseText);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).send(`Server error: ${error.message}`);
  }
}