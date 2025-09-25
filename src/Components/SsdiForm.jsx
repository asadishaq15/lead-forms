import React, { useState } from "react";

const TRACKDRIVE_NUMBER = "+18338467310";
const TRAFFIC_SOURCE_ID = "1000";

export default function SsdiBuyerForm() {
  const [formData, setFormData] = useState({
    trackdrive_number: TRACKDRIVE_NUMBER,
    traffic_source_id: TRAFFIC_SOURCE_ID,
    caller_id: "",
    zip: "" // Added zip field
  });

  const [buyerVerified, setBuyerVerified] = useState(false);
  const [isCheckingBuyers, setIsCheckingBuyers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [pingId, setPingId] = useState("");

  // Validate phone number
  const isValidPhone = (phone) => /^\+1\d{10}$/.test(phone);
  
  // Validate zip code (5 digit US zip)
  const isValidZip = (zip) => /^\d{5}$/.test(zip);

  // Buyer verification step (ping)
  const verifyBuyer = async (e) => {
    e.preventDefault();
    setError(null);
  
    if (!isValidPhone(formData.caller_id)) {
      setError("Please enter a valid US phone number in format: +1XXXXXXXXXX");
      return;
    }
  
    setIsCheckingBuyers(true);
    setBuyerVerified(false);
    setPingId("");
  
    // Construct the query parameters for the API endpoint
    const queryParams = new URLSearchParams({
      trackdrive_number: formData.trackdrive_number,
      traffic_source_id: formData.traffic_source_id,
      caller_id: formData.caller_id
    }).toString();
    
    const url = `/api/ping?${queryParams}`;
  
    try {
      console.log("Making verification request to:", url);
      const resp = await fetch(url);
      const respText = await resp.text();
      
      let data;
      try {
        data = JSON.parse(respText);
      } catch (err) {
        console.error("Failed to parse response as JSON:", respText.substring(0, 500));
        throw new Error("Invalid JSON response from server. The API may be unavailable.");
      }
  
      console.log("Buyer verification response:", data);
      
      if (data.success && data.buyers && data.buyers.length > 0 && data.buyers[0].ping_id) {
        setBuyerVerified(true);
        setPingId(data.buyers[0].ping_id);
        console.log("Buyer verified with ping_id:", data.buyers[0].ping_id);
      } else if (data.success && data.try_all_buyers_ping_id) {
        // Handle case where try_all_buyers_ping_id is available
        setBuyerVerified(true);
        setPingId(data.try_all_buyers_ping_id);
        console.log("Using try_all_buyers_ping_id:", data.try_all_buyers_ping_id);
      } else {
        setError(
          (data.errors && data.errors.join(", ")) ||
            data.status ||
            "No buyers are available for SSDI at the moment."
        );
      }
    } catch (err) {
      console.error("Buyer verification error:", err);
      setError("Network error: " + err.message);
    }
    setIsCheckingBuyers(false);
  };
  
  // Main form submit (lead submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
  
    if (!isValidPhone(formData.caller_id)) {
      setError("Please enter a valid US phone number in format: +1XXXXXXXXXX");
      return;
    }
    
    if (!isValidZip(formData.zip)) {
      setError("Please enter a valid 5-digit ZIP code");
      return;
    }
  
    if (!pingId) {
      setError("Buyer verification failed. Please verify your phone number again.");
      return;
    }
  
    setIsSubmitting(true);
  
    // Compose POST body (JSON) with all required fields
    const postBody = { 
      trackdrive_number: formData.trackdrive_number,
      traffic_source_id: formData.traffic_source_id,
      caller_id: formData.caller_id,
      ping_id: pingId,
      zip: formData.zip // Added zip to the post body
    };
  
    try {
      console.log("Submitting lead with data:", postBody);
      const resp = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(postBody),
      });
      
      const respText = await resp.text();
      
      let data;
      try {
        data = JSON.parse(respText);
      } catch (err) {
        console.error("Failed to parse response as JSON:", respText.substring(0, 500));
        throw new Error("Invalid JSON response from server. The API may be unavailable.");
      }
  
      console.log("Lead submission response:", data);
      
      if (data.success) {
        setSuccess(true);
        setBuyerVerified(false);
        setPingId("");
        setFormData({
          trackdrive_number: TRACKDRIVE_NUMBER,
          traffic_source_id: TRAFFIC_SOURCE_ID,
          caller_id: "",
          zip: "", // Reset zip field
        });
      } else {
        setError(
          (data.errors && data.errors.join(", ")) ||
            data.status ||
            "Submission failed, please try again."
        );
      }
    } catch (err) {
      console.error("Lead submission error:", err);
      setError("Network error: " + err.message);
    }
    setIsSubmitting(false);
  };

  // Hide success after 5s
  React.useEffect(() => {
    if (success) {
      const t = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(t);
    }
  }, [success]);

  // ---- UI ----
  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-purple-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-700 py-8 px-6">
          <h2 className="text-center text-3xl font-extrabold text-white">
            SSDI Buyer Verification
          </h2>
          <p className="mt-2 text-center text-lg text-indigo-100">
            Check if SSDI buyers are available for your lead
          </p>
        </div>

        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
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

        {success && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Your SSDI lead has been successfully submitted!
                </p>
              </div>
            </div>
          </div>
        )}

        {buyerVerified && !success && (
          <div className="mx-6 mt-6 p-4 bg-blue-50 border-l-4 border-blue-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  SSDI buyer is available for your lead. Click "Submit Lead" to connect.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit} className="px-6 py-8" autoComplete="off">
          {/* Phone Information Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Contact Information
            </h3>
            <div className="relative mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <div className="relative">
                <input
                  type="tel"
                  name="caller_id"
                  value={formData.caller_id}
                  onChange={(e) => {
                    setFormData((f) => ({ ...f, caller_id: e.target.value }));
                    setError(null);
                    setBuyerVerified(false);
                    setPingId("");
                  }}
                  required
                  disabled={buyerVerified}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="+17191231234"
                />
                {!buyerVerified && (
                  <button
                    type="button"
                    onClick={verifyBuyer}
                    disabled={isCheckingBuyers || !formData.caller_id}
                    className={`absolute right-2 top-2 px-3 py-1 text-sm rounded-md ${
                      !formData.caller_id
                        ? "bg-gray-300 cursor-not-allowed"
                        : "bg-indigo-500 hover:bg-indigo-600"
                    } text-white transition-colors`}
                  >
                    {isCheckingBuyers ? "Checking..." : "Check SSDI Buyers"}
                  </button>
                )}
              </div>
              <p className="mt-1 text-xs text-gray-500">Format: +1XXXXXXXXXX</p>
            </div>
            
            {/* ZIP Code field - only shown after buyer verification */}
            {buyerVerified && (
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={(e) => {
                    setFormData((f) => ({ ...f, zip: e.target.value }));
                    setError(null);
                  }}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="12345"
                  maxLength={5}
                  pattern="\d{5}"
                />
                <p className="mt-1 text-xs text-gray-500">Enter 5-digit US ZIP code</p>
              </div>
            )}

            <div className="hidden">
              <input
                type="hidden"
                name="trackdrive_number"
                value={formData.trackdrive_number}
              />
              <input
                type="hidden"
                name="traffic_source_id"
                value={formData.traffic_source_id}
              />
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !buyerVerified}
              className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-700 hover:from-indigo-700 hover:to-purple-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${
                isSubmitting || !buyerVerified ? "opacity-75 cursor-not-allowed" : ""
              }`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : !buyerVerified ? (
                "Check for SSDI Buyers First"
              ) : (
                "Submit SSDI Lead"
              )}
            </button>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">
            By submitting this form, you're checking if SSDI buyers are available for your lead.
          </div>
        </form>
      </div>
    </div>
  );
}