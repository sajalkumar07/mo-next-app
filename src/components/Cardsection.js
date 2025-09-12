import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import seater from "../Images/icons/seat.png";
import petrol from "../Images/icons/gas.png";
import manual from "../Images/icons/machin.png";
import ncap from "../Images/icons/privi.png";
import Skeleton from "react-loading-skeleton";

const Cardsection = ({ newcardData, rtoData, onCardClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  // Smooth scroll to specific card
  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = isIPhone14ProMax() ? 380 : window.innerWidth;
      const scrollPosition = index * cardWidth;
      scrollContainerRef.current.scrollTo({
        left: scrollPosition,
        behavior: "smooth",
      });
    }
  };

  const handleCardInteraction = (e) => {
    // Only trigger if the click wasn't on a bookmark icon
    if (!e.target.closest('svg[aria-label="Unsave"], svg[aria-label="Save"]')) {
      onCardClick();
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
    if (currentIndex < newcardData.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  // Handle scroll events to update current index
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = isIPhone14ProMax() ? 380 : 360;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== currentIndex && newIndex < newcardData.length) {
        setCurrentIndex(newIndex);
      }
    }
  };
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

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    try {
      return savedBookmarks ? JSON.parse(savedBookmarks) : [];
    } catch {
      return [];
    }
  });

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

  const isIPhone14ProMax = () => {
    return window.innerWidth === 430 && window.innerHeight === 932;
  };

  return (
    <>
      {/* Scrollable Cards Container with Navigation */}
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
          {newcardData.length > 0 ? (
            newcardData.map((card, index) => (
              <section
                onClick={handleCardInteraction}
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
                  } md:h-[218px] border-[1px] border-[#818181] rounded-[15px] bg-white ml-4`}
                >
                  <div className="flex justify-end items-end mr-3 -mt-1">
                    <div>
                      <svg
                        onClick={(e) => toggleBookmark(card._id, e)}
                        aria-label={isBookmarked(card._id) ? "Unsave" : "Save"}
                        height="40"
                        role="img"
                        viewBox="0 0 24 40"
                        width="24"
                        color={
                          isBookmarked(card._id) ? "var(--red)" : "#818181"
                        }
                        fill={isBookmarked(card._id) ? "var(--red)" : "none"}
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
                      <span className="fontejiri">
                        {formatCurrency(card.onRoadPrice)}
                        {Math.round(card.onRoadPrice) >= 1e7
                          ? " Crore"
                          : Math.round(card.onRoadPrice) >= 1e5
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

                  {card.rating && (
                    <div className="bg-red-800 md:hidden border shadow-xl px-4 py-2 -mt-5 ml-3 w-[35px] h-[12px] flex justify-center items-center text-center text-white">
                      <span className="text-[8px] font-[Montserrat]">
                        {card.rating}
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
                    to={`/product/${card.carname.replace(/\s+/g, "-")}/${
                      card._id
                    }`}
                  >
                    <div className="inside_card">
                      <div className="inside_card_title thedeskname flex flex-col">
                        <span className="text-gray-400">{card.brand}</span>
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
                        <style jsx>{`
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
                        `}</style>
                      </div>
                      <section className="info_card">
                        <div
                          className="info_card_variants"
                          style={{ visibility: "hidden" }}
                        >
                          Variants{" "}
                          <span style={{ color: "var(--red)" }}>
                            {card.variant}
                          </span>
                        </div>

                        {/* Price range display */}
                        <div
                          className="thedeskname"
                          style={{ color: "#B1081A", fontWeight: "600" }}
                        >
                          <span style={{ color: "var(--black)" }}>₹</span>{" "}
                          <span>
                            {formatCurrency(card.onRoadPrice)}
                            {Math.round(card.onRoadPrice) >= 1e7
                              ? " Crore"
                              : Math.round(card.onRoadPrice) >= 1e5
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
                      <div className="inside_card_title">{card.brand} </div>
                      <div className="inside_card_title">
                        <span>{card.carname}</span>
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
                      src={manual}
                      alt="Manual Icon"
                    />
                    <div className="side_info_inline">
                      {parseList(card.transmissiontype)}
                    </div>
                  </div>
                  <div className="side_info">
                    <img className="icon_image" src={ncap} alt="NCAP Icon" />
                    <div className="side_info_inline">Safety - {card.NCAP}</div>
                  </div>
                </section>
              </section>
            ))
          ) : (
            <div className="flex justify-center items-center min-w-[344px] h-[202px]">
              <Skeleton
                height={199}
                width="320px"
                baseColor="#D8D8D8"
                highlightColor="#666"
                style={{ borderRadius: "8px", marginTop: "25px" }}
              />
            </div>
          )}
        </div>

        {/* Right Arrow Button */}
        <button
          className="absolute right-8 top-1/2 -translate-y-1/2 z-10 bg-[#818181] h-[27px] w-[27px] rounded-full text-white flex justify-center items-center shadow-lg transition-all duration-200 border-none"
          onClick={handleNext}
          disabled={currentIndex === newcardData.length - 1}
        >
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
      </div>

      {/* Add custom CSS for hiding scrollbar */}
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
};

export default Cardsection;
