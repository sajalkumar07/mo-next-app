import React, { useState, useEffect, useRef } from "react";
import { FaPlus, FaMinus } from "react-icons/fa";
import { useParams } from "react-router-dom";

const ImageGallery = ({ singlecardData, images, imageText }) => {
  const [popupVisible, setPopupVisible] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [currentIndex, setCurrentIndex] = useState(0);
  const itemsPerPage = 3;

  const openPopup = (index) => {
    setCurrentImageIndex(index);
    setPopupVisible(true);
  };

  const closePopup = () => {
    setPopupVisible(false);
  };

  const handlePrev = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = (e) => {
    e?.stopPropagation();
    setCurrentImageIndex((prevIndex) =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const handlePreviousSmooth = () => {
    if (currentIndex > 0) {
      setCurrentIndex(Math.max(0, currentIndex - 1));
      const container = document.querySelector(`#scroll-container`);
      if (container) {
        const scrollAmount = 320; // Approximate width of one item (300px + margins)
        container.scrollTo({
          left: container.scrollLeft - scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  const handleNextSmooth = () => {
    if (currentIndex < images.length - itemsPerPage) {
      setCurrentIndex(Math.min(images.length - itemsPerPage, currentIndex + 1));
      const container = document.querySelector(`#scroll-container`);
      if (container) {
        const scrollAmount = 320; // Approximate width of one item (300px + margins)
        container.scrollTo({
          left: container.scrollLeft + scrollAmount,
          behavior: "smooth",
        });
      }
    }
  };

  return (
    <>
      {/* Popup Section */}
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
              style={{ zIndex: 10 }}
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
              <div className="w-[360px]">
                <img
                  src={`${process.env.NEXT_PUBLIC_API}/varientImages/${images[currentImageIndex].filename}`}
                  alt="Selected"
                  crossOrigin="anonymous"
                  className="keyfeature-img rounded-t-xl"
                />
                <p className="bg-white w-full text-center border-b rounded-b-xl font-[Montserrat] text-[14px] font-medium py-3">
                  {imageText[currentImageIndex] &&
                  imageText[currentImageIndex] !== "No data available"
                    ? imageText[currentImageIndex]
                    : "NA"}
                </p>
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

      {/* Images List Section with Smooth Scrolling */}
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
          disabled={currentIndex >= images.length - itemsPerPage}
        >
          <ion-icon name="chevron-forward-outline"></ion-icon>
        </button>
      </div>

      <div
        id="scroll-container"
        className="flex gap-0 overflow-x-auto scroll-smooth scrollbar-hide touch-pan-x"
        style={{
          scrollbarWidth: "none",
          msOverflowStyle: "none",
        }}
      >
        {images.map((image, index) => (
          <div className="mt-3 mr-3 w-[300px] flex-shrink-0" key={index}>
            <img
              className="keyfeature-img cursor-pointer"
              src={`${process.env.NEXT_PUBLIC_API}/varientImages/${image.filename}`}
              alt={`Product ${index + 1}`}
              crossOrigin="anonymous"
              onClick={() => openPopup(index)}
            />
            <p className="text-under-key mt-4">
              {imageText[index] && imageText[index] !== "No data available"
                ? imageText[index]
                : "NA"}
            </p>
          </div>
        ))}
      </div>

      <style jsx>{`
        #scroll-container::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </>
  );
};

const FactfileVarient = ({ props, summaryRef, keyFeaturesRef }) => {
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
  const [visibleComponent, setVisibleComponent] = useState("AllImages2");
  const [expandedSections, setExpandedSections] = useState({});
  const contentRefs = useRef([]);

  const params = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API}/api/varient/getbyid/${params.id}`
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

  const hasValidData = (value) => {
    return value && value.trim() !== "" && value.toUpperCase() !== "NA";
  };

  const getAvailableWarrantyFields = () => {
    const fields = [];
    const standardWarranty = singlecardData.data?.product_id?.standard;
    const extendedWarranty = singlecardData.data?.product_id?.extended;
    const serviceInterval = singlecardData.data?.product_id?.Service;

    if (hasValidData(standardWarranty)) {
      fields.push({ label: "Standard Warranty", value: standardWarranty });
    }
    if (hasValidData(extendedWarranty)) {
      fields.push({ label: "Extended Warranty", value: extendedWarranty });
    }
    if (hasValidData(serviceInterval)) {
      fields.push({ label: "Service Interval", value: serviceInterval });
    }

    return fields;
  };

  const renderComponent = () => {
    const images = singlecardData.data?.images || [];
    const imageText = singlecardData.data?.imageText || [];

    return (
      <ImageGallery
        singlecardData={singlecardData}
        images={images}
        imageText={imageText}
      />
    );
  };

  const availableWarrantyFields = getAvailableWarrantyFields();

  return (
    <>
      <section
        className="featurd_car mt-2 newstyles"
        ref={summaryRef}
        style={{ height: "240px", backgroundColor: "rgba(129, 129, 129, 0.5)" }}
      >
        <div className="label -mb-3  ">
          <p className="FIND-YOUR-PERFECT brand mt-3 lefttext-mob  ">
            <span className="text-wrapper">FACT</span>
            <span className="span">&nbsp;</span>
            <span className="text-wrapper-2">FILE</span>
          </p>
        </div>

        {/* Desktop View */}
        <section className="desktop-only  ">
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
                REVIEW / <span className="text-wrapper-2sdfj">Summary</span>
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
                <div className="mainadanfskjndfjsdjf">
                  {singlecardData.data?.brand_id?.name}
                  <span>
                    {" "}
                    {singlecardData.data?.product_id?.carname}{" "}
                    {singlecardData.data?.varientName}
                  </span>
                </div>
                <div style={{ margin: "0" }} className="mainfactrej">
                  <div className="w-100">
                    {singlecardData.data?.product_id?.aslisummary1 ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: singlecardData.data.product_id.aslisummary1,
                        }}
                      />
                    ) : (
                      <div>No Summary Present</div>
                    )}
                  </div>
                </div>
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
                Engine
                {accordionOpen1 ? (
                  <FaMinus className="FaMinus1" />
                ) : (
                  <FaPlus className="FaMinus1" />
                )}
              </div>
              <div
                style={{
                  height: accordionOpen1 ? "227px" : "0",
                  overflow: "hidden",
                  transition: "height 0.3s ease-in-out",
                  backgroundColor: "white",
                }}
                className="mainupertext"
              >
                <div
                  className="mainadanfskjndfjsdjf"
                  style={{ marginTop: "10px" }}
                >
                  <span>{singlecardData.data?.product_id?.engineh1}</span>{" "}
                  {singlecardData.data?.product_id?.engineh2}
                </div>
                <div
                  style={{ margin: "0px", height: "auto" }}
                  className="mainfactrej"
                >
                  <div className="w-100">
                    {singlecardData.data?.product_id?.enginesummary1 ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: singlecardData.data.product_id.enginesummary1,
                        }}
                      />
                    ) : (
                      <div>No Summary Present</div>
                    )}
                  </div>
                </div>

                <div className="d-flex align-items-center justify-content-center w-100">
                  <div className="align-items-center justify-content-center">
                    <div className="mb-2">Manual</div>
                    {singlecardData.data?.manual ? (
                      <div
                        dangerouslySetInnerHTML={{
                          __html: singlecardData.data.manual.replace(
                            /\\r\\n/g,
                            "<br />"
                          ),
                        }}
                      />
                    ) : (
                      "No manual data available"
                    )}
                  </div>
                </div>
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
                  height: accordionOpen2 ? "127px" : "0",
                  overflow: "hidden",
                  transition: "height 0.3s ease-in-out",
                  backgroundColor: "white",
                }}
                className="mainupertext"
              >
                <div className="tablecss">
                  <div className="tablesection">
                    {availableWarrantyFields.length > 0 ? (
                      <table className="maintablecss">
                        <tbody>
                          {availableWarrantyFields.map((field, index) => (
                            <tr key={index}>
                              <td style={{ width: "250px" }}>{field.label}</td>
                              <td>{field.value}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    ) : (
                      <div>No warranty information available</div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Mobile View */}
        <section className="onlyphonemeblock fact px-4 -mb-4" id="summery">
          {/* First Section */}
          <div className="bg-white border shadow-md shadow-black/30 ">
            <div className="d-flex flex-column thmemobconpros">
              <div className="facto">
                Summary For <span> &nbsp;</span>
                <span className="text-[#ab373a] text-[20px]">
                  {singlecardData.data?.brand_id?.name}{" "}
                  {singlecardData.data?.product_id?.carname}{" "}
                  {singlecardData.data?.varientName}
                </span>
              </div>
              <div
                className={`${expandedSections[0] ? "expanded" : ""}`}
                ref={(el) => (contentRefs.current[0] = el)}
                style={{
                  height: expandedSections[0] ? "auto" : "163px",
                  overflow: "hidden",
                }}
              >
                {singlecardData.data?.product_id?.aslisummary1 ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: singlecardData.data.product_id.aslisummary1,
                    }}
                  />
                ) : (
                  <div>No Summary Present</div>
                )}
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

          {/* Second Section */}
          <div className="bg-white border shadow-md shadow-black/30  mt-3">
            <div className="d-flex flex-column thmemobconpros">
              <div className="facto">
                Engine Details For
                <span>&nbsp;</span>
                <span className="text-[#ab373a] text-[20px]">
                  {singlecardData.data?.brand_id?.name}{" "}
                  {singlecardData.data?.product_id?.carname}{" "}
                  {singlecardData.data?.varientName}
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
                <div className="cols facto flex-row">
                  <span className="text-[#ab373a]">
                    {singlecardData.data?.product_id?.engineh1}
                  </span>{" "}
                  <span className="font-light text-[#818181]">
                    {singlecardData.data?.product_id?.engineh2}
                  </span>
                </div>
                {singlecardData.data?.product_id?.enginesummary1 ? (
                  <div
                    dangerouslySetInnerHTML={{
                      __html: singlecardData.data.product_id.enginesummary1,
                    }}
                  />
                ) : (
                  <div>No Summary Present</div>
                )}

                <div className=" mt-4 ml-5 mr-5">
                  <div className="flex justify-center items-center flex-col">
                    <span>Manual</span>
                    {singlecardData.data?.manual ? (
                      <div
                        className="att"
                        dangerouslySetInnerHTML={{
                          __html: singlecardData.data.manual.replace(
                            /\\r\\n/g,
                            "<br />"
                          ),
                        }}
                      />
                    ) : (
                      <div>No manual data available</div>
                    )}
                  </div>
                </div>
              </div>

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

          {/* Third Section - Mobile Warranty */}
          <div className="bg-white border shadow-md shadow-black/30  mt-3">
            <div className="d-flex flex-column thmemobconpros">
              <div className="facto">
                Warranty & Service For
                <span>&nbsp;</span>
                <span className="text-[#ab373a] text-[20px]">
                  {singlecardData.data?.brand_id?.name}{" "}
                  {singlecardData.data?.product_id?.carname}{" "}
                  {singlecardData.data?.varientName}
                </span>
              </div>
              <div
                className={`${expandedSections[2] ? "expanded" : ""}`}
                ref={(el) => (contentRefs.current[2] = el)}
                style={{
                  height: expandedSections[2] ? "163px" : "163px",
                }}
              >
                {availableWarrantyFields.length > 0 ? (
                  <div className="flex py-4" style={{ marginTop: "-15px" }}>
                    {availableWarrantyFields.map((field, index) => (
                      <React.Fragment key={index}>
                        <div>
                          <div className="d-flex cols facto">{field.label}</div>
                          <ul>{field.value}</ul>
                        </div>
                        {index < availableWarrantyFields.length - 1 && (
                          <div className="the-deviderbt mt-5 ml-1 mr-1"></div>
                        )}
                      </React.Fragment>
                    ))}
                  </div>
                ) : (
                  <div className="py-4">No warranty information available</div>
                )}
              </div>
            </div>
          </div>
        </section>
      </section>

      {/* Key Features Section */}
      <div ref={keyFeaturesRef}>
        {" "}
        <section
          className="d-flex justify-content-center pb-3"
          style={{ backgroundColor: "rgba(129, 129, 129, 0.5)" }}
        >
          <div className="news-cardsection-mdotr">
            {/* Desktop View */}
            <div className="onlydesptop">
              <div className="d-flex align-items-center">
                <div
                  className="model-first-shape w-100"
                  style={{
                    clipPath: "none",
                    backgroundColor: "var(--gray)",
                    height: "33px",
                  }}
                  onClick={() => setVisibleComponent("AllImages2")}
                >
                  <span className="text-inside-shape-neww">KEY FEATURES</span>
                </div>
              </div>
            </div>

            {/* Mobile View */}
            <section id="images">
              {" "}
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
            </section>

            <div className="slide-in-right">{renderComponent()}</div>
          </div>
        </section>
      </div>
    </>
  );
};

export default FactfileVarient;
