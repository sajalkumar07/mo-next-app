import React, { useEffect } from "react";
import Header from "../Homepage/Structure/header";
import FeatureCar from "../Homepage/Structure/featuredcars";
import LatestVideo from "../Homepage/Structure/youtubevideos";
import Footer from "../Homepage/Structure/footer";
import ScrapNews from "../News/Structure/ScrapNews";
import CarComparison from "../Homepage/Structure/carcomparision";
import Frequentlyasked from "../Pricebreakup/Structure/Frequentlyasked.js";
import Adbanner3 from "../Homepage/Structure/Adbanner3";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const News = () => {
  const queryClient = new QueryClient();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="back_image"></div>
        <ScrapNews />
      </QueryClientProvider>
    </>
  );
};
export default News;
