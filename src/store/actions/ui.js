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
  STOP_LOADING_HELLO
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
