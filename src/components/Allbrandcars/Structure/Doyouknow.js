import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

const Doyouknow = () => {
  const { id } = useParams();
  const [carData, setCarData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Fetch car data using the brand ID
    fetch(`${process.env.NEXT_PUBLIC_API}/api/cars/brand/${id}`)
      .then((response) => response.json())
      .then((data) => {
        setCarData(data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching car data:", error);
        setCarData(null);
        setIsLoading(false);
      });
  }, [id]);

  // Handle loading state and no data
  if (isLoading) {
    return <div>Loading...</div>;
  }

  if (!carData || carData.length === 0) {
    return <div>No data available.</div>;
  }

  const { brand } = carData[0]; // Assuming you're only displaying the first car's brand info.

  return (
    <section>
      <div className="label d-flex flex-column align-items-center ">
        <p className="FIND-YOUR-PERFECT pt-4 lefttext-mob lefttext-mob-2">
          <span className="text-wrapper">DID YOU</span>
          <span className="span">&nbsp;</span>
          <span className="text-wrapper-2"> KNOW</span>
        </p>
        <div className="mb-3 p-4 font-sans text-[12px] haspading">
          {brand?.doYouKnow}
        </div>
      </div>
    </section>
  );
};

export default Doyouknow;
