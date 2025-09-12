import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const ViewPriceBreakup = ({ params, brandName }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [brands, setBrands] = useState([]); // List of brands
  const [products, setProducts] = useState({}); // Store products by brand ID
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleBrand, setVisibleBrand] = useState(null); // State for toggling visibility of products
  const [popularCars, setPopularCars] = useState([]);

  // Fetch the list of brands
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

  // Fetch products for each brand based on brand ID
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

  // Effect to fetch brands on component mount
  useEffect(() => {
    fetchBrands();
  }, []);

  // Fetch popular cars
  const fetchPopularCars = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/extra/get-all-cars-for-popularity`
      );
      const data = await response.json();
      if (data.success) {
        // Filter cars with valid popularity (1-5) and sort by popularity
        const sortedCars = data.data
          .filter(
            (car) =>
              car.popularity && car.popularity >= 1 && car.popularity <= 5
          )
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

  useEffect(() => {
    fetchPopularCars();
  }, []);

  // Effect to fetch products for each brand after brands are loaded
  useEffect(() => {
    if (brands.length > 0) {
      brands.forEach((brand) => {
        fetchProductsForBrand(brand._id);
      });
    }
  }, [brands]);

  const handleViewPriceBreakup = () => {
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const toggleBrandVisibility = (brandId) => {
    setVisibleBrand((prev) => (prev === brandId ? null : brandId));
  };
  const popularCarsRef = useRef(null);

  const handleScroll = () => {
    if (popularCarsRef.current) {
      popularCarsRef.current.scrollLeft += 200; // Adjust scroll distance as needed
    }
  };

  return (
    <div>
      <div
        className="changecar-product active"
        onClick={handleViewPriceBreakup}
      >
        CHANGE CAR
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

            {/* Scrollable Content Area */}
            <div className="flex-1 overflow-y-auto">
              {loading && (
                <div className="mt-3">
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                  <Skeleton height={50} />
                </div>
              )}

              {error && <p style={{ color: "red" }}>{error}</p>}

              <div className="thetitelofbrandsss mt-3">
                Popular Alternatives
              </div>
              <div className="d-flex align-items-center justify-content-center w-100 all-inonecard">
                <div
                  ref={popularCarsRef}
                  className="popular-cars-section d-flex"
                  style={{ overflowX: "auto", scrollBehavior: "smooth" }} // Add smooth scrolling
                >
                  {!loading && !error && popularCars.length > 0 && (
                    <div className="popular-cars-list d-flex">
                      {popularCars.map((car) => (
                        <div key={car._id} className="popular-car-card">
                          <Link
                            to={`/product/${car.carname.replace(/\s+/g, "-")}/${
                              car._id
                            }`}
                            onClick={handleClosePopup}
                          >
                            <span>
                              {car.brand.name}
                              <br />
                              {car.carname}
                            </span>
                          </Link>
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
              {/* Display variants */}
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
                            d="M1.40039 0.864746L7.40039 6.19808L13.4004 0.864746"
                            stroke="#040404"
                            strokeWidth="1.33333"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      {visibleBrand === brand._id && products[brand._id] && (
                        <div className="thevarientsof">
                          {products[brand._id].map((product) => (
                            <>
                              <Link
                                to={`/product/${product.carname.replace(
                                  /\s+/g,
                                  "-"
                                )}/${product._id}`}
                                key={product._id}
                                className="theendsidecar"
                                onClick={handleClosePopup}
                              >
                                {product.carname}
                              </Link>
                              <div className="the-deviderbt-neftt"></div>
                            </>
                          ))}
                        </div>
                      )}
                      <div className="the-deviderbt-neftt w-100"></div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Styles for Popup
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
    cursor: "default",
  },
};

export default ViewPriceBreakup;
