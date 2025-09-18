import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

const ProsConsProd = React.forwardRef(({ brandName, carName }, ref) => {
  const [singleCardData, setSingleCardData] = useState([]);

  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${params.id}`
        );
        const data = await response.json();
        setSingleCardData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  const parseList = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const items = doc.querySelectorAll("ul li, p");

    return Array.from(items)
      .map((item) => {
        return item.textContent.trim();
      })
      .filter((text) => text.length > 0);
  };

  const displayName =
    brandName || carName
      ? `${"" ?? ""} ${carName ?? ""}`.trim()
      : `${singleCardData.brandname?.brandName || ""} ${
          singleCardData.carname?.carName || ""
        }`.trim();

  return (
    <div className="max-w-[1400px] mx-auto px-10 py-8 " ref={ref}>
      {/* Header */}
      <div className="text-center mb-8">
        <h2 className="text-[25px] font-bold text-center mb-6 font-sans mt-3">
          <span className="text-[#818181] uppercase"> {displayName}</span>{" "}
          <span className="text-[#B60C19] uppercase">PROS & CONS</span>
        </h2>
      </div>

      {/* Pros and Cons Container */}
      <div className="flex flex-col md:flex-row gap-4 ">
        {/* Pros Section */}
        <div className="2xl:w-1/2 xl:w-1/2 lg:w-1/2 md:w-full sm:w-full  border rounded-2xl ">
          <div className="sm:px-6 py-3 sm:py-4">
            <h3 className="text-lg sm:text-xl font-bold text-[#818181] px-6 md:px-0">
              Pros
            </h3>
          </div>
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="space-y-2 sm:space-y-3">
              {singleCardData.pro ? (
                parseList(singleCardData.pro).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 sm:space-x-3"
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-gray-500 text-sm sm:text-base italic">
                    No pros available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Cons Section */}
        <div className="2xl:w-1/2 xl:w-1/2 lg:w-1/2 md:w-full sm:w-full  border rounded-2xl ">
          <div className=" sm:px-6 py-3 sm:py-4">
            <h3 className="text-lg sm:text-xl font-bold text-[#B60C19] px-6 md:px-0">
              Cons
            </h3>
          </div>
          <div className="px-4 sm:px-6 py-4 sm:py-6">
            <div className="space-y-2 sm:space-y-3">
              {singleCardData.cons ? (
                parseList(singleCardData.cons).map((item, index) => (
                  <div
                    key={index}
                    className="flex items-start space-x-2 sm:space-x-3"
                  >
                    <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-black rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                    <p className="text-gray-800 text-sm sm:text-base leading-relaxed">
                      {item}
                    </p>
                  </div>
                ))
              ) : (
                <div className="flex items-start space-x-2 sm:space-x-3">
                  <div className="w-1.5 h-1.5 sm:w-2 sm:h-2 bg-gray-300 rounded-full mt-1.5 sm:mt-2 flex-shrink-0"></div>
                  <p className="text-gray-500 text-sm sm:text-base italic">
                    No cons available
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
});

ProsConsProd.displayName = "ProsConsProd";

export default ProsConsProd;
