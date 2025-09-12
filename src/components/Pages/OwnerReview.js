import React from "react";
import Header from "../Homepage/Structure/header";
import Footer from "../Homepage/Structure/footer";
import OwnerRiview from "../OwnerReview/ownerReview";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

const Productpage = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="back_image"></div>
      <OwnerRiview />
    </QueryClientProvider>
  );
};

export default Productpage;
