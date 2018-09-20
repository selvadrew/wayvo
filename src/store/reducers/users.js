import { SET_ACCESS_TOKEN, SET_PROFILE } from "../../store/actions/users";
import { USERNAME_ERROR } from "../actions/actionTypes";

const initialState = {
  accessToken: null,
  profile: null,
  username_error: null
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

    default:
      return state;
  }
};

export default reducer;
