// authActions.js
import {
  SET_MOBILE,
  SET_INPUT_VALUES,
  SET_TIMER,
  SET_SHOW_INPUT,
  SEND_OTP_SUCCESS,
  SEND_OTP_FAILURE,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_FAILURE,
  NO_USER_FOUND,
} from "./types";

export const setMobile = (mobile) => ({
  type: SET_MOBILE,
  payload: mobile,
});

export const setInputValues = (inputValues) => ({
  type: SET_INPUT_VALUES,
  payload: inputValues,
});

export const setTimer = (timer) => ({
  type: SET_TIMER,
  payload: timer,
});

export const setShowInput = (showInput) => ({
  type: SET_SHOW_INPUT,
  payload: showInput,
});

export const sendOtp = (mobile) => async (dispatch) => {
  dispatch({ type: SET_SHOW_INPUT, payload: false });
  dispatch({ type: SET_TIMER, payload: 60 });

  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/auth/send-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: mobile }),
      }
    );

    if (!response.ok) {
      throw new Error("Failed to send OTP");
    }

    dispatch({ type: SEND_OTP_SUCCESS });
  } catch (error) {
    dispatch({ type: SEND_OTP_FAILURE, payload: error.message });
  }
};

export const verifyOtp = (mobile, otp) => async (dispatch) => {
  try {
    const response = await fetch(
      `${process.env.NEXT_PUBLIC_API}/api/auth/verify-otp`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ phone: mobile, otp }),
      }
    );

    const result = await response.json();

    if (response.ok && result.success) {
      const userResponse = await fetch(
        `${process.env.NEXT_PUBLIC_API}/endUserlogin`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ mobile }),
        }
      );

      const userResult = await userResponse.json();

      if (userResult.result === "No User found") {
        dispatch({ type: NO_USER_FOUND });
      } else {
        const data = {
          image: userResult.image,
          fname: userResult.fname,
          lname: userResult.lname,
          email: userResult.email,
          DOB: userResult.DOB,
          gender: userResult.gender,
          mobile: userResult.mobile,
          pin: userResult.pin,
          profession: userResult.profession,
          wheredidyouhearus: userResult.wheredidyouhearus,
          Userid: userResult._id,
        };

        localStorage.setItem("user", JSON.stringify(data));
        dispatch({ type: VERIFY_OTP_SUCCESS, payload: data });
        window.location.reload();
      }
    } else {
      throw new Error(result.message || "Failed to verify OTP");
    }
  } catch (error) {
    dispatch({ type: VERIFY_OTP_FAILURE, payload: error.message });
  }
};
