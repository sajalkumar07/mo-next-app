import React, { useState, useEffect, useRef, forwardRef } from "react";
import { useParams } from "react-router-dom";

const MileageCard = ({ engineName, highway, city, companyClaimed }) => (
  <>
    <div
      className="shadow-md  rounded-sm overflow-hidden flex-shrink-0 bg-white border  shadow-black/30 text-center 
                  w-[162px] h-[156px] md:w-[200px] md:h-[300px] p-4 "
    >
      <div className="flex justify-center items-center flex-col font-[Montserrat] font-medium">
        <h3 className="text-[12px] font-semibold text-[#B1081A] mb-2 text-center">
          {(() => {
            const words = engineName.trim().split(" ");
            const lastWord = words.pop();
            const mainPart = words.join(" ");
            return (
              <>
                {mainPart} <br /> {lastWord}
              </>
            );
          })()}
        </h3>
      </div>

      <div className="space-y-6 mt-3 font-[Montserrat] font-medium text-black">
        <div className="flex justify-center items-center">
          <span className="text-gray-600 hidden md:block w-1/2 text-center">
            Company Claimed
          </span>
          <span className=" w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
            {parseInt(companyClaimed)} Km/l
          </span>
        </div>
        <div className="flex justify-center items-center">
          <span className="text-gray-600 hidden md:block w-1/2 text-center md:border-none border-b border-black/30">
            City Real World
          </span>
          <span className=" w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
            {parseInt(city)} Km/l
          </span>
        </div>
        <div className="flex justify-center items-center">
          <span className="text-gray-600 hidden md:block w-1/2 text-center md:border-none border-b border-black/30">
            Highway Real World
          </span>
          <span className=" w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
            {parseInt(highway)} Km/l
          </span>
        </div>
      </div>
    </div>
  </>
);

const Mileage = forwardRef(({ brandName, carName }, ref) => {
  const [carData, setCarData] = useState([]);
  const [activeDot, setActiveDot] = useState(0);
  const scrollContainerRef = useRef(null);
  const params = useParams();
  const [singleCardData, setSingleCardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${params.id}`
        );
        const data = await response.json();
        setCarData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const scrollPosition = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const scrollWidth = container.scrollWidth;

      // Calculate which dot should be active based on scroll position
      const newActiveDot = Math.round(
        (scrollPosition / (scrollWidth - containerWidth)) *
          ((carData.variantsWithMileage?.length || 0) - 1)
      );

      setActiveDot(newActiveDot);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [carData.variantsWithMileage]);

  const scrollToSection = (index) => {
    if (!scrollContainerRef.current || !carData.variantsWithMileage) return;

    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;

    // Calculate scroll position based on dot index
    const scrollTo =
      index *
      ((scrollWidth - containerWidth) /
        (carData.variantsWithMileage.length - 1));

    container.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });

    setActiveDot(index);
  };

  return (
    <section className="py-8 px-4 " ref={ref}>
      {/* Static Header */}
      <div className="text-left sm:text-center md:text-center blocl md:flex md:justify-center md:items-center ">
        <div className="flex ">
          <span className=" text-[#818181] text-[20px]">
            {brandName || carName
              ? `${brandName ?? ""} ${carName ?? ""}`.trim()
              : singleCardData.brandname?.brandName ||
                singleCardData.carname?.carName}
          </span>
          &nbsp;
          <span className="text-[20px] text-[#B1081A]"> Mileage </span>
        </div>
      </div>
      <div className="container mx-auto flex-col">
        {/* Mobile view with sticky header and horizontal scroll */}
        <div className="md:hidden flex w-full ">
          {/* Sticky title block for mobile */}
          <div
            className="shadow-md rounded-sm overflow-hidden flex-shrink-0 bg-white border shadow-black/30 text-center
                w-[162px] h-[156px] p-4 sticky left-0 z-10 "
          >
            <div className="flex justify-center items-center flex-col font-[Montserrat] font-medium">
              <h3 className="text-[12px] font-semibold text-[#B1081A] mb-2 text-center">
                Engine &
              </h3>
              <h3 className="text-[12px] font-semibold text-[#B1081A] mb-2 text-center">
                Transmission
              </h3>
            </div>
            <div className="space-y-6 mt-3 font-[Montserrat] font-medium text-black">
              <div className="flex justify-center items-center">
                <span className="w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
                  Company Claimed
                </span>
              </div>
              <div className="flex justify-center items-center">
                <span className="w-[120px] text-center md:border-none border-b border-black/30">
                  City Real World
                </span>
              </div>
              <div className="flex justify-center items-center">
                <span className="w-[120px] text-center md:border-none border-b border-black/30">
                  Highway Real World
                </span>
              </div>
            </div>
          </div>

          {/* Scrollable container for mileage cards */}
          <div
            className="overflow-x-auto flex-1  scrollbar-hide "
            ref={scrollContainerRef}
          >
            <div className="flex space-x-4 pb-4 min-w-min pl-6 pr-6 ">
              {/* Mileage cards for mobile */}
              {carData.variantsWithMileage?.map((variant, index) => (
                <MileageCard
                  key={index}
                  engineName={variant.Engine_Name_Variant}
                  highway={variant.Highway_Real_World}
                  city={variant.City_Real_World}
                  companyClaimed={variant.Company_Claimed}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Desktop view without title block */}
        <div className="hidden md:block">
          <div className="flex justify-center">
            <div className="flex gap-4">
              {carData.variantsWithMileage?.map((variant, index) => (
                <MileageCard
                  key={index}
                  engineName={variant.Engine_Name_Variant}
                  highway={variant.Highway_Real_World}
                  city={variant.City_Real_World}
                  companyClaimed={variant.Company_Claimed}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Pagination dots for mobile */}
        {carData.variantsWithMileage?.length > 0 && (
          <div className="md:hidden flex justify-center mt-4">
            {carData.variantsWithMileage.map((_, index) => (
              <div
                key={index}
                className={`w-[8px] h-[8px] mx-1 rounded-full cursor-pointer ${
                  activeDot === index ? "bg-red-600" : "bg-gray-300"
                }`}
                onClick={() => scrollToSection(index)}
              />
            ))}
          </div>
        )}
      </div>
    </section>
  );
});

export default Mileage;
