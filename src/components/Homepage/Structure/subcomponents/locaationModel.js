import React, { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Search, X, MapPin } from "lucide-react";
import cities from "./statelist.json";
import { Locate } from "lucide-react";

const CombinedComponents = () => {
  const [currentStep, setCurrentStep] = useState("location"); // location → search → variant
  const [userLocation, setUserLocation] = useState(null);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState([]); // Initialize as empty array

  // Location state
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [nearestCity, setNearestCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState(cities);
  const [locationError, setLocationError] = useState(false);
  const [city, setCity] = useState("");

  // Search state
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);

  // Variant state
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState({});
  const [visibleBrand, setVisibleBrand] = useState(null);
  const [popularCars, setPopularCars] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [variantSearchTerm, setVariantSearchTerm] = useState("");

  const popularCarsRef = useRef(null);
  const navigate = useNavigate();

  const { brandId, productId, variantId } = useParams();
  const location = useLocation();

  // Check for stored data on initial load
  useEffect(() => {
    const savedLocation = JSON.parse(localStorage.getItem("location"));
    const savedProduct = JSON.parse(localStorage.getItem("selectedProduct"));
    const savedVariant = JSON.parse(localStorage.getItem("selectedVariant"));

    if (savedLocation) {
      setUserLocation(savedLocation);
      setCurrentStep("search");
    }

    if (savedProduct) {
      setSelectedProduct(savedProduct);
    }

    if (savedVariant) {
      // Ensure savedVariant is an array
      setSelectedVariant(
        Array.isArray(savedVariant) ? savedVariant : [savedVariant]
      );
      // If all data is present, navigate to emi-calculator with new URL pattern
      if (savedLocation && savedProduct && savedVariant) {
        navigate(
          `/EMI-Calculator/${savedProduct.brand?._id}/${savedProduct._id}/${savedVariant._id}`,
          {
            state: {
              location: savedLocation,
              product: savedProduct,
              variant: savedVariant,
            },
          }
        );
      }
    }
  }, []);

  useEffect(() => {
    fetchBrands();
    fetchPopularCars();
  }, []);

  const navigateToEmiCalculator = (variant) => {
    navigate(
      `/EMI-Calculator/${selectedProduct.brand?._id}/${selectedProduct._id}/${variant._id}`,
      {
        state: {
          location: userLocation,
          product: selectedProduct,
          variant: variant,
        },
      }
    );
  };

  // Handle close functionality
  const handleClose = () => {
    // Clear all stored data
    localStorage.removeItem("location");
    localStorage.removeItem("selectedProduct");
    localStorage.removeItem("selectedVariant");

    // Reset all state
    setUserLocation(null);
    setSelectedProduct(null);
    setSelectedVariant([]);
    setCurrentStep("location");
    setSearchTerm("");
    setSearchResults([]);
    setSelectedFuelType(null);
    setVariantSearchTerm("");

    // You can either navigate away or hide the component
    // Option 1: Navigate to a different route
    navigate("/"); // Navigate to home or wherever you want
  };

  const findNearestCity = (lat, lon, cities) => {
    let minDistance = Infinity;
    let closestCity = null;

    cities.forEach((city) => {
      const distance = getDistance(lat, lon, city.Lat, city.Long);
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    });

    return closestCity;
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371; // Earth's radius in km
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term) {
      const filtered = cities.filter(
        (city) =>
          city.City.toLowerCase().includes(term.toLowerCase()) ||
          city.State.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  };

  const handleCityClick = (city) => {
    setNearestCity(city);
    const location = {
      city: city.City,
      state: city.State,
    };
    localStorage.setItem("location", JSON.stringify(location));
    setUserLocation(location);
    setCurrentStep("search");
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Find nearest city from coordinates
          const closestCity = findNearestCity(latitude, longitude, cities);
          setNearestCity(closestCity);

          if (closestCity) {
            const location = {
              city: closestCity.City,
              state: closestCity.State,
            };
            localStorage.setItem("location", JSON.stringify(location));
            setUserLocation(location);
            setCurrentStep("search");
          }

          // Also get city name from reverse geocoding
          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          )
            .then((res) => res.json())
            .then((data) => {
              const cityName =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.county ||
                "Unknown city";
              setCity(cityName);
            })
            .catch((err) => {
              console.error("Error fetching location data:", err);
            });
        },
        () => {
          setLocationError(true);
          getLocationFromIP();
        }
      );
    } else {
      console.log("Geolocation is not available in your browser.");
      setLocationError(true);
      getLocationFromIP();
    }
  };

  const getLocationFromIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const ip = data.ip;

      const locationResponse = await fetch(`https://ipapi.co/${ip}/json`);
      const locationData = await locationResponse.json();

      const { latitude, longitude } = locationData;

      const closestCity = findNearestCity(latitude, longitude, cities);
      setNearestCity(closestCity);
      const location = {
        city: closestCity.City,
        state: closestCity.State,
      };
      localStorage.setItem("location", JSON.stringify(location));
      setUserLocation(location);
      setCurrentStep("search");
    } catch (error) {
      console.error("Error fetching location data from IP:", error);
      setLocationError(true);
    }
  };

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleCarSearch = async (term) => {
    if (term.trim() === "" || term.length <= 2) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/extra/search-product-webLandin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search: term }),
        }
      );
      const data = await response.json();
      if (data.success) {
        const activeCars = data.cars.filter((cars) => cars?.active !== "false");
        setSearchResults(activeCars);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  const debouncedSearch = debounce(handleCarSearch, 500);

  const handleProductSelect = (product) => {
    setSelectedProduct(product);
    localStorage.setItem("selectedProduct", JSON.stringify(product));
    setCurrentStep("variant");
    fetchVariants(product._id);
  };

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/brands`);
      const data = await response.json();
      setBrands(data.data);
    } catch (err) {
      console.error("Failed to fetch brands", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/extra/get-all-cars-for-popularity`
      );
      const data = await response.json();
      if (data.success) {
        const sortedCars = data.data
          .filter((car) => car.popularity >= 1 && car.popularity <= 5)
          .sort((a, b) => a.popularity - b.popularity);
        setPopularCars(sortedCars);
      }
    } catch (err) {
      console.error("Error fetching popular cars", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsForBrand = async (brandId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/cars/brand/${brandId}`
      );
      const data = await response.json();
      setProducts((prevProducts) => ({
        ...prevProducts,
        [brandId]: data,
      }));
    } catch (err) {
      console.error(`Failed to fetch products for brand ${brandId}`, err);
    }
  };

  const fetchVariants = async (productId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/variants/active/${productId}`
      );
      const data = await response.json();

      // More robust handling of response structure
      let variants = [];
      if (data && data.data) {
        variants = Array.isArray(data.data) ? data.data : [];
      } else if (Array.isArray(data)) {
        variants = data;
      }

      setSelectedVariant(variants);
    } catch (error) {
      console.error("Error fetching variants:", error);
      setSelectedVariant([]);
    } finally {
      setLoading(false);
    }
  };
  const handleVariantSelect = (variant) => {
    localStorage.setItem("selectedVariant", JSON.stringify(variant));
    setSelectedVariant([variant]); // Wrap in array if needed
    navigateToEmiCalculator(variant);
  };

  const toggleBrandVisibility = (brandId) => {
    if (visibleBrand === brandId) {
      setVisibleBrand(null);
    } else {
      setVisibleBrand(brandId);
      if (!products[brandId] || products[brandId].length === 0) {
        fetchProductsForBrand(brandId);
      }
    }
  };

  const handleScroll = () => {
    if (popularCarsRef.current) {
      popularCarsRef.current.scrollLeft += 200;
    }
  };

  const parseList = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const items = doc.querySelectorAll("ul li, p");
    return Array.from(items)
      .map((item) => item.textContent.trim())
      .join(" | ");
  };

  const handleBack = () => {
    if (currentStep === "variant") {
      setCurrentStep("search");
    } else if (currentStep === "search") {
      setCurrentStep("location");
    }
  };

  const handleVariantSearch = (e) => {
    setVariantSearchTerm(e.target.value.toLowerCase());
  };

  // Fixed filteredVariants to ensure selectedVariant is always an array
  const filteredVariants = Array.isArray(selectedVariant)
    ? selectedVariant.filter((variant) => {
        if (!variantSearchTerm) return true;
        return (
          variant.varientName.toLowerCase().includes(variantSearchTerm) ||
          variant.fuel.toLowerCase().includes(variantSearchTerm) ||
          variant.transmission.toLowerCase().includes(variantSearchTerm) ||
          variant.exShowroomPrice.toString().includes(variantSearchTerm)
        );
      })
    : [];

  const formatPriceToLakhs = (price) => {
    if (!price) return "₹ N/A";
    const lakhs = (price / 100000).toFixed(2);
    return `₹ ${lakhs} Lakh`;
  };

  return (
    <div className="combined-components-container ">
      {currentStep === "location" && (
        <div className="location-step ">
          <div className="w-[346px] h-[400px] rounded-[10px] bg-white overflow-hidden">
            {/* Fixed Header */}
            <div className="flex items-center justify-between w-full p-[20px] pb-4 border-b border-gray-100">
              <h2 className="text-[14px] font-semibold text-[#818181]">
                SELECT YOUR <span className="text-[#B10819]">CITY</span>
              </h2>
              <button
                onClick={handleClose}
                className="text-black hover:text-[#B10819] transition-colors"
              >
                <span className="text-2xl">
                  <X />
                </span>
              </button>
            </div>

            <div className="px-[20px] py-4 border-b border-gray-100 font-[Montserrat] font-medium">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full h-[40px] border border-slate-300 px-4 text-black"
                />
                <div className="absolute inset-y-0 right-0 flex justify-center items-center">
                  <button className="bg-black text-white w-[38px] h-[38px] flex justify-center items-center">
                    <Search className="ml-3" size={20} />
                  </button>
                </div>
              </div>
            </div>

            {/* Fixed Results Header and Detect Button */}
            <div className="px-[20px] py-3 border-b border-gray-100 font-[Montserrat] font-medium">
              <div className="text-[13px] font-medium text-[#B1081A] mb-3 font-[Montserrat]">
                Results
              </div>

              <button
                className="flex items-center text-[#B10819] hover:bg-red-50 p-2 rounded w-full"
                onClick={detectLocation}
              >
                <Locate size={20} />
                Detect Your Location
              </button>
            </div>

            {/* Scrollable City List */}
            <div
              className="flex-1 overflow-y-auto px-[20px] font-[Montserrat] font-medium"
              style={{ height: "calc(400px - 200px)" }}
            >
              {filteredCities.slice(0, 100).map((city, index) => (
                <div
                  key={index}
                  onClick={() => handleCityClick(city)}
                  className="py-3 border-b border-gray-200 text-gray-800 cursor-pointer hover:bg-gray-50 -mx-[20px] px-[20px]"
                >
                  {city.City}, {city.State}, {city.Country}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {currentStep === "search" && (
        <div className="search-step">
          <div className="w-[346px] h-[400px] rounded-[10px] flex flex-col p-[20px] bg-white overflow-hidden">
            <div className="flex items-center justify-between w-full py-4">
              <h2 className="text-[14px] font-semibold text-[#818181]">
                SEARCH YOUR <span className="text-[#B10819]">CAR</span>
              </h2>
              <button
                onClick={handleClose}
                className="text-black hover:text-[#B10819] transition-colors"
              >
                <span className="text-2xl">
                  <X />
                </span>
              </button>
            </div>

            <div className="flex-1 flex flex-col font-[Montserrat] font-medium">
              {userLocation && (
                <div className="flex items-center text-[13px] text-[#818181] mb-4">
                  <MapPin size={16} className="mr-1 text-[#B10819]" />
                  <span className="text-[13px]">
                    {userLocation.city}, {userLocation.state}
                  </span>
                  <button
                    onClick={() => setCurrentStep("location")}
                    className="ml-auto text-[#B10819] text-[13px] underline"
                  >
                    Change
                  </button>
                </div>
              )}

              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search for a car..."
                  onChange={(e) => debouncedSearch(e.target.value)}
                  className="w-full h-[40px] border border-slate-300 px-4 text-black"
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 flex justify-center items-center">
                  <button className="bg-black text-white w-[38px] h-[38px] flex justify-center items-center">
                    <Search className="ml-3" size={20} />
                  </button>
                </div>
              </div>

              <div className="flex-1 flex flex-col">
                <div className="text-[13px] font-medium text-[#B1081A] mb-3 font-[Montserrat]">
                  Results
                </div>

                <div
                  className="flex-1 overflow-y-auto"
                  style={{ maxHeight: "250px" }}
                >
                  {loading ? (
                    <Skeleton count={3} height={50} />
                  ) : searchResults.length > 0 ? (
                    <div className="space-y-2 pr-2">
                      {" "}
                      {/* Added pr-2 for padding */}
                      {searchResults.map((result) => (
                        <div
                          key={result._id}
                          onClick={() => handleProductSelect(result)}
                          className="py-3 px-4 cursor-pointer hover:bg-gray-100 border-b border-gray-200 text-black w-full"
                        >
                          <div className="flex items-start w-full">
                            <div className="flex-grow w-full overflow-hidden">
                              <h4 className="font-medium truncate">
                                {result.brand?.name || "Unknown Brand"}{" "}
                                {result.carname}
                              </h4>
                              <p className="text-[13px] text-[#818181] truncate">
                                {parseList(result.seater)} seater | Fuel:{" "}
                                {parseList(result.fueltype)} | Safety:{" "}
                                {result.NCAP}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="flex-1 flex items-center justify-center h-full">
                      <p className="text-gray-500 text-center">
                        Start typing to search for cars
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {currentStep === "variant" && (
        <div className="variant-step">
          <div className="bg-white rounded-[10px]  w-[346px] h-[400px] shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-[14px] font-semibold text-[#818181]">
                SELECT YOUR <span className="text-[#B10819]">VARIANT</span>
              </h2>
              <button
                onClick={handleClose}
                className="text-black hover:text-[#B10819] transition-colors"
              >
                <span className="text-2xl">
                  <X />
                </span>
              </button>
            </div>

            <div className="flex-1 flex flex-col p-4 overflow-hidden font-[Montserrat] font-medium">
              {/* Variant Search Input */}
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search variants..."
                  onChange={handleVariantSearch}
                  className="w-full h-[40px] border border-slate-300 px-4 text-black"
                />
                <div className="absolute inset-y-0 right-0 flex justify-center items-center">
                  <button className="bg-black text-white w-[38px] h-[38px] flex justify-center items-center">
                    <Search className="ml-3" size={20} />
                  </button>
                </div>
              </div>

              {loading && selectedVariant.length === 0 ? (
                <div className="mt-3">
                  <Skeleton height={50} count={5} />
                </div>
              ) : selectedVariant.length > 0 ? (
                <div className="flex-1 flex flex-col overflow-hidden">
                  <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                    {selectedProduct && (
                      <div className="flex justify-center items-center space-x-3 text-[#818181]">
                        <span className=" border rounded-3xl px-4 py-2 ">
                          {selectedProduct.brand?.name || "Unknown Brand"}
                        </span>
                        <span className="border rounded-3xl px-4 py-2 ">
                          {selectedProduct.carname}
                        </span>
                      </div>
                    )}
                    {selectedVariant
                      .map((variant) => variant.fuel)
                      .filter(
                        (value, index, self) => self.indexOf(value) === index
                      )
                      .map((fuelType) => (
                        <div
                          key={fuelType}
                          className="flex justify-center items-center space-x-3"
                        >
                          {" "}
                          <span
                            className={` border rounded-3xl px-4 py-2 text-[#818181] ${
                              selectedFuelType === fuelType ? "" : ""
                            }`}
                            onClick={() => setSelectedFuelType(fuelType)}
                          >
                            {fuelType}
                          </span>
                        </div>
                      ))}
                  </div>

                  <div className="flex-1 overflow-y-auto">
                    {filteredVariants
                      .filter((variant) =>
                        selectedFuelType
                          ? variant.fuel === selectedFuelType
                          : true
                      )
                      .map((variant) => (
                        <div key={variant._id} className="mb-3">
                          <div
                            onClick={() => handleVariantSelect(variant)}
                            className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                          >
                            <div className="flex flex-col">
                              <p className="text-[14px] text-[#B1081A] font-[Montserrat]">
                                {variant.varientName}
                              </p>
                              <p className=" text-[14px] text-[#818181] font-[Montserrat]">
                                {variant.fuel} {"  "}
                                {variant.transmission}
                              </p>
                            </div>
                            <span className="text-black text-[14px] font-semibold font-[Montserrat]">
                              {formatPriceToLakhs(variant.exShowroomPrice)}
                            </span>
                          </div>
                          <div className="the-deviderbt-neftt w-full mb-2 border-b border-gray-200"></div>
                        </div>
                      ))}
                  </div>
                </div>
              ) : (
                <div className="flex-1 flex items-center justify-center">
                  <p className="text-gray-500 flex items-center justify-center">
                    <svg
                      className="animate-spin h-5 w-5 text-gray-500 mr-2"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      />
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8v4a4 4 0 00-4 4H4z"
                      />
                    </svg>
                    Loading variants...
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CombinedComponents;
