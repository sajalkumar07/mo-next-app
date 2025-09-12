import React, { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { X, Search } from "lucide-react";

const ChangeCarPriceBreakUp = ({ product, brand, productname }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleBrand, setVisibleBrand] = useState(null);
  const [popularCars, setPopularCars] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [searchText, setSearchText] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const popularCarsRef = useRef(null);
  let activeRequestController = null;

  // Debounce function
  const debounce = (func, delay) => {
    let timeout;
    return (...args) => {
      clearTimeout(timeout);
      timeout = setTimeout(() => func(...args), delay);
    };
  };

  // Car search function
  const handleCarSearch = async (term) => {
    if (activeRequestController) {
      activeRequestController.abort();
    }

    if (term.trim() === "" || term.length <= 2) {
      setSearchResults([]);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
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
      activeRequestController = null;
    }
  };

  const debouncedSearch = debounce(handleCarSearch, 500);

  // Handle search input
  const handleSearchInput = (e) => {
    const value = e.target.value;
    setSearchText(value);
  };

  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/api/brands`);
      const data = await response.json();
      setBrands(data.data);
    } catch (err) {
      setError("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  const fetchProductsForBrand = async (brandId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/cars/brand/${brandId}`
      );
      const data = await response.json();
      setProducts((prevProducts) => ({
        ...prevProducts,
        [brandId]: data,
      }));
    } catch (err) {
      setError(`Failed to fetch products for brand ${brandId}`);
    }
  };

  const handleProductClick = async (product) => {
    try {
      setSelectedProduct(product);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/variants/active/${product._id}`
      );
      const data = await response.json();
      setSelectedVariant(data.data);
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  const fetchPopularCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/extra/get-all-cars-for-popularity`
      );
      const data = await response.json();
      if (data.success) {
        const sortedCars = data.data
          .filter((car) => car.popularity >= 1 && car.popularity <= 5)
          .sort((a, b) => a.popularity - b.popularity);
        setPopularCars(sortedCars);
      } else {
        setError("Failed to fetch popular cars");
      }
    } catch (err) {
      setError("Error fetching popular cars");
    } finally {
      setLoading(false);
    }
  };

  const handleViewPriceBreakup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
    setSelectedFuelType(null);
    setSearchText("");
    setSearchResults([]);
    setSelectedProduct(product);
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
    setSelectedVariant([]);
  };

  const toggleBrandVisibility = (brandId) => {
    if (visibleBrand === brandId) {
      setVisibleBrand(null);
    } else {
      setVisibleBrand(brandId);
      if (!products[brandId] || products[brandId].length === 0) {
        fetchProductsForBrand(brandId);
      }
    }
  };

  // Format price
  const formatPriceToLakhs = (price) => {
    if (!price) return "₹ N/A";
    const numericPrice =
      typeof price === "string" ? parseFloat(price.replace(/,/g, "")) : price;
    if (numericPrice >= 10000000) {
      return `₹ ${(numericPrice / 10000000).toFixed(2)} Cr`;
    } else if (numericPrice >= 100000) {
      return `₹ ${(numericPrice / 100000).toFixed(2)} Lakh`;
    }
    return `₹ ${numericPrice.toLocaleString()}`;
  };

  useEffect(() => {
    fetchBrands();
    fetchPopularCars();
  }, []);

  useEffect(() => {
    if (brands.length > 0 && brand) {
      fetchProductsForBrand(brand);
    }
  }, [brands, brand]);

  useEffect(() => {
    if (selectedProduct) {
      const selectedBrand = brands.find((b) => b._id === brand);
      if (selectedBrand) {
        fetchProductsForBrand(selectedBrand._id);
        handleProductClick(selectedProduct);
      }
    }
  }, [selectedProduct, brand, brands]);

  // When the component mounts, automatically select the product passed from props (if it exists)
  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
    }
  }, [product]);

  useEffect(() => {
    if (product && brands.length > 0) {
      const selectedBrand = brands.find((b) => b._id === product.brand);
      if (selectedBrand) {
        fetchProductsForBrand(selectedBrand._id);
      }
      setSelectedProduct(product);
    }
  }, [product, brands]);

  // Handle car search
  useEffect(() => {
    if (searchText.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
    } else if (searchText.length > 2) {
      debouncedSearch(searchText);
    }
  }, [searchText]);

  return (
    <div>
      <div
        className="changecar-product changecar-product2 active"
        onClick={handleViewPriceBreakup}
      >
        CHANGE CAR
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px] w-[346px] h-[400px] shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-[16px] font-semibold text-[#818181]">
                CHANGE YOUR <span className="text-[#B10819]">CAR</span>
              </h2>
              <button
                className="text-black hover:text-[#B10819] transition-colors"
                onClick={handleClosePopup}
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex-1 flex flex-col p-4 overflow-hidden font-[Montserrat] font-medium">
              {selectedProduct ? (
                <>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search variants..."
                      value={searchText}
                      onChange={(e) => setSearchText(e.target.value)}
                      className="w-full h-[40px] border border-slate-300 px-4 text-black"
                    />
                    <div className="absolute inset-y-0 right-0 flex justify-center items-center">
                      <button className="bg-black text-white w-[38px] h-[38px] flex justify-center items-center">
                        <Search size={16} />
                      </button>
                    </div>
                  </div>

                  <div className="flex gap-2 mb-3">
                    <span className="selectedofthesec">
                      {/* Fix: Get brand name from selectedProduct if available, otherwise from brands array */}
                      {selectedProduct?.brand?.name ||
                        brands.find(
                          (b) => b._id === (selectedProduct?.brand || brand)
                        )?.name ||
                        "Brand"}
                      <span
                        onClick={handleClearSelection}
                        className="pe-auto cursor-pointer"
                      >
                        ✖
                      </span>
                    </span>
                    <span className="selectedofthesec">
                      {selectedProduct.carname || productname}
                      <span
                        onClick={() => setSelectedProduct(null)}
                        className="pe-auto cursor-pointer"
                      >
                        ✖
                      </span>
                    </span>
                  </div>

                  <div className="flex-col overflow-hidden">
                    <div className="flex gap-2 mb-3 overflow-x-auto pb-2">
                      {selectedVariant
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
                              className={`border rounded-3xl px-4 py-2 text-[#818181] cursor-pointer ${
                                selectedFuelType === fuelType
                                  ? "bg-gray-200"
                                  : ""
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
                    {loading ? (
                      <div className="mt-3">
                        <Skeleton height={50} count={5} />
                      </div>
                    ) : (
                      <div className="flex-1 overflow-y-scroll">
                        {selectedVariant.length > 0 ? (
                          <div className="mb-3">
                            {selectedVariant
                              .filter(
                                (variant) =>
                                  (selectedFuelType
                                    ? variant.fuel === selectedFuelType
                                    : true) &&
                                  variant.varientName
                                    .toLowerCase()
                                    .includes(searchText.toLowerCase())
                              )
                              .map((variant, index) => (
                                <div key={index} className="pe-auto mb-3">
                                  <Link
                                    to={`/pricebreakup/${variant._id}`}
                                    onClick={handleClosePopup}
                                  >
                                    <div className="border-b border-dotted border-black pb-2 mb-2 flex justify-between w-full items-center">
                                      <div className="flex flex-col">
                                        <p className="text-[14px] text-[#B1081A] font-[Montserrat]">
                                          {variant.varientName}
                                        </p>
                                        <p className="text-[14px] text-[#818181] font-[Montserrat]">
                                          {variant.fuel}
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
                </>
              ) : (
                <>
                  <div className="relative mb-4">
                    <input
                      type="text"
                      placeholder="Search for a car..."
                      value={searchText}
                      onChange={handleSearchInput}
                      className="w-full h-[40px] border border-slate-300 px-4 text-black"
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 flex justify-center items-center">
                      <button className="bg-black text-white w-[38px] h-[38px] flex justify-center items-center">
                        <Search size={16} />
                      </button>
                    </div>
                  </div>

                  {searchText.trim() !== "" && searchText.length > 2 ? (
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
                      {isSearching ? (
                        <Skeleton count={6} height={50} />
                      ) : searchResults.length > 0 ? (
                        searchResults.map((result) => (
                          <div
                            key={result._id}
                            className="py-3 px-4 cursor-pointer hover:bg-gray-100 border-b border-gray-200 text-black"
                            onClick={() => {
                              handleProductClick(result);
                              setSearchText("");
                              setSearchResults([]);
                            }}
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
                      ) : (
                        <p className="py-3 px-4 text-gray-500">No Car Found</p>
                      )}
                    </div>
                  ) : (
                    <>
                      {/* <div className="thetitelofbrandsss mt-3">
                        Popular Alternatives
                      </div>
                      <div className="d-flex align-items-center justify-content-center w-100 all-inonecard">
                        <div
                          ref={popularCarsRef}
                          className="popular-cars-section d-flex"
                          style={{
                            overflowX: "auto",
                            scrollBehavior: "smooth",
                          }}
                        >
                          {!loading && !error && popularCars.length > 0 && (
                            <div className="popular-cars-list d-flex">
                              {popularCars.map((car) => (
                                <div key={car._id} className="popular-car-card">
                                  <div onClick={handleClosePopup}>
                                    <span>
                                      {car.brand.name}
                                      <br />
                                      {car.carname}
                                    </span>
                                  </div>
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      </div>

                      <div className="thetitelofbrandsss">Popular Brands</div>
                      {!loading && !error && brands.length > 0 && (
                        <div className="mt-3 d-flex flex-column gap-1">
                          {brands.map((brand) => (
                            <div key={brand._id}>
                              <div
                                className="thebrandhead"
                                onClick={() => toggleBrandVisibility(brand._id)}
                                style={{ cursor: "pointer" }}
                              >
                                <span className="branddnere">{brand.name}</span>
                                <svg
                                  width="15"
                                  height="7"
                                  viewBox="0 0 15 7"
                                  fill="none"
                                  xmlns="http://www.w3.org/2000/svg"
                                  className={
                                    visibleBrand === brand._id ? "rotated" : ""
                                  }
                                >
                                  <path
                                    d="M1.40039 0.864746L7.40039 6.19808L13.40039 0.864746"
                                    stroke="#040404"
                                    strokeWidth="1.33333"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                  />
                                </svg>
                              </div>
                              {visibleBrand === brand._id &&
                              products[brand._id]?.length > 0 ? (
                                <div className="thevarientsof">
                                  {products[brand._id].map((product) => (
                                    <>
                                      <div
                                        key={product._id}
                                        className="theendsidecar pe-auto"
                                        onClick={() =>
                                          handleProductClick(product)
                                        }
                                      >
                                        {product.carname}
                                      </div>
                                      <div className="the-deviderbt-neftt w-75 mb-1 mr-5"></div>
                                    </>
                                  ))}
                                </div>
                              ) : (
                                visibleBrand === brand._id && (
                                  <p>Loading cars for {brand.name}...</p>
                                )
                              )}
                              <div className="the-deviderbt-neftt w-100"></div>
                            </div>
                          ))}
                        </div>
                      )} */}
                    </>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ChangeCarPriceBreakUp;
