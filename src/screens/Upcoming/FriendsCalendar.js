import React, { Component } from "react";
import {
    View,
    Image,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    Platform,
    StatusBar,
    Switch,
    Alert,
    ScrollView,
    Dimensions,
    ActivityIndicator
} from "react-native";
import { connect } from "react-redux";

import Icon from "react-native-vector-icons/Ionicons";

import colors from "../../utils/styling";
import { clearFriendsCalendar, bookFriendsCalendar } from "../../store/actions/upcomings";
import FriendsCalendarList from "../../components/FriendsCalendar/FriendsCalendarList";
import { getCalendar } from "../../store/actions/calendars";

class FriendsCalendar extends Component {
    static navigatorStyle = {
        navBarHidden: false,
        statusBarColor: colors.blueColor,
        navBarBackgroundColor: colors.blueColor,
        navBarButtonColor: "#fff",
        navBarTextColor: "#fff"
    };
    constructor(props) {
        super(props);
    }
    // Cant pick a time? dont worry, we'll notify you once Andrew's calendar is updated 
    componentDidMount() {
        this.setState({
            day: new Date().getDate()
        })
    }

    componentWillUnmount() {
        this.props.onClearFriendsCalendar()
        if (!this.props.booked && !(this.props.friendsCalendar.todayOptions.length + this.props.friendsCalendar.tomorrowOptions.length === 0)) {
            Alert.alert("Can't pick a time?", `Don't worry, Wayvo will notify you once ${this.props.first_name} calendar is updated`)
        }
    }

    state = {
        // check that its the same date before sending request 
        day: null,
        showNahWorry: true
    };


    timeSelectedToday = time => {
        if (this.state.day === new Date().getDate()) {
            Alert.alert(
                `Catch-up with ${this.props.first_name_singular} over a phone call at ${time} today?`,
                ``,
                [
                    {
                        text: "Pick another time",
                        onPress: () => { console.log("s") },
                        style: "default"
                    },
                    {
                        text: "Confirm",
                        onPress: () => { this.props.onBookFriendsCalendar(1, time, this.props.invitation_id, this.props.friendsCalendar.updated_at) },
                        style: "cancel"
                    }
                ],
                { cancelable: true }
            );

        } else {
            // if todays date is not the same as when this screen was loaded 
            this.props.onGetCalendar(false, this.props.invitation_id)
            Alert.alert("Please select again", "The previous calendar was out of date")
        }
    }

    timeSelectedTomorrow = time => {
        if (this.state.day === new Date().getDate()) {
            Alert.alert(
                `Catch-up with ${this.props.first_name_singular} over a phone call at ${time} tomorrow?`,
                ``,
                [
                    {
                        text: "Pick another time",
                        onPress: () => { console.log("s") },
                        style: "default"
                    },
                    {
                        text: "Confirm",
                        onPress: () => { this.props.onBookFriendsCalendar(2, time, this.props.invitation_id, this.props.friendsCalendar.updated_at) },
                        style: "cancel"
                    }
                ],
                { cancelable: true }
            );

            // (day, time, invitation_id, updated_at)
            // this.props.onBookFriendsCalendar(2, time, this.props.invitation_id, this.props.friendsCalendar.updated_at)
        } else {
            // if todays date is not the same as when this screen was loaded 
            this.props.onGetCalendar(false, this.props.invitation_id)
            Alert.alert("Please select again", "The previous calendar was out of date")
        }
    }

    render() {
        calendarDates = null
        if (this.props.isLoadingFriendsCalendar) {
            calendarContent = <ActivityIndicator color="#444" style={styles.spinner} />
        } else if (this.props.booked) {
            calendarContent = (
                <View style={styles.wrapperSelectionFeedback}>
                    <Text style={styles.textSelectionFeedback}>
                        Woohoo, you've been successfully added to {this.props.first_name} calendar.
                        Wayvo will send you a reminder 15 minutes before your call.
                    </Text>
                </View>
            )
        } else if (this.props.friendsCalendar.todayOptions.length + this.props.friendsCalendar.tomorrowOptions.length === 0) {
            calendarContent = (
                <View style={styles.wrapperSelectionFeedback}>
                    <Text style={styles.textSelectionFeedback}>
                        Oh no, it looks like all of {this.props.first_name} availability has been taken.
                        Wayvo will notify you once {this.props.first_name} calendar is updated!
                    </Text>
                </View>
            )
        } else {
            calendarContent = (
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
            )
            calendarDates = (
                <View style={styles.scrollView}>
                    <View style={styles.addWrapperTimes}>
                        <View style={styles.daysTimes}>
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                                <FriendsCalendarList
                                    day={this.props.friendsCalendar.todayOptions} //sending to friendslist component 
                                    onItemSelected={this.timeSelectedToday} //receiving from friendslist component 
                                />
                            </ScrollView>
                        </View>

                        <View style={styles.daysTimes}>
                            <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
                                <FriendsCalendarList
                                    day={this.props.friendsCalendar.tomorrowOptions} //sending to friendslist component 
                                    onItemSelected={this.timeSelectedTomorrow} //receiving from friendslist component 
                                />
                            </ScrollView>
                        </View>
                    </View>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.blueColor}
                />

                {calendarContent}
                {calendarDates}

            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
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
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
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
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
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
    wrapperSelectionFeedback: {
        padding: 10,
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
    },
    textSelectionFeedback: {
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        fontWeight: "500",
        fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
        color: "#444",
        textAlign: "center",
        padding: 20


    }

});

const mapStateToProps = state => {
    return {
        friendsCalendar: state.upcoming.friendsCalendar,
        booked: state.upcoming.booked,
        isLoadingFriendsCalendar: state.ui.isLoadingFriendsCalendar
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onClearFriendsCalendar: () => dispatch(clearFriendsCalendar()),
        onGetCalendar: (updateAlert, invitation_id) => dispatch(getCalendar(updateAlert, invitation_id)),
        onBookFriendsCalendar: (day, time, invitation_id, updated_at) => dispatch(bookFriendsCalendar(day, time, invitation_id, updated_at))
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(FriendsCalendar);
