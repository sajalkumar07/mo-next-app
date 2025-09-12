import React, { useState, useEffect, useRef } from "react";
import { useParams } from "react-router-dom";

const ColorVariants = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [singleCardData, setSingleCardData] = useState([]);
  const [selectedColor, setSelectedColor] = useState("");
  const params = useParams();

  const colorVariants = [
    { image: "heroimage", name: "heroimagename", colorCode: "#FF5733" },
    { image: "grayimage", name: "grayname", colorCode: "#808080" },
    { image: "redimage", name: "redname", colorCode: "#FF0000" },
    { image: "blueimage", name: "blueimagename", colorCode: "#0000FF" },
    { image: "brownimage", name: "brownimagename", colorCode: "#A52A2A" },
    { image: "yellowimage", name: "yellowimagename", colorCode: "#FFFF00" },
    { image: "purpleimage", name: "purpleimagename", colorCode: "#800080" },
    { image: "whiteimage", name: "whitename", colorCode: "#FFFFFF" },
  ];

  // Fetch data from API based on params.id
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${params.id}`
        );
        const data = await response.json();
        setSingleCardData(data);
        console.log("Fetched data:", data); // Log the fetched data
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  const cardsSectionRef = useRef(null);

  // Handle next button click (scroll right)
  const handleNext = () => {
    if (cardsSectionRef.current) {
      const cardWidth = cardsSectionRef.current.children[0]?.offsetWidth || 0; // Get the width of the first card
      cardsSectionRef.current.scrollBy({ left: cardWidth, behavior: "smooth" });
    }
  };

  // Handle previous button click (scroll left)
  const handlePrevious = () => {
    if (cardsSectionRef.current) {
      const cardWidth = cardsSectionRef.current.children[0]?.offsetWidth || 0; // Get the width of the first card
      cardsSectionRef.current.scrollBy({
        left: -cardWidth,
        behavior: "smooth",
      });
    }
  };

  // Change the selected color
  const handleColorChange = (colorCode) => {
    console.log("Selected color:", colorCode); // Log selected color
    setSelectedColor(colorCode);
  };

  return (
    <section className="youtube-viddeoleft d-flex flex-column">
      <div className="mainsection-prodfdf withmob-1mm">
        <div className="label withmob-5mm">
          <p className="varienttxt mt-3 lefttext-mob w-100">
            <span className="text-wrapper">COLOR</span>
            <span className="span">&nbsp;</span>
            <span className="text-wrapper-2">VARIANTS</span>
          </p>
        </div>
        <div className="linesfkbg"></div>
        <div className="chfchfcfch">
          {/* Color filter buttons */}
          <div className="color-container d-flex">
            {colorVariants.map((variant) => (
              <div
                key={variant.colorCode}
                className={`side-colors ${
                  selectedColor === variant.colorCode ? "selected" : ""
                }`}
                style={{ backgroundColor: variant.colorCode }}
                onClick={() => handleColorChange(variant.colorCode)}
              ></div>
            ))}
            {selectedColor && (
              <div
                className="selected-color"
                style={{
                  backgroundColor: selectedColor,
                  marginLeft: "auto",
                  marginRight: "auto",
                }}
              ></div>
            )}
          </div>
        </div>
      </div>

      <section>
        <div className="container">
          <button className="slider_btn" onClick={handlePrevious}>
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>
          <div className="card-bet" ref={cardsSectionRef}>
            {colorVariants.map((variant, index) => {
              const imageSrc = singleCardData[variant.image];

              if (imageSrc) {
                return (
                  <section key={variant.image} className=" main_card_body-2">
                    <div className="main_card insidecolorcard">
                      <div className="insidecard-image-out">
                        <img
                          className="main_card_image plusnew"
                          src={`${process.env.NEXT_PUBLIC_API}/productImages/${imageSrc}`}
                          alt={singleCardData[variant.name]}
                          crossOrigin="anonymous"
                        />
                      </div>
                      <p className="color-card-txt">
                        {singleCardData[variant.name]}
                      </p>
                    </div>
                  </section>
                );
              }
              return null;
            })}
          </div>
          <button className="slider_btn" onClick={handleNext}>
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </button>
        </div>
      </section>
    </section>
  );
};

export default ColorVariants;
