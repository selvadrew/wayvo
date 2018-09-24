import { HOST } from "../../constants/index";
import { AsyncStorage } from "react-native";
import { authGetToken } from "./users";

export const OUTGOING_CALL = "OUTGOING_CALL";

import {
  STORE_LAST_CALL_DATA,
  RESET_LAST_CALL,
  SECONDS_LEFT
} from "./actionTypes";

import { normalizeSayHelloData } from "../../utils/index";
import {
  startLoadingHello,
  stopLoadingHello,
  uiStartLoading,
  uiStopLoading
} from "../../store/actions/ui";

import SplashScreen from "react-native-splash-screen";

export const outgoingCall = seconds => {
  return dispatch => {
    dispatch(startLoadingHello());
    let timeOptions = [300, 900, 1800, 3600];
    let access_token;
    let last_call;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
        dispatch(stopLoadingHello(false));
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/outgoings`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            seconds: timeOptions[seconds]
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
        if (json.is_success) {
          let seconds_left;
          if (json.last_said_hello && json.countdown_timer) {
            let now = new Date(new Date().toISOString());
            let dateSaid = new Date(json.last_said_hello);
            let calculatedSeconds = Math.round(
              json.countdown_timer - (now - dateSaid) / 1000
            );
            if (calculatedSeconds > 0) {
              seconds_left = calculatedSeconds;
            } else {
              seconds_left = null;
            }
          } else {
            seconds_left = null;
          }

          dispatch(secondsLeft(seconds_left));
          dispatch(stopLoadingHello(json.is_success));
        } else {
          dispatch(stopLoadingHello(json.is_success, json.error));
        }
      })
      .catch(e => {
        dispatch(stopLoadingHello(json.is_success));
      });
  };
};

export const storeLastCall = () => {
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
        return fetch(`${HOST}/api/v1/last_connected`, {
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
          let seconds_left;
          if (json.last_said_hello && json.countdown_timer) {
            let now = new Date(new Date().toISOString());
            let dateSaid = new Date(json.last_said_hello);
            let calculatedSeconds = Math.round(
              json.countdown_timer - (now - dateSaid) / 1000
            );
            if (calculatedSeconds > 0) {
              seconds_left = calculatedSeconds;
            } else {
              seconds_left = null;
            }
          } else {
            seconds_left = null;
          }
          dispatch(
            storeLastCallData(normalizeSayHelloData(json, seconds_left))
          );
          //if (Platform.OS === "ios") {SplashScreen.hide()}
          dispatch(uiStopLoading());
        } else {
          dispatch(uiStopLoading());
          //if (Platform.OS === "ios") {SplashScreen.hide()}
        }
      })
      .catch(e => {
        dispatch(uiStopLoading());
        alert(e);
      });
  };
};

export const storeLastCallData = say_hello_data => {
  return {
    type: STORE_LAST_CALL_DATA,
    say_hello_data
  };
};

export const resetLastCall = () => {
  return {
    type: RESET_LAST_CALL
  };
};

export const secondsLeft = seconds_left => {
  return {
    type: SECONDS_LEFT,
    seconds_left
  };
};
