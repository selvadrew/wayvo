import { ADD_PLACE, DELETE_PLACE } from "./actionTypes";

export const addPlace = userName => {
  return {
    type: ADD_PLACE,
    userName: userName
  };
};

export const deletePlace = key => {
  return {
    type: DELETE_PLACE,
    placeKey: key
  };
};
