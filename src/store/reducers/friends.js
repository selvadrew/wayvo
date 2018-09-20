import {
  SET_FRIENDS,
  REMOVE_FRIEND,
  SET_FRIEND_REQUESTS,
  REFRESH_REQUESTS
} from "../actions/friends";

const initialState = {
  friends: [],
  friend_requests: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FRIENDS:
      return {
        ...state,
        friends: action.friends
      };
    case SET_FRIEND_REQUESTS:
      return {
        ...state,
        friend_requests: action.friends_requests
      };
    case REFRESH_REQUESTS:
      return {
        ...state,
        friend_requests: state.friend_requests.filter(friend => {
          return friend.username !== action.username;
        })
      };

    case REMOVE_FRIEND:
      return {
        ...state,
        friends: state.friends.filter(friend => {
          return friend.id !== action.id;
        })
      };

    default:
      return state;
  }
};

export default reducer;
