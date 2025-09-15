import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import seater from "../Images/icons/seat.png";
import petrol from "../Images/icons/gas.png";
import manual from "../Images/icons/machin.png";
import ncap from "../Images/icons/privi.png";
import Skeleton from "react-loading-skeleton";
import {
  Bookmark,
  ChevronLeft,
  ChevronRight,
  Users,
  Fuel,
  Settings,
  Star,
} from "lucide-react";

const Cardsection = ({ newcardData, rtoData, onCardClick }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const savedBookmarks = localStorage.getItem("bookmarks");
    try {
      return savedBookmarks ? JSON.parse(savedBookmarks) : [];
    } catch {
      return [];
    }
  });

  const [visibleCount, setVisibleCount] = useState(1);
  const [showLeftButton, setShowLeftButton] = useState(false);
  const [showRightButton, setShowRightButton] = useState(false);
  const slotRef = useRef(344); // card width + gap

  const measure = () => {
    const el = scrollContainerRef.current;
    if (!el || !newcardData.length) return;

    const card = el.querySelector("[data-card]");
    const track = el.firstElementChild;
    const cardW = card ? card.getBoundingClientRect().width : 320;

    let gap = 0;
    if (track) {
      const style = getComputedStyle(track);
      gap = parseFloat(style.gap || style.columnGap || "0") || 0;
    }

    const slot = cardW + gap;
    slotRef.current = slot;

    const count = Math.max(1, Math.floor((el.clientWidth + gap) / slot));
    setVisibleCount(count);

    // Update button visibility
    setShowLeftButton(currentIndex > 0);
    setShowRightButton(currentIndex < newcardData.length - count);
  };

  useEffect(() => {
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [newcardData, currentIndex]);

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

  const handleCardInteraction = (e) => {
    if (!e.target.closest('svg[aria-label="Unsave"], svg[aria-label="Save"]')) {
      onCardClick();
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1;
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
      setShowLeftButton(newIndex > 0);
      setShowRightButton(true);
    }
  };

  const handleNext = () => {
    const maxIndex = Math.max(0, newcardData.length - visibleCount);
    if (currentIndex < maxIndex) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
      setShowLeftButton(true);
      setShowRightButton(newIndex < maxIndex);
    }
  };

  // Handle scroll events to update current index
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = 344;
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
      return `${(numValue / 1e7).toFixed(2)} Crore`;
    } else if (numValue >= 1e5) {
      return `${(numValue / 1e5).toFixed(2)} Lakhs`;
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

  return (
    <div className="relative z-10 max-w-[1400px] mx-auto px-4">
      {/* Cards Container */}
      {showLeftButton && (
        <button
          className="hidden md:flex absolute -left-10 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
          onClick={handlePrevious}
          aria-label="Previous"
        >
          <ChevronLeft size={20} />
        </button>
      )}

      <div className="relative">
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
          {newcardData.length > 0 ? (
            newcardData.map((card, index) => (
              <div
                key={`${card._id}-${index}`}
                className="flex-shrink-0 w-[320px] snap-start"
              >
                <div className="bg-white rounded-xl border border-gray-200 shadow-sm overflow-hidden transition-all duration-300 hover:shadow-md">
                  <div className="bg-gray-200">
                    {/* Card Header with Bookmark */}
                    <div className="flex justify-between items-start p-4 pb-2">
                      <button
                        onClick={(e) => toggleBookmark(card._id, e)}
                        className="text-gray-400 hover:text-red-500 transition-colors"
                      >
                        {isBookmarked(card._id) ? (
                          <Bookmark className="h-6 w-6 text-red-500 fill-[#AB373A]" />
                        ) : (
                          <Bookmark className="h-6 w-6 text-gray-500" />
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

                    {/* Car Image */}
                    <Link
                      to={`/product/${card.carname.replace(/\s+/g, "-")}/${
                        card._id
                      }`}
                      onClick={handleCardInteraction}
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

                  {/* Car Info */}
                  <div className="p-4 pt-2">
                    <div className="mb-3">
                      <div className="text-[#AB373A] text-[18px] font-bold">
                        {card.brand} {card.carname}
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      {/* Specifications */}
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
                            ₹{formatCurrency(card.onRoadPrice)}
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
      </div>

      {showRightButton && (
        <button
          className="hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
          onClick={handleNext}
          aria-label="Next"
        >
          <ChevronRight size={20} />
        </button>
      )}
    </div>
  );
};

export default Cardsection;
