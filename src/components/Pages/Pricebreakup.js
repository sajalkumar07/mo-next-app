import React, { useEffect } from "react";
import Header from "../Homepage/Structure/header";
import FeatureCar from "../Homepage/Structure/featuredcars";
import LatestVideo from "../Homepage/Structure/youtubevideos";
import News from "../Homepage/Structure/newsupdate";
import Footer from "../Homepage/Structure/footer";
import Pricebreakup from "../Pricebreakup/Structure/Pricebreakup";
import CarComparison from "../Variantpage/comparisionVar";
import Frequentlyasked from "../Pricebreakup/Structure/Frequentlyasked";
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
        {/* <div className="back_image"></div> */}
        <Pricebreakup />
        <Adbanner2 />
        <CarComparison className="" />
        {/* <Frequentlyasked /> */}

        <FeatureCar />
        <LatestVideo />
        <Adbanner2 />
        <News />
      </QueryClientProvider>
    </>
  );
};
export default PriceBreakup;
