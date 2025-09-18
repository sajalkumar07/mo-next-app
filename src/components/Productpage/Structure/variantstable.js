import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

const VariantsTable = () => {
  const [allVariant, setAllVariant] = useState([]);
  const [filterType, setFilterType] = useState("All");
  const [availableFilters, setAvailableFilters] = useState(["All"]);
  const [rtoData, setRtoData] = useState([]);
  const [hasLocation, setHasLocation] = useState(false);
  // Changed this to track single expanded accordion
  const [expandedVariant, setExpandedVariant] = useState(false);
  const [showAll, setShowAll] = useState(false);
  const params = useParams();
  const [singlecardData, setSingleCardData] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${params.id}`
        );
        const data = await response.json();
        setSingleCardData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  // Utility functions
  const formatCurrency = (value) => {
    if (!value) return "0";

    const numValue =
      typeof value === "string" ? parseFloat(value.replace(/,/g, "")) : value;

    if (numValue >= 1e7) {
      const croreValue = (numValue / 1e7).toFixed(2);
      return `${croreValue} Crore`;
    } else if (numValue >= 1e5) {
      const lakhValue = (numValue / 1e5).toFixed(2);
      return `${lakhValue} Lakh`;
    } else {
      return new Intl.NumberFormat("en-IN").format(numValue);
    }
  };

  const normalizeFuelType = (fuelType) => {
    if (!fuelType) return "";
    const normalizedFuel = fuelType.toLowerCase();
    if (normalizedFuel.includes("hybrid")) {
      return "petrol";
    }
    return normalizedFuel;
  };

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

  const calculateRtoPrice = (productPrice, rtoPercentage, amount, fuelType) => {
    const price = parseInt(productPrice);
    let rto = Math.ceil((parseFloat(rtoPercentage) * price) / 100);

    if (fuelType.toLowerCase() === "electric" || rtoPercentage === "0") {
      rto += parseInt(amount || "0");
    }

    return rto;
  };

  const calculateRoadSafetyTax = (rto) => Math.ceil((rto * 2) / 100);

  const calculateInsurancePrice = (productPrice, insurancePercentage) => {
    return Math.ceil(
      (parseInt(productPrice) * parseFloat(insurancePercentage)) / 100
    );
  };

  const calculateOnRoadPrice = (product, fuelType, rtoData) => {
    let priceValue;
    if (typeof product === "object") {
      priceValue =
        product.exShowroomPrice || product.lowestExShowroomPrice || 0;
    } else {
      priceValue = product;
    }

    const priceStr = priceValue.toString();

    if (!/[0-9]/.test(priceStr)) return 0;
    if (!Array.isArray(rtoData) || rtoData.length === 0)
      return parseFloat(priceValue) || 0;

    const normalizedFuelType = normalizeFuelType(fuelType);

    const roadPriceData = getDataFromRoadPriceListBasedOnFuelAndPriceRange(
      rtoData,
      priceStr,
      normalizedFuelType
    );

    const basePrice = parseInt(priceStr) || 0;

    const components = {
      basePrice,
      rto: calculateRtoPrice(
        priceStr,
        roadPriceData.rtoPercentage || "0",
        roadPriceData.amount || "0",
        normalizedFuelType
      ),
      roadSafetyTax: 0,
      insurance: calculateInsurancePrice(
        priceStr,
        roadPriceData.insurancePercentage || "0"
      ),
      luxuryTax: basePrice > 999999 ? Math.ceil(basePrice / 100) : 0,
      hypethecationCharges: parseInt(roadPriceData.hypethecationCharges || "0"),
      fastag: parseInt(roadPriceData.fastag || "0"),
      others: parseInt(roadPriceData.others || "0"),
    };

    components.roadSafetyTax = calculateRoadSafetyTax(components.rto);

    return Object.values(components).reduce((sum, val) => sum + val, 0);
  };

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

  const extractAvailableFilters = (variants) => {
    const fuels = variants.map((variant) => variant.fuel);
    const uniqueFilters = ["All", ...new Set(fuels)];
    setAvailableFilters(uniqueFilters);
  };

  // Fetch data
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

  // Check location
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

  // Fetch RTO data
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

  // Fixed accordion handler - only one accordion open at a time
  const handleAccordionChange = (variantId) => (event, isExpanded) => {
    setExpandedVariant(isExpanded ? variantId : false);
  };

  const variantConfigs = [
    { ranking: "BASE", modelName: "Base Variant", modelCode: "XT" },
    { ranking: "MID", modelName: "Mid Variant", modelCode: "XM" },
    { ranking: "TOP", modelName: "Top Variant", modelCode: "XZ" },
  ];

  // Function to clean HTML content and return array of features
  const cleanHTMLContent = (htmlString) => {
    if (!htmlString) return [];

    // Create a temporary div to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    // Get all list items first
    const listItems = tempDiv.querySelectorAll("li");

    if (listItems.length > 0) {
      // Extract text from each list item
      return Array.from(listItems)
        .map((li) => li.textContent.trim())
        .filter((item) => item.length > 0);
    }

    // If no list items, try to split by common separators
    let cleanText = tempDiv.textContent || tempDiv.innerText || "";

    return cleanText
      .split(/[,\n]/) // Split by comma or newline
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  };

  // Main render
  return (
    <div className="mt-20 font-sans px-4">
      <h2 className="text-[25px] font-bold text-center mb-6 font-sans mt-3">
        <span className="text-[#818181] uppercase">
          {singlecardData.carname}
        </span>{" "}
        <span className="text-[#B60C19]">VARIANTS</span>
      </h2>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4 ">
        <div className="hidden md:flex justify-center mb-4">
          <div className="flex gap-2">
            {availableFilters.map((filter) => (
              <button
                key={filter}
                className={`rounded-full text-[12px] sm:text-[14px] p-2  font-semibold transition-colors h-[36px] sm:h-[38px] border-[0.5px] border-gray-400  w-[100px] ${
                  filterType === filter
                    ? "bg-[#AB373A] text-white"
                    : "bg-gray-200 text-gray-700"
                }`}
                onClick={() => setFilterType(filter)}
              >
                {filter.toUpperCase()}
              </button>
            ))}
          </div>
        </div>

        {variantConfigs.map((config) => {
          const { ranking, modelName, modelCode } = config;

          const priceRange =
            allVariant.success && allVariant.data
              ? calculatePriceRange(
                  allVariant.data,
                  ranking,
                  filterType,
                  rtoData
                )
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
            <section className="" key={ranking}>
              {/* Header Section */}
              <div className="font-bold text-[18px] font-sans py-2">
                <div className="flex items-center justify-between flex-wrap gap-4 md:block hidden">
                  <div className="flex items-center space-x-2">
                    <div className="text-black">{modelName}</div>
                    <div className="text-black">{modelCode}</div>
                  </div>
                </div>

                {/* Mobile Header */}
                <div className="  text-black rounded-lg p-3 md:hidden block">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">{modelName}</span>
                  </div>
                </div>
              </div>

              <div className="space-y-0">
                {filteredVariants
                  .slice(
                    0,
                    showAll || window.innerWidth > 1024
                      ? filteredVariants.length
                      : 3
                  )
                  .map((variant) => {
                    const onRoadPrice = calculateOnRoadPrice(
                      variant.exShowroomPrice,
                      variant.fuel,
                      rtoData
                    );

                    return (
                      <div className="w-full" key={variant._id}>
                        <Accordion
                          expanded={expandedVariant === variant._id}
                          onChange={handleAccordionChange(variant._id)}
                          disableGutters
                          elevation={0}
                          square
                          sx={{ "&:before": { display: "none" } }}
                          className="mb-3 border border-gray-200 rounded-2xl shadow-none"
                        >
                          <AccordionSummary
                            expandIcon={
                              <ExpandMoreIcon className="text-gray-500" />
                            }
                            className=""
                            sx={{ "&:before": { display: "none" } }}
                          >
                            <div className="flex justify-between items-center w-full pr-4">
                              <div className="flex flex-col">
                                <h3 className="text-lg font-semibold  text-[#B60C19] mb-1">
                                  {variant.varientName}
                                </h3>
                                <p className="text-sm text-gray-500">
                                  {variant.EngineName}, {variant.transmission},{" "}
                                  {variant.fuel}
                                </p>
                              </div>
                              <div className="text-right">
                                <div className="text-lg font-bold text-gray-900 font-sans">
                                  {hasLocation
                                    ? `₹${formatCurrency(onRoadPrice)}`
                                    : `₹${formatCurrency(
                                        variant.exShowroomPrice
                                      )}`}
                                </div>
                                <div className="text-sm text-gray-500">
                                  {hasLocation
                                    ? "On-road price"
                                    : "Ex-showroom price"}
                                </div>
                              </div>
                            </div>
                          </AccordionSummary>

                          <AccordionDetails className="bg-white px-4 py-3 rounded-b-2xl">
                            <div className="space-y-4">
                              <div>
                                <h4 className="font-semibold text-gray-800 mb-2">
                                  Key Features:
                                </h4>
                                <div className="text-gray-600 text-sm leading-relaxed">
                                  {cleanHTMLContent(
                                    variant.FeatureExplained
                                  ).map((feature, index) => (
                                    <div
                                      key={index}
                                      className="flex items-start mb-1"
                                    >
                                      {/* <span className="text-[#B60C19] mr-2">
                                        •
                                      </span> */}
                                      <span>{feature}</span>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              <div className="pt-2 border-t border-gray-100">
                                <Link
                                  to={`/variant/${variant.varientName.replace(
                                    /\s+/g,
                                    "-"
                                  )}/${variant._id}`}
                                  className="inline-flex items-center text-[#B60C19]  font-medium text-sm transition-colors"
                                >
                                  VIEW VARIENT DETAILS
                                  <ChevronRight className="ml-1 h-4 w-4" />
                                </Link>
                              </div>
                            </div>
                          </AccordionDetails>
                        </Accordion>
                      </div>
                    );
                  })}
              </div>

              {/* Show More Button for Mobile */}
              {filteredVariants.length > 3 && window.innerWidth <= 1024 && (
                <div className="text-center mt-4">
                  <button
                    onClick={() => setShowAll(!showAll)}
                    className="bg-[#B60C19] text-white px-6 py-2 rounded-lg font-medium  transition-colors"
                  >
                    {showAll
                      ? "Show Less"
                      : `Show All ${filteredVariants.length} Variants`}
                  </button>
                </div>
              )}
            </section>
          );
        })}
      </div>
    </div>
  );
};

export default VariantsTable;
