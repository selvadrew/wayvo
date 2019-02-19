import {
  CHANGE_GROUP_STATE,
  SET_UNIVERSITIES,
  SET_PROGRAMS,
  CACHE_CONTINUE,
  SET_USER_GROUPS,
  SAID_HELLO_GROUPS,
  SET_CONNECTED_USERS
} from "../actions/actionTypes";

const initialState = {
  group_state: 0,
  universities: null,
  programs: null,
  programId: null,
  startYear: null,
  enrolledUniversity: null,
  userGroups: null,
  can_say_hello_groups: null,
  seconds_left_groups: null,
  groupConnections: null
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case CHANGE_GROUP_STATE:
      return {
        ...state,
        group_state: action.position
      };
    case SET_UNIVERSITIES:
      return {
        ...state,
        universities: action.universities
      };
    case SET_PROGRAMS:
      return {
        ...state,
        programs: action.programs
      };
    case CACHE_CONTINUE:
      return {
        ...state,
        programId: action.programId,
        startYear: action.startYear
      };
    case SET_USER_GROUPS:
      return {
        ...state,
        enrolledUniversity: action.enrolledUniversity,
        userGroups: action.userGroups
      };
    case SAID_HELLO_GROUPS:
      return {
        ...state,
        seconds_left_groups: action.seconds_left_groups,
        can_say_hello_groups: action.can_say_hello_groups
      };
    case SET_CONNECTED_USERS:
      return {
        ...state,
        groupConnections: action.groupConnections
      };
    default:
      return state;
  }
};

export default reducer;
