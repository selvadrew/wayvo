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
  STOP_LOADING_CHATS
} from "./actionTypes";

export const uiStartLoading = () => {
  return {
    type: UI_START_LOADING
  };
};

export const uiStopLoading = () => {
  return {
    type: UI_STOP_LOADING
  };
};

export const startLoadingFriends = () => {
  return {
    type: START_LOADING_FRIENDS
  };
};

export const stopLoadingFriends = () => {
  return {
    type: STOP_LOADING_FRIENDS
  };
};

export const startAddingFriend = () => {
  return {
    type: START_ADDING_FRIEND
  };
};

export const stopAddingFriend = () => {
  return {
    type: STOP_ADDING_FRIEND
  };
};

export const startLoadingActivity = () => {
  return {
    type: START_LOADING_ACTIVITY
  };
};

export const stopLoadingActivity = () => {
  return {
    type: STOP_LOADING_ACTIVITY
  };
};

export const startLoadingHello = () => {
  return {
    type: START_LOADING_HELLO
  };
};

export const stopLoadingHello = (is_success, error) => {
  return {
    type: STOP_LOADING_HELLO,
    is_success,
    error
  };
};

export const startLoadingGroups = () => {
  return {
    type: START_LOADING_GROUPS
  };
};

export const stopLoadingGroups = () => {
  return {
    type: STOP_LOADING_GROUPS
  };
};

export const startLoadingPlans = () => {
  return {
    type: START_LOADING_PLANS
  };
};

export const stopLoadingPlans = () => {
  return {
    type: STOP_LOADING_PLANS
  };
};

export const startLoadingChats = () => {
  return {
    type: START_LOADING_CHATS
  };
};

export const stopLoadingChats = () => {
  return {
    type: STOP_LOADING_CHATS
  };
};
