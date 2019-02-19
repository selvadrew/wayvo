import { SET_LIVE_PROGRAM, CONNECT_GROUP_CALL } from "../actions/actionTypes";

const initialState = {
  active_groups: [],
  connected: null,
  phone_number: null,
  iOS: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIVE_PROGRAM:
      return {
        ...state,
        active_groups: action.program_details
      };
    case CONNECT_GROUP_CALL:
      return {
        ...state,
        connected: action.connected,
        phone_number: action.phone_number,
        iOS: action.iOS
      };

    default:
      return state;
  }
};

export default reducer;
