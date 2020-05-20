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

import { getUpcomingData, showFriendsCalendar } from "../../store/actions/upcomings";
import WaitingForMe from "../../components/Upcoming/WaitingForMe";
import { getCalendar } from "../../store/actions/calendars";


class Upcoming extends Component {
    constructor(props) {
        super(props);
    }
    state = {
    };

    componentDidMount() {
        this.props.onGetUpcomingData()
        console.log(this.props.waitingForMe)
    }

    static navigatorStyle = {
        navBarNoBorder: true,
        navBarBackgroundColor: colors.darkBlue,
        navBarButtonColor: "#ffffff",
        navBarHidden: true,
        statusBarColor: colors.darkBlue
    };

    scheduleInvitation = (invitation_id, user_id) => {
        this.props.onGetCalendar(false, invitation_id) // loads current user calendar before getting friends calendar
        this.props.navigator.push({
            screen: "awesome-places.FriendsCalendar",
            backButtonTitle: "",
            title: "Andrew's Availability",
            passProps: {
                invitation_id: invitation_id,
                user_id: user_id
            }
        });
    }

    render() {
        return (
            <ScrollView style={styles.scrollContainer}>
                <SafeAreaView style={{ backgroundColor: colors.darkBlue, flex: 1 }}>
                    <View style={{ flex: 1 }}>
                        <StatusBar
                            barStyle="light-content"
                            backgroundColor={colors.darkBlue}
                        />

                        <View style={{ flexDirection: 'row', backgroundColor: colors.darkBlue }}>
                            <Text style={styles.header}>
                                {/* Update your availability so friends can schedule a call with you. Select as many time slots as you want. */}
                                Upcoming calls
                            </Text>
                        </View>

                        <View style={styles.whiteView}>
                            <WaitingForMe
                                invitations={this.props.waitingForMe} //sending to friendslist component 
                                onItemSelected={this.scheduleInvitation} //receiving from friendslist component 
                            />
                        </View>

                    </View >
                </SafeAreaView>
            </ScrollView>
        );
    }
}

const mapStateToProps = state => {
    return {
        waitingForMe: state.upcoming.waitingForMe,
        upcomingBookedCalls: state.upcoming.upcomingBookedCalls,
        waitingForFriends: state.upcoming.waitingForFriends,
        waitingForTextedFriends: state.upcoming.waitingForTextedFriends,
        todaysSchedule: state.calendar.todays_schedule,
        tomorrowsSchedule: state.calendar.tomorrows_schedule,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetUpcomingData: () => dispatch(getUpcomingData()),
        onShowFriendsCalendar: (invitation_id, todaysSchedule, tomorrowsSchedule) => dispatch(showFriendsCalendar(invitation_id, todaysSchedule, tomorrowsSchedule)),
        onGetCalendar: (updateAlert, invitation_id) => dispatch(getCalendar(updateAlert, invitation_id))
    };
};

const styles = StyleSheet.create({
    scrollContainer: {
        //padding: 20,
        backgroundColor: colors.darkBlue,
        width: "100%"
    },
    container: {
        backgroundColor: "red",
        flex: 1
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
    whiteView: {
        backgroundColor: "#fff",
        flex: 1
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Upcoming);
