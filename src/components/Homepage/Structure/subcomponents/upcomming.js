import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";

import "./card.css";
import seater from "../../../../Images/icons/seat.png";
import petrol from "../../../../Images/icons/gas.png";
import manul from "../../../../Images/icons/machin.png";
import ncap from "../../../../Images/icons/privi.png";

const Upcoming = () => {
  const cardWidth = 400;
  const [currentIndex, setCurrentIndex] = useState(0); // Initialize the current index
  const [newcardData, setCardData] = useState([]);

  const handleNext = () => {
    setCurrentIndex(currentIndex + 1);
  };

  const handlePrevious = () => {
    setCurrentIndex(currentIndex - 1);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/upcoming`
        );
        const data = await response.json();
        setCardData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  const parseList = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const items = doc.querySelectorAll("p"); // Select <p> elements instead of <li>

    return Array.from(items).map((item) => item.textContent);
  };
  const handleBookmarkClick = (id) => {
    const bookmarks = JSON.parse(localStorage.getItem("bookmarks")) || [];

    if (bookmarks.includes(id)) {
      const updatedBookmarks = bookmarks.filter(
        (bookmarkId) => bookmarkId !== id
      );
      localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
    } else {
      bookmarks.push(id);
      localStorage.setItem("bookmarks", JSON.stringify(bookmarks));
    }
  };
  // const isBookmarked = (id) => {
  //   const bookmarks = JSON.parse(localStorage.getItem('bookmarks')) || [];
  //   return bookmarks.includes(id);
  // };

  const [bookmarkedIds, setBookmarkedIds] = useState(() => {
    const savedBookmarks = JSON.parse(localStorage.getItem("bookmarks"));
    return savedBookmarks || [];
  });

  const isBookmarked = (id) => {
    return bookmarkedIds.includes(id);
  };

  const toggleBookmark = (id) => {
    const updatedBookmarks = isBookmarked(id)
      ? bookmarkedIds.filter((bookmarkId) => bookmarkId !== id)
      : [...bookmarkedIds, id];

    setBookmarkedIds(updatedBookmarks);
    localStorage.setItem("bookmarks", JSON.stringify(updatedBookmarks));
  };

  return (
    <div className="container">
      <button
        className="slider_btn"
        onClick={handlePrevious}
        disabled={currentIndex === 0}
      >
        <ion-icon name="chevron-back-outline"></ion-icon>{" "}
      </button>
      <div className="cards_section">
        {newcardData.map((card, index) => (
          <section
            className="main_card_body"
            style={{
              transform: `translateX(-${currentIndex * cardWidth}px)`,
            }}
          >
            <div key={card.id} className="main_card">
              <div className="bookmarkRibbon">
                {" "}
                <div>
                  <div>
                    <div>
                      <svg
                        onClick={() => toggleBookmark(card._id)}
                        aria-label={isBookmarked(card._id) ? "Unsave" : "Save"}
                        class="x1lliihq"
                        // color="gray"
                        // fill="rgb(245, 245, 245)"
                        height="40"
                        role="img"
                        viewBox="0 0 24 40"
                        width="24"
                        color={
                          isBookmarked(card._id) ? "var(--red)" : "#818181"
                        }
                        fill={isBookmarked(card._id) ? "var(--red)" : "none"}
                      >
                        {/* <title>Save</title> */}
                        <polygon
                          points="20 21 12 13.44 4 21 4 3 20 3 20 21"
                          stroke="currentColor"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1"
                        ></polygon>
                      </svg>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                to={`/product/${card.carname.replace(/\s+/g, "-")}/${card._id}`}
              >
                <div className="inside_card">
                  <div className="inside_card_title">
                    <span>{card.carname}</span>
                  </div>
                  <img
                    className="main_card_image"
                    src={`${process.env.NEXT_PUBLIC_API}/productImages/${card.heroimage}`}
                    crossorigin="anonymous"
                    alt={card.heroimagename}
                  />
                  <div className="stars">{card.star}</div>
                  <section className="info_card">
                    <div className="info_card_variants">
                      Variants{" "}
                      <span style={{ color: "var(--red)" }}>
                        {card.variants}
                      </span>
                    </div>
                    <div style={{ color: "#B1081A", fontWeight: "600" }}>
                      <span style={{ color: "var(--black)" }}>₹</span>{" "}
                      {new Intl.NumberFormat("en-IN").format(
                        card.lowestExShowroomPrice
                      )}
                      - <span style={{ color: "var(--black)" }}>₹</span>{" "}
                      {new Intl.NumberFormat("en-IN").format(
                        card.highestExShowroomPrice
                      )}
                    </div>
                    <div>Ex-Showroom | On-Road</div>
                  </section>
                </div>
              </Link>
            </div>

            <section className="main_card_info">
              <div className="side_info">
                {" "}
                <img className="icon_image" src={seater} alt="Seater Icon" />
                <div className="side_info_inline">{parseList(card.seater)}</div>
              </div>
              <div className="side_info">
                {" "}
                <img
                  className="icon_image"
                  src={petrol}
                  alt="Petrol Icon"
                />{" "}
                <div className="side_info_inline">
                  <span>{parseList(card.fueltype)}</span>
                </div>
              </div>
              <div className="side_info">
                {" "}
                <img
                  className="icon_image"
                  src={manul}
                  alt="Manual Icon"
                />{" "}
                <div className="side_info_inline">
                  <span>{parseList(card.transmissiontype)}</span>
                </div>
              </div>
              <div className="side_info">
                {" "}
                <img className="icon_image" src={ncap} alt="NCAP Icon" />
                <div className="side_info_inline">
                  <span>NCAP:</span>
                  <span>{card.NCAP} Star</span>
                </div>
              </div>
            </section>
          </section>
        ))}
      </div>
      <button
        className="slider_btn"
        onClick={handleNext}
        disabled={currentIndex === newcardData.length - 2}
      >
        <ion-icon name="chevron-forward-outline"></ion-icon>
      </button>
    </div>
  );
};

export default Upcoming;
