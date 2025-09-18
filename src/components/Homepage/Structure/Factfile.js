import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import KeyFeaturesSection from "./keyFeatures";

const FactFileProd = ({ brandName, carName }) => {
  const [singlecardData, setSingleCardData] = useState({});
  const [expandedPanel, setExpandedPanel] = useState(false);

  const params = useParams();

  const cleanHTMLContent = (htmlString) => {
    if (!htmlString) return [];

    const tempDiv = document.createElement("div");
    tempDiv.innerHTML = htmlString;

    const listItems = tempDiv.querySelectorAll("li");

    if (listItems.length > 0) {
      return Array.from(listItems)
        .map((li) => li.innerHTML.trim())
        .filter((item) => item.length > 0);
    }

    return [tempDiv.innerHTML.trim()];
  };

  // Clean transmission data to remove line breaks and format inline
  const cleanTransmissionData = (data) => {
    if (!data) return "";
    return data
      .replace(/\r\n/g, ", ")
      .replace(/<br\s*\/?>/gi, ", ")
      .replace(/,\s*,/g, ",")
      .replace(/^,\s*|,\s*$/g, "")
      .trim();
  };

  // Handle accordion expansion
  const handleAccordionChange = (panel) => (event, isExpanded) => {
    setExpandedPanel(isExpanded ? panel : false);
  };

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

  // Process engine data with line breaks for regular content
  const processEngineData = (data) => {
    return data ? data.replace(/\r\n/g, "<br />") : "";
  };

  // Process all engine data
  const engineData = {
    engineauto1: cleanTransmissionData(singlecardData.engineauto1),
    engineimt1: cleanTransmissionData(singlecardData.engineimt1),
    enginemanual1: cleanTransmissionData(singlecardData.enginemanual1),
    engineauto2: cleanTransmissionData(singlecardData.engineauto2),
    engineimt2: cleanTransmissionData(singlecardData.engineimt2),
    enginemanual2: cleanTransmissionData(singlecardData.enginemanual2),
    engineauto3: cleanTransmissionData(singlecardData.engineauto3),
    engineimt3: cleanTransmissionData(singlecardData.engineimt3),
    enginemanual3: cleanTransmissionData(singlecardData.enginemanual3),
    engineauto4: cleanTransmissionData(singlecardData.engineauto4),
    engineimt4: cleanTransmissionData(singlecardData.engineimt4),
    enginemanual4: cleanTransmissionData(singlecardData.enginemanual4),
  };

  return (
    <section className="bg-[#f5f5f5] px-4 font-sans ">
      <h2 className="text-[25px] font-bold text-center mb-6 font-sans mt-3">
        <span className="text-[#818181]">FACT</span>{" "}
        <span className="text-[#B60C19]">FILE</span>
      </h2>

      <div className="relative z-10 max-w-[1400px] mx-auto px-4">
        {/* Summary Accordion */}
        <Accordion
          expanded={expandedPanel === "summary"}
          onChange={handleAccordionChange("summary")}
          disableGutters
          elevation={0}
          square
          sx={{
            "&:before": {
              display: "none",
            },
          }}
          className="mb-3 border border-gray-200 rounded-2xl shadow-none "
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className="text-gray-500" />}
            className=""
          >
            <h3 className="font-medium hover:underline text-base text-black font-sans ]">
              Summary For {singlecardData.asliheader1}
            </h3>
          </AccordionSummary>
          <AccordionDetails className="bg-white px-4 py-3 rounded-b-2xl">
            {cleanHTMLContent(singlecardData.aslisummary1).length > 0 ? (
              <div className="text-black font-sans">
                {cleanHTMLContent(singlecardData.aslisummary1).map(
                  (item, index) => (
                    <div
                      key={index}
                      className="mb-2"
                      dangerouslySetInnerHTML={{ __html: item }}
                    />
                  )
                )}
              </div>
            ) : (
              <p className="text-black font-sans">
                No summary available for this vehicle.
              </p>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Engine Accordion */}
        <Accordion
          expanded={expandedPanel === "engine"}
          onChange={handleAccordionChange("engine")}
          disableGutters
          elevation={0}
          square
          sx={{
            "&:before": {
              display: "none",
            },
          }}
          className="mb-3 border border-gray-200 rounded-2xl shadow-none"
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className="text-gray-500" />}
          >
            <h3 className="font-medium hover:underline text-base text-black font-sans">
              Engine Details For {singlecardData.asliheader1}
            </h3>
          </AccordionSummary>
          <AccordionDetails className="bg-white px-4 py-3 rounded-b-2xl">
            {singlecardData.engineh1 || singlecardData.enginesummary1 ? (
              <div className="flex flex-col gap-4">
                {/* Engine Section 1 */}
                {(singlecardData.engineh1 || singlecardData.enginesummary1) && (
                  <div>
                    <h4 className="text-[15px] font-bold font-sans mb-1">
                      <span className="text-black">
                        {singlecardData.engineh1}
                      </span>{" "}
                      {singlecardData.engineh2}
                    </h4>

                    {cleanHTMLContent(singlecardData.enginesummary1).length >
                    0 ? (
                      <div className="mb-2 text-[12px] font-sans text-black">
                        {cleanHTMLContent(singlecardData.enginesummary1).map(
                          (item, index) => (
                            <div
                              key={index}
                              className="mb-1"
                              dangerouslySetInnerHTML={{ __html: item }}
                            />
                          )
                        )}
                      </div>
                    ) : (
                      <p className="mb-2 text-[12px] font-sans text-gray-500">
                        No engine details available.
                      </p>
                    )}

                    {/* Transmission options */}
                    <div className="mt-2 space-y-1">
                      {engineData.engineauto1 && (
                        <div className="text-[15px] font-sans text-black flex flex-col">
                          <span className="font-bold">AT</span>{" "}
                          <span>{engineData.engineauto1}</span>
                        </div>
                      )}

                      {engineData.engineimt1 && (
                        <div className="text-[15px] font-sans text-black flex flex-col">
                          <span className="font-bold">iMT</span>{" "}
                          <span>{engineData.engineimt1}</span>
                        </div>
                      )}

                      {engineData.enginemanual1 && (
                        <div className="text-[15px] font-sans text-black flex flex-col">
                          <span className="font-bold">Manual</span>{" "}
                          <span>{engineData.enginemanual1}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Engine Section 2 */}
                {(singlecardData.engineh2a ||
                  singlecardData.enginesummary2) && (
                  <div>
                    <h4 className="text-[15px] font-bold font-sans mb-1">
                      <span className="text-black">
                        {singlecardData.engineh2a}
                      </span>{" "}
                      {singlecardData.engineh21}
                    </h4>

                    {cleanHTMLContent(singlecardData.enginesummary2).length >
                    0 ? (
                      <div className="mb-2 text-[15px] font-sans text-black">
                        {cleanHTMLContent(singlecardData.enginesummary2).map(
                          (item, index) => (
                            <div
                              key={index}
                              className="mb-1"
                              dangerouslySetInnerHTML={{ __html: item }}
                            />
                          )
                        )}
                      </div>
                    ) : (
                      <p className="mb-2 text-[15px] font-sans text-gray-500">
                        No engine details available.
                      </p>
                    )}

                    {/* Transmission options */}
                    <div className="mt-2 space-y-1">
                      {engineData.engineauto2 && (
                        <div className="text-[15px] font-sans text-black flex flex-col">
                          <span className="font-bold">AT</span>{" "}
                          <span>{engineData.engineauto2}</span>
                        </div>
                      )}

                      {engineData.engineimt2 && (
                        <div className="text-[15px] font-sans text-black flex flex-col">
                          <span className="font-bold">iMT</span>{" "}
                          <span>{engineData.engineimt2}</span>
                        </div>
                      )}

                      {engineData.enginemanual2 && (
                        <div className="text-[15px] font-sans text-black flex flex-col">
                          <span className="font-bold">Manual</span>{" "}
                          <span>{engineData.enginemanual2}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Engine Section 3 */}
                {(singlecardData.engineh3 || singlecardData.enginesummary3) && (
                  <div>
                    <h4 className="text-[15px] font-bold font-sans mb-1">
                      <span className="text-black">
                        {singlecardData.engineh3}
                      </span>{" "}
                      {singlecardData.engineh31}
                    </h4>

                    {cleanHTMLContent(singlecardData.enginesummary3).length >
                    0 ? (
                      <div className="mb-2 text-[15px] font-sans text-black flex flex-col">
                        {cleanHTMLContent(singlecardData.enginesummary3).map(
                          (item, index) => (
                            <div
                              key={index}
                              className="mb-1"
                              dangerouslySetInnerHTML={{ __html: item }}
                            />
                          )
                        )}
                      </div>
                    ) : (
                      <p className="mb-2 text-[15px] font-sans text-gray-500 ">
                        No engine details available.
                      </p>
                    )}

                    {/* Transmission options */}
                    <div className="mt-2 space-y-1">
                      {engineData.engineauto3 && (
                        <div className="text-[15px] font-sans text-black flex flex-col">
                          <span className="font-bold">AT</span>{" "}
                          <span>{engineData.engineauto3}</span>
                        </div>
                      )}

                      {engineData.engineimt3 && (
                        <div className="text-[15px] font-sans text-black flex flex-col">
                          <span className="font-bold">iMT</span>{" "}
                          <span>{engineData.engineimt3}</span>
                        </div>
                      )}

                      {engineData.enginemanual3 && (
                        <div className="text-[15px] font-sans text-black flex flex-col">
                          <span className="font-bold">Manual</span>{" "}
                          <span>{engineData.enginemanual3}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                {/* Engine Section 4 */}
                {(singlecardData.engineh4 || singlecardData.enginesummary4) && (
                  <div>
                    <h4 className="text-[15px] font-bold font-sans mb-1">
                      <span className="text-black">
                        {singlecardData.engineh4}
                      </span>{" "}
                      {singlecardData.engineh41}
                    </h4>

                    {cleanHTMLContent(singlecardData.enginesummary4).length >
                    0 ? (
                      <div className="mb-2 text-[15px] font-sans text-black">
                        {cleanHTMLContent(singlecardData.enginesummary4).map(
                          (item, index) => (
                            <div
                              key={index}
                              className="mb-1"
                              dangerouslySetInnerHTML={{ __html: item }}
                            />
                          )
                        )}
                      </div>
                    ) : (
                      <p className="mb-2 text-[15px] font-sans text-gray-500">
                        No engine details available.
                      </p>
                    )}

                    {/* Transmission options */}
                    <div className="mt-2 space-y-1">
                      {engineData.engineauto4 && (
                        <div className="text-[15px] font-sans text-black flex flex-col">
                          <span className="font-bold">AT</span>{" "}
                          <span>{engineData.engineauto4}</span>
                        </div>
                      )}

                      {engineData.engineimt4 && (
                        <div className="text-[15px] font-sans text-black flex flex-col">
                          <span className="font-bold">iMT</span>{" "}
                          <span>{engineData.engineimt4}</span>
                        </div>
                      )}

                      {engineData.enginemanual4 && (
                        <div className="text-[15px] font-sans text-black flex flex-col">
                          <span className="font-bold">Manual</span>{" "}
                          <span>{engineData.enginemanual4}</span>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <p className="text-[15px] font-sans text-gray-500"></p>
            )}
          </AccordionDetails>
        </Accordion>

        {/* Warranty & Service Accordion */}
        <Accordion
          expanded={expandedPanel === "warranty"}
          onChange={handleAccordionChange("warranty")}
          disableGutters
          elevation={0}
          square
          sx={{
            "&:before": {
              display: "none",
            },
          }}
          className="mb-3 border border-gray-200 rounded-2xl shadow-none "
        >
          <AccordionSummary
            expandIcon={<ExpandMoreIcon className="text-gray-500" />}
          >
            <h3 className="font-medium hover:underline text-base text-black font-sans">
              Warranty & Service For {singlecardData.asliheader1}
            </h3>
          </AccordionSummary>
          <AccordionDetails className="bg-white px-4 py-3 rounded-b-2xl">
            <div className="flex flex-col">
              <div>
                <span className="text-[15px] font-bold font-sans mb-1">
                  Standard Warranty
                </span>
                <p className="text-[12px]  font-sans text-black">
                  {singlecardData.standard ||
                    "No standard warranty information available."}
                </p>
              </div>
              <div>
                <span className="text-[15px] font-bold font-sans mb-1">
                  Extended Warranty
                </span>
                <p className="text-[12px]  font-sans text-black">
                  {singlecardData.extended ||
                    "No extended warranty information available."}
                </p>
              </div>
              <div>
                <span className="text-[15px] font-bold font-sans mb-1">
                  Service Interval
                </span>
                <p className="text-[12px]  font-sans text-black">
                  {singlecardData.Service ||
                    "No service interval information available."}
                </p>
              </div>
            </div>
          </AccordionDetails>
        </Accordion>

        {/* Key Features Section */}
        <KeyFeaturesSection singlecardData={singlecardData} />
      </div>
    </section>
  );
};

export default FactFileProd;
