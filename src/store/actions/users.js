import { HOST } from "../../constants/index";
import { AsyncStorage, Alert } from "react-native";
import usernameTab from "../../screens/MainTabs/usernameTab";
import fullnameTab from "../../screens/MainTabs/fullnameTab";
import startTabs from "../../screens/MainTabs/startMainTabs";
import phoneNumberTab from "../../screens/MainTabs/phoneNumberTab";
import authTab from "../../screens/MainTabs/authTab";
import firebase from "react-native-firebase";
import { uiStartLoading, uiStopLoading } from "../../store/actions/ui";
import {
  USERNAME_ERROR,
  STORE_PHONE_NUMBER,
  SIGNUP_ERROR,
  LOGIN_ERROR
} from "./actionTypes";
import { CLEAR_FRIENDS } from "../actions/friends";
import { CLEAR_ACTIVE_FRIENDS } from "../actions/activeFriends";
import { CLEAR_CONNECTED } from "../actions/actionTypes";

export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";

export function loginWithFacebook(facebookAccessToken) {
  return dispatch => {
    dispatch(uiStartLoading());
    return fetch(`${HOST}/api/v1/facebook`, {
      method: "POST",
      body: JSON.stringify({
        facebook_access_token: facebookAccessToken
      }),
      headers: { "content-type": "application/json" }
    })
      .then(response => response.json())
      .then(json => {
        if (json.access_token) {
          dispatch(authStoreToken(json.access_token));
          AsyncStorage.setItem("access_token", json.access_token);
          AsyncStorage.setItem("pp:fullname", json.fullname);
          AsyncStorage.setItem("login_status", "in");
          dispatch(saveFirebaseToken(json.access_token));

          if (json.username) {
            AsyncStorage.setItem("pp:username", json.username);
            if (json.phone_number) {
              AsyncStorage.setItem("pp:phonenumber", json.phone_number);
              setTimeout(() => {
                dispatch(uiStopLoading());
                startTabs();
              }, 1000);
            } else {
              setTimeout(() => {
                dispatch(uiStopLoading());
                phoneNumberTab();
              }, 1000);
            }
          } else {
            setTimeout(() => {
              dispatch(uiStopLoading());
              usernameTab();
            }, 1000);
          }
        } else {
          dispatch(uiStopLoading());
          alert(json.error);
          console.log(json.error);
        }
      })
      .catch(e => {
        dispatch(uiStopLoading());
        console.log(e);
        Alert.alert("Oops, we couldn't connect, please try again");
      });
  };
}

export function signUp(email, password) {
  return dispatch => {
    dispatch(uiStartLoading());
    return fetch(`${HOST}/api/v1/email_signup`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      }),
      headers: { "content-type": "application/json" }
    })
      .then(response => response.json())
      .then(json => {
        if (json.access_token) {
          dispatch(authStoreToken(json.access_token));
          dispatch(saveFirebaseToken(json.access_token));
          AsyncStorage.setItem("access_token", json.access_token);
          AsyncStorage.setItem("login_status", "in");

          dispatch(uiStopLoading());
          fullnameTab();
          dispatch(signUpError(null));
        } else {
          dispatch(uiStopLoading());
          dispatch(signUpError(json.error));
        }
      })
      .catch(e => {
        dispatch(uiStopLoading());
        console.log(e);
        Alert.alert("Oops, we couldn't connect, please try again");
      });
  };
}

export function signUpError(error) {
  return {
    type: SIGNUP_ERROR,
    error
  };
}

export function logIn(email, password) {
  return dispatch => {
    dispatch(uiStartLoading());
    return fetch(`${HOST}/api/v1/email_login`, {
      method: "POST",
      body: JSON.stringify({
        email: email,
        password: password
      }),
      headers: { "content-type": "application/json" }
    })
      .then(response => response.json())
      .then(json => {
        if (json.access_token) {
          dispatch(authStoreToken(json.access_token));
          dispatch(saveFirebaseToken(json.access_token));
          AsyncStorage.setItem("access_token", json.access_token);
          AsyncStorage.setItem("login_status", "in");
          dispatch(uiStopLoading());

          if (json.fullname) {
            AsyncStorage.setItem("pp:fullname", json.fullname);
            if (json.username) {
              AsyncStorage.setItem("pp:username", json.username);
              if (json.phone_number) {
                AsyncStorage.setItem("pp:phonenumber", json.phone_number);
                startTabs();
              } else {
                phoneNumberTab();
              }
            } else {
              usernameTab();
            }
          } else {
            fullnameTab();
          }
        } else {
          dispatch(uiStopLoading());
          Alert.alert("Incorrect email and/or password.");
        }
      })
      .catch(e => {
        dispatch(uiStopLoading());
        console.log(e);
        Alert.alert("Oops, we couldn't connect, please try again");
      });
  };
}

export const saveFirebaseToken = access_token => {
  return dispatch => {
    let firebase_token;
    firebase
      .messaging()
      .getToken()
      .then(fcmToken => {
        firebase_token = fcmToken;

        return fetch(`${HOST}/api/v1/firebase_token`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            firebase_token: firebase_token
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);
      })
      .catch(e => console.log(e));
  };
};

export const authStoreToken = access_token => {
  return dispatch => {
    dispatch(setAccessToken(access_token));
    AsyncStorage.setItem("pp:auth:token", access_token);
  };
};

export function setAccessToken(accessToken) {
  return {
    type: SET_ACCESS_TOKEN,
    accessToken
  };
}

export const authGetToken = () => {
  return (dispatch, getState) => {
    const promise = new Promise((resolve, reject) => {
      const token = getState().users.accessToken;
      if (!token) {
        let fetchedToken;
        AsyncStorage.getItem("pp:auth:token")
          .catch(err => {
            dispatch(uiStopLoading());
            reject();
          })
          .then(tokenFromStorage => {
            fetchedToken = tokenFromStorage;

            if (!tokenFromStorage) {
              dispatch(uiStopLoading());
              reject();
              return;
            } else {
              dispatch(setAccessToken(fetchedToken));
              resolve(fetchedToken);
            }
          })
          .catch(err => reject());
      } else {
        resolve(token);
      }
    });
    return promise.then(token => {
      if (!token) {
        dispatch(uiStopLoading());
        throw new Error();
      } else {
        return token;
      }
    });
  };
};

//check if username exists in the storage
//   if it does not - return username page
//   if it does check if phone number exists
//   if phone number does not exist return phone number page
//   if phone number does exist return home page

export const authAutoSignIn = () => {
  return dispatch => {
    dispatch(uiStartLoading());
    return AsyncStorage.getItem("login_status")
      .catch(err => {
        dispatch(uiStopLoading());
        console.log(err);
      })
      .then(status => {
        if (status === "in") {
          dispatch(authGetToken()).then(token => {
            AsyncStorage.getItem("pp:fullname")
              .catch(err => {
                dispatch(uiStopLoading());
                console.log(err);
              })
              .then(fullname => {
                if (fullname === null) {
                  dispatch(uiStopLoading());
                  fullnameTab();
                } else {
                  AsyncStorage.getItem("pp:username").then(username => {
                    if (username === null) {
                      dispatch(uiStopLoading());
                      usernameTab();
                    } else {
                      AsyncStorage.getItem("pp:phonenumber").then(
                        phonenumber => {
                          if (phonenumber === null) {
                            dispatch(uiStopLoading());
                            phoneNumberTab();
                          } else {
                            dispatch(uiStopLoading());
                            startTabs();
                          }
                        }
                      );
                    }
                  });
                }
              });
          });
        } else {
          authTab();
          dispatch(uiStopLoading());
        }
      });
  };
};

export const saveFullname = fullname => {
  return dispatch => {
    dispatch(uiStartLoading());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        dispatch(uiStopLoading());
        alert("No valid token found!");
      })
      .then(token => {
        access_token = token;
        return fetch(`${HOST}/api/v1/fullname`, {
          method: "POST",
          body: JSON.stringify({
            fullname: fullname,
            access_token: access_token
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          setTimeout(() => {
            dispatch(uiStopLoading());
            usernameTab();
          }, 1000);
          AsyncStorage.setItem("pp:fullname", json.fullname);
        } else {
          dispatch(uiStopLoading());
          alert("Something went wrong. Please try again.");
        }
      })
      .catch(e => {
        dispatch(uiStopLoading());
        Alert.alert("Oops, we couldn't connect, please try again");
      });
  };
};

// need to send current access token and user input for username
// will receive success if username does not exist
// - proceed to next screen
// will receive error if username exists
// - show alert and clear input
export const createUsername = username => {
  return dispatch => {
    dispatch(uiStartLoading());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        dispatch(uiStopLoading());
        alert("No valid token found!");
      })
      .then(token => {
        access_token = token;

        return fetch(`${HOST}/api/v1/username`, {
          method: "POST",
          body: JSON.stringify({
            username: username,
            access_token: access_token
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        console.log(json);

        if (json.is_success) {
          setTimeout(() => {
            dispatch(uiStopLoading());
            phoneNumberTab();
          }, 1000);
          AsyncStorage.setItem("pp:username", json.username);
          dispatch(usernameError(null));
        } else {
          dispatch(uiStopLoading());
          dispatch(usernameError(json.error));
        }
      })
      .catch(e => {
        dispatch(uiStopLoading());
        Alert.alert("Oops, we couldn't connect, please try again");
      });
  };
};

export function usernameError(error) {
  return {
    type: USERNAME_ERROR,
    error
  };
}

export const savePhoneNumber = phoneNumber => {
  return dispatch => {
    dispatch(uiStartLoading());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("No valid token found!");
        dispatch(uiStopLoading());
      })
      .then(token => {
        access_token = token;

        return fetch(`${HOST}/api/v1/phonenumber`, {
          method: "POST",
          body: JSON.stringify({
            phone_number: phoneNumber,
            access_token: access_token
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          setTimeout(() => {
            startTabs();
            dispatch(uiStopLoading());
          }, 1000);
          AsyncStorage.setItem("pp:phonenumber", phoneNumber);
        } else {
          alert(json.error);
          dispatch(uiStopLoading());
          console.log(json.error);
        }
      })
      .catch(e => {
        dispatch(uiStopLoading());
        Alert.alert("Oops, we couldn't connect, please try again");
      });
  };
};

// if verified is true, i wont be able to change them back to false
export const getUserInfo = device => {
  return dispatch => {
    return AsyncStorage.multiGet([
      "pp:fullname",
      "pp:phonenumber",
      "pp:username",
      "pp:ios",
      "pp:verified",
      "pp:enrollment",
      "pp:instagram",
      "pp:snapchat",
      "pp:twitter",
      "pp:auth:token"
    ])
      .then(response => {
        //calls firebase everytime, not ideal
        dispatch(saveFirebaseToken(response[9][1]));
        if (
          response[0][1] &&
          response[1][1] &&
          response[2][1] &&
          response[3][1] &&
          response[3][1] === device.toString() &&
          response[4][1] === "true"
        ) {
          dispatch(
            storePhoneNumber(
              response[0][1],
              response[1][1],
              response[2][1],
              response[3][1],
              true, //verified
              response[5][1],
              response[6][1],
              response[7][1],
              response[8][1],
              true // submitted by default cause already verified
            )
          );
        } else {
          dispatch(getPhoneNumber(device));
        }
      })
      .catch(e => {
        dispatch(getPhoneNumber(device));
      });
  };
};

export const getPhoneNumber = device => {
  return dispatch => {
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("No valid token found!");
      })
      .then(token => {
        access_token = token;

        return fetch(`${HOST}/api/v1/get_phone_number`, {
          method: "POST",
          body: JSON.stringify({
            access_token: access_token,
            ios: device
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(
            storePhoneNumber(
              json.fullname,
              json.phone_number,
              json.username,
              device.toString(),
              json.verified,
              json.enrollment,
              json.instagram,
              json.snapchat,
              json.twitter,
              json.submitted
            )
          );
          AsyncStorage.setItem("pp:fullname", json.fullname);
          AsyncStorage.setItem("pp:ios", device.toString());
          AsyncStorage.setItem("pp:verified", json.verified.toString());
          AsyncStorage.setItem("pp:enrollment", json.enrollment.toString());
          AsyncStorage.setItem("pp:instagram", json.instagram);
          AsyncStorage.setItem("pp:snapchat", json.snapchat);
          AsyncStorage.setItem("pp:twitter", json.twitter);
          AsyncStorage.setItem("pp:submitted", json.submitted.toString());
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
};

export function storePhoneNumber(
  fullname,
  phoneNumber,
  username,
  ios,
  verified,
  enrollment,
  instagram,
  snapchat,
  twitter,
  submitted
) {
  return {
    type: STORE_PHONE_NUMBER,
    fullname,
    phoneNumber,
    username,
    ios,
    verified,
    enrollment,
    instagram,
    snapchat,
    twitter,
    submitted
  };
}

export const logout = () => {
  return dispatch => {
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        authTab();
      })
      .then(token => {
        access_token = token;

        return fetch(`${HOST}/api/v1/logout`, {
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
          authTab();
          AsyncStorage.setItem("login_status", "out");
          AsyncStorage.removeItem("pp:username");
          AsyncStorage.removeItem("pp:phonenumber");
          AsyncStorage.removeItem("pp:fullname");
          AsyncStorage.removeItem("access_token");
          AsyncStorage.removeItem("pp:friends");
          AsyncStorage.removeItem("pp:ios");
          dispatch(clearFriends());
          dispatch(clearActiveFriends());
          dispatch(clearConnected());
        } else {
          authTab();
          AsyncStorage.setItem("login_status", "out");
          AsyncStorage.removeItem("pp:username");
          AsyncStorage.removeItem("pp:phonenumber");
          AsyncStorage.removeItem("pp:fullname");
          AsyncStorage.removeItem("access_token");
          AsyncStorage.removeItem("pp:friends");
          AsyncStorage.removeItem("pp:ios");
          dispatch(clearFriends());
          dispatch(clearActiveFriends());
          dispatch(clearConnected());
        }
      })
      .catch(e => {
        Alert.alert("Oops, we couldn't connect, please try again");
        //authTab();
      });
  };
};

export function clearFriends() {
  return {
    type: CLEAR_FRIENDS
  };
}

export function clearActiveFriends() {
  return {
    type: CLEAR_ACTIVE_FRIENDS
  };
}

export function clearConnected() {
  return {
    type: CLEAR_CONNECTED
  };
}

export const sendFeedback = description => {
  return dispatch => {
    //dispatch(uiStartLoading());
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("No valid token found!");
        // dispatch(uiStopLoading());
      })
      .then(token => {
        access_token = token;

        return fetch(`${HOST}/api/v1/feedback`, {
          method: "POST",
          body: JSON.stringify({
            description: description,
            access_token: access_token
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          console.log("success feedback");
          // dispatch(uiStopLoading());
        } else {
          // Alert.alert("Oops, we couldn't connect, please try again");
          // dispatch(uiStopLoading());
          console.log("success failed");
        }
      })
      .catch(e => {
        console.log("success failed");
        //dispatch(uiStopLoading());
        // Alert.alert("Oops, we couldn't connect, please try again");
      });
  };
};
