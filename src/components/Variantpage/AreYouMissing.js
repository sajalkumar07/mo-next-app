import React, { forwardRef } from "react";

const StillConfused = (props, ref) => {
  return (
    <div className="w-full   rounded-md overflow-hidden" ref={ref}>
      <div className="p-4 flex flex-col items-center">
        <h2 className="text-xl font-bold mb-4 text-center">
          <span className="text-[#818181] text-[20px]">ARE WE MISSING</span>
          <br />
          <span className="text-[#B1081A] text-[20px]">SOMETHING?</span>
        </h2>
        <div className="flex w-full space-x-4">
          <a href="mailto:TalkToUs@motoroctane.com">
            {" "}
            <button className="bg-black shadow-md shadow-black/30 text-white w-[160px] h-[28px] flex-1 uppercase text-[16px] font-sans">
              YES
            </button>
          </a>
          <button className="bg-[#F2F2F2] shadow-md shadow-black/30 text-[#818181] w-[160px] h-[28px] flex-1 uppercase text-[16px] font-sans">
            NO
          </button>
        </div>
      </div>
    </div>
  );
};

export default forwardRef(StillConfused);
