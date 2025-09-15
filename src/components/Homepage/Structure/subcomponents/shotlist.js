import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Users,
  Fuel,
  Settings,
  Star,
} from "lucide-react";
import "./card.css";
import seater from "../../../../Images/icons/seat.png";
import petrol from "../../../../Images/icons/gas.png";
import manual from "../../../../Images/icons/machin.png";
import ncap from "../../../../Images/icons/privi.png";

const SavedCars = () => {
  const [savedCars, setSavedCars] = useState([]);
  const [rtoData, setRtoData] = useState([]);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    return savedBookmarks || [];
  });
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Fetch RTO data - same as Popcars
  const fetchRTOData = async () => {
    const locationState = localStorage.getItem("location");
    if (!locationState) return;

    try {
      const parsedLocationState = JSON.parse(locationState);
      if (!parsedLocationState || !parsedLocationState.state) {
        return;
      }

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
      if (result.data && Array.isArray(result.data)) {
        setRtoData(result.data);
      }
    } catch (error) {
      console.error("Error fetching RTO data:", error);
      setRtoData([]);
    }
  };

  useEffect(() => {
    fetchRTOData();
  }, []);

  const normalizeFuelType = (fuelType) => {
    if (!fuelType) return "";
    const normalizedFuel = fuelType.toLowerCase();
    // Treat hybrid as petrol for calculation purposes
    if (normalizedFuel.includes("hybrid")) {
      return "petrol";
    }
    return normalizedFuel;
  };

  // Helper Functions (same as Cards component)
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

    // Flat amount for EVs or when percentage is 0
    // Note: hybrid is now treated as petrol, so this condition won't apply to hybrid
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

  // Extract first fuel type from various formats
  const getFirstFuelType = (fuelData) => {
    if (Array.isArray(fuelData)) {
      return fuelData[0];
    }
    if (typeof fuelData === "string") {
      const match = fuelData.match(/<li>(.*?)<\/li>/i);
      if (match && match[1]) return match[1];
      return fuelData;
    }
    return "";
  };

  // Main on-road price calculation using mobile app logic (same as Popcars component)
  const calculateOnRoadPrice = (product, fuelType) => {
    // Extract price (handles both variant and direct car data)
    let productPrice;
    if (typeof product === "object") {
      productPrice =
        product.exShowroomPrice || // Variant price first
        product.lowestExShowroomPrice || // Fallback to car price
        0;
    } else {
      productPrice = product; // Direct number input
    }

    const priceStr = productPrice.toString();

    // Early exit for invalid prices
    if (!/[0-9]/.test(priceStr)) return 0;
    if (!Array.isArray(rtoData) || rtoData.length === 0)
      return parseFloat(productPrice) || 0;

    // Normalize fuel type (treat hybrid as petrol)
    const normalizedFuelType = normalizeFuelType(fuelType);

    // Get applicable RTO rates
    const roadPriceData = getDataFromRoadPriceListBasedOnFuelAndPriceRange(
      rtoData,
      priceStr,
      normalizedFuelType
    );

    const price = parseInt(priceStr) || 0;

    // --- Calculate Components ---
    // 1. RTO Tax
    const rto = calculateRtoPrice(
      priceStr,
      roadPriceData.rtoPercentage || "0",
      roadPriceData.amount || "0",
      normalizedFuelType
    );

    // 2. Road Safety Tax (2% of RTO)
    const roadSafetyTax = calculateRoadSafetyTax(rto);

    // 3. Insurance (percentage of vehicle price)
    const insurance = calculateInsurancePrice(
      priceStr,
      roadPriceData.insurancePercentage || "0"
    );

    // 4. Luxury Tax (1% for cars above ₹10L)
    const luxuryTax = price > 999999 ? Math.ceil(price / 100) : 0;

    // 5. Additional Charges
    const hypethecationCharges = parseInt(
      roadPriceData.hypethecationCharges || "0"
    );
    const fastag = parseInt(roadPriceData.fastag || "0");
    const others = parseInt(roadPriceData.others || "0");

    // --- Final Calculation ---
    return (
      price + // Base price
      rto + // RTO tax
      roadSafetyTax + // Safety tax
      insurance + // Insurance
      luxuryTax + // Luxury tax
      hypethecationCharges +
      fastag +
      others
    );
  };

  const fetchSavedCars = async () => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];
    const carsDetails = [];

    for (let id of bookmarks) {
      try {
        // Try both endpoints - first try variant endpoint
        let response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${id}`
        );
        let data = await response.json();

        // If variant data exists, use it
        if (data && data.data) {
          const firstFuelType = getFirstFuelType(data.data.fuel);
          const onRoadPrice = calculateOnRoadPrice(data.data, firstFuelType);

          // Normalize variant data to match regular car structure
          const normalizedVariantData = {
            _id: data.data._id,
            isVariant: true,
            carname: data.data.product_id?.carname || "",
            brand: data.data.brand_id?.name || data.data.brand_id || "",
            heroimage: data.data.product_id?.heroimage || data.data.heroimage,
            heroimagename:
              data.data.product_id?.heroimagename ||
              data.data.heroimagename ||
              "",
            movrating:
              data.data.product_id?.movrating || data.data.movrating || 0,
            exShowroomPrice: data.data.exShowroomPrice || 0,
            lowestExShowroomPrice: data.data.exShowroomPrice || 0,
            highestExShowroomPrice: data.data.exShowroomPrice || 0,
            seater: data.data.seater || "",
            fueltype: data.data.fuel || "",
            transmissiontype: data.data.transmission || "",
            NCAP: data.data.GNCAP || "NA",
            variants: 1, // Since this is a single variant
            onRoadPrice,
          };
          carsDetails.push(normalizedVariantData);
        } else {
          // If not a variant, try regular car endpoint
          response = await fetch(
            `${process.env.NEXT_PUBLIC_API}/api/cars/${id}`
          );
          data = await response.json();
          if (data && data._id) {
            // Fetch variants to get accurate pricing
            const variantResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API}/api/variants/active/${data._id}`
            );
            const variantData = await variantResponse.json();

            let lowestPrice = data.lowestExShowroomPrice || 0;
            let highestPrice = data.highestExShowroomPrice || 0;
            let onRoadPrice = 0;

            if (variantData.data?.length > 0) {
              // Use variant prices if available
              lowestPrice = Math.min(
                ...variantData.data.map((v) => v.exShowroomPrice)
              );
              highestPrice = Math.max(
                ...variantData.data.map((v) => v.exShowroomPrice)
              );
            }

            const firstFuelType = getFirstFuelType(data.fueltype);
            onRoadPrice = calculateOnRoadPrice(lowestPrice, firstFuelType);

            // Normalize regular car data to ensure consistent structure
            const normalizedCarData = {
              _id: data._id,
              isVariant: false,
              carname: data.carname || "",
              brand: data.brand?.name || data.brand || "",
              heroimage: data.heroimage,
              heroimagename: data.heroimagename || "",
              movrating: data.movrating || 0,
              exShowroomPrice: lowestPrice,
              lowestExShowroomPrice: lowestPrice,
              highestExShowroomPrice: highestPrice,
              seater: data.seater || "",
              fueltype: data.fueltype || "",
              transmissiontype: data.transmissiontype || "",
              NCAP: data.NCAP || "NA",
              variants: data.variants || 0,
              onRoadPrice,
            };
            carsDetails.push(normalizedCarData);
          }
        }
      } catch (error) {
        console.error("Error fetching car details:", error);
      }
    }

    setSavedCars(carsDetails);
  };

  useEffect(() => {
    if (rtoData.length > 0) {
      fetchSavedCars();
    }
  }, [rtoData]); // Re-run when RTO data is updated

  const formatCurrency = (value) => {
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "0";

    if (numValue >= 1e7) {
      return `${(numValue / 1e7).toFixed(2)}`;
    } else if (numValue >= 1e5) {
      return `${(numValue / 1e5).toFixed(2)}`;
    } else {
      return new Intl.NumberFormat("en-IN").format(numValue);
    }
  };

  const isBookmarked = (id) => bookmarkedIds.includes(id);

  const toggleBookmark = (id, event) => {
    if (event) {
      event.preventDefault();
      event.stopPropagation();
    }

    const updatedBookmarks = isBookmarked(id)
      ? bookmarkedIds.filter((bookmarkId) => bookmarkId !== id)
      : [...bookmarkedIds, id];

    setBookmarkedIds(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    // Refresh the saved cars after toggling bookmark
    fetchSavedCars();
  };

  const parseList = (htmlString) => {
    if (!htmlString) return "";
    if (Array.isArray(htmlString)) return htmlString.join(" | ");
    if (typeof htmlString === "number") return htmlString.toString();

    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const items = doc.querySelectorAll("ul li, p");
    return Array.from(items)
      .map((item) => item.textContent.trim())
      .join(" | ");
  };

  const getLocationFromLocalStorage = () => {
    const locationString = localStorage.getItem("location");
    return locationString ? JSON.parse(locationString) : null;
  };

  const location = getLocationFromLocalStorage();
  const state = location && location.city ? location.city : "";

  // Smooth scroll to specific card
  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = 344;
      const scrollPosition = index * cardWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  const handleNext = () => {
    if (currentIndex < savedCars.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  // Handle scroll events to update current index
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 344;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== currentIndex && newIndex < savedCars.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  return (
    <>
      {savedCars.length === 0 ? (
        <div className="flex justify-center items-center min-w-[344px] h-[202px]">
          <div className="flex flex-col gap-3 text-center">
            <div>No Saved Cars Available</div>
            <p>
              It seems like you haven't saved any cars yet. Browse and save your
              favorite cars!
            </p>
          </div>
        </div>
      ) : (
        /* Scrollable Cards Container with Navigation */
        <div className="relative z-10 max-w-[1400px] mx-auto px-4">
          {/* Left Arrow Button */}
          <button
            className="hidden md:flex absolute -left-10 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>

          {/* Horizontal Scrollable Cards Container */}
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory gap-6 px-8 py-4"
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
            onScroll={handleScroll}
          >
            {savedCars.map((car, index) => (
              <div
                key={`${car._id}-${index}`}
                className="flex-shrink-0 w-[320px] snap-start"
              >
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                  <div className="bg-gray-200">
                    {/* Card Header with Bookmark */}
                    <div className="flex justify-between items-start p-4 pb-2">
                      <button
                        onClick={(e) => toggleBookmark(car._id, e)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        {isBookmarked(car._id) ? (
                          <Bookmark className="h-6 w-6 text-red-500 fill-[#AB373A]" />
                        ) : (
                          <Bookmark className="h-6 w-6 text-gray-500" />
                        )}
                      </button>
                      {car.movrating && car.movrating !== "0" && (
                        <div className="bg-red-700 text-white text-xs font-medium px-2 py-1 rounded">
                          <span className="gap-[0.7px] flex justify-center items-center">
                            <span className="text-[13px] font-bold font-sans">
                              {car.movrating}
                            </span>
                            <Star size={13} color="white" fill="white" />
                          </span>
                        </div>
                      )}
                    </div>

                    {/* Car Image */}
                    <Link
                      to={
                        car.isVariant
                          ? `/variant/${car.carname.replace(/\s+/g, "-")}/${
                              car._id
                            }`
                          : `/product/${car.carname.replace(/\s+/g, "-")}/${
                              car._id
                            }`
                      }
                    >
                      <div className="px-6 py-2 flex justify-center">
                        <img
                          className="h-32 object-contain"
                          src={`${process.env.NEXT_PUBLIC_API}/productImages/${car.heroimage}`}
                          crossOrigin="anonymous"
                          alt={car.heroimagename}
                        />
                      </div>
                    </Link>
                  </div>

                  {/* Car Info */}
                  <div className="p-4 pt-2  h-[300px]">
                    <div className="mb-3">
                      <div className="text-gray-400 text-sm"></div>
                      <div className="text-[#AB373A] text-[18px] font-bold">
                        {car.brand} {car.carname}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Specifications */}
                      <div className="flex-col flex text-sm text-gray-600 gap-1">
                        <div className="flex items-center gap-1">
                          <Users size={15} />
                          <span>{parseList(car.seater)} Seater</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Fuel size={15} />
                          <span>{parseList(car.fueltype)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Settings size={15} />
                          <span>{parseList(car.transmissiontype)}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Star size={15} />
                          <span>Safety-{car.NCAP}</span>
                        </div>
                      </div>

                      {/* Price */}
                      <div className="mb-4">
                        <div className="flex items-baseline flex-col">
                          <span className="text-[18px] font-bold text-gray-900">
                            ₹
                            {formatCurrency(
                              car.onRoadPrice || car.lowestExShowroomPrice
                            )}
                            {car.onRoadPrice >= 1e7
                              ? " Crore"
                              : car.onRoadPrice >= 1e5
                              ? " Lakhs"
                              : ""}
                          </span>
                          <span className="text-gray-500 text-sm">
                            {rtoData && rtoData.length > 0
                              ? "On-Road"
                              : "Ex-Showroom"}{" "}
                            {state}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            className="hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handleNext}
            disabled={currentIndex === savedCars.length - 1}
          >
            <ChevronRight size={20} />
          </button>
        </div>
      )}
    </>
  );
};

export default SavedCars;
