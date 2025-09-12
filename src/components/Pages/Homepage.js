import React, { useEffect } from "react";
import Header from "../Homepage/Structure/header";
import Adbanner1 from "../Homepage/Structure/Adbanner1";
import Searchbar from "../Homepage/Structure/Search";
import Cards from "../Homepage/Structure/subcomponents/cards";
import Adbanner2 from "../Homepage/Structure/Adbanner2";
import Fuelprice from "../Homepage/Structure/fuelprice";
import FeatureCar from "../Homepage/Structure/featuredcars";
import Adbanner3 from "../Homepage/Structure/Adbanner3";
import Adbanner4 from "../Homepage/Structure/Adbanner4";
import Brands from "../Homepage/Structure/brands";
import LatestVideo from "../Homepage/Structure/videosectionfull";
import MoStories from "../Homepage/Structure/mostories";
import CarComparison from "../Homepage/Structure/carcomparision";
import News from "../Homepage/Structure/newsupdate";
import Footer from "../Homepage/Structure/footer";
import TopPicksForYou from "../Homepage/Structure/toppicsforyou";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Homepage = () => {
  const queryClient = new QueryClient();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        {/* <Header /> */}
        <Adbanner1 />

        <Searchbar />
        <Cards />
        <Adbanner2 />
        <Fuelprice />

        <FeatureCar />
        {/* <Adbanner3 /> */}
        <Brands />
        <LatestVideo />
        <CarComparison />
        <Adbanner2 />
        {/* <TopVideos /> */}
        <TopPicksForYou />
        <MoStories />
        <News />

        {/* <Footer /> */}
      </QueryClientProvider>
    </>
  );
};
export default Homepage;
