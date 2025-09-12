import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./card.css";
import seater from "../../../../Images/icons/seat.png";
import petrol from "../../../../Images/icons/gas.png";
import manul from "../../../../Images/icons/machin.png";
import ncap from "../../../../Images/icons/privi.png";
import { useInfiniteQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Tyre from "../../../../Images/tyremask.png";
import CarSearchComponent from "@/components/carSearchFilter";

const Cards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allDataMap, setAllDataMap] = useState({});
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [selectedPriceRange, setSelectedPriceRange] = useState("8L");
  const [rtoData, setRtoData] = useState([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);
  const scrollContainerRef = useRef(null);
  const observerRef = useRef(null);

  // Price range definitions
  const priceLimits = {
    "8L": { min: 0, max: 800000 },
    "15L": { min: 800000, max: 2000000 },
    "25L": { min: 1500000, max: 3000000 },
    "50L": { min: 2500000, max: 5500000 },
    "50L.": { min: 5000000, max: Infinity },
  };

  const frontendPriceCap = {
    "8L": 800000,
    "15L": 1500000,
    "25L": 2500000,
    "50L": 5000000,
    "50L.": Infinity,
  };

  // Helper function to normalize fuel type - treat hybrid as petrol
  const normalizeFuelType = (fuelType) => {
    if (!fuelType) return "";
    const normalizedFuel = fuelType.toLowerCase();
    if (normalizedFuel.includes("hybrid")) {
      return "petrol";
    }
    return normalizedFuel;
  };

  // Format currency with Lakhs/Crore suffixes
  const formatCurrency = (value) => {
    if (value >= 1e7) {
      return `${(value / 1e7).toFixed(2)} Crore`;
    } else if (value >= 1e5) {
      return `${(value / 1e5).toFixed(2)} Lakhs`;
    } else {
      return new Intl.NumberFormat("en-IN").format(value);
    }
  };

  // Main on-road price calculation using mobile app logic
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

  // New function to calculate the lowest on-road price across all variants
  const calculateLowestOnRoadPrice = (car) => {
    if (!car.variants || car.variants.length === 0) {
      // If no variants, use car's own price
      return calculateOnRoadPrice(
        car.lowestExShowroomPrice,
        getFirstFuelType(car.fueltype)
      );
    }

    // Calculate on-road price for each variant and find the minimum
    let minPrice = Infinity;
    car.variants.forEach((variant) => {
      const price = calculateOnRoadPrice(variant.exShowroomPrice, variant.fuel);
      if (price < minPrice) {
        minPrice = price;
      }
    });

    return minPrice;
  };

  // Helper Functions
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

  // Parse HTML/array/string into consistent format
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

  const fetchProducts = async ({ pageParam = 1 }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/allproducts/mo?page=${pageParam}`
    );
    const data = await response.json();

    // Fetch variant details for each car
    const enrichedData = await Promise.all(
      data.data.map(async (item) => {
        try {
          const variantResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API}/api/variants/active/${item._id}`
          );
          const variantData = await variantResponse.json();

          if (variantData.data?.length > 0) {
            return {
              ...item,
              variants: variantData.data,
              lowestExShowroomPrice: Math.min(
                ...variantData.data.map((v) => v.exShowroomPrice)
              ),
              highestExShowroomPrice: Math.max(
                ...variantData.data.map((v) => v.exShowroomPrice)
              ),
              variantFuelTypes: [
                ...new Set(variantData.data.map((v) => v.fuel)),
              ],
            };
          }
          return {
            ...item,
            variants: [],
            variantFuelTypes: [item.fueltype], // Fallback to car fuel type
          };
        } catch (error) {
          console.error(`Failed to fetch variants for ${item._id}:`, error);
          return {
            ...item,
            variants: [],
            variantFuelTypes: [item.fueltype], // Fallback to car fuel type
          };
        }
      })
    );

    return enrichedData.filter((item) => item.active === "true");
  };

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    status,
    isLoading,
  } = useInfiniteQuery({
    queryKey: ["products"],
    queryFn: fetchProducts,
    getNextPageParam: (lastPage, pages) => {
      return lastPage.length > 0 ? pages.length + 1 : undefined;
    },
    cacheTime: 1000 * 60 * 60,
    staleTime: 1000 * 60 * 5,
  });

  const filterProductsByRange = (allData, range) => {
    const { min, max } = priceLimits[range];
    const priceCap = frontendPriceCap[range];

    const filteredData = allData.filter((item) => {
      if (
        item.active !== "true" ||
        item.lowestExShowroomPrice === null ||
        item.highestExShowroomPrice === null
      ) {
        return false;
      }

      const lowestOnRoadPrice = calculateLowestOnRoadPrice(item);

      // For "50L." range, we need to ensure the price is actually above 50L
      if (range === "50L.") {
        return lowestOnRoadPrice >= min; // Only check minimum for above 50L
      }

      return (
        lowestOnRoadPrice <= priceCap &&
        lowestOnRoadPrice >= min &&
        lowestOnRoadPrice <= max
      );
    });

    // Sort in ascending order for "50L." (above 50 lakh), descending for others
    if (range === "50L.") {
      return filteredData.sort(
        (a, b) => a.lowestExShowroomPrice - b.lowestExShowroomPrice
      );
    } else {
      return filteredData.sort(
        (a, b) => b.lowestExShowroomPrice - a.lowestExShowroomPrice
      );
    }
  };

  // Process data when React Query data changes
  useEffect(() => {
    if (data && rtoData.length > 0) {
      const flattenedData = data.pages.flat();

      const dataMap = {};
      Object.keys(priceLimits).forEach((range) => {
        dataMap[range] = filterProductsByRange(flattenedData, range);
      });

      setAllDataMap(dataMap);

      // Mark initial load as complete only when we have both product data and RTO data
      if (!isInitialLoadComplete && flattenedData.length > 0) {
        setIsInitialLoadComplete(true);
        setShowSkeleton(false);
      }
    }
  }, [data, rtoData, isInitialLoadComplete]);

  // Fetch RTO data
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

  // Bookmark management
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const savedBookmarks = JSON.parse(
      localStorage.getItem("bookmarks") || "[]"
    );
    return savedBookmarks || [];
  });

  const isBookmarked = (id) => bookmarkedIds.includes(id);

  const toggleBookmark = (id) => {
    const updatedBookmarks = isBookmarked(id)
      ? bookmarkedIds.filter((bookmarkId) => bookmarkId !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  };

  const getCurrentData = () => {
    return allDataMap[selectedPriceRange] || [];
  };

  const getLocationFromLocalStorage = () => {
    const locationString = localStorage.getItem("location");
    try {
      return locationString ? JSON.parse(locationString) : null;
    } catch {
      return null;
    }
  };

  const location = getLocationFromLocalStorage();
  const state = location && location.city ? location.city : "";

  useEffect(() => {
    fetchRTOData();
  }, []);

  useEffect(() => {
    setCurrentIndex(0);
  }, [selectedPriceRange]);

  // Infinite scroll observer - only active after initial load
  useEffect(() => {
    if (!isInitialLoadComplete) return;

    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      {
        root: null,
        rootMargin: "0px",
        threshold: 0.1,
      }
    );

    if (observerRef.current) {
      observer.observe(observerRef.current);
    }

    return () => {
      if (observerRef.current) {
        observer.unobserve(observerRef.current);
      }
    };
  }, [hasNextPage, isFetchingNextPage, isInitialLoadComplete]);

  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const isMobile = window.innerWidth <= 768;

      if (isMobile) {
        const cardWidth = isIPhone14ProMax() ? 380 : window.innerWidth;
        const scrollPosition = index * cardWidth;
        scrollContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      } else {
        const cardWidth = 360;
        const scrollPosition = index * cardWidth;
        scrollContainerRef.current.scrollTo({
          left: scrollPosition,
          behavior: "smooth",
        });
      }
    }
  };

  const handlePrevious = () => {
    const currentData = getCurrentData();
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
    } else {
      const priceRanges = ["8L", "15L", "25L", "50L", "50L."];
      const currentRangeIndex = priceRanges.indexOf(selectedPriceRange);

      if (currentRangeIndex > 0) {
        const previousPriceRange = priceRanges[currentRangeIndex - 1];
        setSelectedPriceRange(previousPriceRange);
      }
    }
  };

  const handleNext = () => {
    const currentData = getCurrentData();
    if (currentIndex < currentData.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
    } else {
      const priceRanges = ["8L", "15L", "25L", "50L", "50L."];
      const currentRangeIndex = priceRanges.indexOf(selectedPriceRange);

      if (currentRangeIndex < priceRanges.length - 1) {
        const nextPriceRange = priceRanges[currentRangeIndex + 1];
        setSelectedPriceRange(nextPriceRange);
      }
    }
  };

  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = isIPhone14ProMax() ? 380 : 360;
      const newIndex = Math.round(scrollLeft / cardWidth);
      const currentData = getCurrentData();
      if (newIndex !== currentIndex && newIndex < currentData.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  const currentData = getCurrentData();

  // Skeleton loader component
  const SkeletonLoader = ({ count = 5 }) => {
    return (
      <div className="flex overflow-x-auto scrollbar-hide gap-4 px-12 py-4">
        {[...Array(count)].map((_, index) => (
          <section
            key={index}
            className="min-w-[344px] h-[202px] bg-transparent flex animate-pulse"
          >
            <div className="w-[224px] h-[202px] border-[1px] border-[#e1e1e1] rounded-[12px] bg-gray-100 ml-4">
              <div className="flex justify-end items-end mr-2 -mt-1">
                <Skeleton width={24} height={40} />
              </div>

              {/* Price section skeleton */}
              <div className="inside_card_title onlyphoneme ml-3 justify-content-between mr-3">
                <span className="mt-3">
                  <Skeleton width={80} height={20} />
                </span>
                <div className="d-flex flex-column mt-3">
                  <Skeleton width={100} height={16} />
                  <Skeleton width={60} height={14} className="mt-1" />
                </div>
              </div>

              {/* Rating badge skeleton */}
              <div className="bg-gray-200 md:hidden border px-4 py-2 -mt-5 ml-3 w-[35px] h-[12px] flex justify-center items-center text-center">
                <Skeleton width={20} height={12} />
              </div>

              {/* Main content skeleton */}
              <div className="inside_card">
                <div className="inside_card_title thedeskname flex flex-col">
                  <Skeleton width={60} height={14} className="mb-1" />
                  <Skeleton width={120} height={18} />
                </div>
                <Skeleton
                  className="w-[150px] h-[90px] mt-8 md:mt-auto"
                  containerClassName="flex justify-center"
                />
                <section className="info_card">
                  <div className="thedeskname">
                    <Skeleton width={180} height={16} />
                  </div>
                  <div className="onlydesptop">
                    <Skeleton width={100} height={14} className="mt-1" />
                  </div>
                </section>
                <div className="inside_card gap-2 onlyphoneme flex-column">
                  <Skeleton width={100} height={16} />
                  <Skeleton width={120} height={16} className="mt-1" />
                </div>
              </div>
            </div>

            {/* Side info skeleton */}
            <section className="main_card_info">
              {[...Array(4)].map((_, i) => (
                <div className="side_info" key={i}>
                  <Skeleton circle width={24} height={24} />
                  <div className="side_info_inline">
                    <Skeleton width={60} height={16} />
                  </div>
                </div>
              ))}
            </section>
          </section>
        ))}
      </div>
    );
  };

  // Show skeleton loader until initial load is complete
  if (showSkeleton || isLoading || !isInitialLoadComplete) {
    return (
      <>
        <div className="advance_bars onlydesptop">
          <ul className="search_tabs addmargin">
            {["8L", "15L", "25L", "50L", "50L."].map((range, index, array) => (
              <React.Fragment key={range}>
                <li
                  className={`advance_bars_back ${
                    selectedPriceRange === range ? "active" : ""
                  }`}
                  onClick={() => setSelectedPriceRange(range)}
                >
                  {range === "50L." ? "ABOVE" : "UNDER"}{" "}
                  <div className="price-range">{range}</div>
                </li>
                {index !== array.length - 1 && (
                  <div className="the-deviderbt"></div>
                )}
              </React.Fragment>
            ))}
          </ul>
        </div>

        <div
          className="w-full advance_bars advance_bars_mob onlyphoneme-2"
          style={{ display: "none" }}
        >
          <ul className="search_tabs addmargin flex">
            {["8L", "15L", "25L", "50L", "50L."].map((range, index, array) => {
              return (
                <React.Fragment key={range}>
                  <li
                    className={`flex flex-col items-center justify-center transition-all duration-300 ${
                      selectedPriceRange === range
                        ? "w-[79px] h-[79px] bg-[#B10819]"
                        : "w-[65px] h-[65px] bg-[#818181]"
                    } text-white rounded-sm shadow-md flex-shrink-0 cursor-pointer transition-all duration-300`}
                    onClick={() => setSelectedPriceRange(range)}
                  >
                    <div className="text-lg font-semi">
                      {range === "50L." ? "ABOVE" : "UNDER"}
                    </div>
                    <div className="text-lg font-semibold">
                      {range === "8L"
                        ? "08"
                        : range.replace("L", "").replace(".", "")}
                    </div>
                    <div className="text-lg font-semi">LAKHS</div>
                  </li>

                  {index !== array.length - 1 && (
                    <span className="flex justify-center items-center">
                      <hr className="h-[70px] w-[2px] border-none bg-[#828282]" />
                    </span>
                  )}
                </React.Fragment>
              );
            })}
          </ul>
        </div>

        <SkeletonLoader count={5} />

        {/* <style jsx>{`
          .scrollbar-hide {
            -ms-overflow-style: none;
            scrollbar-width: none;
          }
          .scrollbar-hide::-webkit-scrollbar {
            display: none;
          }
        `}</style> */}
      </>
    );
  }
  const isIPhone14ProMax = () => {
    return window.innerWidth === 430 && window.innerHeight === 932;
  };

  return (
    <>
      {/* Add CSS for tablet-only padding */}
      {/* <style jsx>{`
        @media only screen and (min-width: 768px) and (max-width: 1024px) {
          .tablet-only-padding {
            padding-bottom: 2px;
            height: 400px;
          }
        }
      `}</style> */}

      <div className="flex justify-center items-center w-full py-8  tablet-only-padding">
        <div className="relative w-full py-8 bg-white">
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
          <div className="relative z-10">
            <div className="advance_bars onlydesptop">
              <ul className="search_tabs addmargin">
                {["8L", "15L", "25L", "50L", "50L."].map(
                  (range, index, array) => (
                    <React.Fragment key={range}>
                      <li
                        className={`advance_bars_back ${
                          selectedPriceRange === range ? "active" : ""
                        }`}
                        onClick={() => setSelectedPriceRange(range)}
                      >
                        {range === "50L." ? "ABOVE" : "UNDER"}{" "}
                        <div className="price-range">{range}</div>
                      </li>
                      {index !== array.length - 1 && (
                        <div className="the-deviderbt"></div>
                      )}
                    </React.Fragment>
                  )
                )}
              </ul>
            </div>

            <div className=" flex justify-center items-center ">
              <div
                className="w-full advance_bars advance_bars_mob onlyphoneme-2"
                style={{ display: "none" }}
              >
                <ul className="search_tabs addmargin flex ">
                  {["8L", "15L", "25L", "50L", "50L."].map(
                    (range, index, array) => {
                      return (
                        <React.Fragment key={range}>
                          <li
                            className={`flex flex-col items-center justify-center transition-all duration-300 ${
                              selectedPriceRange === range
                                ? "w-[79px] h-[79px] bg-[#B10819]"
                                : "w-[65px] h-[65px] bg-[#818181]"
                            } text-white rounded-sm shadow-md flex-shrink-0 cursor-pointer transition-all duration-300`}
                            onClick={() => setSelectedPriceRange(range)}
                          >
                            <div className="text-lg font-semi">
                              {range === "50L." ? "ABOVE" : "UNDER"}
                            </div>
                            <div className="text-lg font-semibold">
                              {range === "8L"
                                ? "08"
                                : range.replace("L", "").replace(".", "")}
                            </div>
                            <div className="text-lg font-semi">LAKHS</div>
                          </li>

                          {index !== array.length - 1 && (
                            <span className="flex justify-center items-center">
                              <hr className="h-[70px] w-[2px] border-none bg-[#828282]" />
                            </span>
                          )}
                        </React.Fragment>
                      );
                    }
                  )}
                </ul>
              </div>
            </div>

            <div className="flex py-10">
              <CarSearchComponent />
              <div className="flex justify-center items-center w-[70%] ">
                <div className="relative w-full max-w-[1500px] ">
                  <button
                    className="absolute left-8  top-1/2 -translate-y-1/2 z-20 bg-[#818181] h-[27px] w-[27px] rounded-full text-white flex justify-center items-center shadow-lg transition-all duration-200 border-none"
                    onClick={handlePrevious}
                    disabled={currentIndex === 0 && selectedPriceRange === "8L"}
                  >
                    <ion-icon name="chevron-back-outline"></ion-icon>
                  </button>

                  <div
                    ref={scrollContainerRef}
                    className="flex overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory gap-4 px-12 py-4"
                    style={{
                      scrollBehavior: "smooth",
                      WebkitOverflowScrolling: "touch",
                      msOverflowStyle: "none",
                      scrollbarWidth: "none",
                    }}
                    onScroll={handleScroll}
                  >
                    {currentData.length > 0 ? (
                      currentData.map((card, index) => (
                        <section
                          key={`${card._id}-${index}`}
                          className={`${
                            isIPhone14ProMax()
                              ? "min-w-[380px] h-[202px] "
                              : "min-w-[344px] h-[202px]"
                          } bg-transparent flex transition-all duration-300 snap-center`}
                        >
                          <div
                            className={`${
                              isIPhone14ProMax()
                                ? "w-[250px] h-[202px] "
                                : "w-[224px] h-[202px]"
                            } md:h-[218px] border-[1px] border-[#818181] rounded-[12px] bg-white ml-4`}
                          >
                            <div className="flex justify-end items-end mr-3 -mt-1 ">
                              <div>
                                <svg
                                  onClick={() => toggleBookmark(card._id)}
                                  aria-label={
                                    isBookmarked(card._id) ? "Unsave" : "Save"
                                  }
                                  height="40"
                                  role="img"
                                  viewBox="0 0 24 40"
                                  width="24"
                                  color={
                                    isBookmarked(card._id)
                                      ? "var(--red)"
                                      : "#818181"
                                  }
                                  fill={
                                    isBookmarked(card._id)
                                      ? "var(--red)"
                                      : "none"
                                  }
                                  className="cursor-pointer"
                                >
                                  <polygon
                                    points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                                    stroke="currentColor"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth="1"
                                  ></polygon>
                                </svg>
                              </div>
                            </div>

                            <div className="inside_card_title  onlyphoneme ml-3 flex space-x-4 mr-3">
                              <span className="mt-3">
                                <span className="mt-3 fontejiri text-red-500">
                                  ₹{" "}
                                </span>
                                <span className="fontejiri">
                                  {formatCurrency(
                                    Math.round(calculateLowestOnRoadPrice(card))
                                  )}
                                </span>
                              </span>
                              <div className="d-flex flex-column mt-3.5">
                                <div className="thecolo font-weight-bold">
                                  {rtoData && rtoData.length > 0
                                    ? "Onwards On-Road"
                                    : "Ex-Showroom"}
                                </div>
                                <span className="text-[11px] font-medium">
                                  {" "}
                                  {state}
                                </span>
                              </div>
                            </div>

                            <div className="bg-red-800 md:hidden border shadow-xl px-4 py-2 -mt-5 ml-3 w-[35px] h-[12px] flex justify-center items-center text-center text-white">
                              <span className="text-xs font-sans">
                                {card.movrating}
                              </span>
                              <span className="text-xs text-white">
                                {" "}
                                <svg
                                  width="10"
                                  height="7"
                                  viewBox="0 0 10 7"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                >
                                  <path
                                    d="M2.46172 6.87014C2.23095 6.95042 1.96909 6.80973 2.01572 6.63013L2.51193 4.71242L0.405723 3.35178C0.209032 3.22447 0.311263 2.99175 0.574913 2.96661L3.50316 2.68443L4.80886 0.930113C4.92663 0.771994 5.24529 0.771994 5.36306 0.930113L6.66876 2.68443L9.59701 2.96661C9.86066 2.99175 9.96289 3.22447 9.7656 3.35178L7.65999 4.71242L8.1562 6.63013C8.20283 6.80973 7.94097 6.95042 7.71021 6.87014L5.08506 5.95548L2.46172 6.87014Z"
                                    fill="#FCFCFC"
                                  />
                                </svg>
                              </span>
                            </div>

                            <Link
                              to={`/product/${card.carname.replace(
                                /\s+/g,
                                "-"
                              )}/${card._id}`}
                            >
                              <div className="inside_card">
                                <div className="inside_card_title thedeskname flex flex-col">
                                  <span className="text-gray-400">
                                    {card.brand.name}
                                  </span>
                                  <span>{card.carname}</span>
                                </div>
                                <div className=" flex justify-center items-center">
                                  {" "}
                                  <img
                                    className={`${
                                      isIPhone14ProMax()
                                        ? "w-[190px] h-[110px] "
                                        : "w-[150px] h-[90px] "
                                    } w-[150px] h-[90px] car-image-tablet md:mt-auto`}
                                    src={`${process.env.NEXT_PUBLIC_API}/productImages/${card.heroimage}`}
                                    crossOrigin="anonymous"
                                    alt={card.heroimagename}
                                  />
                                  {/* <style jsx>{`
                                  @media only screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
                                    .car-image-tablet {
                                      width: 170px !important;
                                      height: 120px !important;
                                    }
                                  }
                                  @media only screen and (min-width: 820px) and (max-width: 1180px) {
                                    .car-image-tablet {
                                      width: 170px !important;
                                      height: 120px !important;
                                    }
                                  }
                                `}</style> */}
                                </div>
                                <section className="info_card">
                                  <div
                                    className="info_card_variants"
                                    style={{ visibility: "hidden" }}
                                  >
                                    Variants{" "}
                                    <span style={{ color: "var(--red)" }}>
                                      {card.variants?.length || 0}
                                    </span>
                                  </div>

                                  <div
                                    className="thedeskname"
                                    style={{
                                      color: "#B1081A",
                                      fontWeight: "600",
                                    }}
                                  >
                                    <span style={{ color: "var(--black)" }}>
                                      ₹
                                    </span>{" "}
                                    <span>
                                      {formatCurrency(
                                        Math.round(
                                          calculateLowestOnRoadPrice(card)
                                        )
                                      )}{" "}
                                      -{" "}
                                      {formatCurrency(
                                        Math.round(
                                          calculateOnRoadPrice(
                                            parseFloat(
                                              card.highestExShowroomPrice
                                            ),
                                            getFirstFuelType(card.fueltype)
                                          )
                                        )
                                      )}
                                    </span>
                                  </div>
                                  <div className="onlydesptop">
                                    {rtoData && rtoData.length > 0
                                      ? "On-Road"
                                      : "Ex-Showroom"}{" "}
                                    {state}
                                  </div>
                                </section>
                                <div className="inside_card gap-2 onlyphoneme flex-column">
                                  <div className="inside_card_title">
                                    {card.brand.name}{" "}
                                  </div>
                                  <div className="inside_card_title">
                                    <span>{card.carname}</span>
                                  </div>
                                </div>
                              </div>
                            </Link>
                          </div>

                          <section className="main_card_info">
                            <div className="side_info">
                              <img
                                className="icon_image"
                                src={seater}
                                alt="Seater Icon"
                              />
                              <div className="side_info_inline">
                                {parseList(card.seater)} Seater
                              </div>
                            </div>
                            <div className="side_info">
                              <img
                                className="icon_image"
                                src={petrol}
                                alt="Petrol Icon"
                              />
                              <div className="side_info_inline">
                                <span>{parseList(card.fueltype)}</span>
                              </div>
                            </div>
                            <div className="side_info">
                              <img
                                className="icon_image"
                                src={manul}
                                alt="Manual Icon"
                              />
                              <div className="side_info_inline">
                                {parseList(card.transmissiontype)}
                              </div>
                            </div>
                            <div className="side_info">
                              <img
                                className="icon_image"
                                src={ncap}
                                alt="NCAP Icon"
                              />
                              <div className="side_info_inline">
                                Safety - {card.NCAP}
                              </div>
                            </div>
                          </section>
                        </section>
                      ))
                    ) : (
                      <div className="flex justify-center items-center min-w-[344px] h-[202px]">
                        <p className="text-gray-500">
                          No cars available in this price range
                        </p>
                      </div>
                    )}
                  </div>

                  <button
                    className="absolute right-8 top-1/2 -translate-y-1/2 z-20 bg-[#818181] h-[27px] w-[27px] rounded-full text-white flex justify-center items-center shadow-lg transition-all duration-200 border-none"
                    onClick={handleNext}
                    disabled={
                      currentIndex === currentData.length - 1 &&
                      selectedPriceRange === "50L."
                    }
                  >
                    <ion-icon name="chevron-forward-outline"></ion-icon>
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* <style jsx>{`
            .scrollbar-hide {
              -ms-overflow-style: none;
              scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar {
              display: none;
            }
          `}</style> */}

          <div ref={observerRef}></div>
        </div>
      </div>
    </>
  );
};

export default Cards;
