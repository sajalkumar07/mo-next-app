import Header from "../Homepage/Structure/header.js";
import Allbrnads from "../Allbrandcars/Structure/Allbrands.js";
import Doyouknow from "../Allbrandcars/Structure/Doyouknow.js";
import Searchbar from "../Homepage/Structure/Search";
import Motoheads from "../Allbrandcars/Structure/Motoheads.js";
import Footer from "../Homepage/Structure/footer.js";
import Adbanner2 from "../Homepage/Structure/Adbanner2";
import FeatureCar from "../Homepage/Structure/featuredcars";
import Adbanner3 from "../Homepage/Structure/Adbanner3";
import Reviews from "../Allbrandcars/Structure/reviews.js";
import Adbanner4 from "../Homepage/Structure/Adbanner4";
import LatestVideo from "../Homepage/Structure/youtubevideos";
import CarComparison from "../Homepage/Structure/carcomparision";
import News from "../Homepage/Structure/newsupdate";

import React, { useEffect, useState } from "react";
import "./Productpage.css"; // Import your CSS file

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useParams } from "react-router-dom";

const Productpage = () => {
  const { id } = useParams(); // Get 'id' from URL params
  const [data, setData] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/getbrand/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result.data); // Assuming API response contains 'data'
      } catch (err) {}
    };

    fetchData();
  }, [id]);

  const queryClient = new QueryClient();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Motoheads brandData={data} />
        <div className="back_image">
          <div className="brandimagrrrr">
            <Searchbar />
          </div>
          <Allbrnads />
          <Adbanner2 />
          <Doyouknow />
          <FeatureCar />
        </div>
        <Adbanner3 />
        <Reviews />
        <LatestVideo />

        <Adbanner4 />
        <CarComparison />
        <News />
      </QueryClientProvider>
    </>
  );
};

export default Productpage;
