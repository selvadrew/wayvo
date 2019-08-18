import { HOST } from "../../constants/index";

import { authGetToken } from "../actions/users";

import { uiStartLoading, uiStopLoading } from "../../store/actions/ui";
import {
  startLoadingActivity,
  stopLoadingActivity
} from "../../store/actions/ui";

import {
  SET_LIVE_PROGRAM,
  CONNECT_GROUP_CALL,
  SET_ACTIVE_CUSTOM_GROUPS,
  CONNECT_CUSTOM_GROUP_CALL
} from "../actions/actionTypes";

// both active friends and active groups uses the same load spinner - bug if one finishes and other still running
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
          if (json.program_details) {
            dispatch(setLiveProgram([json.program_details]));
          }
          if (json.live_custom_group_details) {
            console.log(json.live_custom_group_details);
            dispatch(setLiveCustomGroups(json.live_custom_group_details));
          }
          dispatch(stopLoadingActivity());
        } else {
          dispatch(stopLoadingActivity());
          dispatch(setLiveProgram([]));
          // dispatch(setLiveCustomGroups([]));
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

export function setLiveCustomGroups(live_custom_group_details) {
  return {
    type: SET_ACTIVE_CUSTOM_GROUPS,
    live_custom_group_details
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
        console.log(e);
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

export const joinCustomGroupCall = id => {
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
        return fetch(`${HOST}/api/v1/said_hello_back_custom_group`, {
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
          dispatch(customGroupCallConnected(id));
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

export function customGroupCallConnected(id) {
  return {
    type: CONNECT_CUSTOM_GROUP_CALL,
    id
  };
}
