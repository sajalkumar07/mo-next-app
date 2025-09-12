import React, { useState, useEffect, forwardRef, useRef } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Tyre from "../../../Images/tyremask.png"; // Import the tire mask image

const CarComparisonData = [
  { id1: "66bb403828768e97140aae5c", id2: "67442223167c95b8aab2a3b3" },
  { id1: "66bb327f28768e97140a08d0", id2: "66bb372728768e97140a459f" },
  { id1: "66bb327f28768e97140a0905", id2: "66bb403828768e97140aae4b" },
];

const CarComparisonSection = () => {
  const [videos, setVideos] = useState([]);
  const CarComparisonWidth = 290;
  const CarComparisonCount = CarComparisonData.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comparisonData, setComparisonData] = useState([]);
  const [rtoData, setRtoData] = useState([]);
  const [carData, setCarData] = useState({});
  const [loading, setLoading] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const scrollContainerRef = useRef(null);
  const cardsContainerRef = useRef(null);

  // Check if mobile on mount and resize
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768);
    };

    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  const videosPerView = 4; // Adjust based on your design
  const videoWidth = 265 + 32; // video width + gap

  const handleNext = () => {
    const maxIndex = Math.max(0, CarComparisonCount - 3); // Show 3 cards at once on desktop

    if (currentIndex < maxIndex) {
      const newIndex = Math.min(currentIndex + 1, maxIndex);
      setCurrentIndex(newIndex);

      if (isMobile) {
        // For mobile, use scroll behavior
        if (scrollContainerRef.current) {
          const cardWidth = 306; // Card width + gap for mobile
          scrollContainerRef.current.scrollTo({
            left: newIndex * cardWidth,
            behavior: "smooth",
          });
        }
      }
      // For desktop, CSS transform will handle the animation
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = Math.max(currentIndex - 1, 0);
      setCurrentIndex(newIndex);

      if (isMobile) {
        // For mobile, use scroll behavior
        if (scrollContainerRef.current) {
          const cardWidth = 306; // Card width + gap for mobile
          scrollContainerRef.current.scrollTo({
            left: newIndex * cardWidth,
            behavior: "smooth",
          });
        }
      }
      // For desktop, CSS transform will handle the animation
    }
  };

  // Calculate transform for desktop
  const getContainerTransform = () => {
    if (isMobile) return "translateX(0)"; // No transform on mobile
    const cardWidth = 322; // Actual card width + gap (290 + 32)
    return `translateX(-${currentIndex * cardWidth}px)`;
  };

  const containerStyle = {
    transform: getContainerTransform(),
    transition: isMobile ? "none" : "transform 0.3s ease",
  };

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
      return `${lakhValue} `;
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

  // Fetch data for car comparison pairs
  useEffect(() => {
    const fetchComparisonData = async () => {
      setLoading(true);
      try {
        const fetchedData = await Promise.all(
          CarComparisonData.map(async ({ id1, id2 }) => {
            const [car1Response, car2Response] = await Promise.all([
              fetch(
                `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${id1}`
              ),
              fetch(
                `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${id2}`
              ),
            ]);

            const car1 = await car1Response.json();
            const car2 = await car2Response.json();

            // Fetch additional car data for both cars
            const car1Id = car1.data?.product_id?._id;
            const car2Id = car2.data?.product_id?._id;

            const [car1Data, car2Data] = await Promise.all([
              car1Id ? fetchCarData(car1Id) : Promise.resolve(null),
              car2Id ? fetchCarData(car2Id) : Promise.resolve(null),
            ]);

            // Store the car data
            if (car1Data) {
              setCarData((prev) => ({
                ...prev,
                [car1.data._id]: car1Data,
              }));
            }

            if (car2Data) {
              setCarData((prev) => ({
                ...prev,
                [car2.data._id]: car2Data,
              }));
            }

            return {
              car1: car1.data,
              car2: car2.data,
            };
          })
        );
        setComparisonData(fetchedData);
      } catch (error) {
        console.error("Error fetching comparison data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchComparisonData();
    fetchRTOData();
  }, []);

  // Get proper image source with fallback
  const getImageSource = (car) => {
    if (!car?.product_id?.heroimage) return null;
    return `${process.env.NEXT_PUBLIC_API}/productImages/${car.product_id.heroimage}`;
  };

  // Get price display for a car - UPDATED TO USE EXACT SAME LOGIC AS PRODUCT SECTION
  const getPriceDisplay = (car) => {
    if (!car || loading) return <Skeleton width={100} />;

    const carMainData = carData[car._id];
    if (!carMainData) return "Price not available";

    // Use the exact same logic as ProductSection
    const lowestOnRoadPrice = calculateOnRoadPrice(
      carMainData.lowestExShowroomPrice || car.exShowroomPrice || 0,
      getFirstFuelType(carMainData)
    );

    const highestOnRoadPrice = calculateMaxOnRoadPrice(
      carMainData.highestExShowroomPrice || car.exShowroomPrice || 0,
      carMainData
    );

    // If both prices are the same, show only one
    if (lowestOnRoadPrice === highestOnRoadPrice) {
      return `₹ ${formatCurrency(lowestOnRoadPrice)}`;
    }

    return (
      <>
        ₹ {formatCurrency(lowestOnRoadPrice)} -{" "}
        {formatCurrency(highestOnRoadPrice)}Lakh
      </>
    );
  };

  // Check if buttons should be disabled
  const isPrevDisabled = currentIndex === 0;
  const isNextDisabled = currentIndex >= Math.max(0, CarComparisonCount - 3);

  return (
    <div className="relative w-full">
      <div className="label">
        <p className="block md:flex justify-center items-center text-[25px] font-bold ml-[20px] mb-2 mt-4">
          <span className="text-wrapper text-uppercase">POPULAR</span>
          <span className="span">&nbsp;</span>
          <span className="text-wrapper-2 text-uppercase">COMPARISON</span>
        </p>
      </div>

      {/* Tire mask background - same as Brands component */}
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

      {/* Main content with relative positioning and solid background for cards */}
      <section
        className="flex justify-center items-center"
        style={{ zIndex: 10 }}
      >
        <button
          className={`bg-[#818181] p-2 md:m-0 rounded-full text-white hidden md:flex justify-center items-center ${
            isPrevDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#666]"
          }`}
          onClick={handlePrevious}
          disabled={isPrevDisabled}
          style={{ backgroundColor: "#818181", zIndex: 20 }}
        >
          <ion-icon name="chevron-back-outline"></ion-icon>
        </button>

        <div
          ref={scrollContainerRef}
          className="d-flex align-items-center copm-cards overflow-x-scroll scrollbar-hide overflow-y-hidden p-8 md:min-w-auto w-auto"
          style={{
            maxWidth: isMobile ? "none" : "1000px", // Adjusted for better tablet support
          }}
        >
          <div
            ref={cardsContainerRef}
            className="flex justify-between items-center gap-4"
            style={containerStyle}
          >
            {loading
              ? Array(CarComparisonCount)
                  .fill(0)
                  .map((_, index) => (
                    <div
                      key={index}
                      className="d-flex comparo-card flex-shrink-0"
                      style={{
                        backgroundColor: "white",
                        borderRadius: "0",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        zIndex: 15,
                        width: "290px",
                      }}
                    >
                      <div className="comparison-item">
                        <Skeleton height={150} width={120} />
                        <div className="comp-description">
                          <Skeleton width={100} />
                          <Skeleton width={120} />
                          <Skeleton width={150} />
                        </div>
                      </div>
                      <div className="vs-container">
                        <span className="vs-item">VS</span>
                      </div>
                      <div className="comparison-item">
                        <Skeleton height={150} width={120} />
                        <div className="comp-description">
                          <Skeleton width={100} />
                          <Skeleton width={120} />
                          <Skeleton width={150} />
                        </div>
                      </div>
                    </div>
                  ))
              : comparisonData.map((comparison, index) => (
                  <Link
                    key={index}
                    className="d-flex comparo-card flex-shrink-0"
                    to={`/Car-Compero/${CarComparisonData[index].id1}/${CarComparisonData[index].id2}`}
                    style={{
                      backgroundColor: "white",
                      borderRadius: "0px",
                      boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                      zIndex: 15,
                      textDecoration: "none",
                      display: "flex",
                      padding: "16px",
                      width: "290px",
                    }}
                  >
                    {/* Car 1 */}
                    <div className="comparison-item">
                      {comparison.car1 ? (
                        <>
                          <img
                            src={getImageSource(comparison.car1)}
                            alt={comparison.car1?.product_id?.carname || "Car1"}
                            className="car-comp-img"
                            crossOrigin="anonymous"
                          />
                          <div className="comp-description">
                            <div className="comp-description-brand">
                              {comparison.car1?.brand_id?.name || "N/A"}
                            </div>
                            <div className="comp-description-model">
                              {comparison.car1?.product_id?.carname || "N/A"}
                            </div>
                            <p className="comp-description-price">
                              {getPriceDisplay(comparison.car1)}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="comp-description">
                          <p>Car 1 data not available</p>
                        </div>
                      )}
                    </div>

                    <div className="vs-container">
                      <span className="vs-item">VS</span>
                    </div>

                    {/* Car 2 */}
                    <div className="comparison-item">
                      {comparison.car2 ? (
                        <>
                          <img
                            src={getImageSource(comparison.car2)}
                            alt={comparison.car2?.product_id?.carname || "Car2"}
                            className="car-comp-img"
                            crossOrigin="anonymous"
                          />
                          <div className="comp-description">
                            <div className="comp-description-brand">
                              {comparison.car2?.brand_id?.name || "N/A"}
                            </div>
                            <div className="comp-description-model">
                              {comparison.car2?.product_id?.carname || "N/A"}
                            </div>
                            <p className="comp-description-price">
                              {getPriceDisplay(comparison.car2)}
                            </p>
                          </div>
                        </>
                      ) : (
                        <div className="comp-description">
                          <p>Car 2 data not available</p>
                        </div>
                      )}
                    </div>
                  </Link>
                ))}
          </div>
        </div>

        <button
          className={`bg-[#818181] p-2 md:m-0 rounded-full text-white hidden md:flex justify-center items-center ${
            isNextDisabled ? "opacity-50 cursor-not-allowed" : "hover:bg-[#666]"
          }`}
          onClick={handleNext}
          disabled={isNextDisabled}
          style={{ backgroundColor: "#818181", zIndex: 20 }}
        >
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
      </section>
    </div>
  );
};

const CarComparison = forwardRef((props, ref) => {
  return (
    <section className="mb-5" ref={ref}>
      <CarComparisonSection />
    </section>
  );
});

export default CarComparison;
