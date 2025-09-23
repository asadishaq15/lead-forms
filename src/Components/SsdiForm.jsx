import React, { useState } from "react";

const SsdiForm = () => {
  const [formData, setFormData] = useState({
    lead_token: "01cdcd9dfdc94211abed367075cd88db",
    caller_id: "",
    traffic_source_id: "1013",
    zip_code: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [message, setMessage] = useState({ text: "", isError: false });

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage({ text: "", isError: false });

    // Validate the required fields
    if (!formData.caller_id) {
      setMessage({ text: "Caller ID is required.", isError: true });
      setIsSubmitting(false);
      return;
    }
    
    if (!formData.zip_code || !/^\d{5}$/.test(formData.zip_code)) {
      setMessage({ text: "Valid 5-digit ZIP code is required.", isError: true });
      setIsSubmitting(false);
      return;
    }

    // Construct Ringba URL with parameters (just logged, not fetched)
    const ringbaBaseUrl = "https://rtb.ringba.com/v1/production/dee02e1dd5a9466b84b0b699338e0f1d.json";
    const ringbaParams = new URLSearchParams({
      CID: "14061571951",
      zip_code: formData.zip_code,
    });
    const ringbaUrl = `${ringbaBaseUrl}?${ringbaParams.toString()}`;

    // Log Ringba URL (same as original form)
    console.log(`Ringba URL: ${ringbaUrl}`);

    // Prepare data for KBB submission (similar to original form)
    const params = new URLSearchParams({
      lead_token: formData.lead_token,
      caller_id: formData.caller_id,
      traffic_source_id: formData.traffic_source_id,
      zip_code: formData.zip_code,
    });

    console.log(`KBB Query String: ${params.toString()}`);

    // Submit to KBB endpoint (same as original form)
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
          setMessage({ text: "Lead submitted successfully!", isError: false });
        } else {
          throw new Error("Failed to submit lead. Please try again.");
        }
      })
      .catch((error) => {
        console.error("Error:", error);
        setMessage({ text: `Error: ${error.message}`, isError: true });
      })
      .finally(() => {
        setIsSubmitting(false);
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
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-md overflow-hidden">
        <div className="bg-gradient-to-r from-green-600 to-green-800 py-6">
          <h2 className="text-center text-2xl font-bold text-white px-4">
          SSDI CPA PDS
          </h2>
        </div>

        {message.text && (
          <div className={`p-4 ${message.isError ? "bg-red-100 text-red-700" : "bg-green-100 text-green-700"}`}>
            {message.text}
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-8 space-y-6">
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
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white p-2"
              placeholder="Enter caller ID"
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
              className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 bg-white p-2"
            />
            <p className="mt-1 text-xs text-gray-500">Enter a valid 5-digit US ZIP code</p>
          </div>

          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white ${
                isSubmitting ? "bg-green-400 cursor-not-allowed" : "bg-green-600 hover:bg-green-700 focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
              }`}
            >
              {isSubmitting ? "Submitting..." : "Submit Lead"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default SsdiForm;