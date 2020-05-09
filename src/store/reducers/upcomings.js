import {
    STORE_UPCOMING_DATA, STORE_FRIENDS_CALENDAR
} from "../actions/actionTypes";

const initialState = {
    waitingForMe: null,
    upcomingBookedCalls: null,
    waitingForFriends: null,
    waitingForTextedFriends: null,
    friendsCalendar: null
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case STORE_UPCOMING_DATA:
            return {
                ...state,
                waitingForMe: action.waitingForMe,
                upcomingBookedCalls: action.upcomingBookedCalls,
                waitingForFriends: action.waitingForFriends,
                waitingForTextedFriends: action.waitingForTextedFriends
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
        default:
            return state;
    }
};

export default reducer;
