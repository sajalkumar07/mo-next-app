import React, { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";
import { X, Search, MapPin } from "lucide-react";
import PropTypes from "prop-types";

const ChangeCar = ({ product, brand, productname }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleBrand, setVisibleBrand] = useState(null);
  const [popularCars, setPopularCars] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [variantSearchTerm, setVariantSearchTerm] = useState("");
  const [carSearchTerm, setCarSearchTerm] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);

  const popularCarsRef = useRef(null);
  let activeRequestController = null;

  // Normalize brand data
  const normalizeBrand = (brandData) => {
    if (!brandData) return null;
    if (typeof brandData === "string") {
      return (
        brands.find((b) => b._id === brandData) || {
          _id: brandData,
          name: brandData,
        }
      );
    }
    return brandData;
  };

  // Get brand name with fallbacks
  const getBrandName = () => {
    if (selectedBrand) {
      if (typeof selectedBrand === "string") return selectedBrand;
      if (selectedBrand.name) return selectedBrand.name;
    }
    if (brand) {
      if (typeof brand === "string") return brand;
      if (brand.name) return brand.name;
    }
    if (selectedProduct?.brand) {
      if (typeof selectedProduct.brand === "string")
        return selectedProduct.brand;
      if (selectedProduct.brand.name) return selectedProduct.brand.name;
    }
    if (product?.brand) {
      if (typeof product.brand === "string") return product.brand;
      if (product.brand.name) return product.brand.name;
    }
    return "Select Brand";
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
  const handleCarSearchInput = (e) => {
    const value = e.target.value;
    setCarSearchTerm(value);
  };

  // Handle variant search
  const handleVariantSearch = (e) => {
    setVariantSearchTerm(e.target.value.toLowerCase());
  };

  // Filter variants
  const filteredVariants = selectedVariant
    ? selectedVariant.filter((variant) => {
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

  // Fetch brands
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

  // Fetch products for brand
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

  // Fetch variants for product
  const handleProductClick = async (productId) => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/variants/active/${productId}`
      );
      const data = await response.json();
      setSelectedVariant(data.data);
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  // Fetch popular cars
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

  // Handle product selection
  const handleProductClick2 = async (product) => {
    try {
      setSelectedProduct(product);
      if (product.brand) {
        const normalizedBrand = normalizeBrand(product.brand);
        setSelectedBrand(normalizedBrand);
      }
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/variants/active/${product._id}`
      );
      const data = await response.json();
      setSelectedVariant(data.data);
    } catch (error) {
      console.error("Error fetching variants:", error);
    }
  };

  // Handle search result selection
  const handleSearchResultClick = (car) => {
    setSelectedProduct(car);
    setSelectedBrand(normalizeBrand(car.brand));
    setCarSearchTerm("");
    setSearchResults([]);
    setSelectedFuelType(null);
    setVariantSearchTerm("");
    handleProductClick(car._id);
  };

  // Toggle brand visibility
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

  // Initialize component
  useEffect(() => {
    fetchBrands();
    fetchPopularCars();
  }, []);

  // Initialize selected product and brand
  useEffect(() => {
    if (product) {
      setSelectedProduct(product);
      const initialBrand = normalizeBrand(brand || product?.brand);
      setSelectedBrand(initialBrand);
      handleProductClick(product._id || product);
    }
  }, [product, brand, brands]);

  // Handle car search
  useEffect(() => {
    if (carSearchTerm.trim() === "") {
      setSearchResults([]);
      setIsSearching(false);
    } else if (carSearchTerm.length > 2) {
      debouncedSearch(carSearchTerm);
    }
  }, [carSearchTerm]);

  return (
    <div>
      <div
        className="changecar-product active"
        onClick={() => setShowPopup(true)}
      >
        CHANGE CAR
      </div>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px] w-[346px] h-[400px] shadow-lg flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-gray-200">
              <h2 className="text-[16px] font-semibold text-[#818181]">
                SELECT YOUR <span className="text-[#B10819]">VARIANT</span>
              </h2>
              <button
                className="text-black hover:text-[#B10819] transition-colors"
                onClick={() => {
                  setShowPopup(false);
                  setSelectedFuelType(null);
                  setVariantSearchTerm("");
                  setCarSearchTerm("");
                  setSearchResults([]);
                  setSelectedProduct(product);
                  setSelectedBrand(normalizeBrand(brand || product?.brand));
                }}
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
                      value={variantSearchTerm}
                      onChange={handleVariantSearch}
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
                      {getBrandName()}
                      <span
                        onClick={() => {
                          setSelectedProduct(null);
                          setSelectedBrand(null);
                          setSelectedVariant([]);
                        }}
                        className="pe-auto cursor-pointer"
                      >
                        ✖
                      </span>
                    </span>
                    <span className="selectedofthesec">
                      {selectedProduct.carname || productname}
                      <span
                        onClick={() => {
                          setSelectedProduct(null);
                          setSelectedVariant([]);
                        }}
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
                                    to={`/variant/${variant.varientName?.replace(
                                      /\s+/g,
                                      "-"
                                    )}/${variant._id}`}
                                    onClick={() => setShowPopup(false)}
                                  >
                                    <div className="border-b border-dotted border-black pb-2 mb-2 flex justify-between w-full items-center">
                                      <div className="flex flex-col">
                                        <p className="text-[14px] text-[#B1081A] font-[Montserrat]">
                                          {variant.varientName}
                                        </p>
                                        <p className="text-[14px] text-[#818181] font-[Montserrat]">
                                          {variant.fuel} {variant.transmission}
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
                      value={carSearchTerm}
                      onChange={handleCarSearchInput}
                      className="w-full h-[40px] border border-slate-300 px-4 text-black"
                      autoFocus
                    />
                    <div className="absolute inset-y-0 right-0 flex justify-center items-center">
                      <button className="bg-black text-white w-[38px] h-[38px] flex justify-center items-center">
                        <Search size={16} />
                      </button>
                    </div>
                  </div>

                  {carSearchTerm.trim() !== "" && carSearchTerm.length > 2 ? (
                    <div className="flex-1 overflow-y-auto scrollbar-hide">
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
                                {/* <div className="text-[10px] text-gray-500 mt-1">
                                  {result.seater && `${result.seater} seater`}
                                  {result.fueltype && ` • ${result.fueltype}`}
                                  {result.NCAP && ` • Safety: ${result.NCAP}`}
                                </div> */}
                              </div>
                            </div>
                          </div>
                        ))
                      ) : (
                        <p className="py-3 px-4 text-gray-500">No Car Found</p>
                      )}
                    </div>
                  ) : (
                    <></>
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

ChangeCar.propTypes = {
  product: PropTypes.shape({
    _id: PropTypes.string,
    carname: PropTypes.string,
    brand: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.shape({
        _id: PropTypes.string,
        name: PropTypes.string,
      }),
    ]),
  }),
  brand: PropTypes.oneOfType([
    PropTypes.string,
    PropTypes.shape({
      _id: PropTypes.string,
      name: PropTypes.string,
    }),
  ]),
  productname: PropTypes.string,
};

ChangeCar.defaultProps = {
  product: null,
  brand: null,
  productname: "",
};

export default ChangeCar;
