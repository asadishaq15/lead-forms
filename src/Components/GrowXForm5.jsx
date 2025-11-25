// GrowXForm5.jsx
import React, { useState, useEffect } from "react";

// Constants for API configuration
const TRACKDRIVE_NUMBER = "+18338365435";
const TRAFFIC_SOURCE_ID = "1000";

// US States dropdown options
const US_STATES = [
  { name: "Alabama", value: "AL" },
  { name: "Alaska", value: "AK" },
  { name: "Arizona", value: "AZ" },
  { name: "Arkansas", value: "AR" },
  { name: "California", value: "CA" },
  { name: "Colorado", value: "CO" },
  { name: "Connecticut", value: "CT" },
  { name: "Delaware", value: "DE" },
  { name: "District Of Columbia", value: "DC" },
  { name: "Florida", value: "FL" },
  { name: "Georgia", value: "GA" },
  { name: "Hawaii", value: "HI" },
  { name: "Idaho", value: "ID" },
  { name: "Illinois", value: "IL" },
  { name: "Indiana", value: "IN" },
  { name: "Iowa", value: "IA" },
  { name: "Kansas", value: "KS" },
  { name: "Kentucky", value: "KY" },
  { name: "Louisiana", value: "LA" },
  { name: "Maine", value: "ME" },
  { name: "Maryland", value: "MD" },
  { name: "Massachusetts", value: "MA" },
  { name: "Michigan", value: "MI" },
  { name: "Minnesota", value: "MN" },
  { name: "Mississippi", value: "MS" },
  { name: "Missouri", value: "MO" },
  { name: "Montana", value: "MT" },
  { name: "Nebraska", value: "NE" },
  { name: "Nevada", value: "NV" },
  { name: "New Hampshire", value: "NH" },
  { name: "New Jersey", value: "NJ" },
  { name: "New Mexico", value: "NM" },
  { name: "New York", value: "NY" },
  { name: "North Carolina", value: "NC" },
  { name: "North Dakota", value: "ND" },
  { name: "Ohio", value: "OH" },
  { name: "Oklahoma", value: "OK" },
  { name: "Oregon", value: "OR" },
  { name: "Pennsylvania", value: "PA" },
  { name: "Rhode Island", value: "RI" },
  { name: "South Carolina", value: "SC" },
  { name: "South Dakota", value: "SD" },
  { name: "Tennessee", value: "TN" },
  { name: "Texas", value: "TX" },
  { name: "Utah", value: "UT" },
  { name: "Vermont", value: "VT" },
  { name: "Virginia", value: "VA" },
  { name: "Washington", value: "WA" },
  { name: "West Virginia", value: "WV" },
  { name: "Wisconsin", value: "WI" },
  { name: "Wyoming", value: "WY" }
];

export default function GrowXForm5() {
  const [formData, setFormData] = useState({
    caller_id: "",
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    city: "",
    state: "",
    zip: "",
    dob_mm: "",
    dob_dd: "",
    dob_yyyy: "",
    trusted_form_cert_url: ""
  });

  const [isCheckingBuyers, setIsCheckingBuyers] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [forwardingNumber, setForwardingNumber] = useState("");

  // Validate phone number format: +1 followed by 10 digits
  const isValidPhone = (phone) => /^\+1\d{10}$/.test(phone);
  
  // Validate zip code: 5 digits
  const isValidZip = (zip) => /^\d{5}$/.test(zip);
  
  // Validate email format
  const isValidEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  
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

  // Format date as YYYY-MM-DD for the API
  const formatDate = (yyyy, mm, dd) => {
    // Ensure month and day are two digits
    const month = mm.padStart(2, '0');
    const day = dd.padStart(2, '0');
    return `${yyyy}-${month}-${day}`;
  };

  // Handle form submission with all data via enhanced ping endpoint
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
  
    if (formData.email && !isValidEmail(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }
  
    if (!isValidDOB()) {
      setError("Please enter a valid date of birth. You must be at least 18 years old.");
      return;
    }
  
    if (!formData.first_name || !formData.last_name) {
      setError("Please enter your first and last name");
      return;
    }
  
    setIsCheckingBuyers(true);
  
    try {
      // Format DOB in YYYY-MM-DD format for API
      const dob = formatDate(
        formData.dob_yyyy,
        formData.dob_mm,
        formData.dob_dd
      );

      // Build query parameters for all form fields
      const queryParams = new URLSearchParams({
        trackdrive_number: TRACKDRIVE_NUMBER,
        traffic_source_id: TRAFFIC_SOURCE_ID,
        caller_id: formData.caller_id,
        first_name: formData.first_name,
        last_name: formData.last_name,
        zip: formData.zip,
        dob: dob,
        // Still include individual date components
        dob_mm: formData.dob_mm,
        dob_dd: formData.dob_dd,
        dob_yyyy: formData.dob_yyyy
      });
      
      // Add optional parameters if they exist
      if (formData.email) queryParams.append("email", formData.email);
      if (formData.address) queryParams.append("address", formData.address);
      if (formData.city) queryParams.append("city", formData.city);
      if (formData.state) queryParams.append("state", formData.state);
      if (formData.trusted_form_cert_url) queryParams.append("trusted_form_cert_url", formData.trusted_form_cert_url);
      
      const pingUrl = `/api/ping4?${queryParams.toString()}`;
      
      const pingResponse = await fetch(pingUrl);
      const pingData = await pingResponse.json();
  
      if (!pingData.success || !pingData.try_all_buyers_ping_id) {
        // Handle different error formats
        let errorMessage;
        if (pingData.errors) {
          if (Array.isArray(pingData.errors)) {
            errorMessage = pingData.errors.join(", ");
          } else if (typeof pingData.errors === 'object') {
            // Extract error messages from object properties
            errorMessage = Object.entries(pingData.errors)
              .map(([field, msgs]) => `${field}: ${Array.isArray(msgs) ? msgs.join(', ') : msgs}`)
              .join("; ");
          } else {
            errorMessage = String(pingData.errors);
          }
        } else {
          errorMessage = pingData.status || "No buyers are available at the moment.";
        }
        
        setError(errorMessage);
        setIsCheckingBuyers(false);
        return;
      }

      // If ping is successful, consider the submission successful
      setSuccess(true);
      
      // Use any information from the ping response directly
      if (pingData.forwarding_number) {
        setForwardingNumber(pingData.forwarding_number);
      } else {
        // In a real implementation, you might want to set a default number
        setForwardingNumber(TRACKDRIVE_NUMBER);
      }
      
      // Reset form
      setFormData({
        caller_id: "",
        first_name: "",
        last_name: "",
        email: "",
        address: "",
        city: "",
        state: "",
        zip: "",
        dob_mm: "",
        dob_dd: "",
        dob_yyyy: "",
        trusted_form_cert_url: ""
      });
    } catch (err) {
      setError("Network error: " + err.message);
    }
    
    setIsCheckingBuyers(false);
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
            SSDI CPA DM
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

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-5">
          {/* Personal Information */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Phone Number / Caller ID field */}
            <div className="md:col-span-2">
              <label htmlFor="caller_id" className="block text-sm font-medium text-gray-700 mb-1">
                Phone Number <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                id="caller_id"
                name="caller_id"
                value={formData.caller_id}
                onChange={(e) => {
                  setFormData((prev) => ({ ...prev, caller_id: e.target.value }));
                  setError(null);
                }}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                placeholder="+17771234567"
                required
              />
              <p className="mt-1 text-xs text-gray-500">Format: +1XXXXXXXXXX</p>
            </div>

            {/* First Name */}
            <div>
              <label htmlFor="first_name" className="block text-sm font-medium text-gray-700 mb-1">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="first_name"
                name="first_name"
                value={formData.first_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, first_name: e.target.value }))}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                required
              />
            </div>

            {/* Last Name */}
            <div>
              <label htmlFor="last_name" className="block text-sm font-medium text-gray-700 mb-1">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                id="last_name"
                name="last_name"
                value={formData.last_name}
                onChange={(e) => setFormData((prev) => ({ ...prev, last_name: e.target.value }))}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                required
              />
            </div>

            {/* Email */}
            <div className="md:col-span-2">
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={(e) => setFormData((prev) => ({ ...prev, email: e.target.value }))}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
              />
            </div>
          </div>

          {/* Address Information */}
          <div className="grid grid-cols-1 gap-4">
            <div>
              <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">
                Street Address
              </label>
              <input
                type="text"
                id="address"
                name="address"
                value={formData.address}
                onChange={(e) => setFormData((prev) => ({ ...prev, address: e.target.value }))}
                className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                placeholder="123 Main St"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  id="city"
                  name="city"
                  value={formData.city}
                  onChange={(e) => setFormData((prev) => ({ ...prev, city: e.target.value }))}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                />
              </div>

              <div>
                <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                  State
                </label>
                <select
                  id="state"
                  name="state"
                  value={formData.state}
                  onChange={(e) => setFormData((prev) => ({ ...prev, state: e.target.value }))}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                >
                  <option value="">Select State</option>
                  {US_STATES.map((state) => (
                    <option key={state.value} value={state.value}>{state.name}</option>
                  ))}
                </select>
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
                  onChange={(e) => setFormData((prev) => ({ ...prev, zip: e.target.value.replace(/\D/g, '').slice(0, 5) }))}
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  maxLength="5"
                  required
                />
              </div>
            </div>
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
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  placeholder="MM"
                  maxLength="2"
                  required
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
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  placeholder="DD"
                  maxLength="2"
                  required
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
                  className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
                  placeholder="YYYY"
                  maxLength="4"
                  required
                />
              </div>
            </div>
            <p className="mt-1 text-xs text-gray-500">You must be at least 18 years old</p>
          </div>

          {/* Trusted Form Cert URL */}
          <div>
            <label htmlFor="trusted_form_cert_url" className="block text-sm font-medium text-gray-700 mb-1">
              Trusted Form Certificate URL
            </label>
            <input
              type="text"
              id="trusted_form_cert_url"
              name="trusted_form_cert_url"
              value={formData.trusted_form_cert_url}
              onChange={(e) => setFormData((prev) => ({ ...prev, trusted_form_cert_url: e.target.value }))}
              className="block w-full px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-600 focus:border-blue-600 transition-colors"
            />
          </div>

          <div className="pt-2">
            <button
              type="submit"
              disabled={isCheckingBuyers}
              className={`w-full px-6 py-3 rounded-lg font-medium text-white ${
                isCheckingBuyers
                  ? "bg-gradient-to-r from-blue-600 to-indigo-700 opacity-75 cursor-not-allowed" 
                  : "bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800"
              } transition-colors shadow-md`}
            >
              {isCheckingBuyers ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing...
                </>
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