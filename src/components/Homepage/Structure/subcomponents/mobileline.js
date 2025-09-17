import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import logo from "../../../../Images/mainlogo.png";
import { ArrowLeft } from "lucide-react";
import Optlogin from "./login/Optlogin";
import Logout from "./login/Logout";
import ReviewModal from "./ownerReview";
import { useParams } from "react-router-dom";
import MyLocation from "../../../Homepage/Structure/subcomponents/locaationModel"; // Import the MyLocation component
import Image from "next/image"; // Recommended for optimization

const MobileMenu = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [userExists, setUserExists] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showCalculatorOptions, setShowCalculatorOptions] = useState(false);
  const [reviewModalOpen, setReviewModalOpen] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [showLocationModal, setShowLocationModal] = useState(false); // New state for location modal
  const params = useParams();

  useEffect(() => {
    // Check if a user exists in localStorage
    const user = localStorage.getItem("user");
    setUserExists(!!user); // Convert to boolean
  }, []);

  const toggleNav = () => {
    setIsOpen(!isOpen);
  };

  const closeNav = () => {
    setIsOpen(false);
  };

  const toggleCalculatorOptions = () => {
    setShowCalculatorOptions((prev) => !prev);
  };

  // Function to open the location modal
  const openLocationModal = () => {
    setShowLocationModal(true);
    closeNav(); // Close the mobile menu when opening the modal
  };

  // Function to close the location modal
  const closeLocationModal = () => {
    setShowLocationModal(false);
  };

  // Function to open the review modal
  const openReviewModal = () => {
    setReviewModalOpen(true);
    closeNav(); // Close the mobile menu when opening the modal
  };

  // Function to close the review modal
  const closeReviewModal = () => {
    setReviewModalOpen(false);
  };

  // Common styles for menu items
  const menuItemClass =
    "flex items-center justify-between px-4 py-3 text-black text-[13px]";

  return (
    <div className="block relative font-bold font-sans">
      {/* Overlay Background - covers full screen when menu is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/30 bg-opacity-50 z-40"
          onClick={toggleNav}
        ></div>
      )}

      <div className="flex justify-end p-4">
        <button
          onClick={toggleNav}
          className="text-white text-3xl focus:outline-none"
          aria-label="Open Menu"
        >
          &#x2630;
        </button>
      </div>

      {/* Full Width Navigation Menu */}
      <div
        className={`fixed top-0 left-0 w-[300px] h-full bg-white z-50 transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        {/* Header Section */}
        <div className="flex justify-end">
          <button
            onClick={toggleNav}
            className="text-gray-300 text-sm p-2"
            aria-label="Close Menu"
          >
            ✕
          </button>
        </div>
        <div className="flex justify-center items-center">
          <div className="flex items-center justify-between p-2">
            <div className="w-24">
              <Link to="/" onClick={() => setIsOpen(false)}>
                <Image
                  src="/images/mainlogo.png" // public/images/mainlogo.png
                  alt="Motor Octane"
                  width={96} // Adjust width
                  height={96} // Adjust height
                />
              </Link>
            </div>
            {/* Close button */}
          </div>
        </div>

        {/* Scrollable Content Area */}
        <div className="flex-1 overflow-y-auto">
          <div className="mt-2">
            <nav className="flex flex-col">
              <Link
                to="/news"
                className={menuItemClass}
                onClick={() => setIsOpen(false)}
              >
                <span>News</span>
              </Link>

              <Link
                to="/Car-Compero"
                className={menuItemClass}
                onClick={() => setIsOpen(false)}
              >
                <span>Car Comparison</span>
              </Link>

              <Link
                to="https://carconsultancy.in/"
                className={menuItemClass}
                onClick={() => setIsOpen(false)}
              >
                <span>Consult Us</span>
              </Link>

              <Link
                to="https://www.youtube.com/@motoroctane"
                className={menuItemClass}
                onClick={() => setIsOpen(false)}
              >
                <span>Youtube Videos</span>
              </Link>

              {/* EMI Calculator item - Opens location modal */}
              <div className="px-4 py-3 ">
                <button
                  className="flex items-center justify-between w-full text-left font-medium text-[13px] text-black"
                  onClick={openLocationModal}
                >
                  <span className="font-bold">EMI Calculators</span>
                </button>
              </div>

              <span className={menuItemClass} onClick={() => setIsOpen(false)}>
                <span>Service Network</span>
              </span>

              <Link to="/owner-review">
                <span
                  className={menuItemClass}
                  onClick={() => setIsOpen(false)}
                >
                  <span>Share Reviews</span>
                </span>
              </Link>

              <Link
                to="/About-us"
                className={menuItemClass}
                onClick={() => setIsOpen(false)}
              >
                <span>About Us</span>
              </Link>

              <span className={menuItemClass} onClick={() => setIsOpen(false)}>
                <span>Share Feedback</span>
              </span>

              <Link
                to="/Terms-and-Conditions"
                className={menuItemClass}
                onClick={() => setIsOpen(false)}
              >
                <span>Terms of Service</span>
              </Link>

              <Link
                to="/Privacy-Policy"
                className={menuItemClass}
                onClick={() => setIsOpen(false)}
              >
                <span>Privacy Policy</span>
              </Link>
            </nav>
          </div>
        </div>

        {/* Sticky Login/Logout Button at Bottom */}
        <div className="flex-shrink-0 p-4 bg-white border-t border-gray-200">
          <div className="flex justify-center">
            {userExists ? (
              <div className="px-6 py-3 bg-[#87231c] rounded-md text-center text-[15px] w-full max-w-xs">
                <Logout closeMobileMenu={closeNav} />
              </div>
            ) : (
              <div className="bg-[#B10819] font-sans text-[15px] text-center rounded-xl w-full max-w-xs">
                <Optlogin closeMobileMenu={closeNav} isMobile={true} />
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Location Modal */}
      {showLocationModal && (
        <div className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50">
          <MyLocation onClose={closeLocationModal} />
        </div>
      )}

      {/* Review Modal */}
      <ReviewModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        carId={params.id}
      />
    </div>
  );
};

export default MobileMenu;
