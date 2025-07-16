// api/environedu-submit.js

import fetch from 'node-fetch';

// This handler will accept GET requests with all form data as query parameters
export default async function handler(req, res) {
  if (req.method !== 'GET') {
    return res.status(405).send('Method Not Allowed');
  }

  try {
    // formData is all query params
    const formData = req.query;

    // Build the query string (redundant, but safe)
    const params = new URLSearchParams();
    Object.entries(formData).forEach(([key, value]) => {
      // URLSearchParams in Node handles arrays/multiple values automatically
      params.append(key, value);
    });

    // Compose the EnvironEdu API URL
    const url = `https://environedu.com/webpost/post?${params.toString()}`;

    // Make the GET request to EnvironEdu
    const response = await fetch(url);
    const responseText = await response.text();

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