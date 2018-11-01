import {
  SET_ACTIVE_FRIENDS,
  CONNECT_CALL,
  CLEAR_ACTIVE_FRIENDS
} from "../actions/activeFriends";

const initialState = {
  active_friends: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACTIVE_FRIENDS:
      return {
        ...state,
        active_friends: action.active_friends
      };

    case CONNECT_CALL:
      return {
        ...state,
        active_friends: state.active_friends.map(
          friend =>
            friend.outgoing_id === action.id
              ? { ...friend, connected: true }
              : friend
        )
      };

    case CLEAR_ACTIVE_FRIENDS:
      return {
        ...state,
        active_friends: []
      };

    //change the connected to true ^
    default:
      return state;
  }
};

export default reducer;
