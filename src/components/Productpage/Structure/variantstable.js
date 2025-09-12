import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";

// Utility functions with Cards.js logic
const formatPrice = (price) => {
  if (!price) return "N/A";

  const priceInLakhs = (price / 100000).toFixed(1);
  if (price >= 10000000) {
    return `${(price / 10000000).toFixed(1)} Crore`;
  }
  return `${priceInLakhs} Lakh`;
};

const formatPriceToLakhs = (price) => {
  const priceInLakhs = (price / 100000).toFixed(1);
  return `${priceInLakhs}`;
};

// Helper function to get RTO data based on fuel and price range (from ProductSection)
const getDataFromRoadPriceListBasedOnFuelAndPriceRange = (
  priceList,
  productPrice,
  fuelType
) => {
  const price = parseFloat(productPrice) || 0;
  const fuel = (fuelType || "").toUpperCase();

  return (
    priceList.find(
      (rto) =>
        price >= parseFloat(rto.startPrice || 0) &&
        (rto.endPrice === "ABOVE"
          ? true
          : price <= parseFloat(rto.endPrice || Infinity)) &&
        (rto.fuelType || "").toUpperCase() === fuel.toUpperCase()
    ) || {}
  );
};

// Calculate RTO price based on mobile app logic (from ProductSection)
const calculateRtoPrice = (productPrice, rtoPercentage, amount, fuelType) => {
  const price = parseInt(productPrice);
  let rto = Math.ceil((parseFloat(rtoPercentage) * price) / 100);

  // Flat amount for EVs or when percentage is 0
  // Note: hybrid is now treated as petrol, so this condition won't apply to hybrid
  if (fuelType.toLowerCase() === "electric" || rtoPercentage === "0") {
    rto += parseInt(amount || "0");
  }

  return rto;
};

// Calculate Road Safety Tax (2% of RTO) (from ProductSection)
const calculateRoadSafetyTax = (rto) => Math.ceil((rto * 2) / 100);

// Calculate Insurance price (from ProductSection)
const calculateInsurancePrice = (productPrice, insurancePercentage) => {
  return Math.ceil(
    (parseInt(productPrice) * parseFloat(insurancePercentage)) / 100
  );
};

// Normalize fuel type (from ProductSection)
const normalizeFuelType = (fuelType) => {
  if (!fuelType) return "";
  const normalizedFuel = fuelType.toLowerCase();
  // Treat hybrid as petrol for calculation purposes
  if (normalizedFuel.includes("hybrid")) {
    return "petrol";
  }
  return normalizedFuel;
};

// Main on-road price calculation using ProductSection logic
const calculateOnRoadPrice = (product, fuelType, rtoData) => {
  // 1. Extract price (handles both variant and direct car data)
  let priceValue;
  if (typeof product === "object") {
    priceValue =
      product.exShowroomPrice || // Variant price first
      product.lowestExShowroomPrice || // Fallback to car price
      0;
  } else {
    priceValue = product; // Direct number input
  }

  const priceStr = priceValue.toString();

  // 2. Validate inputs
  if (!/[0-9]/.test(priceStr)) return 0;
  if (!Array.isArray(rtoData) || rtoData.length === 0)
    return parseFloat(priceValue) || 0;

  const normalizedFuelType = normalizeFuelType(fuelType);

  // 3. Get RTO rates based on price and fuel type
  const roadPriceData = getDataFromRoadPriceListBasedOnFuelAndPriceRange(
    rtoData,
    priceStr,
    normalizedFuelType
  );

  const basePrice = parseInt(priceStr) || 0;

  // 4. Calculate all components
  const components = {
    basePrice,
    rto: calculateRtoPrice(
      priceStr,
      roadPriceData.rtoPercentage || "0",
      roadPriceData.amount || "0",
      normalizedFuelType
    ),
    roadSafetyTax: 0, // Will be calculated below
    insurance: calculateInsurancePrice(
      priceStr,
      roadPriceData.insurancePercentage || "0"
    ),
    luxuryTax: basePrice > 999999 ? Math.ceil(basePrice / 100) : 0,
    hypethecationCharges: parseInt(roadPriceData.hypethecationCharges || "0"),
    fastag: parseInt(roadPriceData.fastag || "0"),
    others: parseInt(roadPriceData.others || "0"),
  };

  // Road safety tax is 2% of RTO
  components.roadSafetyTax = calculateRoadSafetyTax(components.rto);

  // 5. Sum all components
  return Object.values(components).reduce((sum, val) => sum + val, 0);
};

// Extract first fuel type from various formats (from ProductSection)
const getFirstFuelType = (fuelData) => {
  if (Array.isArray(fuelData)) {
    return fuelData[0];
  }
  if (typeof fuelData === "string") {
    const match = fuelData.match(/<li>(.*?)<\/li>/i);
    if (match && match[1]) return match[1];
    return fuelData;
  }
  return "";
};

// Format currency with Lakhs/Crore suffixes (from ProductSection)
const formatCurrency = (value) => {
  if (!value) return "0"; // Handle undefined/null cases

  const numValue =
    typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

  if (numValue >= 1e7) {
    // 1 crore or more
    const croreValue = (numValue / 1e7).toFixed(2);
    return `${croreValue} Crore`;
  } else if (numValue >= 1e5) {
    // 1 lakh or more
    const lakhValue = (numValue / 1e5).toFixed(2);
    return `${lakhValue} Lakh`;
  } else {
    return new Intl.NumberFormat("en-IN").format(numValue);
  }
};
// Custom hook for RTO data and location (updated with ProductSection logic)
const useRTOData = () => {
  const [rtoData, setRtoData] = useState([]);
  const [hasLocation, setHasLocation] = useState(false);

  useEffect(() => {
    const locationData = localStorage.getItem("location");
    try {
      const parsedLocation = JSON.parse(locationData);
      if (parsedLocation && parsedLocation.city) {
        setHasLocation(true);
      }
    } catch (e) {
      setHasLocation(false);
    }
  }, []);

  // Fetch RTO data using ProductSection method
  useEffect(() => {
    const fetchRTOData = async () => {
      const locationState = localStorage.getItem("location");
      let parsedLocationState;

      try {
        parsedLocationState = JSON.parse(locationState);
      } catch (e) {
        return;
      }

      if (!parsedLocationState || !parsedLocationState.state) {
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/v1/onroad-procing-for-website-landingpage`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ state: parsedLocationState.state }),
          }
        );

        const result = await response.json();
        if (result.data && Array.isArray(result.data)) {
          setRtoData(result.data);
        }
      } catch (error) {
        console.error("Error fetching RTO data:", error);
        setRtoData([]);
      }
    };

    fetchRTOData();
  }, []);

  return { rtoData, hasLocation };
};

// Price calculation utility (updated with ProductSection logic)
const calculatePriceRange = (data, ranking, filterType, rtoData) => {
  const filteredVariants = data.filter(
    (variant) =>
      variant.VarientRanking === ranking &&
      (filterType === "All" ||
        variant.fuel === filterType ||
        variant.transmission === filterType)
  );

  if (filteredVariants.length === 0) return { min: 0, max: 0, single: null };
  if (filteredVariants.length === 1) {
    const onRoadPrice = calculateOnRoadPrice(
      filteredVariants[0].exShowroomPrice,
      filteredVariants[0].fuel,
      rtoData
    );
    return {
      min: filteredVariants[0].exShowroomPrice,
      max: null,
      single: filteredVariants[0].exShowroomPrice,
      onRoadMin: onRoadPrice,
      onRoadMax: null,
      onRoadSingle: onRoadPrice,
    };
  }

  const prices = filteredVariants.map((variant) => variant.exShowroomPrice);
  const onRoadPrices = filteredVariants.map((variant) =>
    calculateOnRoadPrice(variant.exShowroomPrice, variant.fuel, rtoData)
  );

  return {
    min: Math.min(...prices),
    max: Math.max(...prices),
    single: null,
    onRoadMin: Math.min(...onRoadPrices),
    onRoadMax: Math.max(...onRoadPrices),
    onRoadSingle: null,
  };
};

// Generic Variant Component (updated with ProductSection logic)
const VariantCard = ({
  variant,
  rtoData,
  hasLocation,
  isExpanded,
  onToggleExpansion,
}) => {
  const onRoadPrice = calculateOnRoadPrice(
    variant.exShowroomPrice,
    variant.fuel,
    rtoData
  );

  return (
    <>
      {/* Desktop Version */}
      <div className="table-info-section onlydesptop" key={variant._id}>
        <div className="irst-table-main-section">
          <Link
            to={`/variant/${variant.varientName.replace(/\s+/g, "-")}/${
              variant._id
            }`}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="d-flex align-items-center">
                <div className="modelsnmae">{variant.varientName}</div>
                <div className="infoaftermodel">
                  <div>{variant.EngineName}</div>
                  <div>{variant.transmission}</div>
                </div>
              </div>
              <div className="infoaftermodel2">
                <div>Price Starts</div>
                <div className="infoaftermodellast">
                  {hasLocation ? (
                    <>
                      <div>On-road: @ ₹{formatCurrency(onRoadPrice)} Lakhs</div>
                    </>
                  ) : (
                    <>@ ₹{formatPriceToLakhs(variant.exShowroomPrice)}L</>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>

        <div
          className={`irst-table-main-section dfjvdjfvdj ${
            isExpanded ? "expanded" : ""
          }`}
          style={{
            height: isExpanded ? "auto" : "100px",
            overflow: "hidden",
            transition: "height 0.3s ease",
          }}
        >
          <div
            className="key-feagture"
            style={{
              height: isExpanded ? "auto" : "85px",
              overflow: "hidden",
              transition: "height 0.3s ease",
            }}
          >
            <span className="text-black font-bold">Key Features:</span>
            <div
              className="varients-key"
              dangerouslySetInnerHTML={{ __html: variant.FeatureExplained }}
            />
          </div>
          <span
            className="showmoree"
            onClick={() => onToggleExpansion(variant._id)}
          >
            {isExpanded ? "Show less" : "Show more"}
          </span>
        </div>
      </div>

      {/* Mobile Version */}
      <div
        className="flex flex-col bg-white border shadow-md shadow-black/30 mt-4 onlyphoneme w-[400px]"
        key={`mobile-${variant._id}`}
      >
        <div className="md:bg-[var(--lightgray)] pt-[10px] pr-[20px] pb-[10px] pl-[20px] md:border-[1px] border-black h-auto">
          <Link
            to={`/variant/${variant.varientName.replace(/\s+/g, "-")}/${
              variant._id
            }`}
          >
            <div className="d-flex justify-content-between align-items-center">
              <div className="flex flex-col items-start space-y-2">
                <div className="text-[14px] text-[#AB373A] font-[Montserrat] font-semibold">
                  {variant.varientName}
                </div>
                <div className="text-[11px] text-black font-[Montserrat] font-medium">
                  {variant.fuel} | {variant.transmission} | {variant.max_power}{" "}
                  Bhp
                </div>
              </div>
              <div className="infoaftermodel2">
                <div className="infoaftermodellast">
                  {hasLocation ? (
                    <div className="flex flex-col">
                      <span className="text-[#828282] text-right">On-road</span>
                      <span className="text-right font-bold">
                        ₹{formatCurrency(onRoadPrice)}
                      </span>
                    </div>
                  ) : (
                    <div className="flex flex-col">
                      <span className="text-black text-right">Ex-showroom</span>
                      <span>₹{formatCurrency(variant.exShowroomPrice)}</span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </Link>
        </div>

        <main>
          <div
            className={`md:bg-[var(--lightgray)] pt-[10px] pr-[20px] pb-[10px] pl-[20px] md:border-[1px] border-black h-auto dfjvdjfvdj ${
              isExpanded ? "expanded" : ""
            }`}
            style={{
              height: isExpanded ? "auto" : "100px",
              overflow: "hidden",
              transition: "height 0.3s ease",
            }}
          >
            <div
              className="key-feagture fuelsdd"
              style={{
                height: isExpanded ? "auto" : "85px",
                overflow: "hidden",
                transition: "height 0.3s ease",
              }}
            >
              <span className="text-black font-bold">Key Features:</span>
              <div
                className="varients-key"
                dangerouslySetInnerHTML={{ __html: variant.FeatureExplained }}
              />
            </div>
            <span
              className="showmoree pricoos float-right"
              onClick={() => onToggleExpansion(variant._id)}
            >
              {isExpanded ? "Read less" : "Read more"}
            </span>
          </div>
        </main>
      </div>
    </>
  );
};

// Generic Variants Table Component (updated with ProductSection logic)
const VariantsTable = ({
  allVariant,
  filterType,
  ranking,
  modelName,
  modelCode,
  rtoData,
  hasLocation,
}) => {
  const [expandedVariants, setExpandedVariants] = useState({});
  const [showAll, setShowAll] = useState(false);
  const params = useParams();

  const toggleVariantExpansion = (variantId) => {
    setExpandedVariants((prev) => ({
      ...prev,
      [variantId]: !prev[variantId],
    }));
  };

  const priceRange =
    allVariant.success && allVariant.data
      ? calculatePriceRange(allVariant.data, ranking, filterType, rtoData)
      : {
          min: 0,
          max: 0,
          single: null,
          onRoadMin: 0,
          onRoadMax: 0,
          onRoadSingle: null,
        };

  const filteredVariants =
    allVariant.success && allVariant.data
      ? allVariant.data.filter(
          (variant) =>
            variant.VarientRanking === ranking &&
            (filterType === "All" ||
              variant.fuel === filterType ||
              variant.transmission === filterType)
        )
      : [];

  const hasVariants = filteredVariants.length > 0;

  if (!hasVariants) return null;

  return (
    <section className="mt-3 varient-table-sec">
      <div className="inside-var-tablesection">
        <div>
          <div className="d-flex align-items-center varient-boxx">
            <div className="model-first-shape">
              <span className="text-inside-shape">{modelName}</span>
            </div>
            <div className="model-second-shape">
              <span className="text-inside-shape2">{modelCode}</span>
            </div>
            <div className="model-three-shape">
              <span className="text-inside-shape3">
                {priceRange.single ? (
                  <>
                    <div>
                      Ex-showroom: ₹ {formatCurrency(priceRange.single)}
                    </div>
                    {hasLocation && (
                      <div>
                        On-road: ₹ {formatCurrency(priceRange.onRoadSingle)}{" "}
                      </div>
                    )}
                  </>
                ) : (
                  <>
                    <div>
                      Ex-showroom: ₹ {formatCurrency(priceRange.min)} - ₹{" "}
                      {formatCurrency(priceRange.max)}
                    </div>
                    {hasLocation && (
                      <div>
                        On-road: ₹ {formatCurrency(priceRange.onRoadMin)} - ₹{" "}
                        {formatCurrency(priceRange.onRoadMax)}
                      </div>
                    )}
                  </>
                )}
              </span>
            </div>
          </div>

          {window.innerWidth <= 1080 && (
            <div className="bg-[#ab373a] flex justify-between items-center px-2 h-[35px] text-[13px] font-bold text-white font-[Montserrat] mx-[10px] rounded-[2px]">
              <span>{modelName}</span>
              <div className="flex justify-center items-center">
                <span>
                  <Link to={`/detailvarient/${params.id}`}>
                    <div>
                      <span>See all ({filteredVariants.length}) Variant</span>
                    </div>
                  </Link>
                </span>
                <span>
                  <ChevronRight />
                </span>
              </div>
            </div>
          )}

          <section className="d-flex kfgkjfsgbfvv">
            {filteredVariants
              .slice(
                0,
                showAll || window.innerWidth > 1080
                  ? filteredVariants.length
                  : 1
              )
              .map((variant) => (
                <VariantCard
                  key={variant._id}
                  variant={variant}
                  rtoData={rtoData}
                  hasLocation={hasLocation}
                  isExpanded={expandedVariants[variant._id]}
                  onToggleExpansion={toggleVariantExpansion}
                />
              ))}
          </section>
        </div>
      </div>
    </section>
  );
};

// Main Component
const AllVariant = () => {
  const [allVariant, setAllVariant] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [availableFilters, setAvailableFilters] = useState(["All"]);
  const params = useParams();
  const { rtoData, hasLocation } = useRTOData();

  const extractAvailableFilters = (variants) => {
    const fuels = variants.map((variant) => variant.fuel);
    const uniqueFilters = ["All", ...new Set(fuels)];
    setAvailableFilters(uniqueFilters);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/variants/active/${params.id}`
        );
        const data = await response.json();
        if (data.success && data.data) {
          setAllVariant(data);
          extractAvailableFilters(data.data);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  const variantConfigs = [
    { ranking: "BASE", modelName: "BASE VARIANT", modelCode: "XT" },
    { ranking: "MID", modelName: "MID VARIANT", modelCode: "XM" },
    { ranking: "TOP", modelName: "TOP VARIANT", modelCode: "XZ" },
  ];

  return (
    <>
      <div className="d-flex align-items-center justify-content-center allfilterss">
        <ul className="search_tabs onlymobilekkft">
          {availableFilters.map((filter) => (
            <div
              key={filter}
              className={`full_tabs_new_varia ${
                filterType === filter ? "active" : ""
              }`}
              onClick={() => setFilterType(filter)}
              style={{ cursor: "pointer" }}
            >
              <li>{filter.toUpperCase()}</li>
            </div>
          ))}
        </ul>
      </div>

      {variantConfigs.map((config) => (
        <VariantsTable
          key={config.ranking}
          allVariant={allVariant}
          filterType={filterType}
          ranking={config.ranking}
          modelName={config.modelName}
          modelCode={config.modelCode}
          rtoData={rtoData}
          hasLocation={hasLocation}
        />
      ))}
    </>
  );
};

export default AllVariant;
