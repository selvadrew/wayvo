import {
    STORE_CALENDAR,
    UPDATE_SELECTED_TIME_TODAY,
    UPDATE_SELECTED_TIME_TOMORROW
} from "../actions/actionTypes";

const initialState = {
    todays_schedule: {},
    tomorrows_schedule: {}
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case STORE_CALENDAR:
            return {
                ...state,
                todays_schedule: action.todays_schedule,
                tomorrows_schedule: action.tomorrows_schedule
            };
        case UPDATE_SELECTED_TIME_TODAY:
            return {
                ...state,
                todays_schedule: state.todays_schedule.map(
                    time =>
                        time.id === action.id ? { ...time, status: action.status } : time
                )
            };
        case UPDATE_SELECTED_TIME_TOMORROW:
            return {
                ...state,
                // tomorrows_schedule: action.tomorrows_schedule,
                tomorrows_schedule: state.tomorrows_schedule.map(
                    time =>
                        time.id === action.id
                            ? // set to free 
                            { ...time, status: action.status }
                            : // otherwise return original time
                            time
                ),
            };

        default:
            return state;
    }
};

export default reducer;
