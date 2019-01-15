import { CHANGE_GROUP_STATE } from "../actions/actionTypes";

const initialState = {
  group_state: 2
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_GROUP_STATE:
      return {
        ...state,
        group_state: action.position
      };
    default:
      return state;
  }
};

export default reducer;
