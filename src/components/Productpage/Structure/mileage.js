import React, { useState, useEffect, forwardRef } from "react";
import { useParams } from "react-router-dom";

const Mileage = forwardRef(({ brandName, carName }, ref) => {
  const [carData, setCarData] = useState([]);
  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${params.id}`
        );
        const data = await response.json();
        setCarData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  return (
    <section className="mt-10 font-sans px-4" ref={ref}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-[25px] font-bold text-center mb-6 font-sans mt-3">
          <span className="text-[#818181]  uppercase">{carName}</span>{" "}
          <span className="text-[#B60C19]">MILEAGE</span>
        </h2>
      </div>

      {/* Mileage Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-[1400px] mx-auto md:px-10 px-4">
        {carData.variantsWithMileage?.map((variant, index) => (
          <div
            key={index}
            className="bg-white border border-gray-200 rounded-2xl p-6 text-center "
          >
            {/* Variant Name */}
            <h3 className="text-[#B60C19] font-semibold text-lg mb-4">
              {variant.Engine_Name_Variant}
            </h3>

            {/* Main Mileage */}
            <div className="mb-4">
              <div className="text-3xl font-bold text-black mb-1">
                {parseInt(variant.Company_Claimed)} km/l
              </div>
              <div className="text-gray-500 text-sm">(claimed)</div>
            </div>

            {/* Real World Data */}
            <div className="text-sm text-black">
              <div>
                {parseInt(variant.City_Real_World)} city /{" "}
                {parseInt(variant.Highway_Real_World)} highway
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
});

export default Mileage;
