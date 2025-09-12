import React from "react";
import { FaWhatsapp } from "react-icons/fa";

const Adbanner1 = () => {
  const handleBannerClick = () => {
    window.location.href = "https://carconsultancy.in/";
  };

  return (
    <div className="w-full flex align-center justify-center h-[284px] md:mt-36 mt-16 flex-col mb-10">
      <img
        onClick={handleBannerClick}
        src="https://motoroctane.com/wp-content/uploads/2024/09/consultancy-41.png"
        alt="Advertisement Banner"
        style={{
          objectFit: "scale-down",
          width: "100%",
          height: "100%",
          cursor: "pointer",
        }}
      />

      <a
        href="https://wa.me/918779952811"
        target="_blank"
        rel="noopener noreferrer"
        className="flex justify-center items-center  p-3"
      >
        <span className="bg-green-500 gap-1 p-2 rounded-full shadow-2xl duration-300  text-white flex justify-center items-center">
          <FaWhatsapp size={30} />
          <span className="font-semibold ">Chat on WhatsApp</span>
        </span>
      </a>
    </div>
  );
};

export default Adbanner1;
