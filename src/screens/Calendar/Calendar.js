import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    ActivityIndicator,
    ScrollView,
    RefreshControl,
    Platform,
    SafeAreaView,
    Dimensions,
    StatusBar,
    Linking,
    Button,
    PermissionsAndroid,
    TouchableOpacity,
    Alert
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";

import { getCalendar, timeSelected } from "../../store/actions/calendars";
import CalendarList from "../../components/Calendar/CalendarList";


class Calendar extends Component {
    constructor(props) {
        super(props);
    }
    state = {
    };

    componentDidMount() {
        this.props.onGetCalendar(false)
    }

    static navigatorStyle = {
        navBarNoBorder: true,
        navBarBackgroundColor: colors.darkBlue,
        navBarButtonColor: "#ffffff",
        navBarHidden: true,
        statusBarColor: colors.darkBlue
    };

    // save in async each time and then reload from async with error message if theres an error in backend 


    timeSelectedToday = id => {
        selected = this.props.todaysSchedule.find(x => x.id === id) //{id: 5,time: '10:00am',status: 'busy'}
        if (selected.status === "busy") {
            this.props.onTimeSelected(1, id, selected.time, "free", this.props.todaysSchedule, this.props.tomorrowsSchedule)
        } else if (selected.status === "free") {
            this.props.onTimeSelected(1, id, selected.time, "busy", this.props.todaysSchedule, this.props.tomorrowsSchedule)
        } else {
            Alert.alert("Scheduled Call")
        }
    }

    timeSelectedTomorrow = id => {
        selected = this.props.tomorrowsSchedule.find(x => x.id === id)
        if (selected.status === "busy") {
            this.props.onTimeSelected(2, id, selected.time, "free", this.props.todaysSchedule, this.props.tomorrowsSchedule) // last number is selected(1) or deselected(0)
        } else if (selected.status === "free") {
            this.props.onTimeSelected(2, id, selected.time, "busy", this.props.todaysSchedule, this.props.tomorrowsSchedule)
        } else {
            Alert.alert("Scheduled Call")
        }
    }

    render() {
        let calendarContent = null
        if (this.props.isLoadingCalendar) {
            calendarContent = <ActivityIndicator color="#444" style={styles.spinner} />
        } else {
            calendarContent = (
                <View style={styles.addWrapperTimes}>
                    <View style={styles.daysTimes}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <CalendarList
                                day={this.props.todaysSchedule} //sending to friendslist component 
                                onItemSelected={this.timeSelectedToday} //receiving from friendslist component 
                            />
                        </ScrollView>
                    </View>

                    <View style={styles.daysTimes}>
                        <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                            <CalendarList
                                day={this.props.tomorrowsSchedule} //sending to friendslist component 
                                onItemSelected={this.timeSelectedTomorrow} //receiving from friendslist component 
                            />
                        </ScrollView>
                    </View>
                </View>
            );

        }

        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.darkBlue}
                />
                <SafeAreaView style={{ backgroundColor: colors.darkBlue, flex: 1 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: colors.darkBlue }}>
                        <Text style={styles.header}>
                            {/* Update your availability so friends can schedule a call with you. Select as many time slots as you want. */}
                            Set time aside for your friends
                        </Text>
                    </View>


                    <View style={styles.topRow}>
                        <View style={styles.addWrapper}>
                            <View style={styles.days}>
                                <Text style={styles.daysText}>
                                    Today
                                </Text>
                            </View>
                            <View style={styles.days}>
                                <Text style={styles.daysText}>
                                    Tomorrow
                                </Text>
                            </View>
                        </View>

                    </View>

                    <View style={styles.scrollView}>
                        {calendarContent}
                    </View>

                </SafeAreaView>

            </View >
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoadingCalendar: state.ui.isLoadingCalendar,
        todaysSchedule: state.calendar.todays_schedule,
        tomorrowsSchedule: state.calendar.tomorrows_schedule
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetCalendar: updateAlert => dispatch(getCalendar(updateAlert)),
        onTimeSelected: (day, id, time, status, today, tomorrow) => dispatch(timeSelected(day, id, time, status, today, tomorrow))
    };
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: "red",
        flex: 1
    },
    callStatusWrapper: {
        margin: 10,
        marginTop: 0,
        flex: 1
    },
    navBarWrapper: {
        flex: 1,
        // minHeight: 150,
        backgroundColor: colors.darkBlue
    },
    navBarContent: {
        flex: 1,
        backgroundColor: colors.darkBlue,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        height: "100%",
        width: "100%"
    },
    header: {
        flex: 1, flexWrap: 'wrap',
        color: "#fff",
        padding: 15,
        fontSize: Dimensions.get("window").width > 330 ? 19 : 17,
        // textAlign: "center",
        fontWeight: "500",
        // textAlign: "center",
        fontFamily: Platform.OS === "android" ? "Roboto" : null,
        backgroundColor: colors.darkBlue
    },
    topRow: {
        flexDirection: "row",
        backgroundColor: "#fff",
        paddingTop: 15,
        paddingBottom: 15
    },
    addWrapper: {
        width: "100%",
        alignItems: "flex-start",
        justifyContent: "space-around",
        flexDirection: "row"
    },
    days: {
        width: "100%",
        flex: 1,
    },
    daysText: {
        textAlign: "center",
        fontFamily: Platform.OS === "android" ? "Roboto" : null,
        fontSize: Dimensions.get("window").width > 330 ? 20 : 17,
    },
    scrollView: {
        backgroundColor: "#fff",
        flex: 1
    },
    spinner: {
        marginTop: 30
    },
    addWrapperTimes: {
        width: "100%",
        height: "100%",
        alignItems: "flex-start",
        justifyContent: "space-around",
        flexDirection: "row",
        flex: 1,
    },
    daysTimes: {
        width: "100%",
        height: "100%",
        flex: 1,
        flexDirection: "column",
        borderRightColor: "#999",
        borderRightWidth: 0.5,
    },
    daysTextTimes: {
        textAlign: "center"
    },
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Calendar);
