import React, { useState, useEffect, forwardRef } from "react";
import { useParams } from "react-router-dom";

const Technicalspec = (porps, ref) => {
  const [singlecardData, setSingleCardData] = useState({});
  const [activeSection, setActiveSection] = useState("comfort");
  const params = useParams();
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${params.id}`
        );
        const data = await response.json();
        setSingleCardData(data);
      } catch (error) {
        // console.error('Error fetching data:', error);
      }
    };

    fetchData();
  }, [params.id]);

  // Helper function to convert HTML lists to plain text
  const convertHtmlListToText = (htmlString) => {
    if (!htmlString || typeof htmlString !== "string") return htmlString;

    // Create a temporary DOM element to parse HTML
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    // Check if it contains list elements
    const listItems = tempDiv.querySelectorAll("li");
    if (listItems.length > 0) {
      // Extract text from list items and join with commas
      const textItems = Array.from(listItems).map((li) =>
        li.textContent.trim()
      );
      return textItems.join(", ");
    }

    // If no list items, return plain text content
    return tempDiv.textContent || tempDiv.innerText || htmlString;
  };

  // Helper function to format values with appropriate units
  const formatValueWithUnit = (valueKey, value) => {
    if (!value || value === "N/A") return value;

    // First convert HTML lists to plain text
    const cleanValue = convertHtmlListToText(value);

    const unitMap = {
      // Engine & Performance
      Engine_Capacity: { unit: "L", format: (v) => `${v} CC` },
      max_power: { unit: "bhp", format: (v) => `${v} bhp` },
      torque: { unit: "Nm", format: (v) => `${v} Nm` },
      speed_0_to_100: { unit: "seconds", format: (v) => `${v} seconds` },
      top_speed: { unit: "km/h", format: (v) => `${v} km/h` },
      EV_Battry_capacity: { unit: "kWh", format: (v) => `${v} kWh` },
      Hybrid_Capacity: { unit: "kWh", format: (v) => `${v} kWh` },
      EV_Range: { unit: "km", format: (v) => `${v} km` },
      EV_Charging_time: { unit: "hours", format: (v) => `${v} hours` },
      Max_Electric_Motor_Power: { unit: "kW", format: (v) => `${v} kW` },

      // Dimensions
      Ground_Clearance: { unit: "mm", format: (v) => `${v} mm` },
      Length: { unit: "mm", format: (v) => `${v} mm` },
      Weidth: { unit: "mm", format: (v) => `${v} mm` },
      Height: { unit: "mm", format: (v) => `${v} mm` },
      wheelBase: { unit: "mm", format: (v) => `${v} mm` },
      turningRadious: { unit: "m", format: (v) => `${v} m` },
      Kerb_Weight: { unit: "kg", format: (v) => `${v} kg` },

      // Storage & Capacity
      Fuel_Tank_Capacity: { unit: "litres", format: (v) => `${v} litres` },
      boot_Space: { unit: "litres", format: (v) => `${v} litres` },
      Boot_Space_after: { unit: "litres", format: (v) => `${v} litres` },

      // Tyre Profiles (already have units like 215/60 R16)
      Front_Tyre_Profile: { unit: "", format: (v) => v },
      Rear_Tyre_Profile: { unit: "", format: (v) => v },
      Spare_Tyre_Profile: { unit: "", format: (v) => v },

      // Infotainment Screen
      Touch_Screen_Infotainment: {
        unit: "",
        format: (v) => {
          // If it's a number, add inch unit
          if (/^\d+(\.\d+)?$/.test(v)) {
            return `${v} inch`;
          }
          return v;
        },
      },

      // Speakers count
      Speakers: {
        unit: "",
        format: (v) => {
          if (/^\d+$/.test(v)) {
            return `${v} speakers`;
          }
          return v;
        },
      },
      tweeters: {
        unit: "",
        format: (v) => {
          if (/^\d+$/.test(v)) {
            return `${v} tweeters`;
          }
          return v;
        },
      },
      subWoofers: {
        unit: "",
        format: (v) => {
          if (/^\d+$/.test(v)) {
            return `${v} subwoofers`;
          }
          return v;
        },
      },

      // Airbags count
      airbags: {
        unit: "",
        format: (v) => {
          if (/^\d+$/.test(v)) {
            return `${v} airbags`;
          }
          return v;
        },
      },

      // Cupholders count
      Cupholders: {
        unit: "",
        format: (v) => {
          if (/^\d+$/.test(v)) {
            return `${v} cupholders`;
          }
          return v;
        },
      },

      // Gears count
      number_of_Gears: {
        unit: "",
        format: (v) => {
          if (/^\d+$/.test(v)) {
            return `${v} Speed.`;
          }
          return v;
        },
      },

      // Climate zones
      Climate_Zones: {
        unit: "",
        format: (v) => {
          if (/^\d+$/.test(v)) {
            return `${v} zone${v > 1 ? "s" : ""}`;
          }
          return v;
        },
      },

      // Charging ports
      USB_C_PORT: {
        unit: "",
        format: (v) => {
          if (/^\d+$/.test(v)) {
            return `${v} port${v > 1 ? "s" : ""}`;
          }
          return v;
        },
      },
      FiveAmpiearchargingport: {
        unit: "",
        format: (v) => {
          if (/^\d+$/.test(v)) {
            return `${v} port${v > 1 ? "s" : ""}`;
          }
          return v;
        },
      },
      charging12V_Port: {
        unit: "",
        format: (v) => {
          if (/^\d+$/.test(v)) {
            return `${v} port${v > 1 ? "s" : ""}`;
          }
          return v;
        },
      },
    };

    const unitConfig = unitMap[valueKey];
    if (unitConfig) {
      return unitConfig.format(cleanValue);
    }

    return cleanValue;
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
      { label: "Transmission", valueKey: "transmission" },
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

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSectionToggle = (sectionKey) => {
    setActiveSection((prev) => (prev === sectionKey ? "" : sectionKey));
  };

  // Helper function to get key specifications to display in the preview
  const getKeySpecifications = (sectionKey) => {
    const keySpecs = {
      comfort: ["Ventilated_Seats", "sunroof"],
      safety: ["Global_NCAP_Rating", "airbags"],
      entertainment: ["Touch_Screen_Infotainment", "Android_Apple_Carplay"],
      engine: ["engine_Name", "fuel"],
      seating_comfort: ["Seat_Upholstery", "Seats_Adjustment"],
      exteriors: ["headLight", "tailLight"],
      dimensions: ["Ground_Clearance", "Length"],
      tyre_suspension: ["Front_Tyre_Profile", "Rear_Tyre_Profile"],
      storage: ["Cupholders", "Fuel_Tank_Capacity"],
    };

    const result = {};

    if (keySpecs[sectionKey] && keySpecs[sectionKey].length > 0) {
      keySpecs[sectionKey].forEach((key) => {
        const item = sectionData[sectionKey].find(
          (item) => item.valueKey === key
        );
        if (item) {
          const rawValue = singlecardData?.data?.[key] || "N/A";
          result[item.label] = formatValueWithUnit(key, rawValue);
        }
      });
    }

    return result;
  };

  const renderSectionDetails = (sectionKey) => {
    if (
      !sectionKey ||
      !sectionData[sectionKey] ||
      sectionData[sectionKey].length === 0
    ) {
      return null;
    }

    return sectionData[sectionKey].map((item, index) => {
      const rawValue = singlecardData?.data?.[item.valueKey];
      if (rawValue && rawValue !== "N/A") {
        const formattedValue = formatValueWithUnit(item.valueKey, rawValue);
        return (
          <div key={index} className="faq-item">
            <div className="flex justify-between items-start gap-3 w-full">
              <span className="flex-shrink-0">• {item.label}</span>
              <div
                className="text-black text-right break-words max-w-[200px] md:max-w-[250px]"
                title={formattedValue} // Tooltip to show full text on hover
              >
                {formattedValue}
              </div>
            </div>
            <hr className="dotterr" />
          </div>
        );
      }
      return null;
    });
  };

  const renderSectionButtons = () => {
    return sections.map((section) => (
      <button
        key={section.key}
        className={`specificbuttonv faq-header text-dark ${
          activeSection === section.key ? "open" : ""
        }`}
        onClick={() => handleSectionToggle(section.key)}
      >
        {section.label}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="16"
          height="16"
          viewBox="0 0 16 16"
          fill="none"
        >
          <path
            d="M8.78264 8.00048L5.48264 4.70048L6.4253 3.75781L10.668 8.00048L6.4253 12.2431L5.48264 11.2998L8.78264 7.99981V8.00048Z"
            fill="#B1081A"
          ></path>
        </svg>
      </button>
    ));
  };

  return (
    <>
      <section>
        <div className="label">
          <p className="FIND-YOUR-PERFECT brand .spec-section mt-3 lefttext-mob">
            <span className="text-wrapper">TECHNICAL</span>
            <span className="span">&nbsp;</span>
            <span className="text-wrapper-2">SPECIFICATIONS</span>
          </p>
        </div>
      </section>

      {isMobile ? (
        <section className="px-2 py-1 bg-gray-100" ref={ref}>
          <div className="flex flex-col space-y-2">
            {sections.map((section) => {
              const keySpecs = getKeySpecifications(section.key);
              const keySpecEntries = Object.entries(keySpecs);
              const allItems = sectionData[section.key];
              const remainingItems = allItems.filter(
                (item) =>
                  !keySpecEntries.some(([label]) => label === item.label)
              );

              return (
                <div
                  key={section.key}
                  className="bg-white rounded shadow mb-2 overflow-hidden"
                >
                  <div className="p-4 ">
                    <h4 className="text-[14px] font-sans font-bold text-black uppercase mb-2">
                      {section.label}
                    </h4>

                    {/* Always show first two key specs */}
                    {keySpecEntries.length > 0 && (
                      <div className="mt-8 ">
                        {keySpecEntries
                          .slice(0, 2)
                          .map(([label, value], idx) => (
                            <div key={idx} className="faq-item">
                              <div className="flex justify-between items-start py-2 maintextundercardest">
                                <div className="flex-1 pr-4 break-words">
                                  • {label}
                                </div>
                                <div className="flex-shrink-0 text-right break-words max-w-[50%] text-black font-medium">
                                  {value}
                                </div>
                              </div>
                              <hr className="dotterr" />
                            </div>
                          ))}
                      </div>
                    )}
                  </div>

                  {/* Show remaining items when expanded */}
                  {activeSection === section.key &&
                    remainingItems.length > 0 && (
                      <div className=" -mt-8 p-4">
                        {remainingItems.map((item, index) => {
                          const rawValue =
                            singlecardData?.data?.[item.valueKey];
                          if (rawValue && rawValue !== "N/A") {
                            const formattedValue = formatValueWithUnit(
                              item.valueKey,
                              rawValue
                            );
                            return (
                              <div key={index} className="faq-item">
                                <div className="flex justify-between items-start gap-2 w-full maintextundercardest">
                                  <span className=" ">• {item.label}</span>
                                  <div
                                    className="text-black break-words max-w-[50%] text-right"
                                    title={formattedValue}
                                  >
                                    {formattedValue}
                                  </div>
                                </div>
                                <hr className="dotterr" />
                              </div>
                            );
                          }
                          return null;
                        })}
                      </div>
                    )}

                  {remainingItems.length > 0 && (
                    <button
                      className="text-[12px] font-[Montserrat] font-bold text-right text-[#AB373A] px-3 py-2 w-full mt-2"
                      onClick={() => handleSectionToggle(section.key)}
                    >
                      {activeSection === section.key
                        ? "View Less"
                        : "View More"}
                    </button>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      ) : (
        <section>
          <div className="d-flex justify-content-center fdgjljfgkl">
            <div className="d-flex flex-column mainn blackkdse">
              {renderSectionButtons()}
            </div>
            <div className="maincontentsec">
              {renderSectionDetails(activeSection)}
            </div>
          </div>
        </section>
      )}
    </>
  );
};

export default forwardRef(Technicalspec);
