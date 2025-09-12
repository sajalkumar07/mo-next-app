import React, { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { Search, X, MapPin } from "lucide-react";
import { Link } from "react-router-dom";

const ChangeCarPopup = ({ onClose, onVariantSelect }) => {
  // State for search functionality
  const [carSearchTerm, setCarSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const activeRequestRef = useRef(null);

  // State for variant selection
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [variantSearchTerm, setVariantSearchTerm] = useState("");
  const [loading, setLoading] = useState(false);

  // Debounce function for search
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Search cars function
  const handleCarSearch = async (term) => {
    if (activeRequestRef.current) {
      activeRequestRef.current.abort();
    }

    if (term.trim() === "" || term.length <= 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    try {
      activeRequestRef.current = new AbortController();
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/extra/search-product-webLandin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ search: term }),
          signal: activeRequestRef.current.signal,
        }
      );
      const data = await response.json();
      if (data.success) {
        const activeCars = data.cars.filter((car) => car?.active !== "false");
        setSearchResults(activeCars);
      } else {
        setSearchResults([]);
      }
    } catch (error) {
      if (error.name !== "AbortError") {
        console.error("Error fetching search results:", error);
      }
    } finally {
      setIsSearching(false);
      activeRequestRef.current = null;
    }
  };

  const debouncedSearch = debounce(handleCarSearch, 500);

  // Handle search input change
  const handleCarSearchInput = (e) => {
    const value = e.target.value;
    setCarSearchTerm(value);
    if (value.length > 2) {
      debouncedSearch(value);
    } else {
      setSearchResults([]);
    }
  };

  // Handle product selection from search results
  const handleSearchResultClick = (car) => {
    setSelectedProduct(car);
    setCarSearchTerm("");
    setSearchResults([]);
    setSelectedFuelType(null);
    setVariantSearchTerm("");
    fetchVariantsForProduct(car._id);
  };

  // Fetch variants for selected product
  const fetchVariantsForProduct = async (productId) => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/variants/active/${productId}`
      );
      const data = await response.json();
      setSelectedVariant(data.data || []);
    } catch (error) {
      console.error("Error fetching variants:", error);
      setSelectedVariant([]);
    } finally {
      setLoading(false);
    }
  };

  // Handle variant selection
  const handleVariantSelect = (variant) => {
    if (onVariantSelect) {
      onVariantSelect(variant);
    }
    onClose();
  };

  // Clear selection and return to search
  const handleClearSelection = () => {
    setSelectedProduct(null);
    setSelectedVariant([]);
    setSelectedFuelType(null);
    setVariantSearchTerm("");
  };

  // Format price to lakhs
  const formatPriceToLakhs = (price) => {
    if (!price) return "₹ N/A";
    const lakhs = (price / 100000).toFixed(2);
    return `₹ ${lakhs} Lakh`;
  };

  // Filter variants based on search term and fuel type
  const filteredVariants = selectedVariant.filter((variant) => {
    const matchesSearch = variantSearchTerm
      ? (variant.varientName &&
          variant.varientName.toLowerCase().includes(variantSearchTerm)) ||
        (variant.fuel &&
          variant.fuel.toLowerCase().includes(variantSearchTerm)) ||
        (variant.exShowroomPrice &&
          variant.exShowroomPrice.toString().includes(variantSearchTerm))
      : true;

    const matchesFuelType = selectedFuelType
      ? variant.fuel === selectedFuelType
      : true;

    return matchesSearch && matchesFuelType;
  });

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-[10px] w-[346px] h-[400px] shadow-lg flex flex-col overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-200">
          <h2 className="text-[14px] font-semibold text-[#818181]">
            SELECT YOUR <span className="text-[#B10819]">PRODUCT</span>
          </h2>
          <button
            onClick={onClose}
            className="text-black hover:text-[#B10819] transition-colors"
          >
            <X size={24} />
          </button>
        </div>

        {/* Search input - always visible */}
        <div className="p-4 border-b border-gray-200">
          <div className="relative">
            <input
              type="text"
              placeholder={
                selectedProduct ? "Search variants..." : "Search for a car..."
              }
              value={selectedProduct ? variantSearchTerm : carSearchTerm}
              onChange={
                selectedProduct
                  ? (e) => setVariantSearchTerm(e.target.value.toLowerCase())
                  : handleCarSearchInput
              }
              className="w-full h-[40px] border border-slate-300 px-4 text-black font-[Montserrat] font-medium"
              autoFocus
            />
            <div className="absolute inset-y-0 right-0 flex justify-center items-center">
              <button className="bg-black text-white w-[38px] h-[38px] flex justify-center items-center">
                <Search size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* Main content area */}
        <div className="flex-1 overflow-y-auto p-4">
          {selectedProduct ? (
            <>
              {/* Selected product info */}
              <div className="flex gap-2 mb-4 overflow-x-auto pb-2">
                <span className="border rounded-3xl px-4 py-2 text-[#818181]">
                  {selectedProduct.brand?.name || "Unknown Brand"}
                  <span
                    onClick={handleClearSelection}
                    className="cursor-pointer ml-1"
                  >
                    ✖
                  </span>
                </span>
                <span className="border rounded-3xl px-4 py-2 text-[#818181]">
                  {selectedProduct.carname}
                  <span
                    onClick={handleClearSelection}
                    className="cursor-pointer ml-1"
                  >
                    ✖
                  </span>
                </span>
              </div>

              {/* Fuel type filters */}
              {selectedVariant.length > 0 && (
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                  {Array.from(new Set(selectedVariant.map((v) => v.fuel))).map(
                    (fuelType) => (
                      <span
                        key={fuelType}
                        className={`border rounded-3xl px-4 py-2 text-[#818181] cursor-pointer ${
                          selectedFuelType === fuelType ? "bg-gray-200" : ""
                        }`}
                        onClick={() =>
                          setSelectedFuelType(
                            selectedFuelType === fuelType ? null : fuelType
                          )
                        }
                      >
                        {fuelType}
                      </span>
                    )
                  )}
                </div>
              )}

              {/* Variants list */}
              {loading ? (
                <Skeleton count={5} height={60} />
              ) : filteredVariants.length > 0 ? (
                filteredVariants.map((variant) => (
                  <div key={variant._id} className="mb-3">
                    <div
                      onClick={() => handleVariantSelect(variant)}
                      className="flex justify-between items-center cursor-pointer hover:bg-gray-50 p-2 rounded"
                    >
                      <div className="flex flex-col">
                        <p className="text-[14px] text-[#B1081A] font-[Montserrat]">
                          {variant.varientName}
                        </p>
                        <p className="text-[14px] text-[#818181] font-[Montserrat]">
                          {variant.fuel} {variant.transmission}
                        </p>
                      </div>
                      <span className="text-black text-[14px] font-semibold font-[Montserrat]">
                        {formatPriceToLakhs(variant.exShowroomPrice)}
                      </span>
                    </div>
                    <div className="border-b border-gray-200 w-full mb-2"></div>
                  </div>
                ))
              ) : (
                <p className="text-center text-gray-500 py-4">
                  No variants found matching your criteria
                </p>
              )}
            </>
          ) : (
            <>
              {/* Search results */}
              <div className="text-[13px] font-medium text-[#B1081A] mb-3 font-[Montserrat]">
                {carSearchTerm.trim() !== "" && carSearchTerm.length > 2
                  ? "Search Results"
                  : "Search for a car"}
              </div>

              {isSearching ? (
                <Skeleton count={6} height={50} />
              ) : searchResults.length > 0 ? (
                searchResults.map((result) => (
                  <div
                    key={result._id}
                    className="py-3 px-4 cursor-pointer hover:bg-gray-100 border-b border-gray-200 text-black"
                    onClick={() => handleSearchResultClick(result)}
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
                  </div>
                ))
              ) : carSearchTerm.length > 2 ? (
                <p className="py-3 px-4 text-gray-500">No cars found</p>
              ) : (
                <p className="text-center text-gray-500 mt-8"></p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ChangeCarPopup;
