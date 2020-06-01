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
import { firstNameOwnership } from "../../utils";
import CallStatus from "../../components/ActiveFriends/CallStatus";
import InvitationReceived from "../../components/ActiveFriends/InvitationReceived";
import NotificationInvitationSent from "../../components/ActiveFriends/NotificationInvitationSent";
import call from "react-native-phone-call";
import { Facetime } from "react-native-openanything";
import firebase from "react-native-firebase";




class Upcoming extends Component {
    constructor(props) {
        super(props);
    }

    getNotificationStatus = () => {
        ////////////////// permissions
        firebase
            .messaging()
            .hasPermission()
            .then(enabled => {
                if (enabled) {
                    this.setState({
                        androidNotificationsEnabled: true
                    });
                } else {
                    this.setState({
                        androidNotificationsEnabled: false
                    });
                }
            });

        firebase
            .messaging()
            .requestPermission()
            .then(() => {
                this.setState({
                    notificationsEnabled: true
                });
            })
            .catch(error => {
                this.setState({
                    notificationsEnabled: false
                });
            });
        //// end permissions
    }
    appSettings = () => {
        Linking.openURL("app-settings:");
        // change tab so when they come back, it refreshes
        this.props.navigator.switchToTab({
            tabIndex: 0
        });
    };

    checkNotificationSetting = () => {
        if (Platform.OS === "ios" && !this.state.notificationsEnabled) {

            this.getNotificationStatus()

        } else if (Platform.OS === "android" && !this.state.androidNotificationsEnabled) {
            if (!this.state.androidNotificationsEnabled) {
                this.getNotificationStatus()
            }
        }
    }

    state = {
        notificationsEnabled: true,
        androidNotificationsEnabled: true
    };

    componentDidMount() {
        this.props.onGetUpcomingData()
        this.getNotificationStatus()
    }

    static navigatorStyle = {
        navBarNoBorder: true,
        navBarBackgroundColor: colors.blueColor,
        navBarButtonColor: "#ffffff",
        navBarHidden: true,
        statusBarColor: colors.blueColor
    };


    // for ios 
    callOptions = (number, args) => {
        Alert.alert(
            "How would you like to start this call?",
            "",
            [
                {
                    text: "FaceTime Video",
                    onPress: () => this.ftv(number)
                },
                {
                    text: "FaceTime Audio",
                    onPress: () => this.fta(number)
                },
                { text: "Phone Call", onPress: () => call(args).catch(console.error) }
            ],
            { cancelable: false }
        );
    };
    ftv = number => {
        Facetime(number, (audioOnly = false)).catch(err => alert(err));
    };
    fta = number => {
        Facetime(number, (audioOnly = true)).catch(err => alert(err));
    };

    scheduleInvitation = (invitation_id, user_id, first_name) => {
        this.props.onGetCalendar(false, invitation_id) // loads current user calendar before getting friends calendar
        this.props.navigator.push({
            screen: "awesome-places.FriendsCalendar",
            backButtonTitle: "",
            title: `${firstNameOwnership(first_name)} Availability`,
            passProps: {
                invitation_id: invitation_id,
                user_id: user_id,
                first_name: firstNameOwnership(first_name),
                first_name_singular: first_name
            }
        });
    }

    startCall = (firstName, phoneNumber, callTimeInUTC, day, timeOfCall, ios) => {
        number = "1" + phoneNumber;
        args = {
            number: number, // String value with the number to call
            prompt: true // Optional boolean property. Determines if the user should be prompt prior to the call
        };

        timeNow = new Date()
        timeCall = new Date(callTimeInUTC)
        canCall = false
        if (timeCall.getTime() <= timeNow.getTime()) {
            canCall = true
        }

        if (day === "today") {
            day = ""
        } else {
            day = " tomorrow"
        }

        if (canCall) {
            if (Platform.OS === "ios" && ios) {
                this.callOptions(number, args)
            } else {
                call(args).catch(console.error)
            }

        } else {
            Alert.alert(`${firstName} is not expecting a call yet`, `Check back${day} at ${timeOfCall} to start this call`)
        }

    }

    render() {
        invitationsReceived = null
        invitationsSent = null
        upcomingCallsView = null
        if (this.props.waitingForMe.length > 0) {
            invitationsReceived = (
                <View style={styles.upcomingWrapper}>
                    <View style={styles.titleWrapper2}>
                        <Text style={styles.titleText}>
                            Invitations Received
                        </Text>
                    </View>
                    <InvitationReceived
                        invitations={this.props.waitingForMe}
                        onItemSelected={this.scheduleInvitation}
                    />
                </View>
            )
        }

        if (this.props.waitingForFriends.length + this.props.waitingForTextedFriends.length > 0) {
            invitationsSent = (
                <View>
                    <View style={styles.titleWrapper2}>
                        <Text style={styles.titleText}>
                            Invitations Sent
                                </Text>
                    </View>
                    <NotificationInvitationSent
                        invitations={this.props.waitingForFriends}
                        onItemSelected={this.scheduleInvitation}
                    />
                    <NotificationInvitationSent
                        invitations={this.props.waitingForTextedFriends}
                        onItemSelected={this.scheduleInvitation}
                    />
                </View>
            )
        }


        let notificationsDisabled = null
        if (Platform.OS === "ios" && !this.state.notificationsEnabled) {
            notificationsDisabled = (
                <Text style={styles.notificationExplain} onPress={this.appSettings}>
                    Allow notifications{" "}
                    <Text style={styles.openAppSettingsText}>here </Text>
                    if you want to be notified when a friend schedules a call with you. Or if you want a reminder for upcoming calls.
              </Text>
            );
        } else if (Platform.OS === "android" && !this.state.androidNotificationsEnabled) {
            notificationsDisabled = (
                <Text style={styles.notificationExplain}>
                    Allow notifications in app settings if you want to be notified when a friend schedules a call with you. Or if you want a reminder for upcoming calls.
              </Text>
            );
        }


        // no invitations sent - no invitations received 
        if (!this.props.isLoadingUpcoming && (this.props.upcomingBookedCalls.length + this.props.waitingForMe.length + this.props.waitingForFriends.length + this.props.waitingForTextedFriends.length === 0)) {
            upcomingCallsView = (
                <Text style={styles.upcomingInfoText}>
                    {/* Once you Invite friends to catch up, they'll be able to join one of the many times you've set aside for them in your Calendar(the green selections). */}
                    Start inviting friends to catch up! Once a friend joins your Calendar, you'll see the details of your upcoming call with them here.
                    {"\n"}{"\n"}
                    {/* Protip: Try to set multiple times aside in your Calendar before sending invites so your friends can choose what works best for them (they'll see all the green selections in your Calendar). */}
                    Protip: To make it easier for your friends to choose a time that works best for them, set multiple times aside in your Calendar before sending invites (your friends will see all the green selections in your Calendar).
                    {/* Once you invite friends to catch up, they'll be able to join your Calendar through one of your many green times selected. */}
                    {/* Once you Invite friends to catch up, they'll see all the green selections in your Calendar and be able to join you for a call today or tomorrow.
                    You'll see the all details of the call here when it's finalized. */}
                </Text>
            )
            // yes invitations sent - no invitations received 
        } else if (!this.props.isLoadingUpcoming && this.props.upcomingBookedCalls.length === 0 && ((this.props.waitingForFriends.length + this.props.waitingForTextedFriends.length) > 0) && this.props.waitingForMe.length === 0) {
            upcomingCallsView = (
                <Text style={styles.upcomingInfoText}>
                    Once the friends you've invited view and join your Calendar, you'll see the details of your upcoming calls with them here.
                    {"\n"}{"\n"}
                    Protip: Keep multiple times aside in your calendar to make it easier for your friends to choose what works best for them (your friends will see all the green selections in your Calendar).
                    {/* Protip: Try to keep multiple times aside in your Calendar so your friends can choose what works best for them (they'll see all the green selections in your Calendar). */}
                </Text>
            )
            // yes invitations received - everything else doesnt matter 
        } else if (!this.props.isLoadingUpcoming && this.props.upcomingBookedCalls.length === 0 && this.props.waitingForMe.length > 0) {
            upcomingCallsView = (
                <Text style={styles.upcomingInfoText}>
                    Once you open the invitation you've received and finalize a time to catch up, you'll see the details of the call here.
                </Text>
            )
        } else {
            upcomingCallsView = (
                <CallStatus
                    upcomingCalls={this.props.upcomingBookedCalls}
                    onItemSelected={this.startCall}
                />
            )
        }

        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.blueColor}
                />
                <SafeAreaView style={{ backgroundColor: colors.blueColor, flex: 1 }}>
                    <View style={{ flexDirection: 'row', backgroundColor: colors.blueColor }}>
                        <Text style={styles.header}>
                            {/* Sunday, May 24th */}
                            {this.props.date}
                        </Text>
                    </View>

                    <View style={styles.scrollView}>
                        <ScrollView
                            contentContainerStyle={{}}
                            refreshControl={
                                <RefreshControl
                                    refreshing={
                                        this.props.isLoadingUpcoming
                                    }
                                    onRefresh={() => {
                                        this.props.onGetUpcomingData(),
                                            this.checkNotificationSetting()
                                    }}
                                />
                            }
                        >


                            {/********  UPCOMING CALLS  ********/}
                            <View style={styles.upcomingWrapper}>
                                <View style={styles.titleWrapper}>
                                    <Text style={styles.titleText}>
                                        Upcoming Calls
                                    </Text>
                                </View>
                                {upcomingCallsView}
                            </View>


                            {/********  INVITATIONS RECEIVED  ********/}
                            {invitationsReceived}

                            {/********  INVITATIONS SENT  ********/}
                            {invitationsSent}

                            {notificationsDisabled}
                        </ScrollView>
                    </View >

                </SafeAreaView>

            </View >
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
        isLoadingUpcoming: state.ui.isLoadingUpcoming,
        date: state.upcoming.date
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
        backgroundColor: colors.blueColor,
        width: "100%"
    },
    header: {
        flex: 1, flexWrap: 'wrap',
        color: "#fff",
        padding: 15,
        fontSize: Dimensions.get("window").width > 330 ? 19 : 17,
        textAlign: "center",
        fontWeight: "500",
        // textAlign: "center",
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        backgroundColor: colors.blueColor
    },
    scrollView: {
        backgroundColor: "#fff",
        flex: 1
    },
    upcomingWrapper: {
        marginBottom: 10
    },
    titleWrapper: {
        flexDirection: "column",
        // backgroundColor: colors.orange
        // borderBottomWidth: 1,
        // borderBottomColor: "#eee",
    },
    titleWrapper2: {
        flexDirection: "column",
        // backgroundColor: colors.orange
        // borderBottomWidth: 0.5,
        borderTopWidth: 0.5,
        borderColor: "#eee",
        paddingTop: 10
    },
    titleText: {
        // textAlign: "center",
        padding: 10,
        color: "black",
        // color: colors.blueColor,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        fontWeight: "600",
        fontSize: Dimensions.get("window").width > 330 ? 23 : 20,

    },
    callStatusWrapper: {
        margin: 10,
        marginTop: 0,
        flex: 1
    },
    notificationExplain: {
        // textAlign: "center",
        padding: 10,
        marginTop: 20,
        color: "black",
        // color: colors.blueColor,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        fontWeight: "400",
        fontSize: Dimensions.get("window").width > 330 ? 16 : 14,
    },
    openAppSettingsText: {
        color: colors.blueColor
    },
    upcomingInfoText: {
        paddingTop: 5,
        paddingHorizontal: 15,
        paddingBottom: 10,
        // fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        fontWeight: "200",
        fontSize: 15
    }
});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Upcoming);
