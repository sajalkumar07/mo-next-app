import React, { useState } from "react";
import Link from "next/link";

export const PartSecond = () => {
  const [showMore, setShowMore] = useState(false);

  const handleBannerClick = () => {
    if (typeof window !== "undefined") {
      window.location.href = "https://carconsultancy.in/";
    }
  };

  return (
    // hidden until xl; visible as flex from xl+
    <div className="hidden xl:flex justify-center items-center font-sans">
      <nav className="flex items-center space-x-8 text-white font-medium">
        <Link
          href="/Car-Compero/"
          className="hover:text-red-500 transition-colors duration-200"
        >
          CAR COMPARO
        </Link>

        <Link
          href="https://carconsultancy.in/"
          className="hover:text-red-500 transition-colors duration-200"
        >
          CONSULT US
        </Link>

        <Link
          href="https://www.youtube.com/@motoroctane"
          className="hover:text-red-500 transition-colors duration-200"
        >
          YOUTUBE
        </Link>

        <Link
          href="/About-us"
          className="hover:text-red-500 transition-colors duration-200"
        >
          ABOUT US
        </Link>

        <div
          className="relative"
          onMouseEnter={() => setShowMore(true)}
          onMouseLeave={() => setShowMore(false)}
        >
          <button
            className="flex items-center space-x-1 hover:text-red-500 transition-colors duration-200"
            aria-haspopup="menu"
            aria-expanded={showMore}
            aria-controls="more-menu"
          >
            <span>MORE</span>
            <svg
              className="w-4 h-4"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </button>

          {showMore && (
            <div
              id="more-menu"
              role="menu"
              className="absolute top-full left-0 bg-white shadow-lg min-w-[12rem] z-50 text-black rounded-xl"
            >
              <Link
                href="/EMI-Calculator"
                role="menuitem"
                className="block px-4 py-3 transition-colors duration-150 rounded-t-xl hover:bg-gray-100"
              >
                Calculator
              </Link>

              <button
                role="menuitem"
                className="w-full text-left block px-4 py-3 transition-colors duration-150 hover:bg-gray-100"
              >
                Service Network
              </button>

              <button
                role="menuitem"
                className="w-full text-left block px-4 py-3 transition-colors duration-150 hover:bg-gray-100"
              >
                Share Reviews
              </button>

              <Link
                href="/Privacy-Policy"
                role="menuitem"
                className="block px-4 py-3 transition-colors duration-150 hover:bg-gray-100"
              >
                Terms of Service
              </Link>

              <Link
                href="/Terms-and-Conditions"
                role="menuitem"
                className="block px-4 py-3 transition-colors duration-150 hover:bg-gray-100 rounded-b-xl"
              >
                Privacy Policy
              </Link>
            </div>
          )}
        </div>
      </nav>
    </div>
  );
};

export default PartSecond;
