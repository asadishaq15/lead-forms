import React, { useState } from "react";

const AdvanceGrowMarketingLeadForm2 = () => {
  const [formData, setFormData] = useState({
    lead_token: "ce64ddcd6d14495bb04dce8ed509125e",
    caller_id: "",
    traffic_source_id: "10003",
    first_name: "",
    last_name: "",
    email: "",
    city: "",
    zip: "",
    dob: "",
    jornaya_leadid: "",
    source_url: "",
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);

    const requiredFields = [
      "caller_id",
      "first_name",
      "last_name",
      "email",
      "city",
      "zip",
      "dob",
      "jornaya_leadid",
      "source_url",
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Field "${field.replace(/_/g, " ")}" is required.`);
        setIsSubmitting(false);
        return;
      }
    }

    if (!/^\d{5}$/.test(formData.zip)) {
      setError("Please enter a valid 5-digit ZIP code.");
      setIsSubmitting(false);
      return;
    }

    if (!/\S+@\S+\.\S+/.test(formData.email)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    // Date validation
    const dateRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dateRegex.test(formData.dob)) {
      setError("Please enter a valid date in YYYY-MM-DD format.");
      setIsSubmitting(false);
      return;
    }

    const baseUrl = "https://advance-grow-marketing.trackdrive.com/api/v1/leads";
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
        setIsSubmitting(false);
        if (data.success) {
          setSuccess(true);
          // Clear form after successful submission
          setFormData(prev => ({
            ...prev,
            caller_id: "",
            first_name: "",
            last_name: "",
            email: "",
            city: "",
            zip: "",
            dob: "",
            jornaya_leadid: "",
            source_url: "",
          }));
        } else {
          // Handle specific error messages from API
          const errorMessage = data.message || 
                             data.error || 
                             (data.errors && Object.values(data.errors).flat().join(", ")) ||
                             "Failed to submit lead. Please try again.";
          setError(errorMessage);
        }
      })
      .catch((error) => {
        setIsSubmitting(false);
        setError(
          error.message || "Network error occurred. Please check your connection and try again."
        );
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
    // Clear error when user starts typing
    setError(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 py-8 px-6">
          <div className="flex items-center justify-center">
            <svg className="h-10 w-10 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="text-center text-3xl font-extrabold text-white">
           Growx Lead Form
            </h2>
          </div>
        
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
                <p className="text-sm text-green-700">Lead submitted successfully!</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-8">
          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              Personal Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  First Name *
                </label>
                <input
                  type="text"
                  name="first_name"
                  value={formData.first_name}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="John"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name *
                </label>
                <input
                  type="text"
                  name="last_name"
                  value={formData.last_name}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="Smith"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="caller_id"
                  value={formData.caller_id}
                  onChange={handleChange}
                  required
                  placeholder="+17194451111"
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                />
                <p className="mt-1 text-xs text-gray-500">Format: +1XXXXXXXXXX</p>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  City *
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="Boulder"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zip"
                  value={formData.zip}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="12345"
                  maxLength="5"
                />
                <p className="mt-1 text-xs text-gray-500">5-digit US ZIP code</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Additional Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth *
                </label>
                <input
                  type="text"
                  name="dob"
                  value={formData.dob}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="YYYY-MM-DD"
                />
                <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD</p>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Jornaya Lead ID *
                </label>
                <input
                  type="text"
                  name="jornaya_leadid"
                  value={formData.jornaya_leadid}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="Enter Jornaya Lead ID"
                />
              </div>
              <div className="relative md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Source URL *
                </label>
                <input
                  type="text"
                  name="source_url"
                  value={formData.source_url}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150"
                  placeholder="https://example.com"
                />
              </div>
            </div>
          </div>

          {/* Hidden Fields Notice */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
            <h4 className="font-medium text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-indigo-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Required Information
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              This form includes the following hidden fields that will be submitted automatically:
            </p>
            <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 text-sm text-gray-600">
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Lead Token: ce64ddcd6d14495bb04dce8ed509125e
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Traffic Source ID: 10003
              </li>
            </ul>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition duration-150 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
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
                "Submit Lead Information"
              )}
            </button>
          </div>
          
       
        </form>
      </div>
    </div>
  );
};

export default AdvanceGrowMarketingLeadForm2;