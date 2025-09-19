import React, { useState, useEffect, useRef } from "react";
import Scrach from "../../../Images/scrach.png";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Search as SearchIcon, X } from "lucide-react";
import AdvancedCarSearchModal from "@/components/carSearchFilter";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showAssistMeModal, setShowAssistMeModal] = useState(false);
  const searchRef = useRef(null);

  let activeRequestController = null;

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setIsFocused(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearch = async (term) => {
    if (activeRequestController) {
      activeRequestController.abort();
    }

    if (term.trim() === "" || term.length <= 2) {
      setSearchResults([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      activeRequestController = new AbortController();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/extra/search-product-webLandin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search: term }),
          signal: activeRequestController.signal,
        }
      );
      const data = await response.json();
      if (data.success) {
        const activeCars = data.cars.filter((cars) => cars?.active !== "false");
        setSearchResults(activeCars);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching search results:", error);
      }
    } finally {
      setLoading(false);
      activeRequestController = null;
    }
  };

  const debouncedSearch = debounce(handleSearch, 500);

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setLoading(false);
    } else if (searchTerm.length > 2) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm]);

  const parseList = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const items = doc.querySelectorAll("ul li, p");
    return Array.from(items)
      .map((item) => item.textContent.trim())
      .join(" | ");
  };

  const handleBannerClick = () => {
    window.location.href = "https://carconsultancy.in/";
  };

  const handleResultClick = () => {
    setIsFocused(false);
    setSearchTerm("");
  };

  return (
    <div className="relative w-full py-8 overflow-visible flex justify-center items-center">
      <div className="w-[1400px]">
        <div className="">
          <h1 className="text-[25px] font-bold text-center mb-6 font-sans text-wrapper">
            <span className="text-[#818181]">FIND YOUR PERFECT</span>{" "}
            <span className="text-[#B60C19]">CAR</span>
          </h1>
        </div>

        <div className="flex justify-center items-center gap-2 md:gap-4 px-4 md:px-4 font-sans mb-6">
          <p className="bg-black text-white flex-1 md:flex-initial text-center text-xs md:text-base border border-black hover:bg-black hover:text-white px-3 md:px-4 py-2 rounded-lg cursor-pointer duration-300">
            <span>SEARCH</span>
          </p>
          <p
            className="text-black flex-1 md:flex-initial text-center text-xs md:text-base border border-black hover:bg-black hover:text-white px-3 md:px-4 py-2 rounded-lg cursor-pointer duration-300"
            onClick={() => setShowAssistMeModal(true)}
          >
            <span>ASSIST ME</span>
          </p>
          <p
            className="text-black flex-1 md:flex-initial text-center text-xs md:text-base border border-black hover:bg-black hover:text-white px-3 md:px-4 py-2 rounded-lg cursor-pointer duration-300"
            onClick={handleBannerClick}
          >
            <span>CONSULT US</span>
          </p>
        </div>

        {/* Desktop search input - Only show on large screens (lg and up) */}
        <div className="flex justify-center items-center">
          <div className="lg:block hidden relative" ref={searchRef}>
            <div className="relative">
              <div className="flex items-center border border-gray-300 rounded-lg overflow-hidden  focus-within:shadow-md transition-shadow duration-200">
                <SearchIcon
                  className="absolute left-4 text-gray-400"
                  size={20}
                />
                <input
                  className="text-[16px] w-[870px] px-5 py-3 rounded-lg outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border border-black"
                  type="text"
                  placeholder="Search car... E.g: Tata Nexon"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onFocus={() => setIsFocused(true)}
                />
                {searchTerm && (
                  <button
                    onClick={() => setSearchTerm("")}
                    className="absolute right-4 text-gray-400 hover:text-gray-600"
                  >
                    <X size={20} />
                  </button>
                )}
              </div>

              {/* Search Results Dropdown */}
              {isFocused && (searchTerm.length > 2 || loading) && (
                <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-96 overflow-y-auto z-50">
                  {loading ? (
                    <div className="p-4">
                      <Skeleton count={3} height={60} className="mb-2" />
                    </div>
                  ) : searchResults.length > 0 ? (
                    <div>
                      {searchResults.slice(0, 8).map((result, index) => (
                        <Link
                          key={result._id}
                          to={`/product/${result.carname}/${result._id}`}
                          className="flex items-center p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0 cursor-pointer transition-colors duration-200"
                          onClick={handleResultClick}
                        >
                          <div className="flex items-center space-x-3">
                            {/* Brand Logo */}
                            <img
                              src={`${process.env.NEXT_PUBLIC_API}/brandImages/${result.brand.image}`}
                              alt={result.brand?.name}
                              crossOrigin="anonymous"
                              className="w-8 h-8 object-contain"
                            />
                            {/* Car Image */}
                            <img
                              src={`${process.env.NEXT_PUBLIC_API}/productImages/${result.heroimage}`}
                              alt={result.carname}
                              crossOrigin="anonymous"
                              className="w-16 h-12 object-cover rounded"
                            />
                          </div>
                          <div className="ml-4 flex-1">
                            <h4 className="font-semibold text-gray-900 mb-1">
                              {result.carname}
                            </h4>
                            <div className="flex flex-wrap gap-2 text-xs text-gray-600">
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {parseList(result.seater)} seater
                              </span>
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {result.Service}
                              </span>
                              <span className="bg-gray-100 px-2 py-1 rounded">
                                {parseList(result.fueltype)}
                              </span>
                              {result.NCAP && (
                                <span className="bg-gray-100 px-2 py-1 rounded">
                                  {result.NCAP} NCAP
                                </span>
                              )}
                            </div>
                          </div>
                          <SearchIcon
                            className="text-gray-400 ml-2"
                            size={16}
                          />
                        </Link>
                      ))}
                      {searchResults.length > 8 && (
                        <div className="p-3 text-center text-sm text-gray-500 border-t">
                          Showing top 8 results of {searchResults.length}
                        </div>
                      )}
                    </div>
                  ) : (
                    searchTerm.trim() !== "" &&
                    searchTerm.length > 2 && (
                      <div className="p-4 text-center text-gray-500">
                        <SearchIcon
                          className="mx-auto mb-2 text-gray-300"
                          size={24}
                        />
                        <p>No cars found for "{searchTerm}"</p>
                        <p className="text-xs mt-1">
                          Try searching with different keywords
                        </p>
                      </div>
                    )
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Mobile and Tablet search input - Show on screens smaller than lg */}
        <div className="lg:hidden p-2 flex justify-center items-center">
          <div className="p-2 flex justify-center items-center">
            <div className="flex px-4 w-[400px] overflow-hidden rounded">
              <input
                className="border w-[346px] h-[40px] font-sans pt-[10.5px] pr-[3px] pb-[10.5px] pl-[21px]"
                type="text"
                placeholder="Search car. Eg: TATA NEXON"
                value={searchTerm}
                onClick={openModal}
                readOnly
              />
              <button className="bg-black text-white px-4 text-sm flex items-center justify-center rounded-md">
                <SearchIcon size={20} />
              </button>
            </div>
          </div>

          {/* Mobile and Tablet Search Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
              <div className="w-[346px] h-[400px] rounded-[10px] bg-white overflow-hidden flex flex-col">
                {/* Header - Fixed */}
                <div className="flex items-center justify-between w-full p-[20px] pb-4 border-b border-gray-100 flex-shrink-0">
                  <h4 className="text-[16px] font-semibold text-[#818181]">
                    SELECT YOUR <span className="text-[#B10819]">CAR</span>
                  </h4>
                  <button
                    onClick={closeModal}
                    className="text-black hover:text-[#B10819] transition-colors"
                  >
                    <span className="text-2xl">
                      <X />
                    </span>
                  </button>
                </div>

                {/* Search Input - Fixed */}
                <div className="px-[20px] py-4 border-b border-gray-100 font-[Montserrat] font-medium flex-shrink-0">
                  <div className="relative">
                    <input
                      type="text"
                      placeholder="Search for a car..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full h-[40px] border border-slate-300 px-4 text-black"
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 flex justify-center items-center">
                      <button className="bg-black text-white w-[38px] h-[38px] flex justify-center items-center">
                        <SearchIcon size={16} />
                      </button>
                    </div>
                  </div>
                </div>

                {/* Results Container - Scrollable */}
                <div className="px-[20px] py-4 flex-1 overflow-hidden flex flex-col">
                  <div className="text-[13px] font-medium text-[#B1081A] mb-3 font-[Montserrat] flex-shrink-0">
                    Popular Cars
                  </div>

                  <div className="flex-1 overflow-y-auto scrollbar-hide">
                    {loading ? (
                      <Skeleton count={6} height={50} />
                    ) : searchResults.length > 0 ? (
                      searchResults.map((result) => (
                        <Link
                          key={result._id}
                          to={`/product/${result.carname}/${result._id}`}
                          className="py-3 px-4 cursor-pointer hover:bg-gray-100 border-b border-gray-200 text-black block"
                          onClick={closeModal}
                        >
                          <div className="flex items-start">
                            <div className="flex-grow">
                              <div className="flex space-x-2">
                                <span className="text-[12px] font-semibold font-[Montserrat]">
                                  {result.brand?.name}
                                </span>
                                <span className="text-[12px] font-semibold font-[Montserrat]">
                                  {result.carname}
                                </span>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      searchTerm.trim() !== "" &&
                      searchTerm.length > 2 && (
                        <p className="py-3 px-4 text-gray-500">No Car Found</p>
                      )
                    )}
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      <AdvancedCarSearchModal
        isOpen={showAssistMeModal}
        onClose={() => setShowAssistMeModal(false)}
      />
    </div>
  );
};

export default Search;
