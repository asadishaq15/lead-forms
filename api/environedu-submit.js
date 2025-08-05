// api/environedu-submit.js

import fetch from 'node-fetch';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const formData = req.body;
  console.log("Received form data:", formData);

  try {
    // Build the params for EnvironEdu
    const params = new URLSearchParams();

    // Required Personal Info
    params.append('fname', formData.first_name || formData.fname || '');
    params.append('lname', formData.last_name || formData.lname || '');
    params.append('a1', formData.a1 || '');
    params.append('a2', formData.a2 || '');
    params.append('city', formData.city || '');
    params.append('state', formData.state || '');
    params.append('zip', formData.zip || '');
    params.append('email', formData.email || '');
    params.append('p1', formData.caller_id || formData.p1 || '');
    params.append('date_of_birth', formData.date_of_birth || formData.dob || '');
    params.append('dob', formData.date_of_birth || formData.dob || '');
    params.append('gender', formData.gender || '');

    // Tracking
    params.append('LeadID', formData.LeadID || formData.jornaya_leadid || '');
    params.append('OptInIp', formData.OptInIp || req.headers['x-forwarded-for'] || '127.0.0.1');
    params.append('subid', formData.subid || formData.traffic_source_id || '74');

    // **Set the static, valid LID here**
    params.append('lid', '20250714001');

    params.append('SignupURL', formData.SignupURL || 'jobfindernews.com');
    params.append('ConsentURL', formData.ConsentURL || 'jobfindernews.com');
    params.append('xxTrustedFormToken', formData.xxTrustedFormToken || formData.lead_token || '');
    params.append('RecordID', formData.RecordID || Math.floor(Math.random() * 1000000).toString());

    const url = `https://environedu.com/webpost/post?${params.toString()}`;

    // Log the full URL with each param on a new line for easy reading
    const [base, query] = url.split('?');
    console.log(
      base + '?\n' +
      decodeURIComponent(query)
        .split('&')
        .join('\n')
    );

    // Make the GET request
    const response = await fetch(url);
    const responseText = await response.text();

    console.log("Response from EnvironEdu:", responseText);

    // Basic error check
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