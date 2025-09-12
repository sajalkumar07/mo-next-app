import React, { useState } from 'react';
import cities from '../Homepage/Structure/subcomponents/statelist.json'; // Assuming the JSON is correctly imported

const SelectLocation = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [selectedCity, setSelectedCity] = useState('');
  const [cityOptions, setCityOptions] = useState([]);
  const [locationConfirmed, setLocationConfirmed] = useState(false);

  const handleViewPriceBreakup = () => {
    setShowPopup(true);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleCityInputChange = (e) => {
    const query = e.target.value.toLowerCase();
    const filteredCities = cities.filter((city) =>
      city.City.toLowerCase().includes(query)
    );
    setCityOptions(filteredCities);
    setSelectedCity(query); // Update the input value
  };

  const handleCitySelect = (city) => {
    setSelectedCity(city.City); // Set city name in the input box
    setCityOptions([]); // Clear the city suggestions
  };

  const handleConfirmLocation = () => {
    const selectedCityData = cities.find(city => city.City === selectedCity);
    if (selectedCityData) {
      // Store in localStorage
      localStorage.setItem('selectedCity', JSON.stringify(selectedCityData));
      setLocationConfirmed(true);
    }
    closePopup();
  };

  const handleResetLocation = () => {
    setSelectedCity('');
    setCityOptions([]);
  };


    const detectLocation = async () => {
        try {
          // Fetch user's IP address
          const ipResponse = await fetch('https://api.ipify.org?format=json');
          const ipData = await ipResponse.json();
          const ip = ipData.ip;
      
          // Fetch location using the IP address
          const locationResponse = await fetch(`https://ipinfo.io/${ip}/json`);
          const locationData = await locationResponse.json();
      
          const { city, region, country } = locationData;
      console.log(locationData)
          // Use the location data (city, region, country)
          console.log("Location:", city, region, country);
          
          // You can update the state or store this location information
          setSelectedCity(city);
          setLocationConfirmed(false);  // Reset confirmation status
          setCityOptions([{ City: city, Region: region, Country: country }]);  // You can filter cities based on this information
      
        } catch (error) {
          console.error("Error fetching IP or location data:", error);
          alert("Failed to detect location based on IP. Please try again.");
        }
      };
      
  

  return (
    <>
      <div className="d-flex w-30 justify-content-evenly align-items-center theemisectiona" onClick={handleViewPriceBreakup}>
        <div>
          {/* svg */}
        </div>
        <div className="emi-result">
          <div className="theknowemTHEVARIi">Know your EMI</div>
        </div>
        <div>
          <svg
            width="32"
            height="32"
            viewBox="0 0 32 32"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M10.5859 3.27307C10.211 3.64813 10.0003 4.15674 10.0003 4.68707C10.0003 5.2174 10.211 5.72602 10.5859 6.10107L20.4859 16.0011L10.5859 25.9011C10.2216 26.2783 10.02 26.7835 10.0246 27.3079C10.0291 27.8323 10.2395 28.3339 10.6103 28.7047C10.9811 29.0755 11.4827 29.2859 12.0071 29.2904C12.5315 29.295 13.0367 29.0934 13.4139 28.7291L24.7279 17.4151C25.1028 17.04 25.3135 16.5314 25.3135 16.0011C25.3135 15.4707 25.1028 14.9621 24.7279 14.5871L13.4139 3.27307C13.0388 2.89813 12.5302 2.6875 11.9999 2.6875C11.4696 2.6875 10.961 2.89813 10.5859 3.27307Z"
              fill="#B1081A"
            />
          </svg>
        </div>
      </div>

      {/* Popup Component */}
      {showPopup && (
        <div style={popupStyles.overlay} className="text-dark">
          <div style={popupStyles.popup}>
            <div>Select City</div>
            <p>Select Your Current Location</p>

            <input
              className="input_box_input kjfsgsjfgbs"
              type="text"
              value={selectedCity}
              onChange={handleCityInputChange}
              placeholder="Enter city"
            />
            <button onClick={detectLocation}>Detect my location</button>
            {cityOptions.length > 0 && (
              <ul style={{ listStyleType: 'none', padding: 0 }}>
                {cityOptions.map((city) => (
                  <li key={city.City} onClick={() => handleCitySelect(city)}>
                    {city.City}, {city.State}, {city.country}
                  </li>
                ))}
              </ul>
            )}

            <div>
              <button onClick={handleResetLocation}>RESET</button>
              <button onClick={handleConfirmLocation}>CONFIRM</button>
            </div>
          </div>
        </div>
      )}

      {/* Confirmation message */}
      {locationConfirmed && <p>Location confirmed: {selectedCity}</p>}
    </>
  );
};

const popupStyles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  popup: {
    background: '#fff',
    padding: '20px',
    width: '250px',
    maxHeight: '60%',
    overflowY: 'scroll',
    textAlign: 'center',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
  },
};

export default SelectLocation;
