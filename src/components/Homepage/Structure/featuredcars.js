import React, { useState, forwardRef } from "react";
import { useLocation } from "react-router-dom"; // Add this import
import Cards from "./subcomponents/cardspop.js";
import Upcoming from "./subcomponents/upcomming";
import Newcars from "./subcomponents/newcars";
import Shotlist from "./subcomponents/shotlist";
import Tyre from "../../../Images/tyremask.png";

const Featuredcars = forwardRef((props, ref) => {
  // Get current location/route
  const location = useLocation();

  // Determine the text based on current route
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

  // State to track the active tab - initialize with the current popular text
  const [activeTab, setActiveTab] = useState(currentPopularText);

  // Update the active tab state when switching between POPULAR/ALTERNATE
  const handleTabClick = (tabName) => {
    if (tabName === "POPULAR") {
      setActiveTab(currentPopularText);
    } else {
      setActiveTab(tabName);
    }
  };

  return (
    <>
      {/* Add CSS for tablet-only padding */}
      <style jsx>{`
        @media only screen and (min-width: 768px) and (max-width: 1024px) {
          .tablet-only-padding {
            padding-bottom: 10px;
            height: 400px;
          }
        }
      `}</style>

      <div className="flex justify-center items-center w-full py-8 bg-[#e5e5e5] tablet-only-padding">
        <div className="relative w-full max-w-[1500px] " ref={ref}>
          {" "}
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
          <section
            className=" mt-2 res_back"
            style={{ marginTop: "130px", position: "relative", zIndex: 10 }}
            id="featuredCars"
            ref={ref}
          >
            <div className="label">
              <p className=" block md:flex justify-center items-center text-[25px] font-bold  ml-[20px] mb-2 ">
                <span className="text-wrapper">FEATURED</span>
                <span className="span">&nbsp;</span>
                <span className="text-wrapper-2">CARS</span>
              </p>
            </div>

            {/* Desktop Tabs */}
            <ul className="search_tabs onlydesptop">
              <div
                className={`full_tabs ${
                  activeTab === currentPopularText ? "active" : ""
                }`}
                onClick={() => handleTabClick("POPULAR")}
              >
                <li>{currentPopularText}</li>
              </div>
              <div
                className={`full_tabs ${activeTab === "NEW" ? "active" : ""}`}
                onClick={() => setActiveTab("NEW")}
              >
                <li>NEW</li>
              </div>
              <div
                className={`full_tabs ${
                  activeTab === "SAVED CARS" ? "active" : ""
                }`}
                onClick={() => setActiveTab("SAVED CARS")}
              >
                <li>SAVED CARS</li>
              </div>
            </ul>

            {/* Mobile Tabs */}
            <div className="onlyphoneme  lefttext-mob">
              <div className="d-flex align-items-center w-100">
                <div
                  className="model-first-shape w-100"
                  style={{
                    clipPath:
                      "polygon(0% 0%, 100% 0px, 87% 94%, 93% 100%, 0% 100%)",
                  }}
                  onClick={() => handleTabClick("POPULAR")}
                >
                  <span
                    className="text-inside-shape3-nerew"
                    style={{
                      fontFamily: "Montserrat",
                      color: activeTab === currentPopularText ? "black" : "",
                    }}
                  >
                    {currentPopularText}
                  </span>
                </div>
                <div
                  className="model-second-shape w-100"
                  style={{
                    clipPath:
                      "polygon(13% 0px, 100% 0px, 89% 100%, 100% 100%, 0px 102%)",
                  }}
                  onClick={() => setActiveTab("NEW")}
                >
                  <span
                    className="text-inside-shape3-nerew ml-5 px-3"
                    style={{
                      fontFamily: "Montserrat",
                      color: activeTab === "NEW" ? "black" : "",
                    }}
                  >
                    NEW
                  </span>
                </div>
                <div
                  className="model-three-shape w-100"
                  style={{
                    clipPath:
                      "polygon(13% 0, 100% 0, 100% 50%, 100% 100%, 0 100%)",
                  }}
                  onClick={() => setActiveTab("SAVED CARS")}
                >
                  <span
                    className="text-inside-shape3-nerew ml-5  px-3"
                    style={{
                      fontFamily: "Montserrat",
                      color: activeTab === "SAVED CARS" ? "black" : "",
                    }}
                  >
                    MY SAVED
                  </span>
                </div>
              </div>
            </div>

            {/* Conditional rendering based on active tab */}
            {(activeTab === "POPULAR" || activeTab === "ALTERNATE") && (
              <Cards />
            )}
            {activeTab === "NEW" && <Newcars />}
            {activeTab === "SAVED CARS" && <Shotlist />}
          </section>
        </div>
      </div>
    </>
  );
});

export default Featuredcars;
