import React, { useState } from "react";

const EvolveTechFinalExpenseForm = () => {
  const [formData, setFormData] = useState({
    lead_token: "7807ee37fcc64e1ea7de4086ef459aa1",
    caller_id: "",
    traffic_source_id: "1039",
    first_name: "",
    last_name: "",
    email: "",
    city: "",
    state: "",
    zip: "",
    dob: "",
    gender: "",
    jornaya_leadid: "",
  });

  const [error, setError] = useState(null);
  const [step, setStep] = useState(1);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const requiredFields = [
      "caller_id",
      "first_name",
      "last_name",
      "email",
      "city",
      "state",
      "zip",
      "dob",
      "gender",
      "jornaya_leadid",
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

    // Phone validation
    if (!/^\+?[1-9]\d{9,14}$/.test(formData.caller_id.replace(/\D/g, ''))) {
      setError("Please enter a valid phone number.");
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

    const baseUrl = "https://evolvetech-innovations.trackdrive.com/api/v1/leads";
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
        if (data.success) {
          setSuccessMessage("Thank you! Your information has been submitted successfully.");
          // Clear form after successful submission
          setFormData(prev => ({
            ...prev,
            caller_id: "",
            first_name: "",
            last_name: "",
            email: "",
            city: "",
            state: "",
            zip: "",
            dob: "",
            gender: "",
            jornaya_leadid: "",
          }));
          setStep(1);
        } else {
          // Handle specific error messages from API
          const errorMessage = data.message || 
                             data.error || 
                             (data.errors && Object.values(data.errors).flat().join(", ")) ||
                             "Failed to submit lead. Please try again.";
          setError(errorMessage);
        }
        setIsSubmitting(false);
      })
      .catch((error) => {
        setError(
          error.message || "Network error occurred. Please check your connection and try again."
        );
        setIsSubmitting(false);
      });
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    
    // Format phone number as user types
    if (name === "caller_id") {
      const cleaned = value.replace(/\D/g, '');
      let formatted = cleaned;
      
      if (cleaned.length > 0) {
        if (cleaned.length <= 3) {
          formatted = cleaned;
        } else if (cleaned.length <= 6) {
          formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3)}`;
        } else {
          formatted = `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6, 10)}`;
        }
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: formatted,
      }));
    } 
    // Format date as user types
    else if (name === "dob") {
      let formatted = value.replace(/\D/g, '');
      
      if (formatted.length > 4) {
        formatted = formatted.slice(0, 4) + '-' + formatted.slice(4);
      }
      if (formatted.length > 7) {
        formatted = formatted.slice(0, 7) + '-' + formatted.slice(7, 9);
      }
      
      setFormData((prev) => ({
        ...prev,
        [name]: formatted.slice(0, 10),
      }));
    }
    // Format ZIP code
    else if (name === "zip") {
      const cleaned = value.replace(/\D/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: cleaned.slice(0, 5),
      }));
    }
    else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
    
    // Clear error when user starts typing
    setError(null);
  };

  const nextStep = () => {
    // Validate current step before proceeding
    if (step === 1) {
      if (!formData.first_name || !formData.last_name || !formData.dob || !formData.gender) {
        setError("Please fill in all required fields in this section before continuing.");
        return;
      }
    } else if (step === 2) {
      if (!formData.email || !formData.caller_id) {
        setError("Please fill in all required fields in this section before continuing.");
        return;
      }
      
      if (!/\S+@\S+\.\S+/.test(formData.email)) {
        setError("Please enter a valid email address.");
        return;
      }
    }
    
    setError(null);
    setStep(step + 1);
    window.scrollTo(0, 0);
  };

  const prevStep = () => {
    setError(null);
    setStep(step - 1);
    window.scrollTo(0, 0);
  };

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  // Progress calculation
  const totalSteps = 4;
  const progress = (step / totalSteps) * 100;

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-800 py-6">
          <h2 className="text-center text-3xl font-extrabold text-white px-4">
            All State Auto Insurance Form
          </h2>
          <p className="text-center text-blue-100 mt-2">
            Get your personalized auto insurance quote in minutes
          </p>
        </div>

        {/* Progress bar */}
        <div className="px-6 pt-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5">
            <div className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" style={{ width: `${progress}%` }}></div>
          </div>
          <div className="flex justify-between mt-2 text-xs text-gray-500">
            <span>Step {step} of {totalSteps}</span>
            <span>{Math.round(progress)}% Complete</span>
          </div>
        </div>

        {/* Success message */}
        {successMessage && (
          <div className="mx-6 mt-6 p-4 bg-green-50 border-l-4 border-green-500 rounded flex items-center">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">{successMessage}</p>
            </div>
          </div>
        )}

        {/* Error message */}
        {error && (
          <div className="mx-6 mt-6 p-4 bg-red-50 border-l-4 border-red-500 rounded">
            <div className="flex items-center">
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

        <form onSubmit={handleSubmit} className="px-6 py-6 space-y-6">
          {/* Step 1: Personal Information */}
          {step === 1 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">1</span>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="first_name"
                    value={formData.first_name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2 transition-colors"
                    placeholder="John"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="last_name"
                    value={formData.last_name}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2 transition-colors"
                    placeholder="Doe"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Date of Birth <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="dob"
                    value={formData.dob}
                    onChange={handleChange}
                    required
                    placeholder="YYYY-MM-DD"
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2 transition-colors"
                  />
                  <p className="mt-1 text-xs text-gray-500">Format: YYYY-MM-DD (e.g., 1985-04-12)</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Gender <span className="text-red-500">*</span>
                  </label>
                  <div className="mt-1 flex gap-4">
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="M"
                        checked={formData.gender === "M"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Male</span>
                    </label>
                    <label className="inline-flex items-center">
                      <input
                        type="radio"
                        name="gender"
                        value="F"
                        checked={formData.gender === "F"}
                        onChange={handleChange}
                        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
                      />
                      <span className="ml-2 text-gray-700">Female</span>
                    </label>
                  </div>
                </div>
              </div>
              <div className="pt-6 flex justify-end">
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Continue
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 2: Contact Information */}
          {step === 2 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">2</span>
                Contact Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="email"
                    value={formData.email}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2 transition-colors"
                    placeholder="johndoe@example.com"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    Phone Number <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="caller_id"
                    value={formData.caller_id}
                    onChange={handleChange}
                    required
                    placeholder="(555) 123-4567"
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2 transition-colors"
                  />
                </div>
              </div>
              <div className="pt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Continue
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 3: Address Information */}
          {step === 3 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">3</span>
                Address Information
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    City <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="city"
                    value={formData.city}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2 transition-colors"
                    placeholder="New York"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    State <span className="text-red-500">*</span>
                  </label>
                  <select
                    name="state"
                    value={formData.state}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2 transition-colors"
                  >
                    <option value="">Select State</option>
                    {states.map(state => (
                      <option key={state} value={state}>{state}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700">
                    ZIP Code <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="zip"
                    value={formData.zip}
                    onChange={handleChange}
                    required
                    placeholder="12345"
                    maxLength={5}
                    className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2 transition-colors"
                  />
                </div>
              </div>
              <div className="pt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="flex items-center justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  Continue
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
            </div>
          )}

          {/* Step 4: Additional Information & Submit */}
          {step === 4 && (
            <div className="space-y-6 animate-fadeIn">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 flex items-center">
                <span className="bg-blue-600 text-white rounded-full w-6 h-6 inline-flex items-center justify-center mr-2 text-sm">4</span>
                Additional Information
              </h3>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Jornaya Lead ID <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="jornaya_leadid"
                  value={formData.jornaya_leadid}
                  onChange={handleChange}
                  required
                  className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-4 py-2 transition-colors"
                />
              </div>
              
              <div className="bg-blue-50 p-4 rounded-md border border-blue-200 mt-6">
                <h4 className="text-sm font-medium text-blue-800 mb-2">Review Your Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-x-4 gap-y-2 text-sm">
                  <div>
                    <span className="text-gray-500">Name:</span> {formData.first_name} {formData.last_name}
                  </div>
                  <div>
                    <span className="text-gray-500">Date of Birth:</span> {formData.dob}
                  </div>
                  <div>
                    <span className="text-gray-500">Gender:</span> {formData.gender === 'M' ? 'Male' : formData.gender === 'F' ? 'Female' : ''}
                  </div>
                  <div>
                    <span className="text-gray-500">Email:</span> {formData.email}
                  </div>
                  <div>
                    <span className="text-gray-500">Phone:</span> {formData.caller_id}
                  </div>
                  <div>
                    <span className="text-gray-500">Location:</span> {formData.city}, {formData.state} {formData.zip}
                  </div>
                </div>
              </div>
              
              <div className="pt-6 flex justify-between">
                <button
                  type="button"
                  onClick={prevStep}
                  className="flex items-center justify-center py-2 px-6 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                >
                  <svg className="mr-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                  </svg>
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center justify-center py-3 px-8 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  {isSubmitting ? (
                    <>
                      <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Processing...
                    </>
                  ) : (
                    <>
                      Submit Application
                      <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                    </>
                  )}
                </button>
              </div>
            </div>
          )}
        </form>

        <div className="px-6 pb-6 text-xs text-gray-500 text-center">
          <p>By submitting this form, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
        </div>
      </div>

      <style jsx>{`
        .animate-fadeIn {
          animation: fadeIn 0.3s ease-in-out;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
      `}</style>
    </div>
  );
};

export default EvolveTechFinalExpenseForm;