import React, { useState } from "react";

const DepoProveraLeadForm = () => {
  const [formData, setFormData] = useState({
    lead_token: "e51fb0e5ac424c7591bf7cdb950cb5d8",
    caller_id: "",
    traffic_source_id: "1086",
    first_name: "",
    last_name: "",
    email: "",
    ip_address: "",
    trusted_form_cert_url: "",
    inquiry_date: "",
    prescribed_depo_provera: true,
    previously_represented: false,
    qualifying_injection: true,
    diagnosed_with_meningioma: true,
    where_you_received_shot: true,
    ssn: true,
    currently_inmate: false,
    death_sol_check: false,
    plaid_id: ""
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
      "ip_address",
      "trusted_form_cert_url",
      "inquiry_date"
    ];

    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Field "${field.replace(/_/g, " ")}" is required.`);
        setIsSubmitting(false);
        return;
      }
    }

    // Email validation using the regex from documentation
    const emailRegex = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+(?<!\.)@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address.");
      setIsSubmitting(false);
      return;
    }

    // Phone validation
    if (!/^\+1\d{10}$/.test(formData.caller_id)) {
      setError("Please enter a valid phone number in format: +17194451111");
      setIsSubmitting(false);
      return;
    }

    // Special validation for critical case requirements
    if (!formData.prescribed_depo_provera) {
      setError("You must have been prescribed Depo-Provera with at least four injections to qualify.");
      setIsSubmitting(false);
      return;
    }

    if (formData.previously_represented) {
      setError("You cannot be currently represented by an attorney for this case.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.qualifying_injection) {
      setError("You must have used a qualifying injection for at least 12 months.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.diagnosed_with_meningioma) {
      setError("You must have been diagnosed with meningioma at least 2 years from first injection.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.where_you_received_shot) {
      setError("You must know where you received the shot.");
      setIsSubmitting(false);
      return;
    }

    if (!formData.ssn) {
      setError("You must have a valid US SSN to proceed.");
      setIsSubmitting(false);
      return;
    }

    if (formData.currently_inmate) {
      setError("You cannot be currently an inmate of a prison or jail.");
      setIsSubmitting(false);
      return;
    }

    if (formData.death_sol_check) {
      setError("You cannot proceed if the death SOL is expired or expiring within 90 days.");
      setIsSubmitting(false);
      return;
    }

    // Create a properly formatted object for API submission with booleans converted to strings
    const apiFormData = { ...formData };
    
    // Convert boolean values to proper string format for the API
    Object.keys(apiFormData).forEach(key => {
      if (typeof apiFormData[key] === 'boolean') {
        apiFormData[key] = apiFormData[key].toString();
      }
    });

    // Use a different approach for submitting to the API
    const baseUrl = "https://upbeat-chat.trackdrive.com/api/v1/leads";
    
    // Change to POST request with form data as URL parameters
    const queryParams = new URLSearchParams();
    Object.entries(apiFormData).forEach(([key, value]) => {
      queryParams.append(key, value);
    });

    fetch(`${baseUrl}?${queryParams.toString()}`, {
      method: "POST",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/x-www-form-urlencoded",
      },
    })
      .then((response) => {
        console.log("Response status:", response.status);
        return response.json();
      })
      .then((data) => {
        console.log("API Response:", data);
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
            ip_address: "",
            trusted_form_cert_url: "",
            inquiry_date: "",
            plaid_id: ""
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
        console.error("API Error:", error);
        setIsSubmitting(false);
        setError(
          error.message || "Network error occurred. Please check your connection and try again."
        );
      });
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
    // Clear error when user starts typing
    setError(null);
  };

  // Generate IP address for demo purposes
  const generateRandomIp = () => {
    const ip = `${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    setFormData(prev => ({
      ...prev,
      ip_address: ip
    }));
  };

  // Auto-populate today's date in the correct format
  const populateCurrentDate = () => {
    const today = new Date();
    const month = String(today.getMonth() + 1).padStart(2, '0');
    const day = String(today.getDate()).padStart(2, '0');
    const year = today.getFullYear();
    const formattedDate = `${month}/${day}/${year}`;
    
    setFormData(prev => ({
      ...prev,
      inquiry_date: formattedDate
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-indigo-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-purple-600 to-indigo-600 py-8 px-6">
          <div className="flex items-center justify-center">
            <svg className="h-10 w-10 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="text-center text-3xl font-extrabold text-white">
   Lead Form
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
                <p className="text-sm text-green-700">Your information has been submitted successfully!</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-8">
          {/* Personal Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
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
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                  placeholder="Jane"
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
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                  placeholder="Doe"
                />
              </div>
            </div>
          </div>

          {/* Contact Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M2 3a1 1 0 011-1h2.153a1 1 0 01.986.836l.74 4.435a1 1 0 01-.54 1.06l-1.548.773a11.037 11.037 0 006.105 6.105l.774-1.548a1 1 0 011.059-.54l4.435.74a1 1 0 01.836.986V17a1 1 0 01-1 1h-2C7.82 18 2 12.18 2 5V3z" />
              </svg>
              Contact Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
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
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                />
                <p className="mt-1 text-xs text-gray-500">Format: +1XXXXXXXXXX</p>
              </div>
            </div>
          </div>

          {/* Technical Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M2 5a2 2 0 012-2h12a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V5zm3.293 1.293a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 01-1.414-1.414L7.586 10 5.293 7.707a1 1 0 010-1.414zM11 12a1 1 0 100 2h3a1 1 0 100-2h-3z" clipRule="evenodd" />
              </svg>
              Technical Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  IP Address *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="ip_address"
                    value={formData.ip_address}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 rounded-l-lg border-2 border-r-0 border-gray-300 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                    placeholder="192.168.1.1"
                  />
                  <button
                    type="button"
                    onClick={generateRandomIp}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg border-2 border-gray-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Generate
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">IP address where form was filled out</p>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  TrustedForm Certificate URL *
                </label>
                <input
                  type="text"
                  name="trusted_form_cert_url"
                  value={formData.trusted_form_cert_url}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                  placeholder="https://cert.trustedform.com/..."
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Inquiry Date *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    name="inquiry_date"
                    value={formData.inquiry_date}
                    onChange={handleChange}
                    required
                    className="block w-full px-4 py-3 rounded-l-lg border-2 border-r-0 border-gray-300 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                    placeholder="MM/DD/YYYY"
                  />
                  <button
                    type="button"
                    onClick={populateCurrentDate}
                    className="px-4 py-2 bg-gray-200 text-gray-700 rounded-r-lg border-2 border-gray-300 hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                  >
                    Today
                  </button>
                </div>
                <p className="mt-1 text-xs text-gray-500">Date when TrustedForm certification was created</p>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Plaid ID *
                </label>
                <input
                  type="text"
                  name="plaid_id"
                  value={formData.plaid_id}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-purple-500 focus:border-purple-500 transition duration-150"
                  placeholder=""
                />
              </div>
            </div>
          </div>

          {/* Qualification Questions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              Case Qualification
            </h3>
            <div className="space-y-4">
              <div className="bg-purple-50 p-4 rounded-lg">
                <label className="flex items-start cursor-pointer">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="prescribed_depo_provera"
                      checked={formData.prescribed_depo_provera}
                      onChange={handleChange}
                      className="focus:ring-purple-500 h-5 w-5 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className="font-medium text-gray-800">Were you prescribed and had at least four injections in the U.S. of Depo-Provera, Depo-SubQ, or a generic version of Depo-Provera after 1992?</span>
                    <p className="text-gray-500 mt-1">You must answer YES to qualify</p>
                  </div>
                </label>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <label className="flex items-start cursor-pointer">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="previously_represented"
                      checked={formData.previously_represented}
                      onChange={handleChange}
                      className="focus:ring-purple-500 h-5 w-5 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className="font-medium text-gray-800">Are you currently being represented by an attorney or represented for a case with same diagnosis?</span>
                    <p className="text-gray-500 mt-1">You must answer NO to qualify</p>
                  </div>
                </label>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <label className="flex items-start cursor-pointer">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="qualifying_injection"
                      checked={formData.qualifying_injection}
                      onChange={handleChange}
                      className="focus:ring-purple-500 h-5 w-5 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className="font-medium text-gray-800">Did you use a qualifying injection for at least 12 months?</span>
                    <p className="text-gray-500 mt-1">You must answer YES to qualify</p>
                  </div>
                </label>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <label className="flex items-start cursor-pointer">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="diagnosed_with_meningioma"
                      checked={formData.diagnosed_with_meningioma}
                      onChange={handleChange}
                      className="focus:ring-purple-500 h-5 w-5 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className="font-medium text-gray-800">Were you diagnosed with any type of meningioma (malignant or benign) at least 2 years from the date of first injection to the date of diagnosis (after 1992)?</span>
                    <p className="text-gray-500 mt-1">You must answer YES to qualify</p>
                  </div>
                </label>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <label className="flex items-start cursor-pointer">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="where_you_received_shot"
                      checked={formData.where_you_received_shot}
                      onChange={handleChange}
                      className="focus:ring-purple-500 h-5 w-5 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className="font-medium text-gray-800">Do you know where you received the shot?</span>
                    <p className="text-gray-500 mt-1">You must answer YES to qualify</p>
                  </div>
                </label>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <label className="flex items-start cursor-pointer">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="ssn"
                      checked={formData.ssn}
                      onChange={handleChange}
                      className="focus:ring-purple-500 h-5 w-5 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className="font-medium text-gray-800">Do you have a valid US SSN#?</span>
                    <p className="text-gray-500 mt-1">You must answer YES to qualify</p>
                  </div>
                </label>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <label className="flex items-start cursor-pointer">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="currently_inmate"
                      checked={formData.currently_inmate}
                      onChange={handleChange}
                      className="focus:ring-purple-500 h-5 w-5 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className="font-medium text-gray-800">Are you currently an inmate of a prison or jail?</span>
                    <p className="text-gray-500 mt-1">You must answer NO to qualify</p>
                  </div>
                </label>
              </div>

              <div className="bg-purple-50 p-4 rounded-lg">
                <label className="flex items-start cursor-pointer">
                  <div className="flex items-center h-5">
                    <input
                      type="checkbox"
                      name="death_sol_check"
                      checked={formData.death_sol_check}
                      onChange={handleChange}
                      className="focus:ring-purple-500 h-5 w-5 text-purple-600 border-gray-300 rounded"
                    />
                  </div>
                  <div className="ml-3 text-sm">
                    <span className="font-medium text-gray-800">Is the death SOL expired or within 90 days of expiring?</span>
                    <p className="text-gray-500 mt-1">You must answer NO to qualify</p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Hidden Fields Notice */}
          <div className="bg-gray-50 rounded-lg p-4 mb-8 border border-gray-200">
            <h4 className="font-medium text-gray-800 flex items-center">
              <svg className="w-5 h-5 mr-2 text-purple-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              System Information
            </h4>
            <p className="text-sm text-gray-600 mt-1">
              This form includes the following hidden fields that will be submitted automatically:
            </p>
            <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 text-sm text-gray-600">
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Lead Token: e51fb0e5ac424c7591bf7cdb950cb5d8
              </li>
              <li className="flex items-center">
                <svg className="h-4 w-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                </svg>
                Traffic Source ID: 1086
              </li>
            </ul>
          </div>

          {/* Legal Disclaimer */}
          <div className="mb-8 text-sm text-gray-600 p-4 bg-gray-50 rounded-lg border border-gray-200">
            <h4 className="font-medium text-gray-800 mb-2">Legal Disclaimer</h4>
            <p>
              By submitting this form, you are consenting to be contacted by a legal professional or their representative regarding a potential Depo Provera meningioma lawsuit. You understand that submitting this form does not create an attorney-client relationship. Submission of this form constitutes acceptance of our Privacy Policy and Terms of Service.
            </p>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition duration-150 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Processing Your Case...
                </>
              ) : (
                "Submit Case Information"
              )}
            </button>
          </div>
          
          <p className="mt-4 text-center text-sm text-gray-500">
            Questions? Call <a href="tel:+18553878288" className="font-medium text-purple-600 hover:text-purple-500">(855) 387-8288</a>
          </p>
        </form>
      </div>
    </div>
  );
};

export default DepoProveraLeadForm;