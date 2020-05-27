import {
    STORE_UPCOMING_DATA, STORE_FRIENDS_CALENDAR, CLEAR_FRIENDS_CALENDAR, SUCCESSFULLY_BOOKED_FRIENDS_CALENDAR
} from "../actions/actionTypes";

const initialState = {
    waitingForMe: [],
    upcomingBookedCalls: [],
    waitingForFriends: [],
    waitingForTextedFriends: [],
    friendsCalendar: null,
    booked: false,
    date: ""
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case STORE_UPCOMING_DATA:
            return {
                ...state,
                waitingForMe: action.waitingForMe,
                upcomingBookedCalls: action.upcomingBookedCalls,
                waitingForFriends: action.waitingForFriends,
                waitingForTextedFriends: action.waitingForTextedFriends,
                date: action.display_date
            };
        case STORE_FRIENDS_CALENDAR:
            return {
                ...state,
                friendsCalendar: {
                    invitation_id: action.invitation_id,
                    updated_at: action.updated_at,
                    todayOptions: action.todayOptions,
                    tomorrowOptions: action.tomorrowOptions
                }
            };
        case CLEAR_FRIENDS_CALENDAR:
            return {
                ...state,
                friendsCalendar: null,
                booked: false
            };
        case SUCCESSFULLY_BOOKED_FRIENDS_CALENDAR:
            return {
                ...state,
                booked: true
            }
        default:
            return state;
    }
};

export default reducer;
