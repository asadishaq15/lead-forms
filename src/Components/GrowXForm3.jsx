import React, { useState } from "react";

const GrowXForm3 = () => {
  const [formData, setFormData] = useState({
    lead_token: "a9faecfbeddd4d57bae3d325800181af", // Static value
    traffic_source_id: "1000", // Static value
    caller_id: "",
    zip: "",
    age: ""
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    setError(null);
    setSuccess(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setIsSubmitting(true);

    try {
      // Validate phone number format
      if (!/^\+\d+$/.test(formData.caller_id)) {
        throw new Error("Please enter a valid phone number starting with + followed by country code and number (e.g. +17194451111).");
      }

      // Validate zip code (5 digits)
      if (!/^\d{5}$/.test(formData.zip)) {
        throw new Error("Please enter a valid 5-digit US Zip Code.");
      }

      // Validate age (must be a number)
      const ageNum = Number(formData.age);
      if (isNaN(ageNum) || ageNum < 18 || ageNum > 120) {
        throw new Error("Please enter a valid age between 18 and 120.");
      }

      // Prepare data for submission
      const dataToSubmit = {
        lead_token: formData.lead_token,
        traffic_source_id: formData.traffic_source_id,
        caller_id: formData.caller_id,
        zip: formData.zip,
        age: formData.age
      };

      // Build URL with query parameters
      const baseUrl = "https://growxmarketingservices.trackdrive.com/api/v1/leads";
      const params = new URLSearchParams();
      
      Object.entries(dataToSubmit).forEach(([key, value]) => {
        params.append(key, value);
      });
      
      const url = `${baseUrl}?${params.toString()}`;

      // Send data
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Accept": "application/json"
        }
      });

      const result = await response.json();

      if (result.success) {
        setSuccess("Lead submitted successfully!");
        // Reset form fields except for the static values
        setFormData({
          lead_token: "a9faecfbeddd4d57bae3d325800181af",
          traffic_source_id: "1000",
          caller_id: "",
          zip: "",
          age: ""
        });
      } else {
        const errorMessage =
          result.message ||
          result.error ||
          (result.errors && Object.values(result.errors).flat().join(", ")) ||
          "Failed to submit lead. Please try again.";
        throw new Error(errorMessage);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-8 px-4">
      <div className="w-full max-w-md bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-blue-800 py-5">
          <h2 className="text-center text-2xl font-extrabold text-white px-4">
          SSDI CPA FPS
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
          <div className="space-y-4">
            {/* Phone Number / Caller ID */}
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
              <p className="mt-1 text-xs text-gray-500">Enter a valid 5-digit US Zip Code</p>
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
              <p className="mt-1 text-xs text-gray-500">Must be between 18 and 120 years</p>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-6">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSubmitting
                  ? "bg-blue-400 cursor-not-allowed"
                  : "bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              } transition duration-150`}
            >
              {isSubmitting ? "Submitting..." : "Submit Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default GrowXForm3;