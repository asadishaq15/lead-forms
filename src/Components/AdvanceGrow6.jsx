import React, { useState } from "react";

const ACAInboundForm = () => {
  const [formData, setFormData] = useState({
    lead_token: "52ea7210c5e34ee390b25644832db924",
    caller_id: "",
    traffic_source_id: "1000",
    first_name: "",
    last_name: "",
    state: "",
    zip: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const requiredFields = [
      "caller_id",
      "first_name",
      "last_name",
      "state",
      "zip",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(
          `Field "${field.replace(/_/g, " ")}" is required.`
        );
        return;
      }
    }

    if (!/^\d{5}$/.test(formData.zip)) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }

    const baseUrl =
      "https://growxmarketingservices.trackdrive.com/api/v1/leads";
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
          setSuccess("Lead submitted successfully!");
          // Reset form fields except for the tokens
          setFormData((prev) => ({
            ...prev,
            caller_id: "",
            first_name: "",
            last_name: "",
            state: "",
            zip: "",
          }));
        } else {
          const errorMessage =
            data.message ||
            data.error ||
            (data.errors &&
              Object.values(data.errors).flat().join(", ")) ||
            "Failed to submit lead. Please try again.";
          setError(errorMessage);
        }
      })
      .catch((error) => {
        setError(
          error.message ||
            "Network error occurred. Please check your connection and try again."
        );
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  // US States for dropdown
  const states = [
    { name: "Alabama", code: "AL" },
    { name: "Alaska", code: "AK" },
    { name: "Arizona", code: "AZ" },
    { name: "Arkansas", code: "AR" },
    { name: "California", code: "CA" },
    { name: "Colorado", code: "CO" },
    { name: "Connecticut", code: "CT" },
    { name: "Delaware", code: "DE" },
    { name: "District Of Columbia", code: "DC" },
    { name: "Florida", code: "FL" },
    { name: "Georgia", code: "GA" },
    { name: "Hawaii", code: "HI" },
    { name: "Idaho", code: "ID" },
    { name: "Illinois", code: "IL" },
    { name: "Indiana", code: "IN" },
    { name: "Iowa", code: "IA" },
    { name: "Kansas", code: "KS" },
    { name: "Kentucky", code: "KY" },
    { name: "Louisiana", code: "LA" },
    { name: "Maine", code: "ME" },
    { name: "Maryland", code: "MD" },
    { name: "Massachusetts", code: "MA" },
    { name: "Michigan", code: "MI" },
    { name: "Minnesota", code: "MN" },
    { name: "Mississippi", code: "MS" },
    { name: "Missouri", code: "MO" },
    { name: "Montana", code: "MT" },
    { name: "Nebraska", code: "NE" },
    { name: "Nevada", code: "NV" },
    { name: "New Hampshire", code: "NH" },
    { name: "New Jersey", code: "NJ" },
    { name: "New Mexico", code: "NM" },
    { name: "New York", code: "NY" },
    { name: "North Carolina", code: "NC" },
    { name: "North Dakota", code: "ND" },
    { name: "Ohio", code: "OH" },
    { name: "Oklahoma", code: "OK" },
    { name: "Oregon", code: "OR" },
    { name: "Pennsylvania", code: "PA" },
    { name: "Rhode Island", code: "RI" },
    { name: "South Carolina", code: "SC" },
    { name: "South Dakota", code: "SD" },
    { name: "Tennessee", code: "TN" },
    { name: "Texas", code: "TX" },
    { name: "Utah", code: "UT" },
    { name: "Vermont", code: "VT" },
    { name: "Virginia", code: "VA" },
    { name: "Washington", code: "WA" },
    { name: "West Virginia", code: "WV" },
    { name: "Wisconsin", code: "WI" },
    { name: "Wyoming", code: "WY" }
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-6">
          <h2 className="text-center text-3xl font-extrabold text-white px-4">
          ACA MI 22
          </h2>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-red-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}

        {success && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <svg
                  className="h-5 w-5 text-green-400"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">{success}</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
          {/* Personal Information */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
              Lead Information
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 p-2"
                  placeholder="John"
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 p-2"
                  placeholder="Smith"
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
                  Phone Number (Caller ID) *
                </label>
                <input
                  type="tel"
                  name="caller_id"
                  value={formData.caller_id}
                  onChange={handleChange}
                  required
                  placeholder="+17194451111"
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 p-2"
                />
                <p className="mt-1 text-xs text-gray-500">Format: +1 followed by 10 digits</p>
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
                  maxLength={5}
                  pattern="[0-9]{5}"
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-gray-500 focus:ring-gray-500 p-2"
                >
                  <option value="">Select a state</option>
                  {states.map((state) => (
                    <option key={state.code} value={state.code}>
                      {state.name} ({state.code})
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Hidden Fields Section */}
          <div className="space-y-6">
            <h3 className="text-xl font-semibold text-gray-900 border-b pb-2">
              System Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Lead Token
                </label>
                <input
                  type="text"
                  name="lead_token"
                  value={formData.lead_token}
                  disabled
                  className="mt-1 block w-full rounded-md border-2 border-gray-200 bg-gray-100 shadow-sm text-gray-500 p-2"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Traffic Source ID
                </label>
                <input
                  type="text"
                  name="traffic_source_id"
                  value={formData.traffic_source_id}
                  disabled
                  className="mt-1 block w-full rounded-md border-2 border-gray-200 bg-gray-100 shadow-sm text-gray-500 p-2"
                />
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150"
            >
              Submit Lead
            </button>
          </div>
        </form>

        <div className="bg-gray-50 p-4 border-t border-gray-200 text-center text-xs text-gray-500">
          Growx Marketing Services - ACA Inbound Call Transfer • Offer ID: 10021905
        </div>
      </div>
    </div>
  );
};

export default ACAInboundForm;