import React, { useState } from "react";

const TRACKDRIVE_NUMBER = "+18883700548";
const TRAFFIC_SOURCE_ID = "1013";

const states = [
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
  { name: "Wyoming", value: "WY" },
];

export default function AcaKkCplForm() {
  const [formData, setFormData] = useState({
    trackdrive_number: TRACKDRIVE_NUMBER,
    traffic_source_id: TRAFFIC_SOURCE_ID,
    caller_id: "",
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    dob: "",
    gender: "",
    house_hold_income: "",
  });

  const [buyerVerified, setBuyerVerified] = useState(false);
  const [isCheckingBuyers, setIsCheckingBuyers] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);
  const [pingId, setPingId] = useState("");

  // Validate phone number
  const isValidPhone = (phone) => /^\+1\d{10}$/.test(phone);

  // Buyer verification step (ping)
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
  
    // USE YOUR OWN API ENDPOINT!
    const url = `/api/ping?trackdrive_number=${encodeURIComponent(formData.trackdrive_number)}&traffic_source_id=${encodeURIComponent(formData.traffic_source_id)}&caller_id=${encodeURIComponent(formData.caller_id)}`;
  
    try {
      const resp = await fetch(url);
      const data = await resp.json();
  
      if (data.success && data.buyers && data.buyers.length > 0 && data.buyers[0].ping_id) {
        setBuyerVerified(true);
        setPingId(data.buyers[0].ping_id);
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
  
  // Main form submit (lead submit)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
  
    // Required field validation...
    const requiredFields = [
      "caller_id",
      "first_name",
      "last_name",
      "email",
      "state",
      "zip",
      "dob",
      "gender",
    ];
  
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Field "${field.replace(/_/g, " ")}" is required.`);
        return;
      }
    }
  
    if (!isValidPhone(formData.caller_id)) {
      setError("Please enter a valid US phone number in format: +1XXXXXXXXXX");
      return;
    }
  
    if (!/^\d{5}$/.test(formData.zip)) {
      setError("Please enter a valid 5-digit ZIP code.");
      return;
    }
  
    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      return;
    }
  
    if (!/^\d{4}-\d{2}-\d{2}$/.test(formData.dob)) {
      setError("Please enter a valid date in YYYY-MM-DD format.");
      return;
    }
  
    if (!["M", "F"].includes(formData.gender)) {
      setError("Please select a valid gender (M or F)");
      return;
    }
  
    if (!pingId) {
      setError("Buyer verification failed. Please verify your phone number again.");
      return;
    }
  
    setIsSubmitting(true);
  
    // Compose POST body (JSON)
    const postBody = { ...formData, ping_id: pingId };
  
    try {
      // USE PROXY ENDPOINT!
      const resp = await fetch("/api/post", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(postBody),
      });
      const data = await resp.json();
  
      if (data.success) {
        setSuccess(true);
        setBuyerVerified(false);
        setPingId("");
        setFormData({
          trackdrive_number: TRACKDRIVE_NUMBER,
          traffic_source_id: TRAFFIC_SOURCE_ID,
          caller_id: "",
          first_name: "",
          last_name: "",
          email: "",
          address: "",
          address2: "",
          city: "",
          state: "",
          zip: "",
          dob: "",
          gender: "",
          house_hold_income: "",
        });
      } else {
        setError(
          (data.errors && data.errors.join(", ")) ||
            data.status ||
            "Submission failed, please try again."
        );
      }
    } catch (err) {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-6">
          <h2 className="text-center text-3xl font-extrabold text-white">
            ACA KK CPL
          </h2>
          <p className="mt-2 text-center text-lg text-blue-100">
            Health Insurance Lead Generation
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
                  Lead submitted successfully! Your information has been received.
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
                  Buyer is available for your lead. Please complete the form to proceed.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* MAIN FORM */}
        <form onSubmit={handleSubmit} className="px-6 py-8" autoComplete="off">
          {/* Contact Information Section */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="relative">
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
                    className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
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
                          : "bg-blue-500 hover:bg-blue-600"
                      } text-white transition-colors`}
                    >
                      {isCheckingBuyers ? "Checking..." : "Verify"}
                    </button>
                  )}
                </div>
                <p className="mt-1 text-xs text-gray-500">Format: +1XXXXXXXXXX</p>
              </div>
            </div>
          </div>

          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={(e) => setFormData((f) => ({ ...f, first_name: e.target.value }))}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="Enter your first name"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={(e) => setFormData((f) => ({ ...f, last_name: e.target.value }))}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="Enter your last name"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData((f) => ({ ...f, email: e.target.value }))}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender <span className="text-red-500">*</span>
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={(e) => setFormData((f) => ({ ...f, gender: e.target.value }))}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                  <option value="">Select gender</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={(e) => setFormData((f) => ({ ...f, dob: e.target.value }))}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="YYYY-MM-DD"
                />
                <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD</p>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Household Income
                </label>
                <input
                  type="text"
                  name="house_hold_income"
                  value={formData.house_hold_income}
                  onChange={(e) =>
                    setFormData((f) => ({ ...f, house_hold_income: e.target.value }))
                  }
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="Enter household income"
                />
              </div>
            </div>
          </div>

          {/* Location Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Location Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={(e) => setFormData((f) => ({ ...f, address: e.target.value }))}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address 2
                </label>
                <input
                  type="text"
                  name="address2"
                  value={formData.address2}
                  onChange={(e) => setFormData((f) => ({ ...f, address2: e.target.value }))}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="Apartment, suite, etc."
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={(e) => setFormData((f) => ({ ...f, city: e.target.value }))}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="Enter city"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State <span className="text-red-500">*</span>
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={(e) => setFormData((f) => ({ ...f, state: e.target.value }))}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                  <option value="">Select your state</option>
                  {states.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.name}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={(e) => setFormData((f) => ({ ...f, zip: e.target.value }))}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="12345"
                  maxLength="5"
                />
                <p className="mt-1 text-xs text-gray-500">5-digit US ZIP code</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting || !buyerVerified}
              className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ${
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
                "Verify Phone Number First"
              ) : (
                "Submit Information"
              )}
            </button>
          </div>
          <div className="mt-4 text-center text-xs text-gray-500">
            By submitting this form, you agree to our terms and conditions and privacy policy.
          </div>
        </form>
      </div>
    </div>
  );
}