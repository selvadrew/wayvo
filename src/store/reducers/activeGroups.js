import {
  SET_LIVE_PROGRAM,
  CONNECT_GROUP_CALL,
  SET_ACTIVE_CUSTOM_GROUPS,
  CONNECT_CUSTOM_GROUP_CALL
} from "../actions/actionTypes";

const initialState = {
  active_groups: [],
  active_custom_groups: [],
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
    case SET_ACTIVE_CUSTOM_GROUPS:
      return {
        ...state,
        active_custom_groups: action.live_custom_group_details
      };
    case CONNECT_CUSTOM_GROUP_CALL:
      return {
        ...state,
        active_custom_groups: state.active_custom_groups.map(group =>
          group.outgoing_id === action.id
            ? { ...group, connected: true }
            : group
        )
      };

    default:
      return state;
  }
};

export default reducer;
