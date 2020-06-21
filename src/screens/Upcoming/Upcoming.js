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
    Alert,
    TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";

import { getUpcomingData, showFriendsCalendar } from "../../store/actions/upcomings";
import WaitingForMe from "../../components/Upcoming/WaitingForMe";
import { getCalendar, updateCalendarGreen } from "../../store/actions/calendars";
import { firstNameOwnership } from "../../utils";
import CallStatus from "../../components/ActiveFriends/CallStatus";
import InvitationReceived from "../../components/ActiveFriends/InvitationReceived";
import NotificationInvitationSent from "../../components/ActiveFriends/NotificationInvitationSent";
import call from "react-native-phone-call";
import { Facetime } from "react-native-openanything";
import firebase from "react-native-firebase";
import Icon from "react-native-vector-icons/Ionicons";





class Upcoming extends Component {
    constructor(props) {
        super(props);
        this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
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
        androidNotificationsEnabled: true,
        hasContacts: true,
        hasSetRelationship: true,
        hasCalendarTimeSelected: true,
        displayNames: null
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

    onNavigatorEvent = event => {
        if (event.type === "ScreenChangedEvent") {
            if (event.id === "willAppear") {
                // check if user has contacts 
                if (this.props.syncedContacts.length === 0) {
                    this.setState({
                        hasContacts: false,
                        hasSetRelationship: false
                    })
                } else {
                    // check if user has set relationship 
                    relationshipDays = 0
                    // check which contacts have relationships that are set 
                    weekly = []
                    biWeekly = []
                    monthly = []
                    bimonthly = []
                    trimonthly = []
                    this.props.syncedContacts.forEach(element => {
                        if (element["relationship_days"] < 100) {
                            relationshipDays += element["relationship_days"]
                            switch (element["relationship_days"]) {
                                case 7:
                                    weekly.push(element["givenName"])
                                    break;
                                case 14:
                                    weekly.push(element["givenName"])
                                    break;
                                case 30:
                                    weekly.push(element["givenName"])
                                    break;
                                case 60:
                                    weekly.push(element["givenName"])
                                    break;
                                case 90:
                                    weekly.push(element["givenName"])
                                    break;
                            }
                        }
                    });
                    allRelationshipNames = weekly.concat(biWeekly, monthly, bimonthly, trimonthly)
                    firstThreeNames = allRelationshipNames.slice(0, 3)
                    if (firstThreeNames.length === 1) {
                        displayNames = firstThreeNames[0]
                    } else if (firstThreeNames.length === 2) {
                        displayNames = firstThreeNames[0] + " and " + firstThreeNames[1]
                    } else {
                        displayNames = firstThreeNames[0] + ", " + firstThreeNames[1] + " and " + firstThreeNames[2]
                    }

                    if (relationshipDays > 0) {
                        this.setState({
                            hasSetRelationship: true,
                            hasContacts: true,
                            displayNames: displayNames
                        })
                    } else {
                        this.setState({
                            hasSetRelationship: false,
                            hasContacts: true,
                            displayNames: displayNames
                        })
                    }
                }

                //calendar 
                count = 0
                this.props.todaysSchedule.forEach(element => {
                    if (element["status"] === "free") {
                        count++
                    }
                })
                this.props.tomorrowsSchedule.forEach(element => {
                    if (element["status"] === "free") {
                        count++
                    }
                })
                // has to be 2 or greater since they are deselecting - since the count includes the deselected one 
                status = count > 0 ? true : false
                this.setState({
                    hasCalendarTimeSelected: status
                })

            }
        }
    };

    changeTabFromToDo = (completed, tab) => {
        if (!completed) {
            this.props.navigator.switchToTab({
                tabIndex: tab
            });
            if (tab === 0) {
                Alert.alert("", "Once you have synced your contacts, tap on a friend's name to select how often you want to catch-up with them")
            } else {
                Alert.alert("Select as many times as you can")
            }
        }
    }

    render() {

        invitationsReceived = null
        invitationsSent = null
        invitationsSentText = null
        upcomingCallsView = null
        notSetup = null
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

        if (this.props.waitingForFriends.length + this.props.waitingForTextedFriends.length === 0) {
            invitationsSentText = (
                <Text style={styles.upcomingInfoText}>
                    In 10 minutes, Wayvo will invite {this.state.displayNames} to schedule a call with you! The 10 minute delay is to give you a chance to make any final additions to your Calendar before friends view it and choose a time.
                   {"\n"}{"\n"}
                    Once your Calendar is fully up to date, you can close the Wayvo App - you will receive a notification when the invitation is sent.
                </Text>
            )
        }

        checkMark = (
            <Icon
                size={30}
                name={"ios-checkmark-circle-outline"}
                color={colors.greenColor}
                iconStyle={{ display: "none" }}
            />
        )
        xMark = (
            <Icon
                size={30}
                name={"ios-close-circle-outline"}
                color={colors.pinkColor}
                iconStyle={{ display: "none" }}
            />
        )

        contactsMark = this.state.hasContacts ? checkMark : xMark
        relationshipsMark = this.state.hasSetRelationship ? checkMark : xMark
        calendarMark = this.state.hasCalendarTimeSelected ? checkMark : xMark



        // if all the following is true, dont show this 
        if (!(this.state.hasCalendarTimeSelected && this.state.hasContacts && this.state.hasSetRelationship)) {
            notSetup = (
                <View style={{ marginTop: 10 }}>
                    <View style={styles.redHeaderWrapper}>
                        <Text style={styles.upcomingInfoTextRed}>
                            Send friends an invitation to schedule a call with you by completing the following:
                        </Text>
                    </View>
                    <View style={styles.redWrapper}>

                        <TouchableWithoutFeedback onPress={() => this.changeTabFromToDo(this.state.hasContacts, 0)}>
                            <View style={styles.bulletsWrapper}>
                                <View style={styles.iconWrapper}>
                                    {contactsMark}
                                </View>
                                <View style={styles.instructionsWrapper}>
                                    <Text style={styles.bulletText}>
                                        Add friends from your contact list
                                </Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => this.changeTabFromToDo(this.state.hasSetRelationship, 0)}>
                            <View style={styles.bulletsWrapper}>
                                <View style={styles.iconWrapper}>
                                    {relationshipsMark}
                                </View>
                                <View style={styles.instructionsWrapper}>
                                    <Text style={styles.bulletText}>
                                        {/* Select and manage the relationships of 2 or more friends you never want to lose touch with or want to get to know better */}
                                        Select all the friends you want to stay in touch with in the Relationships tab and choose how often you want to catch-up with them
                                        {/* Select friends in the Relationships tab and choose how often you want to catch-up with them */}
                                    </Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>

                        <TouchableWithoutFeedback onPress={() => this.changeTabFromToDo(this.state.hasCalendarTimeSelected, 1)}>
                            <View style={styles.bulletsWrapper}>
                                <View style={styles.iconWrapper}>
                                    {calendarMark}
                                </View>
                                <View style={styles.instructionsWrapper}>
                                    <Text style={styles.bulletText}>
                                        Suggest at least 5 times in your Calendar that friends can choose from to schedule a call with you
                                </Text>
                                </View>
                            </View>
                        </TouchableWithoutFeedback>

                    </View>
                    {/* <Text>
                        {this.state.hasContacts.toString()}
                        {this.state.hasSetRelationship.toString()}
                        {this.state.hasCalendarTimeSelected.toString()}
                    </Text> */}
                </View>


            )
        }

        // if (this.props.waitingForFriends.length + this.props.waitingForTextedFriends.length > 0 || (this.state.hasCalendarTimeSelected && this.state.hasContacts && this.state.hasSetRelationship)) {
        if (this.props.waitingForFriends.length + this.props.waitingForTextedFriends.length > 0) {
            invitationsSent = (
                <View style={{ marginBottom: 10 }}>
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
                    {/* {invitationsSentText} */}

                    {/* dont show add friends here, say add more friends, and leave calendar  */}
                    {/* {notSetup} */}
                </View>
            )
        }

        notSetupInstructions = null
        if (!(this.state.hasCalendarTimeSelected && this.state.hasContacts && this.state.hasSetRelationship)) {
            notSetupInstructions = (
                <View style={styles.titleWrapper2}>
                    {notSetup}
                </View>
            )
        }


        let notificationsDisabled = null
        if (Platform.OS === "ios" && !this.state.notificationsEnabled) {
            notificationsDisabled = (
                <Text style={styles.notificationExplain} onPress={this.appSettings}>
                    Allow notifications{" "}
                    <Text style={styles.openAppSettingsText}>here </Text>
                    if you want to be notified when friends invite you to schedule a call with them.
              </Text>
            );
        } else if (Platform.OS === "android" && !this.state.androidNotificationsEnabled) {
            notificationsDisabled = (
                <Text style={styles.notificationExplain}>
                    Allow notifications in app settings if you want to be notified when friends invite you to schedule a call with them.
              </Text>
            );
        }

        // Set how often you want to catch-up with each friend and update your Calendar. Then, check back here in 10 minutes to see who Wayvo invited to catch-up. 

        // no invitations sent - no invitations received 
        if (!this.props.isLoadingUpcoming && (this.props.upcomingBookedCalls.length + this.props.waitingForMe.length + this.props.waitingForFriends.length + this.props.waitingForTextedFriends.length === 0)) {
            upcomingCallsView = (
                <Text style={styles.upcomingInfoText}>
                    No scheduled calls yet

                    {/* {"\n"}{"\n"} */}

                    {/* Protip: The more times you suggest from your Calendar, the easier it will be for your friends to choose a time that works best for them (friends will see all the green selections in your Calendar). */}

                </Text>
            )
            // yes invitations sent - no invitations received 
        } else if (!this.props.isLoadingUpcoming && this.props.upcomingBookedCalls.length === 0 && ((this.props.waitingForFriends.length + this.props.waitingForTextedFriends.length) > 0) && this.props.waitingForMe.length === 0) {
            upcomingCallsView = (
                <Text style={styles.upcomingInfoText}>
                    {/* No scheduled calls yet */}
                    {/* {"\n"}{"\n"} */}
                    When the friends you've invited view your Calendar and schedule a call, you'll see the details here
                    {/* {"\n"}{"\n"} */}

                    {/* Protip: The more times you set aside in your Calendar, the easier it will be for your friends to choose a time that works best for them (friends will see all the green selections in your Calendar). */}
                </Text>
            )
            // yes invitations received - everything else doesnt matter 
        } else if (!this.props.isLoadingUpcoming && this.props.upcomingBookedCalls.length === 0 && this.props.waitingForMe.length > 0) {
            upcomingCallsView = (
                <Text style={styles.upcomingInfoText}>
                    No scheduled calls yet
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

                            {notSetupInstructions}

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
        date: state.upcoming.date,
        todaysSchedule: state.calendar.todays_schedule,
        tomorrowsSchedule: state.calendar.tomorrows_schedule,
        calendarHasGreen: state.calendar.calendarHasGreen,
        syncedContacts: state.users.contacts,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetUpcomingData: () => dispatch(getUpcomingData()),
        onShowFriendsCalendar: (invitation_id, todaysSchedule, tomorrowsSchedule) => dispatch(showFriendsCalendar(invitation_id, todaysSchedule, tomorrowsSchedule)),
        onGetCalendar: (updateAlert, invitation_id) => dispatch(getCalendar(updateAlert, invitation_id)),
        onUpdateCalendarGreen: boolean => dispatch(updateCalendarGreen(boolean))
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
        fontSize: Dimensions.get("window").width > 330 ? 21 : 18,
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
        borderTopWidth: 1.5,
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
        fontSize: Dimensions.get("window").width > 330 ? 25 : 22,

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
        fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
    },
    openAppSettingsText: {
        color: colors.blueColor
    },
    upcomingInfoText: {
        paddingTop: 5,
        paddingHorizontal: 15,
        paddingBottom: 10,
        // fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        fontWeight: "400",
        color: "#777",
        fontSize: 16
    },
    invitationsSentText: {
        paddingTop: 5,
        paddingHorizontal: 15,
        // fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        fontWeight: "400",
        color: "#777",
        fontSize: 16
    },
    upcomingInfoTextRed: {
        paddingTop: 5,
        paddingHorizontal: 15,
        paddingBottom: 10,
        // fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        fontWeight: "600",
        color: "#333",
        fontSize: 17
    },
    redWrapper: {
        // backgroundColor: colors.pinkColor,
        marginLeft: 15,
        marginRight: 15
    },
    redBulletsWrapper: {
        backgroundColor: colors.pinkColor,
        marginBottom: 20,
        padding: 10,
        borderRadius: 5,
    },
    bulletsWrapper: {
        // backgroundColor: colors.greenColor,
        marginBottom: 20,
        // padding: 10,
        borderRadius: 5,
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
    },
    bulletText: {
        color: "#777",
        fontSize: 16,
        fontWeight: "500",
        // fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    },
    instructionsWrapper: {
        width: "85%"
    },
    iconWrapper: {
        width: "15%",
        alignItems: "center",
    }

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Upcoming);
