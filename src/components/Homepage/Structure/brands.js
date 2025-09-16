import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Tyre from "../../../Images/tyremask.png";
import { ChevronRight } from "lucide-react";
import { ChevronLeft } from "lucide-react";

const baseUrl = process.env.NEXT_PUBLIC_API;

const Brands = () => {
  const [brandsData, setBrandsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/api/brands`)
      .then((response) => response.json())
      .then((data) => {
        setBrandsData(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setBrandsData([]);
        setIsLoading(false);
      });
  }, []);

  return (
    <section>
      <LogosSection data={brandsData} isLoading={isLoading} />
    </section>
  );
};

const LogosSection = ({ data, isLoading }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const itemsPerRow = { mobile: 2, tablet: 4, desktop: 9 }; // Items per row for different screens
  const maxRows = 2; // Maximum number of rows to show initially
  const maxVisibleItems = itemsPerRow.desktop * maxRows; // Maximum items visible initially

  const handleNext = () => {
    const maxIndex = Math.max(0, data.length - itemsPerRow.desktop);
    setCurrentIndex((prev) => Math.min(prev + itemsPerRow.desktop, maxIndex));
  };

  const handlePrevious = () => {
    setCurrentIndex((prev) => Math.max(prev - itemsPerRow.desktop, 0));
  };

  const [visibleCount, setVisibleCount] = useState(9); // Default to desktop items

  // Calculate maxIndex and hasOverflow
  const maxIndex = Math.max(0, data.length - visibleCount);
  const hasOverflow = data.length > visibleCount;

  // Add resize effect to calculate visible brands
  useEffect(() => {
    const measure = () => {
      if (window.innerWidth >= 1280) {
        // xl screen
        setVisibleCount(9);
      } else if (window.innerWidth >= 768) {
        // md screen
        setVisibleCount(4);
      } else {
        // mobile
        setVisibleCount(2);
      }
    };

    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  if (isLoading) {
    return (
      <div className="w-full py-8">
        <div className="flex justify-center items-center mb-8">
          <p className="text-[25px] font-bold">
            <span className="text-[#818181]">BROWSE BY</span>
            <span className="text-[#B60C19]"> BRANDS</span>
          </p>
        </div>
        <div className="hidden md:grid grid-cols-9 gap-4 max-w-6xl mx-auto px-4">
          {[...Array(9)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
        <div className="md:hidden grid grid-cols-2 gap-4 px-4">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="flex flex-col items-center">
              <div className="w-20 h-20 bg-gray-200 rounded-lg animate-pulse mb-2"></div>
              <div className="w-16 h-4 bg-gray-200 rounded animate-pulse"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (data.length === 0) {
    return <div className="text-center py-8">No brands available.</div>;
  }

  return (
    <div className="relative w-full mb-[50px] overflow-hidden">
      {/* Background Image */}
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

      {/* Header */}
      <div className="relative z-10 flex justify-center items-center mb-8">
        <p className="text-[25px] font-bold font-sans ">
          <span className="text-[#818181]">BROWSE BY</span>
          <span className="text-[#B60C19]"> BRANDS</span>
        </p>
      </div>

      {/* Desktop Layout */}
      <div className="relative z-10 max-w-[1400px] mx-auto px-4 xl:block hidden">
        <div className="max-w-8xl mx-auto px-4 ">
          <div className="flex items-center justify-center">
            {/* Previous Button */}
            {hasOverflow && currentIndex > 0 && (
              <button
                className="hidden md:flex absolute -left-10 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
                onClick={handlePrevious}
                disabled={currentIndex === 0}
              >
                <ChevronLeft />
              </button>
            )}

            {/* Brands Grid */}
            <div className="grid grid-cols-9 gap-4 flex-1">
              {data
                .slice(currentIndex, currentIndex + itemsPerRow.desktop)
                .map((brand) => (
                  <Link
                    key={brand._id}
                    to={`/brand/${brand.name}/${brand._id}`}
                    className="flex flex-col items-center group"
                  >
                    <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center group-hover:border-blue-300 mb-2">
                      <img
                        src={`${baseUrl}/brandImages/${brand.image}`}
                        alt={brand.name}
                        crossOrigin="anonymous"
                        className="w-14 h-14 object-contain"
                      />
                    </div>
                    <span className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors duration-200">
                      {brand.name}
                    </span>
                  </Link>
                ))}
            </div>

            {/* Next Button */}
            {hasOverflow && currentIndex < maxIndex && (
              <button
                className="hidden md:flex absolute -right-10 top-1/2 -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
                onClick={handleNext}
                disabled={currentIndex >= data.length - itemsPerRow.desktop}
              >
                <ChevronRight />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Mobile/Tablet Layout */}
      <div className="xl:hidden relative z-10">
        <div className="px-4">
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
            {data
              .slice(0, showAll ? data.length : maxVisibleItems)
              .map((brand) => (
                <Link
                  key={brand._id}
                  to={`/brand/${brand.name}/${brand._id}`}
                  className="flex flex-col items-center group"
                >
                  <div className="w-20 h-20 bg-white border border-gray-200 rounded-lg shadow-sm hover:shadow-md transition-shadow duration-200 flex items-center justify-center group-hover:border-blue-300 mb-2">
                    <img
                      src={`${baseUrl}/brandImages/${brand.image}`}
                      alt={brand.name}
                      crossOrigin="anonymous"
                      className="w-14 h-14 object-contain"
                    />
                  </div>
                  <span className="text-sm font-medium text-gray-700 text-center group-hover:text-blue-600 transition-colors duration-200">
                    {brand.name}
                  </span>
                </Link>
              ))}
          </div>

          {/* Show More/Less Button */}
          {data.length > maxVisibleItems && (
            <div className="flex justify-center mt-6">
              <button
                className="px-6 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setShowAll(!showAll)}
              >
                {showAll ? "SHOW LESS" : "SHOW MORE"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Brands;
