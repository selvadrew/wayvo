import { HOST } from "../../constants/index";
import { AsyncStorage, Alert } from "react-native";
import {} from "./actionTypes";
import {
  startLoadingGroups,
  stopLoadingGroups,
  startLoadingHello,
  stopLoadingHello,
  uiStartLoading,
  uiStopLoading
} from "../../store/actions/ui";
import { authGetToken } from "../actions/users";
import {} from "../../store/actions/ui";
import {
  CUSTOM_GROUP_CREATED,
  SET_SEARCHED_GROUP,
  SET_ALL_CUSTOM_GROUP_DATA,
  SAID_HELLO_GROUPS
} from "../actions/actionTypes";
import { getUserGroups } from "./groups";

export const createGroup = (name, username, description) => {
  return dispatch => {
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/create_group`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            name: name,
            username: username,
            description: description
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(customGroupCreated(true));
          dispatch(getUserGroups());
        } else {
          if (json.error == 1) {
            Alert.alert("That secret username already exists");
          } else if (json.error == 2) {
            Alert.alert(
              "Username must be 3-15 characters long",
              "Containing only letters and numbers without any white spaces"
            );
          } else {
            alert("Sorry, something went wrong. Please try again.");
          }
        }
      })
      .catch(e => {
        alert("Sorry, something went wrong. Please try again.");
        console.log(e);
      });
  };
};

export function customGroupCreated(status) {
  return {
    type: CUSTOM_GROUP_CREATED,
    status
  };
}

export const searchGroup = username => {
  return dispatch => {
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/search_groups`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            username: username
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          let status;
          if (json.requested) {
            if (json.group_status) {
              status = 3;
              //   alert("already a member");
            } else {
              status = 2;
              //   alert("waiting for approval");
            }
          } else {
            status = 1;
            // alert("want to join?");
          }

          dispatch(
            setSearchedGroup(
              json.group_id,
              json.name,
              json.description,
              json.admin,
              status
            )
          );
        } else {
          if (json.error == 1) {
            Alert.alert("You don't have access to this group");
          } else if (json.error == 2) {
            Alert.alert("Group does not exist");
          } else {
            Alert.alert("Sorry, something went wrong. Please try again.");
          }
        }
      })
      .catch(e => {
        alert("Sorry, something went wrong. Please try again.");
        console.log(e);
      });
  };
};

export function setSearchedGroup(id, name, description, admin, status) {
  return {
    type: SET_SEARCHED_GROUP,
    id,
    name,
    description,
    admin,
    status
  };
}

export const getAllCustomGroupData = groupId => {
  return dispatch => {
    dispatch(startLoadingGroups());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
        dispatch(stopLoadingGroups());
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/get_all_custom_group_data`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            id: groupId
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(stopLoadingGroups());
          dispatch(
            setAllCustomGroupData(
              json.admin_data,
              json.connections_data,
              json.activity_data,
              json.is_admin,
              json.only_admin_in_group
            )
          );
        } else {
          dispatch(stopLoadingGroups());
          alert("There was an error.");
        }
      })
      .catch(e => {
        dispatch(stopLoadingGroups());
        alert("Sorry, something went wrong. Please try again.");
        console.log(e);
      });
  };
};

export function setAllCustomGroupData(
  admin_data,
  connections_data,
  activity_data,
  is_admin,
  only_admin_in_group
) {
  return {
    type: SET_ALL_CUSTOM_GROUP_DATA,
    admin_data,
    connections_data,
    activity_data,
    is_admin,
    only_admin_in_group
  };
}

export const yesJoinGroup = (groupId, admin, name) => {
  return dispatch => {
    // dispatch(startLoadingGroups());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
        // dispatch(stopLoadingGroups());
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/request_to_join`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            group_id: groupId
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(getUserGroups());
          Alert.alert(`Request sent to ${admin} for access to ${name}`);
        } else {
          // dispatch(stopLoadingGroups());
          Alert.alert(`Sorry, something went wrong. Please try again.`);
        }
      })
      .catch(e => {
        // dispatch(stopLoadingGroups());
        alert("Sorry, something went wrong. Please try again.");
        console.log(e);
      });
  };
};

export const addToGroup = id => {
  return dispatch => {
    // dispatch(startLoadingGroups());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
        // dispatch(stopLoadingGroups());
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/add_to_group`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            id: id
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(getAllCustomGroupData(json.group_id));
          // Alert.alert(`Request sent to ${admin} for access to ${name}`);
        } else {
          // dispatch(stopLoadingGroups());
          Alert.alert(`Sorry, something went wrong. Please try again.`);
        }
      })
      .catch(e => {
        // dispatch(stopLoadingGroups());
        alert("Sorry, something went wrong. Please try again.");
        console.log(e);
      });
  };
};

export const rejectToGroup = id => {
  return dispatch => {
    // dispatch(startLoadingGroups());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("Not authenticated");
        // dispatch(stopLoadingGroups());
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/deny_to_group`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            id: id
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(getAllCustomGroupData(json.group_id));
          // Alert.alert(`Request sent to ${admin} for access to ${name}`);
        } else {
          // dispatch(stopLoadingGroups());
          Alert.alert(`Sorry, something went wrong. Please try again.`);
        }
      })
      .catch(e => {
        // dispatch(stopLoadingGroups());
        alert("Sorry, something went wrong. Please try again.");
        console.log(e);
      });
  };
};

export const outgoingCustomGroupCall = customGroupId => {
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
        return fetch(`${HOST}/api/v1/custom_group_connections`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            custom_group_id: customGroupId
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(saidHelloGroups(json.seconds_left, false)); //will show the you're live groups version
          dispatch(stopLoadingHello(json.is_success));
        } else {
          if (json.group_is_live) {
            dispatch(stopLoadingHello(json.is_success, json.error));
            // dispatch(getActiveGroups());
            // need to reload custom groups //////////////////////////////////checks if someone in the group is live
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
