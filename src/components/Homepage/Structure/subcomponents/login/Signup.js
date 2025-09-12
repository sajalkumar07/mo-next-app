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
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Signup = ({ mobile }) => {
  const navigate = useNavigate();
  const [selectedItem, setSelectedItem] = useState(null);
  const [selectedFile, setSelectedFile] = useState(null);
  const [selectedGender, setSelectedGender] = useState(null);
  const [formData, setFormData] = useState({
    fname: "",
    lname: "",
    email: "",
    mobile: mobile,
    DOB: "",
    pin: "",
    profession: "",
    wheredidyouhearus: "",
    gender: "",
    image: null,
  });
  const [componentKey, setComponentKey] = useState(0);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(true);
  const [isMobile, setIsMobile] = useState(false);

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
    const queryParams = new URLSearchParams(window.location.search);
    const mobileParam = queryParams.get("mobile");
    if (mobileParam) {
      setFormData((prevFormData) => ({
        ...prevFormData,
        mobile: mobileParam,
      }));
    }
  }, []);

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    setSelectedFile(file);
    setFormData({ ...formData, image: file });
  };

  const handleDrop = (event) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    setSelectedFile(file);
    setFormData({ ...formData, image: file });
  };

  const handleDragOver = (event) => {
    event.preventDefault();
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    const data = new FormData();
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value);
    });

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_API}/api/enduser`,
        {
          method: "POST",
          body: data,
        }
      );

      const responseData = await response.json();

      if (response.ok) {
        const user = responseData.data;
        delete user.success;
        localStorage.setItem("user", JSON.stringify(user));
        window.location.reload();
      } else {
        console.error("Signup failed:", responseData.error || "Unknown error");
        toast.error(
          `Registration failed: ${responseData.error || "Unknown error"}`
        );
      }
    } catch (error) {
      console.error("Signup failed:", error);
      toast.error("Registration failed! Please try again.");
    }
  };

  const handleSaveClick = () => {
    setFormData((prevFormData) => ({
      ...prevFormData,
      wheredidyouhearus: selectedItem,
      gender: selectedGender,
    }));
    setError(null);

    const {
      fname,
      lname,
      email,
      mobile,
      DOB,
      pin,
      profession,
      wheredidyouhearus,
      gender,
      image,
    } = formData;

    if (
      !fname ||
      !lname ||
      !email ||
      !DOB ||
      !pin ||
      !profession ||
      !wheredidyouhearus ||
      !gender
    ) {
      toast.error("Please fill in all fields.");
      return;
    }

    if (mobile.length !== 10) {
      toast.error("Mobile number must be 10 digits.");
      return;
    }

    if (pin.length !== 6) {
      toast.error("Pincode must be 6 digits.");
      return;
    }

    const currentDate = new Date();
    const selectedDOB = new Date(DOB);

    if (currentDate.getFullYear() - selectedDOB.getFullYear() < 6) {
      toast.error("Date of Birth must be correct.");
      return;
    }
    handleSubmit(new Event("submit"));
  };

  const handleSelect = (eventKey) => {
    setSelectedItem(eventKey);
  };

  const handleSelectGen = (eventKey) => {
    setSelectedGender(eventKey);
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
      <Dialog
        open={open}
        onClose={handleClose}
        maxWidth="md"
        fullWidth={false}
        PaperProps={{
          style: isMobile ? mobileDialogStyle : { maxWidth: "500px" },
        }}
        aria-labelledby="signup-dialog-title"
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
          <div className="text-center  overflow-hidden">
            <h2
              className={`${
                isMobile ? "text-lg" : "text-xl"
              } font-medium tracking-wide`}
            >
              LET'S GET <span className="text-red-600 font-bold">STARTED</span>
            </h2>
          </div>

          <form
            className={`space-y-${isMobile ? "3" : "4"}`}
            method="post"
            action=""
            encType="multipart/form-data"
            onSubmit={handleSubmit}
            onDrop={handleDrop}
            onDragOver={handleDragOver}
          >
            {/* Profile Photo */}
            <div className="flex flex-col items-center mb-4">
              <div className="relative mb-1">
                {selectedFile ? (
                  <img
                    src={URL.createObjectURL(selectedFile)}
                    alt="Profile"
                    className={`${
                      isMobile ? "w-16 h-16" : "w-20 h-20"
                    } rounded-full object-cover border border-gray-300`}
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
                  className="absolute bottom-0 right-0 bg-white    rounded-full p-1 border border-gray-300 cursor-pointer"
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
                  className="w-full border-b border-gray-300 pb-1 focus:outline-none focus:border-gray-500 text-gray-500 text-[13px]"
                  value={formData.mobile}
                  onChange={handleInputChange}
                  readOnly
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
                    value={selectedGender || ""}
                    onChange={(e) => handleSelectGen(e.target.value)}
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
                    isMobile ? "text-2xs" : "text-[13px]"
                  } text-gray-500 mb-1`}
                >
                  Profession
                </label>
                <div className="relative">
                  <select
                    name="profession"
                    value={selectedItem || ""}
                    onChange={handleInputChange}
                    className="w-full appearance-none border-b border-gray-300 pb-1 pr-8 focus:outline-none focus:border-gray-500 text-[13px] bg-transparent"
                  >
                    <option value="">Select your profession</option>
                    <option value="Student">Business Owner</option>
                    <option value="Engineer">Homemaker</option>
                    <option value="Doctor">Salaried</option>
                    <option value="Teacher">Self employed</option>
                    <option value="Other">Students</option>
                    <option value="Other">Others</option>
                  </select>
                  <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-2 text-gray-500">
                    <FaChevronDown size={12} />
                  </div>
                </div>
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
                    value={selectedItem || ""}
                    onChange={(e) => handleSelect(e.target.value)}
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

            {/* Save Button */}
            <div
              className={`${
                isMobile ? "mt-4" : "mt-6"
              } flex justify-center items-center`}
            >
              <button
                type="button"
                onClick={handleSaveClick}
                className={`w-[90px] h-[30px] px-4 py-${
                  isMobile ? "1.5" : "2"
                } bg-[#B10819] text-white ${
                  isMobile ? "text-2xl" : "text-[13px]"
                } rounded hover:bg-red-700`}
              >
                Save
              </button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />
    </div>
  );
};

export default Signup;
