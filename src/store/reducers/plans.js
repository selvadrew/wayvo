import {
  SET_GROUP_FOR_PLAN,
  SET_ACTIVITY_FOR_PLAN,
  SET_TIME_FOR_PLAN,
  SET_EXPLODING_OFFER_FOR_PLAN
} from "../actions/actionTypes";

const initialState = {
  groupName: null,
  groupType: null,
  groupId: null,
  activity: null,
  time: null,
  explodingOffer: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_GROUP_FOR_PLAN:
      return {
        ...state,
        groupName: action.value,
        groupType: action.groupType,
        groupId: action.id
      };
    case SET_ACTIVITY_FOR_PLAN:
      return {
        ...state,
        activity: action.plan
      };
    case SET_TIME_FOR_PLAN:
      return {
        ...state,
        time: action.time
      };
    case SET_EXPLODING_OFFER_FOR_PLAN:
      return {
        ...state,
        explodingOffer: action.timer
      };

    default:
      return state;
  }
};

export default reducer;
