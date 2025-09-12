import React, { useEffect, useRef, useState } from "react";
import Header from "../Homepage/Structure/header";
import CarSection from "../Variantpage/Carsection";
import Adbanner2 from "../Productpage/Structure/Adbanner2";
import Youtubevideo from "../Variantpage/youtubevideo";
import CarPros from "../Variantpage/pros_cons";
import TechSpeci from "../Variantpage/Technicalspec.js";
import ColorsVariants from "../Variantpage/colorvariants";
import Mileage from "../Productpage/Structure/mileage";
import FuelCost from "../Variantpage/fuelcost";
import Reviews from "../Variantpage/reviews";
import History from "../Productpage/Structure/myhistory";
import Adbanner3 from "../Productpage/Structure/Adbanner3";
import Newsupdate from "../Homepage/Structure/newsupdate";
import Factfile from "../Variantpage/Factfile.js";
import CarComparison from "../Variantpage/comparisionVar.js";
import Consult from "../Productpage/Structure/consultus";
import FeaturedCar from "../Homepage/Structure/featuredcars";
import Footer from "../Homepage/Structure/footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AreYouMissing from "../Variantpage/AreYouMissing.js";
import StillConfused from "../Variantpage/StillConfused.js";

export const Overview = ({
  youtubeVideoRef,
  summaryRef,
  specsRef,
  keyFeaturesRef,
  compareRef,
  prosConsRef,
  featuredCarRef,
  mileageRef,
  fuelCalcRef,
  newsRef,
  reviewRef,
  downloadRef,
  areYouMissingRef,
}) => {
  const [activeSection, setActiveSection] = useState("Overview");
  const navContainerRef = useRef(null);
  const activeButtonRef = useRef(null);

  // Function to scroll the active button into view
  const scrollActiveButtonIntoView = () => {
    if (activeButtonRef.current && navContainerRef.current) {
      const container = navContainerRef.current;
      const activeButton = activeButtonRef.current;

      // Calculate the button's position relative to the container
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const containerWidth = container.clientWidth;

      // Calculate the desired scroll position to center the active button
      const desiredScrollLeft =
        buttonLeft - containerWidth / 2 + buttonWidth / 2;

      // Smooth scroll to the calculated position
      container.scrollTo({
        left: Math.max(0, desiredScrollLeft),
        behavior: "smooth",
      });
    }
  };

  const handleScrollVideos = () => {
    if (youtubeVideoRef && youtubeVideoRef.current) {
      const offset = youtubeVideoRef.current.offsetTop;
      window.scrollTo({
        top: offset - 150, // Increased offset for better positioning
        behavior: "smooth",
      });
      setActiveSection("Videos");
    }
  };

  const handleScrollProsCons = () => {
    if (prosConsRef && prosConsRef.current) {
      const offset = prosConsRef.current.offsetTop;
      window.scrollTo({
        top: offset - 150,
        behavior: "smooth",
      });
      setActiveSection("Pros & Cons");
    }
  };

  const handleScrollSummary = () => {
    if (summaryRef && summaryRef.current) {
      const offset = summaryRef.current.offsetTop;
      window.scrollTo({
        top: offset - 150,
        behavior: "smooth",
      });
      setActiveSection("Summary");
    }
  };

  const handleScrollSpecs = () => {
    if (specsRef && specsRef.current) {
      const offset = specsRef.current.offsetTop;
      window.scrollTo({
        top: offset - 150,
        behavior: "smooth",
      });
      setActiveSection("Specs");
    }
  };

  const handleScrollFeatures = () => {
    if (keyFeaturesRef && keyFeaturesRef.current) {
      const offset = keyFeaturesRef.current.offsetTop;
      window.scrollTo({
        top: offset - 150,
        behavior: "smooth",
      });
      setActiveSection("Key Features");
    }
  };

  const handleScrollAreYouMissing = () => {
    if (areYouMissingRef && areYouMissingRef.current) {
      const offset = areYouMissingRef.current.offsetTop;
      window.scrollTo({
        top: offset - 150,
        behavior: "smooth",
      });
      setActiveSection("Are We Missing");
    }
  };

  const handleScrollCompare = () => {
    if (compareRef && compareRef.current) {
      const offset = compareRef.current.offsetTop;
      window.scrollTo({
        top: offset - 150,
        behavior: "smooth",
      });
      setActiveSection("Comparison");
    }
  };

  const handleScrollFeaturedCar = () => {
    if (featuredCarRef && featuredCarRef.current) {
      const offset = featuredCarRef.current.offsetTop;
      window.scrollTo({
        top: offset - 150,
        behavior: "smooth",
      });
      setActiveSection("Featured Car");
    }
  };

  const handleScrollMileage = () => {
    if (mileageRef && mileageRef.current) {
      const offset = mileageRef.current.offsetTop;
      window.scrollTo({
        top: offset - 150,
        behavior: "smooth",
      });
      setActiveSection("Mileage");
    }
  };

  const handleScrollFuelCalc = () => {
    if (fuelCalcRef && fuelCalcRef.current) {
      const offset = fuelCalcRef.current.offsetTop;
      window.scrollTo({
        top: offset - 150,
        behavior: "smooth",
      });
      setActiveSection("Fuel Calculator");
    }
  };

  const handleScrollBrochure = () => {
    if (downloadRef && downloadRef.current) {
      const offset = downloadRef.current.offsetTop;
      window.scrollTo({
        top: offset - 150,
        behavior: "smooth",
      });
      setActiveSection("Brochure");
    }
  };

  const handleScrollNews = () => {
    if (newsRef && newsRef.current) {
      const offset = newsRef.current.offsetTop;
      window.scrollTo({
        top: offset - 150,
        behavior: "smooth",
      });
      setActiveSection("News");
    }
  };

  const handleScrollReview = () => {
    if (reviewRef && reviewRef.current) {
      const offset = reviewRef.current.offsetTop;
      window.scrollTo({
        top: offset - 150,
        behavior: "smooth",
      });
      setActiveSection("Owner Review");
    }
  };

  const handleScrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
    setActiveSection("Overview");
  };

  // Auto-detect active section based on scroll position
  useEffect(() => {
    const handleScroll = () => {
      // Define sections in the exact order they appear on the page
      const sections = [
        { ref: youtubeVideoRef, name: "Videos" },
        { ref: prosConsRef, name: "Pros & Cons" },
        { ref: summaryRef, name: "Summary" },
        { ref: keyFeaturesRef, name: "Key Features" },
        { ref: specsRef, name: "Specs" },
        { ref: areYouMissingRef, name: "Are We Missing" },
        { ref: mileageRef, name: "Mileage" },
        { ref: fuelCalcRef, name: "Fuel Calculator" },
        { ref: downloadRef, name: "Brochure" },
        { ref: reviewRef, name: "Owner Review" },
        { ref: newsRef, name: "News" },
        { ref: compareRef, name: "Comparison" },
        { ref: featuredCarRef, name: "Featured Car" },
      ];

      const scrollPosition = window.scrollY + 200;

      // Check if we're at the top
      if (window.scrollY < 100) {
        setActiveSection("Overview");
        return;
      }

      // Find the current section based on scroll position
      for (let i = sections.length - 1; i >= 0; i--) {
        const section = sections[i];
        if (section.ref?.current) {
          const sectionTop = section.ref.current.offsetTop;
          if (scrollPosition >= sectionTop) {
            setActiveSection(section.name);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [
    youtubeVideoRef,
    prosConsRef,
    summaryRef,
    specsRef,
    keyFeaturesRef,
    areYouMissingRef,
    mileageRef,
    fuelCalcRef,
    downloadRef,
    reviewRef,
    newsRef,
    compareRef,
    featuredCarRef,
  ]);

  // Auto-scroll the navigation bar when active section changes
  useEffect(() => {
    scrollActiveButtonIntoView();
  }, [activeSection]);

  const CarDetailNav = [
    {
      title: "Overview",
      onClick: handleScrollToTop,
    },
    {
      title: "Videos",
      onClick: handleScrollVideos,
    },
    {
      title: "Pros & Cons",
      onClick: handleScrollProsCons,
    },
    {
      title: "Summary",
      onClick: handleScrollSummary,
    },
    {
      title: "Key Features",
      onClick: handleScrollFeatures,
    },
    {
      title: "Specs",
      onClick: handleScrollSpecs,
    },
    {
      title: "Are We Missing",
      onClick: handleScrollAreYouMissing,
    },
    {
      title: "Mileage",
      onClick: handleScrollMileage,
    },
    {
      title: "Fuel Calculator",
      onClick: handleScrollFuelCalc,
    },
    {
      title: "Brochure",
      onClick: handleScrollBrochure,
    },
    {
      title: "Owner Review",
      onClick: handleScrollReview,
    },
    {
      title: "News",
      onClick: handleScrollNews,
    },
    {
      title: "Comparison",
      onClick: handleScrollCompare,
    },
    {
      title: "Featured Car",
      onClick: handleScrollFeaturedCar,
    },
  ];

  return (
    <div className="w-full py-4 fixed top-30 z-50 bg-white shadow-md border-b border-gray-200 block md:hidden">
      <div
        ref={navContainerRef}
        className="overflow-x-auto scrollbar-hide"
        style={{
          scrollBehavior: "smooth",
        }}
      >
        <div className="flex space-x-4 px-4 py-2 min-w-max">
          {CarDetailNav.map((item, index) => (
            <div
              key={index}
              ref={activeSection === item.title ? activeButtonRef : null}
              onClick={item.onClick}
              className={`flex-shrink-0 rounded-sm w-[90px] h-[25px] flex justify-center items-center text-center cursor-pointer shadow-md md:w-auto md:height-auto transition-all duration-200 ${
                activeSection === item.title
                  ? "bg-black text-white"
                  : "bg-white text-[#8B8A8A] border border-gray-300 hover:bg-gray-50"
              }`}
            >
              <div className="font-[Montserrat] font-semibold md:text-lg">
                {item.title}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

const Variantpage = () => {
  const queryClient = new QueryClient();

  // Create refs for each section
  const overviewRef = useRef(null);
  const youtubeVideoRef = useRef(null);
  const prosConsRef = useRef(null);
  const summaryRef = useRef(null);
  const specsRef = useRef(null);
  const keyFeaturesRef = useRef(null);
  const mileageRef = useRef(null);
  const fuelCalcRef = useRef(null);
  const downloadRef = useRef(null);
  const reviewRef = useRef(null);
  const newsRef = useRef(null);
  const compareRef = useRef(null);
  const featuredCarRef = useRef(null);
  const areYouMissingRef = useRef(null);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      <div className=""></div>
      <Overview
        youtubeVideoRef={youtubeVideoRef}
        summaryRef={summaryRef}
        specsRef={specsRef}
        keyFeaturesRef={keyFeaturesRef}
        compareRef={compareRef}
        prosConsRef={prosConsRef}
        featuredCarRef={featuredCarRef}
        mileageRef={mileageRef}
        fuelCalcRef={fuelCalcRef}
        newsRef={newsRef}
        reviewRef={reviewRef}
        areYouMissingRef={areYouMissingRef}
        downloadRef={downloadRef}
      />

      <CarSection ref={overviewRef} />
      <Youtubevideo
        ref={youtubeVideoRef}
        channelLink="https://www.youtube.com/channel/UCSXOsOIzeJqJb4h0QlimDww"
      />
      <Adbanner2 />
      <CarPros ref={prosConsRef} />
      <Factfile summaryRef={summaryRef} keyFeaturesRef={keyFeaturesRef} />
      <TechSpeci ref={specsRef} />
      <AreYouMissing ref={areYouMissingRef} />
      <Adbanner2 />
      <FuelCost
        downloadRef={downloadRef}
        fuelCalcRef={fuelCalcRef}
        mileageRef={mileageRef}
      />
      <Reviews ref={reviewRef} />
      <History />
      <Adbanner3 />
      <Newsupdate ref={newsRef} />
      <CarComparison ref={compareRef} />
      <FeaturedCar ref={featuredCarRef} />
      <Consult />
      <StillConfused />
    </QueryClientProvider>
  );
};

export default Variantpage;
