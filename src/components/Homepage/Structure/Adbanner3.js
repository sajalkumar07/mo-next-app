import React from "react";
import Image from "next/image";

const Adbanner3 = () => {
  return (
    <div className="relative mb-[50px] overflow-hidden  flex justify-center items-center text-center w-full">
      {/* <img style={{ width: "inherit" }} src={Ads3} alt="Advertisement Banner" />
      <img src="https://www.adspeed.com/placeholder-999x284.gif" /> */}
      <div className="w-[1400px]">
        <Image
          className="w-full"
          src="/images/car.jpg"
          alt="Motor Octane"
          width={900}
          height={96}
        />
      </div>
    </div>
  );
};

export default Adbanner3;
