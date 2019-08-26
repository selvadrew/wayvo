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
