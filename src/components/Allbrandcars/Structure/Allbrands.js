import React, { useState, useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import Cardsection from "../../Cardsection";

const Popcars = () => {
  const [newcardData, setCardData] = useState([]);
  const [rtoData, setRtoData] = useState([]);
  const { id } = useParams(); // Retrieve brand ID from route params
  const [filters, setFilters] = useState({
    fuelType: [],
    transmission: [],
    seater: [],
  });
  const [showModal, setShowModal] = useState(false);
  const [sortOrder, setSortOrder] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Fetch RTO data
  const fetchRTOData = async () => {
    const locationState = localStorage.getItem("location");
    if (!locationState) return;

    try {
      const parsedLocationState = JSON.parse(locationState);
      if (!parsedLocationState || !parsedLocationState.state) {
        return;
      }

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
      if (result.data && Array.isArray(result.data)) {
        setRtoData(result.data);
        console.log("RTO data loaded:", result.data);
      }
    } catch (error) {
      console.error("Error fetching RTO data:", error);
      setRtoData([]);
    }
  };

  useEffect(() => {
    fetchRTOData();
  }, []);

  // Helper Functions (same as Cards component)
  const getDataFromRoadPriceListBasedOnFuelAndPriceRange = (
    priceList,
    productPrice,
    fuelType
  ) => {
    const price = parseFloat(productPrice) || 0;
    const fuel = (fuelType || "").toUpperCase();

    return (
      priceList.find(
        (rto) =>
          price >= parseFloat(rto.startPrice || 0) &&
          (rto.endPrice === "ABOVE"
            ? true
            : price <= parseFloat(rto.endPrice || Infinity)) &&
          (rto.fuelType || "").toUpperCase() === fuel.toUpperCase()
      ) || {}
    );
  };

  const calculateRtoPrice = (productPrice, rtoPercentage, amount, fuelType) => {
    const price = parseInt(productPrice);
    let rto = Math.ceil((parseFloat(rtoPercentage) * price) / 100);

    if (fuelType.toLowerCase() === "electric" || rtoPercentage === "0") {
      rto += parseInt(amount || "0");
    }

    return rto;
  };
  const calculateRoadSafetyTax = (rto) => Math.ceil((rto * 2) / 100);

  const calculateInsurancePrice = (productPrice, insurancePercentage) => {
    return Math.ceil(
      (parseInt(productPrice) * parseFloat(insurancePercentage)) / 100
    );
  };

  // Extract first fuel type from various formats
  const getFirstFuelType = (fuelData) => {
    if (Array.isArray(fuelData)) {
      return fuelData[0];
    }
    if (typeof fuelData === "string") {
      const match = fuelData.match(/<li>(.*?)<\/li>/i);
      if (match && match[1]) return match[1];
      return fuelData;
    }
    return "";
  };

  // Parse HTML string to array of fuel types
  const parseFuelType = (htmlString) => {
    if (!htmlString) return [];
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    return Array.from(tempDiv.querySelectorAll("li")).map((li) =>
      li.textContent.trim()
    );
  };

  // Parse HTML string to array of transmission types
  const parseTransmissionType = (htmlString) => {
    if (!htmlString) return [];
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    return Array.from(tempDiv.querySelectorAll("li")).map((li) =>
      li.textContent.trim()
    );
  };

  // Parse HTML string to array of seater options
  const parseSeater = (htmlString) => {
    if (!htmlString) return [];
    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;
    return Array.from(tempDiv.querySelectorAll("li"))
      .map((li) => parseInt(li.textContent.trim(), 10))
      .filter((seater) => !isNaN(seater));
  };

  const normalizeFuelType = (fuelType) => {
    if (!fuelType) return "";
    const normalizedFuel = fuelType.toLowerCase();
    // Treat hybrid as petrol for calculation purposes
    if (normalizedFuel.includes("hybrid")) {
      return "petrol";
    }
    return normalizedFuel;
  };

  // Main on-road price calculation using mobile app logic (same as Cards component)
  const calculateOnRoadPrice = (product, fuelType) => {
    // Extract price (handles both variant and direct car data)
    let productPrice;
    if (typeof product === "object") {
      productPrice =
        product.exShowroomPrice || // Variant price first
        product.lowestExShowroomPrice || // Fallback to car price
        0;
    } else {
      productPrice = product; // Direct number input
    }

    const priceStr = productPrice.toString();

    // Early exit for invalid prices
    if (!/[0-9]/.test(priceStr)) return 0;
    if (!Array.isArray(rtoData) || rtoData.length === 0)
      return parseFloat(productPrice) || 0;

    // Normalize fuel type (treat hybrid as petrol)
    const normalizedFuelType = normalizeFuelType(fuelType);

    // Get applicable RTO rates
    const roadPriceData = getDataFromRoadPriceListBasedOnFuelAndPriceRange(
      rtoData,
      priceStr,
      normalizedFuelType
    );

    const price = parseInt(priceStr) || 0;

    // --- Calculate Components ---
    // 1. RTO Tax
    const rto = calculateRtoPrice(
      priceStr,
      roadPriceData.rtoPercentage || "0",
      roadPriceData.amount || "0",
      normalizedFuelType
    );

    // 2. Road Safety Tax (2% of RTO)
    const roadSafetyTax = calculateRoadSafetyTax(rto);

    // 3. Insurance (percentage of vehicle price)
    const insurance = calculateInsurancePrice(
      priceStr,
      roadPriceData.insurancePercentage || "0"
    );

    // 4. Luxury Tax (1% for cars above ₹10L)
    const luxuryTax = price > 999999 ? Math.ceil(price / 100) : 0;

    // 5. Additional Charges
    const hypethecationCharges = parseInt(
      roadPriceData.hypethecationCharges || "0"
    );
    const fastag = parseInt(roadPriceData.fastag || "0");
    const others = parseInt(roadPriceData.others || "0");

    // --- Final Calculation ---
    return (
      price + // Base price
      rto + // RTO tax
      roadSafetyTax + // Safety tax
      insurance + // Insurance
      luxuryTax + // Luxury tax
      hypethecationCharges +
      fastag +
      others
    );
  };

  // Fetch car data for specific brand
  const fetchData = async () => {
    setIsLoading(true);
    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/cars/brand/${id}`
      );
      const data = await response.json();

      // Check if data has the expected structure
      if (data && Array.isArray(data)) {
        // Fetch variant prices for each car (same as Cards component)
        const enrichedCars = await Promise.all(
          data.map(async (car) => {
            try {
              const variantResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/api/variants/active/${car._id}`
              );
              const variantData = await variantResponse.json();

              if (variantData.data?.length > 0) {
                // Use the variant's ex-showroom price if available
                const lowestVariantPrice = Math.min(
                  ...variantData.data.map((v) => v.exShowroomPrice)
                );
                const highestVariantPrice = Math.max(
                  ...variantData.data.map((v) => v.exShowroomPrice)
                );

                const firstFuelType = getFirstFuelType(car.fueltype);
                const onRoadPrice = calculateOnRoadPrice(
                  lowestVariantPrice,
                  firstFuelType
                );

                return {
                  ...car,
                  lowestExShowroomPrice: lowestVariantPrice,
                  highestExShowroomPrice: highestVariantPrice,
                  onRoadPrice,
                  brand: car.brand?.name || "", // Handle missing brand name
                  rating: car.brand?.rating || "0", // Add brand rating
                  fueltype: parseFuelType(car.fueltype),
                  transmissiontype: parseTransmissionType(car.transmissiontype),
                  seater: parseSeater(car.seater),
                };
              } else {
                // Fallback to car's default price if no variants
                const firstFuelType = getFirstFuelType(car.fueltype);
                const onRoadPrice = calculateOnRoadPrice(
                  car.lowestExShowroomPrice,
                  firstFuelType
                );

                return {
                  ...car,
                  onRoadPrice,
                  brand: car.brand?.name || "", // Handle missing brand name
                  rating: car.brand?.rating || "0", // Add brand rating
                  fueltype: parseFuelType(car.fueltype),
                  transmissiontype: parseTransmissionType(car.transmissiontype),
                  seater: parseSeater(car.seater),
                };
              }
            } catch (error) {
              console.error(`Failed to fetch variants for ${car._id}:`, error);
              // Fallback calculation with original car data
              const firstFuelType = getFirstFuelType(car.fueltype);
              const onRoadPrice = calculateOnRoadPrice(
                car.lowestExShowroomPrice,
                firstFuelType
              );

              return {
                ...car,
                onRoadPrice,
                brand: car.brand?.name || "",
                rating: car.brand?.rating || "0", // Add brand rating
                fueltype: parseFuelType(car.fueltype),
                transmissiontype: parseTransmissionType(car.transmissiontype),
                seater: parseSeater(car.seater),
              };
            }
          })
        );

        setCardData(enrichedCars);
        console.log("Processed Cars Data:", enrichedCars);
      } else if (data && data.data) {
        // Handle the case where data is an object containing a `data` array
        const enrichedCars = await Promise.all(
          data.data.map(async (car) => {
            try {
              const variantResponse = await fetch(
                `${process.env.NEXT_PUBLIC_API}/api/variants/active/${car._id}`
              );
              const variantData = await variantResponse.json();

              if (variantData.data?.length > 0) {
                // Use the variant's ex-showroom price if available
                const lowestVariantPrice = Math.min(
                  ...variantData.data.map((v) => v.exShowroomPrice)
                );
                const highestVariantPrice = Math.max(
                  ...variantData.data.map((v) => v.exShowroomPrice)
                );

                const firstFuelType = getFirstFuelType(car.fueltype);
                const onRoadPrice = calculateOnRoadPrice(
                  lowestVariantPrice,
                  firstFuelType
                );

                return {
                  ...car,
                  lowestExShowroomPrice: lowestVariantPrice,
                  highestExShowroomPrice: highestVariantPrice,
                  onRoadPrice,
                  brand: car.brand?.name || "", // Handle missing brand name
                  rating: car.brand?.rating || "0", // Add brand rating
                  fueltype: parseFuelType(car.fueltype),
                  transmissiontype: parseTransmissionType(car.transmissiontype),
                  seater: parseSeater(car.seater),
                };
              } else {
                // Fallback to car's default price if no variants
                const firstFuelType = getFirstFuelType(car.fueltype);
                const onRoadPrice = calculateOnRoadPrice(
                  car.lowestExShowroomPrice,
                  firstFuelType
                );

                return {
                  ...car,
                  onRoadPrice,
                  brand: car.brand?.name || "", // Handle missing brand name
                  rating: car.brand?.rating || "0", // Add brand rating
                  fueltype: parseFuelType(car.fueltype),
                  transmissiontype: parseTransmissionType(car.transmissiontype),
                  seater: parseSeater(car.seater),
                };
              }
            } catch (error) {
              console.error(`Failed to fetch variants for ${car._id}:`, error);
              // Fallback calculation with original car data
              const firstFuelType = getFirstFuelType(car.fueltype);
              const onRoadPrice = calculateOnRoadPrice(
                car.lowestExShowroomPrice,
                firstFuelType
              );

              return {
                ...car,
                onRoadPrice,
                brand: car.brand?.name || "",
                rating: car.brand?.rating || "0", // Add brand rating
                fueltype: parseFuelType(car.fueltype),
                transmissiontype: parseTransmissionType(car.transmissiontype),
                seater: parseSeater(car.seater),
              };
            }
          })
        );

        setCardData(enrichedCars);
        console.log("Processed Cars Data:", enrichedCars);
      } else {
        console.error("Unexpected API response structure:", data);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setIsLoading(false);
      setInitialLoadComplete(true);
    }
  };

  useEffect(() => {
    if (rtoData.length > 0) {
      fetchData();
    }
  }, [rtoData, id]); // Re-run fetchData when RTO data or brand ID changes

  // Function to handle filter selection
  const handleFilterChange = (category, value) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [category]: prevFilters[category].includes(value)
        ? prevFilters[category].filter((item) => item !== value)
        : [...prevFilters[category], value],
    }));
  };

  // Filter the data based on selected filters
  const filteredData = newcardData.filter((car) => {
    const fuelMatch =
      filters.fuelType.length === 0 ||
      car.fueltype.some((fuel) => filters.fuelType.includes(fuel));

    const transmissionMatch =
      filters.transmission.length === 0 ||
      car.transmissiontype.some((trans) => {
        const lowerTrans = trans.toLowerCase();
        return filters.transmission.some((filterTrans) => {
          if (filterTrans === "Automatic") {
            return (
              lowerTrans.includes("automatic") ||
              lowerTrans.includes("amt") ||
              lowerTrans.includes("cvt") ||
              lowerTrans.includes("at") ||
              lowerTrans.includes("dct")
            );
          }
          if (filterTrans === "Manual") {
            return lowerTrans.includes("manual") || lowerTrans.includes("mt");
          }
          return false;
        });
      });

    const seaterMatch =
      filters.seater.length === 0 ||
      filters.seater.some((selectedSeater) =>
        car.seater.some(
          (carSeaterCount) => selectedSeater === `${carSeaterCount} Seater`
        )
      );

    return fuelMatch && transmissionMatch && seaterMatch;
  });

  // Function to handle opening modal
  const openModal = () => {
    setShowModal(true);
  };

  // Function to handle closing modal
  const closeModal = () => {
    setShowModal(false);
  };

  // Function to handle sort change
  const handleSortChange = (event) => {
    const selectedOrder = event.target.value;
    setSortOrder(selectedOrder);

    const sortedData = [...filteredData].sort((a, b) => {
      const priceA = a.onRoadPrice || 0;
      const priceB = b.onRoadPrice || 0;

      return selectedOrder === "lowToHigh" ? priceA - priceB : priceB - priceA;
    });

    setCardData(sortedData);
  };

  // Function to render star rating

  return (
    <>
      {/* Filter and Sort Controls */}
      <div className="d-flex flex-row justify-content-center gap-3">
        <div className="sort-container">
          <select onClick={openModal} className="sort-dropdown">
            <option value="" hidden>
              Sort By
            </option>
          </select>
        </div>

        {showModal && (
          <div className="modal-overlay mt-20">
            <div className="modal-content">
              <span className="d-flex align-items-center justify-content-between">
                <div className="inside_card_title_product d-flex align-items-center justify-content-center mt-1">
                  SORT&nbsp; <span>BY</span>
                </div>

                <span onClick={closeModal}>
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 12 12"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      d="M0.905212 11.0948L10.3609 1.63916M0.905212 1.63916L10.3609 11.0948"
                      stroke="#171717"
                      strokeWidth="1.5791"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
              </span>

              <div className="d-flex flex-column flex-wrap mt-3 pl-3 pr-3">
                <div className="news-title">Fuel</div>
                <div
                  className="d-flex flex-column flex-wrap news-title mt-4"
                  style={{ height: "100px", gap: "10px" }}
                >
                  {["Petrol", "Diesel", "CNG", "Electric", "Hybrid"].map(
                    (fuel) => (
                      <label key={fuel}>
                        <input
                          type="checkbox"
                          checked={filters.fuelType.includes(fuel)}
                          onChange={() => handleFilterChange("fuelType", fuel)}
                          className="mr-2"
                        />
                        {fuel}
                      </label>
                    )
                  )}
                </div>
              </div>

              <div className="d-flex flex-column flex-wrap mt- pl-3 pr-3">
                <div className="news-title">Transmission</div>
                <div
                  className="d-flex flex-column flex-wrap news-title mt-4"
                  style={{ height: "70px", gap: "10px" }}
                >
                  {["Manual", "Automatic"].map((trans) => (
                    <label key={trans}>
                      <input
                        type="checkbox"
                        checked={filters.transmission.includes(trans)}
                        onChange={() =>
                          handleFilterChange("transmission", trans)
                        }
                        className="mr-2"
                      />
                      {trans}
                    </label>
                  ))}
                </div>
              </div>

              <div className="d-flex flex-column flex-wrap m pl-3 pr-3">
                <div className="news-title">Seating Capacity</div>
                <div
                  className="d-flex flex-column flex-wrap news-title mt-4"
                  style={{ height: "100px", gap: "10px" }}
                >
                  {["5 Seater", "6 Seater", "7 Seater"].map((seater) => (
                    <label key={seater}>
                      <input
                        type="checkbox"
                        checked={filters.seater.includes(seater)}
                        onChange={() => handleFilterChange("seater", seater)}
                        className="mr-2"
                      />
                      {seater}
                    </label>
                  ))}
                </div>
              </div>
              <button
                className="next-button d-flex align-items-center justify-content-center align-self-center"
                onClick={() => {
                  // setCardData([...filteredData]);
                  closeModal();
                }}
              >
                Apply Filter
              </button>
            </div>
          </div>
        )}

        <div className="sort-container">
          <select
            id="price-sort"
            value={sortOrder}
            onChange={handleSortChange}
            className="sort-dropdown"
          >
            <option value="" disabled hidden>
              Filter By
            </option>
            <option value="lowToHigh">Price Low to High</option>
            <option value="highToLow">Price High to Low</option>
          </select>
        </div>
      </div>

      {/* No Cars Available State */}
      {!isLoading && initialLoadComplete && filteredData.length === 0 && (
        <div className="text-center py-5 font-[Montserrat]">
          <h4>No cars available </h4>
        </div>
      )}

      {/* Display Filtered Cars - Only show when not loading and there are results */}
      {!isLoading && filteredData.length > 0 && (
        <Cardsection
          newcardData={filteredData}
          rtoData={rtoData}
          onCardClick={() => console.log("Card clicked")}
        />
      )}
    </>
  );
};

export default Popcars;
