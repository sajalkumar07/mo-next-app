import React, { useEffect } from "react";
import Header from "../Homepage/Structure/header";
import FeatureCar from "../Homepage/Structure/featuredcars";
import LatestVideo from "../Homepage/Structure/youtubevideos";
import News from "../Homepage/Structure/newsupdate";
import Footer from "../Homepage/Structure/footer";
import Emical from "../Emicalculator/Structure/Emicalculator";
import CarComparison from "../Productpage/Structure/CarComparisionProd";
import Frequentlyasked from "../Pricebreakup/Structure/Frequentlyasked.js";
import Adbanner2 from "../Homepage/Structure/Adbanner2";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const PriceBreakup = () => {
  const queryClient = new QueryClient();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <Emical />
        {/* <Adbanner2 /> */}
        <Frequentlyasked />
        <CarComparison className="mt-5" />
        <FeatureCar />
        <LatestVideo />
        <Adbanner2 />
        <News />
      </QueryClientProvider>
    </>
  );
};
export default PriceBreakup;
