import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X } from "lucide-react";

const AdvancedCarSearchModal = ({ isOpen, onClose }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [carType, setCarType] = useState("new");
  const [isAnimating, setIsAnimating] = useState(false);
  const [shouldRender, setShouldRender] = useState(false);
  const [formData, setFormData] = useState({
    minPrice: "",
    maxPrice: "",
    transmission: [],
    fuelType: [],
    seatingCapacity: [],
    features: [],
    bootSpace: [],
    brand: [],
  });
  const [brands, setBrands] = useState([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Handle animation states
  useEffect(() => {
    if (isOpen) {
      setShouldRender(true);
      const timer = setTimeout(() => setIsAnimating(true), 10);
      return () => clearTimeout(timer);
    } else {
      setIsAnimating(false);
      const timer = setTimeout(() => setShouldRender(false), 300);
      return () => clearTimeout(timer);
    }
  }, [isOpen]);

  // Reset form when modal opens/closes
  useEffect(() => {
    if (isOpen) {
      setCurrentStep(1);
      setFormData({
        minPrice: "",
        maxPrice: "",
        transmission: [],
        fuelType: [],
        seatingCapacity: [],
        features: [],
        bootSpace: [],
        brand: [],
      });
    }
  }, [isOpen]);

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

        setBrands(brandsData);
      } catch (error) {
        console.error("Error fetching brands:", error);
        setBrands([
          { name: "Tata", image: "tata.png" },
          { name: "Maruti Suzuki", image: "maruti.png" },
          { name: "Hyundai", image: "hyundai.png" },
          { name: "Mahindra", image: "mahindra.png" },
          { name: "Toyota", image: "toyota.png" },
          { name: "Honda", image: "honda.png" },
          { name: "Ford", image: "ford.png" },
          { name: "Nissan", image: "nissan.png" },
          { name: "Renault", image: "renault.png" },
          { name: "Skoda", image: "skoda.png" },
          { name: "Volkswagen", image: "volkswagen.png" },
          { name: "BMW", image: "bmw.png" },
          { name: "Mercedes-Benz", image: "mercedes.png" },
          { name: "Audi", image: "audi.png" },
          { name: "Kia", image: "kia.png" },
          { name: "MG", image: "mg.png" },
        ]);
      } finally {
        setLoading(false);
      }
    };

    if (currentStep === 3 && isOpen) {
      fetchBrands();
    }
  }, [currentStep, isOpen]);

  const minPriceOptions = [
    { label: "5 Lakh", value: "500000" },
    { label: "10 Lakh", value: "1000000" },
    { label: "15 Lakh", value: "1500000" },
    { label: "20 Lakh", value: "2000000" },
  ];

  const maxPriceOptions = [
    { label: "10 Lakh", value: "1000000" },
    { label: "15 Lakh", value: "1500000" },
    { label: "20 Lakh", value: "2000000" },
    { label: "25 Lakh", value: "2500000" },
  ];

  const transmissionTypes = ["Manual", "Automatic", "AMT"];
  const fuelTypes = ["Petrol", "Diesel", "CNG", "Electric", "Hybrid"];
  const seatingOptions = ["2", "5", "6", "7", "7+"];
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

  const handleMultiSelectToggle = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: prev[field].includes(value)
        ? prev[field].filter((item) => item !== value)
        : [...prev[field], value],
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

  const handleBrandToggle = (brandName) => {
    setFormData((prev) => ({
      ...prev,
      brand: prev.brand.includes(brandName)
        ? prev.brand.filter((b) => b !== brandName)
        : [...prev.brand, brandName],
    }));
  };

  const handleNext = () => {
    if (currentStep < 3) {
      setCurrentStep(currentStep + 1);
    }
  };

  const handlePrevious = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const handleSearch = () => {
    const searchParams = new URLSearchParams();

    searchParams.set("carType", carType);
    if (formData.minPrice) searchParams.set("minPrice", formData.minPrice);
    if (formData.maxPrice) searchParams.set("maxPrice", formData.maxPrice);
    if (formData.transmission.length > 0)
      searchParams.set("transmission", formData.transmission.join(","));
    if (formData.fuelType.length > 0)
      searchParams.set("fuelType", formData.fuelType.join(","));
    if (formData.seatingCapacity.length > 0)
      searchParams.set("seatingCapacity", formData.seatingCapacity.join(","));
    if (formData.bootSpace.length > 0)
      searchParams.set("bootSpace", formData.bootSpace.join(","));
    if (formData.brand.length > 0)
      searchParams.set("brand", formData.brand.join(","));

    if (formData.features.length > 0) {
      searchParams.set("features", formData.features.join(","));
    }

    navigate(`/search-results?${searchParams.toString()}`);
    onClose();
  };

  const getStepTitle = () => {
    const titles = {
      1: "BASIC PREFERENCES",
      2: "FEATURES",
      3: "BRAND",
    };
    return titles[currentStep];
  };

  const isStepValid = () => {
    switch (currentStep) {
      case 1:
        return (
          formData.minPrice &&
          formData.maxPrice &&
          formData.transmission.length > 0 &&
          formData.fuelType.length > 0 &&
          formData.seatingCapacity.length > 0 &&
          formData.bootSpace.length > 0
        );
      case 2:
        return true;
      case 3:
        return formData.brand.length > 0;
      default:
        return false;
    }
  };

  if (!shouldRender) return null;

  const baseUrl = process.env.NEXT_PUBLIC_API || "";

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop with fade animation */}
      <div
        className={`absolute inset-0 bg-black/30 transition-opacity duration-300 ease-in-out ${
          isAnimating ? "opacity-100" : "opacity-0"
        }`}
        onClick={onClose}
      />

      {/* Sidebar with slide animation */}
      <div
        className={`absolute left-0 top-0 h-full w-full max-w-md bg-white shadow-xl transform transition-transform duration-300 ease-in-out ${
          isAnimating ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header */}
        <div className="bg-black font-bold text-[24px] text-white p-6 flex justify-between items-center h-24 ">
          <div>
            <span className="text-white">ASSIST</span>{" "}
            <span className="text-white">ME</span>
          </div>
          <button onClick={onClose} className="text-white">
            <X size={24} />
          </button>
        </div>

        {/* Progress */}
        <div className="bg-[#f5f5f5] p-4">
          <div className="flex items-center justify-between">
            <span className="text-black">
              Step {currentStep} of 3:{" "}
              <span className="font-bold">{getStepTitle()}</span>
            </span>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="h-[calc(100vh-200px)] flex flex-col">
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-4">
            {/* Step 1: Basic Preferences */}
            {currentStep === 1 && (
              <div className="space-y-6">
                {/* Price Range */}
                <div className="space-y-3">
                  <h4 className="font-bold text-black text-sm  ">
                    Price Range
                  </h4>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Min Price
                      </label>
                      <select
                        value={formData.minPrice}
                        onChange={(e) =>
                          handleInputChange("minPrice", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm  border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B60C19] focus:border-transparent"
                      >
                        <option value="">Select Min</option>
                        {minPriceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-xs text-gray-600 mb-1">
                        Max Price
                      </label>
                      <select
                        value={formData.maxPrice}
                        onChange={(e) =>
                          handleInputChange("maxPrice", e.target.value)
                        }
                        className="w-full px-3 py-2 text-sm  border border-gray-300 rounded-lg focus:ring-2 focus:ring-[#B60C19] focus:border-transparent"
                      >
                        <option value="">Select Max</option>
                        {maxPriceOptions.map((option) => (
                          <option key={option.value} value={option.value}>
                            {option.label}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                {/* Transmission */}
                <div className="space-y-3">
                  <h4 className="font-bold text-black text-sm  ">
                    Transmission
                  </h4>
                  <div className="grid grid-cols-3 gap-2">
                    {transmissionTypes.map((transmission) => (
                      <button
                        key={transmission}
                        onClick={() =>
                          handleMultiSelectToggle("transmission", transmission)
                        }
                        className={`p-2 text-xs rounded border-2 transition-colors ${
                          formData.transmission.includes(transmission)
                            ? "border-[#B60C19]  text-black"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                      >
                        {transmission}
                      </button>
                    ))}
                  </div>
                  {formData.transmission.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Selected: {formData.transmission.join(", ")}
                    </div>
                  )}
                </div>

                {/* Fuel Type */}
                <div className="space-y-3">
                  <h4 className="font-bold text-black text-sm  ">Fuel Type</h4>
                  <div className="grid grid-cols-3 gap-2">
                    {fuelTypes.map((fuel) => (
                      <button
                        key={fuel}
                        onClick={() =>
                          handleMultiSelectToggle("fuelType", fuel)
                        }
                        className={`p-2 text-xs rounded border-2 transition-colors ${
                          formData.fuelType.includes(fuel)
                            ? "border-[#B60C19]  text-black"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                      >
                        {fuel}
                      </button>
                    ))}
                  </div>
                  {formData.fuelType.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Selected: {formData.fuelType.join(", ")}
                    </div>
                  )}
                </div>

                {/* Seating */}
                <div className="space-y-3">
                  <h4 className="font-bold text-black text-sm  ">
                    Seating Capacity
                  </h4>
                  <div className="grid grid-cols-6 gap-2">
                    {seatingOptions.map((seats) => (
                      <button
                        key={seats}
                        onClick={() =>
                          handleMultiSelectToggle("seatingCapacity", seats)
                        }
                        className={`p-2 text-xs rounded border-2 transition-colors ${
                          formData.seatingCapacity.includes(seats)
                            ? "border-[#B60C19]  text-black"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                      >
                        {seats}
                      </button>
                    ))}
                  </div>
                  {formData.seatingCapacity.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Selected: {formData.seatingCapacity.join(", ")}
                    </div>
                  )}
                </div>

                {/* Boot Space */}
                <div className="space-y-3">
                  <h4 className="font-bold text-black text-sm  ">Boot Space</h4>
                  <div className="grid grid-cols-2 gap-2">
                    {bootSpaceOptions.map((option) => (
                      <button
                        key={option.value}
                        onClick={() =>
                          handleMultiSelectToggle("bootSpace", option.value)
                        }
                        className={`p-2 text-xs text-left rounded border-2 transition-colors ${
                          formData.bootSpace.includes(option.value)
                            ? "border-[#B60C19]  text-black"
                            : "border-gray-200 hover:border-red-300"
                        }`}
                      >
                        {option.label}
                      </button>
                    ))}
                  </div>
                  {formData.bootSpace.length > 0 && (
                    <div className="text-xs text-gray-500">
                      Selected:{" "}
                      {formData.bootSpace
                        .map(
                          (value) =>
                            bootSpaceOptions.find((opt) => opt.value === value)
                              ?.label
                        )
                        .join(", ")}
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Step 2: Features */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-800">
                    Select Features (Optional)
                  </h3>
                  <p className="text-sm  text-gray-600 mt-1">
                    Choose features that are important to you:
                  </p>
                </div>

                <div className="space-y-2">
                  {availableFeatures.map((feature) => (
                    <label
                      key={feature}
                      className="flex items-center p-3 border rounded-lg hover:bg-gray-50 cursor-pointer"
                    >
                      <input
                        type="checkbox"
                        checked={formData.features.includes(feature)}
                        onChange={() => handleFeatureToggle(feature)}
                        className="w-4 h-4 border-gray-300 rounded accent-[#B60C19] focus:ring-[#B60C19] flex-shrink-0"
                      />

                      <span className="ml-3 text-sm ">{feature}</span>
                    </label>
                  ))}
                </div>

                <div className="text-sm  text-gray-500 font-bold bg-gray-50 p-3 rounded">
                  Selected: {formData.features.length} features
                </div>
              </div>
            )}

            {/* Step 3: Brand */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg font-semibold text-gray-800">
                  Select Brands
                </h3>
                {loading ? (
                  <div className="flex justify-center items-center py-12">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-[#B60C19]"></div>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 gap-3">
                    {Array.isArray(brands) && brands.length > 0 ? (
                      brands.map((brand) => (
                        <button
                          key={brand._id || brand.name}
                          onClick={() => handleBrandToggle(brand.name)}
                          className={`p-3 rounded-lg border-2 transition-colors text-sm  flex flex-col items-center gap-2 ${
                            formData.brand.includes(brand.name)
                              ? "border-[#B60C19]  text-black"
                              : "border-gray-200 hover:border-red-300"
                          }`}
                        >
                          <img
                            src={`${baseUrl}/brandImages/${brand.image}`}
                            alt={brand.name}
                            crossOrigin="anonymous"
                            className="w-14 h-14 object-contain"
                          />
                          <span className="text-xs">{brand.name}</span>
                        </button>
                      ))
                    ) : (
                      <div className="col-span-2 text-center py-8 text-gray-500">
                        No brands available
                      </div>
                    )}
                  </div>
                )}
                {formData.brand.length > 0 && (
                  <div className="text-sm  text-gray-500 font-bold bg-gray-50 p-3 rounded">
                    Selected: {formData.brand.join(", ")}
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Fixed Navigation Footer */}
          <div className="border-t border-gray-200 bg-white p-4">
            <div className="flex justify-between">
              <button
                onClick={handlePrevious}
                disabled={currentStep === 1}
                className="px-6 py-2 border border-gray-300 rounded-lg text-black hover:bg-gray-100 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>

              {currentStep === 3 ? (
                <button
                  onClick={handleSearch}
                  disabled={!isStepValid()}
                  className="px-8 py-2 border border-black bg-black text-white disabled:bg-white disabled:!text-black disabled:cursor-not-allowed font-semibold rounded-lg transition-colors"
                >
                  Search Cars
                </button>
              ) : (
                <button
                  onClick={handleNext}
                  disabled={!isStepValid()}
                  className="px-6 py-2 border border-black text-black hover:bg-black hover:text-white font-semibold rounded-lg transition-colors"
                >
                  Next
                </button>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdvancedCarSearchModal;
