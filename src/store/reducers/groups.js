import {
  CHANGE_GROUP_STATE,
  SET_UNIVERSITIES,
  SET_PROGRAMS,
  CACHE_CONTINUE,
  SET_USER_GROUPS
} from "../actions/actionTypes";

const initialState = {
  group_state: 0,
  universities: null,
  programs: null,
  programId: null,
  startYear: null,
  enrolledUniversity: null,
  userGroups: null
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
    default:
      return state;
  }
};

export default reducer;
