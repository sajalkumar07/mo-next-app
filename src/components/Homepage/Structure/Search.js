import React, { useState, useEffect } from "react";
import Scrach from "../../../Images/scrach.png";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Search as SearchIcon, X } from "lucide-react";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);

  let activeRequestController = null;

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

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

  return (
    <>
      {/* Add the tablet-specific CSS */}
      <style jsx>{`
        /* Media query specifically for tablets and iPads */
        @media screen and (min-width: 768px) and (max-width: 1024px) {
          .input_box_below {
            position: relative !important;
            top: 0 !important;
            left: 0 !important;
            transform: none !important;
            margin-top: 10px !important;
            margin-left: 0 !important;
            padding-left: 2rem !important;
            width: 63% !important;
            display: block !important;
            z-index: 10 !important;
          }

          .input_box_below span {
            margin-left: 0 !important;
            padding-left: 0 !important;
          }

          /* Ensure the search container has proper spacing */
          .search-container .input_box {
            margin-bottom: 5px !important;
          }
        }

        /* Additional specific targeting for iPad devices */
        @media screen and (min-width: 768px) and (max-width: 1024px) {
          .input_box_below {
            position: static !important;
            margin-top: 15px !important;
            margin-left: 32px !important;
          }
        }

        /* Portrait iPad */
        @media screen and (min-width: 768px) and (max-width: 1024px) and (orientation: portrait) {
          .input_box_below {
            margin-left: 40px !important;
          }
        }

        /* Landscape iPad */
        @media screen and (min-width: 768px) and (max-width: 1024px) and (orientation: landscape) {
          .input_box_below {
          }
        }
      `}</style>

      <div className="search-container">
        <img className="scrach-image" src={Scrach} alt="scrach" />
        <div className="label">
          <p className="FIND-YOUR-PERFECT mt-3 ">
            <span className="text-wrapper">FIND YOUR</span>
            <span className="span">&nbsp;</span>
            <span className="text-wrapper-2">PERFECT CAR</span>
          </p>
        </div>
        <ul className="search_tabs">
          <div className="full_tabs active">
            <li>SEARCH</li>
          </div>
          <div className="full_tabs">
            <li>ASSIST ME</li>
          </div>
          <div className="full_tabs" onClick={handleBannerClick}>
            <li>CONSULT US</li>
          </div>
        </ul>

        {/* Desktop search input */}
        <div className="input_box align-items-center justify-content-center onlydesptop">
          <input
            className="input_box_input"
            type="text"
            placeholder="Select Car"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onBlur={() => setTimeout(() => setIsFocused(false), 200)}
          />
          {isFocused && (
            <div className="input_box_search">
              {loading ? (
                <Skeleton count={3} height={50} />
              ) : searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <Link
                    key={result._id}
                    to={`/product/${result.carname}/${result._id}`}
                    className="result-item"
                  >
                    <div className="align-items-start justify-content-top d-flex">
                      <img
                        src={`${process.env.NEXT_PUBLIC_API}/brandImages/${result.brand.image}`}
                        alt="Hero Image"
                        crossOrigin="anonymous"
                        className="barnd-img"
                      />
                      <img
                        src={`${process.env.NEXT_PUBLIC_API}/productImages/${result.heroimage}`}
                        alt="Hero Image"
                        crossOrigin="anonymous"
                        className="search-img"
                      />
                    </div>
                    <div className="texttd">
                      <h4>{result.carname}</h4>
                      <p className="info_card">
                        {parseList(result.seater)} seater
                      </p>
                      <p className="info_card">Service: {result.Service}</p>
                      <p className="info_card">
                        Fuel: {parseList(result.fueltype)}
                      </p>
                      <p className="info_card">Safety: {result.NCAP}</p>
                    </div>
                    <hr />
                  </Link>
                ))
              ) : (
                searchTerm.trim() !== "" &&
                searchTerm.length > 2 && <p>No Car Found</p>
              )}
            </div>
          )}
        </div>

        {/* Mobile search input */}
        <div className="p-2 flex justify-center items-center onlyphoneme ">
          <div className="p-2 flex justify-center items-center onlyphoneme">
            <div className="flex px-4  w-[400px] overflow-hidden rounded ">
              <input
                className="border w-[346px] h-[40px] font-sans pt-[10.5px] pr-[3px] pb-[10.5px] pl-[21px]"
                type="text"
                placeholder="Search Car"
                value={searchTerm}
                onClick={openModal}
                readOnly
              />
              <button className="bg-black text-white px-4 text-sm flex items-center justify-center rounded-md">
                <SearchIcon size={20} />
              </button>
            </div>
          </div>

          {/* Mobile Search Modal */}
          {showModal && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 ">
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

        <div className="input_box_below">
          <span className="ml-8">
            E.g:{" "}
            <Link to="/product/Nexon/6694d2a34596d7ca9903611b">Tata Nexon</Link>
          </span>{" "}
        </div>
      </div>
    </>
  );
};

export default Search;
