import React, { useState, useEffect } from "react";

const AutoInsuranceLeadForm = () => {
  const [formData, setFormData] = useState({
    CID: "",
    exposeCallerId: "yes",
    original_lead_submit_date: new Date().toISOString(),
    submit_date: new Date().toISOString(),
    jornaya: "",
    ip_address: "",
    first_name: "",
    last_name: "",
    address: "",
    city: "",
    state: "",
    zipcode: "",
    email: "",
    phone: "",
    residence_status: "",
    dob: "",
    sr22: "",
    credit: "",
    gender: "",
    marital_status: "",
    incident_type: "",
    car_year: "",
    car_make: "",
    car_model: "",
    insurance: "",
    policy_start_date: ""
  });

  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [ipAddress, setIpAddress] = useState("");

  // Fetch IP address and generate Jornaya ID on component mount
  useEffect(() => {
    // Set the IP address from the known value
    const ipAddress = "52.90.100.179";
    setIpAddress(ipAddress);
    setFormData(prev => ({ ...prev, ip_address: ipAddress }));
    
    // Generate a random alphanumeric string for Jornaya Lead ID
    const randomJornayaId = Math.random().toString(36).substring(2, 15) + 
                           Math.random().toString(36).substring(2, 15);
    
    // Set submit date to current time in ISO format and Jornaya ID
    setFormData(prev => ({ 
      ...prev, 
      submit_date: new Date().toISOString(),
      original_lead_submit_date: new Date().toISOString(),
      jornaya: randomJornayaId,
      exposeCallerId: "yes"
    }));
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setIsSubmitting(true);
  
    const requiredFields = [
      "first_name",
      "last_name",
      "address",
      "city",
      "state",
      "zipcode",
      "email",
      "phone",
      "residence_status",
      "dob",
      "gender",
      "marital_status",
      "car_year",
      "car_make",
      "car_model"
    ];
  
    for (const field of requiredFields) {
      if (!formData[field]) {
        setError(`Field "${field.replace(/_/g, " ")}" is required.`);
        setIsSubmitting(false);
        return;
      }
    }
  
    if (!/^\d{5}$/.test(formData.zipcode)) {
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
    const dobRegex = /^\d{4}-\d{2}-\d{2}$/;
    if (!dobRegex.test(formData.dob)) {
      setError("Please enter a valid date of birth in YYYY-MM-DD format.");
      setIsSubmitting(false);
      return;
    }
  
    if (formData.policy_start_date && !dobRegex.test(formData.policy_start_date)) {
      setError("Please enter a valid policy start date in YYYY-MM-DD format.");
      setIsSubmitting(false);
      return;
    }
  
    // Format phone into E.164 (+1XXXXXXXXXX)
    let formattedPhone = (formData.phone || "").trim();
    // Remove everything except digits and leading +
    formattedPhone = formattedPhone.replace(/[^\d+]/g, "");
  
    if (!formattedPhone.startsWith("+")) {
      // assume US
      const digits = formattedPhone.replace(/\D/g, "");
      if (digits.length === 11 && digits.startsWith("1")) {
        formattedPhone = `+${digits}`;
      } else if (digits.length === 10) {
        formattedPhone = `+1${digits}`;
      } else {
        formattedPhone = `+${digits}`;
      }
    }
  
    const phoneRegex = /^\+1\d{10}$/;
    if (!phoneRegex.test(formattedPhone)) {
      setError("Please enter a valid phone number in +1XXXXXXXXXX format.");
      setIsSubmitting(false);
      return;
    }
  
    // update UI state phone
    setFormData(prev => ({ ...prev, phone: formattedPhone }));
  
    // BUILD payload with proper key names matching the API requirements
    const phoneDigits = formattedPhone.replace(/\D/g, "");
    
    // Important: Using CID as the key (not cid) and properly setting the value
    const payload = {
      CID: formData.CID || phoneDigits,  
      exposeCallerId: "yes", 
      original_lead_submit_date: formData.original_lead_submit_date,
      jornaya: formData.jornaya,
      ip_address: formData.ip_address,
      first_name: formData.first_name,
      last_name: formData.last_name,
      address: formData.address,
      city: formData.city,
      state: formData.state,
      zipcode: formData.zipcode,
      email: formData.email,
      phone: phoneDigits,  // Digits only
      residence_status: formData.residence_status,  // Must be either "Own" or "Rent"
      dob: formData.dob,  // YYYY-MM-DD format
      sr22: formData.sr22 || "Unknown",  // Yes, No, or Unknown
      credit: formData.credit || "",  // One of their specified values
      gender: formData.gender,  // Male or Female
      marital_status: formData.marital_status,  // Single or Married
      incident_type: formData.incident_type || "",  // "Intoxic" or "Other"
      car_year: formData.car_year,
      car_make: formData.car_make,
      car_model: formData.car_model,
      insurance: formData.insurance || "UNKNOWN",
      policy_start_date: formData.policy_start_date || ""
    };

    try {
      console.log("Submitting payload:", payload);
      
      // call backend proxy
      const response = await fetch("http://localhost:5001/api/submit-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
  
      const data = await response.json();
      console.log("Response data:", data);
      
      setIsSubmitting(false);
  
      if (response.ok && (data.bidAmount > 0 || data.status === "ok" || data.success)) {
        setSuccess(true);
  
        // Reset relevant form fields and generate new jornaya
        const newJornayaId = Math.random().toString(36).substring(2, 15) +
                            Math.random().toString(36).substring(2, 15);
        setFormData(prev => ({
          ...prev,
          CID: "",
          original_lead_submit_date: new Date().toISOString(),
          first_name: "",
          last_name: "",
          address: "",
          city: "",
          state: "",
          zipcode: "",
          email: "",
          phone: "",
          residence_status: "",
          dob: "",
          sr22: "",
          credit: "",
          gender: "",
          marital_status: "",
          incident_type: "",
          car_year: "",
          car_make: "",
          car_model: "",
          insurance: "",
          policy_start_date: "",
          submit_date: new Date().toISOString(),
          jornaya: newJornayaId
        }));
      } else {
        const errorMessage = data.rejectReason || data.message || data.error || "Failed to submit lead. Please try again.";
        setError(errorMessage);
      }
    } catch (err) {
      console.error("Error submitting lead:", err);
      setIsSubmitting(false);
      setError(err.message || "Network error occurred. Please check your connection and try again.");
    }
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

  const insuranceOptions = [
    { value: "AAA", label: "AAA" },
    { value: "ALLSTATE", label: "Allstate" },
    { value: "AMERICANNATIONAL", label: "American National" },
    { value: "AMFAM", label: "American Family" },
    { value: "BRIGHTWAY", label: "Brightway" },
    { value: "COUNTRYFINANCIA", label: "Country Financial" },
    { value: "ERIE", label: "Erie" },
    { value: "FARM_BUREAU", label: "Farm Bureau" },
    { value: "FARMERS", label: "Farmers" },
    { value: "GEICO", label: "Geico" },
    { value: "HARTFORD", label: "Hartford" },
    { value: "INDEPENDENT", label: "Independent" },
    { value: "LIBERTY", label: "Liberty Mutual" },
    { value: "MERCURY", label: "Mercury" },
    { value: "METLIFE", label: "MetLife" },
    { value: "MUTOMA", label: "Mutual of Omaha" }, 
    { value: "NATIONWIDE", label: "Nationwide" },
    { value: "OTHER", label: "Other" },
    { value: "PROGRESSIVE", label: "Progressive" },
    { value: "SAFECO", label: "Safeco" },
    { value: "SHELTER", label: "Shelter" },
    { value: "STATEFARM", label: "State Farm" },
    { value: "TWENTYFIRST_CENTURY", label: "21st Century" },
    { value: "USHA", label: "US Health Advisors" },
    { value: "TRAVLERS", label: "Travelers" }, 
    { value: "UNKNOWN", label: "Unknown" },
  ];

  const creditOptions = [
    { value: "Excellent", label: "Excellent" },
    { value: "Good", label: "Good" },
    { value: "Some Problems", label: "Some Problems" },
    { value: "Major Problems", label: "Major Problems" }
  ];

  const sr22Options = [
    { value: "Yes", label: "Yes" },
    { value: "No", label: "No" },
    { value: "Unknown", label: "Unknown" }
  ];

  const incidentTypes = [
    { value: "Intoxic", label: "Intoxication" },
    { value: "Other", label: "Other" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-gray-100 py-10 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-2xl shadow-xl overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-700 py-8 px-6">
          <div className="flex items-center justify-center">
            <svg className="h-10 w-10 text-white mr-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m5.618-4.016A11.955 11.955 0 0112 2.944a11.955 11.955 0 01-8.618 3.04A12.02 12.02 0 003 9c0 5.591 3.824 10.29 9 11.622 5.176-1.332 9-6.03 9-11.622 0-1.042-.133-2.052-.382-3.016z" />
            </svg>
            <h2 className="text-center text-3xl font-extrabold text-white">
              Auto Insurance Lead Form
            </h2>
          </div>
          <p className="mt-3 text-center text-white text-opacity-90">
            Complete the form below to submit your information
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
                <p className="text-sm text-green-700">Lead submitted successfully!</p>
              </div>
            </div>
          </div>
        )}

        <form onSubmit={handleSubmit} className="px-6 py-8">
          {/* System Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
              </svg>
              System Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* CID field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CID
                </label>
                <input
                  type="text"
                  name="CID"
                  value={formData.CID}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="Enter CID (or leave empty to use phone number)"
                />
              </div>
            </div>
            
            <div className="mt-4 bg-gray-50 rounded-lg p-4 border border-gray-200">
              <h4 className="font-medium text-gray-800 flex items-center">
                <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                Automatically Included Information
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                The following information is automatically included in your submission:
              </p>
              <ul className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-x-6 text-sm text-gray-600">
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  IP Address: {ipAddress}
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Expose Caller ID: Yes
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Submission Date: {formData.original_lead_submit_date}
                </li>
                <li className="flex items-center">
                  <svg className="h-4 w-4 text-green-500 mr-1" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  Jornaya Lead ID: Auto-generated
                </li>
              </ul>
            </div>
          </div>

          {/* Basic Information Section - following the exact sequence from the instructions */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" />
              </svg>
              Basic Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              {/* First Name */}
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
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="John"
                />
              </div>
              
              {/* Last Name */}
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
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="Smith"
                />
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
              <div className="relative md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address *
                </label>
                <input
                  type="text"
                  name="address"
                  value={formData.address}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="123 Main St"
                />
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
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="New York"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  State *
                </label>
                <select
                  name="state"
                  value={formData.state}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                  <option value="">Select State</option>
                  {states.map((state) => (
                    <option key={state.value} value={state.value}>
                      {state.name} ({state.value})
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  ZIP Code *
                </label>
                <input
                  type="text"
                  name="zipcode"
                  value={formData.zipcode}
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

          {/* Contact Information */}
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
                  Email *
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="your.email@example.com"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number *
                </label>
                <input
                  type="tel"
                  name="phone"
                  value={formData.phone}
                  onChange={handleChange}
                  required
                  placeholder="+17194451111"
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                />
                <p className="mt-1 text-xs text-gray-500">Format: +1XXXXXXXXXX</p>
              </div>
            </div>
          </div>

          {/* Personal Details */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M10 2a5 5 0 00-5 5v2a2 2 0 00-2 2v5a2 2 0 002 2h10a2 2 0 002-2v-5a2 2 0 00-2-2H7V7a3 3 0 116 0v2h2V7a5 5 0 00-5-5z" />
              </svg>
              Personal Details
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Residence Status *
                </label>
                <select
                  name="residence_status"
                  value={formData.residence_status}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                  <option value="">Select Status</option>
                  <option value="Own">Own</option>
                  <option value="Rent">Rent</option>
                </select>
              </div>
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
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="YYYY-MM-DD"
                />
                <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD</p>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  SR22 Required?
                </label>
                <select
                  name="sr22"
                  value={formData.sr22}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                  <option value="">Select Option</option>
                  {sr22Options.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Credit Rating
                </label>
                <select
                  name="credit"
                  value={formData.credit}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                  <option value="">Select Credit Rating</option>
                  {creditOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Gender *
                </label>
                <select
                  name="gender"
                  value={formData.gender}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                  <option value="">Select Gender</option>
                  <option value="Male">Male</option>
                  <option value="Female">Female</option>
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Marital Status *
                </label>
                <select
                  name="marital_status"
                  value={formData.marital_status}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                  <option value="">Select Marital Status</option>
                  <option value="Single">Single</option>
                  <option value="Married">Married</option>
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Incident Type
                </label>
                <select
                  name="incident_type"
                  value={formData.incident_type}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                  <option value="">Select Type</option>
                  {incidentTypes.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
            </div>
          </div>

          {/* Vehicle Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path d="M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z" />
                <path d="M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H11a1 1 0 001-1v-1h3.05a2.5 2.5 0 014.9 0H20a1 1 0 001-1V9a3 3 0 00-3-3h-3V4a1 1 0 00-1-1H3zm11 3a1 1 0 00-1 1v1H3V5h10v2z" />
              </svg>
              Vehicle Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-x-6 gap-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car Year *
                </label>
                <input
                  type="text"
                  name="car_year"
                  value={formData.car_year}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="2020"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car Make *
                </label>
                <input
                  type="text"
                  name="car_make"
                  value={formData.car_make}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="Toyota"
                />
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Car Model *
                </label>
                <input
                  type="text"
                  name="car_model"
                  value={formData.car_model}
                  onChange={handleChange}
                  required
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="Camry"
                />
              </div>
            </div>
          </div>

          {/* Insurance Information */}
          <div className="mb-8">
            <h3 className="text-xl font-semibold text-gray-900 border-b border-gray-200 pb-2 mb-4 flex items-center">
              <svg className="w-5 h-5 mr-2 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M10 2a8 8 0 100 16 8 8 0 000-16zm0 14a6 6 0 110-12 6 6 0 010 12zm-1-5a1 1 0 011-1h2a1 1 0 110 2h-2a1 1 0 01-1-1zm0-3a1 1 0 100 2h5a1 1 0 100-2h-5z" clipRule="evenodd" />
              </svg>
              Insurance Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-4">
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Current Insurance Provider
                </label>
                <select
                  name="insurance"
                  value={formData.insurance}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                >
                  <option value="">Select Provider</option>
                  {insuranceOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Policy Start Date
                </label>
                <input
                  type="text"
                  name="policy_start_date"
                  value={formData.policy_start_date}
                  onChange={handleChange}
                  className="block w-full px-4 py-3 rounded-lg border-2 border-gray-300 focus:ring-blue-500 focus:border-blue-500 transition duration-150"
                  placeholder="YYYY-MM-DD"
                />
                <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD</p>
              </div>
            </div>
          </div>

          {/* Submit Button */}
          <div className="pt-4">
            <button
              type="submit"
              disabled={isSubmitting}
              className={`w-full flex justify-center items-center py-4 px-6 border border-transparent rounded-lg shadow-sm text-base font-medium text-white bg-gradient-to-r from-blue-600 to-indigo-700 hover:from-blue-700 hover:to-indigo-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition duration-150 ${isSubmitting ? 'opacity-75 cursor-not-allowed' : ''}`}
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
                "Submit Insurance Lead"
              )}
            </button>
          </div>
          
          <div className="mt-4 text-center text-xs text-gray-500">
            By submitting this form, you agree to our terms and conditions.
          </div>
        </form>
      </div>
    </div>
  );
};

export default AutoInsuranceLeadForm;