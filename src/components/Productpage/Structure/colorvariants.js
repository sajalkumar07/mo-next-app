import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";

const ColorVariants = ({ props, brandName, carName }) => {
  const [colors, setColors] = useState([]);
  const [selectedColor, setSelectedColor] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);
  const [singleCardData, setSingleCardData] = useState([]);
  const params = useParams();

  // Use the same dimensions as KeyFeaturesSection
  const CARD_WIDTH = 254; // Changed from 323 to match KeyFeatures
  const GAP = 24; // Changed from 24 to match KeyFeatures

  // Add state for visible count
  const [visibleCount, setVisibleCount] = useState(1);

  // Updated colorVariants array to match API response structure
  const colorVariants = [
    { image: "heroimage", name: "heroimagename" },
    { image: "grayimage", name: "grayname" },
    { image: "redimage", name: "redname" },
    { image: "blueimage", name: "blueimagename" },
    { image: "blackimage", name: "blackimagename" },
    { image: "greenimage", name: "greenimagename" },
    { image: "brownimage", name: "brownimagename" },
    { image: "yellowimage", name: "yellowimagename" },
    { image: "purpleimage", name: "purpleimagename" },
    { image: "whiteimage", name: "whitename" },
    { image: "creamimage", name: "creamimagename" },
  ];

  // Calculate maxIndex and hasOverflow
  const maxIndex = Math.max(0, colors.length - visibleCount);
  const hasOverflow = colors.length > visibleCount;

  // Add resize effect to calculate visible cards
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
  }, [colors.length]);

  // Fetch data from API based on params.id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${params.id}`
        );
        const data = await response.json();
        setSingleCardData(data);

        // Filter and set colors based on available data
        const availableColors = colorVariants
          .filter(
            (variant) =>
              data[variant.image] && data[variant.image].trim() !== ""
          )
          .map((variant, index) => ({
            ...variant,
            id: index,
            title: data[variant.name] || `Color ${index + 1}`,
            thumbnail: [
              {
                url: `${process.env.NEXT_PUBLIC_API}/productImages/${
                  data[variant.image]
                }`,
              },
            ],
            colorImage: data[variant.image],
            colorName: data[variant.name],
          }));

        setColors(availableColors.slice(0, 10));
        console.log("Fetched data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  const openColor = (color) => {
    setSelectedColor(color);
  };

  const closeColor = () => setSelectedColor(null);

  // Smooth scroll to specific color card
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
    if (currentIndex < maxIndex) {
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
      if (newIndex !== currentIndex && newIndex < colors.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  return (
    <div className="bg-[#f5f5f5] font-sans mt-20 px-4">
      <section className="relative z-10 max-w-[1400px] mx-auto px-4 py-4">
        {/* Header Section */}
        <div className="flex justify-center items-center flex-col mb-8">
          <div className="flex justify-center items-center flex-col">
            {/* Title */}
            <div className="text-center md:text-left">
              <p className="text-[25px] font-bold font-sans">
                <span className="text-[#818181] uppercase">
                  {brandName || carName
                    ? `${"" ?? ""} ${carName ?? ""}`.trim()
                    : singleCardData.brandname?.brandName ||
                      singleCardData.carname?.carName ||
                      "VIEW ALL COLORS"}
                </span>{" "}
                <span className="text-[#B60C19]">COLORS</span>
                <div className="text-[20px] text-[#B60C19]"></div>
              </p>
            </div>
          </div>
        </div>

        {/* Left Arrow Button */}
        {hasOverflow && currentIndex > 0 && (
          <button
            className="hidden md:hidden lg:flex 2xl:flex xl:flex  absolute -left-10 top-[250px] -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>
        )}

        {/* Horizontal Scrollable Color Cards Container */}
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
            {colors.map((color, index) => (
              <div
                key={index}
                className="w-[320px] flex-shrink-0 cursor-pointer group snap-start bg-white border rounded-xl" // Changed width to 254px
                onClick={() => openColor(color)}
              >
                {/* Color Image */}
                <div className="relative w-full h-40 bg-gray-200 rounded-t-xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={color.thumbnail[0]?.url}
                    alt={color.title}
                    crossOrigin="anonymous"
                    onError={(e) => {
                      console.error(
                        `Failed to load image: ${color.colorImage}`
                      );
                      e.target.style.display = "none";
                    }}
                  />
                </div>

                {/* Color Info */}
                <p className="text-[14px] font-medium p-2 text-center">
                  {color.title}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        {hasOverflow && currentIndex < maxIndex && (
          <button
            className="hidden md:hidden lg:flex 2xl:flex xl:flex  absolute -right-10 top-[250px] -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Modal for Selected Color */}
        {selectedColor && (
          <div
            className="fixed inset-0 bg-black/40 flex items-center justify-center z-50 p-4"
            onClick={closeColor}
          >
            <div
              className="relative bg-white rounded-lg max-w-4xl w-full max-h-[90vh] p-8"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="">
                <img
                  className="w-full h-full rounded-lg object-cover"
                  src={selectedColor.thumbnail[0]?.url}
                  alt={selectedColor.title}
                  crossOrigin="anonymous"
                />
              </div>

              <div className="mt-4">
                <h3 className="text-xl font-bold text-gray-800">
                  {selectedColor.title}
                </h3>
                <p className="text-gray-600 mt-2">
                  {brandName || carName
                    ? `${brandName ?? ""} ${carName ?? ""}`.trim()
                    : singleCardData.brandname?.brandName ||
                      singleCardData.carname?.carName}{" "}
                  - {selectedColor.title}
                </p>
              </div>

              <button
                className="absolute -top-2 -right-2 bg-[#B60C19] hover:bg-red-700 text-white rounded-full w-10 h-10 flex items-center justify-center text-sm font-bold transition-colors"
                onClick={closeColor}
              >
                ×
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

const ColorVariantsFull = () => {
  return (
    <section className="relative w-full mb-[50px] overflow-hidden">
      <ColorVariants />
    </section>
  );
};

export default ColorVariants;
