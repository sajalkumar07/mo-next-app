import React, { useState, useEffect } from "react";
import Scrach from "../../../Images/scrach.png";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Search as SearchIcon, X, MapPin } from "lucide-react";
import MyLocation from "./locaationModel";

const Search = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [userLocation, setUserLocation] = useState(null);
  const [initialLoad, setInitialLoad] = useState(true);

  let activeRequestController = null;

  // Check for user location in localStorage on initial load
  useEffect(() => {
    const savedLocation = JSON.parse(localStorage.getItem("location"));
    if (savedLocation) {
      setUserLocation(savedLocation);
    } else {
      // If no location is saved, show location modal
      setShowLocationModal(true);
    }
    setInitialLoad(false);
  }, []);

  // Open search modal when location is selected
  useEffect(() => {
    if (!initialLoad && userLocation && !showLocationModal) {
      setShowModal(true);
    }
  }, [userLocation, showLocationModal, initialLoad]);

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };

  const closeLocationModal = (locationSelected) => {
    if (locationSelected) {
      const savedLocation = JSON.parse(localStorage.getItem("location"));
      setUserLocation(savedLocation);
    }
    setShowLocationModal(false);
  };

  const handleChangeLocation = () => {
    setShowModal(false);
    setShowLocationModal(true);
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
        setSearchResults(data.cars);
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
    <div className="search-container">
      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <MyLocation onClose={closeLocationModal} />
        </div>
      )}

      <img className="scrach-image" src={Scrach} alt="scrach" />
      <div className="label">
        <p className="FIND-YOUR-PERFECT mt-3 jgjfk">
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

      {/* Location indicator */}
      {userLocation && (
        <div className="flex items-center justify-center mb-2">
          <div
            className="flex items-center text-red-600 cursor-pointer"
            onClick={() => setShowLocationModal(true)}
          >
            <MapPin size={16} className="mr-1" />
            <span>
              {userLocation.city}, {userLocation.state}
            </span>
          </div>
        </div>
      )}

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
      <div className="p-2 flex justify-center items-center onlyphoneme">
        <div className="flex w-[400px] overflow-hidden rounded">
          <input
            className="input_box_input pl-4 w-full outline-none border-none"
            type="text"
            placeholder="Select Car"
            value={searchTerm}
            onClick={openModal}
            readOnly
          />
          <button className="bg-black text-white px-4 text-sm flex items-center justify-center">
            <SearchIcon size={20} />
          </button>
        </div>
      </div>

      {/* Mobile Search Modal */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="bg-white rounded-md w-full max-w-md shadow-lg">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-xl font-bold text-gray-800">
                SELECT YOUR <span className="text-red-600">CAR</span>
              </h2>
              <button
                onClick={closeModal}
                className="text-gray-400 hover:text-gray-600"
              >
                <X size={24} />
              </button>
            </div>

            <div className="p-4">
              {/* Display selected location in search modal */}
              {userLocation && (
                <div className="flex items-center mb-4 text-sm text-gray-600">
                  <MapPin size={16} className="mr-1 text-red-600" />
                  <span>
                    {userLocation.city}, {userLocation.state}
                  </span>
                  <button
                    onClick={handleChangeLocation}
                    className="ml-auto text-red-600 text-xs underline"
                  >
                    Change
                  </button>
                </div>
              )}

              <div className="relative">
                <input
                  type="text"
                  placeholder="Search for a car..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full p-1.5 pr-10 border border-gray-300"
                  autoFocus
                />
                <div className="absolute inset-y-0 right-0 flex items-center">
                  <button className="bg-black text-white text-center md:py-2.5 md:px-2.5 py-2 px-2">
                    <SearchIcon size={16} />
                  </button>
                </div>
              </div>

              <div className="mt-4">
                <div className="text-sm text-gray-600 mb-2">Results</div>

                <div className="max-h-64 overflow-y-auto">
                  {loading ? (
                    <Skeleton count={3} height={50} />
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
                            <h4 className="font-medium">{result.carname}</h4>
                            <p className="text-sm text-gray-600">
                              {parseList(result.seater)} seater | Fuel:{" "}
                              {parseList(result.fueltype)} | Safety:{" "}
                              {result.NCAP}
                            </p>
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
        </div>
      )}

      <p className="input_box_below">
        <span>E.g.:</span>{" "}
        <Link to="/product/Nexon/6694d2a34596d7ca9903611b">Tata Nexon</Link>
      </p>
    </div>
  );
};

export default Search;
