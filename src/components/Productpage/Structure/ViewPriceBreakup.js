import React, { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { Link } from "react-router-dom";

const ViewPriceBreakup = ({ product, brand, productname }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleBrand, setVisibleBrand] = useState(null);
  const [popularCars, setPopularCars] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null); // Initially set to null
  const [selectedVariant, setSelectedVariant] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState(null);

  // Ref to scroll popular cars
  const popularCarsRef = useRef(null);

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

  // for props only
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
      setSelectedProduct(product); // Ensure product object is selected
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/variants/active/${product}`
      );
      const data = await response.json();
      setSelectedVariant(data.data);
    } catch (error) {
      // console.error('Error fetching variants:', error);
    }
  };

  // for Manual select only

  const fetchProductsForBrand2 = async (brandId) => {
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

  const handleProductClick2 = async (product) => {
    try {
      const brandId = product.brand?._id || brand; // Use the brand ID from the product or the selected brand
      setSelectedProduct(product); // Ensure product object is selected
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/variants/active/${product._id}`
      );
      const data = await response.json();
      setSelectedVariant(data.data);
    } catch (error) {
      // console.error('Error fetching variants:', error);
    }
  };

  const handleViewPriceBreakup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => setShowPopup(false);

  const handleScroll = () => {
    if (popularCarsRef.current) {
      popularCarsRef.current.scrollLeft += 200;
    }
  };

  const handleClearSelection = () => {
    setSelectedProduct(null);
    setSelectedVariant([]); // Clear the selected variants as well
  };

  // Toggle visibility of brand products
  // Toggle visibility of brand products and fetch them
  const toggleBrandVisibility = (brandId) => {
    if (visibleBrand === brandId) {
      setVisibleBrand(null); // Collapse if already visible
    } else {
      setVisibleBrand(brandId); // Expand this brand
      if (!products[brandId] || products[brandId].length === 0) {
        fetchProductsForBrand2(brandId); // Fetch products only if not already fetched
      }
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchPopularCars();
  }, []);

  useEffect(() => {
    if (brands.length > 0 && brand) {
      fetchProductsForBrand2(brand);
    }
  }, [brands, brand]);

  useEffect(() => {
    if (selectedProduct) {
      const selectedBrand = brands.find((b) => b._id === brand);
      if (selectedBrand) {
        fetchProductsForBrand2(selectedBrand._id);
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
        fetchProductsForBrand2(selectedBrand._id);
      }
      setSelectedProduct(product);
    }
  }, [product, brands]);

  const formatPrice = (price) => {
    if (price >= 10000000) {
      // Convert to crores
      return `${(price / 10000000).toFixed(2)} Crores`;
    } else if (price >= 100000) {
      // Convert to lakhs
      return `${(price / 100000).toFixed(2)} Lakhs`;
    }
    return `₹ ${price.toLocaleString()}`;
  };

  return (
    <div>
      {/* Trigger the popup with selected brand and product */}
      <div
        className="bg-[#555555] text-[8px] font-[Montserrat] text-center rounded-[6px] text-white px-[4px] py-[4px]"
        onClick={handleViewPriceBreakup}
      >
        VIEW PIRCE BREAKUP
      </div>

      {/* Popup Component */}
      {showPopup && (
        <div style={popupStyles.overlay}>
          <div className="bg-white w-[346px] h-[423px] p-4 rounded-2xl flex flex-col">
            <div className="flex items-center justify-between space-x-10 rounded-t-lg mb-4">
              <div className="text-center text-3xl font-semibold text-[#818181]">
                SELECT YOUR&nbsp;<span className="text-[#B10819]">PRODUCT</span>
              </div>
              <button
                className="text-xl text-black "
                onClick={handleClosePopup}
              >
                ✖
              </button>
            </div>

            <div className="flex-1 overflow-y-scroll">
              {loading && (
                <div className="mt-3">
                  <Skeleton height={50} count={5} />
                </div>
              )}

              {error && <p style={{ color: "red" }}>{error}</p>}
              {selectedProduct ? (
                <div>
                  <div className="d-flex mb-3 mt-3 gap-1">
                    <span className="selectedofthesec">
                      {brands.find((b) => b._id === brand)?.name}
                      <span onClick={handleClearSelection} className="pe-auto">
                        {" "}
                        ✖{" "}
                      </span>
                    </span>
                    <span className="selectedofthesec">
                      {selectedProduct.carname || productname}
                      <span onClick={handleClearSelection} className="pe-auto">
                        {" "}
                        ✖{" "}
                      </span>
                    </span>
                  </div>
                  {selectedVariant && selectedVariant.length > 0 ? (
                    <>
                      {/* Get unique fuel types from selected variants */}
                      <div className="d-flex gap-1 mb-3">
                        {selectedVariant
                          .map((variant) => variant.fuel) // Extract fuel types from variants
                          .filter(
                            (value, index, self) =>
                              self.indexOf(value) === index
                          ) // Remove duplicates
                          .map((fuelType) => (
                            <span
                              key={fuelType}
                              className={`selectedofthesec ${
                                selectedFuelType === fuelType ? "acoyjrjri" : ""
                              }`}
                              onClick={() => setSelectedFuelType(fuelType)}
                            >
                              {fuelType}
                            </span>
                          ))}
                      </div>
                      {/* Show filtered variants */}
                      {selectedVariant
                        .filter(
                          (variant) =>
                            selectedFuelType
                              ? variant.fuel === selectedFuelType
                              : true // Show all if no fuel type selected
                        )
                        .map((variant) => (
                          <div key={variant._id} className="pe-auto">
                            <Link
                              to={`/variant/${variant.varientName.replace(
                                /\s+/g,
                                "-"
                              )}/${variant._id}`}
                              onClick={handleClosePopup}
                            >
                              <div className="d-flex justify-content-between mb-2">
                                <span className="d-flex flex-column align-items-baseline gap-1">
                                  <span className="redtext">
                                    {variant.varientName}
                                  </span>
                                  <span className="redtgrayy">
                                    {variant.fuel}
                                  </span>
                                </span>
                                <span className="d-flex align-items-center thetext">
                                  ₹ {variant.exShowroomPrice}
                                </span>
                              </div>
                            </Link>
                            <div className="the-deviderbt-neftt w-100 mb-2"></div>
                          </div>
                        ))}
                    </>
                  ) : loading ? (
                    <div className="mt-3">
                      {/* Show skeleton loading */}
                      <Skeleton height={50} count={5} />
                    </div>
                  ) : (
                    <Skeleton height={50} count={5} />
                  )}
                </div>
              ) : (
                <>
                  <div className="thetitelofbrandsss mt-3">
                    Popular Alternatives
                  </div>
                  <div className="d-flex align-items-center justify-content-center w-100 all-inonecard">
                    <div
                      ref={popularCarsRef}
                      className="popular-cars-section d-flex"
                      style={{ overflowX: "auto", scrollBehavior: "smooth" }}
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
                    <div
                      className="postbtn"
                      onClick={handleScroll}
                      style={{ cursor: "pointer" }}
                    >
                      <svg
                        width="38"
                        height="38"
                        viewBox="0 0 38 38"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <rect
                          x="36.0008"
                          y="36.2"
                          width="34.4"
                          height="34.4"
                          rx="17.2"
                          transform="rotate(-180 36.0008 36.2)"
                          fill="#FCFCFC"
                          stroke="#818181"
                          strokeWidth="2.4"
                        />
                        <path
                          d="M17.2002 22.9993L21.2002 18.9993L17.2002 14.9993"
                          stroke="#818181"
                          strokeWidth="2"
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </svg>
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
                                    onClick={() => handleProductClick2(product)}
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

// Popup styles
const popupStyles = {
  overlay: {
    position: "fixed",
    top: 0,
    left: 0,
    width: "100%",
    height: "100%",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },
  popup: {
    background: "#fff",
    borderRadius: "8px",
    padding: "20px",
    width: "400px",
    maxHeight: "60%",
    overflowY: "scroll",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0, 0, 0, 0.1)",
  },
};

export default ViewPriceBreakup;
