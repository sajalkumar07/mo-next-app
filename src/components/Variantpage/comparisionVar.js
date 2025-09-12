import React, { useState, useEffect, forwardRef } from "react";
import { Link, useParams } from "react-router-dom";

const CarComparisonSection = () => {
  const { id } = useParams();
  const CarComparisonWidth = 290;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [comparisonData, setComparisonData] = useState([]);
  const [rtoData, setRtoData] = useState([]);
  const [locationState, setLocationState] = useState("");
  const [alternatives, setAlternatives] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [mainCarData, setMainCarData] = useState(null);
  const [carDetailsCache, setCarDetailsCache] = useState({});

  const handleNext = () => {
    setCurrentIndex((currentIndex + 1) % alternatives.length);
  };

  const handlePrevious = () => {
    setCurrentIndex(
      (currentIndex - 1 + alternatives.length) % alternatives.length
    );
  };

  const containerStyle = {
    transform: `translateX(-${currentIndex * CarComparisonWidth}px)`,
    transition: "transform 0.3s ease",
  };

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

  // Helper functions
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
      return `${croreValue} Cr`;
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

  const getImageSource = (car, isMainCar = false) => {
    const baseUrl = `${process.env.NEXT_PUBLIC_API}/productImages/`;

    if (isMainCar) {
      const imageName = car.blackimage || car.heroimage;
      return imageName ? `${baseUrl}${imageName}` : null;
    } else {
      const imageName = car.heroimage;
      return imageName ? `${baseUrl}${imageName}` : null;
    }
  };

  const fetchCarDetails = async (carId) => {
    if (carDetailsCache[carId]) {
      return carDetailsCache[carId];
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/cars/${carId}`
      );
      const carData = await response.json();

      setCarDetailsCache((prev) => ({
        ...prev,
        [carId]: carData,
      }));

      return carData;
    } catch (error) {
      console.error(`Error fetching details for car ${carId}:`, error);
      return null;
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      if (!id) return;

      setIsLoading(true);
      setError(null);

      try {
        // Fetch variant data
        const variantResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${id}`
        );
        const variantData = await variantResponse.json();

        if (!variantData.data) {
          throw new Error("Variant data not found");
        }

        const mainCar = variantData.data;
        const carId = mainCar.product_id?._id;
        if (!carId) {
          throw new Error("Main car ID not found");
        }

        // Create complete car object with all needed data
        const completeCarData = {
          ...mainCar.product_id,
          brand: {
            id: mainCar.brand_id?._id,
            name: mainCar.brand_id?.name || "Unknown Brand",
          },
          exShowroomPrice: mainCar.exShowroomPrice,
          highExShowroomPrice: mainCar.exShowroomPrice,
          variantName: mainCar.varientName,
          variantId: mainCar._id,
          fuelType: getFirstFuelType(mainCar.fuel || "PETROL"),
        };

        setMainCarData(completeCarData);

        // Fetch alternatives
        const alternativesResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/alternate-cars-for-web`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ carId }),
          }
        );
        const alternativesData = await alternativesResponse.json();

        // Set alternatives
        setAlternatives(alternativesData.data || []);

        // Create comparison data
        if (alternativesData.data?.length > 0) {
          const comparisons = await Promise.all(
            alternativesData.data.map(async (altCar) => {
              const altDetails = await fetchCarDetails(altCar._id);

              return {
                car1: {
                  ...completeCarData,
                  id: completeCarData._id,
                  carname: completeCarData.carname,
                  isMainCar: true,
                },
                car2: {
                  ...altCar,
                  id: altCar._id,
                  carname: altCar.carname,
                  brand: altCar.brand_id
                    ? {
                        id: altCar.brand_id._id,
                        name: altCar.brand_id.name,
                      }
                    : altCar.brand,
                  exShowroomPrice:
                    altCar.exShowroomPrice || altCar.lowestExShowroomPrice,
                  highExShowroomPrice:
                    altDetails?.highestExShowroomPrice ||
                    altCar.highestExShowroomPrice ||
                    altCar.exShowroomPrice ||
                    altCar.lowestExShowroomPrice,
                  fuelType: getFirstFuelType(
                    altCar.fuelType || altCar.fuel || "PETROL"
                  ),
                  isMainCar: false,
                },
              };
            })
          );
          setComparisonData(comparisons);
        }
      } catch (err) {
        console.error("Error fetching comparison data:", err);
        setError(err.message);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
    fetchRTOData();
  }, [id]);

  if (isLoading) {
    return <div className="text-center py-5">Loading comparisons...</div>;
  }

  if (error) {
    return <div className="text-center py-5 text-red-500">Error: {error}</div>;
  }

  if (!comparisonData.length) {
    return (
      <div className="text-center py-5">
        No alternatives found for comparison
      </div>
    );
  }

  return (
    <div className="car-comparison-container">
      <section className="d-flex align-items-center justify-content-center">
        <button
          className="bg-[#818181] p-2 m-4 md:m-0 rounded-full text-white hidden md:flex justify-center items-center"
          onClick={handlePrevious}
          disabled={alternatives.length <= 1}
        >
          <ion-icon name="chevron-back-outline"></ion-icon>
        </button>

        <div className="d-flex align-items-center copm-cards overflow-x-scroll overflow-y-hidden scrollbar-hide md:overflow-x-hidden p-8">
          <div className="car-com-section" style={containerStyle}>
            {comparisonData.map((comparison, index) => (
              <Link
                key={index}
                className="d-flex comparo-card"
                to={`/Car-Compero/${comparison.car1?.id}/${
                  comparison.car2?.id || ""
                }`}
              >
                {/* Main Car */}
                <div className="comparison-item">
                  {comparison.car1 ? (
                    <>
                      <img
                        src={getImageSource(comparison.car1, true)}
                        alt={comparison.car1.carname}
                        className="car-comp-img"
                        crossOrigin="anonymous"
                        onError={(e) => {
                          if (
                            comparison.car1.heroimage &&
                            !e.target.src.includes(comparison.car1.heroimage)
                          ) {
                            e.target.src = `${process.env.NEXT_PUBLIC_API}/productImages/${comparison.car1.heroimage}`;
                          }
                        }}
                      />
                      <div className="comp-description">
                        <div className="comp-description-brand">
                          {comparison.car1.brand?.name || "N/A"}
                        </div>
                        <div className="comp-description-model">
                          {comparison.car1.carname || "N/A"}
                        </div>
                        <p className="comp-description-price">
                          ₹
                          {formatCurrency(
                            calculateOnRoadPrice(
                              comparison.car1.exShowroomPrice,
                              comparison.car1.fuelType
                            )
                          )}{" "}
                          - ₹
                          {formatCurrency(
                            calculateOnRoadPrice(
                              comparison.car1.highExShowroomPrice,
                              comparison.car1.fuelType
                            )
                          )}{" "}
                          Lakhs
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="comp-description">
                      <p>Car data not available</p>
                    </div>
                  )}
                </div>

                <div className="vs-container">
                  <span className="vs-item">VS</span>
                </div>

                {/* Alternative Car */}
                <div className="comparison-item">
                  {comparison.car2 ? (
                    <>
                      <img
                        src={getImageSource(comparison.car2, false)}
                        alt={comparison.car2.carname}
                        className="car-comp-img"
                        crossOrigin="anonymous"
                      />
                      <div className="comp-description">
                        <div className="comp-description-brand">
                          {comparison.car2.brand?.name || "N/A"}
                        </div>
                        <div className="comp-description-model">
                          {comparison.car2.carname || "N/A"}
                        </div>
                        <p className="comp-description-price">
                          ₹
                          {formatCurrency(
                            calculateOnRoadPrice(
                              comparison.car2.exShowroomPrice,
                              comparison.car2.fuelType
                            )
                          )}{" "}
                          - ₹
                          {formatCurrency(
                            calculateOnRoadPrice(
                              comparison.car2.highExShowroomPrice,
                              comparison.car2.fuelType
                            )
                          )}{" "}
                          Lakhs
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="comp-description">
                      <p>Alternative car not available</p>
                    </div>
                  )}
                </div>
              </Link>
            ))}
          </div>
        </div>

        <button
          className="bg-[#818181] p-2 m-4 md:m-0 rounded-full text-white hidden md:flex justify-center items-center"
          onClick={handleNext}
          disabled={alternatives.length <= 1}
        >
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
      </section>
    </div>
  );
};

const CarComparisonVar = forwardRef(({ currentCarData }, ref) => {
  return (
    <section className="mb-5" ref={ref} id="compCar">
      <div className="label">
        <p className="FIND-YOUR-PERFECT brand mt-3 lefttext-mob">
          <span className="text-wrapper text-uppercase">ALTERNATE</span>
          <span className="span">&nbsp;</span>
          <span className="text-wrapper-2 text-uppercase">COMPARISON</span>
        </p>
      </div>

      <CarComparisonSection />
    </section>
  );
});

export default CarComparisonVar;
