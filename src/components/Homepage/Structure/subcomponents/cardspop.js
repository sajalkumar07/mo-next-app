import React, { useState, useEffect, useRef } from "react";
import { useLocation, useParams } from "react-router-dom";
import "./card.css";
import Cardsection from "../../../Cardsection";

const Popcars = () => {
  const [newcardData, setCardData] = useState([]);
  const [rtoData, setRtoData] = useState([]);
  const [carId, setCarId] = useState(null);
  const location = useLocation();
  const { id } = useParams();

  const isProductOrVariantRoute = () => {
    const pathname = location.pathname;
    return (
      pathname.includes("/product") ||
      pathname.includes("/variant") ||
      pathname.includes("/pricebreakup") ||
      pathname.includes("/EMI-Calculator")
    );
  };

  const getCarId = async () => {
    const pathname = location.pathname;

    if (
      pathname.includes("/variant") ||
      pathname.includes("/pricebreakup") ||
      pathname.includes("/EMI-Calculator")
    ) {
      try {
        const variantResponse = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${id}`
        );
        const variantData = await variantResponse.json();

        if (variantData.data?.product_id?._id) {
          setCarId(variantData.data.product_id._id);
        } else {
          console.error("Product ID not found in variant data");
        }
      } catch (error) {
        console.error("Error fetching variant data:", error);
      }
    } else if (pathname.includes("/product")) {
      setCarId(id);
    }
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

  useEffect(() => {
    fetchRTOData();
  }, []);

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
          (rto.fuelType || "").toUpperCase() === fuel
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

  const calculateOnRoadPrice = (product, fuelType) => {
    let productPrice;
    if (typeof product === "object") {
      productPrice =
        product.exShowroomPrice || product.lowestExShowroomPrice || 0;
    } else {
      productPrice = product;
    }

    const priceStr = productPrice.toString();
    if (!/[0-9]/.test(priceStr)) return 0;
    if (!Array.isArray(rtoData) || rtoData.length === 0)
      return parseFloat(productPrice) || 0;

    const roadPriceData = getDataFromRoadPriceListBasedOnFuelAndPriceRange(
      rtoData,
      priceStr,
      fuelType
    );

    const price = parseInt(priceStr) || 0;

    const rto = calculateRtoPrice(
      priceStr,
      roadPriceData.rtoPercentage || "0",
      roadPriceData.amount || "0",
      fuelType
    );

    const roadSafetyTax = calculateRoadSafetyTax(rto);
    const insurance = calculateInsurancePrice(
      priceStr,
      roadPriceData.insurancePercentage || "0"
    );
    const luxuryTax = price > 999999 ? Math.ceil(price / 100) : 0;
    const hypethecationCharges = parseInt(
      roadPriceData.hypethecationCharges || "0"
    );
    const fastag = parseInt(roadPriceData.fastag || "0");
    const others = parseInt(roadPriceData.others || "0");

    return (
      price +
      rto +
      roadSafetyTax +
      insurance +
      luxuryTax +
      hypethecationCharges +
      fastag +
      others
    );
  };

  const fetchAlternateData = async () => {
    if (!carId) {
      console.error("No car ID available for alternate cars");
      return;
    }

    try {
      const alternativesResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/alternate-cars-for-web`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ carId: carId }),
        }
      );
      const alternativesData = await alternativesResponse.json();

      if (alternativesData.success && alternativesData.data) {
        const enrichedCars = await Promise.all(
          alternativesData.data.map(async (car) => {
            // Fetch complete car data to ensure consistency
            const carResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API}/api/cars/${car._id}`
            );
            const carData = await carResponse.json();

            const {
              lowestExShowroomPrice,
              highestExShowroomPrice,
              fueltype,
              carname,
              brand,
              heroimage,
              seater,
              transmissiontype,
              NCAP,
              variants,
              userRatingfromOwners,
            } = carData;

            const firstFuelType = getFirstFuelType(fueltype);
            const onRoadPrice = calculateOnRoadPrice(
              lowestExShowroomPrice,
              firstFuelType
            );

            // Extract rating from brand object, fallback to userRatingfromOwners or default
            const rating = brand?.rating || userRatingfromOwners || "0";

            return {
              ...car,
              ...carData, // Include all car data for consistency
              popularity: car.popularity || 0,
              lowestExShowroomPrice,
              highestExShowroomPrice,
              onRoadPrice,
              carname,
              brand: brand?.name || brand || "",
              heroimage,
              rating, // Use the extracted rating
              seater,
              fueltype,
              transmissiontype,
              NCAP,
              variants,
              userRatingfromOwners,
            };
          })
        );

        setCardData(enrichedCars);
      } else {
        console.error("Failed to fetch alternate cars or no data available");
        setCardData([]);
      }
    } catch (error) {
      console.error("Error fetching alternate cars data:", error);
      setCardData([]);
    }
  };

  const fetchPopularData = async () => {
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/extra/get-all-cars-for-popularity`
      );
      const data = await response.json();
      if (data.success) {
        const sortedCars = data.data
          .filter(
            (car) =>
              car.popularity && car.popularity >= 1 && car.popularity <= 10
          )
          .sort((a, b) => a.popularity - b.popularity);

        const enrichedCars = await Promise.all(
          sortedCars.map(async (car) => {
            const carResponse = await fetch(
              `${process.env.NEXT_PUBLIC_API}/api/cars/${car._id}`
            );
            const carData = await carResponse.json();

            const {
              lowestExShowroomPrice,
              highestExShowroomPrice,
              fueltype,
              carname,
              brand,
              heroimage,
              seater,
              transmissiontype,
              NCAP,
              variants,
              userRatingfromOwners,
            } = carData;

            const onRoadPrice = calculateOnRoadPrice(
              lowestExShowroomPrice,
              getFirstFuelType(fueltype)
            );

            // Extract rating from brand object, fallback to userRatingfromOwners or default
            const rating = brand?.rating || userRatingfromOwners || "0";

            return {
              ...car,
              ...carData,
              lowestExShowroomPrice,
              highestExShowroomPrice,
              onRoadPrice,
              carname,
              brand: brand?.name || "",
              heroimage,
              rating, // Use the extracted rating
              seater,
              fueltype,
              transmissiontype,
              NCAP,
              variants,
              userRatingfromOwners,
            };
          })
        );

        setCardData(enrichedCars);
      } else {
        console.error("Failed to fetch popular cars");
      }
    } catch (error) {
      console.error("Error fetching popular cars data:", error);
    }
  };

  const fetchData = async () => {
    if (isProductOrVariantRoute()) {
      await fetchAlternateData();
    } else {
      await fetchPopularData();
    }
  };

  useEffect(() => {
    if (isProductOrVariantRoute() && id) {
      getCarId();
    }
  }, [location.pathname, id]);

  useEffect(() => {
    if (rtoData.length > 0) {
      if (isProductOrVariantRoute()) {
        if (carId) {
          fetchData();
        }
      } else {
        fetchData();
      }
    }
  }, [rtoData, carId, location.pathname]);

  const handleCardClick = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth", // Optional: adds smooth scrolling animation
    });
  };

  return (
    <>
      <Cardsection
        newcardData={newcardData}
        rtoData={rtoData}
        onCardClick={handleCardClick}
      />
    </>
  );
};

export default Popcars;
