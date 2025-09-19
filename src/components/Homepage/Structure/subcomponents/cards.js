import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { useInfiniteQuery } from "@tanstack/react-query";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import Tyre from "../../../../Images/tyremask.png";
import {
  Bookmark,
  ChevronRight,
  ChevronLeft,
  Users,
  Fuel,
  Settings,
  Star,
} from "lucide-react";

const Cards = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [allDataMap, setAllDataMap] = useState({});
  const [showSkeleton, setShowSkeleton] = useState(true);
  const [selectedPriceRange, setSelectedPriceRange] = useState("8L");
  const [rtoData, setRtoData] = useState([]);
  const [isInitialLoadComplete, setIsInitialLoadComplete] = useState(false);

  const scrollContainerRef = useRef(null);
  const observerRef = useRef(null);

  // NEW: layout/visibility math
  const [visibleCount, setVisibleCount] = useState(1);
  const slotRef = useRef(340); // card width + gap (computed below)

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

  // Helpers
  const normalizeFuelType = (fuelType) => {
    if (!fuelType) return "";
    const normalizedFuel = fuelType.toLowerCase();
    if (normalizedFuel.includes("hybrid")) return "petrol";
    return normalizedFuel;
  };

  const formatCurrency = (value) => {
    if (value >= 1e7) return `${(value / 1e7).toFixed(2)} Crore`;
    if (value >= 1e5) return `${(value / 1e5).toFixed(2)} Lakhs`;
    return new Intl.NumberFormat("en-IN").format(value);
  };

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
    if (
      String(fuelType).toLowerCase() === "electric" ||
      rtoPercentage === "0"
    ) {
      rto += parseInt(amount || "0");
    }
    return rto;
  };

  const calculateRoadSafetyTax = (rto) => Math.ceil((rto * 2) / 100);

  const calculateInsurancePrice = (productPrice, insurancePercentage) =>
    Math.ceil((parseInt(productPrice) * parseFloat(insurancePercentage)) / 100);

  const calculateOnRoadPrice = (product, fuelType) => {
    let productPrice =
      typeof product === "object"
        ? product.exShowroomPrice || product.lowestExShowroomPrice || 0
        : product;
    const priceStr = productPrice?.toString();
    if (!/[0-9]/.test(priceStr)) return 0;
    if (!Array.isArray(rtoData) || rtoData.length === 0)
      return parseFloat(productPrice) || 0;

    const normalizedFuelType = normalizeFuelType(fuelType);
    const roadPriceData = getDataFromRoadPriceListBasedOnFuelAndPriceRange(
      rtoData,
      priceStr,
      normalizedFuelType
    );
    const price = parseInt(priceStr) || 0;

    const rto = calculateRtoPrice(
      priceStr,
      roadPriceData.rtoPercentage || "0",
      roadPriceData.amount || "0",
      normalizedFuelType
    );
    const roadSafetyTax = calculateRoadSafetyTax(rto);
    const insurance = calculateInsurancePrice(
      priceStr,
      roadPriceData.insurancePercentage || "0"
    );
    const luxuryTax = price > 999999 ? Math.ceil(price / 100) : 0;
    const hypethecationCharges = parseInt(
      roadPriceData.hypethecationCharges || "0"
    );
    const fastag = parseInt(roadPriceData.fastag || "0");
    const others = parseInt(roadPriceData.others || "0");

    return (
      price +
      rto +
      roadSafetyTax +
      insurance +
      luxuryTax +
      hypethecationCharges +
      fastag +
      others
    );
  };

  const calculateLowestOnRoadPrice = (car) => {
    if (!car.variants || car.variants.length === 0) {
      return calculateOnRoadPrice(
        car.lowestExShowroomPrice,
        getFirstFuelType(car.fueltype)
      );
    }
    let minPrice = Infinity;
    car.variants.forEach((variant) => {
      const price = calculateOnRoadPrice(variant.exShowroomPrice, variant.fuel);
      if (price < minPrice) minPrice = price;
    });
    return minPrice;
  };

  const parseList = (input) => {
    if (Array.isArray(input)) return input.join(" | ");
    if (typeof input === "number") return input.toString();
    if (typeof window !== "undefined" && typeof input === "string") {
      const parser = new DOMParser();
      const doc = parser.parseFromString(input, "text/html");
      const items = doc.querySelectorAll("ul li, p");
      const extracted = Array.from(items).map((item) =>
        item.textContent.trim()
      );
      return extracted.length > 1
        ? extracted.join(" | ") + " |"
        : extracted.join("");
    }
    return String(input ?? "");
  };

  const getFirstFuelType = (fuelData) => {
    if (Array.isArray(fuelData)) return fuelData[0];
    if (typeof fuelData === "string") {
      const match = fuelData.match(/<li>(.*?)<\/li>/i);
      if (match && match[1]) return match[1];
      return fuelData;
    }
    return "";
  };

  // Data fetching
  const fetchProducts = async ({ pageParam = 1 }) => {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/allproducts/mo?page=${pageParam}`
    );
    const data = await response.json();

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
            variantFuelTypes: [item.fueltype],
          };
        } catch (error) {
          return {
            ...item,
            variants: [],
            variantFuelTypes: [item.fueltype],
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
    getNextPageParam: (lastPage, pages) =>
      lastPage.length > 0 ? pages.length + 1 : undefined,
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
      if (range === "50L.") return lowestOnRoadPrice >= min;
      return (
        lowestOnRoadPrice <= priceCap &&
        lowestOnRoadPrice >= min &&
        lowestOnRoadPrice <= max
      );
    });

    if (range === "50L.") {
      return filteredData.sort(
        (a, b) => a.lowestExShowroomPrice - b.lowestExShowroomPrice
      );
    }
    return filteredData.sort(
      (a, b) => b.lowestExShowroomPrice - a.lowestExShowroomPrice
    );
  };

  // Build map per range once data + RTO ready
  useEffect(() => {
    if (data && rtoData.length > 0) {
      const flattenedData = data.pages.flat();
      const dataMap = {};
      Object.keys(priceLimits).forEach((range) => {
        dataMap[range] = filterProductsByRange(flattenedData, range);
      });
      setAllDataMap(dataMap);

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
      if (!parsedLocationState || !parsedLocationState.state) return;

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/v1/onroad-procing-for-website-landingpage`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ state: parsedLocationState.state }),
        }
      );
      const result = await response.json();
      if (result.data && Array.isArray(result.data)) setRtoData(result.data);
    } catch (error) {
      setRtoData([]);
    }
  };

  // Bookmarks
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const saved = JSON.parse(localStorage.getItem("bookmarks") || "[]");
    return saved || [];
  });
  const isBookmarked = (id) => bookmarkedIds.includes(id);
  const toggleBookmark = (id) => {
    const updated = isBookmarked(id)
      ? bookmarkedIds.filter((bid) => bid !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updated);
    localStorage.setItem("bookmarks", JSON.stringify(updated));
  };

  const getCurrentData = () => allDataMap[selectedPriceRange] || [];

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
    // realign scroller to start for new range
    scrollContainerRef.current?.scrollTo({ left: 0, behavior: "auto" });
  }, [selectedPriceRange]);

  // Infinite scroll (load more pages)
  useEffect(() => {
    if (!isInitialLoadComplete) return;
    const observer = new IntersectionObserver(
      (entries) => {
        const target = entries[0];
        if (target.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { root: null, rootMargin: "0px", threshold: 0.1 }
    );
    if (observerRef.current) observer.observe(observerRef.current);
    return () => {
      if (observerRef.current) observer.unobserve(observerRef.current);
    };
  }, [hasNextPage, isFetchingNextPage, isInitialLoadComplete, fetchNextPage]);

  // Measure: how many cards fit (incl. real CSS gap)
  const measure = () => {
    const el = scrollContainerRef.current;
    if (!el) return;

    // Grab the first card to get width, and the flex row to get gap
    const card = el.querySelector("[data-card]");
    const track = el.firstElementChild; // the inner flex container
    const cardW = card ? card.getBoundingClientRect().width : 320;

    let gap = 0;
    if (track) {
      const style = getComputedStyle(track);
      // try gap, then columnGap for safety
      gap =
        parseFloat(style.gap || style.columnGap || "0") ||
        parseFloat(style.columnGap || "0") ||
        0;
    }

    const slot = cardW + gap;
    slotRef.current = slot;

    const count = Math.max(1, Math.floor((el.clientWidth + gap) / slot));
    setVisibleCount(count);

    // Clamp current index if now beyond max
    const dataNow = getCurrentData();
    const maxIndex = Math.max(0, dataNow.length - count);
    setCurrentIndex((idx) => Math.min(idx, maxIndex));
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
    // Re-measure when data length / range changes
  }, [selectedPriceRange, allDataMap]);

  // Scroll handlers
  const currentData = getCurrentData();
  const maxIndex = Math.max(0, currentData.length - visibleCount);
  const hasOverflow = currentData.length > visibleCount;

  const onScroll = () => {
    const el = scrollContainerRef.current;
    if (!el) return;
    const slot = slotRef.current || 340;
    const nextIdx = Math.round(el.scrollLeft / slot);
    const clamped = Math.max(0, Math.min(nextIdx, maxIndex));
    if (clamped !== currentIndex) setCurrentIndex(clamped);
  };

  const scrollToIndex = (index) => {
    const slot = slotRef.current || 340;
    const clamped = Math.max(0, Math.min(index, maxIndex));
    scrollContainerRef.current?.scrollTo({
      left: clamped * slot,
      behavior: "smooth",
    });
    setCurrentIndex(clamped);
  };

  const prev = () => scrollToIndex(currentIndex - 1);
  const next = () => scrollToIndex(currentIndex + 1);

  return (
    <div className="relative w-full mb-[50px] overflow-hidden">
      {/* background */}
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

      <div className="relative z-10 max-w-[1400px] mx-auto px-4">
        {/* Desktop Price Range Selector */}
        <div className="hidden md:flex justify-center mb-4">
          <div className="flex">
            {["8L", "15L", "25L", "50L", "50L."].map((range, index, array) => (
              <React.Fragment key={range}>
                <button
                  className={`flex-shrink-0 rounded-full text-[14px] font-semibold transition-colors w-[101px] h-[38px] border-[0.5px] border-gray-400 ${
                    selectedPriceRange === range
                      ? "bg-[#AB373A] text-white"
                      : "bg-gray-100 text-black"
                  }`}
                  onClick={() => setSelectedPriceRange(range)}
                >
                  {range === "50L." ? "ABOVE" : "UNDER"}{" "}
                  {range.replace("L", "L")}
                </button>
                {index !== array.length - 1 && (
                  <div className="w-px mx-1 my-2" />
                )}
              </React.Fragment>
            ))}
          </div>
        </div>

        {/* Mobile Price Range Selector */}
        <div className="flex md:hidden justify-start mb-4 overflow-x-auto scrollbar-hide">
          <div className="flex space-x-1 px-4 min-w-max gap-1">
            {["8L", "15L", "25L", "50L", "50L."].map((range) => (
              <button
                key={range}
                className={`rounded-full text-[12px] sm:text-[14px] p-2  font-semibold transition-colors h-[36px] sm:h-[38px] border-[0.5px] border-gray-400  ${
                  selectedPriceRange === range
                    ? "bg-[#AB373A] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setSelectedPriceRange(range)}
              >
                {range === "50L." ? "ABOVE" : "UNDER"} {range.replace("L", "L")}
              </button>
            ))}
          </div>
        </div>

        {/* LEFT ARROW — only if overflow & not at start */}
        {hasOverflow && currentIndex > 0 && (
          <button
            className="hidden md:flex absolute -left-10 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={prev}
            aria-label="Previous"
          >
            <ChevronLeft />
          </button>
        )}

        {/* Cards scroller */}
        <div className="relative">
          <div
            ref={scrollContainerRef}
            className="flex overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory gap-4 md:gap-6 px-2 md:px-8 py-4"
            style={{
              scrollBehavior: "smooth",
              WebkitOverflowScrolling: "touch",
              msOverflowStyle: "none",
              scrollbarWidth: "none",
            }}
            onScroll={onScroll}
          >
            {currentData.length > 0 ? (
              currentData.map((card) => (
                <div
                  key={card._id}
                  data-card
                  className="flex-shrink-0 w-[340px] md:w-[320px] snap-start"
                >
                  <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                    <div className="bg-gray-200">
                      {/* Header with bookmark + rating */}
                      <div className="flex justify-between items-start p-4 pb-2">
                        <button
                          onClick={() => toggleBookmark(card._id)}
                          className="text-gray-400 hover:text-red-500 transition-colors flex justify-end items-end"
                        >
                          {isBookmarked(card._id) ? (
                            <Bookmark className="h-6 w-6 text-red-500 fill-[#AB373A] cursor-pointer" />
                          ) : (
                            <Bookmark className="h-6 w-6 text-gray-500 cursor-pointer" />
                          )}
                        </button>

                        {card.movrating && card.movrating !== "0" && (
                          <div className="bg-red-700 text-white text-xs font-medium px-2 py-1 rounded">
                            <span className="gap-[0.7px] flex justify-center items-center">
                              <span className="text-[13px] font-bold font-sans">
                                {card.movrating}
                              </span>
                              <Star size={13} color="white" fill="white" />
                            </span>
                          </div>
                        )}
                      </div>

                      {/* Image */}
                      <Link
                        to={`/product/${card.carname.replace(/\s+/g, "-")}/${
                          card._id
                        }`}
                      >
                        <div className="px-6 py-2 flex justify-center">
                          <img
                            className="h-32 object-contain"
                            src={`${process.env.NEXT_PUBLIC_API}/productImages/${card.heroimage}`}
                            crossOrigin="anonymous"
                            alt={card.heroimagename}
                          />
                        </div>
                      </Link>
                    </div>

                    {/* Info */}
                    <div className="p-4 pt-2 h-[300px]">
                      <div className="mb-3">
                        <div className="text-[#AB373A] text-[18px] font-bold">
                          {card.brand?.name} {card.carname}
                        </div>
                      </div>

                      <div className="flex flex-col gap-2">
                        <div className="flex-col flex text-sm text-gray-600 gap-1">
                          <div className="flex items-center gap-1">
                            <Users size={15} />
                            <span>{parseList(card.seater)} Seater</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Fuel size={15} />
                            <span>{parseList(card.fueltype)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Settings size={15} />
                            <span>{parseList(card.transmissiontype)}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Star size={15} />
                            <span>Safety-{card.NCAP}</span>
                          </div>
                        </div>

                        {/* Price */}
                        <div className="mb-4">
                          <div className="flex items-baseline flex-col">
                            <span className="text-[18px] font-bold text-gray-900">
                              ₹
                              {formatCurrency(
                                Math.round(calculateLowestOnRoadPrice(card))
                              )}{" "}
                              -{" "}
                              {formatCurrency(
                                Math.round(
                                  calculateOnRoadPrice(
                                    parseFloat(card.highestExShowroomPrice),
                                    getFirstFuelType(card.fueltype)
                                  )
                                )
                              )}{" "}
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

                    {/* Link overlay (if needed) */}
                    <Link
                      to={`/product/${card.carname.replace(/\s+/g, "-")}/${
                        card._id
                      }`}
                    />
                  </div>
                </div>
              ))
            ) : (
              <div className="flex justify-center items-center min-w-full py-12">
                <p className="text-gray-500">
                  No cars available in this price range
                </p>
              </div>
            )}
          </div>
        </div>

        {/* RIGHT ARROW — only if overflow & not at end */}
        {hasOverflow && currentIndex < maxIndex && (
          <button
            className="hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={next}
            aria-label="Next"
          >
            <ChevronRight />
          </button>
        )}
      </div>

      {/* Infinite loader sentinel */}
      <div ref={observerRef} />
    </div>
  );
};

export default Cards;
