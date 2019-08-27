import { HOST } from "../../constants/index";
import { AsyncStorage, Alert } from "react-native";
import {
  SET_GROUP_FOR_PLAN,
  SET_ACTIVITY_FOR_PLAN,
  SET_TIME_FOR_PLAN,
  SET_EXPLODING_OFFER_FOR_PLAN
} from "./actionTypes";
import { uiStartLoading, uiStopLoading } from "../../store/actions/ui";
import { authGetToken } from "../actions/users";

export const setGroupForPlan = (id, value, type) => {
  return {
    type: SET_GROUP_FOR_PLAN,
    id: id,
    value: value,
    groupType: type
  };
};

/* grab food, hang out, study, party */
export const setActivityForPlan = plan => {
  return {
    type: SET_ACTIVITY_FOR_PLAN,
    plan
  };
};

export const setTimeForPlan = time => {
  return {
    type: SET_TIME_FOR_PLAN,
    time
  };
};

export const setExplodingOfferForPlan = timer => {
  return {
    type: SET_EXPLODING_OFFER_FOR_PLAN,
    timer
  };
};

export const sendInvite = (
  groupType,
  groupId,
  activity,
  time,
  explodingOffer
) => {
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
        return fetch(`${HOST}/api/v1/plans`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            group_type: groupType,
            group_id: groupId,
            activity: activity,
            time: time,
            exploding_offer: explodingOffer
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          alert("success");
          dispatch(uiStopLoading());
        } else {
          Alert.alert(json.error1, json.error2);
          dispatch(uiStopLoading());
        }
      })
      .catch(e => {
        Alert.alert("Oops, we couldn't connect, please try again");
        dispatch(uiStopLoading());
      });
  };
};
