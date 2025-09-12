import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";
import Location from "../Productpage/Structure/locationProd.js";
import Review from "../Productpage/Structure/share-reviews.js";
import Changecar from "./Changecar";
import seater from "../../Images/icons/seat.png";
import petrol from "../../Images/icons/gas.png";
import manul from "../../Images/icons/machin.png";
import ncap from "../../Images/icons/privi.png";
import Skeleton from "react-loading-skeleton"; // Import the skeleton loader library
import "react-loading-skeleton/dist/skeleton.css";
import ViewPriceBreakup from "../Productpage/Structure/ViewPriceBreakup.js";
import SelectLocation from "./selectlocation.js";
import { Bookmark, Star, Info, Share2 } from "lucide-react";
import { Overview } from "../../components/Pages/Variantpage.js";
import Tyre from "../../Images/tyremask.png";

const CarSection = ({
  youtubeVideoRef,
  summaryRef,
  specsRef,
  keyFeaturesRef,
  areYouMissingRef,
  compareRef,
  prosConsRef,
  mileageRef,
  newsRef,
  reviewRef,
  brochureRef,
  fuelCalcRef,
  downloadRef,
}) => {
  const [singlecardData, setSingleCardData] = useState([]);
  const [rtoData, setRtoData] = useState([]);
  const [emi, setEmi] = useState(0);
  const [isLoadingb, setIsLoadingb] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();

  // Set isLoadingb to true after 1 second
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingb(false);
    }, 2000); // 1000 ms = 1 second

    // Cleanup the timer if the component unmounts
    return () => clearTimeout(timer);
  }, []);

  const calculateOnRoadPrice = (product, fuelType) => {
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

  // Helper functions (keep these unchanged from your original code)
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

    // Flat amount for EVs or when percentage is 0
    // Note: hybrid is now treated as petrol, so this condition won't apply to hybrid
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
    // Treat hybrid as petrol for calculation purposes
    if (normalizedFuel.includes("hybrid")) {
      return "petrol";
    }
    return normalizedFuel;
  };

  // Format currency into INR format
  const formatCurrency = (value) => {
    if (value >= 1e7) {
      // Convert to Crores
      return `₹${(value / 1e7).toFixed(2)} Cr`;
    } else if (value >= 1e5) {
      // Convert to Lakhs
      return `₹${(value / 1e5).toFixed(2)} Lakhs`;
    } else {
      // Format normally with commas
      return new Intl.NumberFormat("en-IN").format(value);
    }
  };

  // Fetch RTO data
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
      // console.error('Error fetching RTO data:', error);
    }
  };

  useEffect(() => {
    fetchRTOData();
  }, []);

  // Fetch car data by ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${params.id}`
        );
        const data = await response.json();
        setSingleCardData(data);
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    if (singlecardData?.data?.exShowroomPrice && rtoData.length > 0) {
      // Calculate EMI
      const calculateEmi = () => {
        const onRoadPrice = calculateOnRoadPrice(
          singlecardData?.data?.exShowroomPrice,
          singlecardData?.data?.fuel
        );

        const downPayment = (onRoadPrice * 20) / 100; // 20% down payment
        const tenure = 7; // 7 years
        const rate = 8; // 8% annual interest rate

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
  }, [singlecardData, rtoData]); // Re-run this effect when singlecardData or rtoData changes

  const location = JSON.parse(localStorage.getItem("location")) || {};
  const state = location.state || "Select State";
  const state2 = location.state || null;

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    return savedBookmarks || [];
  });

  // Function to check if a card is bookmarked
  const isBookmarked = (id) => bookmarkedIds.includes(id);

  // Function to toggle the bookmark state
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
        className="the-product-sec theoonlymobloiles"
      >
        <section className="inline-section-product mt-24">
          <div className="label onlydesktopblock">
            <Overview
              youtubeVideoRef={youtubeVideoRef}
              summaryRef={summaryRef}
              specsRef={specsRef}
              compareRef={compareRef}
              prosConsRef={prosConsRef}
              keyFeaturesRef={keyFeaturesRef}
              areYouMissingRef={areYouMissingRef}
              mileageRef={mileageRef}
              fuelCalcRef={fuelCalcRef}
              downloadRef={downloadRef}
              newsRef={newsRef}
              reviewRef={reviewRef}
              brochureRef={brochureRef}
            />
          </div>

          <section className="inline-section-product mt-4">
            <section className="card-car-full-product">
              <div className="card-car-full-product-info">
                <div className="ghkfjkhf">
                  {/* Bookmark and Rating Section */}
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

                  {/* Price Section */}
                  <div className="product-price onlyphoneme sharebuto flex-col">
                    {singlecardData?.data?.exShowroomPrice ? (
                      formatCurrency(
                        calculateOnRoadPrice(
                          singlecardData.data.exShowroomPrice,
                          singlecardData.data.fuel
                        )
                      )
                    ) : (
                      <Skeleton />
                    )}
                    {/* Rating and Location Section */}
                    <div className="d-flex justify-content-between">
                      <div className="mt-[15px] w-[37px] h-[18px] space-x-2 rounded-md shadow-md shadow-black/black  bg-[#B1081A] flex justify-center items-center relative">
                        <span className="text-white text-center text-[10px]">
                          {singlecardData?.data?.product_id?.movrating || "N/A"}
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
                      <div class="d-flex flex-column -mt-6">
                        <div class="thecolo font-weight-bold text-black">
                          On-Road
                        </div>
                        <div className="flex justify-start items-center">
                          <div className="flex items-center">
                            <Location />
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Main Product Image */}
                  <div className="main-product-image-container">
                    {singlecardData?.data?.product_id?.heroimage ? (
                      <img
                        className="main-product-image"
                        src={`${process.env.NEXT_PUBLIC_API}/productImages/${singlecardData.data.product_id.heroimage}`}
                        crossOrigin="anonymous"
                        alt={
                          singlecardData?.data?.product_id?.heroimagename ||
                          "Car image"
                        }
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

                {/* Product Info Section */}
                <div className="sider-info-product-full">
                  <div className="d-flex justify-content-between">
                    <div>
                      <div className="inside_card_title_product flex flex-col">
                        {singlecardData?.data?.brand_id?.name && (
                          <div className="text-[14px] ">
                            {singlecardData.data.brand_id.name}
                          </div>
                        )}
                        <div className="flex flex-col">
                          {" "}
                          <div className="flex items-baseline flex-col">
                            <span className="text-[14px] ">
                              {singlecardData?.data?.product_id?.carname || " "}{" "}
                              -
                            </span>
                            <span className="text-[14px] text-gray-600">
                              {singlecardData?.data?.varientName || " "}
                            </span>
                          </div>
                          <div className="inside_card_title_product theoldtxt text-[14px] text-gray-500">
                            {singlecardData?.data?.product_id?.carname}
                            {singlecardData?.data?.varientName}
                          </div>
                        </div>
                      </div>
                      <div className="product-launch d-flex align-items-center">
                        LAUNCHED IN{" "}
                        {singlecardData?.data?.product_id?.launchedinput}
                        <ion-icon
                          name="information-circle-outline"
                          className="infomation-gray"
                        ></ion-icon>
                      </div>
                      <div className="product-price onlydesptop">
                        {singlecardData?.data?.exShowroomPrice ? (
                          formatCurrency(
                            calculateOnRoadPrice(
                              singlecardData.data.exShowroomPrice,
                              singlecardData.data.fuel
                            )
                          )
                        ) : (
                          <Skeleton />
                        )}
                      </div>
                    </div>
                    <div className="d-flex flex-column align-items-center">
                      <div className="rating-inno d-flex flex-row">
                        <span>
                          {singlecardData?.data?.product_id?.movrating || "N/A"}
                        </span>
                        <span> &#x2B50;</span>
                      </div>
                    </div>
                  </div>

                  {/* On-Road Price and EMI Section */}
                  <div className="infos-product">
                    <div className="on-road-price onlydesptop">
                      On-Road {state}
                      <div className="flex items-center">
                        <svg
                          className="w-4 h-4 ml-1 text-gray-500 inline-block align-middle onlydesktopblock"
                          xmlns="http://www.w3.org/2000/svg"
                          width="16"
                          height="14"
                          viewBox="0 0 16 14"
                          fill="none"
                        >
                          <path
                            d="M15 2.625L13 0.875L11 2.625L13 4.375L15 2.625Z"
                            fill="#B1081A"
                          />
                          <path
                            d="M11 2.625L4.5 8.3125L6.5 10.0625L10.75 6.34375L13 4.375L11 2.625Z"
                            fill="#B1081A"
                          />
                          <path
                            d="M4.5 8.3125L3.5 10.9375L6.5 10.0625L4.5 8.3125Z"
                            fill="#B1081A"
                          />
                          <path
                            d="M13.5 6.5625V13.125H1V2.1875H8.5M15 2.625L13 0.875M15 2.625L10.75 6.34375M15 2.625L13 4.375M13 0.875L4.5 8.3125M13 0.875L11 2.625M4.5 8.3125L3.5 10.9375L6.5 10.0625M4.5 8.3125L6.5 10.0625M4.5 8.3125L11 2.625M6.5 10.0625L10.75 6.34375M11 2.625L13 4.375M13 4.375L10.75 6.34375"
                            stroke="#B1081A"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                          />
                        </svg>
                      </div>
                      <div className="emi-result">
                        {isLoading ? (
                          <p>Calculating EMI...</p>
                        ) : (
                          <Link
                            className="emidesp"
                            to={`/EMI-Calculator/${singlecardData?.data?.brand_id?._id}/${singlecardData?.data?.product_id?._id}/`}
                          >
                            <p>EMI: ₹ {emi} ONWARDS</p>
                          </Link>
                        )}
                      </div>
                    </div>

                    {/* Mobile View Actions */}
                    <section className="onlyphoneme align-items-center justify-content-between mt-2">
                      <Changecar
                        product={singlecardData?.data?.product_id?._id}
                        brand={singlecardData?.data?.brand_id?._id}
                        productname={singlecardData?.data?.product_id?.carname}
                      />
                      <div className="bg-[#555555] text-[8px] font-[Montserrat] text-center rounded-[6px] text-white px-[4px] py-[4px] ">
                        <div className="">
                          <Link
                            to={`/pricebreakup/${singlecardData?.data?._id}`}
                          >
                            VIEW PRICE BREAKUP
                          </Link>
                        </div>
                      </div>
                      <span onClick={handleShare}>
                        {" "}
                        <Share2 />
                      </span>
                    </section>
                  </div>
                </div>
              </div>
            </section>

            {/* Car Specifications Section */}
            <div className="section-product-jfull mt-4">
              <div className="sideseaterinfo-product">
                <img className="icon_image" src={seater} alt="Seater Icon" />
                <span className="text-[11px]">
                  {singlecardData?.data?.seater || "N/A"} Seater
                </span>
              </div>
              <div className="sideseaterinfo-product">
                <img className="icon_image" src={petrol} alt="Petrol Icon" />
                <span className="text-[11px]">
                  {singlecardData?.data?.fuel || "N/A"}
                </span>
              </div>
              <div className="sideseaterinfo-product">
                <img className="icon_image" src={manul} alt="Manual Icon" />
                <span className="text-[11px]">
                  {singlecardData?.data?.transmission || "N/A"}
                </span>
              </div>
              <div className="sideseaterinfo-product">
                <img className="icon_image" src={ncap} alt="NCAP Icon" />
                <span className="text-[11px]">
                  {" "}
                  {singlecardData?.data?.GNCAP || "N/A"} Star Ratings
                </span>
              </div>
            </div>
          </section>
        </section>

        <div className="d-flex align-items-center justify-content-center mb-2 w-full">
          {state2 ? (
            <Link
              className="d-flex w-30 justify-content-evenly align-items-center theemisectiona"
              to={`/EMI-Calculator/${singlecardData?.data?.brand_id?._id}/${singlecardData?.data?.product_id?._id}/${singlecardData?.data?._id}`}
            >
              <div>
                <svg
                  width="61"
                  height="28"
                  viewBox="0 0 61 28"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  href="http://www.w3.org/1999/xlink"
                >
                  <rect
                    x="0.111084"
                    width="60.8887"
                    height="27.3999"
                    fill="url(#pattern0_2295_5701)"
                  />
                  <defs>
                    <pattern
                      id="pattern0_2295_5701"
                      patternContentUnits="objectBoundingBox"
                      width="1"
                      height="1"
                    >
                      <use
                        href="#image0_2295_5701"
                        transform="matrix(0.00431034 0 0 0.00957854 0 -0.539272)"
                      />
                    </pattern>
                    <image
                      id="image0_2295_5701"
                      width="232"
                      height="217"
                      preserveAspectRatio="none"
                      href="data:image/png;base64,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"
                    />
                  </defs>
                </svg>
              </div>
              <div className="emi-result">
                <div className="theemitxt">
                  EMI ₹ {Number(emi).toLocaleString("en-IN")}/- ONWARDS
                </div>
              </div>
              <div>
                <svg
                  width="13"
                  height="13"
                  viewBox="0 0 32 32"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    d="M10.5859 3.27307C10.211 3.64813 10.0003 4.15674 10.0003 4.68707C10.0003 5.2174 10.211 5.72602 10.5859 6.10107L20.4859 16.0011L10.5859 25.9011C10.2216 26.2783 10.02 26.7835 10.0246 27.3079C10.0291 27.8323 10.2395 28.3339 10.6103 28.7047C10.9811 29.0755 11.4827 29.2859 12.0071 29.2904C12.5315 29.295 13.0367 29.0934 13.4139 28.7291L24.7279 17.4151C25.1028 17.04 25.3135 16.5314 25.3135 16.0011C25.3135 15.4707 25.1028 14.9621 24.7279 14.5871L13.4139 3.27307C13.0388 2.89813 12.5302 2.6875 11.9999 2.6875C11.4696 2.6875 10.961 2.89813 10.5859 3.27307Z"
                    fill="#B1081A"
                  />
                </svg>
              </div>
            </Link>
          ) : (
            <SelectLocation />
          )}
        </div>
      </section>
    </div>
  );
};

export default CarSection;
