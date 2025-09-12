import React, { useState, useEffect, useRef, act } from "react";
import { useParams } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import ChangeCarPopup from "./changeCarCompero";

const Compero = () => {
  const [singlecardData, setSingleCardData] = useState([]);
  const [singlevarientdata, setSingleVarientdata] = useState([]);
  const [rtoData, setRtoData] = useState([]);
  const [isLoadingb, setIsLoadingb] = useState(true);
  const [selectedCars, setSelectedCars] = useState([]);
  const [showPopup, setShowPopup] = useState(false);
  const [carIndexToReplace, setCarIndexToReplace] = useState(null);
  const [variantData, setVariantData] = useState(null);
  const [activeSection, setActiveSection] = useState(null);
  const { Car1, Car2 } = useParams();
  const sectionContainerRef = useRef(null);
  const [showMore, setShowMore] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoadingb(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  // Price calculation functions from CarSection
  const normalizeFuelType = (fuelType) => {
    if (!fuelType) return "";
    const normalizedFuel = fuelType.toLowerCase();
    if (normalizedFuel.includes("hybrid")) {
      return "petrol";
    }
    return normalizedFuel;
  };

  const calculateOnRoadPrice = (carPrice, fuelType) => {
    if (!Array.isArray(rtoData) || rtoData.length === 0) {
      return carPrice;
    }

    const normalizedFuelType = normalizeFuelType(fuelType);
    const priceStr = carPrice.toString();
    const price = parseFloat(priceStr) || 0;

    const rtoInfo =
      rtoData.find(
        (rto) =>
          price >= parseFloat(rto.startPrice || 0) &&
          (rto.endPrice === "ABOVE"
            ? true
            : price <= parseFloat(rto.endPrice || Infinity)) &&
          (rto.fuelType || "").toUpperCase() ===
            normalizedFuelType.toUpperCase()
      ) || {};

    if (!rtoInfo) return carPrice;

    const basePrice = parseInt(priceStr) || 0;
    const rtoPercentage = parseFloat(rtoInfo.rtoPercentage) || 0;
    const insurancePercentage = parseFloat(rtoInfo.insurancePercentage) || 0;
    const hypethecationCharges = parseFloat(rtoInfo.hypethecationCharges) || 0;
    const fastag = parseFloat(rtoInfo.fastag) || 0;
    const others = parseFloat(rtoInfo.others) || 0;

    let rtoCharges = Math.ceil((rtoPercentage * basePrice) / 100);
    if (
      normalizedFuelType.toLowerCase() === "electric" ||
      rtoPercentage === "0"
    ) {
      rtoCharges += parseInt(rtoInfo.amount || "0");
    }

    const roadSafetyTax = Math.ceil((rtoCharges * 2) / 100);
    const insuranceCharges = Math.ceil((insurancePercentage * basePrice) / 100);
    const luxuryTax = basePrice > 999999 ? Math.ceil(basePrice / 100) : 0;

    const totalCharges =
      rtoCharges +
      roadSafetyTax +
      insuranceCharges +
      luxuryTax +
      hypethecationCharges +
      fastag +
      others;

    return basePrice + totalCharges;
  };

  const formatCurrency = (value) => {
    if (value >= 1e7) {
      return `₹ ${(value / 1e7).toFixed(2)} Cr`;
    } else if (value >= 1e5) {
      return `₹ ${(value / 1e5).toFixed(2)} Lakh`;
    } else {
      return new Intl.NumberFormat("en-IN").format(value);
    }
  };

  const fetchRTOData = async () => {
    const locationState = localStorage.getItem("location");
    const parsedLocationState = JSON.parse(locationState);

    if (!parsedLocationState || !parsedLocationState.state) {
      return;
    }

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/v1/onroad-procing-for-website-landingpage`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ state: parsedLocationState.state }),
        }
      );

      const result = await response.json();
      setRtoData(result.data);
    } catch (error) {
      console.error("Error fetching RTO data:", error);
    }
  };

  useEffect(() => {
    fetchRTOData();
  }, []);

  useEffect(() => {
    const fetchInitialCars = async () => {
      const fetchedCars = [];

      try {
        if (Car1) {
          const responseCar1 = await fetch(
            `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${Car1}`
          );
          const dataCar1 = await responseCar1.json();
          fetchedCars.push({
            product: dataCar1.data.product_id,
            variant: dataCar1.data,
          });
        }

        if (Car2) {
          const responseCar2 = await fetch(
            `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${Car2}`
          );
          const dataCar2 = await responseCar2.json();
          fetchedCars.push({
            product: dataCar2.data.product_id,
            variant: dataCar2.data,
          });
        }

        setSelectedCars(fetchedCars.slice(0, 4));
      } catch (error) {
        console.error("Error fetching initial cars:", error);
      }
    };

    fetchInitialCars();
  }, [Car1, Car2]);

  const handleVariantSelect = async (variant) => {
    setShowPopup(false);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${variant._id}`
      );
      const data = await response.json();
      const newCar = {
        product: data.data.product_id,
        variant: data.data,
      };

      setSelectedCars((prevCars) => {
        if (carIndexToReplace !== null) {
          const updatedCars = [...prevCars];
          updatedCars[carIndexToReplace] = newCar;
          return updatedCars;
        }

        if (prevCars.length >= 4) {
          console.error("Cannot add more than 4 cars.");
          return prevCars;
        }

        return [...prevCars, newCar];
      });

      setVariantData(data.data);
    } catch (error) {
      console.error("Error fetching variant data:", error);
    }
  };

  const handleRemoveCar = (index) => {
    const updatedCars = [...selectedCars];
    updatedCars.splice(index, 1);
    setSelectedCars(updatedCars);
  };

  const handleViewPriceBreakup = (carIndex) => {
    setCarIndexToReplace(carIndex);
    setShowPopup(true);
  };

  const handleAddCar = () => {
    if (selectedCars.length >= 4) {
      console.error("Maximum of 4 cars allowed.");
      return;
    }

    setCarIndexToReplace(null);
    setShowPopup(true);
  };

  const handleClosePopup = () => {
    setShowPopup(false);
  };

  const handleLeftClick = () => {
    if (sectionContainerRef.current) {
      sectionContainerRef.current.scrollBy({ left: -270, behavior: "smooth" });
    }
  };

  const handleRightClick = () => {
    if (sectionContainerRef.current) {
      sectionContainerRef.current.scrollBy({ left: 270, behavior: "smooth" });
    }
  };

  const sections = [
    { key: "comfort", label: "COMFORT & CONVENIENCE" },
    { key: "safety", label: "SAFETY" },
    { key: "entertainment", label: "ENTERTAINMENT & CONNECTIVITY" },
    { key: "engine", label: "ENGINE & TRANSMISSION" },
    { key: "seating_comfort", label: "SEATING COMFORT" },
    { key: "exteriors", label: "EXTERIORS" },
    { key: "dimensions", label: "DIMENSIONS" },
    { key: "tyre_suspension", label: "TYRE & SUSPENSION" },
    { key: "storage", label: "STORAGE" },
  ];

  const sectionData = {
    comfort: [
      { label: "Ventilated Seats", valueKey: "Ventilated_Seats" },
      { label: "Air Purifier", valueKey: "Air_Purifier" },
      { label: "Cruise Control", valueKey: "Cruise_Control" },
      { label: "Rain Sensing Wipers", valueKey: "Rain_Sensing_Wipers" },
      { label: "Sunroof", valueKey: "sunroof" },
      { label: "Automatic Headlamp", valueKey: "automaticHeadLamp" },
      {
        label: "Follow Me Home Headlights",
        valueKey: "Follow_Me_Home_Headlights",
      },
      { label: "Keyless Entry", valueKey: "keyLess_Entry" },
      { label: "Ignition", valueKey: "ignition" },
      { label: "Ambient Lighting", valueKey: "Ambient_Lighting" },
      { label: "Steering Adjustment", valueKey: "Steering_Adjustment" },
      { label: "Air Conditioning", valueKey: "Air_Conditioning" },
      { label: "Climate Zones", valueKey: "Climate_Zones" },
      { label: "Rear A/C Vents", valueKey: "rearACvent" },
      { label: "Front Armrest", valueKey: "frontArmrest" },
      { label: "Rear Armrest", valueKey: "rearArmrest" },
      { label: "Inside rear view mirror (IRVM)", valueKey: "IVRM" },
      { label: "Outside rear view mirrors (ORVM)", valueKey: "OVRM" },
      {
        label: "Steering Mounted Controls",
        valueKey: "Steering_Mounted_Controls",
      },
      {
        label: "Rear Windshield Defogger",
        valueKey: "Rear_Windshield_Defogger",
      },
      {
        label: "Front Windshield Defogger",
        valueKey: "Front_Windshield_Defogger",
      },
      { label: "Cooled Glovebox", valueKey: "Cooled_Glovebox" },
    ],
    safety: [
      { label: "Global NCAP Rating", valueKey: "Global_NCAP_Rating" },
      { label: "Airbags", valueKey: "airbags" },
      { label: "Airbags Location", valueKey: "airbagLocation" },
      { label: "ADAS", valueKey: "ADAS" },
      { label: "ADAS Features", valueKey: "ADAS_Features" },
      { label: "Reverse Camera", valueKey: "Reverse_Camera" },
      {
        label: "Reverse Camera Guidelines",
        valueKey: "Reverse_Camera_Guidelines",
      },
      { label: "Tyre Pressure Monitor (TPMS)", valueKey: "TMPS" },
      { label: "Hill Hold Assist", valueKey: "Hill_Hold_Assist" },
      { label: "Hill Descent Control", valueKey: "Hill_Descent_Control" },
      { label: "Roll Over Mitigation", valueKey: "Roll_Over_Mitigation" },
      { label: "Disc Brakes", valueKey: "Disc_Brakes" },
      { label: "Electronic Stability Program (ESP)", valueKey: "ESP" },
      { label: "ABS", valueKey: "ABS" },
      { label: "Electronic Brakeforce Distribution (EBD)", valueKey: "EBD" },
      { label: "Brake Assist (BA)", valueKey: "Brake_assist" },
      { label: "ISOFIX Mounts", valueKey: "ISOFIX_Mounts" },
      {
        label: "Driver & Co-Driver Seatbelt Warning",
        valueKey: "Driver_CoDriver_Seatbelt_Warning",
      },
      { label: "High Speed Alert System", valueKey: "High_speed_Alert_System" },
      {
        label: "Speed Sensing Door Locks",
        valueKey: "Speed_Sensing_Door_Locks",
      },
      { label: "Immobiliser", valueKey: "Immobiliser" },
      { label: "Parking Sensor", valueKey: "Parking_Sensor" },
    ],
    entertainment: [
      {
        label: "Touch Screen Infotainment",
        valueKey: "Touch_Screen_Infotainment",
      },
      { label: "Android & Apple Carplay", valueKey: "Android_Apple_Carplay" },
      { label: "Speakers", valueKey: "Speakers" },
      { label: "Tweeters", valueKey: "tweeters" },
      { label: "Subwoofers", valueKey: "subWoofers" },
      { label: "USB-C Charging Ports", valueKey: "USB_C_PORT" },
      { label: "5A Charging Ports", valueKey: "FiveAmpiearchargingport" },
      { label: "12V Charging Ports", valueKey: "charging12V_Port" },
      { label: "Wireless Charging", valueKey: "wireless_Charging" },
      { label: "Connected Car Tech", valueKey: "connectedCarTech" },
    ],
    engine: [
      { label: "Engine Name", valueKey: "engine_Name" },
      { label: "Engine Capacity", valueKey: "Engine_Capacity" },
      { label: "Fuel", valueKey: "fuel" },
      { label: "Transmission", valueKey: "transmission_2" },
      { label: "No of Gears", valueKey: "number_of_Gears" },
      { label: "Paddle Shifter", valueKey: "paddle_shifter" },
      { label: "Max Power", valueKey: "max_power" },
      { label: "Torque", valueKey: "torque" },
      { label: "0 to 100 Kmph Time", valueKey: "speed_0_to_100" },
      { label: "Top Speed (Km/h)", valueKey: "top_speed" },
      { label: "EV Battery Capacity (kWh)", valueKey: "EV_Battry_capacity" },
      { label: "Hybrid Battery Capacity (kWh)", valueKey: "Hybrid_Capacity" },
      { label: "Battery Type", valueKey: "Battery_type" },
      {
        label: "Electric Motor Placement",
        valueKey: "Electric_Motor_placement",
      },
      { label: "EV Range", valueKey: "EV_Range" },
      { label: "EV Charging Time", valueKey: "EV_Charging_time" },
      {
        label: "Max Electric Motor Power",
        valueKey: "Max_Electric_Motor_Power",
      },
      { label: "Turbo Charged", valueKey: "Turbo_Charged" },
      { label: "Hybrid Type", valueKey: "Hybrid_Type" },
      { label: "Drive Train", valueKey: "driveTrain" },
      { label: "Driving Modes", valueKey: "Driving_Modes" },
      { label: "Off Road Modes", valueKey: "offRoadModes" },
      { label: "Differential Lock Type", valueKey: "Differential_Lock_Type" },
      {
        label: "Limited Slip Differential",
        valueKey: "Limited_Slip_Differential",
      },
    ],
    seating_comfort: [
      { label: "Seat Upholstery", valueKey: "Seat_Upholstery" },
      { label: "Seats Adjustment", valueKey: "Seats_Adjustment" },
      { label: "Driver Seat Adjustment", valueKey: "Driver_Seat_Adjustment" },
      {
        label: "Passenger Seat Adjustment",
        valueKey: "Passenger_Seat_Adjustment",
      },
      { label: "Rear Seat Adjustment", valueKey: "Rear_Seat_Adjustment" },
      { label: "Welcome Seats", valueKey: "Welcome_Seats" },
      { label: "Memory Seats", valueKey: "Memory_Seats" },
      { label: "Roof Rails", valueKey: "Roof_rails" },
      { label: "Fog Lights", valueKey: "Fog_lights" },
    ],
    exteriors: [
      { label: "Head Lights", valueKey: "headLight" },
      { label: "Tail Light", valueKey: "tailLight" },
      { label: "Radio Antenna", valueKey: "radioAntina" },
      {
        label: "Outside Rear View Mirror (ORVM) Colour",
        valueKey: "OVRMColor",
      },
      { label: "Daytime Running Lights (DRL's)", valueKey: "DRL" },
      { label: "Side Indicator", valueKey: "sideIndicator" },
      {
        label: "Rear Windshield Wiper With Washer",
        valueKey: "rear_windsheeld_wiper",
      },
    ],
    dimensions: [
      { label: "Ground Clearance", valueKey: "Ground_Clearance" },
      { label: "Length", valueKey: "Length" },
      { label: "Width", valueKey: "Weidth" },
      { label: "Height", valueKey: "Height" },
      { label: "Wheelbase", valueKey: "wheelBase" },
      { label: "Turning Radius", valueKey: "turningRadious" },
      { label: "Kerb Weight", valueKey: "Kerb_Weight" },
    ],
    tyre_suspension: [
      { label: "Front Tyre Profile", valueKey: "Front_Tyre_Profile" },
      { label: "Rear Tyre Profile", valueKey: "Rear_Tyre_Profile" },
      { label: "Spare Tyre Profile", valueKey: "Spare_Tyre_Profile" },
      { label: "Front Suspension", valueKey: "Front_Suspension" },
      { label: "Rear Suspension", valueKey: "Rear_Suspension" },
      { label: "Spare Wheel", valueKey: "Spare_wheel" },
    ],
    storage: [
      { label: "Cupholders", valueKey: "Cupholders" },
      { label: "Fuel Tank Capacity", valueKey: "Fuel_Tank_Capacity" },
      { label: "Boot Space", valueKey: "boot_Space" },
      {
        label: "Boot Space after folding last row seats",
        valueKey: "Boot_Space_after",
      },
    ],
  };

  const renderSectionDetails = (sectionKey) => {
    if (
      !sectionKey ||
      !sectionData[sectionKey] ||
      sectionData[sectionKey].length === 0
    ) {
      return null;
    }

    const itemsToShow = showMore
      ? sectionData[sectionKey]
      : sectionData[sectionKey].slice(0, 10);

    return (
      <>
        {itemsToShow.map((item, index) => {
          const value =
            variantData?.[item.valueKey] ??
            singlecardData?.data?.[item.valueKey];
          const displayValue = value && value !== "N/A" ? value : "N/A";

          return (
            <div
              key={index}
              className="thecenterofcard d-flex align-items-center gap-2 mr-22"
            >
              <div className="comparooo">
                {item.label}
                <div
                  className="thresult"
                  dangerouslySetInnerHTML={{ __html: displayValue }}
                />
              </div>
              <span className="thevsafterthat">vs</span>
            </div>
          );
        })}
      </>
    );
  };

  const renderSectionButtons = () => {
    const grayShades = ["#5D5C5A", "#828282", "#AFACAD"]; // gray-400, 500, 600 equivalents

    return sections.map((section, index) => {
      const shadeIndex = index % 3;
      const bgColor = grayShades[shadeIndex];

      return (
        <div
          key={section.key}
          style={{
            clipPath: "polygon(0 0, 94% 0, 100% 100%, 6% 100%)",
            backgroundColor: bgColor,
          }}
          className={`techoch flex justify-center items-center text-center text-white text-[13px] h-[40px] px-4 -mr-[20px] ${
            activeSection === section.key ? "open" : ""
          }`}
          onClick={() => setActiveSection(section.key)}
        >
          <span className="text-[13px]  ">{section.label}</span>
        </div>
      );
    });
  };

  return (
    <section>
      <section>
        <div className="label">
          <p className="FIND-YOUR-INFO mt-5 brand">
            <span className="text-wrapper">COMPARE </span>
            <span className="text-wrapper-2">CARS</span>
          </p>
        </div>
      </section>

      <section className="d-flex flex-column justify-content-center thetopper">
        <div className="car-options-container d-flex gap-2 align-items-center justify-content-center themoblecomp">
          {Array(4)
            .fill(null)
            .map((_, carIndex) => (
              <>
                <div
                  key={carIndex}
                  className="card-car-full-product-info card-car-full-proftr-info"
                >
                  {selectedCars[carIndex] ? (
                    <div className="inside_card inside_card-22 w-full">
                      <div
                        className="thexbuton -ml-6"
                        onClick={() => handleRemoveCar(carIndex)}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          xmlnsXlink="http://www.w3.org/1999/xlink"
                          version="1.1"
                          width="15"
                          height="15"
                          viewBox="0 0 256 256"
                          xmlSpace="preserve"
                        >
                          <defs></defs>
                          <g
                            style={{
                              stroke: "none",
                              strokeWidth: 0,
                              strokeDasharray: "none",
                              strokeLinecap: "butt",
                              strokeLinejoin: "miter",
                              strokeMiterlimit: 10,
                              fill: "none",
                              fillRule: "nonzero",
                              opacity: 1,
                            }}
                            transform="translate(1.4065934065934016 1.4065934065934016) scale(2.81 2.81)"
                          >
                            <path
                              d="M 13.4 88.492 L 1.508 76.6 c -2.011 -2.011 -2.011 -5.271 0 -7.282 L 69.318 1.508 c 2.011 -2.011 5.271 -2.011 7.282 0 L 88.492 13.4 c 2.011 2.011 2.011 5.271 0 7.282 L 20.682 88.492 C 18.671 90.503 15.411 90.503 13.4 88.492 z"
                              style={{
                                stroke: "none",
                                strokeWidth: 1,
                                strokeDasharray: "none",
                                strokeLinecap: "butt",
                                strokeLinejoin: "miter",
                                strokeMiterlimit: 10,
                                fill: "rgb(236,0,0)",
                                fillRule: "nonzero",
                                opacity: 1,
                              }}
                              transform="matrix(1 0 0 1 0 0)"
                              strokeLinecap="round"
                            />
                            <path
                              d="M 69.318 88.492 L 1.508 20.682 c -2.011 -2.011 -2.011 -5.271 0 -7.282 L 13.4 1.508 c 2.011 -2.011 5.271 -2.011 7.282 0 l 67.809 67.809 c 2.011 2.011 2.011 5.271 0 7.282 L 76.6 88.492 C 74.589 90.503 71.329 90.503 69.318 88.492 z"
                              style={{
                                stroke: "none",
                                strokeWidth: 1,
                                strokeDasharray: "none",
                                strokeLinecap: "butt",
                                strokeLinejoin: "miter",
                                strokeMiterlimit: 10,
                                fill: "rgb(236,0,0)",
                                fillRule: "nonzero",
                                opacity: 1,
                              }}
                              transform="matrix(1 0 0 1 0 0)"
                              strokeLinecap="round"
                            />
                          </g>
                        </svg>
                      </div>
                      <div
                        className="inside_card_title"
                        style={{ marginTop: "0px" }}
                      >
                        {selectedCars[carIndex]?.variant?.brand_id?.name || ""}
                        &nbsp;
                        <span>
                          {selectedCars[carIndex].product.carname}{" "}
                          {selectedCars[carIndex].variant.varientName}
                        </span>
                      </div>
                      <img
                        className="main_card_image"
                        src={`${process.env.NEXT_PUBLIC_API}/productImages/${selectedCars[carIndex].product.heroimage}`}
                        crossOrigin="anonymous"
                      />
                      <section className="info_card">
                        <div
                          className="info_card_variants"
                          style={{ visibility: "hidden" }}
                        >
                          Variants{" "}
                          <span style={{ color: "var(--red)" }}>cavt</span>
                        </div>
                        <div
                          style={{ color: "#B1081A", fontWeight: "600" }}
                          className="flex space-x-14"
                        >
                          <span className="">
                            {isLoadingb ? (
                              <Skeleton width={100} height={20} />
                            ) : (
                              formatCurrency(
                                calculateOnRoadPrice(
                                  selectedCars[carIndex].variant
                                    .exShowroomPrice,
                                  selectedCars[carIndex].variant.fuel
                                )
                              )
                            )}
                          </span>
                          <button
                            className="changecar-product active"
                            onClick={() => handleViewPriceBreakup(carIndex)}
                          >
                            Change car
                          </button>
                        </div>
                      </section>
                    </div>
                  ) : (
                    <div className="theplusbothn" onClick={handleAddCar}>
                      <svg
                        width="33"
                        height="33"
                        viewBox="0 0 33 33"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <g clip-path="url(#clip0_5070_100564)">
                          <path
                            d="M16.334 0.425232C7.49748 0.425232 0.333984 7.58873 0.333984 16.4252C0.333984 25.2622 7.49748 32.4252 16.334 32.4252C25.171 32.4252 32.334 25.2622 32.334 16.4252C32.334 7.58873 25.171 0.425232 16.334 0.425232ZM16.334 30.4567C8.61448 30.4567 2.33398 24.1447 2.33398 16.4252C2.33398 8.70567 8.61448 2.42517 16.334 2.42517C24.0535 2.42517 30.334 8.7057 30.334 16.4252C30.334 24.1446 24.0535 30.4567 16.334 30.4567ZM23.334 15.4252H17.334V9.42523C17.334 8.87323 16.886 8.42523 16.334 8.42523C15.782 8.42523 15.334 8.87323 15.334 9.42523V15.4252H9.33398C8.78198 15.4252 8.33398 15.8732 8.33398 16.4252C8.33398 16.9772 8.78198 17.4252 9.33398 17.4252H15.334V23.4252C15.334 23.9772 15.782 24.4252 16.334 24.4252C16.886 24.4252 17.334 23.9772 17.334 23.4252V17.4252H23.334C23.886 17.4252 24.334 16.9772 24.334 16.4252C24.334 15.8732 23.886 15.4252 23.334 15.4252Z"
                            fill="#040404"
                          />
                        </g>
                        <defs>
                          <clipPath id="clip0_5070_100564">
                            <rect
                              width="32"
                              height="32"
                              fill="white"
                              transform="translate(0.333984 0.425232)"
                            />
                          </clipPath>
                        </defs>
                      </svg>
                    </div>
                  )}
                </div>
                <span className="thevsafterthat">vs</span>
              </>
            ))}
        </div>
        {selectedCars && selectedCars.some((car) => car) && (
          <section className="themoblecompkey">
            <div className="d-flex flex-column justify-content-start align-items-center w-100 overflow-hidden">
              <div className="d-flex justify-content-center align-items-center overflow-auto mt-2">
                <button className="slider_btn" onClick={handleLeftClick}>
                  <ion-icon name="chevron-back-outline"></ion-icon>
                </button>

                <div
                  className="theconical overflow-auto"
                  ref={sectionContainerRef}
                >
                  <div className="d-flex flex-row rftgjetdgjhjkrf">
                    {renderSectionButtons()}
                  </div>
                </div>

                <button className="slider_btn" onClick={handleRightClick}>
                  <ion-icon name="chevron-forward-outline"></ion-icon>
                </button>
              </div>

              <div className="d-flex thevssection theconical-2">
                {selectedCars.map((car, carIndex) =>
                  car ? (
                    <div key={carIndex} className="car-details-container">
                      {renderSectionDetails(activeSection, car)}
                    </div>
                  ) : null
                )}
              </div>
              {sectionData[activeSection]?.length > 10 && (
                <div
                  className="show-more-iv"
                  onClick={() => setShowMore((prev) => !prev)}
                >
                  {showMore ? "Show Less" : "Show More"}
                </div>
              )}
            </div>
          </section>
        )}

        {showPopup && (
          <ChangeCarPopup
            onClose={handleClosePopup}
            onVariantSelect={handleVariantSelect}
          />
        )}
      </section>
    </section>
  );
};

export default Compero;
