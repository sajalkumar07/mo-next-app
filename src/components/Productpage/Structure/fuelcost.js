import React, { useState, useEffect, useRef, forwardRef } from "react";
import { useParams } from "react-router-dom";

const API_KEY = "a651f8322fmsh31b9418f911cfd4p1b34abjsn3a21242748da";
const BASE_URL =
  "https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1";

const FuelCostCard = ({ engineName, daily, monthly, yearly }) => (
  <div
    className="shadow-md rounded-sm overflow-hidden flex-shrink-0 bg-white border shadow-black/30 text-center
           w-[162px] h-[156px] md:w-[200px] md:h-[300px] p-4 "
  >
    <div className="flex justify-center items-center flex-col font-[Montserrat] font-medium">
      <h3 className="text-[12px] font-semibold text-[#B1081A] mb-2 text-center">
        {(() => {
          const words = engineName.trim().split(" ");
          const lastWord = words.pop();
          const mainPart = words.join(" ");
          return (
            <>
              {mainPart} <br /> {lastWord}
            </>
          );
        })()}
      </h3>
    </div>

    <div className="space-y-6 mt-3 font-[Montserrat] font-medium text-black">
      <div className="flex justify-center items-center">
        <span className="text-gray-600 hidden md:block w-1/2 text-center">
          Daily Cost
        </span>
        <span className="w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
          {daily}
        </span>
      </div>
      <div className="flex justify-center items-center">
        <span className="text-gray-600 hidden md:block w-1/2 text-center md:border-none border-b border-black/30">
          Monthly Cost
        </span>
        <span className="w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
          {monthly}
        </span>
      </div>
      <div className="flex justify-center items-center">
        <span className="text-gray-600 hidden md:block w-1/2 text-center md:border-none border-b border-black/30">
          Yearly Cost
        </span>
        <span className="w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
          {yearly}
        </span>
      </div>
    </div>
  </div>
);

const Fuelcost = ({ brandName, carName, fuleCostRef, brochureRef }) => {
  const [variantsWithMileage, setVariantsWithMileage] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("petrol");
  const [fuelData, setFuelData] = useState(null);
  const [dailyKms, setDailyKms] = useState("");
  const [activeDot, setActiveDot] = useState(0);
  const scrollContainerRef = useRef(null);
  const [singleCardData, setSingleCardData] = useState({});

  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${params.id}`
        );
        const data = await response.json();
        console.log("Fetched data:", data); // Debug log
        setSingleCardData(data);
        setVariantsWithMileage(data.variantsWithMileage || []);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  const handleDownloadBrochure = async () => {
    console.log("singleCardData:", singleCardData);
    console.log("carbrowsher value:", singleCardData.carbrowsher);

    if (!singleCardData.carbrowsher) {
      console.error("Brochure URL not available");
      alert("Brochure not available for this car.");
      return;
    }

    const brochureUrl = `${process.env.NEXT_PUBLIC_API}/productImages/${singleCardData.carbrowsher}`;
    console.log("Checking brochure URL:", brochureUrl);

    try {
      // First, check if the file exists by making a HEAD request
      const response = await fetch(brochureUrl, { method: "HEAD" });

      if (response.ok) {
        // File exists, open it
        window.open(brochureUrl, "_blank");
      } else {
        console.error(`Brochure file not found. Status: ${response.status}`);

        // Try alternative paths or show user-friendly error
        await tryAlternativePaths(singleCardData.carbrowsher);
      }
    } catch (error) {
      console.error("Error checking brochure availability:", error);

      // Fallback: try to open anyway (in case CORS blocks HEAD request)
      const fallbackWindow = window.open(brochureUrl, "_blank");

      // Check if window was blocked or failed to open
      setTimeout(() => {
        if (!fallbackWindow || fallbackWindow.closed) {
          showBrochureError();
        }
      }, 1000);
    }
  };

  const tryAlternativePaths = async (filename) => {
    const alternativePaths = [
      `${process.env.NEXT_PUBLIC_API}/uploads/${filename}`,
      `${process.env.NEXT_PUBLIC_API}/files/${filename}`,
      `${process.env.NEXT_PUBLIC_API}/brochures/${filename}`,
      `${process.env.NEXT_PUBLIC_API}/assets/${filename}`,
    ];

    for (const path of alternativePaths) {
      try {
        const response = await fetch(path, { method: "HEAD" });
        if (response.ok) {
          console.log(`Found brochure at alternative path: ${path}`);
          window.open(path, "_blank");
          return;
        }
      } catch (error) {
        // Continue to next path
        continue;
      }
    }

    // If no alternative paths work
    showBrochureError();
  };

  // User-friendly error display
  const showBrochureError = () => {
    alert(`
        Brochure temporarily unavailable. 
        Please try again later or contact support.
        
        Car: ${singleCardData.carname || "Unknown"}
        Brand: ${singleCardData.brand?.name || "Unknown"}
      `);
  };

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

    // Default values for demo
    setSelectedState("rajasthan");
    setSelectedCity("jaipur");
    return false;
  };

  useEffect(() => {
    getLocationFromStorage();
  }, []);

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

  // EXACT DART REPLICA - PRODUCT CALCULATION with inline string interpolation
  const calculateProductCosts = (e) => {
    if (!e || !fuelData || !dailyKms)
      return { daily: "₹0", monthly: "₹0", yearly: "₹0" };

    const controllerText = dailyKms.toString();

    // Daily Cost - EXACT DART REPLICA
    const daily = `₹ ${
      findFuelTypeInEngineName(e["Engine_Name_Variant"].toString()).includes(
        "electric"
      )
        ? (
            parseFloat(controllerText === "" ? "1" : controllerText) * 2.5
          ).toFixed(0)
        : (
            (parseFloat(controllerText === "" ? "1" : controllerText) /
              ((parseFloat(e["City_Real_World"].toString().split(" ")[0]) +
                parseFloat(e["Highway_Real_World"].toString().split(" ")[0])) /
                2)) *
            parseFloat(
              fuelData["fuel"][
                findFuelTypeInEngineName(e["Engine_Name_Variant"].toString())
              ] == null
                ? "1"
                : fuelData["fuel"][
                    findFuelTypeInEngineName(
                      e["Engine_Name_Variant"].toString()
                    )
                  ]["retailPrice"].toString()
            )
          ).toFixed(0)
    }`;

    // Monthly Cost - EXACT DART REPLICA
    const monthly = `₹ ${
      findFuelTypeInEngineName(e["Engine_Name_Variant"].toString()).includes(
        "electric"
      )
        ? (
            parseFloat(controllerText === "" ? "1" : controllerText) *
            2.5 *
            30
          ).toFixed(0)
        : (
            parseFloat(
              (
                (parseFloat(controllerText === "" ? "1" : controllerText) /
                  ((parseFloat(e["City_Real_World"].toString().split(" ")[0]) +
                    parseFloat(
                      e["Highway_Real_World"].toString().split(" ")[0]
                    )) /
                    2)) *
                parseFloat(
                  fuelData["fuel"][
                    findFuelTypeInEngineName(
                      e["Engine_Name_Variant"].toString()
                    )
                  ] == null
                    ? "1"
                    : fuelData["fuel"][
                        findFuelTypeInEngineName(
                          e["Engine_Name_Variant"].toString()
                        )
                      ]["retailPrice"].toString()
                )
              ).toFixed(0)
            ) * 30
          ).toFixed(0)
    }`;

    // Yearly Cost - EXACT DART REPLICA
    const yearly = `₹ ${
      findFuelTypeInEngineName(e["Engine_Name_Variant"].toString()).includes(
        "electric"
      )
        ? (
            parseFloat(controllerText === "" ? "1" : controllerText) *
            2.5 *
            365
          ).toFixed(0)
        : (
            parseFloat(
              (
                (parseFloat(controllerText === "" ? "1" : controllerText) /
                  ((parseFloat(e["City_Real_World"].toString().split(" ")[0]) +
                    parseFloat(
                      e["Highway_Real_World"].toString().split(" ")[0]
                    )) /
                    2)) *
                parseFloat(
                  fuelData["fuel"][
                    findFuelTypeInEngineName(
                      e["Engine_Name_Variant"].toString()
                    )
                  ] == null
                    ? "1"
                    : fuelData["fuel"][
                        findFuelTypeInEngineName(
                          e["Engine_Name_Variant"].toString()
                        )
                      ]["retailPrice"].toString()
                )
              ).toFixed(0)
            ) * 365
          ).toFixed(0)
    }`;

    return { daily, monthly, yearly };
  };

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const scrollPosition = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const scrollWidth = container.scrollWidth;

      const newActiveDot = Math.round(
        (scrollPosition / (scrollWidth - containerWidth)) *
          ((variantsWithMileage?.length || 0) - 1)
      );

      setActiveDot(newActiveDot);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, [variantsWithMileage]);

  const scrollToSection = (index) => {
    if (!scrollContainerRef.current || !variantsWithMileage) return;

    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;

    const scrollTo =
      index *
      ((scrollWidth - containerWidth) / (variantsWithMileage.length - 1));

    container.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });

    setActiveDot(index);
  };

  return (
    <section className="py-8 px-4" ref={fuleCostRef}>
      <div className="text-left sm:text-center md:text-center blocl md:flex md:justify-center md:items-center ">
        <div className="flex flex-col md:flex-row">
          <span className=" text-[#818181] text-[20px]">
            {brandName || carName
              ? `${brandName ?? ""} ${carName ?? ""}`.trim()
              : singleCardData.brand?.name || singleCardData.carname}
          </span>

          <span className="text-[20px] text-[#B1081A]">
            Fuel Cost Calculator
          </span>
        </div>
      </div>

      <div className="container mx-auto flex-col">
        <div className="flex justify-center mb-8 w-full">
          <div className="input_box new-input_box max-w-6xl flex w-full">
            <input
              className="input_box_input theofuelcosdtcsl p-4 w-[36xp] "
              type="number"
              placeholder="Daily Kms Driven"
              value={dailyKms}
              onChange={(e) => setDailyKms(e.target.value)}
            />
            <div className="theofuelcosdtcsl text-white bg-black py-[10.4px] px-4 ">
              KMS
            </div>
          </div>
        </div>

        {dailyKms && (
          <>
            {/* Mobile view with sticky header and horizontal scroll */}
            <div className="md:hidden flex w-full">
              {/* Sticky title block for mobile */}
              <div
                className="shadow-md rounded-sm overflow-hidden flex-shrink-0 bg-white border shadow-black/30 text-center
                      w-[162px] h-[156px] p-4 sticky left-0 z-10"
              >
                <div className="flex justify-center items-center flex-col font-[Montserrat] font-medium">
                  <h3 className="text-[12px] font-semibold text-[#B1081A] mb-2 text-center">
                    Engine &
                  </h3>
                  <h3 className="text-[12px] font-semibold text-[#B1081A] mb-2 text-center">
                    Transmission
                  </h3>
                </div>
                <div className="space-y-6 mt-3 font-[Montserrat] font-medium text-black">
                  <div className="flex justify-center items-center">
                    <span className="w-[120px] text-center md:border-none border-b border-black/30 mx-auto inline-block">
                      Daily Cost
                    </span>
                  </div>
                  <div className="flex justify-center items-center">
                    <span className="w-[120px] text-center md:border-none border-b border-black/30">
                      Monthly Cost
                    </span>
                  </div>
                  <div className="flex justify-center items-center">
                    <span className="w-[120px] text-center md:border-none border-b border-black/30">
                      Yearly Cost
                    </span>
                  </div>
                </div>
              </div>

              {/* Scrollable container for fuel cost cards */}
              <div
                className="overflow-x-auto flex-1 scrollbar-hide"
                ref={scrollContainerRef}
              >
                <div className="flex space-x-4 pb-4 min-w-min pl-6 pr-6">
                  {/* Fuel cost cards for mobile - USING DART PRODUCT LOGIC */}
                  {variantsWithMileage?.map((variant, index) => {
                    const costs = calculateProductCosts(variant);
                    return (
                      <FuelCostCard
                        key={index}
                        engineName={variant.Engine_Name_Variant}
                        daily={costs.daily}
                        monthly={costs.monthly}
                        yearly={costs.yearly}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Desktop view without title block - USING DART PRODUCT LOGIC */}
            <div className="hidden md:block">
              <div className="flex justify-center">
                <div className="flex gap-4">
                  {variantsWithMileage?.map((variant, index) => {
                    const costs = calculateProductCosts(variant);
                    return (
                      <FuelCostCard
                        key={index}
                        engineName={variant.Engine_Name_Variant}
                        daily={costs.daily}
                        monthly={costs.monthly}
                        yearly={costs.yearly}
                      />
                    );
                  })}
                </div>
              </div>
            </div>

            {/* Pagination dots for mobile */}
            {variantsWithMileage?.length > 0 && (
              <div className="md:hidden flex justify-center mt-4">
                {variantsWithMileage.map((_, index) => (
                  <div
                    key={index}
                    className={`w-[8px] h-[8px] mx-1 rounded-full cursor-pointer ${
                      activeDot === index ? "bg-red-600" : "bg-gray-300"
                    }`}
                    onClick={() => scrollToSection(index)}
                  />
                ))}
              </div>
            )}
          </>
        )}

        <div className="flex justify-center mt-8" ref={brochureRef}>
          <button
            className="bg-[#AB373A] text-white font-bold w-[232px] h-[30px] text-[14px] rounded-lg transition font-[Montserrat] shadow-md shaodw-black/30"
            onClick={handleDownloadBrochure}
          >
            DOWNLOAD BROCHURE
          </button>
        </div>
      </div>
    </section>
  );
};

export default Fuelcost;
