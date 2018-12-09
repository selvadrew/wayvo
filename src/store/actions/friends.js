import { HOST } from "../../constants/index";
import { normalizeFriends, normalizeFriendRequests } from "../../utils/index";

import { authGetToken } from "../actions/users";
import { Alert, AsyncStorage } from "react-native";

export const SET_FRIENDS = "SET_FRIENDS";
export const REMOVE_FRIEND = "REMOVE_FRIEND";
export const INSERT_FRIEND = "INSERT_FRIEND";
export const SET_FRIEND_REQUESTS = "SET_FRIEND_REQUESTS";
export const REFRESH_REQUESTS = "REFRESH_REQUESTS";
export const CLEAR_FRIENDS = "CLEAR_FRIENDS";
export const SEND_NOTIFICATION = "SEND_NOTIFICATION";
export const RECEIVE_NOTIFICATION = "RECEIVE_NOTIFICATION";

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
          //Alert.alert(`${json.fullname} is now a contact.`);
          dispatch(
            insertFriend(
              json.id,
              json.fullname,
              json.username,
              json.phone_number
            )
          );
          dispatch(getFriends());
          // temporary!!!!!!!
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

export const deleteFriend = (id, fullname) => {
  return dispatch => {
    let access_token;
    dispatch(startLoadingFriends());
    dispatch(authGetToken())
      .catch(() => {
        alert("No valid token found!");
        dispatch(stopLoadingFriends());
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
          dispatch(removeFriend(id, fullname));
          dispatch(getFriends());
          dispatch(stopLoadingFriends());
          //Alert.alert(`${fullname} deleted`);
        } else {
          console.log("new error");
          throw new Error();
          dispatch(stopLoadingFriends());
        }
      })
      .catch(err => {
        Alert.alert("Oops, we couldn't connect, please try again");
        console.log(err);
        dispatch(stopLoadingFriends());
      });
  };
};

export const removeFriend = (id, fullname) => {
  return {
    type: REMOVE_FRIEND,
    id: id,
    fullname: fullname
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
        if (json.is_success) {
          // dispatch(
          //   setFriendRequests(normalizeFriendRequests(json.friend_requests))
          // );
          dispatch(uiStopLoading());
        } else {
          alert("Oops, something went wrong, contact changes were not saved.");
        }
      })
      .catch(e => alert(e));
  };
};

export const sendNotification = (id, option) => {
  return dispatch => {
    dispatch(setSendNotification(id, option));
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/send_notifications`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            user_id: id,
            toggled_option: option
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (json.is_success) {
          console.log("success");
        } else {
          dispatch(setSendNotification(id, !option));
          alert("Oops, something went wrong, contact changes were reverted.");
        }
      })
      .catch(e => {
        dispatch(setSendNotification(id, !option));
        alert(e);
      });
  };
};

export const setSendNotification = (id, option) => {
  return {
    type: SEND_NOTIFICATION,
    id,
    option
  };
};

export const receiveNotification = (id, option) => {
  return dispatch => {
    dispatch(setReceiveNotification(id, option));
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/receive_notifications`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            user_id: id,
            toggled_option: option
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (json.is_success) {
          console.log("success");
        } else {
          dispatch(setReceiveNotification(id, !option));
          alert("Oops, something went wrong, contact changes were reverted.");
        }
      })
      .catch(e => {
        dispatch(setReceiveNotification(id, !option));
        alert(e);
      });
  };
};

export const setReceiveNotification = (id, option) => {
  return {
    type: RECEIVE_NOTIFICATION,
    id,
    option
  };
};
