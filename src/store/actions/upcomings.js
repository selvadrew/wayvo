import { HOST } from "../../constants/index";
import { AsyncStorage } from "react-native";
import { authGetToken } from "./users";
import { Alert } from "react-native";
import authTab from "../../screens/MainTabs/authTab";

import {
    STORE_UPCOMING_DATA, STORE_FRIENDS_CALENDAR, CLEAR_FRIENDS_CALENDAR, SUCCESSFULLY_BOOKED_FRIENDS_CALENDAR
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
                    dispatch(getCalendar(false))
                    today = new Date()
                    dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
                    monthNames = ["January", "February", "March", "April", "May", "June",
                        "July", "August", "September", "October", "November", "December"]

                    day = dayNames[today.getDay()]
                    month = monthNames[today.getMonth()]
                    date = today.getDate()

                    //https://stackoverflow.com/questions/13627308/add-st-nd-rd-and-th-ordinal-suffix-to-a-number/13627586
                    s = ["th", "st", "nd", "rd"]
                    v = date % 100
                    dateWithSuffix = date + (s[(v - 20) % 10] || s[v] || s[0])

                    display_date = `${day}, ${month} ${dateWithSuffix}`


                    dispatch(updateUpcomingData(
                        json.waiting_for_me,
                        json.upcoming_booked_calls,
                        json.waiting_for_friends,
                        json.waiting_for_texted_friends,
                        display_date
                    ))
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



export const updateUpcomingData = (waitingForMe, upcomingBookedCalls, waitingForFriends, waitingForTextedFriends, display_date) => {
    return {
        type: STORE_UPCOMING_DATA,
        waitingForMe,
        upcomingBookedCalls,
        waitingForFriends,
        waitingForTextedFriends,
        display_date
    };
};


// this gets called when the user chooses to view the calendar of someone who invited them to catch up 
// This is called from within the get calendar action because showfriendscalendar needs the most up to date current users calendar
//  for example, the current "dont shows" may have changed by the time the user views the friends calendar so it needs to be updated first 
export const showFriendsCalendar = (invitation_id, todaysSchedule, tomorrowsSchedule) => {
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
                        invitation_id: invitation_id
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


export const clearFriendsCalendar = () => {
    return {
        type: CLEAR_FRIENDS_CALENDAR,
    }
}


export const bookFriendsCalendar = (day, time, invitation_id, updated_at) => {
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
                return fetch(`${HOST}/api/v1/book_friends_calendar`, {
                    method: "POST",
                    body: JSON.stringify({
                        access_token: access_token,
                        day: day,
                        time: time,
                        invitation_id: invitation_id,
                        updated_at: updated_at
                    }),
                    headers: { "content-type": "application/json" }
                });
            })
            .then(response => response.json())
            .then(json => {
                console.log(json)
                if (json.is_success) {
                    dispatch(successfullyBookedFriendsCalendar())
                    dispatch(stopLoadingFriendsCalendar())
                    dispatch(getUpcomingData())
                    dispatch(getCalendar(false))
                } else {
                    dispatch(stopLoadingFriendsCalendar())
                    if (json.reload) {
                        dispatch(getCalendar(false, invitation_id))
                        Alert.alert("Please select again", "The previous calendar was out of date")
                    }
                }
            })
            .catch(e => {
                Alert.alert("Oops, we couldn't connect, please try again");
                console.log(e)
                dispatch(stopLoadingFriendsCalendar())
            });
    };
};


export const successfullyBookedFriendsCalendar = () => {
    return {
        type: SUCCESSFULLY_BOOKED_FRIENDS_CALENDAR,
    }
}