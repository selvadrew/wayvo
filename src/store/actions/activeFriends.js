import { HOST } from "../../constants/index";
import { normalizeActiveFriends } from "../../utils/index";

import { authGetToken } from "../actions/users";
import { Alert } from "react-native";

export const SET_ACTIVE_FRIENDS = "SET_ACTIVE_FRIENDS";
export const CONNECT_CALL = "CONNECT_CALL";

import { uiStartLoading, uiStopLoading } from "../../store/actions/ui";
import {
  startLoadingActivity,
  stopLoadingActivity
} from "../../store/actions/ui";

export const getActiveFriends = () => {
  return dispatch => {
    dispatch(startLoadingActivity());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
        dispatch(stopLoadingActivity());
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/check_active`, {
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
          dispatch(setFriends(normalizeActiveFriends(json.latest_outgoings)));
          dispatch(stopLoadingActivity());
        } else {
          alert(json.error);
          dispatch(stopLoadingActivity());
        }
      })
      .catch(e => {
        alert(e);
        dispatch(stopLoadingActivity());
      });
  };
};

export function setFriends(active_friends) {
  return {
    type: SET_ACTIVE_FRIENDS,
    active_friends
  };
}

export const joinCall = id => {
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
        return fetch(`${HOST}/api/v1/acceptors`, {
          method: "POST",
          body: JSON.stringify({
            outgoing_id: id,
            access_token: access_token
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(callConnected(id));
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

export function callConnected(id) {
  return {
    type: CONNECT_CALL,
    id
  };
}
