import React, { useEffect } from "react";
import Header from "../Homepage/Structure/header";
import FeatureCar from "../Homepage/Structure/featuredcars";
import LatestVideo from "../Homepage/Structure/youtubevideos";
import News from "../Homepage/Structure/newsupdate";
import Footer from "../Homepage/Structure/footer";
import Emical from "../Emicalculator/Structure/Emicalculator";
import CarComparison from "../Homepage/Structure/carcomparision";
import Frequentlyasked from "../Pricebreakup/Structure/Frequentlyasked.js";
import Servicecenters from "../Servicecenters/Structure/Servicecenters.js";

import Adbanner3 from "../Homepage/Structure/Adbanner3";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const ServiceCenters = () => {
  const queryClient = new QueryClient();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="back_image"></div>
        <Servicecenters />
        <Adbanner3 />
        <CarComparison className="mt-5" />
        <Frequentlyasked />
        <FeatureCar />
        <LatestVideo />
        <News />
      </QueryClientProvider>
    </>
  );
};
export default ServiceCenters;
