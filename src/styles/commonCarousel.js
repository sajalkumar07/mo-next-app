import React, { useState, useEffect, useRef } from "react";

const Carousel = ({
  children,
  itemsToShow = 1,
  autoPlay = false,
  autoPlayInterval = 3000,
  showArrows = true,
  showDots = true,
  className = "",
}) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [length, setLength] = useState(children.length);
  const [touchPosition, setTouchPosition] = useState(null);
  const carouselRef = useRef(null);

  // Update length when children change
  useEffect(() => {
    setLength(children.length);
  }, [children]);

  // Auto-play functionality
  useEffect(() => {
    if (!autoPlay) return;

    const interval = setInterval(() => {
      next();
    }, autoPlayInterval);

    return () => clearInterval(interval);
  }, [autoPlay, autoPlayInterval, currentIndex, length]);

  const next = () => {
    if (currentIndex < length - itemsToShow) {
      setCurrentIndex((prevState) => prevState + 1);
    } else {
      setCurrentIndex(0); // Loop back to start
    }
  };

  const prev = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevState) => prevState - 1);
    } else {
      setCurrentIndex(length - itemsToShow); // Loop to end
    }
  };

  const goToIndex = (index) => {
    if (index >= 0 && index <= length - itemsToShow) {
      setCurrentIndex(index);
    }
  };

  const handleTouchStart = (e) => {
    const touchDown = e.touches[0].clientX;
    setTouchPosition(touchDown);
  };

  const handleTouchMove = (e) => {
    const touchDown = touchPosition;

    if (touchDown === null) {
      return;
    }

    const currentTouch = e.touches[0].clientX;
    const diff = touchDown - currentTouch;

    if (diff > 5) {
      next();
    }

    if (diff < -5) {
      prev();
    }

    setTouchPosition(null);
  };

  // Calculate the transform value for the carousel content
  const getTransformValue = () => {
    if (carouselRef.current) {
      const itemWidth = carouselRef.current.offsetWidth / itemsToShow;
      return currentIndex * itemWidth;
    }
    return 0;
  };

  return (
    <div className={`carousel-container relative ${className}`}>
      <div className="carousel-wrapper overflow-hidden" ref={carouselRef}>
        <div
          className="carousel-content-wrapper overflow-hidden"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
        >
          <div
            className="carousel-content flex transition-transform duration-300 ease-in-out"
            style={{
              transform: `translateX(-${getTransformValue()}px)`,
              width: `${(100 / itemsToShow) * children.length}%`,
            }}
          >
            {React.Children.map(children, (child, index) => (
              <div
                className="carousel-item"
                style={{ width: `${(100 / children.length) * itemsToShow}%` }}
                key={index}
              >
                {child}
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Navigation arrows */}
      {showArrows && length > itemsToShow && (
        <>
          <button
            onClick={prev}
            className="carousel-left-arrow absolute left-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
            aria-label="Previous slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M15 19l-7-7 7-7"
              />
            </svg>
          </button>
          <button
            onClick={next}
            className="carousel-right-arrow absolute right-2 top-1/2 transform -translate-y-1/2 bg-white rounded-full p-2 shadow-md hover:bg-gray-100 focus:outline-none"
            aria-label="Next slide"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 5l7 7-7 7"
              />
            </svg>
          </button>
        </>
      )}

      {/* Indicator dots */}
      {showDots && length > itemsToShow && (
        <div className="carousel-dots flex justify-center mt-4 space-x-2">
          {Array.from({ length: length - itemsToShow + 1 }).map((_, index) => (
            <button
              key={index}
              onClick={() => goToIndex(index)}
              className={`w-3 h-3 rounded-full ${
                index === currentIndex ? "bg-blue-600" : "bg-gray-300"
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Carousel;
