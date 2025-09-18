import React, { useEffect, useState, useRef } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

const KeyFeaturesSection = ({ singlecardData }) => {
  const [activeFeatureCategory, setActiveFeatureCategory] = useState("keyF");
  const [currentImage, setCurrentImage] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const scrollContainerRef = useRef(null);

  const CARD_WIDTH = 254;
  const GAP = 24;

  // Add state for visible count
  const [visibleCount, setVisibleCount] = useState(1);

  // Get feature images for a category
  const getFeatureImages = (category) => {
    const images = [];

    for (let i = 1; i <= 20; i++) {
      const imageKey = `${category}${i}`;
      const textKey = `${category}${i}text`;

      if (singlecardData[imageKey] && singlecardData[textKey]) {
        images.push({
          imageKey,
          textKey,
          imageUrl: `${process.env.NEXT_PUBLIC_API}/productImages/${singlecardData[imageKey]}`,
          text: singlecardData[textKey],
          index: i - 1,
        });
      }
    }

    return images;
  };

  const features = getFeatureImages(activeFeatureCategory);

  // Calculate maxIndex and hasOverflow
  const maxIndex = Math.max(0, features.length - visibleCount);
  const hasOverflow = features.length > visibleCount;

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
  }, [features.length]);

  // Smooth scroll to specific feature card
  const scrollToCard = (index) => {
    if (scrollContainerRef.current) {
      const cardWidth = CARD_WIDTH;
      const gap = GAP;
      const scrollPosition = index * (cardWidth + gap);
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
      if (newIndex !== currentIndex && newIndex < features.length) {
        setCurrentIndex(newIndex);
      }
    }
  };

  // Open image dialog
  const handleOpenImageDialog = (imageKey, category, index) => {
    setCurrentImage({ key: imageKey, index, category });
    setDialogOpen(true);
  };

  // Close image dialog
  const handleCloseDialog = () => {
    setDialogOpen(false);
    setCurrentImage(null);
  };

  // Navigate to next/previous image in dialog
  const handleNavigateImage = (direction) => {
    if (!currentImage) return;

    const { category, index } = currentImage;
    let newIndex = direction === "next" ? index + 1 : index - 1;

    // Check if next image exists
    const nextImageKey = `${category}${newIndex + 1}`;

    if (singlecardData[nextImageKey]) {
      setCurrentImage({
        ...currentImage,
        index: newIndex,
        key: nextImageKey,
      });
    }
  };

  return (
    <div className="">
      <section className="relative z-10 px-4 py-4">
        {/* Header Section */}
        <div className="flex justify-center items-center flex-col mb-8">
          <div className="flex justify-center items-center flex-col">
            {/* Title */}
            <div className="text-center">
              <p className="text-[25px] font-bold font-sans">
                <span className="text-[#818181]">KEY</span>{" "}
                <span className="text-[#B60C19]">FEATURES</span>
              </p>
            </div>
          </div>
        </div>

        {/* Category Buttons */}
        <div className="flex md:justify-center justify-start mb-4 overflow-x-auto scrollbar-hide gap-2">
          <button
            className={`flex-shrink-0 rounded-full text-[14px] font-semibold transition-colors w-[200px] p-2 text-center h-[38px] border-[0.5px] border-gray-400 ${
              activeFeatureCategory === "keyF"
                ? "bg-[#AB373A] text-white"
                : "bg-gray-100 text-black"
            }`}
            onClick={() => {
              setActiveFeatureCategory("keyF");
              setCurrentIndex(0);
            }}
          >
            KEY FEATURES
          </button>
          <button
            className={`flex-shrink-0 rounded-full text-[14px] font-semibold transition-colors w-[200px] p-2 text-center h-[38px] border-[0.5px] border-gray-400 ${
              activeFeatureCategory === "spaceC"
                ? "bg-[#AB373A] text-white"
                : "bg-gray-100 text-black"
            }`}
            onClick={() => {
              setActiveFeatureCategory("spaceC");
              setCurrentIndex(0);
            }}
          >
            SPACE & COMFORT
          </button>
          <button
            className={`flex-shrink-0 rounded-full text-[14px] font-semibold transition-colors w-[200px] p-2 text-center h-[38px] border-[0.5px] border-gray-400 ${
              activeFeatureCategory === "storageC"
                ? "bg-[#AB373A] text-white"
                : "bg-gray-100 text-black"
            }`}
            onClick={() => {
              setActiveFeatureCategory("storageC");
              setCurrentIndex(0);
            }}
          >
            STORAGE & CONVENIENCE
          </button>
        </div>

        {hasOverflow && currentIndex > 0 && (
          <button
            className="hidden md:hidden lg:flex 2xl:flex xl:flex  absolute -left-10 top-[250px] -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handlePrevious}
            disabled={currentIndex === 0}
          >
            <ChevronLeft size={20} />
          </button>
        )}

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
          <div className="flex gap-6" style={{ minWidth: "fit-content" }}>
            {features.map((feature, index) => (
              <div
                key={feature.imageKey}
                className="w-[309px] flex-shrink-0 cursor-pointer group snap-start bg-white border rounded-xl"
                onClick={() =>
                  handleOpenImageDialog(
                    feature.imageKey,
                    activeFeatureCategory,
                    feature.index
                  )
                }
              >
                <div className="relative w-full h-40 bg-gray-200 rounded-t-xl overflow-hidden">
                  <img
                    className="w-full h-full object-cover"
                    src={feature.imageUrl}
                    alt={feature.text}
                    crossOrigin="anonymous"
                  />
                </div>
                <p className="text-[14px] font-medium p-2 text-center">
                  {feature.text}
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Right Arrow Button */}
        {hasOverflow && currentIndex < maxIndex && (
          <button
            className="hidden md:hidden lg:flex 2xl:flex xl:flex  absolute -right-10 top-[250px]  -translate-y-1/2 z-20 bg-white h-10 w-10 rounded-full shadow-md justify-center items-center border border-gray-200 hover:bg-gray-100 transition"
            onClick={handleNext}
            disabled={currentIndex === maxIndex}
          >
            <ChevronRight size={20} />
          </button>
        )}

        {/* Image Dialog */}
        {dialogOpen && currentImage && (
          <div
            className="fixed inset-0 bg-black/30 flex items-center justify-center z-50 p-4"
            onClick={handleCloseDialog}
          >
            <div
              className="bg-white rounded-lg max-w-4xl w-full overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b">
                <h3 className="text-lg font-semibold">
                  {singlecardData[`${currentImage.key}text`]}
                </h3>
                <button
                  onClick={handleCloseDialog}
                  className="text-gray-500 hover:text-gray-700"
                >
                  ✕
                </button>
              </div>
              <div className="relative p-4 flex justify-center items-center">
                <button
                  onClick={() => handleNavigateImage("prev")}
                  disabled={currentImage.index === 0}
                  className="absolute left-4 bg-gray-800 text-white p-2 rounded-full disabled:opacity-50"
                >
                  ‹
                </button>

                <img
                  src={`${process.env.NEXT_PUBLIC_API}/productImages/${
                    singlecardData[currentImage.key]
                  }`}
                  alt="Feature"
                  className="max-h-[70vh] max-w-full object-contain"
                  crossOrigin="anonymous"
                />

                <button
                  onClick={() => handleNavigateImage("next")}
                  disabled={
                    !singlecardData[
                      `${currentImage.category}${currentImage.index + 2}`
                    ]
                  }
                  className="absolute right-4 bg-gray-800 text-white p-2 rounded-full disabled:opacity-50"
                >
                  ›
                </button>
              </div>
            </div>
          </div>
        )}
      </section>
    </div>
  );
};

const KeyFeaturesSectionFull = ({ singlecardData }) => {
  return (
    <section className="">
      <KeyFeaturesSection singlecardData={singlecardData} />
    </section>
  );
};

export default KeyFeaturesSectionFull;
