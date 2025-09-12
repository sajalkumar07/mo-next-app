import React, { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

const Addcarpopup = ({ selectedProductIds, setSelectedProductIds }) => {
  const [showPopup, setShowPopup] = useState(false);
  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleBrand, setVisibleBrand] = useState(null);
  const [popularCars, setPopularCars] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState([]);
  const popularCarsRef = useRef(null);

  // Fetch list of brands
  const fetchBrands = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API}/brands`);
      const data = await response.json();
      setBrands(data);
    } catch (err) {
      setError("Failed to fetch brands");
    } finally {
      setLoading(false);
    }
  };

  // Fetch products for a specific brand
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

  // Fetch popular cars based on popularity score
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

  // Handle product selection and fetch variants for it
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

  // Handle selection of product IDs and update the parent state
  const handleSelectProduct = (productId) => {
    setSelectedProductIds((prevIds) => {
      if (prevIds.includes(productId)) {
        return prevIds.filter((id) => id !== productId); // Deselect if already selected
      }
      return [...prevIds, productId]; // Add productId to selected list
    });
  };

  const toggleBrandVisibility = (brandId) => {
    setVisibleBrand((prev) => (prev === brandId ? null : brandId));
  };

  const handleViewPriceBreakup = () => setShowPopup(true);
  const handleClosePopup = () => setShowPopup(false);

  const handleScroll = () => {
    if (popularCarsRef.current) {
      popularCarsRef.current.scrollLeft += 200;
    }
  };

  useEffect(() => {
    fetchBrands();
    fetchPopularCars();
  }, []);

  useEffect(() => {
    if (brands.length > 0) {
      brands.forEach((brand) => fetchProductsForBrand(brand._id));
    }
  }, [brands]);

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
          <div style={popupStyles.popup}>
            <button style={popupStyles.closeButton} onClick={handleClosePopup}>
              ✖
            </button>
            <div className="inside_card_title_product d-flex align-items-center justify-content-center mt-1">
              SELECT YOURT&nbsp;<span>PRODUCT</span>
            </div>

            {loading && (
              <div className="mt-3">
                <Skeleton height={50} count={5} />
              </div>
            )}

            {error && <p style={{ color: "red" }}>{error}</p>}
            {selectedProduct ? (
              <div>
                <div>
                  <span>
                    {selectedProduct.brand.name}
                    <span
                      onClick={() => setSelectedProduct(null)}
                      className="pe-auto"
                    >
                      ✖
                    </span>
                  </span>
                  <span>
                    {selectedProduct.carname}
                    <span
                      onClick={() => setSelectedProduct(null)}
                      className="pe-auto"
                    >
                      ✖
                    </span>
                  </span>
                </div>
                {selectedVariant && selectedVariant.length > 0 ? (
                  selectedVariant.map((variant) => (
                    <div key={variant._id} className="pe-auto">
                      <div className="d-flex justify-content-between mb-2">
                        <span className="d-flex flex-column align-items-baseline gap-1">
                          <span className="redtext">{variant.varientName}</span>
                          <span className="redtgrayy">{variant.fuel}</span>
                        </span>
                        <span className="d-flex align-items-center thetext">
                          ₹ {variant.exShowroomPrice}
                        </span>
                      </div>
                      <div className="the-deviderbt-neftt w-100 mb-2"></div>
                    </div>
                  ))
                ) : (
                  <p>No variants available for this product.</p>
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
                        {visibleBrand === brand._id && products[brand._id] && (
                          <div className="thevarientsof">
                            {products[brand._id].map((product) => (
                              <div
                                key={product._id}
                                className="theendsidecar pe-auto"
                                onClick={() => handleProductClick(product)}
                              >
                                {product.carname}
                              </div>
                            ))}
                          </div>
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
  closeButton: {
    position: "absolute",
    marginTop: "-10px",
    width: "400px",
    border: "none",
    background: "transparent",
    fontSize: "18px",
    cursor: "pointer",
  },
};

export default Addcarpopup;
