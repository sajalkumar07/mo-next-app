import React, { useState } from "react";
import "../../../main.css";
import Optlogin from "./login/Optlogin";
import Signup from "./login/Signup";
import Logout from "./login/Logout.js";
import Editprofile from "./login/editprofile.js";
import Location from "./location.js";
import MobileMenu from "./mobileline";

const PartThree = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <div className="partthree">
      <div className="flex justify-between items-center space-x-4">
        {" "}
        <div className="mr-2">
          {" "}
          <Location />
        </div>
        {user && user.image && (
          <div
            className="relative group w-[48px] h-[48px] mx-auto rounded-full overflow-hidden"
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
          >
            {/* User Image */}
            <img
              className="w-full h-full object-cover"
              src={`${process.env.NEXT_PUBLIC_API}/userImages/${user.image}`}
              alt="User"
              crossOrigin="anonymous"
            />

            {/* Centered Edit Button */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Editprofile />
            </div>
          </div>
        )}
        <div className="header-text">
          {user && user.fname ? (
            <>
              <div className="onlydesptop">Welcome, {user.fname} </div>
              <div className="onlydesptop">
                {" "}
                <Logout />
              </div>
            </>
          ) : (
            <>
              <Optlogin />
            </>
          )}
        </div>
      </div>
      <MobileMenu />
    </div>
  );
};

export default PartThree;
