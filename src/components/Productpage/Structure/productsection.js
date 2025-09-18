import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import ViewPriceBreakup from "./NewViewPriceBreakup.js";
import Changecar from "./NewChangecar.js";
import Emi from "./Emi.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";

import "./product.css";

import {
  Bookmark,
  Users,
  Fuel,
  Settings,
  Star,
  Share2,
  Info,
} from "lucide-react";

const ProductSection = ({}) => {
  const [singlecardData, setSingleCardData] = useState([]);
  const params = useParams();
  const [rtoData, setRtoData] = useState([]);
  const [allVariants, setAllVariants] = useState([]);
  const [variantCount, setVariantCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [emi, setEmi] = useState(0);
  const [dealerCount, setDealerCount] = useState(null);
  const [serviceCenterCount, setServiceCenterCount] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);
  const [open, setOpen] = useState(false);

  // Main on-road price calculation
  const calculateOnRoadPrice = (product, fuelType) => {
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

  // New function to calculate maximum on-road price for highest price
  const calculateMaxOnRoadPrice = (highestPrice) => {
    if (!highestPrice || !Array.isArray(rtoData) || rtoData.length === 0) {
      return parseFloat(highestPrice) || 0;
    }

    // Get all fuel types from singlecardData.fueltype
    const carFuelTypes = getCarFuelTypes();

    if (carFuelTypes.length === 0) {
      return parseFloat(highestPrice) || 0;
    }

    let maxOnRoadPrice = 0;

    // Calculate on-road price for each fuel type and find the maximum
    carFuelTypes.forEach((fuelType) => {
      const onRoadPrice = calculateOnRoadPrice(highestPrice, fuelType);
      if (onRoadPrice > maxOnRoadPrice) {
        maxOnRoadPrice = onRoadPrice;
      }
    });

    return maxOnRoadPrice;
  };

  // Helper function to get all fuel types from car data
  const getCarFuelTypes = () => {
    if (!singlecardData.fueltype) return [];

    // Parse the fuel types from the car data
    let fuelTypes = [];

    if (Array.isArray(singlecardData.fueltype)) {
      fuelTypes = singlecardData.fueltype;
    } else if (typeof singlecardData.fueltype === "string") {
      // Handle different string formats
      const parser = new DOMParser();
      const doc = parser.parseFromString(singlecardData.fueltype, "text/html");
      const items = doc.querySelectorAll("ul li, p");

      if (items.length > 0) {
        fuelTypes = Array.from(items).map((item) => item.textContent.trim());
      } else {
        // Handle simple string with separators
        fuelTypes = singlecardData.fueltype
          .split(/[|,]/)
          .map((type) => type.trim())
          .filter((type) => type);
      }
    }

    // Clean and normalize fuel types
    return fuelTypes.filter((type) => type && type.length > 0);
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

  const normalizeFuelType = (fuelType) => {
    if (!fuelType) return "";
    const normalizedFuel = fuelType.toLowerCase();
    if (normalizedFuel.includes("hybrid")) {
      return "petrol";
    }
    return normalizedFuel;
  };

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

  const parseList = (input) => {
    if (Array.isArray(input)) {
      return input.join(" | ");
    }
    if (typeof input === "number") {
      return input.toString();
    }
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");
    const items = doc.querySelectorAll("ul li, p");
    const extractedText = Array.from(items).map((item) =>
      item.textContent.trim()
    );
    return extractedText.length > 1
      ? extractedText.join(" | ") + " |"
      : extractedText.join("");
  };

  const getFirstFuelType = () => {
    if (allVariants.length > 0) {
      return allVariants[0].fuel || "";
    }
    return singlecardData.fueltype || "";
  };

  const fetchRTOData = async () => {
    const locationState = localStorage.getItem("location");
    const parsedLocationState = JSON.parse(locationState);

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
      setRtoData(result.data);
    } catch (error) {
      console.error("Error fetching RTO data:", error);
    }
  };

  const fetchDealerCount = async () => {
    const locationState = localStorage.getItem("location");
    const parsedLocationState = JSON.parse(locationState);

    if (
      !parsedLocationState ||
      !parsedLocationState.city ||
      !singlecardData.brand?._id
    ) {
      console.log("Missing required data for dealer count fetch");
      return;
    }

    try {
      console.log("Fetching dealer count for:", {
        city: parsedLocationState.city,
        brandId: singlecardData.brand._id,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/v1/totalcount-by-brand-for-app`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: parsedLocationState.city,
            brandId: singlecardData.brand._id,
          }),
        }
      );
      const result = await response.json();
      console.log("Dealer count API response:", result);

      if (result.success) {
        setDealerCount(result.data || 0);
      } else {
        console.error("Dealer count API error:", result.message);
      }
    } catch (error) {
      console.error("Error fetching dealer count:", error);
    }
  };

  const fetchServiceCenterCount = async () => {
    const locationState = localStorage.getItem("location");
    const parsedLocationState = JSON.parse(locationState);

    if (
      !parsedLocationState ||
      !parsedLocationState.city ||
      !singlecardData.brand?._id
    ) {
      console.log("Missing required data for service center count fetch");
      return;
    }

    try {
      console.log("Fetching service center count for:", {
        city: parsedLocationState.city,
        brandId: singlecardData.brand._id,
      });

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/v1/total-countof-servicecentre-for-web`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            city: parsedLocationState.city,
            brandId: singlecardData.brand._id,
          }),
        }
      );
      const result = await response.json();
      console.log("Service center count API response:", result);

      if (result.success) {
        // Fix: Use result.data instead of response.data
        setServiceCenterCount(result.data || 0);
      } else {
        console.error("Service center count API error:", result.message);
        setServiceCenterCount(0); // Set to 0 on error
      }
    } catch (error) {
      console.error("Error fetching service center count:", error);
      setServiceCenterCount(0); // Set to 0 on error
    }
  };

  useEffect(() => {
    fetchRTOData();
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${params.id}`
        );
        const data = await response.json();
        setSingleCardData(data);
      } catch (error) {
        console.error("Error fetching car data:", error);
      }
    };
    fetchData();
  }, [params.id]);

  useEffect(() => {
    const fetchVariantsData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/variants/active/${params.id}`
        );
        const data = await response.json();
        if (data.success && data.data) {
          setAllVariants(data.data);
          setVariantCount(data.data.length);
        }
      } catch (error) {
        console.error("Error fetching variants data:", error);
      }
    };
    fetchVariantsData();
  }, [params.id]);

  useEffect(() => {
    if (singlecardData.brand?._id) {
      fetchDealerCount();
      fetchServiceCenterCount();
      setStatsLoading(false);
    }
  }, [singlecardData.brand?._id]);

  useEffect(() => {
    if (singlecardData.lowestExShowroomPrice && rtoData.length > 0) {
      const calculateEmi = () => {
        const onRoadPrice = calculateOnRoadPrice(
          singlecardData.lowestExShowroomPrice,
          getFirstFuelType()
        );

        const downPayment = (onRoadPrice * 20) / 100;
        const tenure = 7;
        const rate = 8;
        const principal = onRoadPrice - downPayment;
        const monthlyRate = rate / 12 / 100;
        const months = tenure * 12;
        const emiAmount =
          (principal * monthlyRate * Math.pow(1 + monthlyRate, months)) /
          (Math.pow(1 + monthlyRate, months) - 1);

        setEmi(Math.round(emiAmount));
        setIsLoading(false);
      };
      calculateEmi();
    }
  }, [singlecardData.lowestExShowroomPrice, rtoData, allVariants]);

  const formatPriceToLakhs = (price) => {
    const priceInLakhs = (price / 100000).toFixed(1);
    return `${priceInLakhs}`;
  };

  const getLocationFromLocalStorage = () => {
    const locationString = localStorage.getItem("location");
    return locationString ? JSON.parse(locationString) : null;
  };

  const location = getLocationFromLocalStorage();
  const state = location && location.state ? location.state : "Select State";
  const city = location && location.city ? location.city : "Select City";

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    return savedBookmarks || [];
  });

  const isBookmarked = (id) => bookmarkedIds.includes(id);

  const toggleBookmark = (id) => {
    const updatedBookmarks = isBookmarked(id)
      ? bookmarkedIds.filter((bookmarkId) => bookmarkId !== id)
      : [...bookmarkedIds, id];
    setBookmarkedIds(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  };

  const handleShare = () => {
    const currentUrl = window.location.href;
    const message = `I was viewing "${singlecardData.brand?.name} ${singlecardData.carname}" on MotorOctane and thought you would be interested in viewing it too.
    
    Check out: ${currentUrl}
    
    For a better experience, download the MotorOctane App:
    https://play.google.com/store/apps/details?id=com.motoroctane.release`;

    if (navigator.share) {
      navigator
        .share({
          title: "Check out this car!",
          text: message,
        })
        .catch((error) => {
          console.error("Error sharing:", error);
        });
    } else {
      const encodedMessage = encodeURIComponent(message);
      const encodedUrl = encodeURIComponent(currentUrl);
      const shareModalHtml = `
          <div id="shareModal" style="position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
            background-color: rgba(0, 0, 0, 0.5); display: flex; justify-content: center; 
            align-items: center; z-index: 9999;">
            <div style="background: #fff; padding: 20px; border-radius: 12px; width: 90%; max-width: 320px; 
              box-shadow: 0 4px 12px rgba(0,0,0,0.1); text-align: center; font-family: sans-serif; position: relative;">
              
              <button style="position: absolute; top: 10px; right: 10px; background: transparent; 
                border: none; font-size: 20px; cursor: pointer;" onclick="document.getElementById('shareModal').remove()">×</button>
              
              <h3 style="margin-bottom: 20px; font-size: 18px;">Share this car</h3>
              
              <div style="display: flex; justify-content: space-around;">
                <a href="https://twitter.com/intent/tweet?text=${encodedMessage}&url=${encodedUrl}" 
                  target="_blank" title="Share on Twitter">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/twitter.svg" width="24" alt="Twitter"/>
                </a>
                <a href="https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}" 
                  target="_blank" title="Share on Facebook">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/facebook.svg" width="24" alt="Facebook"/>
                </a>
                <a href="https://wa.me/?text=${encodedMessage} ${encodedUrl}" 
                  target="_blank" title="Share on WhatsApp">
                  <img src="https://cdn.jsdelivr.net/gh/simple-icons/simple-icons/icons/whatsapp.svg" width="24" alt="WhatsApp"/>
                </a>
              </div>
            </div>
          </div>
        `;
      document.body.insertAdjacentHTML("beforeend", shareModalHtml);
    }
  };

  return (
    <div className="">
      <section className="relative z-10 max-w-[1400px] mx-auto md:px-14 xl:px-3 lg:px-3 2xl:px-3 px-3">
        <div className="flex justify-center items-center text-center flex-col mt-40">
          <h2 className="text-[25px] font-bold text-center font-sans">
            <span className="text-[#818181]">FIND YOUR PERFECT </span>
            <span className="text-[#B60C19] uppercase">
              {singlecardData?.brand?.name} {singlecardData.carname}
            </span>
          </h2>
          <div className="flex flex-col justify-center items-center mt-1">
            <div className="flex items-center justify-center text-center relative">
              <span className="text-gray-400 font-bold">
                Motor Octane's verdict: {singlecardData.movrating}*&nbsp;
              </span>
              <div className="relative">
                <span
                  className="text-gray-400 cursor-pointer"
                  onClick={() => setOpen(!open)}
                >
                  <Info
                    size={15}
                    className="text-gray-500 hover:text-[#B60C19] cursor-pointer transition-colors duration-200"
                  />{" "}
                </span>
                {open && (
                  <div
                    className="absolute left-1/2 top-full mt-2 max-w-xs w-max min-w-[200px] 
                -translate-x-1/2 rounded-xl bg-white text-black text-sm p-3 z-50 text-left border shadow-2xl"
                  >
                    <div
                      className="whitespace-normal break-words"
                      dangerouslySetInnerHTML={{ __html: singlecardData.itext }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-10 ">
          <div className="flex justify-center items-center">
            <div className="flex justify-center 2xl:flex-row xl:flex-row lg:flex-row md:flex-col flex-col items-center gap-10 w-full">
              {/* Image Section - Full width on tablet */}
              <div className="lg:w-1/2 w-full flex justify-center flex-col h-auto gap-4 py-4 ">
                <div className="bg-gray-200 rounded-xl relative border w-full h-[307px] flex justify-center items-center">
                  <div className="absolute top-3 right-3 left-3 flex justify-between">
                    <button
                      onClick={() => toggleBookmark(singlecardData._id)}
                      className="text-gray-400 hover:text-red-500 transition-colors"
                    >
                      {isBookmarked(singlecardData._id) ? (
                        <Bookmark className="h-6 w-6 text-red-500 fill-[#AB373A] cursor-pointer" />
                      ) : (
                        <Bookmark className="h-6 w-6 text-gray-500 cursor-pointer" />
                      )}
                    </button>
                    <span onClick={handleShare}>
                      <Share2 className="h-6 w-6 text-gray-500 cursor-pointer" />
                    </span>
                  </div>
                  <div className="flex justify-center items-center">
                    {singlecardData.heroimage ? (
                      <img
                        src={`${process.env.NEXT_PUBLIC_API}/productImages/${singlecardData.heroimage}`}
                        crossOrigin="anonymous"
                        alt={singlecardData.heroimagename}
                        className="w-auto h-[250px] object-contain"
                      />
                    ) : (
                      <Skeleton
                        height={120}
                        width="180px"
                        baseColor="#D8D8D8"
                        highlightColor="#666"
                        style={{ borderRadius: "8px" }}
                      />
                    )}
                  </div>
                </div>
              </div>

              {/* Details Section - Full width on tablet */}
              <div className="lg:w-1/2 md:w-full w-full flex justify-center flex-col h-auto gap-4 py-4">
                <div className="flex justify-start items-center">
                  <span className="text-[20px] font-bold font-sans bg-red-700 text-white text-xs px-2 py-1 rounded flex justify-center items-center gap-1">
                    {singlecardData.movrating}
                    <Star size={20} color="white" fill="white" />
                  </span>
                </div>

                {/* Title */}
                <div className="mb-2">
                  <div className="text-[#AB373A] text-[24px] font-bold">
                    {singlecardData?.brand?.name}
                    {"  "}
                    {singlecardData?.carname || ""}
                  </div>

                  <div className="flex items-center">
                    <span className="text-gray-500 font-normal text-sm mr-4">
                      Launched in {singlecardData.launchedinput}
                    </span>
                    <div className="">
                      <Changecar />
                    </div>
                  </div>
                </div>

                {/* Price */}
                <div className="space-y-1">
                  <div className="text-black text-[24px] font-bold">
                    {singlecardData.lowestExShowroomPrice &&
                    singlecardData.highestExShowroomPrice ? (
                      <>
                        ₹{" "}
                        {formatCurrency(
                          calculateOnRoadPrice(
                            singlecardData.lowestExShowroomPrice,
                            getFirstFuelType()
                          )
                        )}{" "}
                        – ₹{" "}
                        {formatCurrency(
                          calculateMaxOnRoadPrice(
                            singlecardData.highestExShowroomPrice
                          )
                        )}
                      </>
                    ) : (
                      <Skeleton />
                    )}
                  </div>
                  <div className="flex items-center">
                    <span className="text-gray-500 font-normal text-sm ml-1 mr-4">
                      (On-road {city})
                    </span>
                    <div className="">
                      <ViewPriceBreakup />
                    </div>
                  </div>
                </div>

                {/* Features row */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-gray-600 mt-2">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Users size={15} />
                      <span>{parseList(singlecardData.seater)} Seater</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Fuel size={15} />
                      <span>{parseList(singlecardData.fueltype)}</span>
                    </div>
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <Settings size={15} />
                      <span>{parseList(singlecardData.transmissiontype)}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Star size={15} />
                      Safety - <span>{singlecardData.NCAP} </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-center items-center mt-10">
          <Emi
            singlecardData={singlecardData}
            city={city}
            emi={emi}
            isLoading={isLoading}
            product={params.id}
            brand={singlecardData.brand?._id}
            productname={singlecardData.carname}
          />
        </div>
      </section>

      <section className="bg-[#f5f5f5] py-8 px-4 mt-10">
        <div className="relative z-10 max-w-[1400px] mx-auto px-3">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="bg-white text-black border border-gray-200 rounded-2xl w-full h-[88px] flex justify-center text-center flex-col">
              <span className="text-[#AB373A] text-[24px] font-bold">
                {singlecardData.launchedinput}
              </span>
              <span className="text-gray-400 text-sm font-medium">
                {singlecardData.salesranking}
              </span>
            </div>

            <div className="bg-white text-black border border-gray-200 rounded-2xl w-full h-[88px] flex justify-center text-center flex-col">
              <span className="text-[#AB373A] text-[24px] font-bold">
                {statsLoading ? <Skeleton width={30} /> : dealerCount}
              </span>
              <span className="text-gray-400 text-sm font-medium">DEALERS</span>
            </div>

            <div className="bg-white text-black border border-gray-200 rounded-2xl w-full h-[88px] flex justify-center text-center flex-col">
              <span className="text-[#AB373A] text-[24px] font-bold">
                {statsLoading ? <Skeleton width={30} /> : serviceCenterCount}
              </span>
              <span className="text-gray-400 text-sm font-medium">
                SERVICE CENTERS
              </span>
            </div>

            <div className="bg-white text-black border border-gray-200 rounded-2xl w-full h-[88px] flex justify-center text-center flex-col">
              <span className="text-[#AB373A] text-[24px] font-bold">
                {variantCount}
              </span>
              <span className="text-gray-400 text-sm font-medium">
                VARIANTS
              </span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductSection;
