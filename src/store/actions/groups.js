import { HOST } from "../../constants/index";
import { AsyncStorage, Alert } from "react-native";
import {
  CHANGE_GROUP_STATE,
  SET_UNIVERSITIES,
  SET_PROGRAMS,
  CACHE_CONTINUE,
  SET_USER_GROUPS
} from "./actionTypes";
import { startLoadingGroups, stopLoadingGroups } from "../../store/actions/ui";
import { authGetToken } from "../actions/users";

export const changeGroupState = position => {
  return {
    type: CHANGE_GROUP_STATE,
    position: position
  };
};

export const getUniversities = () => {
  return dispatch => {
    dispatch(startLoadingGroups());
    return fetch(`${HOST}/api/v1/universities`, {
      method: "POST",
      //   body: JSON.stringify({
      //     access_token: access_token
      //   }),
      headers: { "content-type": "application/json" }
    })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(stopLoadingGroups());
          dispatch(changeGroupState(1));
          dispatch(setUniversities(json.universities));
        } else {
          dispatch(stopLoadingGroups());
          Alert.alert("Oops, we couldn't connect, please try again");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
};

export const setUniversities = universities => {
  return {
    type: SET_UNIVERSITIES,
    universities: universities
  };
};

export const getPrograms = id => {
  return dispatch => {
    dispatch(startLoadingGroups());
    return fetch(`${HOST}/api/v1/programs`, {
      method: "POST",
      body: JSON.stringify({
        id: id
      }),
      headers: { "content-type": "application/json" }
    })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(stopLoadingGroups());
          dispatch(setPrograms(json.programs));
        } else {
          dispatch(stopLoadingGroups());
          Alert.alert("Oops, we couldn't connect, please try again");
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
};

export const setPrograms = programs => {
  return {
    type: SET_PROGRAMS,
    programs: programs
  };
};

export const cacheContinue = (programId, startYear) => {
  return {
    type: CACHE_CONTINUE,
    programId: programId,
    startYear: startYear
  };
};

export const joinProgram = (programId, startYear) => {
  return dispatch => {
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
        dispatch(stopLoadingGroups());
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/request_to_join_program`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            programId: programId,
            startYear: startYear
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(stopLoadingGroups());
          dispatch(changeGroupState(3));
          alert("success");
          AsyncStorage.setItem("pp:submitted", "true");
        } else {
          dispatch(stopLoadingGroups());
          alert("Sorry, something went wrong. Please try again.");
        }
      })
      .catch(e => {
        dispatch(stopLoadingGroups());
        alert("Sorry, something went wrong. Please try again.");
      });
  };
};

export const getUserGroups = () => {
  return dispatch => {
    dispatch(startLoadingGroups());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("No valid token found!");
        dispatch(stopLoadingGroups());
      })
      .then(token => {
        access_token = token;

        return fetch(`${HOST}/api/v1/get_program_group`, {
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
          dispatch(stopLoadingGroups());
          dispatch(setUserGroups(json.university_name, json.program_details));
        } else {
          alert(json.error);
          dispatch(stopLoadingGroups());
        }
      })
      .catch(e => {
        dispatch(stopLoadingGroups());
        Alert.alert("Oops, we couldn't connect, please try again");
      });
  };
};

export const setUserGroups = (enrolledUniversity, userGroups) => {
  return {
    type: SET_USER_GROUPS,
    enrolledUniversity: enrolledUniversity,
    userGroups: userGroups
  };
};
