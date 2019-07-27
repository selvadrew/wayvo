import { HOST } from "../../constants/index";
import { AsyncStorage, Alert } from "react-native";
import {
  CHANGE_GROUP_STATE,
  SET_UNIVERSITIES,
  SET_PROGRAMS,
  CACHE_CONTINUE,
  SET_USER_GROUPS,
  SAID_HELLO_GROUPS,
  SUBMITTED,
  SET_CONNECTED_USERS
} from "./actionTypes";
import { startLoadingGroups, stopLoadingGroups } from "../../store/actions/ui";
import { getActiveGroups } from "../../store/actions/activeGroups";
import { authGetToken } from "../actions/users";
import {
  startLoadingHello,
  stopLoadingHello,
  uiStartLoading,
  uiStopLoading
} from "../../store/actions/ui";

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
          dispatch(submitted());
          AsyncStorage.setItem("pp:submitted", "true");
        } else {
          dispatch(stopLoadingGroups());
          alert("Sorry, something went wrong. Please try again.");
        }
      })
      .catch(e => {
        dispatch(stopLoadingGroups());
        alert("Sorry, something went wrong. Please try again.");
        console.log(e);
      });
  };
};

export const submitted = () => {
  return {
    type: SUBMITTED
  };
};

// gets both custom groups and program group
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
          dispatch(stopLoadingGroups());
        }
      })
      .catch(e => {
        dispatch(stopLoadingGroups());
        Alert.alert("Oops, we couldn't connect, please try again");
        console.log(e);
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

export const outgoingGroupCall = programId => {
  return dispatch => {
    dispatch(startLoadingHello());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("No valid token found!");
        dispatch(stopLoadingGroups());
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/group_connections`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            program_id: programId
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          //dispatch(secondsLeft(600));
          dispatch(saidHelloGroups(json.seconds_left, false)); //will show the you're live groups version
          dispatch(stopLoadingHello(json.is_success));
        } else {
          if (json.group_is_live) {
            dispatch(stopLoadingHello(json.is_success, json.error));
            dispatch(getActiveGroups());

            Alert.alert(json.error);
          } else if (json.prevent_spam) {
            dispatch(stopLoadingHello(json.is_success, json.error));
          } else {
            dispatch(stopLoadingHello(json.is_success, json.error));
          }
        }
      })
      .catch(e => {
        dispatch(
          stopLoadingHello(
            false,
            "Oops, we couldn't connect, please try again."
          )
        );
      });
  };
};

export const checkIfUserLiveGroups = () => {
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
        return fetch(`${HOST}/api/v1/said_hello_groups`, {
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
          dispatch(saidHelloGroups(seconds_left, false)); //will show the you're live groups version
          dispatch(uiStopLoading());
        } else {
          dispatch(uiStopLoading());
          dispatch(saidHelloGroups(null, true));
        }
      })
      .catch(e => {
        Alert.alert("Oops, we couldn't connect, please try again");
        dispatch(uiStopLoading());
        console.log(e);
      });
  };
};

export const saidHelloGroups = (seconds_left_groups, can_say_hello_groups) => {
  return {
    type: SAID_HELLO_GROUPS,
    seconds_left_groups: seconds_left_groups,
    can_say_hello_groups: can_say_hello_groups
  };
};

//remember to stoploadingGroups when back button is pressed
export const getConnectedUsers = program_id => {
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

        return fetch(`${HOST}/api/v1/connected_users`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            program_id: program_id
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(stopLoadingGroups());
          dispatch(setConnectedUsers(json.group_connections));
        } else {
          alert("Sorry, something went wrong.");
          dispatch(stopLoadingGroups());
        }
      })
      .catch(e => {
        dispatch(stopLoadingGroups());
        Alert.alert("Oops, we couldn't connect, please try again");
        console.log(e);
      });
  };
};

export const setConnectedUsers = group_connections => {
  return {
    type: SET_CONNECTED_USERS,
    groupConnections: group_connections
  };
};
