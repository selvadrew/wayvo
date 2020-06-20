import {
  UI_START_LOADING,
  UI_STOP_LOADING,
  START_LOADING_FRIENDS,
  STOP_LOADING_FRIENDS,
  START_ADDING_FRIEND,
  STOP_ADDING_FRIEND,
  START_LOADING_ACTIVITY,
  STOP_LOADING_ACTIVITY,
  START_LOADING_HELLO,
  STOP_LOADING_HELLO,
  START_LOADING_GROUPS,
  STOP_LOADING_GROUPS,
  START_LOADING_PLANS,
  STOP_LOADING_PLANS,
  START_LOADING_CHATS,
  STOP_LOADING_CHATS,
  START_LOADING_CALENDAR,
  STOP_LOADING_CALENDAR,
  START_LOADING_UPCOMING,
  STOP_LOADING_UPCOMING,
  START_LOADING_FRIENDS_CALENDAR,
  STOP_LOADING_FRIENDS_CALENDAR,
  START_LOADING_PLUS_BUTTON,
  STOP_LOADING_PLUS_BUTTON
} from "../actions/actionTypes";

const initialState = {
  isLoading: false,
  isLoadingFriends: false,
  isLoadingAddFriend: false,
  isLoadingActivity: false,
  isLoadingHello: false,
  saidHello: false,
  error: null,
  isLoadingGroups: false,
  isLoadingPlans: false,
  isLoadingChats: false,
  isLoadingCalendar: false,
  isLoadingUpcoming: false,
  isLoadingFriendsCalendar: false,
  isLoadingPlusButton: false
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case UI_START_LOADING:
      return {
        ...state,
        isLoading: true
      };
    case UI_STOP_LOADING:
      return {
        ...state,
        isLoading: false
      };

    case START_LOADING_FRIENDS:
      return {
        ...state,
        isLoadingFriends: true
      };
    case STOP_LOADING_FRIENDS:
      return {
        ...state,
        isLoadingFriends: false
      };

    case START_ADDING_FRIEND:
      return {
        ...state,
        isLoadingAddFriend: true
      };
    case STOP_ADDING_FRIEND:
      return {
        ...state,
        isLoadingAddFriend: false
      };

    case START_LOADING_ACTIVITY:
      return {
        ...state,
        isLoadingActivity: true
      };
    case STOP_LOADING_ACTIVITY:
      return {
        ...state,
        isLoadingActivity: false
      };

    case START_LOADING_HELLO:
      return {
        ...state,
        isLoadingHello: true
      };
    case STOP_LOADING_HELLO:
      return {
        ...state,
        saidHello: action.is_success,
        isLoadingHello: false,
        error: action.error
      };

    case START_LOADING_GROUPS:
      return {
        ...state,
        isLoadingGroups: true
      };
    case STOP_LOADING_GROUPS:
      return {
        ...state,
        isLoadingGroups: false
      };

    case START_LOADING_PLANS:
      return {
        ...state,
        isLoadingPlans: true
      };
    case STOP_LOADING_PLANS:
      return {
        ...state,
        isLoadingPlans: false
      };
    case START_LOADING_CHATS:
      return {
        ...state,
        isLoadingChats: true
      };
    case STOP_LOADING_CHATS:
      return {
        ...state,
        isLoadingChats: false
      };
    case START_LOADING_CALENDAR:
      return {
        ...state,
        isLoadingCalendar: true
      };
    case STOP_LOADING_CALENDAR:
      return {
        ...state,
        isLoadingCalendar: false
      };
    case START_LOADING_UPCOMING:
      return {
        ...state,
        isLoadingUpcoming: true
      };
    case STOP_LOADING_UPCOMING:
      return {
        ...state,
        isLoadingUpcoming: false
      };

    case START_LOADING_FRIENDS_CALENDAR:
      return {
        ...state,
        isLoadingFriendsCalendar: true
      };
    case STOP_LOADING_FRIENDS_CALENDAR:
      return {
        ...state,
        isLoadingFriendsCalendar: false
      };
    case START_LOADING_PLUS_BUTTON:
      return {
        ...state,
        isLoadingPlusButton: true
      };
    case STOP_LOADING_PLUS_BUTTON:
      return {
        ...state,
        isLoadingPlusButton: false
      };

    default:
      return state;
  }
};

export default reducer;
