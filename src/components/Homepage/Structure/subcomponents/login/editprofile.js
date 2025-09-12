import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import {
  FaCloudUploadAlt,
  FaCamera,
  FaTimes,
  FaCalendarAlt,
  FaMapMarkerAlt,
  FaChevronDown,
} from "react-icons/fa";
import { MdEdit } from "react-icons/md";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const EditProfile = () => {
  const navigate = useNavigate();
  const [selectedFile, setSelectedFile] = useState(null);
  const [componentKey, setComponentKey] = useState(0);
  const [userData, setUserData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: "",
    pin: "",
    DOB: "",
    profession: "",
    wheredidyouhearus: "",
    gender: "",
    image: null,
  });
  const [open, setOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    // Check if screen width is mobile
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    // Initial check
    checkMobile();

    // Add event listener for window resize
    window.addEventListener("resize", checkMobile);

    // Clean up event listener
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    const user = JSON.parse(localStorage.getItem("user"));
    if (user) {
      const {
        fname,
        lname,
        email,
        mobile,
        pin,
        DOB,
        profession,
        wheredidyouhearus,
        gender,
        image,
      } = user;

      // Convert DOB to 'YYYY-MM-DD' format if it exists
      const formattedDOB = DOB ? new Date(DOB).toISOString().split("T")[0] : "";

      setUserData({
        fname,
        lname,
        email,
        mobile,
        pin,
        DOB: formattedDOB,
        profession,
        wheredidyouhearus,
        gender,
        image,
      });
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserData((prevUserData) => ({
      ...prevUserData,
      [name]: value,
    }));
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleSave = () => {
    setIsLoading(true);
    const user = JSON.parse(localStorage.getItem("user"));

    const formData = new FormData();
    formData.append("fname", userData.fname);
    formData.append("lname", userData.lname);
    formData.append("email", userData.email);
    formData.append("mobile", userData.mobile);
    formData.append("pin", userData.pin);
    formData.append("DOB", userData.DOB);
    formData.append("profession", userData.profession);
    formData.append("wheredidyouhearus", userData.wheredidyouhearus);
    formData.append("gender", userData.gender);
    if (selectedFile) {
      formData.append("image", selectedFile);
    } else {
      formData.append("deleteImage", user.image);
    }
    const userId = user.Userid;

    fetch(`${process.env.NEXT_PUBLIC_API}/api/enduser/${userId}`, {
      method: "PUT",
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.success) {
          const updatedUser = {
            ...data.data,
            Userid: data.data._id,
          };
          delete updatedUser._id;

          localStorage.setItem("user", JSON.stringify(updatedUser));
          setUserData(updatedUser);

          toast.success("User data updated successfully");
          window.location.reload();
        } else {
          toast.error(`Error updating user data: ${data.error}`);
        }
      })
      .catch((error) => {
        toast.error(`Error updating user data: ${error.message}`);
      })
      .finally(() => {
        setIsLoading(false);
        handleClose();
      });
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  // Mobile-specific dialog styles
  const mobileDialogStyle = {
    width: "346px",
    position: "relative",
    margin: "80px auto 0",
    borderRadius: "10px",
    padding: "20px",
    maxHeight: "593px",
    overflowY: "auto",
  };

  return (
    <div key={componentKey} className="font-sans">
      {/* Edit Profile Trigger Button */}
      <button
        onClick={handleOpen}
        className="flex items-center justify-center w-8 h-8 bg-gray-100 rounded-full hover:bg-gray-200"
      >
        <MdEdit className="text-gray-600" size={16} />
      </button>

      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth={false}
        PaperProps={{
          style: isMobile ? mobileDialogStyle : { maxWidth: "500px" },
        }}
        aria-labelledby="edit-profile-dialog-title"
        className={isMobile ? "" : "mt-20"}
      >
        <DialogContent
          className={`rounded-lg w-full relative ${
            isMobile ? "p-4" : "p-6 max-w-md"
          }`}
        >
          {/* Close button */}
          <button
            onClick={handleClose}
            className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
          >
            <FaTimes size={20} />
          </button>

          {/* Header */}
          <div className="text-center overflow-hidden">
            <h2
              className={`${
                isMobile ? "text-lg" : "text-xl"
              } font-medium tracking-wide`}
            >
              EDIT <span className="text-red-600 font-bold">PROFILE</span>
            </h2>
          </div>

          <form
            className={`space-y-${isMobile ? "3" : "4"}`}
            method="post"
            action=""
            encType="multipart/form-data"
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* Profile Photo */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative mb-1 ">
                {selectedFile ? (
                  <img
                    onClick={handleOpen}
                    src={URL.createObjectURL(selectedFile)}
                    alt="Profile"
                    className={`${
                      isMobile ? "w-16 h-16" : "w-20 h-20"
                    } rounded-full object-cover border border-gray-300`}
                  />
                ) : userData.image ? (
                  <img
                    onClick={handleOpen}
                    src={`${process.env.NEXT_PUBLIC_API}/userImages/${userData.image}`}
                    alt="Profile"
                    className={`${
                      isMobile ? "w-16 h-16" : "w-20 h-20"
                    } rounded-full object-cover border border-gray-300`}
                    crossOrigin="anonymous"
                  />
                ) : (
                  <div
                    className={`${
                      isMobile ? "w-16 h-16" : "w-20 h-20"
                    } rounded-full bg-gray-200 flex items-center justify-center`}
                  ></div>
                )}
                <label
                  htmlFor="file"
                  className="absolute bottom-0 right-0 bg-white rounded-full p-1 border border-gray-300 cursor-pointer"
                >
                  <FaCamera
                    size={isMobile ? 12 : 14}
                    className="text-gray-600"
                  />
                </label>
                <input
                  className="hidden"
                  type="file"
                  name="image"
                  id="file"
                  onChange={handleFileChange}
                />
              </div>
              <div
                className={`${
                  isMobile ? "text-[13px]" : "text-[13px]"
                } text-gray-600`}
              >
                My Profile Photo
              </div>
            </div>

            {/* Form Fields */}
            <div
              className={`grid ${
                isMobile ? "grid-cols-2 gap-2" : "grid-cols-2 gap-4"
              }`}
            >
              {/* First Name */}
              <div>
                <label
                  className={`block ${
                    isMobile ? "text-[13px]" : "text-[13px]"
                  } text-gray-500 mb-1`}
                >
                  First Name
                </label>
                <input
                  type="text"
                  name="fname"
                  className="w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-gray-500 bg-transparent text-[13px]"
                  placeholder=""
                  value={userData.fname}
                  onChange={handleInputChange}
                />
              </div>

              {/* Last Name */}
              <div>
                <label
                  className={`block ${
                    isMobile ? "text-[13px]" : "text-[13px]"
                  } text-gray-500 mb-1`}
                >
                  Last Name
                </label>
                <input
                  type="text"
                  name="lname"
                  className="w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-gray-500 text-[13px]"
                  placeholder=""
                  value={userData.lname}
                  onChange={handleInputChange}
                />
              </div>

              {/* Email */}
              <div>
                <label
                  className={`block ${
                    isMobile ? "text-2xs" : "text-[13px]"
                  } text-gray-500 mb-1`}
                >
                  Email Id
                </label>
                <input
                  type="email"
                  name="email"
                  className="w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-gray-500 text-[13px]"
                  placeholder=""
                  value={userData.email}
                  onChange={handleInputChange}
                />
              </div>

              {/* Mobile */}
              <div>
                <label
                  className={`block ${
                    isMobile ? "text-2xs" : "text-[13px]"
                  } text-gray-500 mb-1`}
                >
                  Mobile Number
                </label>
                <input
                  type="tel"
                  name="mobile"
                  className="w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-gray-500 text-[13px]"
                  placeholder=""
                  value={userData.mobile}
                  onChange={handleInputChange}
                />
              </div>

              {/* Gender */}
              <div>
                <label
                  className={`block ${
                    isMobile ? "text-2xs" : "text-[13px]"
                  } text-gray-500 mb-1`}
                >
                  Gender
                </label>
                <div className="relative">
                  <select
                    name="gender"
                    className="w-full appearance-none border-b border-gray-300 pb-1 pr-8 focus:outline-none focus:border-gray-500 bg-transparent text-[13px]"
                    value={userData.gender || ""}
                    onChange={(e) =>
                      setUserData((prevUserData) => ({
                        ...prevUserData,
                        gender: e.target.value,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Select Gender
                    </option>
                    <option value="Male">Male</option>
                    <option value="Female">Female</option>
                    <option value="Prefer Not to Say">Prefer Not to Say</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <FaChevronDown size={12} />
                  </div>
                </div>
              </div>

              {/* Date of Birth */}
              <div>
                <label
                  className={`block ${
                    isMobile ? "text-2xs" : "text-[13px]"
                  } text-gray-500 mb-1`}
                >
                  Date Of Birth
                </label>
                <div className="relative">
                  <input
                    type="date"
                    name="DOB"
                    className="w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-gray-500 text-[13px]"
                    value={userData.DOB || ""}
                    onChange={handleInputChange}
                  />
                </div>
              </div>

              {/* Pin Code */}
              <div>
                <label
                  className={`block ${
                    isMobile ? "text-2xs" : "text-[13px]"
                  } text-gray-500 mb-1`}
                >
                  Pin Code
                </label>
                <div className="relative">
                  <input
                    type="number"
                    name="pin"
                    className="w-full border-b border-gray-300 pb-1 pr-8 focus:outline-none focus:border-gray-500 text-[13px]"
                    placeholder=""
                    value={userData.pin}
                    onChange={handleInputChange}
                  />
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <FaMapMarkerAlt size={14} />
                  </div>
                </div>
              </div>

              {/* Profession */}
              <div>
                <label
                  className={`block ${
                    isMobile ? "text-[13px]" : "text-[13px]"
                  } text-gray-500 mb-1`}
                >
                  Profession
                </label>
                <select
                  name="profession"
                  value={userData.profession}
                  onChange={handleInputChange}
                  className="w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-gray-500 text-[13px] bg-transparent"
                >
                  <option value="">Select your profession</option>
                  <option value="Student">Business Owner</option>
                  <option value="Engineer">Homemaker</option>
                  <option value="Doctor">Salaried</option>
                  <option value="Teacher">Self employed</option>
                  <option value="Other">Students</option>
                  <option value="Other">Others</option>
                </select>
              </div>

              {/* How Did You Hear About Us */}
              <div className="col-span-2">
                <label
                  className={`block ${
                    isMobile ? "text-[13px]" : "text-[13px]"
                  } text-gray-500 mb-1`}
                >
                  How Did You Hear About Us?
                </label>
                <div className="relative">
                  <select
                    name="wheredidyouhearus"
                    className="w-full appearance-none border-b border-gray-300 pb-1 pr-8 focus:outline-none focus:border-gray-500 bg-transparent text-[13px]"
                    value={userData.wheredidyouhearus || ""}
                    onChange={(e) =>
                      setUserData((prevUserData) => ({
                        ...prevUserData,
                        wheredidyouhearus: e.target.value,
                      }))
                    }
                  >
                    <option value="" disabled>
                      Select Source
                    </option>
                    <option value="Youtube">Youtube</option>
                    <option value="Facebook">Facebook</option>
                    <option value="Instagram">Instagram</option>
                    <option value="WhatsApp">WhatsApp</option>
                    <option value="Google Search">Google Search</option>
                    <option value="Recommended by Someone">
                      Recommended by Someone
                    </option>
                    <option value="Other">Other</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <FaChevronDown size={12} />
                  </div>
                </div>
              </div>
            </div>

            {/* Loading Indicator (if needed) */}
            {isLoading && (
              <div className="flex justify-center items-center">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-red-600"></div>
              </div>
            )}

            {/* Save Button */}
            <div
              className={`${
                isMobile ? "mt-4" : "mt-6"
              } flex justify-center items-center`}
            >
              <button
                type="button"
                onClick={handleSave}
                className={`w-[90px] h-[30px] px-4 py-${
                  isMobile ? "1.5" : "2"
                } bg-[#B10819] text-white ${
                  isMobile ? "text-2xl" : "text-[13px]"
                } rounded hover:bg-red-700`}
                disabled={isLoading}
              >
                {isLoading ? "Saving..." : "Save"}
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default EditProfile;
