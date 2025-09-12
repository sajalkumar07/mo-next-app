import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "../Homepage/Structure/header";
import Productsection from "../Productpage/Structure/productsection";
import Adbanner2 from "../Productpage/Structure/Adbanner2";
import Youtubevideo from "../Productpage/Structure/youtubevideo";
import CarPros from "../Productpage/Structure/pros_cons";
import Variants from "../Productpage/Structure/variants";
import ColorsVariants from "../Productpage/Structure/colorvariants";
import Mileage from "../Productpage/Structure/mileage";
import FuelCost from "../Productpage/Structure/fuelcost";
import Reviews from "../Productpage/Structure/reviews";
import History from "../Productpage/Structure/myhistory";
import Adbanner3 from "../Productpage/Structure/Adbanner3";
import Newsupdate from "../Homepage/Structure/newsupdate";
import Factfile from "../Homepage/Structure/Factfile.js";
import CarComparison from "../Productpage/Structure/CarComparisionProd.js";
import Consult from "../Productpage/Structure/consultus";
import FeaturedCar from "../Homepage/Structure/featuredcars";
import Footer from "../Homepage/Structure/footer";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

export const Overview = ({
  youtubeVideoRef,
  summaryRef,
  colorRef,
  mileageRef,
  fuleCostRef,
  newsRef,
  compareRef,
  prosConsRef,
  variantsRef,
  featuredCarRef,
  reviewRef,
  keyFeaturesRef,
  brochureRef,
}) => {
  const [activeSection, setActiveSection] = useState("Overview");
  const navContainerRef = useRef(null);
  const activeButtonRef = useRef(null);

  const CarDetailNav = [
    {
      title: "Overview",
      onClick: () => handleScrollToTop(),
    },
    {
      title: "Videos",
      onClick: () => handleScrollVideos(),
    },
    {
      title: "Pros & Cons",
      onClick: () => handleScrollProsCons(),
    },
    {
      title: "Summary",
      onClick: () => handleScrollSummary(),
    },
    {
      title: "Key Feature",
      onClick: () => handleScrollKeyFeature(),
    },
    {
      title: "Variants",
      onClick: () => handleScrollVarients(),
    },
    {
      title: "Color",
      onClick: () => handleScrollColor(),
    },
    {
      title: "Mileage",
      onClick: () => handleScrollMileage(),
    },
    {
      title: "Fuel Calculator",
      onClick: () => handleScrollFuelCost(),
    },
    {
      title: "Brochure",
      onClick: () => handleScrollBrochure(),
    },
    {
      title: "Owner Review",
      onClick: () => handleScrollReview(),
    },
    {
      title: "News",
      onClick: () => handleScrollNews(),
    },
    {
      title: "Compare",
      onClick: () => handleScrollCompare(),
    },
    {
      title: "Featured Car",
      onClick: () => handleScrollFeatredCar(),
    },
  ];

  // Function to scroll the active button into view
  const scrollActiveButtonIntoView = () => {
    if (activeButtonRef.current && navContainerRef.current) {
      const container = navContainerRef.current;
      const activeButton = activeButtonRef.current;

      const containerRect = container.getBoundingClientRect();
      const buttonRect = activeButton.getBoundingClientRect();

      // Calculate the button's position relative to the container
      const buttonLeft = activeButton.offsetLeft;
      const buttonWidth = activeButton.offsetWidth;
      const containerWidth = container.clientWidth;
      const scrollLeft = container.scrollLeft;

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
        top: offset - 100,
        behavior: "smooth",
      });
      setActiveSection("Videos");
    }
  };

  const handleScrollProsCons = () => {
    if (prosConsRef && prosConsRef.current) {
      const offset = prosConsRef.current.offsetTop;
      window.scrollTo({
        top: offset - 100,
        behavior: "smooth",
      });
      setActiveSection("Pros & Cons");
    }
  };

  const handleScrollSummary = () => {
    if (summaryRef && summaryRef.current) {
      const offset = summaryRef.current.offsetTop;
      window.scrollTo({
        top: offset - 100,
        behavior: "smooth",
      });
      setActiveSection("Summary");
    }
  };

  const handleScrollCompare = () => {
    if (compareRef && compareRef.current) {
      const offset = compareRef.current.offsetTop;
      window.scrollTo({
        top: offset - 100,
        behavior: "smooth",
      });
      setActiveSection("Compare");
    }
  };

  const handleScrollVarients = () => {
    if (variantsRef && variantsRef.current) {
      const offset = variantsRef.current.offsetTop;
      window.scrollTo({
        top: offset - 100,
        behavior: "smooth",
      });
      setActiveSection("Variants");
    }
  };

  const handleScrollFeatredCar = () => {
    if (featuredCarRef && featuredCarRef.current) {
      const offset = featuredCarRef.current.offsetTop;
      window.scrollTo({
        top: offset - 100,
        behavior: "smooth",
      });
      setActiveSection("Featured Car");
    }
  };

  const handleScrollColor = () => {
    if (colorRef && colorRef.current) {
      const offset = colorRef.current.offsetTop;
      window.scrollTo({
        top: offset - 100,
        behavior: "smooth",
      });
      setActiveSection("Color");
    }
  };

  const handleScrollMileage = () => {
    if (mileageRef && mileageRef.current) {
      const offset = mileageRef.current.offsetTop;
      window.scrollTo({
        top: offset - 100,
        behavior: "smooth",
      });
      setActiveSection("Mileage");
    }
  };

  const handleScrollFuelCost = () => {
    if (fuleCostRef && fuleCostRef.current) {
      const offset = fuleCostRef.current.offsetTop;
      window.scrollTo({
        top: offset - 100,
        behavior: "smooth",
      });
      setActiveSection("Fuel Calculator");
    }
  };

  const handleScrollNews = () => {
    if (newsRef && newsRef.current) {
      const offset = newsRef.current.offsetTop;
      window.scrollTo({
        top: offset - 100,
        behavior: "smooth",
      });
      setActiveSection("News");
    }
  };

  const handleScrollReview = () => {
    if (reviewRef && reviewRef.current) {
      const offset = reviewRef.current.offsetTop;
      window.scrollTo({
        top: offset - 100,
        behavior: "smooth",
      });
      setActiveSection("Owner Review");
    }
  };

  const handleScrollKeyFeature = () => {
    if (keyFeaturesRef && keyFeaturesRef.current) {
      const offset = keyFeaturesRef.current.offsetTop;
      window.scrollTo({
        top: offset - 100,
        behavior: "smooth",
      });
      setActiveSection("Key Feature");
    }
  };

  const handleScrollBrochure = () => {
    if (brochureRef && brochureRef.current) {
      const offset = brochureRef.current.offsetTop;
      window.scrollTo({
        top: offset - 100,
        behavior: "smooth",
      });
      setActiveSection("Brochure");
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
      const sections = [
        { ref: youtubeVideoRef, name: "Videos" },
        { ref: prosConsRef, name: "Pros & Cons" },
        { ref: summaryRef, name: "Summary" },
        { ref: keyFeaturesRef, name: "Key Feature" },
        { ref: variantsRef, name: "Variants" },
        { ref: colorRef, name: "Color" },
        { ref: mileageRef, name: "Mileage" },
        { ref: fuleCostRef, name: "Fuel Calculator" },
        { ref: brochureRef, name: "Brochure" },
        { ref: reviewRef, name: "Owner Review" },
        { ref: newsRef, name: "News" },
        { ref: compareRef, name: "Compare" },
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
    keyFeaturesRef,
    variantsRef,
    colorRef,
    mileageRef,
    fuleCostRef,
    brochureRef,
    reviewRef,
    newsRef,
    compareRef,
    featuredCarRef,
  ]);

  // Auto-scroll the navigation bar when active section changes
  useEffect(() => {
    scrollActiveButtonIntoView();
  }, [activeSection]);

  return (
    <>
      <div className="w-full -mt-4 py-4 fixed top-30 z-50 bg-white shadow-md border-b border-gray-200 block md:hidden">
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
                ref={activeSection === item.title ? activeButtonRef : null}
                className={`flex-shrink-0 rounded-sm w-[90px] h-[25px] flex justify-center items-center text-center cursor-pointer shadow-md md:w-auto md:height-auto transition-all duration-200 ${
                  activeSection === item.title
                    ? "bg-black text-white"
                    : "bg-white text-[#8B8A8A] border border-gray-300 hover:bg-gray-50"
                }`}
                key={index}
                onClick={item.onClick}
              >
                <div className="font-[Montserrat] font-semibold md:text-lg">
                  {item.title}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};

const Productpage = () => {
  const queryClient = new QueryClient();
  const youtubeVideoRef = useRef(null);
  const summaryRef = useRef(null);
  const keyFeaturesRef = useRef(null);
  const compareRef = useRef(null);
  const prosConsRef = useRef(null);
  const variantsRef = useRef(null);
  const featuredCarRef = useRef(null);
  const colorRef = useRef(null);
  const mileageRef = useRef(null);
  const fuleCostRef = useRef(null);
  const newsRef = useRef(null);
  const reviewRef = useRef(null);
  const brochureRef = useRef(null);

  const [productData, setProductData] = useState(null);
  const { id } = useParams();

  // Fetch product data
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${id}`
        );
        const data = await response.json();
        setProductData(data);
      } catch (error) {
        console.error("Error fetching product data:", error);
      }
    };

    fetchProductData();
  }, [id]);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <QueryClientProvider client={queryClient}>
      {/* <Header /> */}
      <div className=""></div>
      <Overview
        youtubeVideoRef={youtubeVideoRef}
        summaryRef={summaryRef}
        keyFeaturesRef={keyFeaturesRef}
        compareRef={compareRef}
        prosConsRef={prosConsRef}
        variantsRef={variantsRef}
        featuredCarRef={featuredCarRef}
        colorRef={colorRef}
        mileageRef={mileageRef}
        fuleCostRef={fuleCostRef}
        newsRef={newsRef}
        reviewRef={reviewRef}
        brochureRef={brochureRef}
      />
      <Productsection
        youtubeVideoRef={youtubeVideoRef}
        summaryRef={summaryRef}
        keyFeaturesRef={keyFeaturesRef}
        compareRef={compareRef}
        prosConsRef={prosConsRef}
        variantsRef={variantsRef}
        featuredCarRef={featuredCarRef}
        colorRef={colorRef}
        mileageRef={mileageRef}
        fuleCostRef={fuleCostRef}
        newsRef={newsRef}
        reviewRef={reviewRef}
        brochureRef={brochureRef}
      />
      <Youtubevideo ref={youtubeVideoRef} />
      <Adbanner2 />
      {productData && (
        <CarPros
          ref={prosConsRef}
          brandName={productData.brand?.name}
          carName={productData.carname}
        />
      )}
      {productData && (
        <Factfile
          summaryRef={summaryRef}
          keyFeaturesRef={keyFeaturesRef}
          brandName={productData.brand?.name}
          carName={productData.carname}
        />
      )}
      <Variants ref={variantsRef} />
      {productData && (
        <ColorsVariants
          ref={colorRef}
          brandName={productData.brand?.name}
          carName={productData.carname}
        />
      )}
      <Adbanner2 />
      {productData && (
        <Mileage
          ref={mileageRef}
          brandName={productData.brand?.name}
          carName={productData.carname}
        />
      )}
      {productData && (
        <FuelCost
          fuleCostRef={fuleCostRef}
          brochureRef={brochureRef}
          brandName={productData.brand?.name}
          carName={productData.carname}
        />
      )}
      <Reviews ref={reviewRef} />
      <History />
      <Adbanner3 />
      <Newsupdate ref={newsRef} />
      <CarComparison ref={compareRef} />
      <FeaturedCar ref={featuredCarRef} />
      <Consult />
      {/* <Footer /> */}
    </QueryClientProvider>
  );
};

export default Productpage;
