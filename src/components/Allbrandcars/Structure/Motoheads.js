import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import backimage from "../../../Images/imagebrand.png";
import backimagecar from "../../../Images/backimagecar.png";
import icar from "../../../Images/icar.png";
import icar2 from "../../../Images/imageiii.png";
import istar from "../../../Images/istar.png";

const Motoheads = ({ brandData }) => {
  const { id, name } = useParams(); // get parameters from the URL
  const [data, setData] = useState(null); // State to hold the API data
  const [carsData, setCarsData] = useState([]); // State to hold cars data
  const [loading, setLoading] = useState(true); // State to manage loading
  const [error, setError] = useState(null);
  const [isHovered, setIsHovered] = useState(false);
  const [activeTab, setActiveTab] = useState(0); // Track which tab is active (0-based index)
  const [dealerCount, setDealerCount] = useState(null);
  const [serviceCenterCount, setServiceCenterCount] = useState(null);
  const [statsLoading, setStatsLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/getbrand/${id}`
        );
        if (!response.ok) {
          throw new Error("Failed to fetch data");
        }
        const result = await response.json();
        setData(result.data); // API response structure
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]); // Fetch data when the component mounts or when 'id' changes

  // New useEffect to fetch cars data
  useEffect(() => {
    const fetchCarsData = async () => {
      try {
        console.log("Fetching cars data for brand ID:", id);
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/brand/${id}`
        );

        console.log("Response status:", response.status);

        if (!response.ok) {
          throw new Error(`Failed to fetch cars data: ${response.status}`);
        }

        const result = await response.json();
        console.log("Cars API response:", result);

        // Try different possible response structures
        let carsArray = [];
        if (result.data && Array.isArray(result.data)) {
          carsArray = result.data;
        } else if (result.cars && Array.isArray(result.cars)) {
          carsArray = result.cars;
        } else if (Array.isArray(result)) {
          carsArray = result;
        } else if (
          result.data &&
          result.data.cars &&
          Array.isArray(result.data.cars)
        ) {
          carsArray = result.data.cars;
        }

        console.log("Extracted cars array:", carsArray);
        console.log("Cars count:", carsArray.length);

        setCarsData(carsArray);
      } catch (err) {
        console.error("Error fetching cars data:", err);
        setCarsData([]); // Set empty array on error
      }
    };

    if (id) {
      fetchCarsData();
    }
  }, [id]);

  // Fetch dealer and service center counts
  useEffect(() => {
    const fetchDealerCount = async () => {
      const locationState = localStorage.getItem("location");
      const parsedLocationState = JSON.parse(locationState);

      if (!parsedLocationState || !parsedLocationState.city || !id) {
        console.log("Missing required data for dealer count fetch");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/v1/totalcount-by-brand-for-app`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              city: parsedLocationState.city,
              brandId: id,
            }),
          }
        );
        const result = await response.json();
        console.log("Dealer count API response:", result);

        if (result.success) {
          setDealerCount(result.data || 0);
        } else {
          console.error("Dealer count API error:", result.message);
        }
      } catch (error) {
        console.error("Error fetching dealer count:", error);
      }
    };

    const fetchServiceCenterCount = async () => {
      const locationState = localStorage.getItem("location");
      const parsedLocationState = JSON.parse(locationState);

      if (!parsedLocationState || !parsedLocationState.city || !id) {
        console.log("Missing required data for service center count fetch");
        return;
      }

      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/v1/total-countof-servicecentre-for-web`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              city: parsedLocationState.city,
              brandId: id,
            }),
          }
        );
        const result = await response.json();
        console.log("Service center count API response:", result);

        if (result.success) {
          setServiceCenterCount(result.data || 0);
        } else {
          console.error("Service center count API error:", result.message);
          setServiceCenterCount(0);
        }
      } catch (error) {
        console.error("Error fetching service center count:", error);
        setServiceCenterCount(0);
      }
    };

    if (id) {
      fetchDealerCount();
      fetchServiceCenterCount();
      setStatsLoading(false);
    }
  }, [id]);

  const monthMapping = {
    JAN: "JANUARY",
    FEB: "FEBRUARY",
    MAR: "MARCH",
    APR: "APRIL",
    MAY: "MAY",
    JUN: "JUNE",
    JUL: "JULY",
    AUG: "AUGUST",
    SEP: "SEPTEMBER",
    OCT: "OCTOBER",
    NOV: "NOVEMBER",
    DEC: "DECEMBER",
  };

  // Function to convert 'MAR-24' to 'MARCH 24'
  const convertMonthYear = (salesMonthAndYear) => {
    const [month, year] = salesMonthAndYear.split("-");
    return `${monthMapping[month]} ${year}`;
  };

  // Calculate current models count
  const currentModelsCount = carsData.length;

  // Calculate upcoming vehicles count (you can modify this logic based on your data structure)
  const upcomingVehiclesCount =
    carsData.filter((car) => car.status === "upcoming" || car.isUpcoming)
      .length || 0;

  if (error) {
    return <div>Error: {error}</div>; // Display error message
  }

  if (!brandData) {
    return (
      <div>
        <section
          className="brandimageheader"
          style={{ backgroundImage: `url(${backimage})` }}
        ></section>
      </div>
    ); // Handle case where data is still null
  }

  return (
    <>
      <section
        className="onlywhy flex-column align-items-center justify-content-center"
        style={{ marginTop: "120px" }}
      >
        <div className="d-flex align-items-center justify-content-center inside_card_title mt-2 mb-1">
          <span className="h1">{brandData.brand.name}</span>
        </div>
        <div className="onlydesptop">
          <div className="sellingss d-flex align-items-center">
            SELLING IN INDIA SINCE {brandData.brand.selling} &nbsp;
            <span
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ display: "inline-block" }} // Ensure the hover works on the icon
            >
              <img
                src={icar2}
                alt="Car icon"
                style={{ cursor: "pointer", width: "20px" }}
              />
              {isHovered && brandData?.brand?.iButtonData && (
                <span
                  className="maihri"
                  style={{
                    position: "absolute",
                    backgroundColor: "#000",
                    border: "1px solid #ccc",
                    zIndex: "100",
                    color: "#000",
                  }}
                >
                  {brandData.brand.iButtonData}
                </span>
              )}
            </span>
          </div>
          <div className="rating-inno-new rounded-1 mt-1">
            {brandData.brand.rating} &nbsp;{" "}
            <svg
              className=""
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_2153_4969)">
                <path
                  d="M2.46172 7.05764C2.23095 7.13792 1.96909 6.99723 2.01572 6.81763L2.51193 4.89992L0.405723 3.53928C0.209032 3.41197 0.311263 3.17925 0.574913 3.15411L3.50316 2.87193L4.80886 1.11761C4.92663 0.959494 5.24529 0.959494 5.36306 1.11761L6.66876 2.87193L9.59701 3.15411C9.86066 3.17925 9.96289 3.41197 9.7656 3.53928L7.65999 4.89992L8.1562 6.81763C8.20283 6.99723 7.94097 7.13792 7.71021 7.05764L5.08506 6.14298L2.46172 7.05764Z"
                  fill="#FCFCFC"
                />
              </g>
              <defs>
                <clipPath id="clip0_2153_4969">
                  <rect
                    x="0.301392"
                    y="0.795898"
                    width="9.56554"
                    height="6.48696"
                    rx="3.24348"
                    fill="white"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
        </div>
        <div className="onlyphoneme gap-1 align-items-center">
          <div className="bg-red-900 text-white flex justify-center items-center rounded-lg w-[47px] h-[17px]">
            {brandData.brand.rating} &nbsp;{" "}
            <svg
              className=""
              width="10"
              height="8"
              viewBox="0 0 10 8"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <g clipPath="url(#clip0_2153_4969)">
                <path
                  d="M2.46172 7.05764C2.23095 7.13792 1.96909 6.99723 2.01572 6.81763L2.51193 4.89992L0.405723 3.53928C0.209032 3.41197 0.311263 3.17925 0.574913 3.15411L3.50316 2.87193L4.80886 1.11761C4.92663 0.959494 5.24529 0.959494 5.36306 1.11761L6.66876 2.87193L9.59701 3.15411C9.86066 3.17925 9.96289 3.41197 9.7656 3.53928L7.65999 4.89992L8.1562 6.81763C8.20283 6.99723 7.94097 7.13792 7.71021 7.05764L5.08506 6.14298L2.46172 7.05764Z"
                  fill="#FCFCFC"
                />
              </g>
              <defs>
                <clipPath id="clip0_2153_4969">
                  <rect
                    x="0.301392"
                    y="0.795898"
                    width="9.56554"
                    height="6.48696"
                    rx="3.24348"
                    fill="white"
                  />
                </clipPath>
              </defs>
            </svg>
          </div>
          <div className="sellingss d-flex align-items-center">
            SELLING IN INDIA SINCE {brandData.brand.selling} &nbsp;
            <span
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ display: "inline-block" }} // Ensure the hover works on the icon
            >
              <img
                src={icar2}
                alt="Car icon"
                style={{ cursor: "pointer", width: "20px" }}
              />
              {isHovered && brandData?.brand?.iButtonData && (
                <span
                  className="maihri"
                  style={{
                    position: "absolute",
                    backgroundColor: "#000",
                    border: "1px solid #ccc",
                    zIndex: "100",
                    color: "#000",
                  }}
                >
                  {brandData.brand.iButtonData}
                </span>
              )}
            </span>
          </div>
        </div>

        <div className="eallos mt-4">
          {/* Desktop View - Keep exactly as is */}
          <ul className="search_tabs search_tabs22 addmargin mt-4 onlydesptop">
            <li className="advance_bars_back active">
              <div className="price-e d-flex flex-column">
                <span className="slasesno">
                  #{brandData.brand.salesRanking}
                </span>
                <span className="d-flex">
                  SALES {convertMonthYear(brandData.brand.salesMonthAndYear)}
                </span>
              </div>
            </li>
            <div className="the-deviderbt"></div>
            <li className="advance_bars_back">
              <div className="price-e d-flex flex-column">
                <span className="slasesno">{currentModelsCount}</span>
                <span className="d-flex">VEHICLES CURRENTLY SELLING</span>
              </div>
            </li>
            <div className="the-deviderbt"></div>
            <li className="advance_bars_back">
              <div className="price-e d-flex flex-column">
                <span className="slasesno">{upcomingVehiclesCount}</span>
                <span className="d-flex">UPCOMING VEHICLES</span>
              </div>
            </li>
            <div className="the-deviderbt"></div>
            <li className="advance_bars_back">
              <div className="price-e d-flex flex-column">
                <span className="slasesno">{dealerCount || "Loading..."}</span>
                <span className="d-flex">PAN INDIA DEALERS</span>
              </div>
            </li>
          </ul>

          {/* Mobile View - With Active Tab Scaling */}
          <div className="onlyphoneme w-full flex justify-center px-4">
            <div className="flex justify-center items-center gap-4 overflow-x-auto py-4 w-full">
              {/* First Item - Sales Ranking */}
              <div
                className={`flex flex-col items-center justify-center transition-all duration-300 ${
                  activeTab === 0
                    ? "w-[79px] h-[79px] bg-[#B10819]"
                    : "w-[65px] h-[65px] bg-[#818181]"
                } text-white rounded-sm shadow-md flex-shrink-0 cursor-pointer transition-all duration-300`}
                onClick={() => setActiveTab(0)}
              >
                <span className="font-bold text-2xl mt-3">
                  <h2 className="font-bold">
                    {" "}
                    #{brandData.brand.salesRanking}
                  </h2>
                </span>
                <p className="font-[Montserrat] text-center font-bold">
                  SALES {convertMonthYear(brandData.brand.salesMonthAndYear)}
                </p>
              </div>

              {/* Divider */}
              <div className="h-16 w-px bg-gray-500 flex-shrink-0"></div>

              {/* Second Item - Current Models */}
              <div
                className={`flex flex-col items-center justify-center ${
                  activeTab === 1
                    ? "w-[79px] h-[79px] bg-[#B10819]"
                    : "w-[65px] h-[65px] bg-[#818181]"
                } text-white rounded-sm shadow-md flex-shrink-0 cursor-pointer transition-all duration-300`}
                onClick={() => setActiveTab(1)}
              >
                <h2 className="font-bold mt-3">{currentModelsCount}</h2>
                <p className="font-[Montserrat] text-center font-bold ">
                  CURRENT MODELS
                </p>
              </div>

              {/* Divider */}
              <div className="h-16 w-px bg-gray-500 flex-shrink-0"></div>

              {/* Third Item - Upcoming Vehicles */}
              <div
                className={`flex flex-col items-center justify-center ${
                  activeTab === 2
                    ? "w-[79px] h-[79px] bg-[#B10819]"
                    : "w-[65px] h-[65px] bg-[#818181]"
                } text-white rounded-sm shadow-md flex-shrink-0 cursor-pointer transition-all duration-300`}
                onClick={() => setActiveTab(2)}
              >
                <h2 className="font-bold mt-3">{upcomingVehiclesCount}</h2>
                <p className="font-[Montserrat] text-center font-bold ">
                  UPCOMING VEHICLES
                </p>
              </div>

              {/* Divider */}
              <div className="h-16 w-px bg-gray-500 flex-shrink-0"></div>

              {/* Fourth Item - Dealers */}
              <div
                className={`flex flex-col items-center justify-center ${
                  activeTab === 3
                    ? "w-[79px] h-[79px] bg-[#B10819]"
                    : "w-[65px] h-[65px] bg-[#818181]"
                } text-white rounded-sm shadow-md flex-shrink-0 cursor-pointer transition-all duration-300`}
                onClick={() => setActiveTab(3)}
              >
                <h2 className="font-bold mt-3">{dealerCount || "..."}</h2>
                <p className="font-[Montserrat] text-center font-bold ">
                  DEALERS
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>
      <section
        className="brandimageheader"
        style={{ backgroundImage: `url(${backimage})`, marginTop: "100px" }}
      >
        <div className="label d-flex flex-column align-items-center">
          <p className="FIND-YOUR-PERFECT pt-4">
            <span className="text-wrapper text-white">
              {brandData.brand.name}
            </span>
            <span className="span">&nbsp;</span>
            <span className="text-wrapper-2">MOTOR INDIA</span>
          </p>
          <div className="text-white selling d-flex align-items-center">
            SELLING IN INDIA SINCE {brandData.brand.selling} &nbsp;
            <span
              onMouseEnter={() => setIsHovered(true)}
              onMouseLeave={() => setIsHovered(false)}
              style={{ display: "inline-block" }} // Ensure the hover works on the icon
            >
              <img src={icar} alt="Car icon" style={{ cursor: "pointer" }} />
              {isHovered && brandData?.brand?.iButtonData && (
                <span
                  className="maihri"
                  style={{
                    position: "absolute",
                    backgroundColor: "#fff",
                    border: "1px solid #ccc",
                    zIndex: "100",
                    color: "#000",
                  }}
                >
                  {brandData.brand.iButtonData}
                </span>
              )}
            </span>
          </div>
          <div className="reattingg">
            {brandData.brand.rating} <img src={istar} alt="Star icon" />
          </div>
        </div>

        <div className="maicarodata">
          <div
            className="brandimagecar d-flex flex-column align-items-center justify-content-center"
            style={{ backgroundImage: `url(${backimagecar})` }}
          >
            <span className="slasesno">#{brandData.brand.salesRanking}</span>
            <span className="slalsesmopn">
              SALES {convertMonthYear(brandData.brand.salesMonthAndYear)}{" "}
            </span>
          </div>
          <div
            className="brandimagecar d-flex flex-column align-items-center justify-content-center"
            style={{ backgroundImage: `url(${backimagecar})` }}
          >
            <span className="slasesno">{currentModelsCount}</span>
            <span className="slalsesmopn">CURRENT MODELS</span>
          </div>
          <div
            className="brandimagecar d-flex flex-column align-items-center justify-content-center"
            style={{ backgroundImage: `url(${backimagecar})` }}
          >
            <span className="slasesno">{upcomingVehiclesCount}</span>
            <span className="slalsesmopn">UPCOMING VEHICLES</span>
          </div>
          <div
            className="brandimagecar d-flex flex-column align-items-center justify-content-center"
            style={{ backgroundImage: `url(${backimagecar})` }}
          >
            <span className="slasesno">{dealerCount || "..."}</span>
            <span className="slalsesmopn">PAN INDIA DEALERS </span>
          </div>
        </div>
      </section>
    </>
  );
};

export default Motoheads;
