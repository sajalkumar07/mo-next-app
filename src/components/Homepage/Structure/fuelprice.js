import React, { useState, useEffect } from "react";
import { Search, X, ChevronDown, Locate } from "lucide-react";
import ScrachNew from "../../../Images/scrach.png";
import Brand from "../../../Images/Bharat_Petroleum-Logo 1.png";

const API_KEY = "a651f8322fmsh31b9418f911cfd4p1b34abjsn3a21242748da";
const BASE_URL =
  "https://daily-petrol-diesel-lpg-cng-fuel-prices-in-india.p.rapidapi.com/v1";

const FuelPrice = () => {
  const [states, setStates] = useState([]);
  const [cities, setCities] = useState([]);
  const [selectedState, setSelectedState] = useState("");
  const [selectedCity, setSelectedCity] = useState("");
  const [selectedFuel, setSelectedFuel] = useState("");
  const [price, setPrice] = useState(null);

  // City popup states
  const [isSearching, setIsSearching] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState([]);
  const [selectedCityName, setSelectedCityName] = useState("Choose City");

  useEffect(() => {
    const fetchStates = async () => {
      try {
        const response = await fetch(`${BASE_URL}/list/india/states`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            "RapidAPI-Key": API_KEY,
          },
        });
        if (!response.ok) throw new Error("Network response was not ok");
        const data = await response.json();
        setStates(data.states || []);
      } catch (error) {
        console.error("Error fetching states:", error);
      }
    };

    fetchStates();

    // Function to update state and city from localStorage
    const updateLocationFromStorage = () => {
      const locationString = localStorage.getItem("location");
      const location = locationString ? JSON.parse(locationString) : null;
      if (location) {
        setSelectedState(location.state ? location.state.toLowerCase() : "");
        setSelectedCity(location.city ? location.city.toLowerCase() : "");
        return true; // Location was found
      }
      return false; // Location not found yet
    };

    // Check for location every 2 seconds
    const locationInterval = setInterval(() => {
      const found = updateLocationFromStorage();
      if (found) {
        clearInterval(locationInterval); // Stop checking when location is found
      }
    }, 2000);

    // Clean up the interval on component unmount
    return () => clearInterval(locationInterval);
  }, []);

  // Fetch cities when selectedState changes
  useEffect(() => {
    if (selectedState) {
      const fetchCities = async () => {
        try {
          const response = await fetch(
            `${BASE_URL}/list/india/${selectedState}/cities`,
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
          setCities(data.cities || []);
          setFilteredCities(data.cities || []);

          // If selectedCity exists from local storage, fetch fuel price
          if (selectedCity && selectedFuel) {
            fetchFuelPrice(selectedCity);
          }
        } catch (error) {
          console.error("Error fetching cities:", error);
        }
      };

      fetchCities();
    }
  }, [selectedState]);

  // Update selected city name when selectedCity changes
  useEffect(() => {
    if (selectedCity) {
      const city = cities.find((city) => city.cityId === selectedCity);
      if (city) {
        setSelectedCityName(city.cityName);
      }
    } else {
      setSelectedCityName("Choose City");
    }
  }, [selectedCity, cities]);

  // Fetch fuel price when selectedCity or selectedFuel changes
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
      const filtered = cities.filter((city) =>
        city.cityName.toLowerCase().includes(term.toLowerCase())
      );
      setFilteredCities(filtered);
    } else {
      setFilteredCities(cities);
    }
  };

  const handleCityClick = (city) => {
    setSelectedCity(city.cityId);
    setSelectedCityName(city.cityName);
    setIsSearching(false);
    setSearchTerm("");
    setPrice(null);
  };

  const handleSelectorClick = () => {
    if (cities.length > 0) {
      setIsSearching(true);
    }
  };

  const closeModal = () => {
    setIsSearching(false);
    setSearchTerm("");
  };

  return (
    <>
      <section className="px-4 py-2">
        <section>
          <img className="scrach-image-feul" src={ScrachNew} alt="scrach" />
          <div className=" block md:flex justify-center items-center flex-col">
            <div className="text-[24px] font-bold text-[#828282] ml-2 mb-2">
              FUEL <span className="fule_colour">PRICES</span>
            </div>
            <div className="select_section">
              <div className="select_section_under">
                <div>
                  <select
                    className="select_fuel font-color-gray align-item-center justify-content-center d-none"
                    id="state"
                    value={selectedState}
                    onChange={(e) => {
                      setSelectedState(e.target.value);
                      setSelectedCity("");
                      setPrice(null);
                    }}
                  >
                    <option value="">Choose State</option>
                    {states.length > 0 ? (
                      states.map((state) => (
                        <option key={state.stateId} value={state.stateId}>
                          {state.stateName}
                        </option>
                      ))
                    ) : (
                      <option value="">No States Available</option>
                    )}
                  </select>
                </div>

                {/* Custom City Selector with Popup */}
                <div className="relative">
                  <div
                    onClick={handleSelectorClick}
                    className="select_fuel font-color-gray cursor-pointer flex items-center justify-between"
                  >
                    <span
                      className={selectedCity ? "text-black" : "text-gray-500"}
                    >
                      {selectedCityName}
                    </span>
                    <ChevronDown size={16} className="text-gray-400" />
                  </div>

                  {/* City Search Modal */}
                  {isSearching && (
                    <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
                      <div className="location-step">
                        <div className="w-[346px] h-[400px] rounded-[10px] bg-white overflow-hidden">
                          <div className="flex items-center justify-between w-full p-[20px] pb-4 border-b border-gray-100">
                            <h2 className="text-xl font-bold text-[#828282]">
                              SELECT YOUR{" "}
                              <span className="text-[#B10819]">CITY</span>
                            </h2>
                            <button
                              onClick={closeModal}
                              className="text-gray-400 hover:text-gray-600"
                            >
                              <X size={24} />
                            </button>
                          </div>

                          <div className="px-[20px] py-4 border-b border-gray-100 font-[Montserrat] font-medium">
                            <div className="relative">
                              <input
                                type="text"
                                placeholder="Search city..."
                                value={searchTerm}
                                onChange={handleSearch}
                                className="w-full h-[40px] border border-slate-300 px-4 text-black  font-[Montserrat]"
                              />
                              <div className="absolute inset-y-0 right-0 flex justify-center items-center">
                                <button className="bg-black text-white w-[38px] h-[38px] flex justify-center items-center">
                                  <Search className="" size={20} />
                                </button>
                              </div>
                            </div>
                          </div>

                          <div className="px-[20px] py-3 border-b border-gray-100 font-[Montserrat] font-medium ">
                            <div className="text-[13px] font-medium text-[#B1081A] mb-3 font-[Montserrat]">
                              Results
                            </div>

                            <button className="flex items-center mr-2 text-[#B10819] hover:bg-red-50 p-2 rounded w-full ">
                              <Locate size={20} className="mr-2" />
                              Detect Your Location
                            </button>
                          </div>

                          <div
                            className="flex-1 overflow-y-auto px-[20px] font-[Montserrat] "
                            style={{ height: "calc(400px - 200px)" }}
                          >
                            {filteredCities.length > 0 ? (
                              filteredCities.map((city) => (
                                <div
                                  key={city.cityId}
                                  onClick={() => handleCityClick(city)}
                                  className="py-3 px-4 cursor-pointer hover:bg-gray-100 border-b border-gray-200 text-black"
                                >
                                  {city.cityName}
                                </div>
                              ))
                            ) : (
                              <div className="">No cities found</div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                <div>
                  <select
                    className="select_fuel font-color-gray"
                    id="fuel"
                    value={selectedFuel}
                    onChange={(e) => setSelectedFuel(e.target.value)}
                  >
                    <option value="">Choose Fuel</option>
                    <option value="petrol">Petrol</option>
                    <option value="diesel">Diesel</option>
                    <option value="lpg">LPG</option>
                    <option value="cng">CNG</option>
                  </select>
                </div>

                <div className="flex justify-center items-center space-x-6">
                  {price !== null && (
                    <div className="bg-red-800 font-sans text-center flex justify-center items-center text-xl text-white h-[56px] w-[69px] md:h-[100px] md:w-auto ">
                      {formatPrice()}
                    </div>
                  )}
                  <img className="" src={Brand} alt="scrach" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>
    </>
  );
};

export default FuelPrice;
