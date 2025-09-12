import React, { useEffect } from "react";
import Header from "../Homepage/Structure/header";
import Footer from "../Homepage/Structure/footer";
import AboutUs from "../Homepage/Structure/About.js";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Aboutus = () => {
  const queryClient = new QueryClient();
  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <QueryClientProvider client={queryClient}>
        <div className="back_image"></div>
        <AboutUs />
      </QueryClientProvider>
    </>
  );
};
export default Aboutus;
