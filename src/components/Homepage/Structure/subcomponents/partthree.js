import React, { useState } from "react";
import Optlogin from "./login/Optlogin";
import Signup from "./login/Signup";
import Logout from "./login/Logout.js";
import Editprofile from "./login/editprofile.js";
import Location from "./location.js";
import MobileMenu from "./mobileline";
import "../../../main.css";

const PartThree = () => {
  const user = JSON.parse(localStorage.getItem("user"));
  const [isHovered, setIsHovered] = useState(false);

  const handleHover = () => {
    setIsHovered(!isHovered);
  };

  return (
    <div className="flex items-center">
      <div className="flex justify-between items-center space-x-4">
        {/* Location Component */}
        <div className="mr-2">
          <Location />
        </div>

        {/* User Profile Image */}
        {user && user.image && (
          <div
            className="relative group w-12 h-12 rounded-full overflow-hidden cursor-pointer"
            onMouseEnter={handleHover}
            onMouseLeave={handleHover}
          >
            <img
              className="w-full h-full object-cover"
              src={`${process.env.NEXT_PUBLIC_API}/userImages/${user.image}`}
              alt="User"
              crossOrigin="anonymous"
            />

            {/* Edit Profile Overlay */}
            <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-40 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Editprofile />
            </div>
          </div>
        )}

        {/* Login/Welcome Section - Only visible on desktop (xl and above) */}
        <div className="text-white hidden xl:block">
          {user && user.fname ? (
            <div className="flex flex-col items-end">
              <div className="text-sm">Welcome, {user.fname}</div>
              <div className="mt-1">
                <Logout />
              </div>
            </div>
          ) : (
            <Optlogin />
          )}
        </div>
      </div>

      {/* Mobile Menu - Visible on mobile, tablet, and iPad (all screens smaller than xl) */}
      <div className="xl:hidden ml-4">
        <MobileMenu />
      </div>
    </div>
  );
};

export default PartThree;
