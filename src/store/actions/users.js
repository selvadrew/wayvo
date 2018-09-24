import { HOST } from "../../constants/index";
import { AsyncStorage } from "react-native";
import usernameTab from "../../screens/MainTabs/usernameTab";
import startTabs from "../../screens/MainTabs/startMainTabs";
import phoneNumberTab from "../../screens/MainTabs/phoneNumberTab";
import authTab from "../../screens/MainTabs/authTab";
import firebase from "react-native-firebase";
import { uiStartLoading, uiStopLoading } from "../../store/actions/ui";
import { USERNAME_ERROR, STORE_PHONE_NUMBER } from "./actionTypes";

export const SET_ACCESS_TOKEN = "SET_ACCESS_TOKEN";

export function loginWithFacebook(facebookAccessToken) {
  return dispatch => {
    return fetch(`${HOST}/api/v1/facebook`, {
      method: "POST",
      body: JSON.stringify({
        facebook_access_token: facebookAccessToken
      }),
      headers: { "content-type": "application/json" }
    })
      .then(response => response.json())
      .then(json => {
        console.log(json);

        if (json.access_token) {
          dispatch(authStoreToken(json.access_token));
          AsyncStorage.setItem("access_token", json.access_token);
          AsyncStorage.setItem("login_status", "in");
          dispatch(saveFirebaseToken(json.access_token));

          if (json.username) {
            AsyncStorage.setItem("pp:username", json.username);
            if (json.phone_number) {
              AsyncStorage.setItem("pp:phonenumber", json.phone_number);
              setTimeout(() => {
                startTabs();
              }, 1000);
            } else {
              setTimeout(() => {
                phoneNumberTab();
              }, 1000);
            }
          } else {
            setTimeout(() => {
              usernameTab();
            }, 1000);
          }

          // return AsyncStorage.getItem("pp:username")
          //   .catch(err => {
          //     //dispatch(uiStopLoading());
          //     console.log(err);
          //   })
          //   .then(username => {
          //     if (username === null) {
          //       //dispatch(uiStopLoading());
          //       setTimeout(() => {
          //         usernameTab();
          //       }, 1000);
          //     } else {
          //       AsyncStorage.getItem("pp:phonenumber").then(phonenumber => {
          //         if (phonenumber === null) {
          //           // dispatch(uiStopLoading());
          //           setTimeout(() => {
          //             phoneNumberTab();
          //           }, 1000);
          //         } else {
          //           // dispatch(uiStopLoading());
          //           setTimeout(() => {
          //             startTabs();
          //           }, 1000);
          //         }
          //       });
          //     }
          //   });

          console.log(json.access_token);
        } else {
          alert(json.error);
          console.log(json.error);
        }
      })
      .catch(e => {
        console.log(e);
        alert(e);
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
        console.log(firebase_token);

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
    return AsyncStorage.getItem("login_status").then(status => {
      if (status === "in") {
        dispatch(authGetToken())
          .then(token => {
            console.log(token, "hi");
            return AsyncStorage.getItem("pp:username")
              .catch(err => {
                dispatch(uiStopLoading());
                console.log(err);
              })
              .then(username => {
                if (username === null) {
                  dispatch(uiStopLoading());
                  usernameTab();
                } else {
                  AsyncStorage.getItem("pp:phonenumber").then(phonenumber => {
                    if (phonenumber === null) {
                      dispatch(uiStopLoading());
                      phoneNumberTab();
                    } else {
                      dispatch(uiStopLoading());
                      startTabs();
                    }
                  });
                }
              });
          })
          .catch(err => {
            dispatch(uiStopLoading());
            console.log("wtffffff");
          });
      } else {
        authTab();
        dispatch(uiStopLoading());
      }
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
          AsyncStorage.setItem("pp:username", username);
        } else {
          dispatch(uiStopLoading());
          dispatch(usernameError(json.error));
        }
      })
      .catch(e => {
        dispatch(uiStopLoading());
        alert(e);
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
          dispatch(storePhoneNumber(phoneNumber));
          AsyncStorage.setItem("pp:phonenumber", phoneNumber);
        } else {
          alert(json.error);
          dispatch(uiStopLoading());
        }
      })
      .catch(e => {
        dispatch(uiStopLoading());
        alert(e);
      });
  };
};

export const getPhoneNumber = () => {
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
            access_token: access_token
          }),
          headers: { "content-type": "application/json" }
        });
      })
      .then(response => response.json())
      .then(json => {
        if (json.is_success) {
          dispatch(storePhoneNumber(json.phone_number));
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
};

export function storePhoneNumber(phoneNumber) {
  return {
    type: STORE_PHONE_NUMBER,
    phoneNumber
  };
}

export const logout = () => {
  return dispatch => {
    let access_token;
    dispatch(authGetToken())
      .catch(() => {
        alert("No valid token found!");
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
        }
      })
      .catch(e => {
        console.log(e);
      });
  };
};
