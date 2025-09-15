import React from "react";
import Partfirst from "./subcomponents/partfirst";
import Partsecond from "./subcomponents/partsecond";
import Partthree from "./subcomponents/partthree";

export const Header = () => {
  return (
    <div className="bg-black text-white px-4">
      <div className="flex justify-center items-center w-full">
        <div className="flex justify-between items-center w-full max-w-[1400px]">
          <Partfirst />
          <Partsecond />
          <Partthree />
        </div>
      </div>
    </div>
  );
};

export default Header;
