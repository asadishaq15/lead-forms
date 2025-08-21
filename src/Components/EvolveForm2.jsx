import React, { useState, useEffect } from "react";

const EvolveTechAutoInsuranceForm = () => {
  const [formData, setFormData] = useState({
    lead_token: "c51dacbf90cd4f1db448b0fe861b6cf4",
    caller_id: "",
    traffic_source_id: "1039",
    first_name: "",
    last_name: "",
    email: "",
    address: "",
    address2: "",
    city: "",
    state: "",
    zip: "",
    dob: "",
    marital_status: "",
    gender: "",
    residence_status: "",
    vehicle1_year: "",
    vehicle1_make: "",
    vehicle1_model: "",
    driver1_credit_rating: "",
    driver1_sr22_required: false,
    ip_address: "",
    jornaya_leadid: "",
    drivers: "1",
    sr22: "No", // Changed from boolean to string
    incident_type: "",
    insurance: "",
    policy_start_date: ""
  });

  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [successMessage, setSuccessMessage] = useState(null);

  // Generate random Jornaya Lead ID on component mount
  useEffect(() => {
    // Generate a random alphanumeric string for Jornaya Lead ID
    const randomJornayaId = Math.random().toString(36).substring(2, 15) + 
                           Math.random().toString(36).substring(2, 15);
    
    // Get user's IP address (in a real app, you might use a service for this)
    const randomIp = `192.168.${Math.floor(Math.random() * 255)}.${Math.floor(Math.random() * 255)}`;
    
    setFormData(prev => ({
      ...prev,
      jornaya_leadid: randomJornayaId,
      ip_address: randomIp
    }));
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    setError(null);
    setIsSubmitting(true);

    const requiredFields = [
      "caller_id",
      "first_name",
      "last_name",
      "email",
      "address",
      "city",
      "state",
      "zip",
      "dob",
      "gender",
      "marital_status",
      "residence_status",
      "vehicle1_year",
      "vehicle1_make",
      "vehicle1_model",
      "driver1_credit_rating"
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
            address: "",
            address2: "",
            city: "",
            state: "",
            zip: "",
            dob: "",
            marital_status: "",
            gender: "",
            residence_status: "",
            vehicle1_year: "",
            vehicle1_make: "",
            vehicle1_model: "",
            driver1_credit_rating: "",
            driver1_sr22_required: false,
            sr22: false,
            incident_type: "",
            insurance: "",
            policy_start_date: ""
          }));
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
    const { name, value, type, checked } = e.target;
    
    if (type === "checkbox") {
      setFormData((prev) => ({
        ...prev,
        [name]: checked,
      }));
      return;
    }
    
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
    else if (name === "dob" || name === "policy_start_date") {
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
    // Format vehicle year (integer validation)
    else if (name === "vehicle1_year") {
      const cleaned = value.replace(/\D/g, '');
      setFormData((prev) => ({
        ...prev,
        [name]: cleaned.slice(0, 4),
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

  const states = [
    "AL", "AK", "AZ", "AR", "CA", "CO", "CT", "DE", "DC", "FL", "GA",
    "HI", "ID", "IL", "IN", "IA", "KS", "KY", "LA", "ME", "MD",
    "MA", "MI", "MN", "MS", "MO", "MT", "NE", "NV", "NH", "NJ",
    "NM", "NY", "NC", "ND", "OH", "OK", "OR", "PA", "RI", "SC",
    "SD", "TN", "TX", "UT", "VT", "VA", "WA", "WV", "WI", "WY"
  ];

  const maritalStatusOptions = [
    { value: "Single", label: "Single" },
    { value: "Married", label: "Married" },
  ];
  const residenceStatusOptions = [
    { value: "Own", label: "Own" },
    { value: "Rent", label: "Rent" },
  ];
  

  const creditRatingOptions = [
    { value: "Excellent", label: "Excellent" },
    { value: "Good", label: "Good" },
    { value: "Some Problems", label: "Some Problems" },
    { value: "Major Problems", label: "Major Problems" },
  ];

  const carMakes = [
    "Acura", "Alfa Romeo", "Aston Martin", "Audi", "Bentley", "BMW", "Buick", "Cadillac", 
    "Chevrolet", "Chrysler", "Dodge", "Ferrari", "Fiat", "Ford", "Genesis", "GMC", "Honda", 
    "Hyundai", "Infiniti", "Jaguar", "Jeep", "Kia", "Lamborghini", "Land Rover", "Lexus", 
    "Lincoln", "Maserati", "Mazda", "McLaren", "Mercedes-Benz", "Mini", "Mitsubishi", "Nissan", 
    "Porsche", "Ram", "Rolls-Royce", "Subaru", "Tesla", "Toyota", "Volkswagen", "Volvo"
  ];

  const incidentTypeOptions = [
    { value: "Intoxic", label: "Intoxic" },
    { value: "Other", label: "Other" },
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

  const currentYear = new Date().getFullYear();
  const years = Array.from(new Array(30), (_, i) => currentYear - i);

  return (
    <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-lg overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-800 py-6">
          <h2 className="text-center text-3xl font-extrabold text-white px-4">
          All state Auto insurance form
          </h2>
          
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

        <form onSubmit={handleSubmit} className="px-6 py-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Personal Information Section */}
            <div className="md:col-span-3">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">
                Personal Information
              </h3>
            </div>
            
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
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
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
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
                placeholder="Smith"
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
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
              />
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
        value="Male"
        checked={formData.gender === "Male"}
        onChange={handleChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
      />
      <span className="ml-2 text-gray-700 text-sm">Male</span>
    </label>
    <label className="inline-flex items-center">
      <input
        type="radio"
        name="gender"
        value="Female"
        checked={formData.gender === "Female"}
        onChange={handleChange}
        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
      />
      <span className="ml-2 text-gray-700 text-sm">Female</span>
    </label>
  </div>
</div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Marital Status <span className="text-red-500">*</span>
              </label>
              <select
                name="marital_status"
                value={formData.marital_status}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
              >
                <option value="">Select Marital Status</option>
                {maritalStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Residence Status <span className="text-red-500">*</span>
              </label>
              <select
                name="residence_status"
                value={formData.residence_status}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
              >
                <option value="">Select Residence Status</option>
                {residenceStatusOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Contact Information Section */}
            <div className="md:col-span-3 mt-4">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">
                Contact Information
              </h3>
            </div>
            
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
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
                placeholder="john.smith@example.com"
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
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
              />
            </div>

            <div className="md:col-span-3 mt-4">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">
                Address Information
              </h3>
            </div>
            
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Address <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="address"
                value={formData.address}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
                placeholder="123 Main St"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Address Line 2
              </label>
              <input
                type="text"
                name="address2"
                value={formData.address2}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
                placeholder="Apt 4B"
              />
            </div>
            
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
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
                placeholder="Boulder"
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
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
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
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
              />
            </div>

            {/* Vehicle Information Section */}
            <div className="md:col-span-3 mt-4">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">
                Vehicle Information
              </h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Year <span className="text-red-500">*</span>
              </label>
              <select
                name="vehicle1_year"
                value={formData.vehicle1_year}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
              >
                <option value="">Select Year</option>
                {years.map(year => (
                  <option key={year} value={year}>{year}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Make <span className="text-red-500">*</span>
              </label>
              <select
                name="vehicle1_make"
                value={formData.vehicle1_make}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
              >
                <option value="">Select Make</option>
                {carMakes.map(make => (
                  <option key={make} value={make}>{make}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Vehicle Model <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="vehicle1_model"
                value={formData.vehicle1_model}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
                placeholder="Accord"
              />
            </div>

            {/* Driver Information Section */}
            <div className="md:col-span-3 mt-4">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">
                Driver Information
              </h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Credit Rating <span className="text-red-500">*</span>
              </label>
              <select
                name="driver1_credit_rating"
                value={formData.driver1_credit_rating}
                onChange={handleChange}
                required
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
              >
                <option value="">Select Credit Rating</option>
                {creditRatingOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
  <label className="block text-sm font-medium text-gray-700">
    SR22 Filing
  </label>
  <div className="mt-2 flex gap-4">
    <label className="inline-flex items-center">
      <input
        type="radio"
        name="sr22"
        value="Yes"
        checked={formData.sr22 === "Yes"}
        onChange={() =>
          setFormData((prev) => ({
            ...prev,
            sr22: "Yes",
          }))
        }
        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
      />
      <span className="ml-2 text-gray-700 text-sm">Yes</span>
    </label>
    <label className="inline-flex items-center">
      <input
        type="radio"
        name="sr22"
        value="No"
        checked={formData.sr22 === "No"}
        onChange={() =>
          setFormData((prev) => ({
            ...prev,
            sr22: "No",
          }))
        }
        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
      />
      <span className="ml-2 text-gray-700 text-sm">No</span>
    </label>
    <label className="inline-flex items-center">
      <input
        type="radio"
        name="sr22"
        value="Unknown"
        checked={formData.sr22 === "Unknown"}
        onChange={() =>
          setFormData((prev) => ({
            ...prev,
            sr22: "Unknown",
          }))
        }
        className="h-4 w-4 text-blue-600 focus:ring-blue-500"
      />
      <span className="ml-2 text-gray-700 text-sm">Unknown</span>
    </label>
  </div>
</div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Incident Type
              </label>
              <select
                name="incident_type"
                value={formData.incident_type}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
              >
                <option value="">Select Incident Type</option>
                {incidentTypeOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>

            {/* Insurance Information Section */}
            <div className="md:col-span-3 mt-4">
              <h3 className="text-xl font-semibold text-gray-900 border-b pb-2 mb-4">
                Insurance Information
              </h3>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Current Insurance
              </label>
              <select
                name="insurance"
                value={formData.insurance}
                onChange={handleChange}
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
              >
                <option value="">Select Current Insurance</option>
                {insuranceOptions.map(option => (
                  <option key={option.value} value={option.value}>{option.label}</option>
                ))}
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Policy Start Date
              </label>
              <input
                type="text"
                name="policy_start_date"
                value={formData.policy_start_date}
                onChange={handleChange}
                placeholder="YYYY-MM-DD"
                className="mt-1 block w-full rounded-md border-2 border-gray-300 shadow-sm focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 px-3 py-2 text-sm transition-colors"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">
                SR22 Filing
              </label>
              <div className="mt-2">
                <label className="inline-flex items-center">
                  <input
                    type="checkbox"
                    name="sr22"
                    checked={formData.sr22}
                    onChange={handleChange}
                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 rounded"
                  />
                  <span className="ml-2 text-gray-700 text-sm">Yes, SR22 filing is needed</span>
                </label>
              </div>
            </div>
          </div>

          <div className="mt-8 pt-5 border-t border-gray-200 flex justify-end">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center justify-center py-2 px-6 border border-transparent rounded-md shadow-sm text-base font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
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
                  Get My Auto Insurance Quote
                  <svg className="ml-2 h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </>
              )}
            </button>
          </div>
        </form>

        <div className="px-6 pb-6 text-xs text-gray-500 text-center">
          <p>By submitting this form, you agree to our <a href="#" className="text-blue-600 hover:underline">Terms of Service</a> and <a href="#" className="text-blue-600 hover:underline">Privacy Policy</a>.</p>
        </div>
      </div>
    </div>
  );
};

export default EvolveTechAutoInsuranceForm;