// authReducer.js
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
} from '../actions/types';

const initialState = {
  mobile: '',
  inputValues: Array(6).fill(''),
  timer: 60,
  showInput: true,
  error: null,
  user: null,
  noUserFound: false,
};

const authReducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_MOBILE:
      return { ...state, mobile: action.payload };
    case SET_INPUT_VALUES:
      return { ...state, inputValues: action.payload };
    case SET_TIMER:
      return { ...state, timer: action.payload };
    case SET_SHOW_INPUT:
      return { ...state, showInput: action.payload };
    case SEND_OTP_SUCCESS:
      return { ...state, error: null };
    case SEND_OTP_FAILURE:
      return { ...state, error: action.payload };
    case VERIFY_OTP_SUCCESS:
      return { ...state, user: action.payload, error: null, noUserFound: false };
    case VERIFY_OTP_FAILURE:
      return { ...state, error: action.payload };
    case NO_USER_FOUND:
      return { ...state, noUserFound: true };
    default:
      return state;
  }
};

export default authReducer;
