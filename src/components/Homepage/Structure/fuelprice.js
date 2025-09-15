// import React, { useState, useEffect } from "react";
// import { Search, X, ChevronDown, Locate } from "lucide-react";
// import Image from "next/image";

// const API_KEY = "a651f8322fmsh31b9418f911cfd4p1b34abjsn3a21242748da";
// const BASE_URL =
//   "https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1";

// const FuelPrice = () => {
//   const [states, setStates] = useState([]);
//   const [cities, setCities] = useState([]);
//   const [selectedState, setSelectedState] = useState("");
//   const [selectedCity, setSelectedCity] = useState("");
//   const [selectedFuel, setSelectedFuel] = useState("");
//   const [price, setPrice] = useState(null);

//   // City popup states
//   const [isSearching, setIsSearching] = useState(false);
//   const [searchTerm, setSearchTerm] = useState("");
//   const [filteredCities, setFilteredCities] = useState([]);
//   const [selectedCityName, setSelectedCityName] = useState("Choose City");

//   useEffect(() => {
//     const fetchStates = async () => {
//       try {
//         const response = await fetch(`${BASE_URL}/list/india/states`, {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "RapidAPI-Key": API_KEY,
//           },
//         });
//         if (!response.ok) throw new Error("Network response was not ok");
//         const data = await response.json();
//         setStates(data.states || []);
//       } catch (error) {
//         console.error("Error fetching states:", error);
//       }
//     };

//     fetchStates();

//     // Function to update state and city from localStorage
//     const updateLocationFromStorage = () => {
//       const locationString = localStorage.getItem("location");
//       const location = locationString ? JSON.parse(locationString) : null;
//       if (location) {
//         setSelectedState(location.state ? location.state.toLowerCase() : "");
//         setSelectedCity(location.city ? location.city.toLowerCase() : "");
//         return true;
//       }
//       return false;
//     };

//     // Check for location every 2 seconds
//     const locationInterval = setInterval(() => {
//       const found = updateLocationFromStorage();
//       if (found) {
//         clearInterval(locationInterval);
//       }
//     }, 2000);

//     return () => clearInterval(locationInterval);
//   }, []);

//   // Fetch cities when selectedState changes
//   useEffect(() => {
//     if (selectedState) {
//       const fetchCities = async () => {
//         try {
//           const response = await fetch(
//             `${BASE_URL}/list/india/${selectedState}/cities`,
//             {
//               method: "GET",
//               headers: {
//                 "Content-Type": "application/json",
//                 "RapidAPI-Key": API_KEY,
//               },
//             }
//           );
//           if (!response.ok) throw new Error("Network response was not ok");
//           const data = await response.json();
//           setCities(data.cities || []);
//           setFilteredCities(data.cities || []);

//           if (selectedCity && selectedFuel) {
//             fetchFuelPrice(selectedCity);
//           }
//         } catch (error) {
//           console.error("Error fetching cities:", error);
//         }
//       };

//       fetchCities();
//     }
//   }, [selectedState]);

//   // Update selected city name when selectedCity changes
//   useEffect(() => {
//     if (selectedCity) {
//       const city = cities.find((city) => city.cityId === selectedCity);
//       if (city) {
//         setSelectedCityName(city.cityName);
//       }
//     } else {
//       setSelectedCityName("Choose City");
//     }
//   }, [selectedCity, cities]);

//   // Fetch fuel price when selectedCity or selectedFuel changes
//   useEffect(() => {
//     if (selectedCity && selectedFuel) {
//       fetchFuelPrice(selectedCity);
//     }
//   }, [selectedCity, selectedFuel]);

//   const fetchFuelPrice = async (city) => {
//     try {
//       const response = await fetch(
//         `${BASE_URL}/fuel-prices/today/india/${selectedState}/${city}`,
//         {
//           method: "GET",
//           headers: {
//             "Content-Type": "application/json",
//             "RapidAPI-Key": API_KEY,
//           },
//         }
//       );
//       if (!response.ok) throw new Error("Network response was not ok");
//       const data = await response.json();
//       if (data.fuel && data.fuel[selectedFuel]) {
//         setPrice(data.fuel[selectedFuel].retailPrice);
//       } else {
//         setPrice(null);
//       }
//     } catch (error) {
//       console.error("Error fetching fuel price:", error);
//     }
//   };

//   const formatPrice = () => {
//     if (price === null) return null;

//     if (selectedFuel === "lpg") {
//       const pricePerKg = price / 14.2;
//       return `₹${pricePerKg.toFixed(2)}/KG`;
//     }

//     return `₹${price.toFixed(2)}/liter`;
//   };

//   // City popup functions
//   const handleSearch = (event) => {
//     const term = event.target.value;
//     setSearchTerm(term);
//     if (term) {
//       const filtered = cities.filter((city) =>
//         city.cityName.toLowerCase().includes(term.toLowerCase())
//       );
//       setFilteredCities(filtered);
//     } else {
//       setFilteredCities(cities);
//     }
//   };

//   const handleCityClick = (city) => {
//     setSelectedCity(city.cityId);
//     setSelectedCityName(city.cityName);
//     setIsSearching(false);
//     setSearchTerm("");
//     setPrice(null);
//   };

//   const handleSelectorClick = () => {
//     if (cities.length > 0) {
//       setIsSearching(true);
//     }
//   };

//   const closeModal = () => {
//     setIsSearching(false);
//     setSearchTerm("");
//   };

//   return (
//     <div className="relative w-full mb-[50px] overflow-hidden ">
//       <div className="max-x-[1400px] flex justify-center items-center flex-col  ">
//         {/* Header */}
//         <div className="">
//           <h1 className="text-[25px] font-bold  text-center mb-6 font-sans text-wrapper">
//             <span className="text-[#818181]"> TODAY'S </span>
//             <span className="text-[#B60C19]">FUEL</span>
//             <span className="text-[#818181]"> PRICES </span>
//           </h1>
//         </div>

//         {/* Main Content */}
//         <div className="">
//           {/* Dropdowns Section */}
//           <div className="flex flex-row gap-4 items-center">
//             {/* Hidden State Selector */}
//             <select
//               className="hidden"
//               id="state"
//               value={selectedState}
//               onChange={(e) => {
//                 setSelectedState(e.target.value);
//                 setSelectedCity("");
//                 setPrice(null);
//               }}
//             >
//               <option value="">Choose State</option>
//               {states.length > 0 ? (
//                 states.map((state) => (
//                   <option key={state.stateId} value={state.stateId}>
//                     {state.stateName}
//                   </option>
//                 ))
//               ) : (
//                 <option value="">No States Available</option>
//               )}
//             </select>

//             {/* City Selector */}
//             <div className="relative">
//               <div
//                 onClick={handleSelectorClick}
//                 className="w-[150px] md:w-64 h-12 bg-white border border-gray-300 rounded-md px-4 flex items-center justify-between cursor-pointer hover:border-gray-400 transition-colors"
//               >
//                 <span
//                   className={`text-sm ${
//                     selectedCity ? "text-gray-900" : "text-gray-500"
//                   }`}
//                 >
//                   {selectedCityName}
//                 </span>
//                 <ChevronDown size={20} className="text-gray-400" />
//               </div>

//               {/* City Search Modal */}
//               {isSearching && (
//                 <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
//                   <div className="w-full max-w-md bg-white rounded-lg overflow-hidden">
//                     <div className="flex items-center justify-between p-6 border-b border-gray-200">
//                       <h2 className="text-xl font-bold text-gray-600">
//                         SELECT YOUR <span className="text-red-600">CITY</span>
//                       </h2>
//                       <button
//                         onClick={closeModal}
//                         className="text-gray-400 hover:text-gray-600 transition-colors"
//                       >
//                         <X size={24} />
//                       </button>
//                     </div>

//                     <div className="p-6 border-b border-gray-200">
//                       <div className="relative">
//                         <input
//                           type="text"
//                           placeholder="Search city..."
//                           value={searchTerm}
//                           onChange={handleSearch}
//                           className="w-full h-10 border border-gray-300 px-4 pr-12 rounded text-gray-900 focus:outline-none focus:border-red-500"
//                         />
//                         <div className="absolute inset-y-0 right-0">
//                           <button className="bg-black text-white w-10 h-10 flex justify-center items-center rounded-r">
//                             <Search size={18} />
//                           </button>
//                         </div>
//                       </div>
//                     </div>

//                     <div className="p-6 border-b border-gray-200">
//                       <div className="text-xs font-medium text-red-600 mb-3 uppercase">
//                         Results
//                       </div>
//                       <button className="flex items-center text-red-600 hover:bg-red-50 p-2 rounded w-full transition-colors">
//                         <Locate size={18} className="mr-2" />
//                         <span className="text-sm">Detect Your Location</span>
//                       </button>
//                     </div>

//                     <div className="max-h-64 overflow-y-auto">
//                       {filteredCities.length > 0 ? (
//                         filteredCities.map((city) => (
//                           <div
//                             key={city.cityId}
//                             onClick={() => handleCityClick(city)}
//                             className="py-3 px-6 cursor-pointer hover:bg-gray-100 border-b border-gray-100 text-gray-900 transition-colors"
//                           >
//                             {city.cityName}
//                           </div>
//                         ))
//                       ) : (
//                         <div className="p-6 text-gray-500 text-center">
//                           No cities found
//                         </div>
//                       )}
//                     </div>
//                   </div>
//                 </div>
//               )}
//             </div>

//             {/* Fuel Type Selector */}
//             <div className="relative">
//               <select
//                 className="w-[150px] md:w-64 h-12 bg-white border border-gray-300 rounded-md px-4 text-sm text-gray-900 cursor-pointer hover:border-gray-400 transition-colors focus:outline-none focus:border-red-500 appearance-none"
//                 id="fuel"
//                 value={selectedFuel}
//                 onChange={(e) => setSelectedFuel(e.target.value)}
//               >
//                 <option value="" className="text-gray-500">
//                   Choose Fuel
//                 </option>
//                 <option value="petrol">Petrol</option>
//                 <option value="diesel">Diesel</option>
//                 <option value="lpg">LPG</option>
//                 <option value="cng">CNG</option>
//               </select>
//               <ChevronDown
//                 size={20}
//                 className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
//               />
//             </div>

//             <div className="flex items-center gap-6 hidden md:block ">
//               {price !== null && (
//                 <div className="text-red-800  px-6 py-4 rounded-md text-center ">
//                   <div className="text-lg font-bold">{formatPrice()}</div>
//                 </div>
//               )}
//             </div>

//             <span className="-mt-12 hidden md:block">
//               <Image
//                 src="/images/Bharat_Petroleum-Logo 1.png"
//                 alt="Motor Octane"
//                 width={80}
//                 height={80}
//               />
//             </span>
//           </div>

//           <div className="w-full flex justify-center items-center mt-4 block md:hidden">
//             {price !== null && (
//               <div className="text-red-800 rounded-md text-center min-w-[120px]">
//                 <div className="text-lg font-bold">{formatPrice()}</div>
//               </div>
//             )}
//           </div>

//           <div className="w-full flex justify-center items-center mt-4">
//             <span className="md:hidden block">
//               <Image
//                 src="/images/Bharat_Petroleum-Logo 1.png"
//                 alt="Motor Octane"
//                 width={80}
//                 height={80}
//               />
//             </span>
//           </div>

//           {/* Price Display */}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FuelPrice;

import React, { useState, useEffect } from "react";
import { Search, X, ChevronDown, Locate } from "lucide-react";
import Image from "next/image";
import cities from "../../Homepage/Structure/subcomponents/statelist.json"; // Import cities like in MyLocation component

const API_KEY = "a651f8322fmsh31b9418f911cfd4p1b34abjsn3a21242748da";
const BASE_URL =
  "https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1";

const FuelPrice = () => {
  const [selectedCity, setSelectedCity] = useState(null);
  const [selectedFuel, setSelectedFuel] = useState("");
  const [price, setPrice] = useState(null);

  // City popup states
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState(cities);
  const [selectedCityName, setSelectedCityName] = useState("Choose City");

  useEffect(() => {
    // Function to update city from localStorage
    const updateLocationFromStorage = () => {
      const locationString = localStorage.getItem("location");
      const location = locationString ? JSON.parse(locationString) : null;
      if (location) {
        // Find the city object that matches the stored location
        const cityObj = cities.find(
          (city) =>
            city.City.toLowerCase() === location.city.toLowerCase() &&
            city.State.toLowerCase() === location.state.toLowerCase()
        );
        if (cityObj) {
          setSelectedCity(cityObj);
          setSelectedCityName(`${cityObj.City}, ${cityObj.State}`);
        }
        return true;
      }
      return false;
    };

    // Check for location every 2 seconds
    const locationInterval = setInterval(() => {
      const found = updateLocationFromStorage();
      if (found) {
        clearInterval(locationInterval);
      }
    }, 2000);

    return () => clearInterval(locationInterval);
  }, []);

  // Fetch fuel price when selectedCity or selectedFuel changes
  useEffect(() => {
    if (selectedCity && selectedFuel) {
      fetchFuelPrice();
    }
  }, [selectedCity, selectedFuel]);

  const fetchFuelPrice = async () => {
    if (!selectedCity) return;

    try {
      // Convert state and city names to the format expected by the API
      const stateName = selectedCity.State.toLowerCase().replace(/\s+/g, "-");
      const cityName = selectedCity.City.toLowerCase().replace(/\s+/g, "-");

      const response = await fetch(
        `${BASE_URL}/fuel-prices/today/india/${stateName}/${cityName}`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "RapidAPI-Key": API_KEY,
          },
        }
      );
      if (!response.ok) throw new Error("Network response was not ok");
      const data = await response.json();
      if (data.fuel && data.fuel[selectedFuel]) {
        setPrice(data.fuel[selectedFuel].retailPrice);
      } else {
        setPrice(null);
      }
    } catch (error) {
      console.error("Error fetching fuel price:", error);
      setPrice(null);
    }
  };

  const formatPrice = () => {
    if (price === null) return null;

    if (selectedFuel === "lpg") {
      const pricePerKg = price / 14.2;
      return `₹${pricePerKg.toFixed(2)}/KG`;
    }

    return `₹${price.toFixed(2)}/liter`;
  };

  // City popup functions
  const handleSearch = (event) => {
    const term = event.target.value;
    setSearchTerm(term);
    if (term) {
      const filtered = cities.filter(
        (city) =>
          city.City.toLowerCase().includes(term.toLowerCase()) ||
          city.State.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  };

  const handleCityClick = (city) => {
    setSelectedCity(city);
    setSelectedCityName(`${city.City}, ${city.State}`);
    setIsSearching(false);
    setSearchTerm("");
    setPrice(null);

    // Update localStorage with new location
    const location = {
      city: city.City,
      state: city.State,
    };
    localStorage.setItem("location", JSON.stringify(location));
  };

  const handleSelectorClick = () => {
    setIsSearching(true);
  };

  const closeModal = () => {
    setIsSearching(false);
    setSearchTerm("");
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Find nearest city from coordinates
          const closestCity = findNearestCity(latitude, longitude, cities);

          if (closestCity) {
            handleCityClick(closestCity);
          }
        },
        (error) => {
          console.error("Geolocation error:", error);
          getLocationFromIP();
        }
      );
    } else {
      console.log("Geolocation is not available in your browser.");
      getLocationFromIP();
    }
  };

  const findNearestCity = (lat, lon, cities) => {
    let minDistance = Infinity;
    let closestCity = null;

    cities.forEach((city) => {
      const distance = getDistance(lat, lon, city.Lat, city.Long);
      if (distance < minDistance) {
        minDistance = distance;
        closestCity = city;
      }
    });

    return closestCity;
  };

  const getDistance = (lat1, lon1, lat2, lon2) => {
    const toRad = (x) => (x * Math.PI) / 180;
    const R = 6371;
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c;
  };

  const getLocationFromIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const ip = data.ip;

      const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      const locationData = await locationResponse.json();

      const { latitude, longitude } = locationData;

      const closestCity = findNearestCity(latitude, longitude, cities);
      if (closestCity) {
        handleCityClick(closestCity);
      }
    } catch (error) {
      console.error("Error fetching location data from IP:", error);
    }
  };

  return (
    <div className="relative w-full mb-[50px] overflow-hidden ">
      <div className="max-x-[1400px] flex justify-center items-center flex-col  ">
        {/* Header */}
        <div className="">
          <h1 className="text-[25px] font-bold  text-center mb-6 font-sans text-wrapper">
            <span className="text-[#818181]"> TODAY'S </span>
            <span className="text-[#B60C19]">FUEL</span>
            <span className="text-[#818181]"> PRICES </span>
          </h1>
        </div>

        {/* Main Content */}
        <div className="">
          {/* Dropdowns Section */}
          <div className="flex flex-row gap-4 items-center">
            {/* City Selector */}
            <div className="relative">
              <div
                onClick={handleSelectorClick}
                className="w-[150px] md:w-64 h-12 bg-white border border-gray-300 rounded-md px-4 flex items-center justify-between cursor-pointer hover:border-gray-400 transition-colors"
              >
                <span
                  className={`text-sm ${
                    selectedCity ? "text-gray-900" : "text-gray-500"
                  }`}
                >
                  {selectedCityName}
                </span>
                <ChevronDown size={20} className="text-gray-400" />
              </div>

              {/* City Search Modal - Same as MyLocation component */}
              {isSearching && (
                <div className="fixed inset-0 bg-black/30 shadow-2xl bg-opacity-80 flex items-center justify-center z-50">
                  <div className="location-step">
                    <div className="w-[346px] h-[400px] rounded-[10px] bg-white overflow-hidden">
                      {/* Fixed Header */}
                      <div className="flex items-center justify-between w-full p-[20px] pb-4 border-b border-gray-100">
                        <h2 className="text-[14px] font-semibold text-[#818181]">
                          SELECT YOUR{" "}
                          <span className="text-[#B10819]">CITY</span>
                        </h2>
                        <button
                          onClick={closeModal}
                          className="text-black hover:text-[#B10819] transition-colors"
                        >
                          <span className="text-2xl">
                            <X />
                          </span>
                        </button>
                      </div>

                      <div className="p-2 border-b border-gray-100 font-[Montserrat] font-medium">
                        <div className="relative">
                          <input
                            type="text"
                            placeholder="Search city..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="w-full h-[44px] border border-slate-300 px-4 pr-12 text-black rounded-md focus:outline-none focus:border-[#B10819] transition-colors"
                          />
                          <div className="absolute inset-y-0 right-0 flex justify-center items-center">
                            <button className="bg-black text-white w-[42px] h-[42px] flex justify-center items-center rounded-r-md hover:bg-gray-800 transition-colors">
                              <Search size={20} />
                            </button>
                          </div>
                        </div>
                      </div>

                      {/* Fixed Results Header and Detect Button */}
                      <div className="px-[20px] py-3 border-b border-gray-100 font-[Montserrat] font-medium">
                        <div className="text-[13px] font-medium text-[#B1081A] mb-3 font-[Montserrat]">
                          Results
                        </div>

                        <button
                          className="flex items-center text-[#B10819] hover:bg-red-50 p-2 rounded w-full"
                          onClick={detectLocation}
                        >
                          <Locate size={20} />
                          Detect Your Location
                        </button>
                      </div>

                      {/* Scrollable City List */}
                      <div
                        className="flex-1 overflow-y-auto px-[20px] font-[Montserrat] font-medium"
                        style={{ height: "calc(400px - 200px)" }}
                      >
                        {filteredCities.slice(0, 100).map((city, index) => (
                          <div
                            key={index}
                            onClick={() => handleCityClick(city)}
                            className="py-3 border-b border-gray-200 text-gray-800 cursor-pointer hover:bg-gray-50 -mx-[20px] px-[20px]"
                          >
                            {city.City}, {city.State}
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Fuel Type Selector */}
            <div className="relative">
              <select
                className="w-[150px] md:w-64 h-12 bg-white border border-gray-300 rounded-md px-4 text-sm text-gray-900 cursor-pointer hover:border-gray-400 transition-colors focus:outline-none focus:border-red-500 appearance-none"
                id="fuel"
                value={selectedFuel}
                onChange={(e) => setSelectedFuel(e.target.value)}
              >
                <option value="" className="text-gray-500">
                  Choose Fuel
                </option>
                <option value="petrol">Petrol</option>
                <option value="diesel">Diesel</option>
                <option value="lpg">LPG</option>
                <option value="cng">CNG</option>
              </select>
              <ChevronDown
                size={20}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none"
              />
            </div>

            <div className="flex items-center gap-6 hidden md:block ">
              {price !== null && (
                <div className="text-red-800  px-6 py-4 rounded-md text-center ">
                  <div className="text-lg font-bold">{formatPrice()}</div>
                </div>
              )}
            </div>

            <span className="-mt-12 hidden md:block">
              <Image
                src="/images/Bharat_Petroleum-Logo 1.png"
                alt="Motor Octane"
                width={80}
                height={80}
              />
            </span>
          </div>

          <div className="w-full flex justify-center items-center mt-4 block md:hidden">
            {price !== null && (
              <div className="text-red-800 rounded-md text-center min-w-[120px]">
                <div className="text-lg font-bold">{formatPrice()}</div>
              </div>
            )}
          </div>

          <div className="w-full flex justify-center items-center mt-4">
            <span className="md:hidden block">
              <Image
                src="/images/Bharat_Petroleum-Logo 1.png"
                alt="Motor Octane"
                width={80}
                height={80}
              />
            </span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuelPrice;
