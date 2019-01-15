import { CHANGE_GROUP_STATE } from "./actionTypes";

export const changeGroupState = position => {
  return {
    type: CHANGE_GROUP_STATE,
    position: position
  };
};
