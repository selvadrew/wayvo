import { SET_ACCESS_TOKEN, SET_PROFILE } from "../../store/actions/users";
import { USERNAME_ERROR, STORE_PHONE_NUMBER } from "../actions/actionTypes";

const initialState = {
  accessToken: null,
  username: null,
  username_error: null,
  phoneNumber: null,
  fullname: null
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

    case STORE_PHONE_NUMBER:
      return {
        ...state,
        fullname: action.fullname,
        phoneNumber: action.phoneNumber,
        username: action.username
      };

    default:
      return state;
  }
};

export default reducer;
