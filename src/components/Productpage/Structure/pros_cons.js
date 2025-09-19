import React, { useState, useEffect, useRef } from "react";
import { Link, useParams } from "react-router-dom";

const ProsConsProd = React.forwardRef(({ brandName, carName }, ref) => {
  const [singleCardData, setSingleCardData] = useState([]);

  const [activeDot, setActiveDot] = useState(0);
  const params = useParams();
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/cars/${params.id}`
        );
        const data = await response.json();
        setSingleCardData(data);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };

    fetchData();
  }, [params.id]);

  useEffect(() => {
    const handleScroll = () => {
      if (!scrollContainerRef.current) return;

      const container = scrollContainerRef.current;
      const scrollPosition = container.scrollLeft;
      const containerWidth = container.clientWidth;
      const scrollWidth = container.scrollWidth;

      // Calculate which dot should be active based on scroll position
      // If we're in the first half of the scroll, show dot 0, otherwise dot 1
      const newActiveDot =
        scrollPosition > (scrollWidth - containerWidth) / 2 ? 1 : 0;

      setActiveDot(newActiveDot);
    };

    const scrollContainer = scrollContainerRef.current;
    if (scrollContainer) {
      scrollContainer.addEventListener("scroll", handleScroll);

      return () => {
        scrollContainer.removeEventListener("scroll", handleScroll);
      };
    }
  }, []);

  const parseList = (htmlString) => {
    const parser = new DOMParser();
    const doc = parser.parseFromString(htmlString, "text/html");
    const items = doc.querySelectorAll("ul li, p");

    return Array.from(items).map((item) => {
      return item.textContent.split("\n");
    });
  };

  const scrollToSection = (index) => {
    if (!scrollContainerRef.current) return;

    const container = scrollContainerRef.current;
    const scrollWidth = container.scrollWidth;
    const containerWidth = container.clientWidth;

    // Calculate scroll position based on dot index
    // If dot 0, scroll to beginning; if dot 1, scroll to end
    const scrollTo = index === 0 ? 0 : scrollWidth - containerWidth;

    container.scrollTo({
      left: scrollTo,
      behavior: "smooth",
    });

    setActiveDot(index);
  };

  // Fix: Corrected the rendering for cons section to use cons data instead of pro data
  return (
    <>
      <div className="label d-flex flex-column align-items-center" ref={ref}>
        <div className="flex justify-center items-center p-2 w-full ">
          <div className="md:flex justify-center items-center md:text-center block w-[90%]">
            <span className="text-[20px] text-[#818181] font-bold">
              PROS & CONS &nbsp;
              <span className="text-[#AB373A] font-bold text-[20px]">
                {brandName || carName
                  ? `${brandName ?? ""} ${carName ?? ""}`.trim()
                  : singleCardData.brandname?.brandName ||
                    singleCardData.carname?.carName}
              </span>
            </span>
          </div>
        </div>
      </div>
      <section
        className="w-ful p-4 overflow-x-scroll md:overflow-hidden  block md:flex justify-center items-center  scrollbar-hide"
        ref={scrollContainerRef}
      >
        <div className="flex justify-center gap-8 items-center w-fit thmemobcon">
          <div className="bg-white border shadow-md shadow-black/30 h-[203px] w-[266px] p-2 ">
            <div className="d-flex flex-column thmemobconpros">
              <h2 className="pros_main mb-3">Pros</h2>{" "}
              {singleCardData.pro &&
                parseList(singleCardData.pro).map((line, index) => (
                  <div key={index} className="pros_maintxt  flex text-[13px] ">
                    <li></li>
                    {line}
                  </div>
                ))}
            </div>
          </div>
          <div className="bg-white border shadow-md shadow-black/30 h-[203px] w-[266px] p-2 ">
            <div className="d-flex flex-column thmemobconpros">
              <h2 className="pros_main_cons mb-3 text-[#AB373A]">Cons</h2>
              {singleCardData.cons &&
                parseList(singleCardData.cons).map((line, index) => (
                  <div key={index} className="pros_maintxt  flex ">
                    <li></li>
                    {line}
                  </div>
                ))}
            </div>
          </div>
        </div>
      </section>

      {/* Active pagination dots with click functionality */}
      <div className="pagination flex justify-center mt-4">
        <div
          className={`dot ${activeDot === 0 ? "active" : ""}`}
          onClick={() => scrollToSection(0)}
          style={{ cursor: "pointer" }}
        ></div>
        <div
          className={`dot ${activeDot === 1 ? "active" : ""}`}
          onClick={() => scrollToSection(1)}
          style={{ cursor: "pointer" }}
        ></div>
      </div>
    </>
  );
});

export default ProsConsProd;
