import React, { useState, useEffect, useRef } from "react";
import Skeleton from "react-loading-skeleton";
import { Link, useParams } from "react-router-dom";
import { X, Search, MapPin } from "lucide-react";

const ChangeCarVariant = ({ product, brand, productname, variantId }) => {
  const { id } = useParams(); // Get ID from URL params

  const [brands, setBrands] = useState([]);
  const [products, setProducts] = useState({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [visibleBrand, setVisibleBrand] = useState(null);
  const [popularCars, setPopularCars] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState([]);
  const [selectedFuelType, setSelectedFuelType] = useState(null);
  const [variantSearchTerm, setVariantSearchTerm] = useState("");

  // New state for direct variant popup
  const [showVariantPopup, setShowVariantPopup] = useState(false);
  const [variants, setVariants] = useState([]);
  const [variantLoading, setVariantLoading] = useState(false);
  const [currentVariantData, setCurrentVariantData] = useState(null);
  const [dynamicProductId, setDynamicProductId] = useState(null);

  // Ref to scroll popular cars
  const popularCarsRef = useRef(null);

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

  // Fetch current variant data to get product ID
  const fetchCurrentVariantData = async (varId) => {
    try {
      setVariantLoading(true);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${varId}`
      );
      const data = await response.json();

      if (data.success && data.data) {
        setCurrentVariantData(data.data);
        // Extract product ID from the response
        const productId = data.data.product_id?._id;
        if (productId) {
          setDynamicProductId(productId);
          // Now fetch variants for this product
          fetchVariants(productId);
        }
      } else {
        console.error("Failed to fetch variant data");
      }
    } catch (error) {
      console.error("Error fetching variant data:", error);
    } finally {
      setVariantLoading(false);
    }
  };

  // Direct variant fetch function (updated to use dynamic product ID)
  const fetchVariants = async (productId) => {
    if (!productId) return;

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

  // Direct variant popup handler
  const handleDirectVariantPopup = () => {
    setShowVariantPopup(true);

    // Determine which variant ID to use
    const targetVariantId = variantId || id;

    if (targetVariantId) {
      // Fetch current variant data first to get product ID
      fetchCurrentVariantData(targetVariantId);
    } else if (dynamicProductId) {
      // If we already have product ID, fetch variants directly
      fetchVariants(dynamicProductId);
    } else {
      console.error("No variant ID available");
    }
  };

  const handleCloseVariantPopup = () => {
    setShowVariantPopup(false);
    setSelectedFuelType(null);
    setVariantSearchTerm("");
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
      setSelectedProduct(product);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/variants/active/${product._id}`
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
      const brandId = product.brand?._id || brand;
      setSelectedProduct(product);
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/variants/active/${product._id}`
      );
      const data = await response.json();
      setSelectedVariant(data.data);
    } catch (error) {
      // console.error('Error fetching variants:', error);
    }
  };

  const handleScroll = () => {
    if (popularCarsRef.current) {
      popularCarsRef.current.scrollLeft += 200;
    }
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
        fetchProductsForBrand2(brandId);
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

  // Initialize with variant ID if provided
  useEffect(() => {
    const targetVariantId = variantId || id;
    if (targetVariantId && !dynamicProductId) {
      fetchCurrentVariantData(targetVariantId);
    }
  }, [variantId, id]);

  const formatPrice = (price) => {
    if (price >= 10000000) {
      return `${(price / 10000000).toFixed(2)} Crores`;
    } else if (price >= 100000) {
      return `${(price / 100000).toFixed(2)} Lakhs`;
    }
    return `₹ ${price.toLocaleString()}`;
  };

  const formatPriceToLakhs = (price) => {
    if (!price) return "₹ N/A";

    // Convert price to number if it's a string
    const numericPrice =
      typeof price === "string" ? parseFloat(price.replace(/,/g, "")) : price;

    if (numericPrice >= 10000000) {
      // 1 crore or more
      const croreValue = (numericPrice / 10000000).toFixed(2);
      return `₹ ${croreValue} Cr`;
    } else if (numericPrice >= 100000) {
      // 1 lakh or more
      const lakhValue = (numericPrice / 100000).toFixed(2);
      return `₹ ${lakhValue} Lakh`;
    } else {
      return `₹ ${numericPrice.toLocaleString()}`;
    }
  };

  return (
    <div>
      <div className="flex gap-2">
        <div
          class="bg-transparent text-[#555555] font-[montserrat] text-[7.53px] font-bold   w-[83px] h-[20px] text-center cursor-pointer rounded-[6px] flex justify-center items-center border-[1px] border-[#555555]"
          onClick={handleDirectVariantPopup}
        >
          {" "}
          CHANGE VARIANT
        </div>
      </div>

      {/* Direct Variant Popup */}
      {showVariantPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-[10px]  w-[346px] h-[400px] shadow-lg flex flex-col">
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
                          className={`border rounded-3xl px-4 py-2 text-[#818181] cursor-pointer ${
                            selectedFuelType === fuelType
                              ? "bg-[#B10819] text-white"
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
                                to={`/pricebreakup/${variant._id}`}
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
                        {!variantLoading && "No variants available"}
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

export default ChangeCarVariant;
