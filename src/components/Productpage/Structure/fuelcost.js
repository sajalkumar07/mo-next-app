import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";
import { Download } from "lucide-react";

const API_KEY = "a651f8322fmsh31b9418f911cfd4p1b34abjsn3a21242748da";
const BASE_URL =
  "https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1";

const FuelCostCard = ({ engineName, daily, monthly, yearly }) => (
  <div className="bg-white border border-gray-200 rounded-2xl p-6 text-center w-auto flex justify-center items-center flex-col">
    {/* Variant Name */}
    <div className=" w-[600px]">
      <h3 className="text-[#B60C19] font-semibold text-lg mb-4">
        {" "}
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

      {/* Cost Details */}
      <div className="flex justify-center items-center flex-col ">
        <div className="flex justify-center items-center  gap-2">
          {" "}
          <div className="text-[14px] text-black font-medium text-sm">
            Daily Cost:
          </div>
          <div className="text-[14px] text-black font-medium mb-1">{daily}</div>
        </div>
        <div className="flex justify-center items-center gap-2">
          {" "}
          <div className="text-[14px] text-black font-medium text-sm">
            Monthly Cost:
          </div>
          <div className="text-[14px] text-black font-medium mb-1">
            {monthly}
          </div>
        </div>
        <div className="flex justify-center items-center gap-2">
          {" "}
          <div className="text-[14px] text-black font-medium text-sm">
            Yearly Cost:
          </div>
          <div className="text-[14px] text-black font-medium mb-1">
            {yearly}
          </div>
        </div>
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
        console.log("Fetched data:", data);
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
      const response = await fetch(brochureUrl, { method: "HEAD" });

      if (response.ok) {
        window.open(brochureUrl, "_blank");
      } else {
        console.error(`Brochure file not found. Status: ${response.status}`);
        await tryAlternativePaths(singleCardData.carbrowsher);
      }
    } catch (error) {
      console.error("Error checking brochure availability:", error);

      const fallbackWindow = window.open(brochureUrl, "_blank");

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
        continue;
      }
    }

    showBrochureError();
  };

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

  const findFuelTypeInEngineName = (engineName) => {
    const lowerEngName = engineName.toString().toLowerCase();
    if (lowerEngName.includes("electric")) return "electric";
    if (lowerEngName.includes("petrol")) return "petrol";
    if (lowerEngName.includes("diesel")) return "diesel";
    if (lowerEngName.includes("cng")) return "cng";
    if (lowerEngName.includes("lpg")) return "lpg";
    return "petrol";
  };

  const calculateProductCosts = (e) => {
    if (!e || !fuelData || !dailyKms)
      return { daily: "₹0", monthly: "₹0", yearly: "₹0" };

    const controllerText = dailyKms.toString();

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
    <section
      className="mt-20 bg-[#f5f5f5] font-sans px-10 py-2"
      ref={fuleCostRef}
    >
      <div className="text-center mb-8">
        <h2 className="text-[20px] sm:text-[25px] font-bold text-center mb-6 font-sans mt-3">
          <span className="text-[#818181] uppercase">{carName} FUEL COST</span>{" "}
          <span className="text-[#B60C19]">CALCULATOR</span>
        </h2>
      </div>

      <div className="flex justify-center items-center flex-col ">
        <div className="w-full max-w-[1400px] mx-auto ">
          <div className="flex justify-center items-center mb-6 ">
            <div className="flex gap-2 w-full max-w-[400px]">
              <input
                className="rounded-md px-3 py-2 bg-white border border-gray-200 focus:ring-2 focus:ring-[#B60C19] focus:border-transparent flex-1 h-[40px] text-sm sm:text-base"
                type="text"
                placeholder="Daily Kms Driven"
                value={dailyKms}
                onChange={(e) => setDailyKms(e.target.value)}
              />
              {/* <button
                  className="bg-[#AB373A] hover:bg-[#8B2D30] text-white font-bold px-6 h-[40px] text-sm rounded-md transition-colors"
                  onClick={() => {}}
                >
                  Calculate
                </button> */}
            </div>
          </div>
        </div>

        {dailyKms && (
          <>
            <div className="mt-6 w-full">
              <div className="flex justify-center">
                <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-2 xl:grid-cols-3 gap-6 max-w-[1400px]">
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
          </>
        )}

        <div className="flex justify-center mt-8" ref={brochureRef}>
          <button className="px-5 py-2 rounded-md text-sm md:text-base font-medium transition-all duration-300 border border-black text-black hover:bg-black hover:text-white flex items-center gap-2">
            <Download size={18} className=" " />
            <span> DOWNLOAD</span>
          </button>
        </div>
      </div>
    </section>
  );
};

export default Fuelcost;
