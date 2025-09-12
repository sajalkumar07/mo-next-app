import React, { useState, useEffect, useRef, forwardRef } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import Review from "./share-reviews.js";
import SlidingPagination from "../../Homepage/slidingPagination.js"; // Import the reusable component

const ReviewsProd = forwardRef((props, ref) => {
  const { id } = useParams(); // Get the ID from URL params
  const [reviews, setReviews] = useState([]);
  const [activeDot, setActiveDot] = useState(0);
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    // Fetch reviews data from API
    const fetchReviews = async () => {
      try {
        const response = await axios.get(
          `${process.env.NEXT_PUBLIC_API}/api/v1/tern/get-review/${id}`
        );
        setReviews(response.data.data); // Assuming the reviews are inside the 'data' key
      } catch (error) {
        console.error("Error fetching reviews:", error);
      }
    };

    fetchReviews();
  }, [id]); // Dependency array ensures the effect runs when the ID changes

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const scrollPosition = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const scrollWidth = container.scrollWidth;

      // Calculate which dot should be active based on scroll position
      const newActiveDot = Math.round(
        (scrollPosition / (scrollWidth - containerWidth)) * (reviews.length - 1)
      );

      const clampedActiveDot = Math.max(
        0,
        Math.min(newActiveDot, reviews.length - 1)
      );
      setActiveDot(clampedActiveDot);

      // Check if we've reached the end and rollback to first
      const tolerance = 5; // Small tolerance for floating point precision
      if (scrollPosition + containerWidth >= scrollWidth - tolerance) {
        setTimeout(() => {
          container.scrollTo({
            left: 0,
            behavior: "smooth",
          });
        }, 1000); // 1 second delay before rolling back
      }
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [reviews.length]);

  const scrollToSection = (index) => {
    if (!scrollContainerRef.current || reviews.length <= 1) return;

    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;

    // Calculate scroll position based on dot index
    const scrollTo =
      index * ((scrollWidth - containerWidth) / (reviews.length - 1));

    container.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });

    setActiveDot(index);
  };

  return (
    <div
      className="block md:flex justify-center flex-col items-center w-full"
      ref={ref}
    >
      <div className="label d-flex ">
        <p className="varienttxt mt-3 lefttext-mob ">
          <span className="text-wrapper">OWNER'S</span>
          <span className="span">&nbsp;</span>
          <span className="text-wrapper-2">REVIEWS</span>
        </p>
      </div>

      {/* Reviews section with proper mobile scrolling */}
      <div className="w-full relative">
        <div
          ref={scrollContainerRef}
          className="w-full md:justify-center items-center overflow-x-auto scrollbar-hide flex pb-4"
          style={{
            scrollSnapType: "x mandatory",
            WebkitOverflowScrolling: "touch",
            msOverflowStyle: "none" /* IE and Edge */,
            scrollbarWidth: "none" /* Firefox */,
          }}
        >
          <div className="flex gap-8 px-4 md:px-8">
            {reviews.map((review, index) => (
              <div
                key={index}
                className="flex flex-col bg-white border shadow-md shadow-black/30 py-4 px-4 flex-shrink-0 flex-1 space-y-4 h-[280px] w-[309px] overflow-hidden"
                style={{
                  scrollSnapAlign: "center",
                }}
              >
                <div className="d-flex justify-content-between">
                  <span className="whythiscard">Why This Car</span>
                  <span className="reviewssf">
                    {review.ratingOfCar}
                    <svg
                      width="12"
                      height="8"
                      viewBox="0 0 12 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        d="M3.11811 7.14376C2.85419 7.23557 2.55472 7.07468 2.60805 6.86927L3.17554 4.67609L0.766778 3.12C0.541832 2.9744 0.658749 2.70825 0.960272 2.67951L4.30915 2.35679L5.80241 0.350469C5.9371 0.169635 6.30153 0.169635 6.43622 0.350469L7.92948 2.35679L11.2784 2.67951C11.5799 2.70825 11.6968 2.9744 11.4712 3.12L9.06309 4.67609L9.63058 6.86927C9.68391 7.07468 9.38444 7.23557 9.12052 7.14376L6.11829 6.09771L3.11811 7.14376Z"
                        fill="#FCFCFC"
                      />
                    </svg>
                  </span>
                </div>
                <div className="whyytyyt">"{review.whyThisCar}"</div>
                {/*this part you need fix this user name and avatar part*/}
                <div className="flex justify-start items-center gap-3 mt-auto pt-4">
                  <img
                    className="main_card_review"
                    src={
                      review.imageOfCar ||
                      "https://img.freepik.com/premium-vector/user-profile-icon-vector-image-can-be-used-gaming-ecommerce_120816-406884.jpg?w=826"
                    }
                    alt={review.brand?.name || "User"}
                  />
                  <div className="flex flex-col">
                    <span className="costamanmae">{review.customerName}</span>
                    <span className="socciery">Facebook</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Use the reusable SlidingPagination component */}
      <SlidingPagination
        totalItems={reviews.length}
        activeDot={activeDot}
        onDotClick={scrollToSection}
        maxDots={5} // You can customize this or make it a prop
        showPagination={true}
      />

      <div className="flex justify-center items-center p-4">
        <div className="p-4 rounded-lg flex justify-center items-center">
          <Review />
        </div>
      </div>

      {/* Additional style for hiding scrollbar */}
      <style jsx>{`
        /* Hide scrollbar for Chrome, Safari and Opera */
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </div>
  );
});

export default ReviewsProd;
