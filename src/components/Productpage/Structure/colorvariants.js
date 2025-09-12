import React, { useState, useEffect, useRef, forwardRef } from "react";
import { useParams } from "react-router-dom";
import { ChevronLeft, Receipt } from "lucide-react";
import { ChevronRight } from "lucide-react";

const ColorVariants = forwardRef(({ props, brandName, carName }, ref) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [singleCardData, setSingleCardData] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const [activeDot, setActiveDot] = useState(0);
  const [totalDots, setTotalDots] = useState(0);
  const params = useParams();

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

  // Fetch data from API based on params.id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${params.id}`
        );
        const data = await response.json();
        setSingleCardData(data);
        console.log("Fetched data:", data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  const cardsSectionRef = useRef(null);

  // Calculate number of dots based on visible cards and container width
  useEffect(() => {
    const calculateDots = () => {
      if (!cardsSectionRef.current) return;

      const container = cardsSectionRef.current;
      const containerWidth = container.clientWidth;
      const cardWidth = 288 + 16; // Card width + margin (approximate)

      const visibleVariants = colorVariants.filter(
        (variant) =>
          singleCardData[variant.image] &&
          singleCardData[variant.image].trim() !== ""
      );

      const totalCards = visibleVariants.length;
      const cardsPerView = Math.floor(containerWidth / cardWidth);

      // Calculate actual number of scroll positions needed
      const calculatedDots = Math.max(1, totalCards - cardsPerView + 1);
      setTotalDots(calculatedDots);
    };

    calculateDots();
    window.addEventListener("resize", calculateDots);

    return () => window.removeEventListener("resize", calculateDots);
  }, [singleCardData]);

  // Handle next button click (scroll right)
  const handleNext = () => {
    if (cardsSectionRef.current) {
      const cardWidth = cardsSectionRef.current.children[0]?.offsetWidth || 0;
      cardsSectionRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  // Handle previous button click (scroll left)
  const handlePrevious = () => {
    if (cardsSectionRef.current) {
      const cardWidth = cardsSectionRef.current.children[0]?.offsetWidth || 0;
      cardsSectionRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    }
  };

  // Change the selected color
  const handleColorChange = (colorCode) => {
    console.log("Selected color:", colorCode);
    setSelectedColor(colorCode);
  };

  // Track scroll position and update active dot
  useEffect(() => {
    const handleScroll = () => {
      if (!cardsSectionRef.current || totalDots <= 1) return;

      const container = cardsSectionRef.current;
      const scrollPosition = container.scrollLeft;
      const maxScroll = container.scrollWidth - container.clientWidth;

      // Calculate which dot should be active
      const scrollPercentage = scrollPosition / maxScroll;
      const newActiveDot = Math.round(scrollPercentage * (totalDots - 1));

      setActiveDot(Math.max(0, Math.min(newActiveDot, totalDots - 1)));
    };

    const scrollContainer = cardsSectionRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);
      return () => scrollContainer.removeEventListener("scroll", handleScroll);
    }
  }, [totalDots]);

  // Function to scroll to a specific dot/section
  const scrollToSection = (index) => {
    if (!cardsSectionRef.current || totalDots <= 1) return;

    const container = cardsSectionRef.current;
    const maxScroll = container.scrollWidth - container.clientWidth;
    const scrollTo = (index / (totalDots - 1)) * maxScroll;

    container.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });

    setActiveDot(index);
  };

  // Filter to only include variants that have images in the data
  const visibleVariants = colorVariants.filter(
    (variant) =>
      singleCardData[variant.image] &&
      singleCardData[variant.image].trim() !== ""
  );

  // Debug: log visible variants
  useEffect(() => {
    console.log("Visible variants count:", visibleVariants.length);
    console.log("Total dots:", totalDots);
  }, [visibleVariants.length, totalDots]);

  return (
    <section className="youtube-viddeoleft d-flex flex-column" ref={ref}>
      <div className="mainsection-prodfdf ">
        <div className="flex justify-center items-center p-4 w-full">
          <div className="py-3 text-center w-[346px] gap-[20px] md:bg-none bg-[linear-gradient(to_right,_#D2D2D2,_#F3F3F3_69%,_#BEBEBE)] md:shadow-none shadow-md shadow-black/30">
            <h3 className="block md:hidden">
              {brandName || carName
                ? `${brandName ?? ""} ${carName ?? ""}`.trim()
                : singleCardData.brandname?.brandName ||
                  singleCardData.carname?.carName}
            </h3>
            <h3>COLOURS</h3>
          </div>
        </div>

        <div className="linesfkbg"></div>
        <div className="chfchfcfch">
          {/* Color filter buttons - only show colors that have images */}
          <div className="color-container d-flex">
            {visibleVariants.map((variant) => (
              <div
                key={variant.colorCode}
                className={`side-colors ${
                  selectedColor === variant.colorCode ? "selected" : ""
                }`}
                style={{ backgroundColor: variant.colorCode }}
                onClick={() => handleColorChange(variant.colorCode)}
              ></div>
            ))}
            {selectedColor && (
              <div
                className="selected-color"
                style={{
                  backgroundColor: selectedColor,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              ></div>
            )}
          </div>
        </div>
      </div>

      <section>
        <div className="container -mt-10 md:mt-0">
          <button
            className="z-10 flex justify-center items-center bg-[#818181] text-white rounded-full p-2 hidden md:block"
            onClick={handlePrevious}
          >
            <ChevronLeft />
          </button>
          <div
            className="card-bet overflow-x-scroll md:overflow-hidden mb-8 scrollbar-hide"
            ref={cardsSectionRef}
          >
            {colorVariants.map((variant, index) => {
              const imageSrc = singleCardData[variant.image];

              // Check if image exists and is not empty
              if (imageSrc && imageSrc.trim() !== "") {
                return (
                  <section key={variant.image} className="main_card_body-2">
                    <div className="bg-white shadow-md shadow-black/30 border w-[288px] h-[283px] p-4 flex justify-center flex-col items-center">
                      <div className="insidecard-image-out">
                        <img
                          className=""
                          src={`${process.env.NEXT_PUBLIC_API}/productImages/${imageSrc}`}
                          alt={
                            singleCardData[variant.name] ||
                            `Color variant ${index + 1}`
                          }
                          crossOrigin="anonymous"
                          onError={(e) => {
                            console.error(`Failed to load image: ${imageSrc}`);
                            e.target.style.display = "none";
                          }}
                        />
                      </div>
                      <p className="color-card-txt">
                        {singleCardData[variant.name] || `Color ${index + 1}`}
                      </p>
                    </div>
                  </section>
                );
              }
              return null;
            })}
          </div>
          <button
            className="z-10 flex justify-center items-center bg-[#818181] text-white rounded-full p-2 hidden md:block"
            onClick={handleNext}
          >
            <ChevronRight />
          </button>
        </div>
      </section>

      {/* Pagination dots for mobile view only */}
      {totalDots > 1 && (
        <div className="pagination flex justify-center mt-2 mb-4 md:hidden">
          {Array.from({ length: totalDots }, (_, index) => (
            <div
              key={index}
              className={`dot ${activeDot === index ? "active" : ""}`}
              onClick={() => scrollToSection(index)}
              style={{
                cursor: "pointer",
                width: "10px",
                height: "10px",
                borderRadius: "50%",
                backgroundColor: activeDot === index ? "#B91C1C" : "#ccc",
                margin: "0 5px",
                transition: "background-color 0.3s ease",
              }}
            />
          ))}
        </div>
      )}
    </section>
  );
});

export default ColorVariants;
