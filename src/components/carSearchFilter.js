import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

export default function AdvancedCarSearchComponent() {
  const [currentStep, setCurrentStep] = useState(1);
  const [carType, setCarType] = useState("new");
  const [formData, setFormData] = useState({
    minPrice: "",
    maxPrice: "",
    transmission: "",
    fuelType: "",
    seatingCapacity: "",
    features: [],
    bootSpace: "",
    brand: "",
  });
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Fetch brands from API
  useEffect(() => {
    const fetchBrands = async () => {
      try {
        setLoading(true);
        const baseUrl = process.env.NEXT_PUBLIC_API || "";
        const response = await fetch(`${baseUrl}/api/brands`);
        const data = await response.json();

        let brandsData = [];

        if (Array.isArray(data)) {
          brandsData = data;
        } else if (data && Array.isArray(data.brands)) {
          brandsData = data.brands;
        } else if (data && Array.isArray(data.data)) {
          brandsData = data.data;
        } else {
          throw new Error("Unexpected API response format");
        }

        // Extract brand names if objects are returned
        const brandNames = brandsData.map((brand) =>
          typeof brand === "object" ? brand.name : brand
        );

        setBrands(brandNames);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([
          "Tata",
          "Maruti Suzuki",
          "Hyundai",
          "Mahindra",
          "Toyota",
          "Honda",
          "Ford",
          "Nissan",
          "Renault",
          "Skoda",
          "Volkswagen",
          "BMW",
          "Mercedes-Benz",
          "Audi",
          "Kia",
          "MG",
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (currentStep === 7) {
      fetchBrands();
    }
  }, [currentStep]);
  const priceRanges = [
    { label: "Under ₹2 Lakh", value: "0-200000" },
    { label: "₹2-5 Lakh", value: "200000-500000" },
    { label: "₹5-10 Lakh", value: "500000-1000000" },
    { label: "₹10-15 Lakh", value: "1000000-1500000" },
    { label: "₹15-25 Lakh", value: "1500000-2500000" },
    { label: "₹25-50 Lakh", value: "2500000-5000000" },
    { label: "Above ₹50 Lakh", value: "5000000-99999999" },
  ];

  const transmissionTypes = ["Manual", "Automatic", "CVT", "AMT", "DCT"];
  const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
  const seatingOptions = ["2", "4", "5", "6", "7", "8+"];
  const bootSpaceOptions = [
    { label: "1 Bag (Small)", value: "1" },
    { label: "2 Bags (Compact)", value: "2" },
    { label: "3 Bags (Medium)", value: "3" },
    { label: "4 Bags (Large)", value: "4" },
    { label: "5 Bags (Very Large)", value: "5" },
    { label: "6+ Bags (Extra Large)", value: "6" },
  ];

  const availableFeatures = [
    "Touch Screen",
    "Reverse Parking Camera",
    "Cruise Control",
    "Ventilated Seats",
    "Sunroof",
    "ADAS",
    "Push Button Start Stop",
    "Ambient Lighting",
    "Electric Seats Adjustment",
    "Wireless Charging",
    "Android Auto & Apple Carplay",
    "Auto Headlamps",
    "TPMS",
    "Hill Start Assist",
    "Air Conditioning",
    "Air Purifier",
  ];

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  const handleFeatureToggle = (feature) => {
    setFormData((prev) => ({
      ...prev,
      features: prev.features.includes(feature)
        ? prev.features.filter((f) => f !== feature)
        : [...prev.features, feature],
    }));
  };

  const handleNext = () => {
    if (currentStep < 7) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  // const handleSearch = () => {
  //   const searchParams = {
  //     carType,
  //     ...formData,
  //   };
  //   console.log("Search Parameters:", searchParams);
  //   // Here you would typically navigate to results or make an API call
  //   alert("Search initiated! Check console for parameters.");
  // };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    // Add all search parameters
    searchParams.set("carType", carType);
    if (formData.minPrice) searchParams.set("minPrice", formData.minPrice);
    if (formData.maxPrice) searchParams.set("maxPrice", formData.maxPrice);
    if (formData.transmission)
      searchParams.set("transmission", formData.transmission);
    if (formData.fuelType) searchParams.set("fuelType", formData.fuelType);
    if (formData.seatingCapacity)
      searchParams.set("seatingCapacity", formData.seatingCapacity);
    if (formData.bootSpace) searchParams.set("bootSpace", formData.bootSpace);
    if (formData.brand) searchParams.set("brand", formData.brand);

    // Add features as comma-separated list
    if (formData.features.length > 0) {
      searchParams.set("features", formData.features.join(","));
    }

    // Navigate to results page
    navigate(`/search-results?${searchParams.toString()}`);
  };

  const getStepTitle = () => {
    const titles = {
      1: "Price Range",
      2: "Transmission Type",
      3: "Fuel Type",
      4: "Seating Capacity",
      5: "Features",
      6: "Boot Space",
      7: "Brand",
    };
    return titles[currentStep];
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return formData.minPrice && formData.maxPrice;
      case 2:
        return formData.transmission;
      case 3:
        return formData.fuelType;
      case 4:
        return formData.seatingCapacity;
      case 5:
        return true; // Features are optional
      case 6:
        return formData.bootSpace;
      case 7:
        return formData.brand;
      default:
        return false;
    }
  };

  return (
    <div className="w-full max-w-2xl mx-auto bg-white rounded-2xl shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-red-500 to-red-600 text-white p-6">
        <h2 className="text-2xl font-bold mb-2">Find Your Perfect Car</h2>
        <div className="flex items-center justify-between">
          <span className="text-red-100">
            Step {currentStep} of 7: {getStepTitle()}
          </span>
          <div className="flex space-x-1">
            {[1, 2, 3, 4, 5, 6, 7].map((step) => (
              <div
                key={step}
                className={`w-2 h-2 rounded-full ${
                  step <= currentStep ? "bg-white" : "bg-red-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Step Content */}
      <div className="p-6 min-h-[300px]">
        {/* Step 1: Price Range */}
        {currentStep === 1 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Select Price Range
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Minimum Price
                </label>
                <input
                  type="number"
                  placeholder="Enter minimum price"
                  value={formData.minPrice}
                  onChange={(e) =>
                    handleInputChange("minPrice", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Maximum Price
                </label>
                <input
                  type="number"
                  placeholder="Enter maximum price"
                  value={formData.maxPrice}
                  onChange={(e) =>
                    handleInputChange("maxPrice", e.target.value)
                  }
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500 focus:border-transparent"
                />
              </div>
            </div>
            <div className="text-sm text-gray-600">
              Or select from popular ranges:
            </div>
            <div className="grid grid-cols-2 gap-3">
              {priceRanges.map((range) => (
                <button
                  key={range.value}
                  onClick={() => {
                    const [min, max] = range.value.split("-");
                    handleInputChange("minPrice", min);
                    handleInputChange("maxPrice", max);
                  }}
                  className="p-3 text-left border border-gray-200 rounded-lg hover:border-red-500 hover:bg-red-50 transition-colors"
                >
                  {range.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 2: Transmission */}
        {currentStep === 2 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Select Transmission Type
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {transmissionTypes.map((transmission) => (
                <button
                  key={transmission}
                  onClick={() =>
                    handleInputChange("transmission", transmission)
                  }
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.transmission === transmission
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  {transmission}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 3: Fuel Type */}
        {currentStep === 3 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Select Fuel Type
            </h3>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {fuelTypes.map((fuel) => (
                <button
                  key={fuel}
                  onClick={() => handleInputChange("fuelType", fuel)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.fuelType === fuel
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  {fuel}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 4: Seating Capacity */}
        {currentStep === 4 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Select Seating Capacity
            </h3>
            <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
              {seatingOptions.map((seats) => (
                <button
                  key={seats}
                  onClick={() => handleInputChange("seatingCapacity", seats)}
                  className={`p-4 rounded-lg border-2 transition-colors ${
                    formData.seatingCapacity === seats
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  {seats} {seats === "8+" ? "" : "Seater"}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 5: Features */}
        {currentStep === 5 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Select Features (Optional)
            </h3>
            <p className="text-sm text-gray-600">
              Choose features that are important to you:
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 max-h-60 overflow-y-auto">
              {availableFeatures.map((feature) => (
                <label
                  key={feature}
                  className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={formData.features.includes(feature)}
                    onChange={() => handleFeatureToggle(feature)}
                    className="w-4 h-4 text-red-500 border-gray-300 rounded focus:ring-red-500"
                  />
                  <span className="ml-3 text-sm">{feature}</span>
                </label>
              ))}
            </div>
            <div className="text-sm text-gray-500">
              Selected: {formData.features.length} features
            </div>
          </div>
        )}

        {/* Step 6: Boot Space */}
        {currentStep === 6 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Select Minimum Boot Space
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {bootSpaceOptions.map((option) => (
                <button
                  key={option.value}
                  onClick={() => handleInputChange("bootSpace", option.value)}
                  className={`p-4 rounded-lg border-2 transition-colors text-left ${
                    formData.bootSpace === option.value
                      ? "border-red-500 bg-red-50 text-red-700"
                      : "border-gray-200 hover:border-red-300"
                  }`}
                >
                  {option.label}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Step 7: Brand */}
        {currentStep === 7 && (
          <div className="space-y-6">
            <h3 className="text-lg font-semibold text-gray-800">
              Select Brand
            </h3>
            {loading ? (
              <div className="flex justify-center items-center h-32">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4 max-h-60 overflow-y-auto">
                {Array.isArray(brands) && brands.length > 0 ? (
                  brands.map((brand) => (
                    <button
                      key={brand._id || brand.name || brand} // Use a unique identifier
                      onClick={() =>
                        handleInputChange("brand", brand.name || brand)
                      }
                      className={`p-4 rounded-lg border-2 transition-colors ${
                        formData.brand === (brand.name || brand)
                          ? "border-red-500 bg-red-50 text-red-700"
                          : "border-gray-200 hover:border-red-300"
                      }`}
                    >
                      {brand.name || brand}{" "}
                      {/* Display the name property if it exists */}
                    </button>
                  ))
                ) : (
                  <div className="col-span-3 text-center py-4 text-gray-500">
                    No brands available
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      {/* Navigation */}
      <div className="p-6 border-t border-gray-200 bg-gray-50">
        <div className="flex justify-between">
          <button
            onClick={handlePrevious}
            disabled={currentStep === 1}
            className="px-6 py-3 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
          >
            Previous
          </button>

          {currentStep === 7 ? (
            <button
              onClick={handleSearch}
              disabled={!isStepValid()}
              className="px-8 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              Search Cars
            </button>
          ) : (
            <button
              onClick={handleNext}
              disabled={!isStepValid()}
              className="px-6 py-3 bg-red-500 hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed text-white font-semibold rounded-lg transition-colors"
            >
              Next
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
