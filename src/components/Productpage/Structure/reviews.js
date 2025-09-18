import React, { useState, useEffect, useRef, forwardRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Review from "./share-reviews.js";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";

const ReviewsProd = forwardRef(({ brandName, carName }, ref) => {
  const { id } = useParams();
  const [reviews, setReviews] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [singleCardData, setSingleCardData] = useState({});
  const scrollContainerRef = useRef(null);

  // Card dimensions and spacing
  const CARD_WIDTH = 309;
  const GAP = 32;

  // Calculate visible cards based on container width
  const [visibleCount, setVisibleCount] = useState(1);
  const maxIndex = Math.max(0, reviews.length - visibleCount);
  const hasOverflow = reviews.length > visibleCount;

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${id}`
        );
        const data = await response.json();
        setSingleCardData(data);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/v1/tern/get-review/${id}`
        );
        setReviews(response.data.data);
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [id]);

  // Calculate display name
  const displayName =
    brandName || carName
      ? `${"" ?? ""} ${carName ?? ""}`.trim()
      : `${singleCardData.brandname?.brandName || ""} ${
          singleCardData.carname?.carName || ""
        }`.trim();

  // Calculate visible cards based on container width
  useEffect(() => {
    const measure = () => {
      const el = scrollContainerRef.current;
      if (!el) return;
      const slot = CARD_WIDTH + GAP;
      const count = Math.max(1, Math.floor((el.clientWidth + GAP) / slot));
      setVisibleCount(count);
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, [reviews.length]);

  // Smooth scroll to specific review card
  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const scrollPosition = index * (CARD_WIDTH + GAP);
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
    if (currentIndex < reviews.length - 1) {
      const newIndex = currentIndex + 1;
      setCurrentIndex(newIndex);
      scrollToCard(newIndex);
    }
  };

  // Handle scroll events to update current index
  const handleScroll = () => {
    if (scrollContainerRef.current) {
      const scrollLeft = scrollContainerRef.current.scrollLeft;
      const cardWidth = CARD_WIDTH + GAP;
      const newIndex = Math.round(scrollLeft / cardWidth);
      if (newIndex !== currentIndex && newIndex < reviews.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  return (
    <div className="mt-10 font-sans" ref={ref}>
      <section className="relative z-10 max-w-[1400px] mx-auto px-3">
        {/* Header Section */}
        <div className="flex justify-center items-center flex-col mb-8">
          <div className="flex justify-center items-center flex-col">
            {/* Title */}
            <div className="text-center">
              <p className="text-[25px] font-bold font-sans">
                <span className="text-[#818181] uppercase">{displayName}</span>{" "}
                <span className="text-[#818181]">OWNER'S</span>{" "}
                <span className="text-[#B60C19]">REVIEWS</span>
              </p>
            </div>
          </div>
        </div>

        {/* Left Arrow Button */}
        {hasOverflow && currentIndex > 0 && (
          <button
            className="hidden md:hidden lg:flex 2xl:flex xl:flex absolute -left-10 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Horizontal Scrollable Reviews Container */}
        <div
          ref={scrollContainerRef}
          className="overflow-x-auto scrollbar-hide scroll-smooth snap-x snap-mandatory px-8"
          style={{
            scrollBehavior: "smooth",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none",
            scrollbarWidth: "none",
          }}
          onScroll={handleScroll}
        >
          <div className="flex gap-8" style={{ minWidth: "fit-content" }}>
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex flex-col bg-white border border-gray-200 py-4 px-4 flex-shrink-0 2xl:w-[310px] lg:w-[310px] xl:w-[310px]  md:w-[352px] w-[320px] overflow-hidden rounded-xl"
                style={{
                  scrollSnapAlign: "center",
                }}
              >
                {/* Review Title and Rating */}
                <div className="flex justify-between flex-col ">
                  <div className="flex justify-start items-center gap-3">
                    <img
                      className="w-10 h-10 rounded-full object-cover"
                      src={
                        review.imageOfCar ||
                        "https://img.freepik.com/premium-vector/user-profile-icon-vector-image-can-be-used-gaming-ecommerce_120816-406884.jpg?w=826"
                      }
                      alt={review.brand?.name || "User"}
                    />
                    <div className="flex flex-col">
                      <span className="text-sm font-medium">
                        {review.customerName || "Rajesh Kumar"}
                      </span>
                    </div>
                  </div>
                  <div className="mt-auto pt-4">
                    <div className="flex items-center">
                      <span className="text-[15px] font-medium mr-1">
                        {review.ratingOfCar}
                      </span>
                      <span className="">
                        <Star size={15} color="orange" fill="orange" />
                      </span>
                    </div>
                  </div>

                  {/* Review Content */}
                  <div className="text-sm mt-2 flex-1 overflow-hidden">
                    "
                    {review.whyThisCar ||
                      "Great mileage and comfortable ride. Perfect for city driving."}
                    "
                  </div>

                  {/* Reviewer Info with Checkbox and Facebook */}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        {hasOverflow && currentIndex < maxIndex && (
          <button
            className="hidden md:hidden lg:flex 2xl:flex xl:flex  absolute -right-10 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handleNext}
            disabled={currentIndex === reviews.length - 1}
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Add Review Button */}
        <div className="flex justify-center items-center p-4 mt-4">
          <div className="p-4 rounded-lg flex justify-center items-center">
            <Review />
          </div>
        </div>
      </section>
    </div>
  );
});

ReviewsProd.displayName = "ReviewsProd";

export default ReviewsProd;
