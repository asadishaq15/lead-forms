import React, { useState } from "react";

const KBBLeadForm = () => {
  const [formData, setFormData] = useState({
    lead_token: "01cdcd9dfdc94211abed367075cd88db",
    caller_id: "",
    traffic_source_id: "1013",
    first_name: "",
    last_name: "",
    trusted_form_cert_url_agent: "",
    original_lead_submit_date: "",
    ip_address: "",
    customer_age: "",
    gender: "",
    zip_code: "",
    email: "",
    phone: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate the required fields
    if (!formData.caller_id) {
      alert("Caller ID is required.");
      return;
    }
    if (!formData.first_name || !formData.last_name) {
      alert("First and Last Name are required.");
      return;
    }
    if (!formData.customer_age) {
      alert("Customer Age is required.");
      return;
    }
    if (!formData.gender) {
      alert("Gender is required.");
      return;
    }
    if (!formData.zip_code || !/^\d{5}$/.test(formData.zip_code)) {
      alert("Valid 5-digit ZIP code is required.");
      return;
    }
    if (!formData.email || !/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Valid email address is required.");
      return;
    }
      // Clean the phone number by removing all non-digits
      const cleanedPhone = formData.phone.replace(/\D/g, '');
    
      // Remove leading '1' if present and check if remaining digits are exactly 10
      const phoneToCheck = cleanedPhone.startsWith('1') 
        ? cleanedPhone.slice(1) 
        : cleanedPhone;
  
      // Update validation logic for phone
      if (!phoneToCheck || phoneToCheck.length !== 10) {
        alert("Valid 10-digit phone number is required.");
        return;
      }
  

    // Validate customer age is within the accepted range
    const age = parseInt(formData.customer_age, 10);
    if (age < 40 || age > 99) {
      alert("Customer Age must be between 40 and 99.");
      return;
    }

    // Construct Ringba URL with new parameters
    const ringbaBaseUrl = "https://rtb.ringba.com/v1/production/c4b33cefd2df4c518650d8c5ee78b813.json";
    const ringbaParams = new URLSearchParams({
      CID: "14061571951",
      zip_code: formData.zip_code,
      email: formData.email,
      phone: formData.phone,
    });
    const ringbaUrl = `${ringbaBaseUrl}?${ringbaParams.toString()}`;

    // Prepare data for KBB submission
    const params = new URLSearchParams({
      lead_token: formData.lead_token,
      caller_id: formData.caller_id,
      traffic_source_id: formData.traffic_source_id,
      first_name: formData.first_name,
      last_name: formData.last_name,
      trusted_form_cert_url_agent: formData.trusted_form_cert_url_agent,
      original_lead_submit_date: formData.original_lead_submit_date,
      ip_address: formData.ip_address,
      customer_age: formData.customer_age,
      gender: formData.gender,
    });

    console.log(`Ringba URL: ${ringbaUrl}`);
    console.log(`KBB Query String: ${params.toString()}`);

    const baseUrl = "https://kbb-sales-group-llc.trackdrive.com/api/v1/leads";
    const url = `${baseUrl}?${params.toString()}`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        console.log("API Response:", data);
        if (data.success) {
          alert("Lead submitted successfully!");
        } else {
          throw new Error("Failed to submit lead. Please try again.");
        }
      })
      .catch((error) => {
        alert(`Error: ${error.message}`);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-800 py-6">
          <h2 className="text-center text-3xl font-extrabold text-white px-4">
            KBB Sales Group Lead Submission Form
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
          {/* Personal Information Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Contact Information Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="1234567890"
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zip_code"
                  value={formData.zip_code}
                  onChange={handleChange}
                  required
                  placeholder="12345"
                  maxLength="5"
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Customer Age Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
              Customer Age
            </h3>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Age (40-99) *
              </label>
              <input
                type="number"
                name="customer_age"
                value={formData.customer_age}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 bg-white"
              />
            </div>
          </div>

          {/* Additional Information Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Caller ID *
                </label>
                <input
                  type="text"
                  name="caller_id"
                  value={formData.caller_id}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 bg-white"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Trusted Form URL (Agent)
                </label>
                <input
                  type="text"
                  name="trusted_form_cert_url_agent"
                  value={formData.trusted_form_cert_url_agent}
                  onChange={handleChange}
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 bg-white"
                />
              </div>
            </div>
          </div>

          {/* Gender */}
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Gender *
            </label>
            <select
              name="gender"
              value={formData.gender}
              onChange={handleChange}
              required
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 bg-white"
            >
              <option value="">Select</option>
              <option value="M">Male</option>
              <option value="F">Female</option>
            </select>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Submit Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default KBBLeadForm;