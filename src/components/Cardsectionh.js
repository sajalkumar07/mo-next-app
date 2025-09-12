import React, { useState, useRef, useEffect } from "react";
import { Link } from "react-router-dom";
import seater from "../Images/icons/seat.png";
import petrol from "../Images/icons/gas.png";
import manual from "../Images/icons/machin.png";
import ncap from "../Images/icons/privi.png";
import Skeleton from "react-loading-skeleton";

const Cardsection = ({ newcardData, rtoData }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const cardsSectionRef = useRef(null);

  const handlePrevious = () => {
    if (cardsSectionRef.current) {
      const cardWidth = cardsSectionRef.current.children[0]?.offsetWidth || 349;
      const prevIndex = currentIndex - 1;

      if (prevIndex >= 0) {
        cardsSectionRef.current.scrollTo({
          left:
            prevIndex * cardWidth -
            cardsSectionRef.current.offsetWidth / 2 +
            cardWidth / 2,
          behavior: "smooth",
        });
        setCurrentIndex(prevIndex);
      }
    }
  };

  const handleNext = () => {
    if (cardsSectionRef.current) {
      const cardWidth = cardsSectionRef.current.children[0]?.offsetWidth || 349;
      const nextIndex = currentIndex + 1;

      if (nextIndex < newcardData.length) {
        cardsSectionRef.current.scrollTo({
          left:
            nextIndex * cardWidth -
            cardsSectionRef.current.offsetWidth / 2 +
            cardWidth / 2,
          behavior: "smooth",
        });
        setCurrentIndex(nextIndex);
      }
    }
  };
  const formatCurrency = (value) => {
    if (value >= 1e7) {
      return `${(value / 1e7).toFixed(2)} Crore`;
    } else if (value >= 1e5) {
      return `${(value / 1e5).toFixed(2)} Lakhs`;
    } else {
      return new Intl.NumberFormat("en-IN").format(value);
    }
  };

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    return savedBookmarks || [];
  });

  const isBookmarked = (id) => bookmarkedIds.includes(id);

  const toggleBookmark = (id) => {
    const updatedBookmarks = isBookmarked(id)
      ? bookmarkedIds.filter((bookmarkId) => bookmarkId !== id)
      : [...bookmarkedIds, id];

    setBookmarkedIds(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  };
  const uniqueCardData = Array.from(
    new Set(newcardData.map((card) => card._id))
  ).map((id) => {
    return newcardData.find((card) => card._id === id);
  });

  const getLocationFromLocalStorage = () => {
    const locationString = localStorage.getItem("location");
    return locationString ? JSON.parse(locationString) : null;
  };

  const location = getLocationFromLocalStorage();

  const state = location && location.city ? location.city : "";

  const parseList = (input) => {
    if (Array.isArray(input)) {
      return input.join(" | "); // Handle array case
    }

    if (typeof input === "number") {
      return input.toString(); // Return number as a string without '|'
    }

    // Handle HTML string case
    const parser = new DOMParser();
    const doc = parser.parseFromString(input, "text/html");
    const items = doc.querySelectorAll("ul li, p");
    const extractedText = Array.from(items).map((item) =>
      item.textContent.trim()
    );

    return extractedText.length > 1
      ? extractedText.join(" | ") + " |"
      : extractedText.join("");
  };

  useEffect(() => {
    // Function to update the current index based on the scroll position
    const updateIndexOnScroll = () => {
      if (cardsSectionRef.current) {
        const cardWidth =
          cardsSectionRef.current.children[0]?.offsetWidth || 349;
        const scrollLeft = cardsSectionRef.current.scrollLeft;
        const newIndex = Math.floor((scrollLeft + cardWidth / 2) / cardWidth);
        setCurrentIndex(newIndex);
      }
    };

    // Add scroll event listener
    const scrollContainer = cardsSectionRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", updateIndexOnScroll);
    }

    // Cleanup the scroll event listener on unmount
    return () => {
      if (scrollContainer) {
        scrollContainer.removeEventListener("scroll", updateIndexOnScroll);
      }
    };
  }, []);

  // console.log(newcardData)

  const calculateOnRoadPrice = (carPrice, fuelType) => {
    const price = parseFloat(carPrice) || 0;

    if (!Array.isArray(rtoData) || rtoData.length === 0) {
      console.warn("No RTO data available. Returning base price.");
      return price;
    }

    // Normalize fuelType to uppercase for safe comparison
    const fuel = (fuelType || "").toUpperCase();

    // Find applicable RTO slab by price + fuelType match
    const applicableRTOdata = rtoData.find(
      (rto) =>
        price >= parseFloat(rto.startPrice) &&
        price <= parseFloat(rto.endPrice) &&
        (rto.fuelType || "").toUpperCase() === fuel
    );

    if (!applicableRTOdata) {
      console.warn("No matching RTO slab found. Returning base price.");
      return price;
    }

    const {
      rtoPercentage = 0,
      insurancePercentage = 0,
      fastag = 0,
      hypethecationCharges = 0,
      others = 0,
      amount = 0,
    } = applicableRTOdata;

    const rtoCharges = (price * parseFloat(rtoPercentage)) / 100 || 0;
    const insuranceCost = (price * parseFloat(insurancePercentage)) / 100 || 0;
    const fastTag = parseFloat(fastag) || 0;
    const hypothecation = parseFloat(hypethecationCharges) || 0;
    const otherCharges = parseFloat(others) || 0;
    const amountt = parseFloat(amount) || 0;

    // Safety = 2% of either rtoCharges or amount
    const safetyCharges =
      amountt <= 1 ? (rtoCharges * 2) / 100 : (amountt * 2) / 100;

    // Luxury tax: 1% if price > 10L
    const luxuryTax = price > 999999 ? price / 100 : 0;

    const finalPrice =
      price +
      rtoCharges +
      luxuryTax +
      insuranceCost +
      fastTag +
      hypothecation +
      amountt +
      safetyCharges +
      otherCharges;

    return finalPrice;
  };

  return (
    <>
      <div className="rishtleft">
        <button
          className="slider_btn"
          onClick={handlePrevious}
          disabled={currentIndex === 0}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsLink="http://www.w3.org/1999/xlink"
          >
            <mask
              id="mask0_2140_6237"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="13"
              height="13"
            >
              <rect
                width="11.3684"
                height="11.3684"
                transform="matrix(4.37114e-08 1 1 -4.37114e-08 0.736328 0.96875)"
                fill="url(#pattern0_2140_6237)"
              />
            </mask>
            <g mask="url(#mask0_2140_6237)">
              <rect
                width="14.2105"
                height="12.7895"
                transform="matrix(-1 0 0 1 13.5254 -0.453125)"
                fill="white"
              />
            </g>
            <defs>
              <pattern
                id="pattern0_2140_6237"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlinkHref="#image0_2140_6237"
                  transform="scale(0.0078125)"
                />
              </pattern>
              <image
                id="image0_2140_6237"
                width="128"
                height="128"
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAdbAAAHWwEVi0IEAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAASBQTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7v9mSAAAAF90Uk5TAAoLDA0ODxAREhMUGUBER0xPW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f5CSmJ2fpaaoub6/wMHCw8TFxsfIycrLzM3Oz9DR0tbX2Ofs7/H8/f7Rve9dAAACrklEQVR42u2a11bbQBRFx4CLbAjV9N57rymAaaZ3EjDG+v+/yBBIQD5jWWXmKg93P1mjO7O3X7y8tCQEwzAMwzAMwzAMw4QjFovSntx8KBYfNpNR+Zse7T88NkXjbyna7xRbovC3vtj/eGmN1h9FQZvDLwvaaP3ZMj91AfplQZbO367wy4L2aP10BR0V/LKgg8LfWdEvCzqj9VMUdLn6ZUGXYX/JrkLJaEE3+O/voaDbnL8H/ZkMFvRQ+oWgK+gF/13mdT1zBwW9lH6qgj7w36b/3kvfQkGfbn+/i19Z0E/pN18wAP6btHMifQMFA/r8g1X9yoJBg34LpyxjBUPgv7ZUc9Y1FAxp8dve/KoCW0PBMBx6ZVWata5geDisfwT9qcrTKSwYofTrLxiF4y5T7jtSl7BlNLh/zLdfWTCm0e/hWURSW8E4HHTh6VlI8gI2jgfxTwT0KwsmdPjPPT8LSp6HL5gM4VcWTPrzT6E/4Wd/AgumwvnPEv6+QeIsTMF0aL+yYNrr3hnYeurbLwtO4ZgZSn/wgln0x4P9ksWxYLb6rjnYdBLQLwtO4LA5Sn+QgnnYcBzCLwuO4cB5t/kFzX5lwYIvf50ISZ2PgkUYzYf2y4I8HLuonlwy4lcWLHnzH2nxy4IjLwXLxvzKguXymRX01wpt1GLBSjX/oUa/LDh0L1g17FcWrH7cXYObB5r9suAAJGuUfreCdbixXyMMULMPovXX9SyRX1mQFaK+QOVXFRTqxUb52p4xvyzYK7dtiDyhX1GQF8/OhZxRvyzIOX3P4qfTb/x9hJiz4Jf4TusvL/ghvny62iV5HyO2+0nZKMRXYr+j4Ju8jG+/fS5tkb2PEtt6f/i6/faXtzlXsJ92GgQhDTtPdiHX/LGQFuREoGQYhmEYhmEYhmH+T34D/Sg0XzsvtokAAAAASUVORK5CYII="
              />
            </defs>
          </svg>
        </button>
        <button
          className="slider_btn"
          onClick={handleNext}
          disabled={currentIndex === newcardData.length - 2}
        >
          <svg
            width="13"
            height="13"
            viewBox="0 0 13 13"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            xmlnsLink="http://www.w3.org/1999/xlink"
          >
            <mask
              id="mask0_2140_6242"
              style={{ maskType: "alpha" }}
              maskUnits="userSpaceOnUse"
              x="0"
              y="0"
              width="13"
              height="13"
            >
              <rect
                x="12.0859"
                y="0.96875"
                width="11.3684"
                height="11.3684"
                transform="rotate(90 12.0859 0.96875)"
                fill="url(#pattern0_2140_6242)"
              />
            </mask>
            <g mask="url(#mask0_2140_6242)">
              <rect
                x="-0.703125"
                y="-0.453125"
                width="14.2105"
                height="12.7895"
                fill="white"
              />
            </g>
            <defs>
              <pattern
                id="pattern0_2140_6242"
                patternContentUnits="objectBoundingBox"
                width="1"
                height="1"
              >
                <use
                  xlinkHref="#image0_2140_6242"
                  transform="scale(0.0078125)"
                />
              </pattern>
              <image
                id="image0_2140_6242"
                width="128"
                height="128"
                preserveAspectRatio="none"
                xlinkHref="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAIAAAACACAMAAAD04JH5AAAAA3NCSVQICAjb4U/gAAAACXBIWXMAAAdbAAAHWwEVi0IEAAAAGXRFWHRTb2Z0d2FyZQB3d3cuaW5rc2NhcGUub3Jnm+48GgAAASBQTFRF////AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA7v9mSAAAAF90Uk5TAAoLDA0ODxAREhMUGUBER0xPW1xdXl9gYWJjZGVmZ2hpamtsbW5vcHFyc3R1dnd4eXp7fH1+f5CSmJ2fpaaoub6/wMHCw8TFxsfIycrLzM3Oz9DR0tbX2Ofs7/H8/f7Rve9dAAACrklEQVR42u2a11bbQBRFx4CLbAjV9N57rymAaaZ3EjDG+v+/yBBIQD5jWWXmKg93P1mjO7O3X7y8tCQEwzAMwzAMwzAMw4QjFovSntx8KBYfNpNR+Zse7T88NkXjbyna7xRbovC3vtj/eGmN1h9FQZvDLwvaaP3ZMj91AfplQZbO367wy4L2aP10BR0V/LKgg8LfWdEvCzqj9VMUdLn6ZUGXYX/JrkLJaEE3+O/voaDbnL8H/ZkMFvRQ+oWgK+gF/13mdT1zBwW9lH6qgj7w36b/3kvfQkGfbn+/i19Z0E/pN18wAP6btHMifQMFA/r8g1X9yoJBg34LpyxjBUPgv7ZUc9Y1FAxp8dve/KoCW0PBMBx6ZVWata5geDisfwT9qcrTKSwYofTrLxiF4y5T7jtSl7BlNLh/zLdfWTCm0e/hWURSW8E4HHTh6VlI8gI2jgfxTwT0KwsmdPjPPT8LSp6HL5gM4VcWTPrzT6E/4Wd/AgumwvnPEv6+QeIsTMF0aL+yYNrr3hnYeurbLwtO4ZgZSn/wgln0x4P9ksWxYLb6rjnYdBLQLwtO4LA5Sn+QgnnYcBzCLwuO4cB5t/kFzX5lwYIvf50ISZ2PgkUYzYf2y4I8HLuonlwy4lcWLHnzH2nxy4IjLwXLxvzKguXymRX01wpt1GLBSjX/oUa/LDh0L1g17FcWrH7cXYObB5r9suAAJGuUfreCdbixXyMMULMPovXX9SyRX1mQFaK+QOVXFRTqxUb52p4xvyzYK7dtiDyhX1GQF8/OhZxRvyzIOX3P4qfTb/x9hJiz4Jf4TusvL/ghvny62iV5HyO2+0nZKMRXYr+j4Ju8jG+/fS5tkb2PEtt6f/i6/faXtzlXsJ92GgQhDTtPdiHX/LGQFuREoGQYhmEYhmEYhmH+T34D/Sg0XzsvtokAAAAASUVORK5CYII="
              />
            </defs>
          </svg>
        </button>
      </div>
      <div className="container">
        {newcardData.length === 0 ? (
          <div className="no-cars-message">
            <Skeleton
              height={199} // Match the height of your image
              width="320px" // Match the width of your image
              baseColor="#D8D8D8" // Dark gray base color
              highlightColor="#666" // Slightly lighter gray for the shimmer effect
              style={{ borderRadius: "8px", marginTop: "25px" }}
            />
            {/* <p>No cars avilable!</p> */}
          </div>
        ) : (
          <div className="cards_section" ref={cardsSectionRef}>
            {newcardData.map((card, index) => {
              const brandText =
                typeof card.brand === "string"
                  ? card.brand
                  : card?.brand?.name || "";

              // Approximate visual width by giving W and M more weight
              const visualWeight = brandText.replace(/[WM]/g, "WW").length;
              // const onRoadPrice = calculateOnRoadPrice(card.lowestExShowroomPrice); // Use per car
              const getFirstFuelType = (fuelData) => {
                if (Array.isArray(fuelData)) {
                  return fuelData[0]; // already parsed, return first element
                }

                if (typeof fuelData === "string") {
                  const match = fuelData.match(/<li>(.*?)<\/li>/i);
                  if (match && match[1]) return match[1];
                  return fuelData; // fallback: plain string like "Petrol"
                }

                return ""; // fallback for unexpected types
              };

              const fuelType = getFirstFuelType(card.fueltype);
              const onRoadPrice = calculateOnRoadPrice(
                card.lowestExShowroomPrice,
                fuelType
              );

              const carName = String(card.carname);
              let firstPart = carName;
              let secondPart = null;

              if (carName.length > 14) {
                const lastSpaceBefore14 = carName.lastIndexOf(" ", 14);
                if (lastSpaceBefore14 !== -1) {
                  firstPart = carName.slice(0, lastSpaceBefore14);
                  secondPart = carName.slice(lastSpaceBefore14 + 1);
                }
              }
              return (
                <section className="main_card_body" key={card.id}>
                  <div className="main_card">
                    <div className="bookmarkRibbon">
                      <div>
                        <svg
                          onClick={() => toggleBookmark(card._id)}
                          aria-label={
                            isBookmarked(card._id) ? "Unsave" : "Save"
                          }
                          height="40"
                          role="img"
                          viewBox="0 0 24 40"
                          width="24"
                          color={
                            isBookmarked(card._id) ? "var(--red)" : "#818181"
                          }
                          fill={isBookmarked(card._id) ? "var(--red)" : "none"}
                        >
                          <polygon
                            points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="1"
                          ></polygon>
                        </svg>
                      </div>
                    </div>
                    <div className="inside_card_title onlyphoneme ml-3 gap-1 mr-3">
                      <span className="mt-3">
                        <span
                          className="mt-3 fontejiri"
                          style={{ color: "var(--black)" }}
                        >
                          ₹{" "}
                        </span>
                        <span className="fontejiri">
                          {" "}
                          {formatCurrency(onRoadPrice)}
                        </span>
                      </span>
                      <div className="d-flex flex-column mt-3">
                        <div className="thecolo font-weight-bold">
                          {rtoData && rtoData.length > 0
                            ? "Onwards On-Road"
                            : "Ex-Showroom"}
                        </div>
                        <span className="thecolo font-weight-bold">
                          {" "}
                          {state}
                        </span>
                      </div>
                    </div>
                    {card.movrating && (
                      <div className="rating-inno-new rounded-1 ml-3">
                        <span>{card.movrating}</span> &nbsp;{" "}
                        <span>
                          {" "}
                          <svg
                            className="matstatt"
                            width="10"
                            height="8"
                            viewBox="0 0 10 8"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <g clip-path="url(#clip0_2153_4969)">
                              <path
                                d="M2.46172 7.05764C2.23095 7.13792 1.96909 6.99723 2.01572 6.81763L2.51193 4.89992L0.405723 3.53928C0.209032 3.41197 0.311263 3.17925 0.574913 3.15411L3.50316 2.87193L4.80886 1.11761C4.92663 0.959494 5.24529 0.959494 5.36306 1.11761L6.66876 2.87193L9.59701 3.15411C9.86066 3.17925 9.96289 3.41197 9.7656 3.53928L7.65999 4.89992L8.1562 6.81763C8.20283 6.99723 7.94097 7.13792 7.71021 7.05764L5.08506 6.14298L2.46172 7.05764Z"
                                fill="#FCFCFC"
                              />
                            </g>
                            <defs>
                              <clipPath id="clip0_2153_4969">
                                <rect
                                  x="0.301392"
                                  y="0.795898"
                                  width="9.56554"
                                  height="6.48696"
                                  rx="3.24348"
                                  fill="white"
                                />
                              </clipPath>
                            </defs>
                          </svg>
                        </span>
                      </div>
                    )}

                    <Link
                      to={`/product/${String(card.carname).replace(
                        /\s+/g,
                        "-"
                      )}/${card._id}`}
                    >
                      <div className="inside_card">
                        <div className="inside_card_title thedeskname">
                          {typeof card.brand === "string"
                            ? card.brand
                            : card?.brand?.name || ""}
                          &nbsp;
                          <span>{String(card.carname)}</span>
                        </div>
                        <img
                          className="main_card_image thelandingpageimage"
                          src={`${process.env.NEXT_PUBLIC_API}/productImages/${card.heroimage}`}
                          crossorigin="anonymous"
                          alt={card.heroimagename}
                        />
                        <section className="info_card">
                          <div
                            className="info_card_variants"
                            style={{ visibility: "hidden" }}
                          >
                            Variants{" "}
                            <span style={{ color: "var(--red)" }}>
                              {card.variant}
                            </span>
                          </div>
                          <div
                            className="thedeskname"
                            style={{ color: "#B1081A", fontWeight: "600" }}
                          >
                            <span style={{ color: "var(--black)" }}>₹ </span>{" "}
                            <span>{formatCurrency(card.onRoadPrice)}</span>
                          </div>
                          <div className="onlydesptop">
                            {rtoData && rtoData.length > 0
                              ? "On-Road"
                              : "Ex-Showroom"}{" "}
                            {state}
                          </div>
                        </section>
                        {visualWeight > 12 ? (
                          <div className="inside_card thetextse ml-1 onlyphoneme flex flex-column 222">
                            <div className="inside_card_title text-gray-600 font-semibold whitespace-nowrap">
                              {brandText}
                            </div>
                            <div className="inside_card_title text-red-700 font-semibold pleasemargo">
                              <span>{String(card.carname)}</span>
                            </div>
                          </div>
                        ) : (
                          <div className="inside_card thetextse ml-1 onlyphoneme flex flex-row gap-1">
                            <div className="inside_card_title text-gray-600 font-semibold whitespace-nowrap">
                              {brandText}
                            </div>
                            <div className="inside_card_title text-red-700 font-semibold whitespace-nowrap">
                              <span>{String(card.carname)}</span>
                            </div>
                          </div>
                        )}
                      </div>
                    </Link>
                  </div>
                  <section className="main_card_info">
                    <div className="side_info">
                      <img
                        className="icon_image"
                        src={seater}
                        alt="Seater Icon"
                      />
                      <div className="side_info_inline">
                        {parseList(card.seater)} Seater
                      </div>
                    </div>
                    <div className="side_info">
                      <img
                        className="icon_image"
                        src={petrol}
                        alt="Fuel Icon"
                      />
                      <div className="side_info_inline">
                        {parseList(card.fueltype)}
                      </div>
                    </div>
                    <div className="side_info">
                      <img
                        className="icon_image"
                        src={manual}
                        alt="Transmission Icon"
                      />
                      <div className="side_info_inline">
                        {parseList(card.transmissiontype)}
                      </div>
                    </div>
                    <div className="side_info">
                      <img
                        className="icon_image"
                        src={ncap}
                        alt="Safety Icon"
                      />
                      <div className="side_info_inline">
                        Safety - {card.NCAP}
                      </div>
                    </div>
                  </section>
                </section>
              );
            })}
          </div>
        )}
      </div>
    </>
  );
};

export default Cardsection;
