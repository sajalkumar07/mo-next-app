import React, { useState, useEffect } from "react";
import cities from "../../Homepage/Structure/subcomponents/statelist.json";
import { MapPin, Search, X } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { Locate } from "lucide-react";

function MyLocation() {
  const navigate = useNavigate();
  const [position, setPosition] = useState({ latitude: null, longitude: null });
  const [nearestCity, setNearestCity] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredCities, setFilteredCities] = useState(cities);
  const [isSearching, setIsSearching] = useState(false);
  const [locationError, setLocationError] = useState(false);
  const [city, setCity] = useState("");
  const [currentStep, setCurrentStep] = useState("location"); // location → search → variant
  const [userLocation, setUserLocation] = useState(null);

  useEffect(() => {
    if (!navigator.geolocation) {
      alert("Geolocation is not supported by your browser");
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetch(
          `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
        )
          .then((res) => res.json())
          .then((data) => {
            const cityName =
              data.address.city ||
              data.address.town ||
              data.address.village ||
              data.address.county ||
              "Unknown city";
            setCity(cityName);
            setSearchTerm(cityName); // <-- Sync detected city with input value
          })
          .catch((err) => {
            console.error("Error fetching location data:", err);
          });
      },
      (error) => {
        console.error("Geolocation error:", error);
      }
    );
  }, []);

  useEffect(() => {
    // Check if location is already stored in localStorage
    const savedLocation = JSON.parse(localStorage.getItem("location"));
    if (savedLocation) {
      // Set the saved city/state if found in localStorage
      setNearestCity({ City: savedLocation.city, State: savedLocation.state });
    } else {
      // If no location in localStorage, try using geolocation to get current position
      if ("geolocation" in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            setPosition({
              latitude: position.coords.latitude,
              longitude: position.coords.longitude,
            });
          },
          () => {
            setLocationError(true);
            // If location is denied, fallback to IP-based location
            getLocationFromIP();
          }
        );
      } else {
        console.log("Geolocation is not available in your browser.");
        setLocationError(true);
        getLocationFromIP();
      }
    }
  }, []);

  useEffect(() => {
    if (position.latitude && position.longitude) {
      // Find the nearest city using latitude and longitude
      const closestCity = findNearestCity(
        position.latitude,
        position.longitude,
        cities
      );
      setNearestCity(closestCity);
      if (closestCity) {
        const location = {
          city: closestCity.City,
          state: closestCity.State,
        };
        localStorage.setItem("location", JSON.stringify(location));
      }
    }
  }, [position]);

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
    const R = 6371; // Earth's radius in km
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
    setNearestCity(city);
    setIsSearching(false);
    setSearchTerm("");
    setFilteredCities(cities);
    const location = {
      city: city.City,
      state: city.State,
    };
    localStorage.setItem("location", JSON.stringify(location));
    setCity(`${city.City}, ${city.State}`);

    // Refresh the page after a short delay to ensure state is updated
    setTimeout(() => {
      window.location.reload();
    }, 100);
  };

  const handleLocationClick = () => {
    setIsSearching(true);
  };

  // Fixed: Added proper close modal handler
  const closeModal = () => {
    setIsSearching(false);
    setSearchTerm(""); // Clear search term when closing
    setFilteredCities(cities); // Reset filtered cities
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
      setNearestCity(closestCity);
      const location = {
        city: closestCity.City,
        state: closestCity.State,
      };
      localStorage.setItem("location", JSON.stringify(location));
      setCity(`${closestCity.City}, ${closestCity.State}`);

      // Refresh after IP-based location is set
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error("Error fetching location data from IP:", error);
      setLocationError(true);
    }
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const closestCity = findNearestCity(latitude, longitude, cities);
          setNearestCity(closestCity);

          if (closestCity) {
            const location = {
              city: closestCity.City,
              state: closestCity.State,
            };
            localStorage.setItem("location", JSON.stringify(location));
            setUserLocation(location);
            setCurrentStep("search");
            setCity(`${closestCity.City}, ${closestCity.State}`);
            setIsSearching(false);

            // Refresh the page after location is set
            setTimeout(() => {
              window.location.reload();
            }, 100);
          }

          fetch(
            `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`
          )
            .then((res) => res.json())
            .then((data) => {
              const cityName =
                data.address.city ||
                data.address.town ||
                data.address.village ||
                data.address.county ||
                "Unknown city";
              setCity(cityName);
            })
            .catch((err) => {
              console.error("Error fetching location data:", err);
            });
        },
        () => {
          setLocationError(true);
          getLocationFromIP();
        }
      );
    } else {
      console.log("Geolocation is not available in your browser.");
      setLocationError(true);
      getLocationFromIP();
    }
  };

  return (
    <>
      <div
        onClick={handleLocationClick}
        className="flex items-center cursor-pointer"
      >
        {nearestCity && (
          <span className="thecolo font-weight-bold redcol">
            {nearestCity.City}
          </span>
        )}
        <svg
          className="w-4 h-4 ml-1 text-gray-500 inline-block align-middle onlyphoneme"
          width="14"
          height="14"
          viewBox="0 0 14 14"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            d="M6.48963 1.80702H5.45265C2.86022 1.80702 1.82324 2.84399 1.82324 5.43643V8.54735C1.82324 11.1398 2.86022 12.1768 5.45265 12.1768H8.56357C11.156 12.1768 12.193 11.1398 12.193 8.54735V7.51037M8.51691 2.92176C8.8643 4.16095 9.83387 5.13052 11.0782 5.48309M9.1028 2.33587L5.01712 6.42155C4.86158 6.5771 4.70603 6.88301 4.67492 7.10595L4.45197 8.6666C4.36901 9.23175 4.76825 9.6258 5.3334 9.54803L6.89405 9.32508C7.11181 9.29397 7.41772 9.13842 7.57845 8.98288L11.6641 4.8972C12.3693 4.19206 12.7011 3.37285 11.6641 2.33587C10.6272 1.2989 9.80794 1.63073 9.1028 2.33587Z"
            stroke="#818181"
            strokeWidth="1.05913"
            strokeMiterlimit="10"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </div>

      {isSearching && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <div className="w-[346px] h-[400px] rounded-[10px] bg-white overflow-hidden">
            {/* Fixed Header */}
            <div className="flex items-center justify-between w-full p-[20px] pb-4 border-b border-gray-100">
              <h2 className="text-[14px] font-semibold text-[#818181]">
                SELECT YOUR <span className="text-[#B10819]">CITY</span>
              </h2>
              {/* Fixed: Added onClick handler to close button */}
              <button
                onClick={closeModal}
                className="text-black hover:text-[#B10819] transition-colors mr-3"
              >
                <span className="text-2xl">
                  <X />
                </span>
              </button>
            </div>

            <div className="px-[20px] py-4 border-b border-gray-100 font-[Montserrat] font-medium">
              <div className="relative">
                <input
                  type="text"
                  placeholder="Search city..."
                  value={searchTerm}
                  onChange={handleSearch}
                  className="w-full h-[40px] border border-slate-300 px-4 text-black"
                />
                <div className="absolute inset-y-0 right-0 flex justify-center items-center">
                  <button className="bg-black text-white w-[38px] h-[38px] flex justify-center items-center">
                    <Search className="" size={18} />
                  </button>
                </div>
              </div>
            </div>

            <div className="px-[20px]  py-3 border-b border-gray-100 font-[Montserrat] font-medium">
              <div className="text-[13px] font-medium text-[#B1081A] mb-3 font-[Montserrat]">
                Results
              </div>

              <button
                className="flex  items-center text-[#B10819] hover:bg-red-50 p-2 rounded w-full"
                onClick={detectLocation}
              >
                <Locate size={20} />
                <span className="ml-3">Detect Your Location</span>
              </button>
            </div>

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
                  {city.City}, {city.State}, {city.Country}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </>
  );
}

export default MyLocation;
