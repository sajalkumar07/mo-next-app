import React from "react";
import Ads from "../../../Images/banner1.png";

const Adbanner1 = () => {
  return (
    <>
      <div
        className="onlydesptop"
        style={{
          width: "100%",
          overflow: "hidden",
          height: "126px",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          marginTop: "-10px",
          marginBottom: "20px",
          zIndex: "2",
          position: "relative",
          marginTop: "40px",
        }}
      >
        <img
          style={{
            width: "75%",
            overflow: "hidden",
            height: "auto",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
          src={Ads}
          alt="Advertisement Banner"
        />
      </div>
      <div
        className="onlyphoneme mt-3"
        style={{
          width: "100%",
          overflow: "hidden",
          height: "142px",
          alignItems: "center",
          justifyContent: "center",
          marginTop: "-10px",
          marginBottom: "20px",
          zIndex: "2",
          position: "relative",
        }}
      >
        <img
          style={{
            width: "100%",
            overflow: "hidden",
            height: "142px",
            alignItems: "center",
            justifyContent: "center",
            display: "flex",
          }}
          src={Ads}
          alt="Advertisement Banner"
        />
      </div>
    </>
  );
};

export default Adbanner1;
