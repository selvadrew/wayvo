import { SET_ACCESS_TOKEN, SET_PROFILE } from "../../store/actions/users";
import {
  USERNAME_ERROR,
  STORE_PHONE_NUMBER,
  SIGNUP_ERROR,
  LOGIN_ERROR
} from "../actions/actionTypes";

const initialState = {
  accessToken: null,
  username: null,
  username_error: null,
  signup_error: null,
  login_error: null,
  phoneNumber: null,
  fullname: null,
  ios: null,
  verified: false,
  enrollment: null,
  instagram: null,
  snapchat: null,
  twitter: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.accessToken
      };
    case SET_PROFILE:
      return {
        ...state,
        profile: action.profile
      };
    case USERNAME_ERROR:
      return {
        ...state,
        username_error: action.error
      };
    case SIGNUP_ERROR:
      return {
        ...state,
        signup_error: action.error
      };
    case LOGIN_ERROR:
      return {
        ...state,
        login_error: action.error
      };
    case STORE_PHONE_NUMBER:
      return {
        ...state,
        fullname: action.fullname,
        phoneNumber: action.phoneNumber,
        username: action.username,
        ios: action.ios,
        verified: action.verified,
        enrollment: action.enrollment,
        instagram: action.instagram,
        snapchat: action.snapchat,
        twitter: action.twitter
      };

    default:
      return state;
  }
};

export default reducer;
