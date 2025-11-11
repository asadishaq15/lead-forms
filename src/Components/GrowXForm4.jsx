// GrowXForm4.jsx
import React, { useState, useEffect } from "react";

// Constants for API configuration
const TRACKDRIVE_NUMBER = "+18778383452";
const TRAFFIC_SOURCE_ID = "1000";

export default function GrowXForm4() {
  const [formData, setFormData] = useState({
    caller_id: "",
    zip: "",
    dob_mm: "",
    dob_dd: "",
    dob_yyyy: ""
  });

  const [buyerVerified, setBuyerVerified] = useState(false);
  const [isCheckingBuyers, setIsCheckingBuyers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [pingId, setPingId] = useState("");
  const [forwardingNumber, setForwardingNumber] = useState("");

  // Validate phone number format: +1 followed by 10 digits
  const isValidPhone = (phone) => /^\+1\d{10}$/.test(phone);
  
  // Validate zip code: 5 digits
  const isValidZip = (zip) => /^\d{5}$/.test(zip);
  
  // Validate DOB fields
  const isValidDOB = () => {
    const mm = parseInt(formData.dob_mm, 10);
    const dd = parseInt(formData.dob_dd, 10);
    const yyyy = parseInt(formData.dob_yyyy, 10);
    
    const isValidMonth = !isNaN(mm) && mm >= 1 && mm <= 12;
    const isValidDay = !isNaN(dd) && dd >= 1 && dd <= 31;
    const isValidYear = !isNaN(yyyy) && yyyy >= 1900 && yyyy <= 2050;
    
    // Additional validation for days in month
    if (isValidMonth && isValidDay && isValidYear) {
      const daysInMonth = new Date(yyyy, mm, 0).getDate();
      if (dd > daysInMonth) return false;
      
      // Check if person is at least 18 years old
      const today = new Date();
      const birthDate = new Date(yyyy, mm - 1, dd);
      let age = today.getFullYear() - birthDate.getFullYear();
      const monthDiff = today.getMonth() - birthDate.getMonth();
      if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
        age--;
      }
      return age >= 18;
    }
    
    return false;
  };

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
  
    try {
      const url = `/api/ping3?trackdrive_number=${encodeURIComponent(TRACKDRIVE_NUMBER)}&traffic_source_id=${encodeURIComponent(TRAFFIC_SOURCE_ID)}&caller_id=${encodeURIComponent(formData.caller_id)}`;
      const response = await fetch(url);
      const data = await response.json();
  
      if (data.success && data.try_all_buyers_ping_id) {
        setBuyerVerified(true);
        setPingId(data.try_all_buyers_ping_id);
      } else {
        setError(
          (data.errors && data.errors.join(", ")) ||
            data.status ||
            "No buyers are available at the moment."
        );
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
    
    setIsCheckingBuyers(false);
  };
  
  // Main form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
  
    // Field validation
    if (!isValidPhone(formData.caller_id)) {
      setError("Please enter a valid US phone number in format: +1XXXXXXXXXX");
      return;
    }
  
    if (!isValidZip(formData.zip)) {
      setError("Please enter a valid 5-digit ZIP code");
      return;
    }
  
    if (!isValidDOB()) {
      setError("Please enter a valid date of birth. You must be at least 18 years old.");
      return;
    }
  
    if (!pingId) {
      setError("Please verify your phone number first");
      return;
    }
  
    setIsSubmitting(true);
  
    // Prepare data for POST request
    const postData = {
      ...formData,
      ping_id: pingId,
      trackdrive_number: TRACKDRIVE_NUMBER,
      traffic_source_id: TRAFFIC_SOURCE_ID
    };
  
    try {
      const response = await fetch("/api/post3", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(postData),
      });
      
      const data = await response.json();
  
      if (data.success) {
        setSuccess(true);
        setForwardingNumber(data.forwarding_number || "");
        
        // Reset form
        setBuyerVerified(false);
        setPingId("");
        setFormData({
          caller_id: "",
          zip: "",
          dob_mm: "",
          dob_dd: "",
          dob_yyyy: ""
        });
      } else {
        setError(
          (data.errors && data.errors.join(", ")) ||
            data.status ||
            "Submission failed. Please try again."
        );
      }
    } catch (err) {
      setError("Network error: " + err.message);
    }
    
    setIsSubmitting(false);
  };

  // Hide success message after 8 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 8000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-700 to-indigo-800 py-6 px-6">
          <h2 className="text-center text-2xl font-bold text-white">
          SSDI CPA FPS
          </h2>
        </div>

        {error && (
          <div className="mx-4 mt-4 p-3 bg-red-50 border-l-4 border-red-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-500" viewBox="0 0 20 20" fill="currentColor">
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
          <div className="mx-4 mt-4 p-3 bg-green-50 border-l-4 border-green-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-green-700">
                  Your information was submitted successfully!
                </p>
                {forwardingNumber && (
                  <p className="mt-1 text-sm text-green-700 font-medium">
                    Please call: {forwardingNumber}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        {buyerVerified && !success && (
          <div className="mx-4 mt-4 p-3 bg-blue-50 border-l-4 border-blue-500 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-blue-700">
                  Phone verified! Please complete the form to proceed.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Phone Number / Caller ID field */}
          <div>
            <label htmlFor="caller_id" className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number <span className="text-red-500">*</span>
            </label>
            <div className="relative">
              <input
                type="tel"
                id="caller_id"
                name="caller_id"
                value={formData.caller_id}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, caller_id: e.target.value }));
                  setBuyerVerified(false);
                  setPingId("");
                  setError(null);
                }}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                placeholder="+17771234567"
                required
                disabled={buyerVerified}
              />
              <button
                type="button"
                onClick={verifyBuyer}
                disabled={isCheckingBuyers || buyerVerified}
                className={`absolute right-2 top-2 px-3 py-1 rounded text-sm font-medium text-white 
                ${isCheckingBuyers || buyerVerified ? "bg-gray-400" : "bg-blue-600 hover:bg-blue-700"} 
                transition-colors`}
              >
                {isCheckingBuyers ? "Checking..." : buyerVerified ? "Verified" : "Verify"}
              </button>
            </div>
            <p className="mt-1 text-xs text-gray-500">Format: +1XXXXXXXXXX</p>
          </div>

          <div>
            <label htmlFor="zip" className="block text-sm font-medium text-gray-700 mb-1">
              ZIP Code <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              id="zip"
              name="zip"
              value={formData.zip}
              onChange={(e) => setFormData((prev) => ({ ...prev, zip: e.target.value }))}
              className={`block w-full px-4 py-3 rounded-lg border border-gray-300 transition-colors ${
                !buyerVerified ? "bg-gray-100" : "focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
              }`}
              placeholder="12345"
              maxLength="5"
              required
              disabled={!buyerVerified}
            />
            <p className="mt-1 text-xs text-gray-500">5-digit US ZIP code</p>
          </div>

          {/* Date of Birth Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Date of Birth <span className="text-red-500">*</span>
            </label>
            <div className="grid grid-cols-3 gap-2">
              <div>
                <input
                  type="text"
                  id="dob_mm"
                  name="dob_mm"
                  value={formData.dob_mm}
                  onChange={(e) => setFormData((prev) => ({ 
                    ...prev, 
                    dob_mm: e.target.value.replace(/\D/g, '').slice(0, 2) 
                  }))}
                  className={`block w-full px-4 py-3 rounded-lg border border-gray-300 transition-colors ${
                    !buyerVerified ? "bg-gray-100" : "focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  }`}
                  placeholder="MM"
                  maxLength="2"
                  required
                  disabled={!buyerVerified}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="dob_dd"
                  name="dob_dd"
                  value={formData.dob_dd}
                  onChange={(e) => setFormData((prev) => ({ 
                    ...prev, 
                    dob_dd: e.target.value.replace(/\D/g, '').slice(0, 2) 
                  }))}
                  className={`block w-full px-4 py-3 rounded-lg border border-gray-300 transition-colors ${
                    !buyerVerified ? "bg-gray-100" : "focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  }`}
                  placeholder="DD"
                  maxLength="2"
                  required
                  disabled={!buyerVerified}
                />
              </div>
              <div>
                <input
                  type="text"
                  id="dob_yyyy"
                  name="dob_yyyy"
                  value={formData.dob_yyyy}
                  onChange={(e) => setFormData((prev) => ({ 
                    ...prev, 
                    dob_yyyy: e.target.value.replace(/\D/g, '').slice(0, 4) 
                  }))}
                  className={`block w-full px-4 py-3 rounded-lg border border-gray-300 transition-colors ${
                    !buyerVerified ? "bg-gray-100" : "focus:ring-2 focus:ring-blue-600 focus:border-blue-600"
                  }`}
                  placeholder="YYYY"
                  maxLength="4"
                  required
                  disabled={!buyerVerified}
                />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">You must be at least 18 years old</p>
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isSubmitting || !buyerVerified}
              className={`w-full px-6 py-3 rounded-lg font-medium text-white ${
                !buyerVerified 
                  ? "bg-gray-400 cursor-not-allowed" 
                  : isSubmitting
                    ? "bg-gradient-to-r from-blue-600 to-indigo-700 opacity-75 cursor-not-allowed" 
                    : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              } transition-colors shadow-md`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
              ) : !buyerVerified ? (
                "Verify Your Phone First"
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>

        <div className="px-6 pb-6 text-xs text-gray-500 text-center">
          By submitting this form, you agree to our Terms of Service and Privacy Policy.
        </div>
      </div>
    </div>
  );
}