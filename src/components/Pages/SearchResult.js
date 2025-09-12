import { useState, useEffect } from "react";
import { useSearchParams, useNavigate, Link } from "react-router-dom";

export default function SearchResultsPage() {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [allCars, setAllCars] = useState([]);
  const [filteredCars, setFilteredCars] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [hasMorePages, setHasMorePages] = useState(true);
  const [parsedSearchParams, setParsedSearchParams] = useState({});

  const budgetRanges = {
    "under-5": { min: 0, max: 500000, label: "Under ₹5 Lakh" },
    "5-10": { min: 500000, max: 1000000, label: "₹5 - ₹10 Lakh" },
    "10-15": { min: 1000000, max: 1500000, label: "₹10 - ₹15 Lakh" },
    "15-25": { min: 1500000, max: 2500000, label: "₹15 - ₹25 Lakh" },
    "above-25": { min: 2500000, max: Infinity, label: "Above ₹25 Lakh" },
  };

  // Parse URL parameters
  useEffect(() => {
    const params = {
      carType: searchParams.get("carType") || "new",
      minPrice: searchParams.get("minPrice") || "",
      maxPrice: searchParams.get("maxPrice") || "",
      transmission: searchParams.get("transmission") || "",
      fuelType: searchParams.get("fuelType") || "",
      seatingCapacity: searchParams.get("seatingCapacity") || "",
      bootSpace: searchParams.get("bootSpace") || "",
      brand: searchParams.get("brand") || "",
      features: searchParams.get("features")
        ? searchParams.get("features").split(",")
        : [],
    };
    setParsedSearchParams(params);
    loadInitialData();
  }, [searchParams]);

  const loadInitialData = async () => {
    setLoading(true);
    try {
      // Load first 5 pages (50 cars) for comprehensive results
      const pagesToLoad = 5;
      let allLoadedCars = [];

      for (let page = 1; page <= pagesToLoad; page++) {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/allproducts/mo?page=${page}`
        );
        const data = await response.json();

        // Check if data.data exists and is an array
        if (data && Array.isArray(data.data) && data.data.length > 0) {
          const newCars = data.data;

          // Fetch variants for each car
          const carsWithVariants = await Promise.all(
            newCars.map(async (car) => {
              try {
                const variantResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API}/api/variants/active/${car._id}`
                );
                const variantData = await variantResponse.json();
                return {
                  ...car,
                  variants: variantData.data || [],
                };
              } catch (error) {
                console.error(`Error fetching variants for ${car._id}:`, error);
                return { ...car, variants: [] };
              }
            })
          );

          allLoadedCars = [...allLoadedCars, ...carsWithVariants];

          // If we got less than 10 cars, we've reached the end
          if (newCars.length < 10) {
            setHasMorePages(false);
            break;
          }
        } else {
          setHasMorePages(false);
          break;
        }
      }

      setAllCars(allLoadedCars);
      setCurrentPage(pagesToLoad);
    } catch (error) {
      console.error("Error loading cars:", error);
      setAllCars([]); // Ensure allCars is always an array
    } finally {
      setLoading(false);
    }
  };

  // Helper function to check if a car has any variants matching the criteria
  const carHasMatchingVariants = (car) => {
    if (!car.variants || car.variants.length === 0) {
      return false;
    }

    let matchingVariants = [...car.variants];

    // Filter by price range (check variants' exShowroomPrice)
    if (parsedSearchParams.minPrice && parsedSearchParams.maxPrice) {
      const minPrice = parseInt(parsedSearchParams.minPrice);
      const maxPrice = parseInt(parsedSearchParams.maxPrice);

      matchingVariants = matchingVariants.filter((variant) => {
        const price = parseInt(variant.exShowroomPrice) || 0;
        return price >= minPrice && price <= maxPrice;
      });
    }

    // Filter by transmission (check variants)
    if (parsedSearchParams.transmission) {
      matchingVariants = matchingVariants.filter(
        (variant) =>
          variant.transmission?.toLowerCase() ===
          parsedSearchParams.transmission.toLowerCase()
      );
    }

    // Filter by fuel type (check variants)
    if (parsedSearchParams.fuelType) {
      matchingVariants = matchingVariants.filter(
        (variant) =>
          variant.fuel?.toLowerCase() ===
          parsedSearchParams.fuelType.toLowerCase()
      );
    }

    // Filter by seating capacity (check variants)
    if (parsedSearchParams.seatingCapacity) {
      const requestedSeats = parsedSearchParams.seatingCapacity;
      matchingVariants = matchingVariants.filter((variant) => {
        const variantSeats = variant.seater?.toString();

        if (
          !variantSeats ||
          variantSeats.toLowerCase() === "null" ||
          variantSeats.toLowerCase() === "na"
        ) {
          return false;
        }

        const seats = parseInt(variantSeats);

        if (requestedSeats === "8+") {
          return seats >= 8;
        } else if (requestedSeats === "5") {
          return seats === 4 || seats === 5;
        } else {
          return seats === parseInt(requestedSeats);
        }
      });
    }

    // Filter by boot space (check variants)
    if (parsedSearchParams.bootSpace) {
      const requestedBootSpace = parseInt(parsedSearchParams.bootSpace);
      matchingVariants = matchingVariants.filter((variant) => {
        const bootSpace = variant.boot_Space?.toString();

        if (
          !bootSpace ||
          bootSpace.toLowerCase() === "null" ||
          bootSpace.toLowerCase() === "na"
        ) {
          return requestedBootSpace === 1; // Allow cars with no boot space data if requesting smallest
        }

        const bootValue = parseInt(bootSpace);
        const bootBags = Math.floor(bootValue / 120); // Convert to bag capacity
        return bootBags >= requestedBootSpace - 1;
      });
    }

    // Filter by features (check variants) - ALL features must be present
    if (parsedSearchParams.features && parsedSearchParams.features.length > 0) {
      matchingVariants = matchingVariants.filter((variant) => {
        return parsedSearchParams.features.every((feature) =>
          hasFeature(variant, feature)
        );
      });
    }

    return matchingVariants.length > 0;
  };

  const applyFilters = () => {
    // Ensure allCars is an array before filtering
    if (!Array.isArray(allCars) || allCars.length === 0) {
      setFilteredCars([]);
      return;
    }

    let filtered = [...allCars];

    // Filter by brand first (car-level filter)
    if (parsedSearchParams.brand) {
      filtered = filtered.filter((car) => {
        if (!car.brand) return false;

        // Handle case where brand is an object with name property
        if (typeof car.brand === "object" && car.brand.name) {
          return (
            car.brand.name.toLowerCase() ===
            parsedSearchParams.brand.toLowerCase()
          );
        }

        // Handle case where brand is a string
        if (typeof car.brand === "string") {
          return (
            car.brand.toLowerCase() === parsedSearchParams.brand.toLowerCase()
          );
        }

        return false;
      });
    }

    // Filter cars that have at least one variant matching all other criteria
    filtered = filtered.filter((car) => carHasMatchingVariants(car));

    setFilteredCars(filtered);
  };

  // Updated feature checking function to match Dart logic exactly
  const hasFeature = (variant, feature) => {
    const checkField = (fieldValue) => {
      return (
        fieldValue &&
        fieldValue.toString().trim() !== "" &&
        fieldValue.toString().toLowerCase() !== "null" &&
        fieldValue.toString().toLowerCase() !== "na"
      );
    };

    switch (feature) {
      case "Touch Screen":
        return checkField(variant.Touch_Screen_Infotainment);
      case "Reverse Parking Camera":
        return checkField(variant.Reverse_Camera);
      case "Cruise Control":
        return checkField(variant.Cruise_Control);
      case "Ventilated Seats":
        return checkField(variant.Ventilated_Seats);
      case "Sunroof":
        return checkField(variant.sunroof);
      case "ADAS":
        return checkField(variant.ADAS);
      case "Push Button Start Stop":
        return (
          checkField(variant.ignition) &&
          variant.ignition.toString().trim().toUpperCase() ===
            "PUSH BUTTON START STOP"
        );
      case "Ambient Lighting":
        return checkField(variant.Ambient_Lighting);
      case "Electric Seats Adjustment":
        return (
          checkField(variant.Seats_Adjustment) &&
          variant.Seats_Adjustment.toString().toLowerCase().includes("electric")
        );
      case "Wireless Charging":
        return checkField(variant.wireless_Charging);
      case "Android Auto & Apple Carplay":
        return checkField(variant.Android_Apple_Carplay);
      case "Auto Headlamps":
        return checkField(variant.automaticHeadLamp);
      case "TPMS":
        return checkField(variant.TMPS);
      case "Hill Start Assist":
        return checkField(variant.Hill_Hold_Assist);
      case "Air Conditioning":
        return checkField(variant.Air_Conditioning);
      case "Air Purifier":
        return checkField(variant.Air_Purifier);
      default:
        return false;
    }
  };

  // Apply filters when cars are loaded or search params change
  useEffect(() => {
    if (allCars.length > 0) {
      applyFilters();
    }
  }, [allCars, parsedSearchParams]);

  const loadMoreCars = async () => {
    if (!loading && hasMorePages) {
      setLoading(true);
      try {
        const nextPage = currentPage + 1;
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/allproducts/mo?page=${nextPage}`
        );
        const data = await response.json();

        if (data.data && Array.isArray(data.data) && data.data.length > 0) {
          const newCars = data.data;

          const carsWithVariants = await Promise.all(
            newCars.map(async (car) => {
              try {
                const variantResponse = await fetch(
                  `${process.env.NEXT_PUBLIC_API}/api/variants/active/${car._id}`
                );
                const variantData = await variantResponse.json();
                return {
                  ...car,
                  variants: variantData.data || [],
                };
              } catch (error) {
                console.error(`Error fetching variants for ${car._id}:`, error);
                return { ...car, variants: [] };
              }
            })
          );

          setAllCars((prev) => [...prev, ...carsWithVariants]);
          setCurrentPage(nextPage);

          if (newCars.length < 10) {
            setHasMorePages(false);
          }
        } else {
          setHasMorePages(false);
        }
      } catch (error) {
        console.error("Error loading more cars:", error);
      }
      setLoading(false);
    }
  };

  const goBackToSearch = () => {
    navigate(-1); // Go back to previous page
    // Alternatively, you can navigate to a specific route:
    // navigate('/search');
  };

  const getSearchCriteria = () => {
    let criteria = [];
    if (parsedSearchParams.searchBy === "budget" && parsedSearchParams.budget) {
      criteria.push(budgetRanges[parsedSearchParams.budget]?.label);
    }
    if (parsedSearchParams.searchBy === "brand" && parsedSearchParams.brand) {
      criteria.push(parsedSearchParams.brand);
    }
    if (parsedSearchParams.bodytype) {
      criteria.push(parsedSearchParams.bodytype);
    }
    return criteria.join(" • ");
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
          <div className="flex items-center justify-between">
            <div>
              <button
                onClick={goBackToSearch}
                className="flex items-center text-red-500 hover:text-red-600 mb-4 transition-colors"
              >
                <svg
                  className="w-5 h-5 mr-2"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M15 19l-7-7 7-7"
                  />
                </svg>
                Back to Search
              </button>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">
                Search Results
              </h1>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold text-red-500">
                {filteredCars.length}
              </div>
              <div className="text-sm text-gray-500">cars found</div>
            </div>
          </div>
        </div>

        {/* Loading State */}
        {loading && allCars.length === 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-500 mx-auto mb-4"></div>
            <p className="text-gray-600">Searching for cars...</p>
          </div>
        )}

        {/* Results Grid */}
        {!loading || allCars.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCars.map((car) => (
              <Link
                key={car._id}
                to={`/product/${car.carname.replace(/\s+/g, "-")}/${car._id}`}
                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 block"
              >
                {/* Car Image */}
                <div className="relative h-48 bg-gray-100 rounded-t-lg overflow-hidden">
                  {car.heroimage ? (
                    <img
                      src={`${process.env.NEXT_PUBLIC_API}/productImages/${car.heroimage}`}
                      alt={car.carname}
                      className="w-full h-full object-contain"
                      crossOrigin="anonymous"
                    />
                  ) : (
                    <div className="flex items-center justify-center h-full text-gray-400">
                      <svg
                        className="w-16 h-16"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
                      </svg>
                    </div>
                  )}

                  {/* NCAP Rating Badge */}
                  {car.NCAP && (
                    <div className="absolute top-3 right-3 bg-white bg-opacity-90 px-2 py-1 rounded-full text-xs font-semibold text-gray-700">
                      {car.NCAP}⭐ NCAP
                    </div>
                  )}
                </div>

                {/* Car Details */}
                <div className="p-6">
                  <div className="mb-4">
                    <h3 className="text-xl font-bold text-gray-900 mb-1">
                      {car.carname}
                    </h3>
                    <div className="flex items-center text-sm text-gray-500 space-x-2">
                      <span>{car.brand?.name || car.brand}</span>
                      <span>•</span>
                      <span>{car.bodytype}</span>
                      <span>•</span>
                      <span>{car.variants?.length || 0} variants</span>
                    </div>
                  </div>

                  {/* Price Range */}
                  <div className="mb-4">
                    <div className="text-2xl font-bold text-gray-900">
                      ₹
                      {(parseInt(car.lowestExShowroomPrice) / 100000).toFixed(
                        1
                      )}
                      L - ₹
                      {(parseInt(car.highestExShowroomPrice) / 100000).toFixed(
                        1
                      )}
                      L
                    </div>
                    <div className="text-sm text-gray-500">
                      Ex-showroom price
                    </div>
                  </div>

                  {/* Key Features */}
                  <div className="mb-4">
                    <div className="flex flex-wrap gap-2">
                      {car.fueltype && (
                        <span className="px-2 py-1 bg-blue-100 text-blue-800 text-xs rounded-full">
                          {car.fueltype
                            .replace(/<[^>]*>/g, "")
                            .replace(/\s+/g, " ")
                            .trim()}
                        </span>
                      )}
                      {car.transmissiontype && (
                        <span className="px-2 py-1 bg-green-100 text-green-800 text-xs rounded-full">
                          {car.transmissiontype
                            .replace(/<[^>]*>/g, "")
                            .replace(/\s+/g, " ")
                            .trim()}
                        </span>
                      )}
                      {car.seater && (
                        <span className="px-2 py-1 bg-purple-100 text-purple-800 text-xs rounded-full">
                          {car.seater.replace(/<[^>]*>/g, "")} Seater
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        ) : null}

        {/* No Results */}
        {!loading && filteredCars.length === 0 && allCars.length > 0 && (
          <div className="bg-white rounded-lg shadow-sm p-12 text-center">
            <svg
              className="w-16 h-16 text-gray-400 mx-auto mb-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9.172 16.172a4 4 0 015.656 0M9 12h6m-6-4h6m2 5.291A7.962 7.962 0 0112 15c-2.34 0-4.47-.881-6.08-2.33"
              />
            </svg>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No cars found
            </h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search criteria or exploring different options.
            </p>
            <button
              onClick={goBackToSearch}
              className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors"
            >
              Modify Search
            </button>
          </div>
        )}

        {/* Load More Button */}
        {hasMorePages && !loading && filteredCars.length > 0 && (
          <div className="mt-8 text-center">
            <button
              onClick={loadMoreCars}
              className="bg-gray-100 hover:bg-gray-200 text-gray-700 font-medium py-3 px-8 rounded-lg transition-colors"
            >
              Load More Cars
            </button>
          </div>
        )}

        {/* Loading More */}
        {loading && allCars.length > 0 && (
          <div className="mt-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500 mx-auto mb-2"></div>
            <p className="text-gray-600">Loading more cars...</p>
          </div>
        )}
      </div>
    </div>
  );
}
