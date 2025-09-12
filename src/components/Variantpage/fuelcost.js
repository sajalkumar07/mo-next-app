import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const API_KEY = "a651f8322fmsh31b9418f911cfd4p1b34abjsn3a21242748da";
const BASE_URL =
  "https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1";

const FuelCost = ({ props, mileageRef, fuelCalcRef, downloadRef }) => {
  const [singleCardData, setSingleCardData] = useState({});
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("petrol");
  const [fuelData, setFuelData] = useState(null);
  const [dailyKms, setDailyKms] = useState("");
  const [brochureStatus, setBrochureStatus] = useState("unchecked"); // unchecked, available, unavailable
  const [isCheckingBrochure, setIsCheckingBrochure] = useState(false);
  const params = useParams();

  // Get location from localStorage with fallback
  const getLocationFromStorage = () => {
    try {
      const locationString = localStorage.getItem("location");
      const location = locationString ? JSON.parse(locationString) : null;
      if (location) {
        setSelectedState(location.state ? location.state.toLowerCase() : "");
        setSelectedCity(location.city ? location.city.toLowerCase() : "");
        return true;
      }
    } catch (error) {
      console.log("localStorage not available, using defaults");
    }

    // Default fallback values
    setSelectedState("rajasthan");
    setSelectedCity("jaipur");
    return false;
  };

  const formatMileage = (value) => {
    if (!value) return "N/A";

    // Extract the numeric part (handles cases like "15.2 kmpl")
    const numericValue = parseFloat(value.toString().split(" ")[0]);

    // Return the integer part
    return isNaN(numericValue) ? "N/A" : Math.floor(numericValue);
  };

  // Initialize location on component mount
  useEffect(() => {
    if (!getLocationFromStorage()) {
      console.error("No location data found in local storage");
    }
  }, []);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${params.id}`
        );
        if (!response.ok) throw new Error("Failed to fetch data");
        const data = await response.json();
        setSingleCardData(data);

        // Check brochure availability when data is loaded
        if (data?.data?.product_id?.carbrowsher) {
          checkBrochureAvailability(data.data.product_id.carbrowsher);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
    fetchData();
  }, [params.id]);

  // Fetch fuel price when city and fuel type are available
  useEffect(() => {
    if (selectedCity && selectedFuel) {
      fetchFuelPrice(selectedCity);
    }
  }, [selectedCity, selectedFuel]);

  const fetchFuelPrice = async (city) => {
    try {
      const response = await fetch(
        `${BASE_URL}/fuel-prices/today/india/${selectedState}/${city}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "X-RapidAPI-Key": API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      setFuelData(data);
    } catch (error) {
      console.error("Error fetching fuel price:", error);
    }
  };

  // Check if brochure file exists on server
  const checkBrochureAvailability = async (filename) => {
    if (!filename) {
      setBrochureStatus("unavailable");
      return;
    }

    setIsCheckingBrochure(true);
    const possiblePaths = [
      `${process.env.NEXT_PUBLIC_API}/productImages/${filename}`,
      `${process.env.NEXT_PUBLIC_API}/uploads/${filename}`,
      `${process.env.NEXT_PUBLIC_API}/files/${filename}`,
      `${process.env.NEXT_PUBLIC_API}/brochures/${filename}`,
      `${process.env.NEXT_PUBLIC_API}/assets/${filename}`,
    ];

    for (const path of possiblePaths) {
      try {
        const response = await fetch(path, {
          method: "HEAD",
          cache: "no-cache",
        });

        if (response.ok) {
          setBrochureStatus("available");
          setIsCheckingBrochure(false);
          return;
        }
      } catch (error) {
        // Continue to next path
        console.log(`Failed to check path: ${path}`);
      }
    }

    setBrochureStatus("unavailable");
    setIsCheckingBrochure(false);
  };

  // Enhanced brochure download with comprehensive error handling
  const handleDownloadBrochure = async () => {
    const filename = singleCardData?.data?.product_id?.carbrowsher;

    if (!filename) {
      showBrochureError("Brochure file not found in database");
      return;
    }

    if (brochureStatus === "unavailable") {
      showBrochureError("Brochure file is not available on server");
      return;
    }

    const possiblePaths = [
      `${process.env.NEXT_PUBLIC_API}/productImages/${filename}`,
      `${process.env.NEXT_PUBLIC_API}/uploads/${filename}`,
      `${process.env.NEXT_PUBLIC_API}/files/${filename}`,
      `${process.env.NEXT_PUBLIC_API}/brochures/${filename}`,
      `${process.env.NEXT_PUBLIC_API}/assets/${filename}`,
    ];

    // Try each possible path
    for (const brochureUrl of possiblePaths) {
      try {
        console.log(`Trying to open: ${brochureUrl}`);

        // Try to fetch the file first to check if it exists
        const response = await fetch(brochureUrl, { method: "HEAD" });

        if (response.ok) {
          // File exists, try to open it
          const newWindow = window.open(brochureUrl, "_blank");

          // Check if popup was blocked
          if (
            !newWindow ||
            newWindow.closed ||
            typeof newWindow.closed === "undefined"
          ) {
            // Popup blocked, try direct download
            await downloadBrochureDirectly(brochureUrl, filename);
          }
          return; // Success, exit function
        }
      } catch (error) {
        console.log(`Failed to access: ${brochureUrl}`, error);
        continue; // Try next path
      }
    }

    // If all paths fail
    showBrochureError(
      "Brochure file could not be found on any server location"
    );
  };

  // Direct download fallback
  const downloadBrochureDirectly = async (url, filename) => {
    try {
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const blob = await response.blob();
      const objectUrl = window.URL.createObjectURL(blob);

      const link = document.createElement("a");
      link.style.display = "none";
      link.href = objectUrl;
      link.download = filename || "brochure.pdf";

      document.body.appendChild(link);
      link.click();

      // Cleanup
      document.body.removeChild(link);
      window.URL.revokeObjectURL(objectUrl);
    } catch (error) {
      console.error("Direct download failed:", error);
      showBrochureError(`Download failed: ${error.message}`);
    }
  };

  // Show user-friendly error message
  const showBrochureError = (errorMessage) => {
    const carName = singleCardData?.data?.product_id?.carname || "Unknown Car";
    const variantName = singleCardData?.data?.varientName || "Unknown Variant";

    alert(`
      Brochure temporarily unavailable. 
      Please try again later or contact support.
      
      Car: ${carName}
      Variant: ${variantName}
      
      
  
    `);
  };

  // Helper function to determine fuel type from engine name - EXACT DART REPLICA
  const findFuelTypeInEngineName = (engineName) => {
    const lowerEngName = engineName.toString().toLowerCase();
    if (lowerEngName.includes("electric")) return "electric";
    if (lowerEngName.includes("petrol")) return "petrol";
    if (lowerEngName.includes("diesel")) return "diesel";
    if (lowerEngName.includes("cng")) return "cng";
    if (lowerEngName.includes("lpg")) return "lpg";
    return "petrol"; // default
  };

  // EXACT DART REPLICA - VARIANT CALCULATION with inline string interpolation
  const calculateVariantCosts = () => {
    const productdatacomp = singleCardData;
    if (!productdatacomp?.data || !fuelData || !dailyKms)
      return { daily: "₹0", monthly: "₹0", yearly: "₹0" };

    const costControllerText = dailyKms.toString();

    // Daily Cost - EXACT DART REPLICA
    const daily = `₹ ${
      productdatacomp["data"]["fuel"]
        ?.toString()
        .toLowerCase()
        .includes("electric")
        ? (
            parseFloat(costControllerText === "" ? "1" : costControllerText) *
            2.5
          ).toFixed(0)
        : (
            (parseFloat(costControllerText === "" ? "1" : costControllerText) /
              ((parseFloat(
                productdatacomp["data"]["City_Real_World"]
                  ?.toString()
                  .split(" ")[0] || "1"
              ) +
                parseFloat(
                  productdatacomp["data"]["Highway_Real_World"]
                    ?.toString()
                    .split(" ")[0] || "1"
                )) /
                2)) *
            parseFloat(
              fuelData["fuel"][
                productdatacomp["data"]["fuel"]?.toString().toLowerCase() ||
                  "petrol"
              ] == null
                ? "1"
                : fuelData["fuel"][
                    productdatacomp["data"]["fuel"]?.toString().toLowerCase() ||
                      "petrol"
                  ]["retailPrice"]?.toString() || "1"
            )
          ).toFixed(0)
    }`;

    // Monthly Cost - EXACT DART REPLICA
    const monthly = `₹ ${
      productdatacomp["data"]["fuel"]
        ?.toString()
        .toLowerCase()
        .includes("electric")
        ? (
            parseFloat(costControllerText === "" ? "1" : costControllerText) *
            2.5 *
            30
          ).toFixed(0)
        : (
            parseFloat(
              (
                (parseFloat(
                  costControllerText === "" ? "1" : costControllerText
                ) /
                  ((parseFloat(
                    productdatacomp["data"]["City_Real_World"]
                      ?.toString()
                      .split(" ")[0] || "1"
                  ) +
                    parseFloat(
                      productdatacomp["data"]["Highway_Real_World"]
                        ?.toString()
                        .split(" ")[0] || "1"
                    )) /
                    2)) *
                parseFloat(
                  fuelData["fuel"][
                    productdatacomp["data"]["fuel"]?.toString().toLowerCase() ||
                      "petrol"
                  ] == null
                    ? "1"
                    : fuelData["fuel"][
                        productdatacomp["data"]["fuel"]
                          ?.toString()
                          .toLowerCase() || "petrol"
                      ]["retailPrice"]?.toString() || "1"
                )
              ).toFixed(0)
            ) * 30
          ).toFixed(0)
    }`;

    // Yearly Cost - EXACT DART REPLICA
    const yearly = `₹ ${
      productdatacomp["data"]["fuel"]
        ?.toString()
        .toLowerCase()
        .includes("electric")
        ? (
            parseFloat(costControllerText === "" ? "1" : costControllerText) *
            2.5 *
            365
          ).toFixed(0)
        : (
            parseFloat(
              (
                (parseFloat(
                  costControllerText === "" ? "1" : costControllerText
                ) /
                  ((parseFloat(
                    productdatacomp["data"]["City_Real_World"]
                      ?.toString()
                      .split(" ")[0] || "1"
                  ) +
                    parseFloat(
                      productdatacomp["data"]["Highway_Real_World"]
                        ?.toString()
                        .split(" ")[0] || "1"
                    )) /
                    2)) *
                parseFloat(
                  fuelData["fuel"][
                    productdatacomp["data"]["fuel"]?.toString().toLowerCase() ||
                      "petrol"
                  ] == null
                    ? "1"
                    : fuelData["fuel"][
                        productdatacomp["data"]["fuel"]
                          ?.toString()
                          .toLowerCase() || "petrol"
                      ]["retailPrice"]?.toString() || "1"
                )
              ).toFixed(0)
            ) * 365
          ).toFixed(0)
    }`;

    return { daily, monthly, yearly };
  };

  // Get calculated costs using the enhanced logic
  const costs = calculateVariantCosts();

  // Get current fuel price for display
  const getCurrentFuelPrice = () => {
    if (!fuelData || !singleCardData?.data?.fuel) return "N/A";

    const fuelType = singleCardData.data.fuel.toString().toLowerCase();
    if (fuelType.includes("electric")) return "₹2.5/km"; // Electric rate

    const fuelPrice = fuelData.fuel?.[fuelType]?.retailPrice;
    return fuelPrice ? `₹${fuelPrice}` : "N/A";
  };

  const handleDailyKmsChange = (e) => {
    const value = e.target.value;
    setDailyKms(value);
  };

  // Get button text and status based on brochure availability
  const getBrochureButtonProps = () => {
    if (isCheckingBrochure) {
      return {
        text: "CHECKING AVAILABILITY...",
        disabled: true,
        className: "bg-gray-400 cursor-not-allowed",
      };
    }

    if (brochureStatus === "unavailable") {
      return {
        text: "BROCHURE UNAVAILABLE",
        disabled: true,
        className: "bg-gray-400 cursor-not-allowed",
      };
    }

    return {
      text: "DOWNLOAD BROCHURE",
      disabled: false,
      className: "bg-[#AB373A] hover:bg-[#8B2F32]",
    };
  };

  const buttonProps = getBrochureButtonProps();

  return (
    <div className="max-w-6xl mx-auto p-4">
      {/* Desktop View */}
      <div className="hidden md:flex justify-center gap-8 mb-8">
        {/* Mileage Section */}
        <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
          <h2 className="text-2xl font-bold uppercase mb-4">
            {singleCardData?.data?.product_id?.carname || "Product"}{" "}
            <span className="font-normal ">
              {singleCardData?.data?.varientName || "Mileage"}
            </span>
          </h2>
          <div className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="font-medium">Engine & Transmission</span>
              <span>{singleCardData?.data?.Engine_Name_Varient || "N/A"}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>Company Claimed</span>
              <span>
                {formatMileage(singleCardData?.data?.Company_Claimed)} Km/l
              </span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span>City Real World</span>
              <span>
                {formatMileage(singleCardData?.data?.City_Real_World)} Km/l
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span>Highway Real World</span>
              <span>
                {formatMileage(singleCardData?.data?.Highway_Real_World)} Km/l
              </span>
            </div>
          </div>
        </div>

        {/* Fuel Cost Calculator - Only show when dailyKms has value */}
        {dailyKms && (
          <div className="bg-white rounded-lg shadow-md p-6 w-full max-w-md">
            <h2 className="text-2xl font-bold uppercase mb-4">
              {singleCardData?.data?.product_id?.carname || "Product"}{" "}
              <span className="font-normal">Fuel Cost Calculator</span>
            </h2>

            <div className="space-y-4">
              <div className="flex justify-between items-center border-b pb-2">
                <span className="font-medium">Current Fuel Price</span>
                <span>{getCurrentFuelPrice()}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span>Daily Fuel Cost</span>
                <span>{costs.daily}</span>
              </div>
              <div className="flex justify-between items-center border-b pb-2">
                <span>Monthly Fuel Cost</span>
                <span>{costs.monthly}</span>
              </div>
              <div className="flex justify-between items-center">
                <span>Yearly Fuel Cost</span>
                <span>{costs.yearly}</span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Input field for desktop */}
      <div className="hidden md:block mb-4">
        <div className="flex justify-center">
          <div className="flex rounded overflow-hidden border border-gray-300 max-w-md">
            <input
              className="input_box_input pl-4 w-full outline-none border-none"
              type="number"
              placeholder="Daily Kms Driven"
              value={dailyKms}
              onChange={handleDailyKmsChange}
            />
            <span className="bg-black text-white px-4 text-sm flex items-center justify-center">
              Kms
            </span>
          </div>
        </div>
      </div>

      {/* Mobile View */}
      <div className="md:hidden">
        {/* Mileage Section */}
        <div className="p-4 mb-6" id="mileage">
          <div className="text-left sm:text-center" ref={mileageRef}>
            <div className="flex">
              <span className="block md:hidden text-[#818181] text-[20px]">
                {singleCardData?.data?.product_id?.carname || "Product"}{" "}
                {singleCardData?.data?.varientName || "Mileage"} &nbsp;
                <span className="text-[20px] text-[#B1081A]"> Mileage </span>
              </span>
            </div>
          </div>

          <div className="flex justify-center items-center space-x-4">
            <div
              className="shadow-md  rounded-sm overflow-hidden flex-shrink-0 bg-white border  shadow-black/30 text-center
                  w-[162px] h-[156px] p-4"
            >
              <div className="flex justify-center items-center flex-col font-[Montserrat] font-medium">
                {" "}
                <h3 className=" text-[12px] font-semibold text-[#B1081A] mb-2 text-center">
                  Engine &
                </h3>
                <h3 className=" text-[12px] font-semibold text-[#B1081A] mb-2 text-center">
                  Transmission
                </h3>
              </div>
              <div className="space-y-6 mt-3 font-[Montserrat] font-medium text-black">
                <div className="flex justify-center items-center">
                  <span className=" w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
                    Company Claimed
                  </span>
                </div>
                <div className="flex justify-center items-center">
                  <span className="w-[120px] text-center md:border-none border-b border-black/30">
                    City Real World
                  </span>
                </div>
                <div className="flex justify-center items-center">
                  <span className="w-[120px] text-center md:border-none border-b border-black/30">
                    Highway Real World
                  </span>
                </div>
              </div>
            </div>

            <div
              className="shadow-md  rounded-sm overflow-hidden flex-shrink-0 bg-white border  shadow-black/30 text-center
                  w-[162px] h-[156px] p-4"
            >
              <div className="flex justify-center items-center flex-col font-[Montserrat] font-medium">
                <h3 className="text-[12px] font-semibold text-[#B1081A] mb-2 text-center">
                  {(() => {
                    const engine =
                      singleCardData?.data?.Engine_Name_Varient || "N/A";
                    const words = engine.trim().split(" ");
                    const last = words.pop();
                    const first = words.join(" ");
                    return (
                      <>
                        {first} <br /> {last}
                      </>
                    );
                  })()}
                </h3>
              </div>

              <div className="space-y-6 mt-3 font-[Montserrat] font-medium text-black">
                <div className="flex justify-center items-center">
                  <span className=" w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
                    {formatMileage(singleCardData?.data?.Company_Claimed)} Km/l
                  </span>
                </div>
                <div className="flex justify-center items-center">
                  <span className=" w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
                    {formatMileage(singleCardData?.data?.City_Real_World)} Km/l
                  </span>
                </div>
                <div className="flex justify-center items-center">
                  <span className=" w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
                    {formatMileage(singleCardData?.data?.Highway_Real_World)}{" "}
                    Km/l
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Input field for mobile */}
        <div
          className="p-2 flex justify-center items-center onlyphoneme"
          ref={fuelCalcRef}
        >
          <div className="flex w-[400px] rounded overflow-hidden border border-gray-300">
            <input
              className="input_box_input pl-4 w-full outline-none border-none"
              type="number"
              placeholder="Daily Kms Driven"
              value={dailyKms}
              onChange={handleDailyKmsChange}
            />
            <span className="bg-black text-white px-4 text-sm flex items-center justify-center">
              Kms
            </span>
          </div>
        </div>

        {/* Fuel Cost Calculator - Only show when dailyKms has value */}
        {dailyKms && (
          <div className="p-4 mb-6" id="calc">
            <div className="text-left sm:text-center ">
              <div className="flex flex-col">
                <span className="block md:hidden text-[#818181] text-[20px] -mb-6">
                  {singleCardData?.data?.product_id?.carname || "Product"}{" "}
                  {singleCardData?.data?.varientName || "Mileage"}
                </span>
                &nbsp;
                <span className="text-[20px] text-[#B1081A] ">
                  {" "}
                  Fuel Cost Calculator{" "}
                </span>
              </div>
            </div>

            <div className="flex justify-center items-center space-x-4">
              <div
                className="shadow-md  rounded-sm overflow-hidden flex-shrink-0 bg-white border  shadow-black/30 text-center
                    w-[162px] h-[156px] p-4"
              >
                <div className="flex justify-center items-center flex-col font-[Montserrat] font-medium">
                  {" "}
                  <h3 className=" text-[12px] font-semibold text-[#B1081A] mb-2 text-center">
                    Engine &
                  </h3>
                  <h3 className=" text-[12px] font-semibold text-[#B1081A] mb-2 text-center">
                    Transmission
                  </h3>
                </div>
                <div className="space-y-6 mt-3 font-[Montserrat] font-medium text-black">
                  <div className="flex justify-center items-center">
                    <span className=" w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
                      Daily Fuel Cost
                    </span>
                  </div>
                  <div className="flex justify-center items-center">
                    <span className="w-[120px] text-center md:border-none border-b border-black/30">
                      Monthly Fuel Cost
                    </span>
                  </div>
                  <div className="flex justify-center items-center">
                    <span className="w-[120px] text-center md:border-none border-b border-black/30">
                      Yearly Fuel Cost
                    </span>
                  </div>
                </div>
              </div>
              <div
                className="shadow-md  rounded-sm overflow-hidden flex-shrink-0 bg-white border  shadow-black/30 text-center
                w-[162px] h-[156px] p-4"
              >
                <div className="flex justify-center items-center flex-col font-[Montserrat] font-medium">
                  <h3 className="text-[12px] font-semibold text-[#B1081A] mb-2 text-center">
                    {(() => {
                      const engine =
                        singleCardData?.data?.Engine_Name_Varient || "N/A";
                      const words = engine.trim().split(" ");
                      const last = words.pop();
                      const first = words.join(" ");
                      return (
                        <>
                          {first} <br /> {last}
                        </>
                      );
                    })()}
                  </h3>
                </div>

                <div className="space-y-6 mt-3 font-[Montserrat] font-medium text-black">
                  {" "}
                  <div className="flex justify-center items-center">
                    <span className="w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
                      {costs.daily}
                    </span>
                  </div>
                  <div className="flex justify-center items-center">
                    <span className="w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
                      {costs.monthly}
                    </span>
                  </div>
                  <div className="flex justify-center items-center">
                    <span className="w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
                      {costs.yearly}
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      <div className="text-center mt-8" ref={downloadRef}>
        <button
          className="bg-[#AB373A] text-white font-bold w-[232px] h-[30px] text-[14px] rounded-lg transition font-[Montserrat] shadow-md shaodw-black/30"
          onClick={handleDownloadBrochure}
        >
          DOWNLOAD BROCHURE
        </button>
      </div>
    </div>
  );
};

export default FuelCost;
