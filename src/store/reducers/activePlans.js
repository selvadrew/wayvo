import {
  SET_LIVE_PLANS,
  SET_MESSAGES,
  INCOMING_WEBSOCKET_MESSAGE
} from "../actions/actionTypes";

const initialState = {
  active_plans: [],
  messages: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_LIVE_PLANS:
      return {
        ...state,
        active_plans: action.live_plans
      };

    case SET_MESSAGES:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.id]: action.messages
        }
      };

    case INCOMING_WEBSOCKET_MESSAGE:
      return {
        ...state,
        messages: {
          ...state.messages,
          [action.plan_id]: [
            action.message_data,
            ...state.messages[action.plan_id]
          ]
        }
      };

    default:
      return state;
  }
};

export default reducer;
