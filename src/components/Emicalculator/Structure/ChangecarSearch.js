import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { X, Search } from "lucide-react";

const ChangeCarVarEMI = () => {
  const { brandId, productId, variantId } = useParams(); // Get IDs from URL params

  const [searchTerm, setSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);

  // New state for direct variant popup (from ViewPriceBreakup)
  const [showVariantPopup, setShowVariantPopup] = useState(false);
  const [variants, setVariants] = useState([]);
  const [variantLoading, setVariantLoading] = useState(false);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [variantSearchTerm, setVariantSearchTerm] = useState("");

  let activeRequestController = null;

  const closeModal = () => {
    setSearchTerm("");
    setSearchResults([]);
  };

  // Search functions (from Search component)
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

  // Direct variant functions (from ViewPriceBreakup)
  const fetchVariants = async () => {
    setVariantLoading(true);
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/variants/active/${productId}`
      );
      const data = await res.json();
      console.log("Full API Response:", data);

      if (data.success && Array.isArray(data.data)) {
        console.log("Setting variants:", data.data);
        setVariants(data.data);
      } else {
        console.error("Invalid data structure");
        setVariants([]);
      }
    } catch (error) {
      console.error("Error fetching variants:", error);
      setVariants([]);
    } finally {
      setVariantLoading(false);
    }
  };

  const handleDirectVariantPopup = () => {
    setShowVariantPopup(true);
    fetchVariants();
  };

  const handleCloseVariantPopup = () => {
    setShowVariantPopup(false);
    setSelectedFuelType(null);
    setVariantSearchTerm("");
  };

  const handleVariantSearch = (e) => {
    setVariantSearchTerm(e.target.value.toLowerCase());
  };

  const filteredVariants = variants
    ? variants.filter((variant) => {
        if (!variantSearchTerm) return true;
        return (
          (variant.varientName &&
            variant.varientName.toLowerCase().includes(variantSearchTerm)) ||
          (variant.fuel &&
            variant.fuel.toLowerCase().includes(variantSearchTerm)) ||
          (variant.exShowroomPrice &&
            variant.exShowroomPrice.toString().includes(variantSearchTerm))
        );
      })
    : [];

  const formatPriceToLakhs = (price) => {
    if (!price) return "₹ N/A";

    const numericPrice =
      typeof price === "string" ? parseFloat(price.replace(/,/g, "")) : price;

    if (numericPrice >= 10000000) {
      const croreValue = (numericPrice / 10000000).toFixed(2);
      return `₹ ${croreValue} Cr`;
    } else if (numericPrice >= 100000) {
      const lakhValue = (numericPrice / 100000).toFixed(2);
      return `₹ ${lakhValue} Lakh`;
    } else {
      return `₹ ${numericPrice.toLocaleString()}`;
    }
  };

  useEffect(() => {
    if (searchTerm.trim() === "") {
      setSearchResults([]);
      setLoading(false);
    } else if (searchTerm.length > 2) {
      debouncedSearch(searchTerm);
    }
  }, [searchTerm]);

  return (
    <div className="search-container">
      {" "}
      {/* Dual Button Container */}
      <div className="flex gap-2">
        {/* View Price Breakup Button (Direct Variant Popup) */}
        <div
          class="bg-transparent text-[#555555] font-[montserrat] text-[7.53px] font-bold   w-[83px] h-[20px] text-center cursor-pointer rounded-[6px] flex justify-center items-center border-[1px] border-[#555555]"
          onClick={handleDirectVariantPopup}
        >
          CHANGE VARIANT
        </div>
      </div>
      {/* Direct Variant Popup (from ViewPriceBreakup) */}
      {showVariantPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px] w-[346px] h-[400px] shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-[16px] font-semibold text-[#818181]">
                SELECT YOUR <span className="text-[#B10819]">VARIANT</span>
              </h2>
              <button
                className="text-black hover:text-[#B10819] transition-colors"
                onClick={handleCloseVariantPopup}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 flex flex-col p-4 overflow-hidden font-[Montserrat] font-medium">
              <div className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search variants..."
                  onChange={handleVariantSearch}
                  className="w-full h-[40px] border border-slate-300 px-4 text-black"
                />
                <div className="absolute inset-y-0 right-0 flex justify-center items-center">
                  <button className="bg-black text-white w-[38px] h-[38px] flex justify-center items-center">
                    <Search className="" size={16} />
                  </button>
                </div>
              </div>

              <div className="flex-col overflow-hidden">
                <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                  {variants
                    .map((variant) => variant.fuel)
                    .filter(
                      (value, index, self) => self.indexOf(value) === index
                    )
                    .map((fuelType) => (
                      <div
                        className="flex justify-center items-center space-x-3"
                        key={fuelType}
                      >
                        <span
                          className={`border rounded-3xl px-4 py-2 text-[#818181] cursor-pointer hover:bg-gray-100 ${
                            selectedFuelType === fuelType ? "bg-gray-200" : ""
                          }`}
                          onClick={() => setSelectedFuelType(fuelType)}
                        >
                          {fuelType}
                        </span>
                      </div>
                    ))}
                </div>
              </div>

              <div className="flex-1 overflow-y-scroll scrollbar-hide">
                {variantLoading ? (
                  <div className="mt-3">
                    <Skeleton height={50} count={5} />
                  </div>
                ) : (
                  <div className="flex-1 overflow-y-scroll">
                    {filteredVariants.length > 0 ? (
                      <div className="mb-3">
                        {filteredVariants
                          .filter((variant) =>
                            selectedFuelType
                              ? variant.fuel === selectedFuelType
                              : true
                          )
                          .map((variant, index) => (
                            <div key={index} className="pe-auto mb-3">
                              <Link
                                to={`/EMI-Calculator/${brandId}/${productId}/${variant._id}`}
                                onClick={handleCloseVariantPopup}
                              >
                                <div className="border-b border-dotted border-black pb-2 mb-2 flex justify-between w-full items-center">
                                  <div className="flex flex-col">
                                    <p className="text-[14px] text-[#B1081A] font-[Montserrat]">
                                      {variant.varientName}
                                    </p>
                                    <p className="text-[14px] text-[#818181] font-[Montserrat]">
                                      {variant.fuel} {"  "}
                                      {variant.transmission}
                                    </p>
                                  </div>
                                  <span className="text-black text-[14px] font-semibold font-[Montserrat]">
                                    {formatPriceToLakhs(
                                      variant.exShowroomPrice
                                    )}
                                  </span>
                                </div>
                              </Link>
                            </div>
                          ))}
                      </div>
                    ) : (
                      <p className="text-center text-gray-500">
                        No variants available
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeCarVarEMI;
