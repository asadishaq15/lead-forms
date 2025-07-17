// src/Components/EnvironEduForm.jsx
import React, { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';

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

// Generate a list ID in format YYYYMMDDXXX where XXX is a 3-digit number
function getCurrentListId() {
  const today = new Date();
  const year = today.getFullYear();
  const month = String(today.getMonth() + 1).padStart(2, '0');
  const day = String(today.getDate()).padStart(2, '0');
  const randomNum = Math.floor(Math.random() * 999) + 1;
  const formattedRandomNum = String(randomNum).padStart(3, '0');
  return `${year}${month}${day}${formattedRandomNum}`;
}

export default function EnvironEduForm() {
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    a1: "",
    a2: "",
    city: "",
    state: "",
    zip: "",
    email: "",
    p1: "",
    date_of_birth: "",
    dob: "", // Duplicate of date_of_birth
    gender: "",
    LeadID: uuidv4(), // Generate a unique LeadID
    OptInIp: "",
    subid: "74", // Default subid from example
    lid: getCurrentListId(), // Generate unique list ID for each form load
    SignupURL: window.location.href || "jobfindernews.com", // Use actual URL when possible
    ConsentURL: window.location.href || "jobfindernews.com", // Use actual URL when possible
    xxTrustedFormToken: "https://cert.trustedform.com/blank", // Default blank token
    RecordID: Math.floor(Math.random() * 1000000).toString(), // Random record ID
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState(null);

  // Function to get the current IP address
  useEffect(() => {
    const getIpAddress = async () => {
      try {
        const response = await fetch('https://api.ipify.org?format=json');
        const data = await response.json();
        setFormData(prev => ({ ...prev, OptInIp: data.ip }));
      } catch (error) {
        console.error("Failed to get IP address:", error);
        setFormData(prev => ({ ...prev, OptInIp: "127.0.0.1" }));
      }
    };

    getIpAddress();
  }, []);

  // Form validation functions
  const isValidPhone = (phone) => /^\d{10}$/.test(phone);
  const isValidZip = (zip) => /^\d{5}$/.test(zip);
  const isValidEmail = (email) => email === "" || /\S+@\S+\.\S+/.test(email);
  const isValidDate = (date) => /^\d{4}-\d{2}-\d{2}$/.test(date);

  // Handle form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;

    // Special handling for date_of_birth to keep dob in sync
    if (name === "date_of_birth") {
      setFormData({
        ...formData,
        date_of_birth: value,
        dob: value, // Keep dob in sync with date_of_birth
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
  
    try {
      // Generate a new LeadID and lid for each submission
      const submissionData = {
        ...formData,
        LeadID: uuidv4(),
        lid: getCurrentListId(),
        RecordID: Date.now().toString(),
      };

      // Validate required fields
      if (!submissionData.fname || !submissionData.lname || !submissionData.state || 
          !submissionData.zip || !submissionData.p1 || !submissionData.date_of_birth || !submissionData.city) {
        setError("Please fill in all required fields.");
        setIsSubmitting(false);
        return;
      }
  
      // Validate phone number: 10 digits, no formatting
      if (!/^\d{10}$/.test(submissionData.p1)) {
        setError("Please enter a valid 10-digit phone number (no dashes or spaces).");
        setIsSubmitting(false);
        return;
      }
    
      // Validate ZIP code
      if (!/^\d{5}$/.test(submissionData.zip)) {
        setError("Please enter a valid 5-digit ZIP code.");
        setIsSubmitting(false);
        return;
      }
    
      // Validate email format (if provided)
      if (submissionData.email && !/\S+@\S+\.\S+/.test(submissionData.email)) {
        setError("Please enter a valid email address.");
        setIsSubmitting(false);
        return;
      }
    
      // Validate date of birth
      if (!/^\d{4}-\d{2}-\d{2}$/.test(submissionData.date_of_birth)) {
        setError("Please enter a valid date in YYYY-MM-DD format.");
        setIsSubmitting(false);
        return;
      }
  
      console.log("Submitting data:", submissionData);
  
      // Send the complete form data to the API endpoint
      const response = await fetch('/api/environedu-submit', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(submissionData),
      });
  
      const data = await response.text();
      console.log("Response:", data);
  
      setIsSubmitting(false);
  
      if (response.ok) {
        setSuccess(true);
        // Clear form after successful submission
        setFormData({
          fname: "",
          lname: "",
          a1: "",
          a2: "",
          city: "",
          state: "",
          zip: "",
          email: "",
          p1: "",
          date_of_birth: "",
          dob: "",
          gender: "",
          LeadID: uuidv4(),
          OptInIp: formData.OptInIp, // Keep IP address
          subid: "74",
          lid: getCurrentListId(),
          SignupURL: window.location.href || "jobfindernews.com",
          ConsentURL: window.location.href || "jobfindernews.com",
          xxTrustedFormToken: "https://cert.trustedform.com/blank",
          RecordID: Math.floor(Math.random() * 1000000).toString(),
        });
      } else {
        setError(data || "Failed to submit lead. Please check your details or try again.");
      }
    } catch (error) {
      console.error("Form submission error:", error);
      setIsSubmitting(false);
      setError(
        error.message ||
        "Network error occurred. Please check your connection and try again."
      );
    }
  };

  // Hide success message after 5 seconds
  useEffect(() => {
    if (success) {
      const timer = setTimeout(() => setSuccess(false), 5000);
      return () => clearTimeout(timer);
    }
  }, [success]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-6">
          <h2 className="text-center text-3xl font-extrabold text-white">
            EDU 1 & 2 Form
          </h2>
          <p className="mt-2 text-center text-lg text-blue-100">
            Complete the form below to register
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
                  Form submitted successfully! Your information has been received.
                </p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-8">
          {/* Personal Information Section */}
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
                  name="fname"
                  value={formData.fname}
                  onChange={handleChange}
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
                  name="lname"
                  value={formData.lname}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="Enter your last name"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number <span className="text-red-500">*</span>
                </label>
                <input
                  type="tel"
                  name="p1"
                  value={formData.p1}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="1234567890"
                  maxLength="10"
                />
                <p className="mt-1 text-xs text-gray-500">Format: 10 digits without spaces or dashes</p>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth <span className="text-red-500">*</span>
                </label>
                <input
                  type="date"
                  name="date_of_birth"
                  value={formData.date_of_birth}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                />
                <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD</p>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                  <option value="">Select gender (optional)</option>
                  <option value="M">Male</option>
                  <option value="F">Female</option>
                  <option value="O">Other</option>
                </select>
              </div>
            </div>
          </div>

          {/* Address Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
              </svg>
              Address Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 1
                </label>
                <input
                  type="text"
                  name="a1"
                  value={formData.a1}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="123 Main Street"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Address Line 2
                </label>
                <input
                  type="text"
                  name="a2"
                  value={formData.a2}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="Apartment, suite, etc."
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
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
                  onChange={handleChange}
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
                  onChange={handleChange}
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
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ${
                isSubmitting ? "opacity-75 cursor-not-allowed" : ""
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