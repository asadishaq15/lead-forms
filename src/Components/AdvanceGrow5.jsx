import React, { useState } from "react";

const SSDICallTransfer = () => {
  const [formData, setFormData] = useState({
    lead_token: "a9faecfbeddd4d57bae3d325800181af",
    caller_id: "",
    traffic_source_id: "1000",
    first_name: "",
    last_name: "",
    state: "",
    zip: "",
    dob: "",
    email: "",
  });

  const [error, setError] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);

    const requiredFields = [
      "caller_id",
      "first_name",
      "last_name",
      "state",
      "zip",
      "dob",
      "email",
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

    // Validate DOB: YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
      setError("Please enter a valid Date of Birth in YYYY-MM-DD format.");
      return;
    }

    // Validate Email
    if (
      !/^([a-zA-Z0-9._%+-]+)@([a-zA-Z0-9.-]+\.[a-zA-Z]{2,})$/.test(
        formData.email
      )
    ) {
      setError("Please enter a valid email address.");
      return;
    }

    // Validate Phone (simple validation for demonstration)
    if (!/^\+?[1-9]\d{1,14}$/.test(formData.caller_id)) {
      setError("Please enter a valid phone number.");
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
          alert("Lead submitted successfully!");
          setFormData((prev) => ({
            ...prev,
            caller_id: "",
            first_name: "",
            last_name: "",
            state: "",
            zip: "",
            dob: "",
            email: "",
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
  };

  // US States for dropdown
  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-800 py-6">
          <h2 className="text-center text-3xl font-extrabold text-white px-4">
          SSDI CPL IM
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
              </div>
            </div>
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
                  placeholder="1980-12-31"
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  maxLength={10}
                  pattern="\d{4}-\d{2}-\d{2}"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  placeholder="example@gmail.com"
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Format: +17194451111 or 7194451111
                </p>
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                  maxLength={5}
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
                >
                  <option value="">Select a state</option>
                  {states.map((state) => (
                    <option key={state} value={state}>
                      {state}
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-200 bg-gray-100 shadow-sm text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Static Value: a9faecfbeddd4d57bae3d325800181af
                </p>
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
                  className="mt-1 block w-full rounded-md border-2 border-gray-200 bg-gray-100 shadow-sm text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Static Value: 1000
                </p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Submit SSDI Lead
            </button>
          </div>
          
    
        </form>
      </div>
    </div>
  );
};

export default SSDICallTransfer;