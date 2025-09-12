import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import "./card.css";
import seater from "../../../../Images/icons/seat.png";
import petrol from "../../../../Images/icons/gas.png";
import manul from "../../../../Images/icons/machin.png";
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
            brand: {
              name: data.data.brand_id?.name || data.data.brand_id || "",
            },
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
              brand: {
                name: data.brand?.name || data.brand || "",
              },
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
    if (value >= 1e7) {
      // Convert to Crores
      return `${(value / 1e7).toFixed(2)}`;
    } else if (value >= 1e5) {
      // Convert to Lakhs
      return `${(value / 1e5).toFixed(2)}`;
    } else {
      // Format normally with commas
      return new Intl.NumberFormat("en-IN").format(value);
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
      const cardWidth = 360; // Card width + gap
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
      const cardWidth = 360;
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
        <div className="relative w-full">
          {/* Left Arrow Button */}
          <button
            className="absolute left-8 top-1/2 -translate-y-1/2 z-10 bg-[#818181] h-[27px] w-[27px] rounded-full text-white flex justify-center items-center shadow-lg transition-all duration-200 border-none"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>

          {/* Horizontal Scrollable Cards Container */}
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
            {savedCars.map((car, index) => (
              <section
                key={`${car._id}-${index}`}
                className="min-w-[344px] h-[202px] bg-transparent flex transition-all duration-300 snap-center"
              >
                <div className="w-[224px] h-[202px] md:h-[218px] border-[1px] border-[#818181] rounded-[15px] bg-white ml-4">
                  <div className="flex justify-end items-end mr-2 -mt-1">
                    <div>
                      <svg
                        onClick={(e) => toggleBookmark(car._id, e)}
                        aria-label={isBookmarked(car._id) ? "Unsave" : "Save"}
                        height="40"
                        role="img"
                        viewBox="0 0 24 40"
                        width="24"
                        color={isBookmarked(car._id) ? "var(--red)" : "#818181"}
                        fill={isBookmarked(car._id) ? "var(--red)" : "none"}
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

                  {/* Mobile price display */}
                  <div className="inside_card_title  onlyphoneme ml-3 flex space-x-4 mr-3">
                    <span className="mt-3">
                      <span className="mt-3 fontejiri text-red-500">₹ </span>
                      <span className="text-[11px] font-semibold font-[Montserrat]">
                        {formatCurrency(
                          car.onRoadPrice || car.lowestExShowroomPrice
                        )}
                        {car.onRoadPrice >= 1e7
                          ? " Crore"
                          : car.onRoadPrice >= 1e5
                          ? " Lakhs"
                          : ""}
                      </span>
                    </span>
                    <div className="d-flex flex-column mt-3.5">
                      <div className="thecolo font-weight-bold">
                        {rtoData && rtoData.length > 0
                          ? "Onwards On-Road"
                          : "Ex-Showroom"}
                      </div>
                      <span className="text-[11px] font-medium"> {state}</span>
                    </div>
                  </div>

                  {car.movrating && (
                    <div className="bg-red-800 md:hidden border shadow-xl px-4 py-2 -mt-5 ml-3 w-[35px] h-[12px] flex justify-center items-center text-center text-white">
                      <span className="text-[8px] font-[Montserrat]">
                        {car.movrating}
                      </span>
                      <span className="text-xs text-white">
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
                  )}

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
                    <div className="inside_card">
                      <div className="inside_card_title thedeskname flex flex-col">
                        <span className="text-gray-400">
                          {car.brand?.name || car.brand}
                        </span>
                        <span>{car.carname}</span>
                      </div>
                      <div className=" flex justify-center items-center">
                        {" "}
                        <img
                          className="w-[150px] h-[90px] mt-8 md:mt-auto"
                          src={`${process.env.NEXT_PUBLIC_API}/productImages/${car.heroimage}`}
                          crossOrigin="anonymous"
                          alt={car.heroimagename}
                        />
                      </div>
                      <section className="info_card">
                        <div
                          className="info_card_variants"
                          style={{ visibility: "hidden" }}
                        >
                          Variants{" "}
                          <span style={{ color: "var(--red)" }}>
                            {car.variants}
                          </span>
                        </div>
                        <div
                          className="thedeskname"
                          style={{ color: "#B1081A", fontWeight: "600" }}
                        >
                          <span style={{ color: "var(--black)" }}>₹</span>{" "}
                          <span>
                            {formatCurrency(car.lowestExShowroomPrice)} -{" "}
                            {formatCurrency(car.highestExShowroomPrice)}
                            {car.highestExShowroomPrice >= 1e7
                              ? " Crore"
                              : car.highestExShowroomPrice >= 1e5
                              ? " Lakhs"
                              : ""}
                          </span>
                        </div>
                        <div className="onlydesptop">
                          {rtoData && rtoData.length > 0
                            ? "On-Road"
                            : "Ex-Showroom"}{" "}
                          {state}
                        </div>
                      </section>
                    </div>{" "}
                    <div className="inside_card gap-2 onlyphoneme flex-column mt-4">
                      <div className="inside_card_title">
                        {car.brand?.name || car.brand}
                      </div>
                      <div className="inside_card_title">
                        <span>{car.carname}</span>
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
                      {parseList(car.seater) || car.seater}{" "}
                      {car.seater ? "Seater" : ""}
                    </div>
                  </div>
                  <div className="side_info">
                    <img
                      className="icon_image"
                      src={petrol}
                      alt="Petrol Icon"
                    />
                    <div className="side_info_inline">
                      <span>{parseList(car.fueltype) || car.fueltype}</span>
                    </div>
                  </div>
                  <div className="side_info">
                    <img className="icon_image" src={manul} alt="Manual Icon" />
                    <div className="side_info_inline">
                      {parseList(car.transmissiontype) || car.transmissiontype}
                    </div>
                  </div>
                  <div className="side_info">
                    <img className="icon_image" src={ncap} alt="NCAP Icon" />
                    <div className="side_info_inline">Safety - {car.NCAP}</div>
                  </div>
                </section>
              </section>
            ))}
          </div>

          {/* Right Arrow Button */}
          <button
            className="absolute right-8 top-1/2 -translate-y-1/2 z-10 bg-[#818181] h-[27px] w-[27px] rounded-full text-white flex justify-center items-center shadow-lg transition-all duration-200 border-none"
            onClick={handleNext}
            disabled={currentIndex === savedCars.length - 1}
          >
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </button>
        </div>
      )}

      {/* Add custom CSS for hiding scrollbar */}
      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

export default SavedCars;
