import React, { useState } from "react";

// US States abbreviation list
const US_STATES = [
  { name: "Alabama", abbr: "AL" },
  { name: "Alaska", abbr: "AK" },
  { name: "Arizona", abbr: "AZ" },
  { name: "Arkansas", abbr: "AR" },
  { name: "California", abbr: "CA" },
  { name: "Colorado", abbr: "CO" },
  { name: "Connecticut", abbr: "CT" },
  { name: "Delaware", abbr: "DE" },
  { name: "District Of Columbia", abbr: "DC" },
  { name: "Florida", abbr: "FL" },
  { name: "Georgia", abbr: "GA" },
  { name: "Hawaii", abbr: "HI" },
  { name: "Idaho", abbr: "ID" },
  { name: "Illinois", abbr: "IL" },
  { name: "Indiana", abbr: "IN" },
  { name: "Iowa", abbr: "IA" },
  { name: "Kansas", abbr: "KS" },
  { name: "Kentucky", abbr: "KY" },
  { name: "Louisiana", abbr: "LA" },
  { name: "Maine", abbr: "ME" },
  { name: "Maryland", abbr: "MD" },
  { name: "Massachusetts", abbr: "MA" },
  { name: "Michigan", abbr: "MI" },
  { name: "Minnesota", abbr: "MN" },
  { name: "Mississippi", abbr: "MS" },
  { name: "Missouri", abbr: "MO" },
  { name: "Montana", abbr: "MT" },
  { name: "Nebraska", abbr: "NE" },
  { name: "Nevada", abbr: "NV" },
  { name: "New Hampshire", abbr: "NH" },
  { name: "New Jersey", abbr: "NJ" },
  { name: "New Mexico", abbr: "NM" },
  { name: "New York", abbr: "NY" },
  { name: "North Carolina", abbr: "NC" },
  { name: "North Dakota", abbr: "ND" },
  { name: "Ohio", abbr: "OH" },
  { name: "Oklahoma", abbr: "OK" },
  { name: "Oregon", abbr: "OR" },
  { name: "Pennsylvania", abbr: "PA" },
  { name: "Rhode Island", abbr: "RI" },
  { name: "South Carolina", abbr: "SC" },
  { name: "South Dakota", abbr: "SD" },
  { name: "Tennessee", abbr: "TN" },
  { name: "Texas", abbr: "TX" },
  { name: "Utah", abbr: "UT" },
  { name: "Vermont", abbr: "VT" },
  { name: "Virginia", abbr: "VA" },
  { name: "Washington", abbr: "WA" },
  { name: "West Virginia", abbr: "WV" },
  { name: "Wisconsin", abbr: "WI" },
  { name: "Wyoming", abbr: "WY" },
];

const GrowXForm1 = () => {
  const [formData, setFormData] = useState({
    lead_token: "a9faecfbeddd4d57bae3d325800181af",
    traffic_source_id: "1000",
    first_name: "",
    last_name: "",
    caller_id: "",
    state: "",
    zip: "",
    age: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    // Required fields
    const requiredFields = [
      "first_name",
      "last_name",
      "caller_id",
      "state",
      "zip",
      "age",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(
          `Field "${field.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase())}" is required.`
        );
        return;
      }
    }

    // Phone validation - should start with + followed by digits
    if (!/^\+\d+$/.test(formData.caller_id)) {
      setError(
        "Please enter a valid phone number starting with + followed by country code and number (e.g. +17194451111)."
      );
      return;
    }

    // US ZIP code validation (5 digits)
    if (!/^\d{5}$/.test(formData.zip)) {
      setError("Please enter a valid 5-digit US Zip Code.");
      return;
    }

    // Age validation (18-120)
    const ageNum = Number(formData.age);
    if (
      !Number.isInteger(ageNum) ||
      ageNum < 18 ||
      ageNum > 120
    ) {
      setError("Please enter a valid age between 18 and 120.");
      return;
    }

    // State validation
    if (
      !US_STATES.some((st) => st.abbr === formData.state)
    ) {
      setError("Please select a valid US State.");
      return;
    }

    // POST to API
    const baseUrl = "https://growxmarketingservices.trackdrive.com/api/v1/leads";
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
            first_name: "",
            last_name: "",
            caller_id: "",
            state: "",
            zip: "",
            age: "",
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

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-lg bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-5">
          <h2 className="text-center text-2xl font-extrabold text-white px-4">
            SSDI CPA AKI
          </h2>
        </div>

        {error && (
          <div className="mx-4 mt-6 p-3 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-center">
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
              <p className="ml-3 text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {success && (
          <div className="mx-4 mt-6 p-3 bg-green-50 border-l-4 border-green-500 rounded">
            <div className="flex items-center">
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
              <p className="ml-3 text-sm text-green-700">{success}</p>
            </div>
          </div>
        )}

        <form
          onSubmit={handleSubmit}
          className="px-6 py-6 sm:py-8"
          autoComplete="off"
        >
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-4">
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                First Name *
              </label>
              <input
                type="text"
                name="first_name"
                value={formData.first_name}
                onChange={handleChange}
                required
                placeholder="John"
                className="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
            </div>
            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Last Name *
              </label>
              <input
                type="text"
                name="last_name"
                value={formData.last_name}
                onChange={handleChange}
                required
                placeholder="Smith"
                className="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
            </div>
            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number (Caller ID) *
              </label>
              <input
                type="tel"
                name="caller_id"
                value={formData.caller_id}
                onChange={handleChange}
                required
                placeholder="+17194451111"
                className="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
              <p className="mt-1 text-xs text-gray-500">Format: + followed by country code and phone number</p>
            </div>
            {/* State */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                State *
              </label>
              <select
                name="state"
                value={formData.state}
                onChange={handleChange}
                required
                className="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              >
                <option value="">Select State</option>
                {US_STATES.map((state) => (
                  <option key={state.abbr} value={state.abbr}>
                    {state.name}
                  </option>
                ))}
              </select>
            </div>
            {/* Zip Code */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Zip Code *
              </label>
              <input
                type="text"
                name="zip"
                value={formData.zip}
                onChange={handleChange}
                required
                placeholder="12345"
                maxLength={5}
                className="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
                inputMode="numeric"
              />
            </div>
            {/* Age */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Age *
              </label>
              <input
                type="number"
                name="age"
                value={formData.age}
                onChange={handleChange}
                required
                min={18}
                max={120}
                placeholder="34"
                className="block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 p-2"
              />
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
      </div>
    </div>
  );
};

export default GrowXForm1;