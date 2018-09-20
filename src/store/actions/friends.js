import { HOST } from "../../constants/index";
import { normalizeFriends, normalizeFriendRequests } from "../../utils/index";

import { authGetToken } from "../actions/users";
import { Alert } from "react-native";

export const SET_FRIENDS = "SET_FRIENDS";
export const REMOVE_FRIEND = "REMOVE_FRIEND";
export const SET_FRIEND_REQUESTS = "SET_FRIEND_REQUESTS";
export const REFRESH_REQUESTS = "REFRESH_REQUESTS";

import {
  uiStartLoading,
  uiStopLoading,
  startAddingFriend,
  stopAddingFriend,
  startLoadingFriends,
  stopLoadingFriends
} from "../../store/actions/ui";

export const addFriend = username => {
  return dispatch => {
    dispatch(startAddingFriend());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
        dispatch(stopAddingFriend());
      })
      .then(token => {
        access_token = token;

        return fetch(`${HOST}/api/v1/friendship`, {
          method: "POST",
          body: JSON.stringify({
            username: username,
            access_token: access_token
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          Alert.alert(`Successfully added ${json.friend} to your contact list`);
          dispatch(getFriends());
          dispatch(stopAddingFriend());
        } else {
          alert(json.error);
          dispatch(stopAddingFriend());
        }
      })
      .catch(e => {
        dispatch(stopAddingFriend());
        alert(e);
      });
  };
};

export const getFriends = () => {
  return dispatch => {
    dispatch(startLoadingFriends());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
        dispatch(stopLoadingFriends());
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/friends`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(setFriends(normalizeFriends(json.friends)));
          dispatch(stopLoadingFriends());
        } else {
          dispatch(stopLoadingFriends());
        }
      })
      .catch(e => {
        dispatch(stopLoadingFriends());
        alert(e);
      });
  };
};

export function setFriends(friends) {
  return {
    type: SET_FRIENDS,
    friends
  };
}

export const deleteFriend = id => {
  return dispatch => {
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("No valid token found!");
      })
      .then(token => {
        access_token = token;
        dispatch(removeFriend(id));
        return fetch(`${HOST}/api/v1/friendships`, {
          method: "DELETE",
          body: JSON.stringify({
            access_token: access_token,
            friend_id: id
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(json => {
        console.log("success json", json);
        if (json.ok) {
          dispatch(getFriends());
          alert("Successfully deleted!");
        } else {
          console.log("new error");
          throw new Error();
        }
      })
      .catch(err => {
        alert("Already deleted friend.");
        console.log(err);
      });
  };
};

export const removeFriend = id => {
  return {
    type: REMOVE_FRIEND,
    id: id
  };
};

export const getFriendRequests = () => {
  return dispatch => {
    dispatch(uiStartLoading());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
        dispatch(uiStopLoading());
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/friend_requests`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (json.is_success) {
          dispatch(
            setFriendRequests(normalizeFriendRequests(json.friend_requests))
          );
          dispatch(uiStopLoading());
        } else {
          dispatch(uiStopLoading());
        }
      })
      .catch(e => {
        dispatch(uiStopLoading());
        alert(e);
      });
  };
};

export function setFriendRequests(friends_requests) {
  return {
    type: SET_FRIEND_REQUESTS,
    friends_requests
  };
}

export const refreshFriendRequests = username => {
  return {
    type: REFRESH_REQUESTS,
    username
  };
};

export const rejectFriend = id => {
  return dispatch => {
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
      })
      .then(token => {
        access_token = token;

        return fetch(`${HOST}/api/v1/rejected`, {
          method: "POST",
          body: JSON.stringify({
            user_id: id,
            access_token: access_token
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch(e => alert(e));
  };
};
