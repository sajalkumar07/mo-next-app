import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Location from "../Structure/locationProd.js";
import Review from "./share-reviews.js";
import ViewPriceBreakup from "./NewViewPriceBreakup.js";
import Changecar from "./NewChangecar.js";
import Share from "./shareModel.js";
import Emi from "./Emi.js";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import axios from "axios";
import { Overview } from "../../Pages/Productpage.js";
import "./product.css";
import cardData from "../../Homepage/Structure/subcomponents/cardData";
import seater from "../../../Images/icons/seat.png";
import petrol from "../../../Images/icons/gas.png";
import manul from "../../../Images/icons/machin.png";
import ncap from "../../../Images/icons/privi.png";
import ColorVariants from "./colorvariants.js";
import { Bookmark, Star, Info, Share2 } from "lucide-react";
import Tyre from "../../../Images/tyremask.png";

const ProductSection = ({
  youtubeVideoRef,
  summaryRef,
  keyFeaturesRef,
  compareRef,
  prosConsRef,
  variantsRef,
  featuredCarRef,
  colorRef,
  mileageRef,
  fuleCostRef,
  newsRef,
  reviewRef,
  brochureRef,
  variantsCountRef,
}) => {
  const [singlecardData, setSingleCardData] = useState([]);
  const params = useParams();
  const [rtoData, setRtoData] = useState([]);
  const [allVariants, setAllVariants] = useState([]);
  const [variantCount, setVariantCount] = useState(0);
  const [showShareModal, setShowShareModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [emi, setEmi] = useState(0);
  const [dealerCount, setDealerCount] = useState(null);
  const [serviceCenterCount, setServiceCenterCount] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

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
    <div className="relative w-full bg-white">
      {" "}
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${Tyre})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.08,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <section
        style={{ marginTop: "130px", position: "relative", zIndex: 10 }}
        className="the-product-sec"
      >
        <div>
          <div className="label onlydesktopblock">
            <p className="FIND-YOUR-INFO mt-5 brand ">
              <span className="text-wrapper">FIND YOUR PERFECT </span>
              <span className="text-wrapper-2">{singlecardData.carname}</span>
            </p>
            <div className="textunder-infoma mt-1">
              Motor Octane's verdict: {singlecardData.movrating}*&nbsp;
              <div className="tooltip-container">
                <Info />
                <span
                  className="tooltip-text"
                  dangerouslySetInnerHTML={{ __html: singlecardData.itext }}
                ></span>
              </div>
            </div>
          </div>

          <Overview
            youtubeVideoRef={youtubeVideoRef}
            summaryRef={summaryRef}
            keyFeaturesRef={keyFeaturesRef}
            compareRef={compareRef}
            prosConsRef={prosConsRef}
            featuredCarRef={featuredCarRef}
            variantsRef={variantsRef}
            colorRef={colorRef}
            mileageRef={mileageRef}
            fuleCostRef={fuleCostRef}
            newsRef={newsRef}
            reviewRef={reviewRef}
            brochureRef={brochureRef}
          />
        </div>

        <div className="themobilemodfert">
          <div>
            <section className="inline-section-product mt-4">
              <section className="card-car-full-product">
                <div className="card-car-full-product-info">
                  <div className="ghkfjkhf">
                    <div className="bookmarkRibbonhot onlyphoneme">
                      <div>
                        <Bookmark
                          onClick={() => toggleBookmark(singlecardData._id)}
                          aria-label={
                            isBookmarked(singlecardData._id) ? "Unsave" : "Save"
                          }
                          role="img"
                          height={40}
                          width={24}
                          stroke={
                            isBookmarked(singlecardData._id)
                              ? "var(--red)"
                              : "#818181"
                          }
                          fill={
                            isBookmarked(singlecardData._id)
                              ? "var(--red)"
                              : "none"
                          }
                          strokeWidth={1}
                          strokeLinecap="round"
                          strokeLinejoin="round"
                        />
                      </div>
                    </div>
                    <div className="product-price onlyphoneme sharebuto ">
                      {singlecardData.lowestExShowroomPrice &&
                      singlecardData.highestExShowroomPrice ? (
                        <>
                          ₹{" "}
                          {formatCurrency(
                            calculateOnRoadPrice(
                              singlecardData.lowestExShowroomPrice,
                              getFirstFuelType()
                            )
                          )}
                          -
                          {formatCurrency(
                            calculateMaxOnRoadPrice(
                              singlecardData.highestExShowroomPrice
                            )
                          )}{" "}
                        </>
                      ) : (
                        <Skeleton />
                      )}
                    </div>
                    <div className="d-flex justify-content-between">
                      <div className="mt-[15px] w-[37px] h-[18px] space-x-2 rounded-md shadow-md shadow-black/black  bg-[#B1081A] flex justify-center items-center relative">
                        <span className="text-white text-center text-[10px]">
                          {singlecardData.movrating}
                        </span>
                        <span>
                          <Star
                            fill="white"
                            stroke="white"
                            strokeWidth={1}
                            style={{ width: "10px", height: "10px" }}
                          />
                        </span>
                      </div>
                      <div className="d-flex flex-column mt-3">
                        <div className="thecolo font-weight-bold">On-Road</div>
                        <div className="flex justify-start items-center">
                          <div className="flex items-center">
                            <Location />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="main-product-image-container">
                      {singlecardData.heroimage ? (
                        <img
                          className="main-product-image"
                          src={`${process.env.NEXT_PUBLIC_API}/productImages/${singlecardData.heroimage}`}
                          crossOrigin="anonymous"
                          alt={singlecardData.heroimagename}
                        />
                      ) : (
                        <Skeleton
                          height={199}
                          width="317px"
                          baseColor="#D8D8D8"
                          highlightColor="#666"
                          style={{ borderRadius: "8px" }}
                        />
                      )}
                    </div>
                  </div>
                  <div className="sider-info-product-full">
                    <div className="d-flex justify-content-between">
                      <div>
                        <div className="inside_card_title_product flex flex-col text-[14px]">
                          {singlecardData?.brand?.name && (
                            <div className="text-[14px] ">
                              {singlecardData.brand.name}
                            </div>
                          )}
                          <div className="flex items-baseline gap-1 text-[14px]">
                            {" "}
                            <span> {singlecardData?.carname || ""}</span>{" "}
                          </div>

                          <div className="inside_card_title_product theoldtxt text-[14px] text-gray-500">
                            {singlecardData?.brand?.name ? (
                              <span>{singlecardData.brand.name}&nbsp; </span>
                            ) : (
                              <span></span>
                            )}
                            {singlecardData?.carname || ""}
                          </div>
                        </div>

                        <div className="product-launch d-flex align-items-center">
                          LAUNCHED IN {singlecardData.launchedinput}
                          <ion-icon
                            name="information-circle-outline"
                            className="infomation-gray"
                          ></ion-icon>
                        </div>
                        <div className="product-price onlydesptop">
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
                              - ₹{" "}
                              {formatCurrency(
                                calculateMaxOnRoadPrice(
                                  singlecardData.highestExShowroomPrice
                                )
                              )}{" "}
                              Lakhs
                            </>
                          ) : (
                            <Skeleton />
                          )}
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-center">
                        <div className="rating-inno d-flex flex-row">
                          <span>{singlecardData.movrating}</span>
                          <span> &#x2B50;</span>
                        </div>
                      </div>
                    </div>
                    <div className="infos-product">
                      <div className="on-road-price onlydesptop">
                        On-Road {city}{" "}
                        <div className="flex items-center">
                          {/* <Location />{" "} */}
                        </div>
                        <div className="emi-result">
                          {isLoading ? (
                            <p>Calculating EMI...</p>
                          ) : (
                            <Link
                              className="emidesp"
                              to={`/EMI-Calculator/${singlecardData.brand?._id}/${singlecardData?._id}/`}
                            >
                              {" "}
                            </Link>
                          )}
                        </div>
                      </div>
                      <section className="onlyphoneme align-items-center justify-content-between mt-2">
                        <Changecar />
                        <ViewPriceBreakup />
                        <span onClick={handleShare}>
                          {" "}
                          <Share2 />
                        </span>
                      </section>
                    </div>
                  </div>
                </div>
              </section>
              <div className="section-product-jfull mt-4">
                <div className="sideseaterinfo-product">
                  <img className="icon_image" src={seater} alt="Seater Icon" />
                  <span className="text-[11px]">
                    {parseList(singlecardData.seater)} Seater
                  </span>
                </div>
                <div className="sideseaterinfo-product">
                  <img className="icon_image" src={petrol} alt="Petrol Icon" />
                  <span className="text-[11px]">
                    {parseList(singlecardData.fueltype)}
                  </span>
                </div>
                <div className="sideseaterinfo-product">
                  <img className="icon_image" src={manul} alt="Manual Icon" />
                  <span className="text-[11px]">
                    {parseList(singlecardData.transmissiontype)}
                  </span>
                </div>
                <div className="sideseaterinfo-product">
                  <img className="icon_image" src={ncap} alt="NCAP Icon" />{" "}
                  <span className="text-[11px]">
                    {" "}
                    {singlecardData.NCAP} Safety Ratings
                  </span>
                </div>
              </div>
            </section>
            <div className="ddfelj align-items-center justify-content-center  mb-3 w-full">
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
          </div>
          <div className="mt-24">
            {/*scorller nav*/}
            <section className="md:block flex justify-center items-center p-8">
              {/* dektop view */}

              <div className="p-4 w-full flex justify-center items-center onlydesptop">
                <ul className="search_tabs addmargin flex space-x-2">
                  <li className="advance_bars_back active h-24 flex flex-col justify-center items-center min-w-[120px]">
                    {singlecardData.launchedinput}
                    <div className="">{singlecardData.salesranking}</div>
                  </li>
                  <span className="flex justify-center items-center">
                    <hr className="h-[80px] w-[2px] border-none bg-[#828282]" />
                  </span>
                  <li className="advance_bars_back h-24 flex flex-col justify-center items-center min-w-[120px]">
                    {statsLoading ? <Skeleton width={30} /> : dealerCount}
                    <div className="">DEALERS</div>
                  </li>
                  <span className="flex justify-center items-center">
                    <hr className="h-[80px] w-[2px] border-none bg-[#828282]" />
                  </span>
                  <li className="advance_bars_back h-24 flex flex-col justify-center items-center min-w-[120px]">
                    {statsLoading ? (
                      <Skeleton width={30} />
                    ) : (
                      serviceCenterCount
                    )}
                    <div className="">SERVICE CENTERS</div>
                  </li>
                  <span className="flex justify-center items-center">
                    <hr className="h-[80px] w-[2px] border-none bg-[#828282]" />
                  </span>
                  <li className="advance_bars_back h-24 flex flex-col justify-center items-center min-w-[120px]">
                    {variantCount}
                    <div className="">VARIANTS</div>
                  </li>
                </ul>
              </div>
              {/* mobile view */}
              <div
                className="w-full advance_bars advance_bars_mob onlyphoneme-2 font-[Montserrat] font-medium"
                style={{ display: "block" }}
              >
                <ul className="md:hidden flex justify-center p-12 space-x-3 items-center">
                  <li
                    className="flex flex-col items-center justify-center px-5 py-3 cursor-pointer transition-all duration-300 bg-red-700 text-white shadow-md rounded-sm relative scale-105"
                    style={{
                      width: "79px",
                      height: "79px",
                    }}
                  >
                    {singlecardData.launchedinput}
                    <div className="">{singlecardData.salesranking}</div>
                  </li>

                  <span className=" flex justify-center items-center">
                    <hr className="h-[70px] w-[2px] border-none bg-[#828282] " />
                  </span>

                  <li
                    className="flex flex-col items-center justify-center px-5 py-3 cursor-pointer transition-all duration-300 bg-[#828282] hover:bg-red-700 text-white shadow-md rounded-sm relative"
                    style={{
                      width: "79px",
                      height: "79px",
                    }}
                  >
                    {dealerCount}
                    <div className="">DEALERS</div>
                  </li>

                  <span className=" flex justify-center items-center">
                    <hr className="h-[70px] w-[2px] border-none bg-[#828282] " />
                  </span>

                  <li
                    className="flex flex-col items-center justify-center px-5 py-3 cursor-pointer transition-all duration-300 bg-[#828282] hover:bg-red-700 text-white shadow-md rounded-sm relative"
                    style={{
                      width: "79px",
                      height: "79px",
                    }}
                  >
                    {serviceCenterCount}
                    <div className="">SERVICE CENTERS</div>
                  </li>

                  <span className=" flex justify-center items-center">
                    <hr className="h-[70px] w-[2px] border-none bg-[#828282] " />
                  </span>

                  <li
                    className="flex flex-col items-center justify-center px-5 py-3 cursor-pointer transition-all duration-300 bg-[#828282] hover:bg-red-700 text-white shadow-md rounded-sm relative"
                    style={{
                      width: "79px",
                      height: "79px",
                    }}
                    onClick={() => {
                      if (variantsRef && variantsRef.current) {
                        const offset = variantsRef.current.offsetTop;
                        window.scrollTo({
                          top: offset - offset * 0.07,
                          behavior: "smooth",
                        });
                      }
                    }}
                  >
                    {variantCount}
                    <div className="">VARIANTS</div>
                  </li>
                </ul>
              </div>
            </section>
          </div>
        </div>
      </section>
    </div>
  );
};

export default ProductSection;
