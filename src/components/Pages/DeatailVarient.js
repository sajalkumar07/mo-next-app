import React from "react";
import Variants from "../DeatailVarient/variants";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import Header from "../Homepage/Structure/header";

const DeatailVarient = () => {
  const queryClient = new QueryClient();

  return (
    <QueryClientProvider client={queryClient}>
      <div className="back_image"></div>
      <Variants />
    </QueryClientProvider>
  );
};

export default DeatailVarient;
