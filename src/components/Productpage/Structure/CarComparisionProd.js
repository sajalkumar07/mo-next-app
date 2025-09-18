import React, { useState, useEffect, forwardRef, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Tyre from "../../../Images/tyremask.png";
import { ChevronRight, ChevronLeft } from "lucide-react";

const CarComparisonSection = () => {
  const { id } = useParams();
  const [comparisonData, setComparisonData] = useState([]);
  const [rtoData, setRtoData] = useState([]);
  const [carData, setCarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [alternatives, setAlternatives] = useState([]);
  const [mainCarData, setMainCarData] = useState(null);
  const scrollContainerRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  // ===== EXACT SAME PRICING LOGIC FROM PRODUCT SECTION =====

  const getDataFromRoadPriceListBasedOnFuelAndPriceRange = (
    priceList,
    productPrice,
    fuelType
  ) => {
    const price = parseFloat(productPrice) || 0;
    const fuel = (fuelType || "").toUpperCase();

    return (
      priceList.find(
        (rto) =>
          price >= parseFloat(rto.startPrice || 0) &&
          (rto.endPrice === "ABOVE"
            ? true
            : price <= parseFloat(rto.endPrice || Infinity)) &&
          (rto.fuelType || "").toUpperCase() === fuel.toUpperCase()
      ) || {}
    );
  };

  const calculateRtoPrice = (productPrice, rtoPercentage, amount, fuelType) => {
    const price = parseInt(productPrice);
    let rto = Math.ceil((parseFloat(rtoPercentage) * price) / 100);

    if (fuelType.toLowerCase() === "electric" || rtoPercentage === "0") {
      rto += parseInt(amount || "0");
    }

    return rto;
  };

  const calculateRoadSafetyTax = (rto) => Math.ceil((rto * 2) / 100);

  const calculateInsurancePrice = (productPrice, insurancePercentage) => {
    return Math.ceil(
      (parseInt(productPrice) * parseFloat(insurancePercentage)) / 100
    );
  };

  const normalizeFuelType = (fuelType) => {
    if (!fuelType) return "";
    const normalizedFuel = fuelType.toLowerCase();
    if (normalizedFuel.includes("hybrid")) {
      return "petrol";
    }
    return normalizedFuel;
  };

  // Main on-road price calculation - EXACT SAME AS PRODUCT SECTION
  const calculateOnRoadPrice = (product, fuelType) => {
    let priceValue;
    if (typeof product === "object") {
      priceValue =
        product.exShowroomPrice || product.lowestExShowroomPrice || 0;
    } else {
      priceValue = product;
    }

    const priceStr = priceValue.toString();

    if (!/[0-9]/.test(priceStr)) return 0;
    if (!Array.isArray(rtoData) || rtoData.length === 0)
      return parseFloat(priceValue) || 0;

    const normalizedFuelType = normalizeFuelType(fuelType);

    const roadPriceData = getDataFromRoadPriceListBasedOnFuelAndPriceRange(
      rtoData,
      priceStr,
      normalizedFuelType
    );

    const basePrice = parseInt(priceStr) || 0;

    const components = {
      basePrice,
      rto: calculateRtoPrice(
        priceStr,
        roadPriceData.rtoPercentage || "0",
        roadPriceData.amount || "0",
        normalizedFuelType
      ),
      roadSafetyTax: 0,
      insurance: calculateInsurancePrice(
        priceStr,
        roadPriceData.insurancePercentage || "0"
      ),
      luxuryTax: basePrice > 999999 ? Math.ceil(basePrice / 100) : 0,
      hypethecationCharges: parseInt(roadPriceData.hypethecationCharges || "0"),
      fastag: parseInt(roadPriceData.fastag || "0"),
      others: parseInt(roadPriceData.others || "0"),
    };

    components.roadSafetyTax = calculateRoadSafetyTax(components.rto);

    return Object.values(components).reduce((sum, val) => sum + val, 0);
  };

  // New function to calculate maximum on-road price for highest price - EXACT SAME AS PRODUCT SECTION
  const calculateMaxOnRoadPrice = (highestPrice, carMainData) => {
    if (!highestPrice || !Array.isArray(rtoData) || rtoData.length === 0) {
      return parseFloat(highestPrice) || 0;
    }

    // Get all fuel types from car data
    const carFuelTypes = getCarFuelTypes(carMainData);

    if (carFuelTypes.length === 0) {
      return parseFloat(highestPrice) || 0;
    }

    let maxOnRoadPrice = 0;

    // Calculate on-road price for each fuel type and find the maximum
    carFuelTypes.forEach((fuelType) => {
      const onRoadPrice = calculateOnRoadPrice(highestPrice, fuelType);
      if (onRoadPrice > maxOnRoadPrice) {
        maxOnRoadPrice = onRoadPrice;
      }
    });

    return maxOnRoadPrice;
  };

  // Helper function to get all fuel types from car data - EXACT SAME AS PRODUCT SECTION
  const getCarFuelTypes = (carMainData) => {
    if (!carMainData || !carMainData.fueltype) return [];

    // Parse the fuel types from the car data
    let fuelTypes = [];

    if (Array.isArray(carMainData.fueltype)) {
      fuelTypes = carMainData.fueltype;
    } else if (typeof carMainData.fueltype === "string") {
      // Handle different string formats
      const parser = new DOMParser();
      const doc = parser.parseFromString(carMainData.fueltype, "text/html");
      const items = doc.querySelectorAll("ul li, p");

      if (items.length > 0) {
        fuelTypes = Array.from(items).map((item) => item.textContent.trim());
      } else {
        // Handle simple string with separators
        fuelTypes = carMainData.fueltype
          .split(/[|,]/)
          .map((type) => type.trim())
          .filter((type) => type);
      }
    }

    // Clean and normalize fuel types
    return fuelTypes.filter((type) => type && type.length > 0);
  };

  const getFirstFuelType = (carMainData) => {
    if (!carMainData) return "";
    const fuelTypes = getCarFuelTypes(carMainData);
    return fuelTypes.length > 0 ? fuelTypes[0] : "";
  };

  // Format currency with Lakhs/Crore suffixes - EXACT SAME AS PRODUCT SECTION
  const formatCurrency = (value) => {
    if (!value) return "0"; // Handle undefined/null cases

    const numValue =
      typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

    if (numValue >= 1e7) {
      // 1 crore or more
      const croreValue = (numValue / 1e7).toFixed(2);
      return `${croreValue} Crore`;
    } else if (numValue >= 1e5) {
      // 1 lakh or more
      const lakhValue = (numValue / 1e5).toFixed(2);
      return `${lakhValue} Lakhs`;
    } else {
      return new Intl.NumberFormat("en-IN").format(numValue);
    }
  };

  // Parse HTML/array/string into consistent format - EXACT SAME AS PRODUCT SECTION
  const parseList = (input) => {
    if (Array.isArray(input)) {
      return input.join(" | ");
    }
    if (typeof input === "number") {
      return input.toString();
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");
    const items = doc.querySelectorAll("ul li, p");
    const extractedText = Array.from(items).map((item) =>
      item.textContent.trim()
    );
    return extractedText.length > 1
      ? extractedText.join(" | ") + " |"
      : extractedText.join("");
  };

  // Fetch RTO data - EXACT SAME AS PRODUCT SECTION
  const fetchRTOData = async () => {
    const locationState = localStorage.getItem("location");
    const parsedLocationState = JSON.parse(locationState);

    if (!parsedLocationState || !parsedLocationState.state) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/v1/onroad-procing-for-website-landingpage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: parsedLocationState.state }),
        }
      );
      const result = await response.json();
      setRtoData(result.data);
    } catch (error) {
      console.error("Error fetching RTO data:", error);
    }
  };

  // Fetch car data from /api/cars endpoint
  const fetchCarData = async (carId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/cars/${carId}`
      );
      return await response.json();
    } catch (error) {
      console.error(`Error fetching car data for ${carId}:`, error);
      return null;
    }
  };

  // Get proper image source with fallback
  const getImageSource = (car, isMainCar = false) => {
    const baseUrl = `${process.env.NEXT_PUBLIC_API}/productImages/`;

    if (isMainCar) {
      // For main car, try blackimage first, then heroimage
      const imageName = car.blackimage || car.heroimage;
      return imageName ? `${baseUrl}${imageName}` : null;
    } else {
      // For alternative cars, use heroimage
      const imageName = car.heroimage;
      return imageName ? `${baseUrl}${imageName}` : null;
    }
  };

  // Fetch main car and its alternatives
  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);

      try {
        // First, try to fetch variant data (for variant-based comparison)
        let mainCar = null;
        let carId = null;

        try {
          const variantResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${id}`
          );
          const variantData = await variantResponse.json();

          if (variantData.data && variantData.data.product_id) {
            mainCar = {
              ...variantData.data.product_id,
              exShowroomPrice: variantData.data.exShowroomPrice,
              highExShowroomPrice: variantData.data.exShowroomPrice, // For variants, use same price
              brand: variantData.data.brand_id
                ? {
                    id: variantData.data.brand_id._id,
                    name: variantData.data.brand_id.name,
                  }
                : { name: "Unknown Brand" },
              fuelType: getFirstFuelType(variantData.data.fuel || "PETROL"),
              variantName: variantData.data.varientName,
              isVariant: true,
            };
            carId = variantData.data.product_id._id;
          }
        } catch (variantError) {
          console.log("Variant fetch failed, trying car fetch:", variantError);
        }

        // If variant fetch failed, try to fetch car data directly
        if (!mainCar) {
          try {
            const carResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API}/api/cars/${id}`
            );
            const carData = await carResponse.json();

            if (carData) {
              mainCar = {
                ...carData,
                brand: carData.brand || {
                  name: carData.carname?.split(" ")[0] || "Unknown",
                },
                fuelType: getFirstFuelType(carData.fueltype || "PETROL"),
                isVariant: false,
              };
              carId = id;
            }
          } catch (carError) {
            throw new Error("Failed to fetch car data");
          }
        }

        if (!mainCar || !carId) {
          throw new Error("Car data not found");
        }

        setMainCarData(mainCar);

        // Fetch alternatives
        const alternativesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/alternate-cars-for-web`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ carId }),
          }
        );
        const alternativesData = await alternativesResponse.json();

        const alternativesList = alternativesData.data || [];
        setAlternatives(alternativesList);

        // Create comparison pairs (main car vs each alternative)
        const pairs = await Promise.all(
          alternativesList.map(async (alt) => {
            // Fetch full details for the alternative car
            const altDetails = await fetchCarData(alt._id);

            // Store the car data
            setCarData((prev) => ({
              ...prev,
              [alt._id]: altDetails,
            }));

            return {
              car1: {
                id: mainCar._id || id,
                carname: mainCar.carname,
                exShowroomPrice:
                  mainCar.exShowroomPrice || mainCar.lowestExShowroomPrice,
                highExShowroomPrice:
                  mainCar.highExShowroomPrice ||
                  mainCar.highestExShowroomPrice ||
                  mainCar.exShowroomPrice,
                blackimage: mainCar.blackimage,
                heroimage: mainCar.heroimage,
                brand: mainCar.brand,
                fuelType: mainCar.fuelType,
                isMainCar: true,
              },
              car2: {
                id: alt._id,
                carname: alt.carname,
                exShowroomPrice:
                  alt.lowestExShowroomPrice || alt.exShowroomPrice,
                highExShowroomPrice:
                  altDetails?.highestExShowroomPrice || // Use the highest price from the full details
                  alt.highestExShowroomPrice ||
                  alt.lowestExShowroomPrice ||
                  alt.exShowroomPrice,
                heroimage: alt.heroimage,
                brand: alt.brand,
                fuelType: getFirstFuelType(alt.fueltype || "PETROL"),
                isMainCar: false,
              },
            };
          })
        );

        setComparisonData(pairs);
      } catch (error) {
        console.error("Error fetching comparison data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    fetchRTOData();
  }, []);

  // Get price display for a car - FIXED THE ISSUE HERE
  const getPriceDisplay = (car) => {
    if (!car || loading) return <Skeleton width={100} />;

    // Try multiple ways to get car data
    const carMainData = carData[car.id] || carData[car._id] || car;

    if (!carMainData) {
      console.log("No car data found for:", car.id || car._id);
      return "Price not available";
    }

    // Use the exact same logic as ProductSection
    const lowestPrice =
      carMainData.lowestExShowroomPrice ||
      carMainData.exShowroomPrice ||
      car.exShowroomPrice ||
      0;

    const highestPrice =
      carMainData.highestExShowroomPrice ||
      carMainData.highExShowroomPrice ||
      car.highExShowroomPrice ||
      lowestPrice;

    // Get the first fuel type
    const fuelType = getFirstFuelType(
      carMainData.fueltype || carMainData.fuel || car.fuelType || "PETROL"
    );

    const lowestOnRoadPrice = calculateOnRoadPrice(lowestPrice, fuelType);
    const highestOnRoadPrice = calculateMaxOnRoadPrice(
      highestPrice,
      carMainData
    );

    // If both prices are the same, show only one
    if (lowestOnRoadPrice === highestOnRoadPrice) {
      return `₹ ${formatCurrency(lowestOnRoadPrice)}`;
    }

    return (
      <>
        ₹ {formatCurrency(lowestOnRoadPrice)} -{" "}
        {formatCurrency(highestOnRoadPrice)}
      </>
    );
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
    }
  };

  const handleNext = () => {
    if (currentIndex < alternatives.length - 1) {
      setCurrentIndex(currentIndex + 1);
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = window.innerWidth <= 768 ? 340 : 344;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== currentIndex && newIndex < alternatives.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = window.innerWidth <= 768 ? 340 : 344;
      const scrollPosition = index * cardWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setLoading(true);

      try {
        let mainCar = null;
        let carId = null;

        // Try variant fetch first
        try {
          const variantResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${id}`
          );
          const variantData = await variantResponse.json();

          if (variantData.data && variantData.data.product_id) {
            mainCar = {
              ...variantData.data.product_id,
              exShowroomPrice: variantData.data.exShowroomPrice,
              highExShowroomPrice: variantData.data.exShowroomPrice,
              brand: variantData.data.brand_id
                ? {
                    id: variantData.data.brand_id._id,
                    name: variantData.data.brand_id.name,
                  }
                : { name: "Unknown Brand" },
              fuelType: getFirstFuelType(variantData.data.fuel || "PETROL"),
              variantName: variantData.data.varientName,
              isVariant: true,
            };
            carId = variantData.data.product_id._id;
          }
        } catch (variantError) {
          console.log("Variant fetch failed, trying car fetch:", variantError);
        }

        // If variant fetch failed, try car fetch
        if (!mainCar) {
          try {
            const carResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API}/api/cars/${id}`
            );
            const carData = await carResponse.json();

            if (carData) {
              mainCar = {
                ...carData,
                brand: carData.brand || {
                  name: carData.carname?.split(" ")[0] || "Unknown",
                },
                fuelType: getFirstFuelType(carData.fueltype || "PETROL"),
                isVariant: false,
              };
              carId = id;
            }
          } catch (carError) {
            throw new Error("Failed to fetch car data");
          }
        }

        if (!mainCar || !carId) {
          throw new Error("Car data not found");
        }

        setMainCarData(mainCar);

        setCarData((prev) => ({
          ...prev,
          [mainCar._id || id]: mainCar,
        }));

        // Fetch alternatives
        const alternativesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/alternate-cars-for-web`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ carId }),
          }
        );
        const alternativesData = await alternativesResponse.json();

        const alternativesList = alternativesData.data || [];
        setAlternatives(alternativesList);

        // Create comparison pairs
        const pairs = await Promise.all(
          alternativesList.map(async (alt) => {
            const altDetails = await fetchCarData(alt._id);

            if (altDetails) {
              setCarData((prev) => ({
                ...prev,
                [alt._id]: altDetails,
              }));
            }

            return {
              car1: {
                id: mainCar._id || id,
                carname: mainCar.carname,
                exShowroomPrice:
                  mainCar.exShowroomPrice || mainCar.lowestExShowroomPrice,
                highExShowroomPrice:
                  mainCar.highExShowroomPrice ||
                  mainCar.highestExShowroomPrice ||
                  mainCar.exShowroomPrice,
                blackimage: mainCar.blackimage,
                heroimage: mainCar.heroimage,
                brand: mainCar.brand,
                fuelType: mainCar.fuelType,
                isMainCar: true,
              },
              car2: {
                id: alt._id,
                carname: alt.carname,
                exShowroomPrice:
                  alt.lowestExShowroomPrice || alt.exShowroomPrice,
                highExShowroomPrice:
                  altDetails?.highestExShowroomPrice ||
                  alt.highestExShowroomPrice ||
                  alt.lowestExShowroomPrice ||
                  alt.exShowroomPrice,
                heroimage: alt.heroimage,
                brand: alt.brand,
                fuelType: getFirstFuelType(alt.fueltype || "PETROL"),
                isMainCar: false,
              },
            };
          })
        );

        setComparisonData(pairs);
      } catch (error) {
        console.error("Error fetching comparison data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  return (
    <div className="">
      {/* Low opacity background image only */}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${Tyre})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.08,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />

      {/* Content container - fully opaque */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 py-4">
        {/* Section Title */}
        <div className="text-center mb-4">
          <h2 className="text-[25px] font-bold font-sans">
            <span className="text-[#818181]">ALTERNATE</span>{" "}
            <span className="text-[#AB373A]">COMPARISON</span>
          </h2>
        </div>

        {/* Navigation buttons */}
        <button
          className="hidden md:flex absolute -left-10 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
          onClick={handlePrevious}
          disabled={currentIndex === 0 || alternatives.length <= 1}
        >
          <ChevronLeft />
        </button>

        <div className="relative flex justify-center items-center">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory gap-4 md:gap-6 px-2 md:px-8 py-4"
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
            onScroll={handleScroll}
          >
            {loading
              ? Array(4)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="flex-shrink-0 w-[340px] md:w-[344px] snap-start"
                    >
                      <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden">
                        <div className="bg-gray-100 p-4">
                          <div className="flex justify-between">
                            <Skeleton width={80} height={24} />
                            <Skeleton circle={true} width={24} height={24} />
                          </div>
                          <div className="flex justify-center items-center h-32">
                            <Skeleton width={120} height={80} />
                            <div className="mx-4">
                              <Skeleton width={40} height={40} />
                            </div>
                            <Skeleton width={120} height={80} />
                          </div>
                        </div>
                        <div className="p-4">
                          <Skeleton width={200} height={20} />
                          <Skeleton width={180} height={16} className="my-2" />
                          <Skeleton width={150} height={16} />
                        </div>
                      </div>
                    </div>
                  ))
              : comparisonData.map((comparison, index) => (
                  <Link
                    key={index}
                    to={`/Car-Compero/${comparison.car1?.id}/${comparison.car2?.id}`}
                    className="flex-shrink-0 w-[340px] md:w-[320px] snap-start"
                  >
                    <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                      <div className="bg-gray-100">
                        {/* Car Images */}
                        <div className="px-6 py-4 flex justify-between items-center">
                          {/* Car 1 */}
                          <div className="flex flex-col items-center">
                            <img
                              src={getImageSource(comparison.car1, true)}
                              alt={comparison.car1?.carname || "Car1"}
                              className="h-40 object-contain"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                console.error(
                                  "Main car image failed to load:",
                                  e.target.src
                                );
                                // Try alternative image source
                                if (
                                  comparison.car1.heroimage &&
                                  !e.target.src.includes(
                                    comparison.car1.heroimage
                                  )
                                ) {
                                  e.target.src = `${process.env.NEXT_PUBLIC_API}/productImages/${comparison.car1.heroimage}`;
                                }
                              }}
                            />
                          </div>

                          {/* VS Badge */}
                          <p className="text-lg bg-black text-white rounded-full p-2 h-8 w-8 flex justify-center items-center text-center">
                            VS
                          </p>

                          {/* Car 2 */}
                          <div className="flex flex-col items-center">
                            <img
                              src={getImageSource(comparison.car2, false)}
                              alt={comparison.car2?.carname || "Car2"}
                              className="h-40 object-contain"
                              crossOrigin="anonymous"
                              onError={(e) => {
                                console.error(
                                  "Alternative car image failed to load:",
                                  e.target.src
                                );
                              }}
                            />
                          </div>
                        </div>
                      </div>

                      <div className="flex justify-center items-center flex-col h-[150px] px-4 py-3">
                        {/* Car Names - More compact */}
                        <div className="flex justify-between items-center w-full mb-3">
                          <div className="text-center flex-1">
                            <div className="text-sm font-semibold text-black leading-tight">
                              {comparison.car1?.brand?.name || "N/A"}
                            </div>
                            <div className="text-sm font-medium text-gray-700 leading-tight">
                              {comparison.car1?.carname || "N/A"}
                            </div>
                          </div>

                          <div className="px-3">
                            <div className="text-xs text-gray-400 font-medium">
                              vs
                            </div>
                          </div>

                          <div className="text-center flex-1">
                            <div className="text-sm font-semibold text-black leading-tight">
                              {comparison.car2?.brand?.name || "N/A"}
                            </div>
                            <div className="text-sm font-medium text-gray-700 leading-tight">
                              {comparison.car2?.carname || "N/A"}
                            </div>
                          </div>
                        </div>

                        {/* Prices - Better spacing */}
                        <div className="flex justify-center items-center w-full mb-3">
                          <div className="text-center flex-1">
                            <div className="text-sm font-bold text-[#AB373A]">
                              {getPriceDisplay(comparison.car1)}
                            </div>
                          </div>
                          <span> - </span>
                          <div className="text-center flex-1">
                            <div className="text-sm font-bold text-[#AB373A]">
                              {getPriceDisplay(comparison.car2)}
                            </div>
                          </div>
                        </div>

                        {/* Call to action */}
                        <div className="mt-auto">
                          <div className="text-xs  border border-gray-300 text-gray-700 hover:bg-[#AB373A] hover:text-white font-medium  px-3 py-1 rounded-full transition-colors">
                            Compare Now
                          </div>
                        </div>
                      </div>
                    </div>
                  </Link>
                ))}
          </div>
        </div>

        <button
          className="hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
          onClick={handleNext}
          disabled={
            currentIndex === alternatives.length - 1 || alternatives.length <= 1
          }
        >
          <ChevronRight />
        </button>
      </div>
    </div>
  );
};

const CarComparison = forwardRef((props, ref) => {
  return (
    <section className="relative w-full  overflow-hidden px-3 " ref={ref}>
      <CarComparisonSection />
    </section>
  );
});

export default CarComparison;
