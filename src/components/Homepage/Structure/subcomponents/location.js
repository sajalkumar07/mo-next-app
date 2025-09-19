import React, { useState, useEffect } from "react";
import cities from "./statelist.json";
import { MapPin, Search, X, Locate } from "lucide-react";
import { useNavigate } from "react-router-dom";

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
            setSearchTerm(cityName);
          })
          .catch((err) => {
            // console.error("Error fetching location data:", err);
          });
      },
      (error) => {
        // console.error("Geolocation error:", error);
      }
    );
  }, []);

  useEffect(() => {
    // Check if location is already stored in localStorage
    const savedLocation = JSON.parse(localStorage.getItem("location"));
    if (savedLocation) {
      setNearestCity({ City: savedLocation.city, State: savedLocation.state });
    } else {
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
    // Check if the selected city is different from current location
    const currentLocation = JSON.parse(localStorage.getItem("location"));
    const isLocationChanged =
      !currentLocation ||
      currentLocation.city !== city.City ||
      currentLocation.state !== city.State;

    setNearestCity(city);
    setIsSearching(false);
    setSearchTerm("");

    const location = {
      city: city.City,
      state: city.State,
    };
    localStorage.setItem("location", JSON.stringify(location));

    // Refresh the page if location has changed
    if (isLocationChanged) {
      window.location.reload();
    }
  };

  const handleLocationClick = () => {
    setIsSearching(true);
  };

  const handleClose = () => {
    setIsSearching(false);
  };

  const detectLocation = () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;

          // Find nearest city from coordinates
          const closestCity = findNearestCity(latitude, longitude, cities);

          // Check if the detected location is different from current location
          const currentLocation = JSON.parse(localStorage.getItem("location"));
          const isLocationChanged =
            !currentLocation ||
            currentLocation.city !== closestCity.City ||
            currentLocation.state !== closestCity.State;

          setNearestCity(closestCity);

          if (closestCity) {
            const location = {
              city: closestCity.City,
              state: closestCity.State,
            };
            localStorage.setItem("location", JSON.stringify(location));
            setUserLocation(location);
            setCurrentStep("search");

            // Refresh the page if location has changed
            if (isLocationChanged) {
              window.location.reload();
            }
          }

          // Also get city name from reverse geocoding
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

  const getLocationFromIP = async () => {
    try {
      const response = await fetch("https://api.ipify.org?format=json");
      const data = await response.json();
      const ip = data.ip;

      const locationResponse = await fetch(`https://ipapi.co/${ip}/json/`);
      const locationData = await locationResponse.json();

      const { latitude, longitude } = locationData;

      const closestCity = findNearestCity(latitude, longitude, cities);

      // Check if the IP-detected location is different from current location
      const currentLocation = JSON.parse(localStorage.getItem("location"));
      const isLocationChanged =
        !currentLocation ||
        currentLocation.city !== closestCity.City ||
        currentLocation.state !== closestCity.State;

      setNearestCity(closestCity);
      const location = {
        city: closestCity.City,
        state: closestCity.State,
      };
      localStorage.setItem("location", JSON.stringify(location));

      // Refresh the page if location has changed
      if (isLocationChanged) {
        window.location.reload();
      }
    } catch (error) {
      console.error("Error fetching location data from IP:", error);
      setLocationError(true);
    }
  };

  return (
    <div className="relative">
      <div
        onClick={handleLocationClick}
        className="flex items-center cursor-pointer md:mr-auto -mr-10"
      >
        <MapPin className="text-white font-bold" />
        <svg
          className="w-4 h-4"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </div>

      {isSearching && (
        <div className="fixed inset-0 bg-black/30 shadow-2xl bg-opacity-80 flex items-center justify-center z-50">
          <div className="location-step">
            <div className="w-[346px] h-[400px] rounded-[10px] bg-white overflow-hidden">
              {/* Fixed Header */}
              <div className="flex items-center justify-between w-full p-[20px] pb-4 border-b border-gray-100">
                <h2 className="text-[14px] font-semibold text-[#818181]">
                  SELECT YOUR <span className="text-[#B10819]">CITY</span>
                </h2>
                <button
                  onClick={handleClose}
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
  );
}

export default MyLocation;
