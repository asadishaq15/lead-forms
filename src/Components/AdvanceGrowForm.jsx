import React, { useState } from "react";

const AdvanceGrowMarketingLeadForm = () => {
  const [formData, setFormData] = useState({
    lead_token: "ce64ddcd6d14495bb04dce8ed509125e", // Static value
    caller_id: "",
    traffic_source_id: "10003", // Static value
    first_name: "",
    last_name: "",
    email: "",
    city: "",
    zip: "",
    dob: "",
    jornaya_leadid: "",
    source_url: "",
  });

  const handleSubmit = (e) => {
    e.preventDefault();

    // Validate required fields
    const requiredFields = [
      "caller_id",
      "first_name",
      "last_name",
      "email",
      "city",
      "zip",
      "dob",
      "jornaya_leadid",
      "source_url",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        alert(`Field "${field.replace("_", " ")}" is required.`);
        return;
      }
    }

    if (!/^\d{5}$/.test(formData.zip)) {
      alert("Valid 5-digit ZIP code is required.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      alert("Valid email address is required.");
      return;
    }

    // Construct the POST URL
    const baseUrl =
      "https://advance-grow-marketing.trackdrive.com/api/v1/leads";
    const params = new URLSearchParams({
      lead_token: formData.lead_token,
      caller_id: formData.caller_id,
      traffic_source_id: formData.traffic_source_id,
      first_name: formData.first_name,
      last_name: formData.last_name,
      email: formData.email,
      city: formData.city,
      zip: formData.zip,
      dob: formData.dob,
      jornaya_leadid: formData.jornaya_leadid,
      source_url: formData.source_url,
    });

    const url = `${baseUrl}?${params.toString()}`;

    console.log(`Constructed POST URL: ${url}`);

    // Submit the form without CORS
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
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
          <h2 className="text-center text-3xl font-extrabold text-white px-4">
            Advance Grow Marketing Lead Form
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
          {/* Personal Information */}
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Caller ID (Phone) *
                </label>
                <input
                  type="tel"
                  name="caller_id"
                  value={formData.caller_id}
                  onChange={handleChange}
                  required
                  placeholder="+17194451111"
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                  placeholder="12345"
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Date of Birth (YYYY-MM-DD) *
                </label>
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  placeholder="YYYY-MM-DD"
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Jornaya Lead ID *
                </label>
                <input
                  type="text"
                  name="jornaya_leadid"
                  value={formData.jornaya_leadid}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Source URL *
                </label>
                <input
                  type="text"
                  name="source_url"
                  value={formData.source_url}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            >
              Submit Lead
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AdvanceGrowMarketingLeadForm;