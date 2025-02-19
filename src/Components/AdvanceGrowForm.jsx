import React, { useState } from "react";

const AdvanceGrowMarketingLeadForm = () => {
  const [formData, setFormData] = useState({
    lead_token: "ce64ddcd6d14495bb04dce8ed509125e",
    caller_id: "",
    traffic_source_id: "10003",
    first_name: "",
    last_name: "",
    email: "",
    city: "",
    zip: "",
    dob: "",
    jornaya_leadid: "",
    source_url: "",
  });

  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

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
        setError(`Field "${field.replace(/_/g, " ")}" is required.`);
        return;
      }
    }

    if (!/^\d{5}$/.test(formData.zip)) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }

    // Date validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.dob)) {
      setError("Please enter a valid date in YYYY-MM-DD format.");
      return;
    }

    const baseUrl = "https://advance-grow-marketing.trackdrive.com/api/v1/leads";
    const params = new URLSearchParams(formData);
    const url = `${baseUrl}?${params.toString()}`;

    fetch(url, {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          alert("Lead submitted successfully!");
          // Clear form after successful submission
          setFormData(prev => ({
            ...prev,
            caller_id: "",
            first_name: "",
            last_name: "",
            email: "",
            city: "",
            zip: "",
            dob: "",
            jornaya_leadid: "",
            source_url: "",
          }));
        } else {
          // Handle specific error messages from API
          const errorMessage = data.message || 
                             data.error || 
                             (data.errors && Object.values(data.errors).flat().join(", ")) ||
                             "Failed to submit lead. Please try again.";
          setError(errorMessage);
        }
      })
      .catch((error) => {
        setError(
          error.message || "Network error occurred. Please check your connection and try again."
        );
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
          <h2 className="text-center text-3xl font-extrabold text-white px-4">
            GrowX Marketing Services Lead Form
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

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