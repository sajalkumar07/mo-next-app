import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";

import Productsection from "../Productpage/Structure/productsection";
import Adbanner2 from "../Productpage/Structure/Adbanner2";
import Youtubevideo from "../Productpage/Structure/youtubevideo";
import CarPros from "../Productpage/Structure/pros_cons";
import Variants from "../Productpage/Structure/variantstable";
import ColorsVariants from "../Productpage/Structure/colorvariants";
import Mileage from "../Productpage/Structure/mileage";
import FuelCost from "../Productpage/Structure/fuelcost";
import Reviews from "../Productpage/Structure/reviews";
import Adbanner3 from "../Productpage/Structure/Adbanner3";
import Newsupdate from "../Homepage/Structure/newsupdate";
import Factfile from "../Homepage/Structure/Factfile.js";
import CarComparison from "../Productpage/Structure/CarComparisionProd.js";
import FeaturedCar from "../Homepage/Structure/featuredcars";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Productpage = () => {
  const queryClient = new QueryClient();
  const youtubeVideoRef = useRef(null);
  const summaryRef = useRef(null);
  const keyFeaturesRef = useRef(null);
  const compareRef = useRef(null);
  const prosConsRef = useRef(null);
  const variantsRef = useRef(null);
  const featuredCarRef = useRef(null);
  const colorRef = useRef(null);
  const mileageRef = useRef(null);
  const fuleCostRef = useRef(null);
  const newsRef = useRef(null);
  const reviewRef = useRef(null);
  const brochureRef = useRef(null);

  const [productData, setProductData] = useState(null);
  const { id } = useParams();

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${id}`
        );
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <Productsection />
      <Youtubevideo />
      <Adbanner2 />
      {productData && (
        <CarPros
          brandName={productData.brand?.name}
          carName={productData.carname}
        />
      )}
      {productData && (
        <Factfile
          keyFeaturesRef={keyFeaturesRef}
          brandName={productData.brand?.name}
          carName={productData.carname}
        />
      )}
      <Variants ref={variantsRef} />
      {productData && (
        <ColorsVariants
          brandName={productData.brand?.name}
          carName={productData.carname}
        />
      )}
      <Adbanner2 />
      {productData && (
        <Mileage
          brandName={productData.brand?.name}
          carName={productData.carname}
        />
      )}
      {productData && (
        <FuelCost
          brandName={productData.brand?.name}
          carName={productData.carname}
        />
      )}
      {productData && (
        <Reviews
          brandName={productData.brand?.name}
          carName={productData.carname}
        />
      )}
      {/* <History /> */}
      <Adbanner3 />
      <Newsupdate />
      <CarComparison />
      <FeaturedCar />
      {/* <Consult /> */}
    </QueryClientProvider>
  );
};

export default Productpage;
