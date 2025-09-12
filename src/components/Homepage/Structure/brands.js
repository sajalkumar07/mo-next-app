import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import Tyre from "../../../Images/tyremask.png";

const baseUrl = process.env.NEXT_PUBLIC_API;

const Brands = () => {
  const [brandsData, setBrandsData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch(`${baseUrl}/api/brands`)
      .then((response) => response.json())
      .then((data) => {
        setBrandsData(data.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
        setBrandsData([]);
        setIsLoading(false);
      });
  }, []);

  return (
    <section>
      <LogosSection data={brandsData} isLoading={isLoading} />
    </section>
  );
};

const LogosSection = (props) => {
  const logoWidth = 60; // Fixed width of each logo
  const logosCount = props.data.length;
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showAll, setShowAll] = useState(false);
  const maxItemsPerRow = 4; // Number of items in a row
  const maxRows = 2; // Maximum number of rows to show initially
  const maxVisibleItems = maxItemsPerRow * maxRows; // Maximum items visible initially

  const handleNext = () => {
    setCurrentIndex((currentIndex + 2) % logosCount);
  };

  const handlePrevious = () => {
    setCurrentIndex((currentIndex - 2 + logosCount) % logosCount);
  };

  const maxTransform = 100; // Set maximum transform value

  const containerStyle = {
    transform: `translateX(-${Math.min(
      currentIndex * logoWidth,
      maxTransform
    )}px)`,
    transition: "transform 0.8s ease",
  };

  if (props.isLoading) {
    // Skeleton loading animation with placeholders
    return (
      <div className="skeleton-container">
        {[...Array(5)].map((_, i) => (
          <div key={i} className="skeleton-logo"></div>
        ))}
      </div>
    );
  }

  if (logosCount === 0) {
    return <div>No brands available.</div>;
  }

  return (
    <div className="relative w-full">
      <div className="label">
        <p className="block md:flex justify-center items-center text-[25px] font-bold  ml-[20px] mb-2 mt-8 gap-1">
          <span className="text-wrapper">BROWSE BY</span>
          <span className="text-wrapper-2"> BRANDS</span>
        </p>
      </div>
      <div
        className="absolute inset-0"
        style={{
          backgroundImage: `url(${Tyre})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          opacity: 0.08,
          zIndex: 0,
          pointerEvents: "none",
        }}
      />
      <div className="center_logo onlydesptop">
        <section
          className="brand_logos"
          style={{
            marginTop: "40px", // Reduced from 130px to 40px
            position: "relative",
            zIndex: 10,
          }}
        >
          {logosCount > 1 && (
            <button
              className="rounded-full bg-[#818181] p-2 flex justify-center items-center text-white cursor-pointer"
              onClick={handlePrevious}
              disabled={currentIndex === logosCount - 1}
            >
              <ion-icon name="chevron-back-outline"></ion-icon>
            </button>
          )}
          <div className="logos-section">
            <div className="logos-container" style={containerStyle}>
              {props.data.map((brand) => (
                <Link key={brand._id} to={`/brand/${brand.name}/${brand._id}`}>
                  <img
                    src={`${baseUrl}/brandImages/${brand.image}`}
                    alt={brand.name}
                    crossOrigin="anonymous"
                    className="w-24 h-24 object-contain mx-3"
                  />
                </Link>
              ))}
            </div>
          </div>
          {logosCount > 1 && (
            <button
              className="rounded-full bg-[#818181] p-2 flex justify-center items-center text-white cursor-pointer"
              onClick={handleNext}
              disabled={currentIndex === logosCount - 1}
            >
              <ion-icon name="chevron-forward-outline"></ion-icon>
            </button>
          )}
        </section>
      </div>
      <section className="onlyphoneme thechart">
        <div className="mb-8 border-b border-gray-500">
          {props.data
            .slice(0, showAll ? props.data.length : maxVisibleItems)
            .map((brand) => (
              <Link
                key={brand._id}
                to={`/brand/${brand.name}/${brand._id}`}
                className="logo-thech"
              >
                <img
                  src={`${baseUrl}/brandImages/${brand.image}`}
                  alt={brand.name}
                  crossOrigin="anonymous"
                  className="logo-image"
                />
                <span
                  className="font-semibold -mb-10"
                  style={{
                    fontFamily: "Montserrat",
                  }}
                >
                  {brand.name}
                </span>
              </Link>
            ))}
          {props.data.length > maxVisibleItems && (
            <div className="d-flex justify-content-between flex-row mt-4">
              <div className="borderekjthrku"></div>
              <div className="show-more" onClick={() => setShowAll(!showAll)}>
                {showAll ? "SHOW LESS" : "SHOW MORE"}
              </div>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Brands;
