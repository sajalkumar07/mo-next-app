import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";

import "./card.css";
import Cardsection from "../../../Cardsection";

const Popcars = () => {
  const [newcardData, setCardData] = useState([]);
  const [rtoData, setRtoData] = useState([]);

  // Fetch RTO data
  const fetchRTOData = async () => {
    const locationState = localStorage.getItem("location");
    if (!locationState) return;

    try {
      const parsedLocationState = JSON.parse(locationState);
      if (!parsedLocationState || !parsedLocationState.state) {
        return;
      }

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
        console.log("RTO data loaded:", result.data);
      }
    } catch (error) {
      console.error("Error fetching RTO data:", error);
      setRtoData([]);
    }
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

  useEffect(() => {
    fetchRTOData();
  }, []);

  // Helper Functions (same as Cards component)

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

  // Extract first fuel type from various formats
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

  // Main on-road price calculation using mobile app logic (same as Cards component)
  const calculateOnRoadPrice = (product, fuelType) => {
    // Extract price (handles both variant and direct car data)
    let productPrice;
    if (typeof product === "object") {
      productPrice =
        product.exShowroomPrice || // Variant price first
        product.lowestExShowroomPrice || // Fallback to car price
        0;
    } else {
      productPrice = product; // Direct number input
    }

    const priceStr = productPrice.toString();

    // Early exit for invalid prices
    if (!/[0-9]/.test(priceStr)) return 0;
    if (!Array.isArray(rtoData) || rtoData.length === 0)
      return parseFloat(productPrice) || 0;

    // Normalize fuel type (treat hybrid as petrol)
    const normalizedFuelType = normalizeFuelType(fuelType);

    // Get applicable RTO rates
    const roadPriceData = getDataFromRoadPriceListBasedOnFuelAndPriceRange(
      rtoData,
      priceStr,
      normalizedFuelType
    );

    const price = parseInt(priceStr) || 0;

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
    return (
      price + // Base price
      rto + // RTO tax
      roadSafetyTax + // Safety tax
      insurance + // Insurance
      luxuryTax + // Luxury tax
      hypethecationCharges +
      fastag +
      others
    );
  };

  // Fetch car data (updated to match Cards component logic)
  const fetchData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/cars/newest`
      );
      const data = await response.json();

      // Check if data has the expected structure
      if (data && Array.isArray(data)) {
        // Fetch variant prices for each car (same as Cards component)
        const enrichedCars = await Promise.all(
          data.map(async (car) => {
            try {
              const variantResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/api/variants/active/${car._id}`
              );
              const variantData = await variantResponse.json();

              if (variantData.data?.length > 0) {
                // Use the variant's ex-showroom price if available
                const lowestVariantPrice = Math.min(
                  ...variantData.data.map((v) => v.exShowroomPrice)
                );
                const highestVariantPrice = Math.max(
                  ...variantData.data.map((v) => v.exShowroomPrice)
                );

                const firstFuelType = getFirstFuelType(car.fueltype);
                const onRoadPrice = calculateOnRoadPrice(
                  lowestVariantPrice,
                  firstFuelType
                );

                // Extract rating from brand object, fallback to userRatingfromOwners or default
                const rating =
                  car.brand?.rating || car.userRatingfromOwners || "0";

                return {
                  ...car,
                  lowestExShowroomPrice: lowestVariantPrice,
                  highestExShowroomPrice: highestVariantPrice,
                  onRoadPrice,
                  brand: car.brand?.name || "", // Handle missing brand name
                  rating, // Use the extracted rating
                };
              } else {
                // Fallback to car's default price if no variants
                const firstFuelType = getFirstFuelType(car.fueltype);
                const onRoadPrice = calculateOnRoadPrice(
                  car.lowestExShowroomPrice,
                  firstFuelType
                );

                // Extract rating from brand object, fallback to userRatingfromOwners or default
                const rating =
                  car.brand?.rating || car.userRatingfromOwners || "0";

                return {
                  ...car,
                  onRoadPrice,
                  brand: car.brand?.name || "", // Handle missing brand name
                  rating, // Use the extracted rating
                };
              }
            } catch (error) {
              console.error(`Failed to fetch variants for ${car._id}:`, error);
              // Fallback calculation with original car data
              const firstFuelType = getFirstFuelType(car.fueltype);
              const onRoadPrice = calculateOnRoadPrice(
                car.lowestExShowroomPrice,
                firstFuelType
              );

              // Extract rating from brand object, fallback to userRatingfromOwners or default
              const rating =
                car.brand?.rating || car.userRatingfromOwners || "0";

              return {
                ...car,
                onRoadPrice,
                brand: car.brand?.name || "",
                rating, // Use the extracted rating
              };
            }
          })
        );

        setCardData(enrichedCars);
        console.log("Processed Cars Data:", enrichedCars);
      } else if (data && data.data) {
        // Handle the case where data is an object containing a `data` array
        const enrichedCars = await Promise.all(
          data.data.map(async (car) => {
            try {
              const variantResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/api/variants/active/${car._id}`
              );
              const variantData = await variantResponse.json();

              if (variantData.data?.length > 0) {
                // Use the variant's ex-showroom price if available
                const lowestVariantPrice = Math.min(
                  ...variantData.data.map((v) => v.exShowroomPrice)
                );
                const highestVariantPrice = Math.max(
                  ...variantData.data.map((v) => v.exShowroomPrice)
                );

                const firstFuelType = getFirstFuelType(car.fueltype);
                const onRoadPrice = calculateOnRoadPrice(
                  lowestVariantPrice,
                  firstFuelType
                );

                // Extract rating from brand object, fallback to userRatingfromOwners or default
                const rating =
                  car.brand?.rating || car.userRatingfromOwners || "0";

                return {
                  ...car,
                  lowestExShowroomPrice: lowestVariantPrice,
                  highestExShowroomPrice: highestVariantPrice,
                  onRoadPrice,
                  brand: car.brand?.name || "", // Handle missing brand name
                  rating, // Use the extracted rating
                };
              } else {
                // Fallback to car's default price if no variants
                const firstFuelType = getFirstFuelType(car.fueltype);
                const onRoadPrice = calculateOnRoadPrice(
                  car.lowestExShowroomPrice,
                  firstFuelType
                );

                // Extract rating from brand object, fallback to userRatingfromOwners or default
                const rating =
                  car.brand?.rating || car.userRatingfromOwners || "0";

                return {
                  ...car,
                  onRoadPrice,
                  brand: car.brand?.name || "", // Handle missing brand name
                  rating, // Use the extracted rating
                };
              }
            } catch (error) {
              console.error(`Failed to fetch variants for ${car._id}:`, error);
              // Fallback calculation with original car data
              const firstFuelType = getFirstFuelType(car.fueltype);
              const onRoadPrice = calculateOnRoadPrice(
                car.lowestExShowroomPrice,
                firstFuelType
              );

              // Extract rating from brand object, fallback to userRatingfromOwners or default
              const rating =
                car.brand?.rating || car.userRatingfromOwners || "0";

              return {
                ...car,
                onRoadPrice,
                brand: car.brand?.name || "",
                rating, // Use the extracted rating
              };
            }
          })
        );

        setCardData(enrichedCars);
        console.log("Processed Cars Data:", enrichedCars);
      } else {
        console.error("Unexpected API response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  useEffect(() => {
    if (rtoData.length > 0) {
      fetchData();
    }
  }, [rtoData]); // Re-run fetchData when RTO data is updated

  return (
    <>
      <Cardsection newcardData={newcardData} rtoData={rtoData} />
    </>
  );
};

export default Popcars;
