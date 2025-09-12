import React, { useState } from "react";
import { Link } from "react-router-dom";
import "../../../main.css";

export const PartSecond = () => {
  const [showMore, setShowMore] = useState(false);

  const toggleMoreMenu = () => {
    setShowMore(!showMore);
  };

  const handleBannerClick = () => {
    window.location.href = "https://carconsultancy.in/";
  };
  return (
    <div className="flex justify-center items-center ml-32">
      <div className="main_header_link">
        <Link to="/Car-Compero/">
          <ul>CAR COMPARO</ul>
        </Link>
        <ul onClick={handleBannerClick}>CONSULT US</ul>
        <Link to="https://www.youtube.com/@motoroctane">
          {" "}
          <ul>YOUTUBE</ul>
        </Link>
        <Link to="/About-us">
          <ul>ABOUT US</ul>
        </Link>
        <ul
          className="more-menu"
          onMouseEnter={() => setShowMore(true)}
          onMouseLeave={() => setShowMore(false)}
        >
          MORE <ion-icon name="chevron-down-outline"></ion-icon>
          {showMore && (
            <div className="absolute top-full left-0 bg-black shadow-lg border border-gray-200 min-w-48 z-50 animate-in fade-in-0 slide-in-from-top-1 duration-200">
              <Link to="/EMI-Calculator">
                <span className="block px-4 py-2 hover:bg-[#e5e5e5] hover:text-black cursor-pointer border-b border-gray-100 transition-colors duration-150">
                  CALCULATORS
                </span>
              </Link>
              <span className="block px-4 py-2 hover:bg-[#e5e5e5]  hover:text-black cursor-pointer border-b border-gray-100 transition-colors duration-150">
                SVC NETWORK
              </span>
              <span className="block px-4 py-2 hover:bg-[#e5e5e5] hover:text-black cursor-pointer border-b border-gray-100 transition-colors duration-150">
                SHARE REVIEWS
              </span>
              <Link to="/Privacy-Policy">
                <span className="block px-4 py-2 hover:bg-[#e5e5e5] hover:text-black cursor-pointer border-b border-gray-100 transition-colors duration-150">
                  TERMS OF SERVICE
                </span>
              </Link>
              <Link to="/Terms-and-Conditions">
                <span className="block px-4 py-2 hover:bg-[#e5e5e5] hover:text-black cursor-pointer transition-colors duration-150">
                  PRIVACY POLICY
                </span>
              </Link>
            </div>
          )}
        </ul>
      </div>
    </div>
  );
};
export default PartSecond;
