// api/environedu-submit.js
import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    const formData = req.body;
    
    // Construct the query string
    const params = new URLSearchParams();
    
    // Add all form data to URL params
    Object.entries(formData).forEach(([key, value]) => {
      params.append(key, value);
    });
    
    // Make the GET request to EnvironEdu endpoint
    const url = `https://environedu.com/webpost/post?${params.toString()}`;
    
    const response = await fetch(url);
    const responseText = await response.text();
    
    // Check if the response contains error messages
    if (responseText.includes('Failed for selected list ID') || !response.ok) {
      return res.status(400).send(responseText);
    }
    
    return res.status(200).send(responseText);
  } catch (error) {
    console.error('API error:', error);
    return res.status(500).send(`Server error: ${error.message}`);
  }
}