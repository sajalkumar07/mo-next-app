import React from "react";
import Partfirst from "./subcomponents/partfirst";
import Partsecond from "./subcomponents/partsecond";
import Partthree from "./subcomponents/partthree";

export const header = () => {
  return (
    <>
      <div className="main_header ">
        <div className="flex justify-center items-center w-full">
          <div className="flex justify-between items-center w-[1550px]">
            <Partfirst />
            <Partsecond />
            <Partthree />
          </div>
        </div>
      </div>
    </>
  );
};
export default header;
