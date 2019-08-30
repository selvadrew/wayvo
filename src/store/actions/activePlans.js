import { HOST } from "../../constants/index";
import { normalizeActivePlans } from "../../utils/index";

import { authGetToken } from "../actions/users";
import { Alert } from "react-native";

import {
  startLoadingPlans,
  stopLoadingPlans,
  startLoadingChats,
  stopLoadingChats
} from "../../store/actions/ui";
import {
  startLoadingActivity,
  stopLoadingActivity
} from "../../store/actions/ui";

import {
  SET_LIVE_PLANS,
  SET_MESSAGES,
  INCOMING_WEBSOCKET_MESSAGE
} from "./actionTypes";

export const getActivePlans = () => {
  return dispatch => {
    dispatch(startLoadingPlans());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
        dispatch(stopLoadingPlans());
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/get_live_plans`, {
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
          dispatch(setLivePlans(json.plans_to_show));
          dispatch(stopLoadingPlans());
        } else {
          alert(json.error);
          dispatch(stopLoadingPlans());
        }
      })
      .catch(e => {
        console.log(e);
        dispatch(stopLoadingPlans());
      });
  };
};

export function setLivePlans(live_plans) {
  return {
    type: SET_LIVE_PLANS,
    live_plans
  };
}

export const joinPlan = id => {
  return dispatch => {
    dispatch(startLoadingPlans());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
        dispatch(stopLoadingPlans());
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/join_plan`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            plan_id: id
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(stopLoadingPlans());
          dispatch(getActivePlans());
        } else {
          alert(json.error);
          dispatch(stopLoadingPlans());
        }
      })
      .catch(e => {
        console.log(e);
        dispatch(stopLoadingPlans());
      });
  };
};

export const getMessages = id => {
  return dispatch => {
    dispatch(startLoadingChats());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        Alert.alert("Not authenticated");
        dispatch(stopLoadingChats());
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/get_messages`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            plan_id: id
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          if (json.messages.length > 0) {
            console.log(id, json.messages);
            dispatch(setMessages(id, json.messages));
          }
          dispatch(stopLoadingChats());
        } else {
          Alert.alert("Sorry, there was an error");
          dispatch(stopLoadingChats());
        }
      })
      .catch(e => {
        Alert.alert("Oops, we couldn't connect, please try again.");
        dispatch(stopLoadingChats());
      });
  };
};

export function setMessages(id, messages) {
  return {
    type: SET_MESSAGES,
    id,
    messages
  };
}

export const incomingWebsocketMessage = (plan_id, message_data) => {
  return dispatch => {
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
      })
      .then(token => {
        dispatch(showIncomingMessage(plan_id, message_data));
      });
  };
};

export function showIncomingMessage(plan_id, message_data) {
  return {
    type: INCOMING_WEBSOCKET_MESSAGE,
    plan_id,
    message_data
  };
}

export const sendMessage = (plan_id, content) => {
  return dispatch => {
    dispatch(startLoadingChats());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
        dispatch(stopLoadingChats());
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/plan_messages`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            plan_id: plan_id,
            content: content
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          console.log("success");
        } else {
          Alert.alert("Your last message didn't send, there was an error.");
          dispatch(getMessages(plan_id));
        }
      })
      .catch(e => {
        Alert.alert("Your last message didn't send, there was an error.");
        dispatch(stopLoadingChats());
        dispatch(getMessages(plan_id));
      });
  };
};
