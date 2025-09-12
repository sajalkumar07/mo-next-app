import React from "react";
import { Link } from "react-router-dom";

const AreYouMissing = () => {
  return (
    <div className="w-full  rounded-md overflow-hidden">
      <div className="p-4 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-center">
          <span className="text-[#938C8C] text-[20px]">STILL</span>

          <span className="text-[#B1081A] text-[20px]"> CONFUSED ?</span>
        </h2>
        <Link to="https://carconsultancy.in/">
          {" "}
          <button className="bg-black shadow-md text-white w-[160px] h-[28px] flex-1 uppercase text-[16px]">
            Consult us
          </button>
        </Link>
      </div>
    </div>
  );
};

export default AreYouMissing;
