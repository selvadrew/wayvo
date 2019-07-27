import { HOST } from "../../constants/index";
import { AsyncStorage, Alert } from "react-native";
import {} from "./actionTypes";
import { startLoadingGroups, stopLoadingGroups } from "../../store/actions/ui";
import { authGetToken } from "../actions/users";
import {} from "../../store/actions/ui";
import {
  CUSTOM_GROUP_CREATED,
  SET_SEARCHED_GROUP,
  SET_ALL_CUSTOM_GROUP_DATA
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
