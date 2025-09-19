import React, { useState, useEffect, forwardRef, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { Link, useParams } from "react-router-dom";

// Generic reusable component
const ImageGallery = ({ singlecardData, prefix }) => {
  return (
    <div className="flex gap-2.5 overflow-x-auto scroll-smooth  touch-pan-x">
      {Array.from({ length: 20 }, (_, i) => i + 1).map((num) => {
        const imageKey = `${prefix}${num}`;
        const textKey = `${prefix}${num}text`;

        if (singlecardData[imageKey] && singlecardData[textKey]) {
          return (
            <div className="mt-3 mr-3 flex-shrink-0" key={imageKey}>
              <img
                className="keyfeature-img"
                src={`${process.env.NEXT_PUBLIC_API}/productImages/${singlecardData[imageKey]}`}
                alt="Product"
                crossOrigin="anonymous"
              />
              <p className="text-under-key mt-1">{singlecardData[textKey]}</p>
            </div>
          );
        } else {
          return null;
        }
      })}
    </div>
  );
};

// Specific components using the generic one
const AllImages = ({ singlecardData }) => {
  return <ImageGallery singlecardData={singlecardData} prefix="keyF" />;
};

const AllImages2 = ({ singlecardData }) => {
  return <ImageGallery singlecardData={singlecardData} prefix="spaceC" />;
};

const AllImages3 = ({ singlecardData }) => {
  return <ImageGallery singlecardData={singlecardData} prefix="storageC" />;
};

const FactFileProd = ({
  props,
  brandName,
  carName,
  summaryRef,
  keyFeaturesRef,
}) => {
  const [accordionOpen, setAccordionOpen] = useState(false);
  const [accordionOpen1, setAccordionOpen1] = useState(false);
  const [accordionOpen2, setAccordionOpen2] = useState(false);

  const toggleAccordion = () => {
    setAccordionOpen(!accordionOpen);
    setAccordionOpen1(false);
    setAccordionOpen2(false);
  };

  const toggleAccordion1 = () => {
    setAccordionOpen(false);
    setAccordionOpen1(!accordionOpen1);
    setAccordionOpen2(false);
  };

  const toggleAccordion2 = () => {
    setAccordionOpen(false);
    setAccordionOpen1(false);
    setAccordionOpen2(!accordionOpen2);
  };

  const [singlecardData, setSingleCardData] = useState([]);

  const [visibleComponent, setVisibleComponent] = useState("AllImages");

  const renderComponent = () => {
    switch (visibleComponent) {
      case "AllImages":
        return <AllImages singlecardData={singlecardData} />;
      case "AllImages2":
        return <AllImages2 singlecardData={singlecardData} />;
      case "AllImages3":
        return <AllImages3 singlecardData={singlecardData} />;
      default:
        return null;
    }
  };

  const params = useParams();

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

  // Helper function to process engine data with line breaks
  const processEngineData = (data) => {
    return data ? data.replace(/\r\n/g, "<br />") : "";
  };

  // Process all engine data
  const engineData = {
    engineauto1: processEngineData(singlecardData.engineauto1),
    engineimt1: processEngineData(singlecardData.engineimt1),
    enginemanual1: processEngineData(singlecardData.enginemanual1),
    engineauto2: processEngineData(singlecardData.engineauto2),
    engineimt2: processEngineData(singlecardData.engineimt2),
    enginemanual2: processEngineData(singlecardData.enginemanual2),
    engineauto3: processEngineData(singlecardData.engineauto3),
    engineimt3: processEngineData(singlecardData.engineimt3),
    enginemanual3: processEngineData(singlecardData.enginemanual3),
    engineauto4: processEngineData(singlecardData.engineauto4),
    engineimt4: processEngineData(singlecardData.engineimt4),
    enginemanual4: processEngineData(singlecardData.enginemanual4),
  };

  // Helper function to render engine transmission options
  const renderEngineTransmissions = (autoData, imtData, manualData) => {
    const transmissions = [];

    if (autoData) {
      transmissions.push(
        <div key="auto" className="text-center px-4">
          <span className="font-semibold">AT</span>
          <div className="att" dangerouslySetInnerHTML={{ __html: autoData }} />
        </div>
      );
    }

    if (imtData) {
      if (transmissions.length > 0) {
        transmissions.push(
          <div
            key="divider1"
            className="border-r-2 border-dotted border-gray-600 my-2"
          ></div>
        );
      }
      transmissions.push(
        <div key="imt" className="text-center px-4">
          <span className="font-semibold">iMT</span>
          <div className="att" dangerouslySetInnerHTML={{ __html: imtData }} />
        </div>
      );
    }

    if (manualData) {
      if (transmissions.length > 0) {
        transmissions.push(
          <div
            key="divider2"
            className="border-r-2 border-dotted border-gray-600 my-2"
          ></div>
        );
      }
      transmissions.push(
        <div key="manual" className="text-center px-4">
          <span className="font-semibold">Manual</span>
          <div
            className="att"
            dangerouslySetInnerHTML={{ __html: manualData }}
          />
        </div>
      );
    }

    return transmissions;
  };

  // Helper function to render engine transmission options for desktop
  const renderEngineTransmissionsDesktop = (autoData, imtData, manualData) => {
    return (
      <div className="d-flex w-100 justify-content-between mt-5">
        {autoData && (
          <div>
            <span>AT</span>
            <div
              className="att"
              dangerouslySetInnerHTML={{ __html: autoData }}
            />
          </div>
        )}
        {imtData && (
          <>
            <div className="margin_gap"></div>
            <div>
              <span>iMT</span>
              <div
                className="att"
                dangerouslySetInnerHTML={{ __html: imtData }}
              />
            </div>
          </>
        )}
        {manualData && (
          <>
            <div className="margin_gap"></div>
            <div>
              <span>Manual</span>
              <div
                className="att"
                dangerouslySetInnerHTML={{ __html: manualData }}
              />
            </div>
          </>
        )}
      </div>
    );
  };

  const [popupVisible, setPopupVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(null);
  const [currentCategory, setCurrentCategory] = useState("");

  const openPopup = (index, category) => {
    setPopupVisible(true);
    setCurrentImageIndex(index);
    setCurrentCategory(category);
  };

  const closePopup = () => {
    setPopupVisible(false);
    setCurrentImageIndex(null);
  };

  const handleNext = () => {
    setCurrentImageIndex((prevIndex) => {
      let nextIndex = (prevIndex + 1) % 20;
      while (
        !singlecardData[`${currentCategory}${nextIndex + 1}`] &&
        nextIndex !== prevIndex
      ) {
        nextIndex = (nextIndex + 1) % 20;
      }
      return nextIndex;
    });
  };

  const handlePrev = () => {
    setCurrentImageIndex((prevIndex) => {
      let prevIndexCalc = (prevIndex - 1 + 20) % 20;
      while (
        !singlecardData[`${currentCategory}${prevIndexCalc + 1}`] &&
        prevIndexCalc !== prevIndex
      ) {
        prevIndexCalc = (prevIndexCalc - 1 + 20) % 20;
      }
      return prevIndexCalc;
    });
  };

  const [currentIndexKeyF, setCurrentIndexKeyF] = useState(0);
  const [currentIndexSpaceC, setCurrentIndexSpaceC] = useState(0);
  const [currentIndexStorageC, setCurrentIndexStorageC] = useState(0);

  const itemsPerPage = 3;

  // Common handler function for next/previous
  const handlePrevious = (setCurrentIndex) => {
    setCurrentIndex((prevIndex) => (prevIndex > 0 ? prevIndex - 1 : prevIndex));
  };

  const handleNext2 = (setCurrentIndex, length) => {
    setCurrentIndex((prevIndex) =>
      prevIndex < length - itemsPerPage ? prevIndex + 1 : prevIndex
    );
  };

  const renderCategory = (
    categoryPrefix,
    categoryTextPrefix,
    currentIndex,
    setCurrentIndex
  ) => {
    const newcardData = Array.from(
      { length: 20 },
      (_, i) => `${categoryPrefix}${i + 1}`
    ).filter((key) => singlecardData[key]);

    // Smooth scroll handler for buttons
    const handleSmoothScroll = (direction) => {
      const container = document.querySelector(
        `#scroll-container-${categoryPrefix}`
      );
      if (container) {
        const scrollAmount = 320; // Approximate width of one item (300px + margins)
        const currentScrollLeft = container.scrollLeft;
        const targetScrollLeft =
          direction === "next"
            ? currentScrollLeft + scrollAmount
            : currentScrollLeft - scrollAmount;

        container.scrollTo({
          left: targetScrollLeft,
          behavior: "smooth",
        });
      }
    };

    // Enhanced button handlers with smooth scroll
    const handlePreviousSmooth = () => {
      if (currentIndex > 0) {
        setCurrentIndex(Math.max(0, currentIndex - 1));
        handleSmoothScroll("prev");
      }
    };

    const handleNextSmooth = () => {
      if (currentIndex < newcardData.length - itemsPerPage) {
        setCurrentIndex(
          Math.min(newcardData.length - itemsPerPage, currentIndex + 1)
        );
        handleSmoothScroll("next");
      }
    };

    return (
      <>
        <div className="rishtleftnew">
          <button
            className="slider_btn"
            onClick={handlePreviousSmooth}
            disabled={currentIndex === 0}
          >
            <ion-icon name="chevron-back-outline"></ion-icon>
          </button>
          <button
            className="slider_btn"
            onClick={handleNextSmooth}
            disabled={currentIndex >= newcardData.length - itemsPerPage}
          >
            <ion-icon name="chevron-forward-outline"></ion-icon>
          </button>
        </div>

        <div
          id={`scroll-container-${categoryPrefix}`}
          className="flex gap-0 overflow-x-auto scroll-smooth scrollbar-hide "
          style={{
            scrollbarWidth: "none",
            msOverflowStyle: "none",
          }}
        >
          {newcardData.map((key, index) => {
            const textKey = `${key}text`;

            return (
              <div className="mt-3 mr-3 w-[300px] flex-shrink-0" key={key}>
                <img
                  className="keyfeature-img cursor-pointer"
                  src={`${process.env.NEXT_PUBLIC_API}/productImages/${singlecardData[key]}`}
                  alt="Product"
                  crossOrigin="anonymous"
                  onClick={() => openPopup(index, categoryPrefix)}
                />
                <p className="text-under-key mt-4">{singlecardData[textKey]}</p>
              </div>
            );
          })}
        </div>

        <style jsx>{`
          #scroll-container-${categoryPrefix}::-webkit-scrollbar {
            display: none;
          }
        `}</style>
      </>
    );
  };

  const getImageSrc = (categoryPrefix, index) => {
    const key = `${categoryPrefix}${index + 1}`;
    return `${process.env.NEXT_PUBLIC_API}/productImages/${singlecardData[key]}`;
  };

  const [expandedSections, setExpandedSections] = useState({});
  const contentRefs = useRef([]);

  useEffect(() => {
    contentRefs.current.forEach((ref, index) => {
      if (ref) {
        setExpandedSections((prev) => ({
          ...prev,
          [index]: ref.scrollHeight > 100 ? false : true,
        }));
      }
    });
  }, [singlecardData]);

  const toggleExpand = (index) => {
    setExpandedSections((prev) => ({
      ...prev,
      [index]: !prev[index],
    }));
  };

  return (
    <>
      <section
        className="featurd_car mt-2 newstyles"
        ref={summaryRef}
        style={{ height: "240px", backgroundColor: "rgba(129, 129, 129, 0.5)" }}
      >
        <div className="label -mb-10  ">
          <p className="FIND-YOUR-PERFECT brand mt-3 lefttext-mob  ">
            <span className="text-wrapper">FACT</span>
            <span className="span">&nbsp;</span>
            <span className="text-wrapper-2">FILE</span>
          </p>
        </div>

        <section className="desktop-only mt-20 ">
          <div className="faqs">
            <div
              style={{
                border: "1px solid black",
                textAlign: "center",
                margin: "20px auto",
                width: "50%",
                paddingTop: "7px",
                paddingBottom: "7px",
                backgroundColor: accordionOpen ? "white" : "white",
              }}
            >
              <div
                onClick={toggleAccordion}
                className="marginfac"
                style={{ cursor: "pointer" }}
              >
                <div>
                  {" "}
                  REVIEW / <span className="text-wrapper-2sdfj">Summary</span>
                </div>
                {accordionOpen ? (
                  <FaMinus className="FaMinus" />
                ) : (
                  <FaPlus className="FaMinus" />
                )}
              </div>
              <div
                style={{
                  height: accordionOpen ? "250px" : "0",
                  overflow: "hidden",
                  transition: "height 0.3s ease-in-out",
                  backgroundColor: "white",
                }}
                className="mainupertext"
              >
                <div className="mainadanfskjndfjsdjf"></div>
                <p style={{ margin: "0" }} className="mainfactrej">
                  <div style={{ marginLeft: "7px" }}>
                    {singlecardData.asliheader1}
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: singlecardData.aslisummary1,
                    }}
                    className="w-100"
                  />
                </p>
              </div>
            </div>
          </div>
          <div className="faqs">
            <div
              style={{
                border: "1px solid black",
                textAlign: "center",
                margin: "20px auto",
                width: "50%",
                paddingTop: "7px",
                paddingBottom: "7px",
                backgroundColor: accordionOpen ? "white" : "white",
              }}
            >
              <div
                onClick={toggleAccordion1}
                className="marginfac"
                style={{ cursor: "pointer" }}
              >
                {" "}
                Engine
                {accordionOpen1 ? (
                  <FaMinus className="FaMinus1" />
                ) : (
                  <FaPlus className="FaMinus1" />
                )}
              </div>
              <div
                style={{
                  height: accordionOpen1 ? "337px" : "0",
                  overflow: "hidden",
                  transition: "height 0.3s ease-in-out",
                  backgroundColor: "white",
                }}
                className="mainupertext"
              >
                <section className="gdhjkgkdfgk">
                  {/* Engine Section 1 */}
                  {(singlecardData.engineh1 ||
                    singlecardData.enginesummary1) && (
                    <div className="mainatbox">
                      <div className="textupperredsj">
                        <span>{singlecardData.engineh1}</span>{" "}
                        {singlecardData.engineh2}
                      </div>
                      <div
                        dangerouslySetInnerHTML={{
                          __html: singlecardData.enginesummary1,
                        }}
                        className="w-100"
                      />
                      {renderEngineTransmissionsDesktop(
                        engineData.engineauto1,
                        engineData.engineimt1,
                        engineData.enginemanual1
                      )}
                    </div>
                  )}

                  {/* Engine Section 2 */}
                  {(singlecardData.engineh2a ||
                    singlecardData.enginesummary2) && (
                    <>
                      <div style={{ height: "7px" }}></div>
                      <div className="mainatbox">
                        <div className="textupperredsj">
                          <span>{singlecardData.engineh2a}</span>{" "}
                          {singlecardData.engineh21}
                        </div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: singlecardData.enginesummary2,
                          }}
                          className="w-100"
                        />
                        {renderEngineTransmissionsDesktop(
                          engineData.engineauto2,
                          engineData.engineimt2,
                          engineData.enginemanual2
                        )}
                      </div>
                    </>
                  )}

                  {/* Engine Section 3 */}
                  {(singlecardData.engineh3 ||
                    singlecardData.enginesummary3) && (
                    <>
                      <div style={{ height: "7px" }}></div>
                      <div className="mainatbox">
                        <div className="textupperredsj">
                          <span>{singlecardData.engineh3}</span>{" "}
                          {singlecardData.engineh31}
                        </div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: singlecardData.enginesummary3,
                          }}
                          className="w-100"
                        />
                        {renderEngineTransmissionsDesktop(
                          engineData.engineauto3,
                          engineData.engineimt3,
                          engineData.enginemanual3
                        )}
                      </div>
                    </>
                  )}

                  {/* Engine Section 4 */}
                  {(singlecardData.engineh4 ||
                    singlecardData.enginesummary4) && (
                    <>
                      <div style={{ height: "7px" }}></div>
                      <div className="mainatbox">
                        <div className="textupperredsj">
                          <span>{singlecardData.engineh4}</span>{" "}
                          {singlecardData.engineh41}
                        </div>
                        <div
                          dangerouslySetInnerHTML={{
                            __html: singlecardData.enginesummary4,
                          }}
                          className="w-100"
                        />
                        {renderEngineTransmissionsDesktop(
                          engineData.engineauto4,
                          engineData.engineimt4,
                          engineData.enginemanual4
                        )}
                      </div>
                    </>
                  )}
                </section>
              </div>
            </div>
          </div>
          <div className="faqs">
            <div
              style={{
                border: "1px solid black",
                textAlign: "center",
                margin: "20px auto",
                width: "50%",
                paddingTop: "7px",
                paddingBottom: "7px",
                backgroundColor: accordionOpen ? "white" : "white",
              }}
            >
              <div
                onClick={toggleAccordion2}
                className="marginfac"
                style={{ cursor: "pointer" }}
              >
                Warranty & Service
                {accordionOpen2 ? (
                  <FaMinus className="FaMinus2" />
                ) : (
                  <FaPlus className="FaMinus2" />
                )}
              </div>
              <div
                style={{
                  height: accordionOpen2 ? "140px" : "0",
                  overflow: "hidden",
                  transition: "height 0.3s ease-in-out",
                  backgroundColor: "white",
                }}
                className="mainupertext"
              >
                <div className="tablecss">
                  <div className="tablesection">
                    <table className="maintablecss">
                      <tr>
                        <td style={{ width: "250px" }}>Standard Warranty</td>
                        <td>{singlecardData.standard}</td>
                      </tr>
                      <tr>
                        <td>Extended Warranty</td>
                        <td>{singlecardData.extended}</td>
                      </tr>
                      <tr>
                        <td>Service Interval</td>
                        <td>{singlecardData.Service} </td>
                      </tr>
                    </table>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>
      </section>

      <section className="onlyphonemeblock fact px-4 ">
        {/* First Section */}
        <div className="bg-white border shadow-md shadow-black/30 ">
          <div className="d-flex flex-column thmemobconpros">
            <div className="facto">
              Summary For <span> &nbsp;</span>
              <span className=" md:hidden text-[#ab373a] text-[20px]">
                {brandName || carName
                  ? `${brandName ?? ""} ${carName ?? ""}`.trim()
                  : singlecardData.brandname?.brandName ||
                    singlecardData.carname?.carName}
              </span>
            </div>
            <div
              className={` ${expandedSections[0] ? "expanded" : ""}`}
              ref={(el) => (contentRefs.current[0] = el)}
              style={{
                height: expandedSections[0] ? "auto" : "163px",
                overflow: "hidden",
              }}
            >
              <div
                dangerouslySetInnerHTML={{
                  __html: singlecardData.aslisummary1,
                }}
              />
            </div>
            {contentRefs.current[0] &&
              contentRefs.current[0].scrollHeight > 100 && (
                <button
                  onClick={() => toggleExpand(0)}
                  className="read-more-btn font-semibold"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {expandedSections[0] ? "Read Less" : "Read More"}
                </button>
              )}
          </div>
        </div>

        {/* Second Section - Engine Details */}
        <div className="bg-white border shadow-md shadow-black/30 mt-3">
          <div className="d-flex flex-column thmemobconpros">
            <div className="facto">
              Engine Details For
              <span>&nbsp;</span>
              <span className="md:hidden text-[#ab373a] text-[20px]">
                {brandName || carName
                  ? `${brandName ?? ""} ${carName ?? ""}`.trim()
                  : singlecardData.brandname?.brandName ||
                    singlecardData.carname?.carName}
              </span>
            </div>

            <div
              className={`${expandedSections[1] ? "expanded" : ""}`}
              ref={(el) => (contentRefs.current[1] = el)}
              style={{
                height: expandedSections[1] ? "auto" : "163px",
                overflow: "hidden",
              }}
            >
              {/* Engine Section 1 */}
              {(singlecardData.engineh1 || singlecardData.enginesummary1) && (
                <>
                  <div className="cols facto flex-row">
                    <span className="text-[#ab373a]">
                      {singlecardData.engineh1}
                    </span>{" "}
                    <span className="font-light text-[#818181]">
                      {singlecardData.engineh2}
                    </span>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: singlecardData.enginesummary1,
                    }}
                  />
                  <div className="flex w-full justify-center mt-5">
                    {renderEngineTransmissions(
                      engineData.engineauto1,
                      engineData.engineimt1,
                      engineData.enginemanual1
                    )}
                  </div>
                </>
              )}

              {/* Engine Section 2 */}
              {(singlecardData.engineh2a || singlecardData.enginesummary2) && (
                <>
                  <div className="cols facto flex-row mt-6">
                    <span className="text-[#ab373a]">
                      {singlecardData.engineh2a}
                    </span>{" "}
                    <span className="font-light text-[#818181]">
                      {singlecardData.engineh21}
                    </span>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: singlecardData.enginesummary2,
                    }}
                  />
                  <div className="flex w-full justify-center mt-5">
                    {renderEngineTransmissions(
                      engineData.engineauto2,
                      engineData.engineimt2,
                      engineData.enginemanual2
                    )}
                  </div>
                </>
              )}

              {/* Engine Section 3 */}
              {(singlecardData.engineh3 || singlecardData.enginesummary3) && (
                <>
                  <div className="cols facto flex-row mt-6">
                    <span className="text-[#ab373a]">
                      {singlecardData.engineh3}
                    </span>{" "}
                    <span className="font-light text-[#818181]">
                      {singlecardData.engineh31}
                    </span>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: singlecardData.enginesummary3,
                    }}
                  />
                  <div className="flex w-full justify-center mt-5">
                    {renderEngineTransmissions(
                      engineData.engineauto3,
                      engineData.engineimt3,
                      engineData.enginemanual3
                    )}
                  </div>
                </>
              )}

              {/* Engine Section 4 */}
              {(singlecardData.engineh4 || singlecardData.enginesummary4) && (
                <>
                  <div className="cols facto flex-row mt-6">
                    <span className="text-[#ab373a]">
                      {singlecardData.engineh4}
                    </span>{" "}
                    <span className="font-light text-[#818181]">
                      {singlecardData.engineh41}
                    </span>
                  </div>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: singlecardData.enginesummary4,
                    }}
                  />
                  <div className="flex w-full justify-center mt-5">
                    {renderEngineTransmissions(
                      engineData.engineauto4,
                      engineData.engineimt4,
                      engineData.enginemanual4
                    )}
                  </div>
                </>
              )}
            </div>

            {/* Read More Toggle */}
            {contentRefs.current[1] &&
              contentRefs.current[1].scrollHeight > 100 && (
                <button
                  onClick={() => toggleExpand(1)}
                  className="read-more-btn font-semibold"
                  style={{ fontFamily: "Montserrat" }}
                >
                  {expandedSections[1] ? "Read Less" : "Read More"}
                </button>
              )}
          </div>
        </div>

        {/* third Section */}
        <div className="bg-white border shadow-md shadow-black/30 mt-3">
          <div className="d-flex flex-column thmemobconpros">
            <div className="facto">
              Warranty & Service For
              <span>&nbsp;</span>
              <span className="md:hidden text-[#ab373a] text-[20px]">
                {brandName || carName
                  ? `${brandName ?? ""} ${carName ?? ""}`.trim()
                  : singlecardData.brandname?.brandName ||
                    singlecardData.carname?.carName}
              </span>
            </div>
            <div
              className={` ${expandedSections[2] ? "expanded" : ""}`}
              ref={(el) => (contentRefs.current[2] = el)}
              style={{
                height: expandedSections[2] ? "163px" : "163px",
              }}
            >
              <div className="flex py-4 " style={{ marginTop: "-15px" }}>
                <div>
                  <div className='className="d-flex cols facto'>
                    Standard Warranty
                  </div>
                  <ul>{singlecardData.standard}</ul>
                </div>
                <div class="the-deviderbt mt-5 ml-1 mr-1"></div>
                <div>
                  <div className='className="d-flex cols facto'>
                    Extended Warranty
                  </div>
                  <ul>{singlecardData.extended}</ul>
                </div>
                <div class="the-deviderbt mt-5 ml-1 mr-1"></div>
                <div>
                  <div className='className="d-flex cols facto'>
                    Service Interval
                  </div>
                  <ul>{singlecardData.Service} </ul>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div ref={keyFeaturesRef}>
        {" "}
        <section
          className="d-flex justify-content-center pb-3 onlydesptop "
          style={{ backgroundColor: "rgba(129, 129, 129, 0.5)" }}
        >
          <div className="news-cardsection-mdotr mt-10">
            <div className="w-100 fgdfover">
              <div className="themobile-sapert">
                <div
                  className={`thebutton-fill ${
                    visibleComponent === "AllImages" ? "active" : ""
                  }`}
                  onClick={() => setVisibleComponent("AllImages")}
                >
                  KEY FEATURES
                </div>
                <div
                  className={`thebutton-fill ${
                    visibleComponent === "AllImages2" ? "active" : ""
                  }`}
                  onClick={() => setVisibleComponent("AllImages2")}
                >
                  SPACE & COMFORT
                </div>
                <div
                  className={`thebutton-fill ${
                    visibleComponent === "AllImages3" ? "active" : ""
                  }`}
                  onClick={() => setVisibleComponent("AllImages3")}
                >
                  STORAGE & CONVENIENCE
                </div>
              </div>
            </div>
            <div className="fjgnfbh">
              <div className="d-flex align-items-center">
                {/* Buttons */}
                <div
                  className="model-first-shape w-33"
                  style={{
                    clipPath:
                      "polygon(0% 0%, 100% 0px, 87% 94%, 93% 100%, 0% 100%)",
                  }}
                  onClick={() => setVisibleComponent("AllImages")}
                >
                  <span
                    className="text-inside-shape-neww"
                    style={{ fontFamily: "Montserrat" }}
                  >
                    KEY FEATURES
                  </span>
                </div>
                <div
                  className="model-second-shape w-33"
                  style={{
                    clipPath:
                      "polygon(13% 0px, 100% 0px, 89% 100%, 100% 100%, 0px 102%)",
                  }}
                  onClick={() => setVisibleComponent("AllImages2")}
                >
                  <span className="text-inside-shape2-neww">
                    SPACE & COMFORT
                  </span>
                </div>
                <div
                  className="model-three-shape w-33"
                  style={{
                    clipPath:
                      "polygon(13% 0, 100% 0, 100% 50%, 100% 100%, 0 100%)",
                  }}
                  onClick={() => setVisibleComponent("AllImages3")}
                >
                  <span className="text-inside-shape3-neww">
                    STORAGE & CONVENIENCE
                  </span>
                </div>
              </div>
            </div>

            <div className="slide-in-right">{renderComponent()}</div>
          </div>
        </section>
        <section
          className="d-flex justify-content-center pb-3 onlyphoneme newstyles"
          style={{ backgroundColor: "rgba(129, 129, 129, 0.5)" }}
        >
          <div className="news-cardsection-mdotr">
            <div className="w-100 fgdfover flex-column theolato theolato32">
              {/* KEY FEATURES */}
              <div className="d-flex justify-content-between flex-row-reverse theunderbods theolato22">
                <div className="borderekjthrku"></div>
                <div
                  className="show-more"
                  style={{
                    clipPath:
                      "polygon(0% 0px, 100% 0px, 80% 100%, 100% 100%, 0px 100%)",
                    marginTop: "0",
                    textAlign: "start",
                    width: "40%!important",
                  }}
                >
                  KEY FEATURES
                </div>
              </div>
              <div
                className="rounded theolato32 ml-200"
                style={{ display: "flex", gap: "10px", overflowX: "hidden" }}
              >
                {renderCategory(
                  "keyF",
                  "keyF",
                  currentIndexKeyF,
                  setCurrentIndexKeyF
                )}
              </div>

              {/* SPACE & COMFORT */}
              <div className="d-flex justify-content-between flex-row-reverse theunderbods mt-3 theolato theolato22">
                <div className="borderekjthrku"></div>
                <div
                  className="show-more"
                  style={{
                    clipPath:
                      "polygon(0% 0px, 100% 0px, 80% 100%, 100% 100%, 0px 100%)",
                    marginTop: "0",
                    textAlign: "start",
                    width: "40%!important",
                  }}
                >
                  SPACE & COMFORT
                </div>
              </div>
              <div
                className="theolato32 ml-200"
                style={{ display: "flex", gap: "10px", overflowX: "hidden" }}
              >
                {renderCategory(
                  "spaceC",
                  "spaceC",
                  currentIndexSpaceC,
                  setCurrentIndexSpaceC
                )}
              </div>

              {/* STORAGE & CONVENIENCE */}
              <div className="d-flex justify-content-between flex-row-reverse theunderbods mt-3 theolato theolato22">
                <div className="borderekjthrku"></div>
                <div
                  className="show-more"
                  style={{
                    clipPath:
                      "polygon(0% 0px, 100% 0px, 80% 100%, 100% 100%, 0px 100%)",
                    marginTop: "0",
                    textAlign: "start",
                    width: "40%!important",
                  }}
                >
                  STORAGE & CONVENIENCE
                </div>
              </div>
              <div
                className="theolato32 ml-200"
                style={{ display: "flex", gap: "10px", overflowX: "hidden" }}
              >
                {renderCategory(
                  "storageC",
                  "storageC",
                  currentIndexStorageC,
                  setCurrentIndexStorageC
                )}
              </div>
            </div>
          </div>
        </section>
      </div>

      {popupVisible && (
        <div className="popup-overlay" onClick={closePopup}>
          <div
            className=""
            onClick={(e) => e.stopPropagation()}
            style={{ background: "transparent" }}
          >
            <span
              className="popup-close text-white textos"
              onClick={closePopup}
              style={{ zIndex: 10 }} // Ensure it stays above other elements
            >
              X
            </span>
            <div className="flex justify-center items-center w-full">
              <span
                className="popup-prev text-white textosjs bg-[#828282] rounded-full w-[27px] h-[27px] flex justify-center items-center"
                onClick={handlePrev}
              >
                ❮
              </span>
              <div className="w-[360px] relative overflow-x-scroll">
                <div
                  className="flex transition-transform duration-300 ease-in-out"
                  style={{
                    transform: `translateX(-${currentImageIndex * 100}%)`,
                  }}
                >
                  {Array.from({ length: 20 }, (_, i) => {
                    const imageKey = `${currentCategory}${i + 1}`;
                    if (singlecardData[imageKey]) {
                      return (
                        <div key={imageKey} className="w-full flex-shrink-0">
                          <img
                            src={getImageSrc(currentCategory, i)}
                            alt="Selected"
                            crossOrigin="anonymous"
                            className=" rounded-t-xl"
                          />
                          <p className="bg-white w-full text-center border-b rounded-b-xl font-[Montserrat] text-[14px] font-medium py-3">
                            {singlecardData[`${currentCategory}${i + 1}text`] ||
                              ""}
                          </p>
                        </div>
                      );
                    }
                    return null;
                  })}
                </div>
              </div>
              <span
                className="popup-next text-white textosjs bg-[#828282] rounded-full w-[27px] h-[27px] flex justify-center items-center"
                onClick={handleNext}
              >
                ❯
              </span>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FactFileProd;
