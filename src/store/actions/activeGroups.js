import { HOST } from "../../constants/index";

import { authGetToken } from "../actions/users";

import { uiStartLoading, uiStopLoading } from "../../store/actions/ui";
import {
  startLoadingActivity,
  stopLoadingActivity
} from "../../store/actions/ui";

import { SET_LIVE_PROGRAM, CONNECT_GROUP_CALL } from "../actions/actionTypes";

export const getActiveGroups = () => {
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
        return fetch(`${HOST}/api/v1/check_active_groups`, {
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
          dispatch(setLiveProgram([json.program_details]));
          dispatch(stopLoadingActivity());
        } else {
          dispatch(stopLoadingActivity());
          dispatch(setLiveProgram([]));
        }
      })
      .catch(e => {
        console.log(e);
        dispatch(stopLoadingActivity());
      });
  };
};

export function setLiveProgram(program_details) {
  return {
    type: SET_LIVE_PROGRAM,
    program_details
  };
}

export const joinGroupCall = id => {
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
        return fetch(`${HOST}/api/v1/said_hello_back_groups`, {
          method: "POST",
          body: JSON.stringify({
            program_id: id,
            access_token: access_token
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(
            callConnected(
              json.connected,
              json.call_details.phone_number,
              json.call_details.iOS
            )
          );
          dispatch(uiStopLoading());
        } else {
          dispatch(callConnected(json.connected, null, null));
          dispatch(uiStopLoading());
        }
      })
      .catch(e => {
        dispatch(uiStopLoading());
        alert(e);
      });
  };
};

export function callConnected(connected, phone_number, iOS) {
  return {
    type: CONNECT_GROUP_CALL,
    connected,
    phone_number,
    iOS
  };
}
