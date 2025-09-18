import React, { useState, forwardRef } from "react";
import { useLocation } from "react-router-dom";
import Cards from "./subcomponents/cardspop.js";
import Upcoming from "./subcomponents/upcomming";
import Newcars from "./subcomponents/newcars";
import Shotlist from "./subcomponents/shotlist";
import Tyre from "../../../Images/tyremask.png";

const Featuredcars = forwardRef((props, ref) => {
  const location = useLocation();

  // Detect POPULAR/ALTERNATE tab
  const getTabText = () => {
    if (
      location.pathname.startsWith("/product") ||
      location.pathname.startsWith("/variant") ||
      location.pathname.startsWith("/pricebreakup") ||
      location.pathname.startsWith("/EMI-Calculator")
    ) {
      return "ALTERNATE";
    }
    return "POPULAR";
  };

  const currentPopularText = getTabText();
  const [activeTab, setActiveTab] = useState(currentPopularText);

  const handleTabClick = (tabName) => {
    if (tabName === "POPULAR") {
      setActiveTab(currentPopularText);
    } else {
      setActiveTab(tabName);
    }
  };

  return (
    <div className="relative w-full  overflow-hidden">
      <div className="flex justify-center items-center w-full px-3 bg-[#f5f5f5]">
        <div className="relative w-full max-w-[1400px]" ref={ref}>
          {/* Background for mobile */}
          <div
            className="absolute inset-0 block md:hidden"
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

          <section className="" id="featuredCars" ref={ref}>
            {/* Heading */}
            <h2 className="text-[25px] font-bold text-center mb-6 font-sans mt-3">
              <span className="text-[#818181]">FEATURED</span>{" "}
              <span className="text-[#B60C19]">CARS</span>
            </h2>

            {/* Desktop Tabs */}
            <div className="hidden md:flex justify-center gap-4 mb-6">
              <button
                onClick={() => handleTabClick("POPULAR")}
                className={`px-5 py-2 rounded-md text-sm md:text-base font-medium transition-all duration-300
                ${
                  activeTab === currentPopularText
                    ? "bg-black text-white"
                    : "border border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                {currentPopularText}
              </button>
              <button
                onClick={() => setActiveTab("NEW")}
                className={`px-5 py-2 rounded-md text-sm md:text-base font-medium transition-all duration-300
                ${
                  activeTab === "NEW"
                    ? "bg-black text-white"
                    : "border border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                NEW
              </button>
              <button
                onClick={() => setActiveTab("SAVED CARS")}
                className={`px-5 py-2 rounded-md text-sm md:text-base font-medium transition-all duration-300
                ${
                  activeTab === "SAVED CARS"
                    ? "bg-black text-white"
                    : "border border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                SAVED CARS
              </button>
            </div>

            {/* Mobile Tabs */}
            <div className="flex md:hidden justify-center w-full mb-6 gap-2">
              <button
                onClick={() => handleTabClick("POPULAR")}
                className={`flex-1 py-2 rounded-md text-xs font-medium transition-all duration-300
                ${
                  activeTab === currentPopularText
                    ? "bg-black text-white"
                    : "border border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                {currentPopularText}
              </button>
              <button
                onClick={() => setActiveTab("NEW")}
                className={`flex-1 py-2 rounded-md text-xs font-medium transition-all duration-300
                ${
                  activeTab === "NEW"
                    ? "bg-black text-white"
                    : "border border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                NEW
              </button>
              <button
                onClick={() => setActiveTab("SAVED CARS")}
                className={`flex-1 py-2 rounded-md text-xs font-medium transition-all duration-300
                ${
                  activeTab === "SAVED CARS"
                    ? "bg-black text-white"
                    : "border border-black text-black hover:bg-black hover:text-white"
                }`}
              >
                SAVED CARS
              </button>
            </div>

            {/* Render tabs content */}
            {(activeTab === "POPULAR" || activeTab === "ALTERNATE") && (
              <Cards />
            )}
            {activeTab === "NEW" && <Newcars />}
            {activeTab === "SAVED CARS" && <Shotlist />}
          </section>
        </div>
      </div>
    </div>
  );
});

export default Featuredcars;
