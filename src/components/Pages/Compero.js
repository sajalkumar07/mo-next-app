import React, { useEffect } from "react";
import Header from "../Homepage/Structure/header";
import FeatureCar from "../Homepage/Structure/featuredcars";
import LatestVideo from "../Homepage/Structure/youtubevideos";
import News from "../Homepage/Structure/newsupdate";
import Footer from "../Homepage/Structure/footer";
import Sompero from "../Compero/Structure/Compero.js";
import Mahaompero from "../Compero/Structure/Mahaompero.js";
import CarComparison from "../Homepage/Structure/carcomparision";
import Frequentlyasked from "../Pricebreakup/Structure/Frequentlyasked.js";
import Adbanner3 from "../Homepage/Structure/Adbanner3";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Compero = () => {
  const queryClient = new QueryClient();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="back_image"></div>
        <Mahaompero />
        <Sompero />
        <Adbanner3 />
        <CarComparison className="mt-5" />
        <FeatureCar />
        <LatestVideo />
        <News />
      </QueryClientProvider>
    </>
  );
};
export default Compero;
