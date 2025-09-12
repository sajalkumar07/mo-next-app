import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import Adbanner2 from "../../Homepage/Structure/Adbanner2";
import Select from "react-select";
import { Link } from "react-router-dom";
import cities from "../../Homepage/Structure/subcomponents/statelist.json";
import seater from "../../../Images/icons/seat.png";
import petrol from "../../../Images/icons/gas.png";
import manul from "../../../Images/icons/machin.png";
import ncap from "../../../Images/icons/privi.png";
import ChangeCar from "./Changecar";
import ChangeVarient from "./ChangecarSearch";
import { Bookmark, Star, Info, Share2 } from "lucide-react";
import { debounce } from "lodash";
import Location from "../../Productpage/Structure/locationProd";
import Tyre from "../../../Images/tyremask.png";

const EmiCalculator = () => {
  const [singlecardData, setSingleCardData] = useState([]);
  const [carPrice, setcarPrice] = useState([]);
  const [applicableRTOdata, setApplicableRTOdata] = useState(null);
  const [rtoData, setRtoData] = useState([]);
  const [isLoadingb, setIsLoadingb] = useState(true);

  const [downPayment, setDownPayment] = useState(100000);
  const [tenure, setTenure] = useState(7);
  const [rate, setRate] = useState(8);
  const [emiData, setEmiData] = useState({
    emiPerMonth: 0,
    data: [],
  });
  const [OnRoadPrice, setOnRoadPrice] = useState(null);
  const [isCalculating, setIsCalculating] = useState(false);

  const [brands, setBrands] = useState([]);
  const [cars, setCars] = useState([]);
  const [variants, setVariants] = useState([]);
  const [selectedBrand, setSelectedBrand] = useState(null);
  const [selectedCar, setSelectedCar] = useState(null);
  const [selectedVariant, setSelectedVariant] = useState(null);
  const params = useParams();
  const { brandId, productId, id } = params;
  const navigate = useNavigate();

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
    const price = parseInt(productPrice);
    let rto = Math.ceil((parseFloat(rtoPercentage) * price) / 100);

    // Flat amount for EVs or when percentage is 0
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

  // Fetch RTO data
  const fetchRTOData = async (state) => {
    if (!state) {
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
          body: JSON.stringify({ state }),
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

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingb(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Fetch variant data when id changes
  useEffect(() => {
    const fetchVariantData = async () => {
      if (!id) return;

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${id}`
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
        console.error("Error fetching variant data:", error);
      }
    };

    fetchVariantData();
  }, [id]);

  const savedLocation = JSON.parse(localStorage.getItem("location")) || {};
  const [state, setState] = useState(savedLocation.state || null);
  const [city, setCity] = useState(savedLocation.city || null);
  const [options, setOptions] = useState([]);

  useEffect(() => {
    const uniqueStates = [...new Set(cities.map((city) => city.State))];
    const stateOptions = uniqueStates.map((state) => ({
      label: state,
      value: state,
    }));
    setOptions(stateOptions);
  }, []);

  const handleStateChange = (selectedOption) => {
    setState(selectedOption.value);
    setCity(selectedOption.value);
    fetchRTOData(selectedOption.value);
  };

  useEffect(() => {
    if (state) {
      fetchRTOData(state);
    }
  }, [state]);

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

  // Ensure down payment is at least 20% of on-road price
  useEffect(() => {
    if (OnRoadPrice) {
      const twentyPercent = Math.round(OnRoadPrice * 0.2);
      setDownPayment((prev) => Math.max(prev, twentyPercent));
    }
  }, [OnRoadPrice]);

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

  // Fetch brands, cars, and variants for dropdowns
  const fetchInitialData = async () => {
    try {
      // Fetch brands
      const brandsResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/brands`
      );
      const brandsData = await brandsResponse.json();
      const formattedBrands = brandsData.data.map((brand) => ({
        value: brand._id,
        label: brand.name,
      }));
      setBrands(formattedBrands);

      // Set selected brand from params if available
      if (brandId) {
        const brandFromParams = formattedBrands.find(
          (brand) => brand.value === brandId
        );
        if (brandFromParams) {
          setSelectedBrand(brandFromParams);
          // Fetch cars for this brand
          const carsResponse = await fetch(
            `${process.env.NEXT_PUBLIC_API}/api/cars/brand/${brandId}`
          );
          const carsData = await carsResponse.json();
          const formattedCars = carsData.map((car) => ({
            value: car._id,
            label: car.carname,
          }));
          setCars(formattedCars);

          // Set selected car from params if available
          if (productId) {
            const carFromParams = formattedCars.find(
              (car) => car.value === productId
            );
            if (carFromParams) {
              setSelectedCar(carFromParams);
              // Fetch variants for this car
              const variantsResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/api/variants/active/${productId}`
              );
              const variantsData = await variantsResponse.json();
              if (variantsData.success && Array.isArray(variantsData.data)) {
                const formattedVariants = variantsData.data.map((variant) => ({
                  value: variant._id,
                  label: variant.varientName,
                }));
                setVariants(formattedVariants);

                // Set selected variant from params if available
                if (id) {
                  const variantFromParams = formattedVariants.find(
                    (variant) => variant.value === id
                  );
                  if (variantFromParams) {
                    setSelectedVariant(variantFromParams);
                  }
                }
              }
            }
          }
        }
      }
    } catch (error) {
      console.error("Error fetching initial data:", error);
    }
  };

  useEffect(() => {
    fetchInitialData();
  }, [brandId, productId, id]);

  // Handle brand selection change
  const handleBrandChange = (selectedOption) => {
    setSelectedBrand(selectedOption);
    setSelectedCar(null);
    setSelectedVariant(null);
    setVariants([]);
    if (selectedOption) {
      fetch(
        `${process.env.NEXT_PUBLIC_API}/api/cars/brand/${selectedOption.value}`
      )
        .then((response) => response.json())
        .then((data) => {
          setCars(data.map((car) => ({ value: car._id, label: car.carname })));
          navigate(`/EMI-Calculator/${selectedOption.value}`);
        })
        .catch((error) => console.error("Error fetching cars:", error));
    } else {
      setCars([]);
      navigate(`/EMI-Calculator`);
    }
  };

  // Handle car selection change
  const handleCarChange = (selectedOption) => {
    setSelectedCar(selectedOption);
    setSelectedVariant(null);
    if (selectedOption) {
      fetch(
        `${process.env.NEXT_PUBLIC_API}/api/variants/active/${selectedOption.value}`
      )
        .then((response) => response.json())
        .then((data) => {
          if (data.success && Array.isArray(data.data)) {
            setVariants(
              data.data.map((variant) => ({
                value: variant._id,
                label: variant.varientName,
              }))
            );
            navigate(
              `/EMI-Calculator/${selectedBrand.value}/${selectedOption.value}`
            );
          }
        })
        .catch((error) => console.error("Error fetching variants:", error));
    } else {
      setVariants([]);
      navigate(`/EMI-Calculator/${selectedBrand.value}`);
    }
  };

  // Handle variant selection change
  const handleVariantChange = (selectedOption) => {
    setSelectedVariant(selectedOption);
    if (selectedOption) {
      navigate(
        `/EMI-Calculator/${selectedBrand.value}/${selectedCar.value}/${selectedOption.value}`
      );
    } else {
      navigate(`/EMI-Calculator/${selectedBrand.value}/${selectedCar.value}`);
    }
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

  // Add this helper function after the formatNumberEmi function
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
      <section className="mt-36" style={{ position: "relative", zIndex: 10 }}>
        {/* <section>
        <div className="label">
          <p className="FIND-YOUR-INFO mt-5 brand">
            <span className="text-wrapper">EMI </span>
            <span className="text-wrapper-2">CALCULATOR</span>
          </p>
        </div>
      </section> */}

        {/* <div className="d-flex inline-section-product theselsec theboxxes">
        <Select
          options={brands}
          value={selectedBrand}
          onChange={handleBrandChange}
          placeholder="Select a Brand"
          isSearchable
        />

        <Select
          options={cars}
          value={selectedCar}
          onChange={handleCarChange}
          placeholder="Select a Car"
          isSearchable
          isDisabled={!selectedBrand}
        />

        <Select
          options={variants}
          value={selectedVariant}
          onChange={handleVariantChange}
          placeholder="Select a Variant"
          isSearchable
          isDisabled={!selectedCar}
        />

        <Select
          options={options}
          value={state ? { label: state, value: state } : null}
          onChange={handleStateChange}
          placeholder="Select a State"
          isSearchable
          isDisabled={options.length === 0}
        />
      </div> */}
        {selectedBrand && selectedCar && selectedVariant && state && (
          <section className="the-product-sec mt-5-desk">
            <section className="inline-section-product mt-4">
              <section className="card-car-full-product">
                <div className="card-car-full-product-info">
                  <div className="ghkfjkhf">
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
                        <span />
                      )}
                      {/* Rating and Location Section */}
                      <div className="d-flex justify-content-between">
                        <div className="mt-[15px] w-[37px] h-[18px] space-x-2 rounded-md shadow-md shadow-black/black  bg-[#B1081A] flex justify-center items-center relative">
                          <span className="text-white text-center text-[10px]">
                            {singlecardData?.data?.product_id?.movrating ||
                              "N/A"}
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
                        <span
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
                                {singlecardData?.data?.product_id?.carname ||
                                  " "}{" "}
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
                            <span />
                          )}
                        </div>
                      </div>
                      <div className="d-flex flex-column align-items-center">
                        <div className="rating-inno d-flex flex-row">
                          <span>
                            {singlecardData?.data?.product_id?.movrating ||
                              "N/A"}
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
                      </div>

                      {/* Mobile View Actions */}
                      <section className="onlyphoneme align-items-center justify-content-between mt-2">
                        <ChangeCar />
                        <ChangeVarient />
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

            <div className="p-2">
              <section className="bg-white p-4 shadow-md border shadow-black/30 md:flex justify-center items-center flex-col ">
                <div className="label">
                  <p className="text-[15px] font-sans font-bold">
                    <span className="text-wrapper">
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

                <p
                  className="mt-4 md:flex justify-center items-center  md:text-center"
                  style={{
                    fontSize: "12px",
                    fontWeight: "500",
                    fontFamily: "Montserrat",
                  }}
                >
                  EMI starts athhg{" "}
                  {emiData ? formatNumberEmi(emiData.emiPerMonth) : "0"} per
                  month for a tenure of {tenure * 12} months at an interest rate
                  of {rate}%. This is based on a loan amount of{"   "}
                  {formatNumber((OnRoadPrice || 0) - (downPayment || 0))}{" "}
                  (On-Road Cost – Downpayment). MotorOctane provides a detailed
                  breakdown of the total payable amount and helps you find the
                  best car deals and financing options available in {state}.
                </p>
              </section>
            </div>
            <Adbanner2 />
            <div className="p-2">
              <div className="border shadow-md shadow-black/30 p-4 bg-white ">
                <div className="label">
                  <p className="text-[15px] font-sans font-bold">
                    <span className="text-wrapper">
                      Calculate Your Loan EMI{" "}
                    </span>
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
                            <div className="font-bold text-[13px]  text-[#B1081A]">
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
                          min={
                            OnRoadPrice ? Math.round(OnRoadPrice * 0.2) : 100000
                          }
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
                    <div className="flex justify-center items-center p-2">
                      <main className="bg-[#F4F9FF] space-y-1 font-sans w-[326px] h-[73px] p-4">
                        <div className="d-flex justify-content-between">
                          <span className="text-[#818181]">
                            • Total loan amount
                          </span>
                          <span className="mainoprice">
                            {formatNumberEmi(getLoanAmount())}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-[#818181]">
                            • Payable amount
                          </span>
                          <span className="mainoprice">
                            {getLoanAmount() === 0
                              ? "₹0"
                              : emiData?.data?.length > 0
                              ? formatNumberEmi(
                                  getLoanAmount() +
                                    calculateTotalInterest(emiData)
                                )
                              : "₹0"}
                          </span>
                        </div>
                        <div className="d-flex justify-content-between">
                          <span className="text-[#818181]">
                            • You'll pay extra
                          </span>
                          <span className="mainoprice">
                            {getLoanAmount() === 0
                              ? "₹0"
                              : emiData?.data?.length > 0
                              ? formatNumberEmi(calculateTotalInterest(emiData))
                              : "₹0"}
                          </span>
                        </div>
                      </main>
                    </div>
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
                        <span className="perrmon">
                          CALCULATED ON ON ROAD PRICE
                        </span>
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
                              <tr
                                key={index}
                                style={{ backgroundColor: "white" }}
                              >
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
                  MotorOctane can help you get the best deal on your loans. Call
                  us on
                  <span className="text-red-800"> 8779952811</span>
                </div>
              </div>
            </div>
          </section>
        )}
      </section>
    </div>
  );
};

export default EmiCalculator;
