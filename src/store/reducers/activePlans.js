import {
  SET_LIVE_PLANS,
  SET_MESSAGES,
  INCOMING_WEBSOCKET_MESSAGE
} from "../actions/actionTypes";

const initialState = {
  active_plans: [],
  messages: [],
  message_ids: []
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
        },
        message_ids: {
          ...state.message_ids,
          [action.id]: action.message_ids
        }
      };

    // if (state.message_ids.includes(action.message_data._id)) {
    case INCOMING_WEBSOCKET_MESSAGE:
      if (state.message_ids[action.plan_id].includes(action.message_data._id)) {
        return state
      } else {
        return {
          ...state,
          messages: {
            ...state.messages,
            [action.plan_id]: [
              action.message_data,
              ...state.messages[action.plan_id]
            ]
          },
          message_ids: {
            ...state.message_ids,
            [action.plan_id]: [action.message_data._id, ...state.message_ids[action.plan_id]]
          }
        };
      }

    default:
      return state;
  }
};

export default reducer;
