import { HOST } from "../../constants/index";
import { AsyncStorage } from "react-native";
import { authGetToken } from "./users";
import { Alert } from "react-native";
import authTab from "../../screens/MainTabs/authTab";

export const OUTGOING_CALL = "OUTGOING_CALL";

import {
    STORE_CALENDAR,
    UPDATE_SELECTED_TIME_TODAY,
    UPDATE_SELECTED_TIME_TOMORROW
} from "./actionTypes";

import {
    startLoadingCalendar,
    stopLoadingCalendar,
    startLoadingFriendsCalendar
} from "../../store/actions/ui";
import { setCalendarWithData, allTimes } from "../../utils";
import { showFriendsCalendar, getUpcomingData } from "./upcomings";

// alert is true or false for if there needs to be a "Your calendar is now up to date"
export const getCalendar = (updateAlert, invitation_id) => {
    return dispatch => {
        if (invitation_id) {
            dispatch(startLoadingFriendsCalendar())
        }
        let month = new Date().getMonth() + 1 // starts at 0 scale - ruby starts at 1
        let monthDate = new Date().getDate()
        dispatch(startLoadingCalendar());
        let access_token;
        dispatch(authGetToken())
            .catch(() => {
                alert("Not authenticated");
                dispatch(stopLoadingCalendar());
            })
            .then(token => {
                access_token = token;
                return fetch(`${HOST}/api/v1/get_calendar`, {
                    method: "POST",
                    body: JSON.stringify({
                        access_token: access_token,
                        month: month,
                        monthDate: monthDate
                    }),
                    headers: { "content-type": "application/json" }
                });
            })
            .then(response => response.json())
            .then(json => {
                if (json.is_success) {

                    // let times = allTimes()
                    arrayHour = 0
                    arrayMin = 0

                    timeNow = new Date()
                    currentHour = timeNow.getHours()

                    // if the time is between 0-7(12am to 7am) show all the times for today 
                    if (currentHour > 7) {
                        // gets the top of the hour in the array 
                        arrayHour = currentHour * 2 - 16
                        // if we need to bump one for being past 50/20 min 
                        if (timeNow.getMinutes() > 50) {
                            arrayMin = 2
                        } else if (timeNow.getMinutes() > 20) {
                            arrayMin = 1
                        }
                    }
                    arrayPosition = arrayHour + arrayMin

                    dispatch(storeUsersCalendar(
                        setCalendarWithData(json.todays_schedule, arrayPosition),
                        setCalendarWithData(json.tomorrows_schedule, 0)
                    ))

                    dispatch(stopLoadingCalendar());
                    if (updateAlert) {
                        Alert.alert("Your calendar is now up to date")
                        dispatch(getUpcomingData())
                    }

                    if (invitation_id) {
                        dispatch(showFriendsCalendar(invitation_id, setCalendarWithData(json.todays_schedule, arrayPosition),
                            setCalendarWithData(json.tomorrows_schedule, 0)))
                    }

                } else {
                    dispatch(stopLoadingCalendar());
                    Alert.alert("Oops, we couldn't connect, please try again");
                }
            })
            .catch(e => {
                Alert.alert("Oops, we couldn't connect, please try again");
                console.log(e)
                dispatch(stopLoadingCalendar());
            });
    };
};

export const storeUsersCalendar = (todays_schedule, tomorrows_schedule) => {
    return {
        type: STORE_CALENDAR,
        todays_schedule,
        tomorrows_schedule
    };
};

// calls setCalendar 
export const timeSelected = (day, id, time, status) => {
    return dispatch => {
        //update locally first, then send post request, if request fails, reload from async and show error 
        if (day === 1) {
            dispatch(updateSelectedTimeToday(id, status));
        } else {
            dispatch(updateSelectedTimeTomorrow(id, status));
        }

        let access_token;
        dispatch(authGetToken())
            .catch(() => {
                alert("Not authenticated");
            })
            .then(token => {
                access_token = token;
                return fetch(`${HOST}/api/v1/set_calendar`, {
                    method: "POST",
                    body: JSON.stringify({
                        access_token: access_token,
                        day: day,
                        time: time,
                        status: status,
                    }),
                    headers: { "content-type": "application/json" }
                });
            })
            .then(response => response.json())
            .then(json => {
                if (json.is_success) {
                    // async? 

                } else {
                    if (json.get_calendar) {
                        dispatch(getCalendar(true))
                    }
                }
            })
            .catch(e => {
                Alert.alert("Oops, we couldn't connect, please try again");
                console.log(e)
            });
    };
};

export const updateSelectedTimeToday = (id, status) => {
    return {
        type: UPDATE_SELECTED_TIME_TODAY,
        id,
        status
    };
};

export const updateSelectedTimeTomorrow = (id, status) => {
    return {
        type: UPDATE_SELECTED_TIME_TOMORROW,
        id,
        status
    };
};

