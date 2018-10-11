import { HOST } from "../../constants/index";
import { normalizeFriends, normalizeFriendRequests } from "../../utils/index";

import { authGetToken } from "../actions/users";
import { Alert, AsyncStorage } from "react-native";

export const SET_FRIENDS = "SET_FRIENDS";
export const REMOVE_FRIEND = "REMOVE_FRIEND";
export const INSERT_FRIEND = "INSERT_FRIEND";
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
        Alert.alert("Not authenticated");
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
          Alert.alert(
            "Successfully Added",
            `${json.fullname} was added to your contact list`
          );
          dispatch(
            insertFriend(
              json.id,
              json.fullname,
              json.username,
              json.phone_number
            )
          );
          dispatch(getFriends());
          dispatch(stopLoadingFriends());
          dispatch(stopAddingFriend());
        } else {
          Alert.alert(json.error);
          dispatch(stopAddingFriend());
        }
      })
      .catch(e => {
        dispatch(stopAddingFriend());
        Alert.alert("Oops, we couldn't connect, please try again");
        console.log(e);
      });
  };
};

export const insertFriend = (id, fullname, username, phone_number) => {
  return {
    type: INSERT_FRIEND,
    payload: {
      id: id,
      fullname: fullname,
      username: username,
      phone_number: phone_number
    }
  };
};

export const friendsFromStorage = () => {
  return dispatch => {
    return AsyncStorage.getItem("pp:friends")
      .then(response => {
        if (response) {
          dispatch(setFriends(normalizeFriends(JSON.parse(response))));
        }
      })
      .catch(e => {
        console.log("error friends from storage");
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
          AsyncStorage.setItem("pp:friends", JSON.stringify(json.friends));
        } else {
          dispatch(stopLoadingFriends());
        }
      })
      .catch(e => {
        dispatch(stopLoadingFriends());
        dispatch(friendsFromStorage());
        console.log(e);
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
        if (json.ok) {
          dispatch(removeFriend(id));
          dispatch(getFriends());
          dispatch(stopLoadingFriends());
          Alert.alert(
            "Contact Deleted",
            "Contact has been removed from your contact list"
          );
        } else {
          console.log("new error");
          throw new Error();
        }
      })
      .catch(err => {
        Alert.alert("Oops, we couldn't connect, please try again");
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
        //1 alert(e);
        console.log(e);
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
