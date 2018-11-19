import {
  SET_FRIENDS,
  REMOVE_FRIEND,
  INSERT_FRIEND,
  SET_FRIEND_REQUESTS,
  REFRESH_REQUESTS,
  CLEAR_FRIENDS,
  SEND_NOTIFICATION,
  RECEIVE_NOTIFICATION
} from "../actions/friends";

const initialState = {
  friends: [],
  friend_requests: [],
  new_friend: null,
  show_response: false,
  deleted_friend: null,
  deleted_response: false
};

// function keysrt(key, desc) {
//   return function(a, b) {
//     return desc ? ~~(a[key] < b[key]) : ~~(a[key] > b[key]);
//   };
// }

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_FRIENDS:
      return {
        ...state,
        friends: action.friends,
        show_response: false,
        deleted_response: false
      };

    case SEND_NOTIFICATION:
      return {
        ...state,
        friends: state.friends.map(
          friend =>
            friend.id === action.id
              ? // transform the one with a matching id
                { ...friend, send_notifications: action.option }
              : // otherwise return original friend
                friend
        ),
        show_response: false,
        deleted_response: false
      };

    case RECEIVE_NOTIFICATION:
      return {
        ...state,
        friends: state.friends.map(
          friend =>
            friend.id === action.id
              ? // transform the one with a matching id
                { ...friend, receive_notifications: action.option }
              : // otherwise return original friend
                friend
        ),
        show_response: false,
        deleted_response: false
      };

    case SET_FRIEND_REQUESTS:
      return {
        ...state,
        friend_requests: action.friends_requests,
        show_response: false,
        deleted_response: false
      };
    case REFRESH_REQUESTS:
      return {
        ...state,
        show_response: false,
        deleted_response: false,
        friend_requests: state.friend_requests.filter(friend => {
          return friend.username !== action.username;
        })
      };

    case REMOVE_FRIEND:
      return {
        ...state,
        show_response: false,
        friends: state.friends.filter(friend => {
          return friend.id !== action.id;
        }),
        deleted_friend: action.fullname,
        deleted_response: true
      };

    case INSERT_FRIEND:
      return {
        ...state,
        friends: [...state.friends, action.payload].sort((a, b) =>
          a.fullname.localeCompare(b.fullname)
        ),
        new_friend: action.payload.fullname,
        show_response: true,
        deleted_response: false
      };

    case CLEAR_FRIENDS:
      return {
        ...state,
        show_response: false,
        deleted_response: false,
        friends: [],
        friend_requests: []
      };

    default:
      return {
        ...state,
        new_friend: null,
        show_response: false,
        deleted_friend: null,
        deleted_response: false
      };
  }
};

export default reducer;
