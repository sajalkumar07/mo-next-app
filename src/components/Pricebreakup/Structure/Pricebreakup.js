import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import Location from "../../Productpage/Structure/locationProd";
import { PencilOff } from "lucide-react";
import Adbanner2 from "../../Homepage/Structure/Adbanner2";
import ChangeCar from "./Changecar";
import ChangeVarient from "./ChangecarSearch";
import StillConfused from "../../Variantpage/StillConfused";
import seater from "../../../Images/icons/seat.png";
import petrol from "../../../Images/icons/gas.png";
import manul from "../../../Images/icons/machin.png";
import ncap from "../../../Images/icons/privi.png";
import { Bookmark, Star, Info, Share2, X } from "lucide-react";
import { debounce } from "lodash";
import Tyre from "../../../Images/tyremask.png";

const Pricebreakup = () => {
  const [singlecardData, setSingleCardData] = useState([]);
  const [carPrice, setcarPrice] = useState([]);
  const [applicableRTOdata, setApplicableRTOdata] = useState(null);
  const [applicableTax, setapplicableTax] = useState(null);
  const [rtoData, setRtoData] = useState([]);
  const [isLoadingb, setIsLoadingb] = useState(true);
  const [isLoading, setIsLoading] = useState(true);
  const params = useParams();
  const [downPayment, setDownPayment] = useState(100000); // Default to 1 lakh
  const [activeTooltip, setActiveTooltip] = useState(null);

  const toggleTooltip = (tooltipId) => {
    setActiveTooltip(activeTooltip === tooltipId ? null : tooltipId);
  };

  // Close tooltip when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (!event.target.closest(".tooltip-container")) {
        setActiveTooltip(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const Tooltip = ({ id, content, children }) => {
    return (
      <div className="relative tooltip-container inline-flex justify-center">
        <div
          onClick={() => toggleTooltip(id)}
          onMouseEnter={() => setActiveTooltip(id)}
          className="cursor-pointer flex justify-center"
        >
          {children}
        </div>
        {activeTooltip === id && (
          <div className="absolute z-10 w-[240px] min-h-[90px] px-2 py-2 pt-4 pb-3 text-[9px]  font-[Montserrat] text-white bg-[#828282F2] rounded-2xl shadow-lg transform -translate-x-1/2 left-1/2 bottom-full mb-2 ">
            <button
              onClick={() => setActiveTooltip(null)}
              className="absolute top-1 right-2 text-white text-xs font-bold focus:outline-none"
            >
              <X size={14} />
            </button>
            <span className="text-[12px]">{content}</span>
          </div>
        )}
      </div>
    );
  };

  const [tenure, setTenure] = useState(7);
  const [rate, setRate] = useState(8);
  const [emiData, setEmiData] = useState({
    emiPerMonth: 0,
    data: [],
  });
  const [OnRoadPrice, setOnRoadPrice] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isCalculating, setIsCalculating] = useState(false);

  useEffect(() => {
    if (OnRoadPrice) {
      const twentyPercent = Math.round(OnRoadPrice * 0.2);
      setDownPayment((prev) => Math.max(prev, twentyPercent));
    }
  }, [OnRoadPrice]);

  // Helper function to normalize fuel type - treat hybrid as petrol
  const normalizeFuelType = (fuelType) => {
    if (!fuelType) return "";
    const normalizedFuel = fuelType.toLowerCase();
    if (normalizedFuel.includes("hybrid")) {
      return "petrol";
    }
    return normalizedFuel;
  };

  const formatNumber = (num, fullFormat = false) => {
    if (num === null || num === undefined || num === 0) return "₹0";

    if (fullFormat) {
      return `₹${new Intl.NumberFormat("en-IN").format(Math.round(num))}`;
    }

    if (num >= 1e7) {
      return `₹${(num / 1e7).toFixed(2)} Crore`;
    } else if (num >= 1e5) {
      return `₹${(num / 1e5).toFixed(2)} Lakh`;
    } else {
      return `₹${new Intl.NumberFormat("en-IN").format(Math.round(num))}`;
    }
  };

  // Create a separate function for loan amount display (full price, no decimal)
  const formatLoanAmount = (num) => {
    if (num === null || num === undefined || num === 0) return "₹0";
    return `₹${new Intl.NumberFormat("en-IN").format(Math.round(num))}`;
  };

  // Also update the formatCurrency function to be consistent
  const formatCurrency = (value) => {
    if (value >= 1e7) {
      return `₹${(value / 1e7).toFixed(2)} Crore`;
    } else if (value >= 1e5) {
      return `₹${(value / 1e5).toFixed(2)} Lakh`;
    } else {
      return `₹${new Intl.NumberFormat("en-IN").format(Math.round(value))}`;
    }
  };

  const formatNumberEmi = (num) => {
    if (num === null || num === undefined) return "₹0";
    const cleanNum =
      typeof num === "string" ? parseFloat(num.replace(/[^0-9.]/g, "")) : num;
    return `₹${new Intl.NumberFormat("en-IN").format(Math.round(cleanNum))}`;
  };

  // Get applicable RTO data based on price and fuel type
  const getApplicableRTOData = (price, fuelType) => {
    if (!price || !fuelType || !Array.isArray(rtoData)) return null;

    const normalizedFuel = normalizeFuelType(fuelType);
    const priceNum = parseFloat(price) || 0;

    return (
      rtoData.find((rto) => {
        const isPriceWithinRange =
          rto.endPrice === "ABOVE"
            ? priceNum >= parseFloat(rto.startPrice)
            : priceNum >= parseFloat(rto.startPrice) &&
              priceNum <= parseFloat(rto.endPrice);

        return (
          (rto.fuelType || "").toUpperCase() === normalizedFuel.toUpperCase() &&
          isPriceWithinRange
        );
      }) || null
    );
  };

  // Main on-road price calculation
  const calculateOnRoadPrice = (product, fuelType) => {
    // Extract price (handles both variant and direct car data)
    let productPrice;
    if (typeof product === "object") {
      productPrice = product.exShowroomPrice || 0;
    } else {
      productPrice = product; // Direct number input
    }

    const priceStr = productPrice.toString();
    const price = parseFloat(productPrice) || 0;

    // Early exit for invalid prices
    if (!/[0-9]/.test(priceStr)) return 0;
    if (!Array.isArray(rtoData) || rtoData.length === 0) return price;

    // Normalize fuel type (treat hybrid as petrol)
    const normalizedFuelType = normalizeFuelType(fuelType);

    // Get applicable RTO rates
    const roadPriceData = getApplicableRTOData(priceStr, normalizedFuelType);
    if (!roadPriceData) return price;

    // --- Calculate Components ---
    // 1. RTO Tax
    const rto = calculateRtoPrice(
      priceStr,
      roadPriceData.rtoPercentage || "0",
      roadPriceData.amount || "0",
      normalizedFuelType
    );

    // 2. Road Safety Tax (2% of RTO)
    const roadSafetyTax = calculateRoadSafetyTax(rto);

    // 3. Insurance (percentage of vehicle price)
    const insurance = calculateInsurancePrice(
      priceStr,
      roadPriceData.insurancePercentage || "0"
    );

    // 4. Luxury Tax (1% for cars above ₹10L)
    const luxuryTax = price > 999999 ? Math.ceil(price / 100) : 0;

    // 5. Additional Charges
    const hypethecationCharges = parseInt(
      roadPriceData.hypethecationCharges || "0"
    );
    const fastag = parseInt(roadPriceData.fastag || "0");
    const others = parseInt(roadPriceData.others || "0");

    // --- Final Calculation ---
    const total =
      price + // Base price
      rto + // RTO tax
      roadSafetyTax + // Safety tax
      insurance + // Insurance
      luxuryTax + // Luxury tax
      hypethecationCharges +
      fastag +
      others;

    return total;
  };

  // Helper functions for price calculation
  const calculateRtoPrice = (productPrice, rtoPercentage, amount, fuelType) => {
    const price = parseInt(productPrice) || 0;
    const percentage = parseFloat(rtoPercentage) || 0;
    const flatAmount = parseInt(amount) || 0;

    let rto = 0;

    // Calculate percentage-based RTO if percentage exists
    if (percentage > 0) {
      rto = Math.ceil((percentage * price) / 100);
    }

    // For EVs or when percentage is 0, add flat amount
    if (fuelType.toLowerCase() === "electric" || percentage === 0) {
      rto += flatAmount;
    }

    return rto;
  };

  const calculateRoadSafetyTax = (rto) => Math.ceil((rto * 2) / 100);

  const calculateInsurancePrice = (productPrice, insurancePercentage) => {
    return Math.ceil(
      (parseInt(productPrice) * parseFloat(insurancePercentage)) / 100
    );
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
      console.error("Error fetching RTO data:", error);
    }
  };

  // EMI calculation function
  const calculateEMI = useCallback(async () => {
    setIsCalculating(true);
    try {
      const totalAmount = Number(
        OnRoadPrice || singlecardData?.data?.exShowroomPrice || 0
      );
      const downPaymentNum = Number(downPayment);
      const tenureNum = Number(tenure);
      const rateNum = Number(rate);

      if (
        isNaN(totalAmount) ||
        isNaN(downPaymentNum) ||
        isNaN(tenureNum) ||
        isNaN(rateNum)
      ) {
        return;
      }

      // Check if down payment equals total amount (max range)
      if (downPaymentNum >= totalAmount) {
        setEmiData({
          emiPerMonth: 0,
          data: [],
        });
        setIsCalculating(false);
        return;
      }

      const payload = {
        totalAmount,
        downPayment: downPaymentNum,
        tenure: tenureNum,
        rate: rateNum,
      };

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/v1/emi-calculator`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(payload),
        }
      );

      if (response.ok) {
        const data = await response.json();
        const formattedData = data.data.map((item) => ({
          ...item,
          principalPaid: formatNumberEmi(item.principalPaid),
          interestPaid: formatNumberEmi(item.interestPaid),
          balance: formatNumberEmi(item.balance),
        }));
        setEmiData({
          emiPerMonth: formatNumberEmi(data.emiPerMonth),
          data: formattedData,
        });
      }
    } catch (error) {
      console.error("Error:", error);
    } finally {
      setIsCalculating(false);
    }
  }, [OnRoadPrice, singlecardData, downPayment, tenure, rate]);

  const handleRangeChange = (e) => {
    const value = Number(e.target.value);
    const maxValue = OnRoadPrice || singlecardData?.data?.exShowroomPrice || 0;

    setDownPayment(value);

    // Calculate loan amount with the new down payment
    const loanAmount = maxValue - value;

    // If loan amount is very small (less than 5000), adjust down payment to full amount
    if (loanAmount < 5000) {
      setDownPayment(maxValue);
      setEmiData({
        emiPerMonth: 0,
        data: [],
      });
    } else if (value >= maxValue) {
      // If at max value, immediately set EMI to zero
      setEmiData({
        emiPerMonth: 0,
        data: [],
      });
    }
  };
  const getLoanAmount = () => {
    const totalAmount = OnRoadPrice || 0;
    const downPaymentAmount = downPayment || 0;

    // If down payment equals or exceeds total amount, loan is 0
    if (downPaymentAmount >= totalAmount) {
      return 0;
    }

    const loanAmount = totalAmount - downPaymentAmount;

    if (loanAmount < 5000) {
      return 0;
    }

    return loanAmount;
  };

  // Fetch car data by ID
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${params.id}`
        );
        const data = await response.json();
        setSingleCardData(data);
        setcarPrice(data?.data?.exShowroomPrice);

        // Calculate on-road price immediately when data loads
        if (data?.data) {
          const onRoadPrice = calculateOnRoadPrice(
            data.data.exShowroomPrice,
            data.data.fuel
          );
          setOnRoadPrice(onRoadPrice);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    fetchRTOData();
  }, []);

  // Calculate applicable RTO data whenever car price or fuel type changes
  useEffect(() => {
    if (singlecardData?.data && rtoData.length > 0) {
      const applicableData = getApplicableRTOData(
        singlecardData.data.exShowroomPrice,
        singlecardData.data.fuel
      );
      setApplicableRTOdata(applicableData);
    }
  }, [singlecardData, rtoData]);

  // Recalculate on-road price when relevant data changes
  useEffect(() => {
    if (singlecardData?.data && rtoData.length > 0) {
      const onRoadPrice = calculateOnRoadPrice(
        singlecardData.data.exShowroomPrice,
        singlecardData.data.fuel
      );
      setOnRoadPrice(onRoadPrice);
    }
  }, [singlecardData, rtoData]);

  // Recalculate EMI when any input changes
  useEffect(() => {
    const debouncedCalculate = debounce(() => {
      calculateEMI();
    }, 300);

    debouncedCalculate();

    return () => {
      debouncedCalculate.cancel();
    };
  }, [calculateEMI]);

  // Calculate individual price components for display
  const getPriceComponents = () => {
    if (!singlecardData?.data || !applicableRTOdata) return null;

    const price = singlecardData.data.exShowroomPrice || 0;
    const fuelType = singlecardData.data.fuel || "";

    return {
      exShowroomPrice: price,
      rtoCharges: calculateRtoPrice(
        price,
        applicableRTOdata.rtoPercentage,
        applicableRTOdata.amount,
        fuelType
      ),
      roadSafetyTax: calculateRoadSafetyTax(
        calculateRtoPrice(
          price,
          applicableRTOdata.rtoPercentage,
          applicableRTOdata.amount,
          fuelType
        )
      ),
      insurance: calculateInsurancePrice(
        price,
        applicableRTOdata.insurancePercentage
      ),
      luxuryTax: price > 999999 ? Math.ceil(price / 100) : 0,
      hypethecationCharges: parseInt(
        applicableRTOdata.hypethecationCharges || "0"
      ),
      fastag: parseInt(applicableRTOdata.fastag || "0"),
      others: parseInt(applicableRTOdata.others || "0"),
    };
  };

  const priceComponents = getPriceComponents();

  // Input handlers
  const handleTenureChange = (year) => {
    setTenure(year);
  };

  const handleDownPaymentChange = (e) => {
    const value = e.target.value.replace(/\D/g, "");
    const numValue = value ? Number(value) : 0;
    const maxValue = OnRoadPrice || singlecardData?.data?.exShowroomPrice || 0;

    // Ensure down payment is at least 20% but not more than the full price
    const twentyPercent = Math.round(maxValue * 0.2);
    const newValue = Math.min(Math.max(numValue, twentyPercent), maxValue);

    setDownPayment(newValue);
  };

  const handleRateChange = (e) => {
    const value = e.target.value.replace(/[^\d.]/g, "");
    setRate(value ? parseFloat(value) : 0);
  };

  const selectedData = emiData?.data?.find(
    (item) => item.months === tenure * 12
  );

  const calculateTotalInterest = (emiData) => {
    if (!emiData || !emiData.data || emiData.data.length === 0) return 0;

    return emiData.data.reduce((total, row) => {
      const interestAmount =
        parseFloat(row.interestPaid.replace(/₹|,/g, "")) || 0;
      return total + interestAmount;
    }, 0);
  };

  return (
    <div className="relative w-full ">
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
        {/* <div>
        <div className="label">
          <p className="FIND-YOUR-INFO mt-5 brand">
            <span className="text-wrapper">PRICE </span>
            <span className="text-wrapper-2">BREAKUP</span>
          </p>
        </div>
      </div> */}
        <section className="inline-section-product mt-3 mb-20">
          <section className="card-car-full-product">
            <div className="card-car-full-product-info">
              <div>
                {" "}
                <div className="d-flex flex-row  space-x-1">
                  <div className="thecolo font-weight-bold text-[#938C8C]">
                    On-Road in{" "}
                  </div>
                  <div className="flex justify-start items-center">
                    <Location />
                  </div>
                </div>
                <div className="mt-[15px] w-[37px] h-[18px] space-x-2 rounded-md shadow-md shadow-black/black  bg-[#B1081A] flex justify-center items-center relative">
                  <span className="text-white text-center text-[10px]">
                    {singlecardData?.data?.product_id?.movrating}
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
                {singlecardData?.data?.product_id?.heroimage && (
                  <img
                    className="main-product-image"
                    src={`${process.env.NEXT_PUBLIC_API}/productImages/${singlecardData?.data?.product_id?.heroimage}`}
                    crossOrigin="anonymous"
                    alt={
                      singlecardData?.data?.product_id?.heroimagename ||
                      "Car image"
                    }
                  />
                )}
              </div>

              <div className="sider-info-product-full">
                <div className="d-flex justify-content-between">
                  <div>
                    <div className="inside_card_title_product theoldtxt">
                      {singlecardData?.data?.product_id?.carname}{" "}
                      <span>&nbsp;- {singlecardData?.data?.varientName}</span>
                    </div>
                    <div className="product-launch d-flex align-items-center">
                      LAUNCHED IN{" "}
                      {singlecardData?.data?.product_id?.launchedinput}
                      <ion-icon
                        name="information-circle-outline"
                        className="infomation-gray"
                      ></ion-icon>
                    </div>
                  </div>
                  <div className="d-flex flex-column align-items-center"></div>
                </div>
                <div className="">
                  <div className="on-road-price"></div>
                  <div className="mb-2">
                    {singlecardData?.data?.varientName ? (
                      <div className="">
                        <span className="text-[#818181] text-[14px] ">
                          {singlecardData?.data?.brand_id?.name}&nbsp;
                        </span>
                        <span className="text-[#B1081A] text-[14px] ">
                          {singlecardData?.data?.product_id?.carname}
                        </span>{" "}
                        -{" "}
                        <span className="text-[#B1081A] text-[14px]">
                          {singlecardData?.data?.varientName}
                        </span>
                      </div>
                    ) : (
                      <span></span>
                    )}
                  </div>
                  <div className="flex justify-between items-center sapce-x-4 w-ful">
                    {" "}
                    <ChangeCar />
                    <ChangeVarient />
                  </div>
                </div>
              </div>
            </div>
            <div></div>
          </section>
          <div className="section-product-jfull mt-4">
            <div className="sideseaterinfo-product">
              <img className="icon_image" src={seater} alt="Seater Icon" />
              <span className="text-[11px]">
                {singlecardData?.data?.seater} Seater
              </span>
            </div>
            <div className="sideseaterinfo-product">
              <img className="icon_image" src={petrol} alt="Petrol Icon" />
              <span className="text-[11px]">{singlecardData?.data?.fuel}</span>
            </div>
            <div className="sideseaterinfo-product">
              <img className="icon_image" src={manul} alt="Manual Icon" />
              <span className="text-[11px]">
                {singlecardData?.data?.transmission}
              </span>
            </div>
            <div className="sideseaterinfo-product">
              <img className="icon_image" src={ncap} alt="NCAP Icon" />{" "}
              <span className="text-[11px]">
                {singlecardData?.data?.GNCAP} Star Ratings
              </span>
            </div>
          </div>
        </section>
        <section className="d-flex inline-section-product gap-22 thepricebre price-breakup -mt-20">
          <div className="w-[360px] flex-col p-[18px] bg-white shadow-md boroder shadow-black/30 rounded-lg">
            <div className="label">
              <p className="text-[15px] font-sans font-bold">
                <span className="text-[var(--gray);]">
                  On-Road Price Details For{" "}
                </span>
                <span className="text-wrapper-2">
                  {singlecardData?.data?.brand_id?.name}&nbsp;
                  {singlecardData?.data?.product_id?.carname}
                  {singlecardData?.data?.varientName &&
                    ` ${singlecardData.data.varientName}`}
                </span>
              </p>
            </div>
            <section className="w-full flex justify-between items-center ">
              {priceComponents ? (
                <div className="d-flex flex-column justify-content-between w-full font-sans text-[12px] space-y-6">
                  <div className="flex jstify-between flex-col space-y-4 p-2">
                    <div className="d-flex justify-content-between items-center">
                      <span className="text-[#818181] text-[12px] font-[Montserrat] font-medium flex items-center gap-1">
                        • Ex- Showroom Price:
                        <Tooltip
                          id="exShowroomPrice"
                          content="The Ex-Showroom price is the initial cost set by the dealer, inclusive of GST paid to the government and the procurement fee from the manufacture."
                        >
                          <Info size={18} className="cursor-pointer" />{" "}
                        </Tooltip>
                      </span>
                      <span className="font-[Montserrat] font-medium">
                        {formatNumber(priceComponents.exShowroomPrice, true)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-[#818181] text-[12px] font-[Montserrat] font-medium">
                        • Registration Type :
                      </span>
                      <span className="font-[Montserrat] font-medium">
                        {applicableRTOdata?.vehicleType || "N/A"} Registration
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between flex-col space-y-4 bg-[#F4F9FF] p-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-[#818181] text-[12px] font-[Montserrat] font-medium flex items-center gap-1">
                        • RTO Charges :
                        <Tooltip
                          id="rtoCharges"
                          content="RTO charges encompass the expenses associated with vehicle registration, including road tax and other statutory fees mandated by the government to ensure legal compliance."
                        >
                          <Info size={18} className="cursor-pointer" />
                        </Tooltip>
                      </span>
                      <span className="font-[Montserrat] font-medium">
                        {formatNumber(priceComponents.rtoCharges, true)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-[#818181] text-[12px] font-[Montserrat] font-medium">
                        • Road Safety and Tax /Cess :
                      </span>
                      <span className="font-[Montserrat] font-medium">
                        {formatNumber(priceComponents.roadSafetyTax, true)}
                      </span>
                    </div>

                    <div className="d-flex justify-content-between">
                      <span className="text-[#818181] text-[12px] font-[Montserrat] font-medium">
                        • Tax Collected at Source (TCS) :
                      </span>
                      <span className="font-[Montserrat] font-medium">
                        {formatNumber(priceComponents.luxuryTax) || "NIL"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between flex-col space-y-4 p-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-[#818181] text-[12px] font-[Montserrat] font-medium flex items-center gap-1">
                        • Insurance Cost :{" "}
                        <Tooltip
                          id="insurenace cost"
                          content="Insurance costs cover the premium for safeguarding your vehicle against damages, accidents and theft, providing financial protection and peace of mind on the road."
                        >
                          <Info size={18} className="cursor-pointer" />
                        </Tooltip>
                      </span>
                      <span className="font-[Montserrat] font-medium">
                        {formatNumber(priceComponents.insurance, true)}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-[#818181] text-[12px] font-[Montserrat] font-medium flex items-center gap-1">
                        • Other Charges :{" "}
                        <Tooltip
                          id="other charges"
                          content="Any charges that may include administrative fees, dealer charges, or any state-specific levies."
                        >
                          <Info size={18} className="cursor-pointer" />
                        </Tooltip>
                      </span>
                      <span className="font-[Montserrat] font-medium">
                        {formatNumber(priceComponents.others, true) || "NIL"}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between flex-col space-y-4 p-2">
                    <div className="d-flex justify-content-between">
                      <span className="text-[#818181] text-[12px] font-[Montserrat] font-medium">
                        • Hypothecation Charges :
                      </span>
                      <span className="font-[Montserrat] font-medium">
                        {formatNumber(
                          priceComponents.hypethecationCharges,
                          true
                        )}
                      </span>
                    </div>
                    <div className="d-flex justify-content-between">
                      <span className="text-[#818181] text-[12px] font-[Montserrat] font-medium">
                        • Fast Tag Charges :
                      </span>
                      <span className="font-[Montserrat] font-medium">
                        {formatNumber(priceComponents.fastag, true)}
                      </span>
                    </div>
                  </div>

                  <div className="flex justify-between flex-col space-y-4 p-2 bg-[#F4F9FF]">
                    <div className="d-flex justify-content-between  ">
                      <span className=" flex items-center gap-1">
                        <span className="text-[black] text-[14px] font-[Montserrat] font-bold">
                          • Total On-Road Price :
                        </span>
                        <Tooltip
                          id="total on road Price"
                          content="The On-Road price gives you the complete picture, including Ex-Showroom price, RTO charges, insurance premiums, and additional costs, ensuring transparency and informed decision-making"
                        >
                          <Info size={18} className="cursor-pointer" />
                        </Tooltip>
                      </span>
                      <span className="text-red-800 font-[Montserrat] font-bold text-[14px]">
                        {formatNumber(OnRoadPrice, true)}
                      </span>
                    </div>
                  </div>
                </div>
              ) : (
                <div>Loading price details...</div>
              )}
            </section>
          </div>
        </section>
        <div className="mt-4">
          <StillConfused />
        </div>

        <Adbanner2 />

        <div className="p-2">
          <div className="border shadow-md shadow-black/30 p-4 bg-white">
            <div className="label">
              <p className="text-[15px] font-sans font-bold">
                <span className="text-wrapper">Calculate Your Loan EMI </span>
                <span className="text-[var(--red)]">
                  {" "}
                  {singlecardData?.data?.brand_id?.name}
                  &nbsp;
                  {singlecardData?.data?.product_id?.carname}{" "}
                  {singlecardData?.data?.varientName}
                </span>
              </p>
            </div>
            <section className="d-flex gap-3 in ne-section-product maintyry mt-4">
              <section className="w-45 fontero">
                <div>
                  <span className="tenuree">Tenure (Years)</span>
                  <div className="w-full  flex justify-center items-center ">
                    <div className="flex justify-between mt-4 gap-1 ">
                      {[1, 2, 3, 4, 5, 6, 7].map((year) => (
                        <span
                          key={year}
                          className={`
                          cursor-pointer px-3 py-1 flex justify-center items-center rounded-lg w-[31px] h-[21px] text-center text-[13px] font-bold 
                          ${
                            tenure === year
                              ? "bg-red-600 text-white"
                              : "bg-[#D9D9D9] text-gray-600 "
                          }
                          transition-colors duration-200
                        `}
                          onClick={() => handleTenureChange(year)}
                        >
                          {year}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="mt-5">
                  <div>
                    <div className="d-flex justify-content-between mb-2">
                      <div className="text-left">
                        <div className="text-[13px] font-semibold text-[#828282]">
                          Down Payment
                        </div>
                        <div className="font-bold text-[13px]  text-[#B1081A]">
                          {formatNumber(downPayment)}
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-[13px] font-semibold text-[#828282]">
                          Loan Amount
                        </div>
                        <div className="font-bold  text-[13px]  text-[#B1081A]">
                          {formatLoanAmount(getLoanAmount())}
                        </div>
                      </div>
                    </div>{" "}
                    {/* <div className="d-flex justify-content-between">
                        <span className="tenuree">Down Payment</span>
                        <div className="selaced-value">
                          ₹
                          <input
                            type="text"
                            value={downPayment}
                            onChange={handleDownPaymentChange}
                          />
                        </div>
                      </div> */}
                    <input
                      type="range"
                      className="form-range w-100"
                      min={OnRoadPrice ? Math.round(OnRoadPrice * 0.2) : 100000}
                      max={
                        OnRoadPrice ||
                        singlecardData?.data?.exShowroomPrice ||
                        100000
                      }
                      step="10000"
                      value={downPayment}
                      onChange={handleRangeChange}
                      style={{ accentColor: "#B1081A" }}
                    />
                    <div className="text-[12px] font-semibold text-[#828282] flex justify-between">
                      <span className="text-[12px] font-semibold text-[#828282]">
                        {OnRoadPrice
                          ? formatCurrency(Math.round(OnRoadPrice * 0.2))
                          : "₹1.00 Lakhs"}
                      </span>
                      <div>
                        {" "}
                        <span className="text-[12px] font-semibold text-[#828282]">
                          On-Road Price
                        </span>{" "}
                        <span className="text-[#B1081A] font-bold text-[12px]">
                          {OnRoadPrice
                            ? formatCurrency(OnRoadPrice)
                            : singlecardData?.data?.exShowroomPrice
                            ? formatCurrency(
                                singlecardData.data.exShowroomPrice
                              )
                            : "₹1.00 Lakhs"}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div>
                    <div className="mt-6">
                      <span className="text-[13px] font-semibold text-[#828282] ">
                        Bank Interest Rate
                      </span>
                      <div className="text-[13px] font-semibold text-[#B1081A]">
                        <span
                          contentEditable
                          onBlur={(e) =>
                            setRate(parseFloat(e.target.textContent) || 0)
                          }
                          suppressContentEditableWarning
                        >
                          <div className="font-bold  text-[13px]  text-[#B1081A]">
                            % {rate}
                          </div>
                        </span>
                      </div>
                    </div>
                    <input
                      type="range"
                      className="form-range w-100"
                      min="7"
                      max="15"
                      step="0.1"
                      value={rate}
                      onChange={(e) => setRate(Number(e.target.value))}
                      style={{ accentColor: "#B1081A" }}
                    />
                    <div className="mt-1 d-flex justify-content-between">
                      <span className="perrmon">7 %</span>
                      <span className="perrmon">15 %</span>
                    </div>
                  </div>
                </div>

                {/* <div className="flex justify-center items-center p-2">
                <main className="bg-[#F4F9FF] space-y-1 font-sans w-[326px] h-[73px] p-4">
                  <div className="d-flex justify-content-between">
                    <span className="text-[#818181]">• Total loan amoudnt</span>
                    <span className="mainoprice">
                      {formatNumber((OnRoadPrice || 0) - (downPayment || 0))}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-[#818181]">• Payable amount</span>
                    <span className="mainoprice">
                      {selectedData
                        ? formatNumber(
                            parseFloat(
                              selectedData.principalPaid.replace(/₹|,/g, "")
                            ) +
                              parseFloat(
                                selectedData.interestPaid.replace(/₹|,/g, "")
                              )
                          )
                        : "₹0"}
                    </span>
                  </div>
                  <div className="d-flex justify-content-between">
                    <span className="text-[#818181]">• You'll pay extra</span>
                    <span className="mainoprice">
                      {selectedData
                        ? formatNumberEmi(selectedData.interestPaid)
                        : "₹0"}
                    </span>
                  </div>
                </main>
              </div> */}
                <div className="flex justify-center items-center flex-col h-[200px] space-y-10 ">
                  <div className="flex flex-col  justify-center items-center border-2 border-[#AB373A] gap-y-3 p-4">
                    <span className="text-[20px] text-[#828282] font-bold font-[Montserrat]">
                      EMI
                    </span>
                    <span className="perrmon">PER MONTH</span>
                    <span className="font-[Montserrat] text-[#AB373A] font-bold text-[20px]">
                      {isCalculating
                        ? "Calculating..."
                        : getLoanAmount() === 0
                        ? "₹0 /-"
                        : emiData.emiPerMonth
                        ? ` ${emiData.emiPerMonth} /-`
                        : " 0 /-"}
                    </span>
                    <span className="perrmon">CALCULATED ON ROAD PRICE</span>
                  </div>
                </div>
              </section>

              <div className="flex justify-center items-center w-full p-4 -mt-24">
                <div className="w-full max-w-xl">
                  <div className="text-[14px] font-semibold font-[Montserrat]  mb-2">
                    <span className="text-gray-600  ">Payment </span>
                    <span className="text-red-700">breakup</span>
                  </div>

                  {isCalculating ? (
                    <div className="text-center p-4">
                      Calculating EMI details...
                    </div>
                  ) : emiData && emiData.data && emiData.data.length > 0 ? (
                    <table
                      className="w-full border-2 border-[#818181] font-[Montserrat] font-medium  text-[12px] text-right"
                      style={{ backgroundColor: "white" }}
                    >
                      <thead className="text-center">
                        <tr style={{ backgroundColor: "white" }}>
                          <th
                            className="border-2 border-[#818181] p-2 text-red-700 "
                            style={{ backgroundColor: "white" }}
                          >
                            Months
                          </th>
                          <th
                            className="border-2 border-[#818181] p-2 text-red-700"
                            style={{ backgroundColor: "white" }}
                          >
                            Principle
                          </th>
                          <th
                            className="border-2 border-[#818181] p-2 text-red-700"
                            style={{ backgroundColor: "white" }}
                          >
                            Interest
                          </th>
                          <th
                            className="border-2 border-[#818181] p-2 text-red-700"
                            style={{ backgroundColor: "white" }}
                          >
                            Balance
                          </th>
                        </tr>
                      </thead>
                      <tbody style={{ backgroundColor: "white" }}>
                        {emiData.data.map((row, index) => (
                          <tr key={index} style={{ backgroundColor: "white" }}>
                            <td
                              className="border-2 border-[#818181] p-2 text-center"
                              style={{ backgroundColor: "white" }}
                            >
                              {row.months}
                            </td>
                            <td
                              className="border-2 border-[#818181] p-2"
                              style={{ backgroundColor: "white" }}
                            >
                              {row.principalPaid}
                            </td>
                            <td
                              className="border-2 border-[#818181] p-2"
                              style={{ backgroundColor: "white" }}
                            >
                              {row.interestPaid}
                            </td>
                            <td
                              className="border-2 border-[#818181] p-2"
                              style={{ backgroundColor: "white" }}
                            >
                              {row.balance}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div className="text-center p-4">
                      Adjust values to see EMI breakdown
                    </div>
                  )}
                </div>
              </div>
            </section>

            <div className="flex justify-center items-center text-center p-4 flex-col font-sans">
              MotorOctane can help you get the best deal on your loans. Call us
              on
              <span className="text-red-800"> 8779952811</span>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Pricebreakup;
