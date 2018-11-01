import {
  STORE_LAST_CALL_DATA,
  RESET_LAST_CALL,
  SECONDS_LEFT,
  CLEAR_CONNECTED
} from "../actions/actionTypes";

const initialState = {
  connected_with: null,
  can_say_hello: null,
  seconds_left: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case STORE_LAST_CALL_DATA:
      return {
        ...state,
        connected_with: action.say_hello_data.connected_with,
        can_say_hello: action.say_hello_data.can_say_hello,
        seconds_left: action.say_hello_data.seconds_left
      };
    case RESET_LAST_CALL:
      return {
        ...state,
        last_call: null
      };
    case SECONDS_LEFT:
      return {
        ...state,
        seconds_left: action.seconds_left,
        can_say_hello: false
      };
    case CLEAR_CONNECTED:
      return {
        ...state,
        connected_with: null,
        can_say_hello: null,
        seconds_left: null
      };
    default:
      return state;
  }
};

export default reducer;
