import React from "react";
import Popup from "reactjs-popup";

const Logout = ({ closeMobileMenu }) => {
  const handleLogout = () => {
    localStorage.removeItem("user");
    window.location.reload();
  };

  const handleExplore = () => {
    window.location.reload("/news");
  };

  // Close mobile menu when popup opens
  const handleOpen = () => {
    if (closeMobileMenu) {
      closeMobileMenu();
    }
  };

  return (
    <Popup
      trigger={<div className="sign-upbutton">Logout</div>}
      modal
      onOpen={handleOpen}
    >
      <div className="bg-white flex justify-center items-center flex-col px-8 py-4">
        <span className="text-black">Are you sure you want to log out?</span>
        <div className="d-flex justify-content-between mt-3 w-75 gap-4 ">
          <button
            className="w-50 py-2 bg-[#B10819] text-white"
            onClick={handleLogout}
          >
            Yes
          </button>
          <button
            className="w-50 py-2 bg-[#D9D9D9] text-white"
            onClick={handleExplore}
          >
            Explore
          </button>
        </div>
      </div>
    </Popup>
  );
};

export default Logout;
