import { HOST } from "../../constants/index";
import { AsyncStorage } from "react-native";
import { authGetToken } from "./users";
import { Alert } from "react-native";
import authTab from "../../screens/MainTabs/authTab";

import {
    STORE_UPCOMING_DATA, STORE_FRIENDS_CALENDAR
} from "./actionTypes";

import {
    startLoadingUpcoming,
    stopLoadingUpcoming,
    startLoadingFriendsCalendar,
    stopLoadingFriendsCalendar
} from "../../store/actions/ui";
import { getCalendar } from "./calendars";

// updates all 4 calendar tings 
export const getUpcomingData = (day, id, time, status) => {
    return dispatch => {
        dispatch(startLoadingUpcoming())
        let access_token;
        dispatch(authGetToken())
            .catch(() => {
                alert("Not authenticated");
                dispatch(stopLoadingUpcoming())
            })
            .then(token => {
                access_token = token;
                return fetch(`${HOST}/api/v1/all_user_invitation_data`, {
                    method: "POST",
                    body: JSON.stringify({
                        access_token: access_token,
                    }),
                    headers: { "content-type": "application/json" }
                });
            })
            .then(response => response.json())
            .then(json => {
                if (json.is_success) {
                    // waiting_for_me
                    // upcoming_booked_calls 
                    // waiting_for_friends 
                    // waiting_for_texted_friends 
                    dispatch(updateUpcomingData(json.waiting_for_me, json.upcoming_booked_calls, json.waiting_for_friends, json.waiting_for_texted_friends))
                    dispatch(stopLoadingUpcoming())

                } else {
                    Alert.alert("Oops, we couldn't connect, please try again");
                    dispatch(stopLoadingUpcoming())
                }
            })
            .catch(e => {
                Alert.alert("Oops, we couldn't connect, please try again");
                console.log(e)
                dispatch(stopLoadingUpcoming())
            });
    };
};



export const updateUpcomingData = (waitingForMe, upcomingBookedCalls, waitingForFriends, waitingForTextedFriends) => {
    return {
        type: STORE_UPCOMING_DATA,
        waitingForMe,
        upcomingBookedCalls,
        waitingForFriends,
        waitingForTextedFriends
    };
};


// this gets called when the user chooses to view the calendar of someone who invited them to catch up 
// This is called from within the get calendar action because showfriendscalendar needs the most up to date current users calendar
//  for example, the current "dont shows" may have changed by the time the user views the friends calendar so it needs to be updated first 
export const showFriendsCalendar = (invitation_id, user_id, todaysSchedule, tomorrowsSchedule) => {
    return dispatch => {
        dispatch(startLoadingFriendsCalendar())
        let access_token;
        dispatch(
            authGetToken()
        )
            .catch(() => {
                alert("Not authenticated");
                dispatch(stopLoadingFriendsCalendar())
            })
            .then(token => {
                access_token = token;
                return fetch(`${HOST}/api/v1/show_friends_calendar`, {
                    method: "POST",
                    body: JSON.stringify({
                        access_token: access_token,
                        invitation_id: invitation_id,
                        user_id: user_id
                    }),
                    headers: { "content-type": "application/json" }
                });
            })
            .then(response => response.json())
            .then(json => {
                if (json.is_success) {
                    // after receiving the times to show we need to check if that time is still available for the current user
                    // aka can be a "dont show" or already booked time 
                    todayTimes = []
                    tomorrowTimes = []
                    todaysSchedule.forEach(element => {
                        if (element.status === 'busy' || element.status === 'free') {
                            todayTimes.push(element.time)
                        }
                    })
                    tomorrowsSchedule.forEach(element => {
                        if (element.status === 'busy' || element.status === 'free') {
                            tomorrowTimes.push(element.time)
                        }
                    })

                    todayOptions = json.todays_dates.filter(value => todayTimes.includes(value))
                    tomorrowOptions = json.tomorrows_dates.filter(value => tomorrowTimes.includes(value))
                    dispatch(loadFriendsCalendar(invitation_id, json.updated_at, todayOptions, tomorrowOptions))
                    dispatch(stopLoadingFriendsCalendar())
                } else {
                    Alert.alert("Oops, we couldn't connect, please try again");
                    dispatch(stopLoadingFriendsCalendar())
                }
            })
            .catch(e => {
                Alert.alert("Oops, we couldn't connect, please try again");
                console.log(e)
            });
    };
};

export const loadFriendsCalendar = (invitation_id, updated_at, todayOptions, tomorrowOptions) => {
    return {
        type: STORE_FRIENDS_CALENDAR,
        invitation_id,
        updated_at,
        todayOptions,
        tomorrowOptions
    };
};

// remember to save the day in the state of booking calendar screen, so its the same when selected option is sent to api 
// need to clear friendsCalendar reducer when pressing back 
