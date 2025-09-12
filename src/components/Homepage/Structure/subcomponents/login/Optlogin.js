import React, { useState, useEffect } from "react";
import Modal from "@mui/material/Modal";
import Box from "@mui/material/Box";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import logo from "../../../../../Images/mainlogo.png";
import Signup from "./Signup";
import { useDispatch, useSelector } from "react-redux";
import {
  setMobile,
  setInputValues,
  setTimer,
  setShowInput,
  sendOtp,
  verifyOtp,
} from "../../../../../redux/actions/authActions";

const Optlogin = ({ closeMobileMenu }) => {
  const dispatch = useDispatch();
  const { mobile, inputValues, timer, showInput, noUserFound } = useSelector(
    (state) => state.auth
  );

  const [isChecked, setIsChecked] = useState(false);
  const [open, setOpen] = useState(false);
  const [editingMobile, setEditingMobile] = useState(false);

  const handleMobileChange = (e) => {
    dispatch(setMobile(e.target.value));
  };

  const handleCheckboxChange = () => {
    setIsChecked(!isChecked);
  };

  const handleOpen = () => {
    // Close mobile menu when opening modal
    if (closeMobileMenu) {
      closeMobileMenu();
    }
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    // Reset any necessary states when closing
    dispatch(setShowInput(true));
    dispatch(setInputValues(Array(6).fill("")));
    dispatch(setTimer(0));
    setEditingMobile(false);
  };

  useEffect(() => {
    let countdown;

    if (timer > 0 && !showInput) {
      countdown = setInterval(() => {
        dispatch(setTimer(timer - 1));
      }, 1000);
    }

    return () => clearInterval(countdown);
  }, [timer, showInput, dispatch]);

  const handleGetOTP = () => {
    dispatch(sendOtp(mobile));
  };

  const handleResendOTP = () => {
    dispatch(sendOtp(mobile));
  };

  const handleOtpChange = (index, value) => {
    const newInputValues = [...inputValues];
    newInputValues[index] = value;

    dispatch(setInputValues(newInputValues));

    if (value !== "" && index < inputValues.length - 1) {
      document.getElementById(`input-${index + 1}`).focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === "Backspace" && index > 0 && !inputValues[index]) {
      document.getElementById(`input-${index - 1}`).focus();
    }
  };

  const handleVerifyOtp = () => {
    const otp = inputValues.join("");
    dispatch(verifyOtp(mobile, otp));
  };

  const handleEditMobile = () => {
    // Go back to the first step where user enters their number
    dispatch(setShowInput(true));
    // Reset OTP inputs
    dispatch(setInputValues(Array(6).fill("")));
    dispatch(setTimer(0));
  };

  useEffect(() => {
    if (noUserFound) {
      toast.error("You don't have an account, please create one.", {
        theme: "colored",
      });
    }
  }, [noUserFound]);

  return (
    <>
      {/* <ToastContainer /> */}
      <div className="cursor-pointer" onClick={handleOpen}>
        Sign Up / Login
      </div>

      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className="mt-20"
        sx={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Box
          sx={{
            backgroundColor: "background.paper",
            borderRadius: 2,
            boxShadow: 24,
            p: 4,
            width: "100%",
            maxWidth: "346px",
            height: "366px",
            position: "relative",
          }}
        >
          <button
            className="absolute top-2 right-2 text-2xl font-bold cursor-pointer"
            onClick={handleClose}
          >
            &times;
          </button>

          <div className="flex flex-col items-center -mt-6">
            <div className="w-[88px]">
              <img src={logo} alt="Motor octane" className="w-full h-[100px]" />
            </div>

            <h2 className="text-[21px] mb-6 text-center text-black">
              GET <span className="text-[#B10819] font-bold">STARTED</span>
            </h2>
            <h2 className="text-[17px] font-[Montserrat] text-center text-black">
              Enter Your Mobile Number
            </h2>

            {noUserFound ? (
              <Signup mobile={mobile} onClose={handleClose} />
            ) : (
              <>
                {showInput && (
                  <div className="w-full mb-6">
                    <div className="flex items-center justify-center mb-4  w-full">
                      <div className="flex items-center border border-[#80c3e6] rounded px-3 py-2 w-[244px] ">
                        <span className="text-gray-400 mr-1 flex justify-center items-center">
                          +91
                        </span>
                        <input
                          type="text"
                          maxLength="10"
                          value={mobile}
                          onChange={handleMobileChange}
                          className="outline-none  text-gray-700 placeholder-gray-400 w-full h-[20px] flex justify-center items-center "
                        />
                      </div>
                    </div>

                    <div className="flex items-start ">
                      <input
                        className="mt-4"
                        type="checkbox"
                        id="flexCheckDefault"
                        checked={isChecked}
                        onChange={handleCheckboxChange}
                      />
                      <div className="text-[14px] text-[#9E9E9E] font-[Inter] flex justify-center flex-col ml-4">
                        By continuing, you agree to our{" "}
                        <p className="cursor-pointer text-[#B10819] text-[14px] font-[Inter]">
                          Terms of service{" "}
                          <span className="text-[#9E9E9E]">and</span> Privacy
                          Policy
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {showInput ? (
                  <button
                    className={`py-2 px-2 rounded text-white -mt-8 w-[90px] h-[30px] ${
                      isChecked
                        ? "bg-[#B10819] cursor-pointer"
                        : "bg-gray-400 cursor-not-allowed"
                    }`}
                    onClick={handleGetOTP}
                    disabled={!isChecked}
                  >
                    Get OTP
                  </button>
                ) : (
                  <div className="flex flex-col items-center">
                    {/* Display mobile number with edit button */}
                    <div className="w-full flex justify-center items-center">
                      <p className="text-black">
                        We have sent a verification code to
                      </p>
                    </div>

                    <div className="w-full flex justify-center items-center mb-4">
                      <div className="flex items-center justify-center">
                        <span className="text-xl font-semibold text-[#B10819]">
                          +91 {mobile}
                        </span>
                        <button
                          className="ml-2 text-gray-500"
                          onClick={handleEditMobile}
                        >
                          {" "}
                          <svg
                            width="22"
                            height="22"
                            viewBox="0 0 22 22"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                          >
                            <path
                              d="M10.1982 2.83958H8.56871C4.49489 2.83958 2.86536 4.46911 2.86536 8.54294V13.4315C2.86536 17.5054 4.49489 19.1349 8.56871 19.1349H13.4573C17.5311 19.1349 19.1607 17.5054 19.1607 13.4315V11.802M13.384 4.59133C13.9299 6.53862 15.4535 8.06223 17.4089 8.61627M14.3047 3.67064L7.88431 10.091C7.63988 10.3354 7.39545 10.8161 7.34657 11.1665L6.99622 13.6189C6.86585 14.507 7.49322 15.1262 8.38132 15.004L10.8338 14.6537C11.176 14.6048 11.6567 14.3604 11.9093 14.1159L18.3296 7.69558C19.4377 6.5875 19.9591 5.30017 18.3296 3.67064C16.7001 2.04111 15.4127 2.56256 14.3047 3.67064Z"
                              stroke="#9E9E9E"
                              stroke-width="1.89"
                              stroke-miterlimit="10"
                              stroke-linecap="round"
                              stroke-linejoin="round"
                            />
                          </svg>
                        </button>
                      </div>
                    </div>

                    <div className="flex gap-2 mb-4">
                      {inputValues.map((value, index) => (
                        <input
                          key={index}
                          id={`input-${index}`}
                          type="text"
                          value={value}
                          maxLength={1}
                          onChange={(e) =>
                            handleOtpChange(index, e.target.value)
                          }
                          placeholder="0"
                          onKeyDown={(e) => handleKeyDown(index, e)}
                          className="w-10 h-10 text-center border border-gray-300 rounded"
                        />
                      ))}
                    </div>

                    <div className="flex flex-col items-center">
                      <div className="flex justify-center items-center gap-4 w-full">
                        {timer === 0 ? (
                          <button
                            className="flex px-4 py-2 bg-[#B10819] text-white rounded w-[90px] h-[30px] text-center flex justify-center items-center"
                            onClick={handleResendOTP}
                          >
                            Resend
                          </button>
                        ) : (
                          <button
                            className="px-4 py-2 bg-[#B10819] text-white rounded w-[90px] h-[30px] text-center flex justify-center items-center"
                            onClick={handleVerifyOtp}
                          >
                            Verify OTP
                          </button>
                        )}
                      </div>
                      <p className="text-center mb-1 text-gray-500 mt-4">
                        Didn't get a Code?
                      </p>
                      <p className="text-center mb-4 text-[#B10819]">
                        {timer > 0
                          ? `Resend OTP in ${timer} seconds`
                          : "You can now resend the OTP"}
                      </p>
                    </div>
                  </div>
                )}
              </>
            )}
          </div>
        </Box>
      </Modal>
    </>
  );
};

export default Optlogin;
