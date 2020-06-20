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
    Touchable,
    Alert,
    TouchableOpacity,
    Modal,
    TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";

import { getCalendar, timeSelected, updateCalendarGreen } from "../../store/actions/calendars";
import CalendarList from "../../components/Calendar/CalendarList";
import ActiveHelloButton from "../../components/UI/ActiveHelloButton";
import Icon from "react-native-vector-icons/Ionicons";
import { getTimeToCatchUpList, contactIndex } from "../../store/actions/upcomings";
import { sendInvite } from "../../store/actions/users";


class Calendar extends Component {
    constructor(props) {
        super(props);
    }
    state = {
        modalVisible: false,
        index: 0
    };

    componentDidMount() {
        this.props.onGetCalendar(false)
        this.props.onGetTimeToCatchUpList()
    }

    static navigatorStyle = {
        navBarNoBorder: true,
        navBarBackgroundColor: colors.blueColor,
        navBarButtonColor: "#ffffff",
        navBarHidden: true,
        statusBarColor: colors.blueColor
    };

    // save in async each time and then reload from async with error message if theres an error in backend 

    setModalVisible(visible) {
        this.setState({ modalVisible: visible });
    }
    checkContacts = boolean => {
        if (this.props.syncedContacts.length > 0) {
            this.setModalVisible(boolean)
        } else {
            Alert.alert("Please sync your contacts first", "So you can choose who to invite and schedule a call with")
        }
    }

    timeSelectedToday = id => {
        selected = this.props.todaysSchedule.find(x => x.id === id) //{id: 5,time: '10:00am',status: 'busy'}
        if (selected.status === "busy") {
            this.props.onTimeSelected(1, id, selected.time, "free", this.props.todaysSchedule, this.props.tomorrowsSchedule)
        } else if (selected.status === "free") {
            this.props.onTimeSelected(1, id, selected.time, "busy", this.props.todaysSchedule, this.props.tomorrowsSchedule)
        } else {
            Alert.alert("A friend has successfully scheduled a call with you", "Check the Upcoming tab for more info")
        }
    }

    timeSelectedTomorrow = id => {
        selected = this.props.tomorrowsSchedule.find(x => x.id === id)
        if (selected.status === "busy") {
            this.props.onTimeSelected(2, id, selected.time, "free", this.props.todaysSchedule, this.props.tomorrowsSchedule) // last number is selected(1) or deselected(0)
        } else if (selected.status === "free") {
            this.props.onTimeSelected(2, id, selected.time, "busy", this.props.todaysSchedule, this.props.tomorrowsSchedule)
        } else {
            Alert.alert("A friend has successfully scheduled a call with you", "Check the Upcoming tab for more info")
        }
    }

    sendInvitePressed = () => {
        // this checks what to cut out from todays times before counting how many free times are selected 
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

        let newTodayArray = this.props.todaysSchedule.slice(arrayPosition)

        count = 0
        this.props.tomorrowsSchedule.forEach(element => {
            if (element.status === "free") {
                count += 1
            }
        })
        newTodayArray.forEach(element => {
            if (element.status === "free") {
                count += 1
            }
        })

        if (count < 5) {
            // this.setModalVisible(false)
            // this.props.onGetCalendar(false)
            Alert.alert(`Please select 5 or more times in your Calendar before sending an invite`, "Give your friend more options to choose from to schedule a call with you")
        } else {
            newArr = []
            fullname = this.props.timeToCatchUpWith[this.props.index]["givenName"] + " " + this.props.timeToCatchUpWith[this.props.index]["familyName"]
            this.props.timeToCatchUpWith[this.props.index]["phoneNumbers"].forEach(function (details) {
                newArr.push({ fullname: fullname, phoneNumber: details.number })
            });
            this.props.onSendInvite(newArr)

        }

        // [{fullname: "Andrew Selvadurai", phoneNumber: "6475542523"}]

    }

    rightButtonPressed = (number) => {
        this.props.onUpdateContactIndex(number)
    }

    render() {
        let calendarContent = null
        let modalContent = null;
        let fullname = null



        if (this.props.isLoadingCalendar) {
            calendarContent = <ActivityIndicator color="#444" style={styles.spinner} />
        } else if (!this.props.isLoadingCalendar && this.props.todaysSchedule.length > 0) {
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

        leftButton = null
        rightButton = null
        greenSendInviteButton = null

        if (this.props.isLoading) {
            greenSendInviteButton = (
                <View>
                    <Text style={styles.sendInviteButtonText}>SENDING...</Text>
                </View>
            )
        } else {
            greenSendInviteButton = (
                <TouchableOpacity onPress={() => this.sendInvitePressed()}>
                    <Text style={styles.sendInviteButtonText}>
                        SEND INVITE TO CATCH-UP
                    </Text>
                </TouchableOpacity>
            )
        }


        if (this.props.index > 0) {
            leftButton = (
                <TouchableWithoutFeedback onPress={() => this.rightButtonPressed(-1)}>
                    <Icon size={30} name={"ios-arrow-back"} color={"#999"} />
                </TouchableWithoutFeedback>
            )
        }
        if (this.props.timeToCatchUpWith.length > 1 && (this.props.timeToCatchUpWith.length > (this.props.index + 1))) {
            rightButton = (
                <TouchableWithoutFeedback onPress={() => this.rightButtonPressed(1)}>
                    <Icon size={30} name={"ios-arrow-forward"} color={"#999"} />
                </TouchableWithoutFeedback>
            )
        }


        if (this.props.timeToCatchUpWith.length > 0) {
            fullname = (
                <Text style={styles.blueName}>
                    {this.props.timeToCatchUpWith[this.props.index]["givenName"] + " " + this.props.timeToCatchUpWith[this.props.index]["familyName"]}
                </Text>
            )

            modalContent = (
                <View>
                    <View style={styles.xWrapper}>
                        <TouchableWithoutFeedback
                            onPress={() => this.setModalVisible(false)}
                        >
                            <Icon size={20} name={"md-close-circle"} color={"#999"} />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.verifiedWrapper}>
                        <View style={styles.modalTitleWrapper}>
                            <Text style={styles.modalTitle}>
                                It's time to catch-up with
                            </Text>


                            <View style={styles.nameButtonsWrapper}>
                                <View style={styles.buttonWrapperLeft}>
                                    {leftButton}
                                </View>
                                <View style={styles.nameWrapper}>
                                    {fullname}
                                </View>
                                <View style={styles.buttonWrapperRight}>
                                    {rightButton}
                                </View>
                            </View>

                            <View style={styles.sendInviteWrapper}>
                                {greenSendInviteButton}
                            </View>
                            <Text style={styles.modalTitleSmall}>
                                Both of you can send each other invitations to catch-up every {this.props.timeToCatchUpWith[this.props.index]["relationship_days"]} days.
                                Invitations will be sent via notification or sms.
                            </Text>
                        </View>

                    </View>
                </View>
            );
        } else {
            modalContent = (
                <View>
                    <View style={styles.xWrapper}>
                        <TouchableWithoutFeedback
                            onPress={() => this.setModalVisible(false)}
                        >
                            <Icon size={20} name={"md-close-circle"} color={"#999"} />
                        </TouchableWithoutFeedback>
                    </View>
                    <View style={styles.verifiedWrapper}>
                        <View style={styles.modalTitleWrapper}>
                            <Text style={styles.modalTextNoFriends}>
                                Looks like you're all caught up with your friends for now. Tap on a new friend's name in the Relationships tab and choose how often you want to catch up with them to send an invite.
                            </Text>

                        </View>

                    </View>
                </View>
            );
        }



        let plusButton = null
        if (this.props.isLoadingPlusButton) {
            plusButton = <ActivityIndicator />
        } else {
            plusButton = (
                <TouchableOpacity onPress={() => this.checkContacts(true)}>
                    <Icon
                        size={45}
                        name="md-add-circle"
                        color={colors.orange}
                        backgroundColor="white"
                    />
                </TouchableOpacity>
            )
        }

        let friendsPlural = "friends"
        if (this.props.invitedFriends.length + this.props.invitedTextedFriends.length === 1) {
            friendsPlural = "friend"
        }

        return (
            <View style={{ flex: 1 }}>
                <StatusBar
                    barStyle="light-content"
                    backgroundColor={colors.blueColor}
                />
                <SafeAreaView style={{ backgroundColor: colors.blueColor, flex: 1 }}>

                    <Modal
                        animationType="fade"
                        transparent={true}
                        visible={this.state.modalVisible}
                        onRequestClose={() => {
                            this.setModalVisible(!this.state.modalVisible);
                        }}
                    >
                        <View style={styles.modalWrapper}>
                            <View style={styles.modal}>
                                {modalContent}
                            </View>
                        </View>
                    </Modal>

                    <View style={{ flexDirection: 'column', backgroundColor: colors.blueColor, alignItems: "center" }}>
                        <View style={{ flexDirection: 'row' }}>
                            <Text style={styles.header} >
                                Suggest times friends can choose from to schedule a call with you
                            </Text>
                        </View>
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


                    {/* <View style={styles.overlay}>
                        <Text style={styles.sendInviteText}>
                            Invite friends to schedule a call
                            </Text>
                    </View> */}
                    <View style={styles.overlay}>
                        <Text style={styles.sendInviteText}>{this.props.invitedFriends.length + this.props.invitedTextedFriends.length} {friendsPlural} invited to schedule a call</Text>
                        {plusButton}

                    </View>


                </SafeAreaView>

            </View >
        );
    }
}

const mapStateToProps = state => {
    return {
        isLoadingCalendar: state.ui.isLoadingCalendar,
        isLoadingPlusButton: state.ui.isLoadingPlusButton,
        isLoading: state.ui.isLoading,
        todaysSchedule: state.calendar.todays_schedule,
        tomorrowsSchedule: state.calendar.tomorrows_schedule,
        timeToCatchUpWith: state.upcoming.contactsToCatchUpWith,
        index: state.upcoming.contactIndex,
        invitedFriends: state.upcoming.waitingForFriends,
        invitedTextedFriends: state.upcoming.waitingForTextedFriends,
        syncedContacts: state.users.contacts,
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onGetCalendar: updateAlert => dispatch(getCalendar(updateAlert)),
        onTimeSelected: (day, id, time, status, today, tomorrow) => dispatch(timeSelected(day, id, time, status, today, tomorrow)),
        onUpdateCalendarGreen: boolean => dispatch(updateCalendarGreen(boolean)),
        onGetTimeToCatchUpList: () => dispatch(getTimeToCatchUpList()),
        onSendInvite: nameAndNumber => dispatch(sendInvite(nameAndNumber)),
        onUpdateContactIndex: number => dispatch(contactIndex(number))
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
        backgroundColor: colors.blueColor
    },
    navBarContent: {
        flex: 1,
        backgroundColor: colors.blueColor,
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
        // paddingBottom: 0,
        fontSize: Dimensions.get("window").width > 330 ? 19 : 16,
        textAlign: "center",
        fontWeight: "500",
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        backgroundColor: colors.blueColor,
        letterSpacing: 0.5,
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
        color: "#111"
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
    overlay: {
        // position: 'absolute',
        // bottom: 0,
        // flexDirection: "row",
        // height: 50,
        width: "100%",
        alignItems: "center",
        justifyContent: "center",
        backgroundColor: "#fff",
        borderTopColor: "#999",
        borderTopWidth: 0.5,
        paddingBottom: 5

    },
    sendInviteText: {
        color: "#333",
        fontSize: Dimensions.get("window").width > 330 ? 17 : 15,
        fontWeight: "600",
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        marginTop: 10,
        marginBottom: 5
    },
    modalWrapper: {
        backgroundColor: "rgba(0,0,0,0.5)",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    modal: {
        backgroundColor: "#fff",
        width: "85%",
        //height: "60%",
        borderRadius: 8,
        overflow: "hidden"
    },
    xWrapper: {
        flexDirection: "row",
        justifyContent: "flex-end",
        backgroundColor: "#FAFAFA",
        paddingRight: 5,
        paddingTop: 3
    },
    verifiedWrapper: {
        padding: 20,
        paddingTop: 0,
        backgroundColor: "#FAFAFA",
        borderRadius: 5
        //overflow: "hidden"
    },
    modalTitle: {
        textAlign: "center",
        fontSize: 21,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        fontWeight: "600",
        color: "#333"
    },
    modalTextNoFriends: {
        textAlign: "center",
        fontSize: 18,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        color: "#777",
        fontWeight: "300"
    },
    modalTitleSmall: {
        textAlign: "center",
        fontSize: 13,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        color: "#777",
        marginTop: 15,
        // paddingLeft: 20,
        // paddingRight: 20
    },
    blueName: {
        color: colors.darkBlue,
        //#ccdfff
        fontWeight: "bold",
        fontSize: Dimensions.get("window").width > 330 ? 25 : 22,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        textAlign: "center",
        // marginTop: 30
    },
    sendInviteWrapper: {
        backgroundColor: colors.greenColor,
        borderRadius: 20,
        marginTop: 30
    },
    sendInviteButtonText: {
        textAlign: "center",
        color: "#fff",
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
        padding: 8
    },
    nameButtonsWrapper: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        // padding: 5,
        marginTop: 30
        // paddingLeft: 15,
        // borderBottomWidth: 1,
        // borderBottomColor: "#eee",
        // flex: 1
    },
    buttonWrapperLeft: {
        width: "10%",
        // textAlign: "center",
        justifyContent: "flex-start",
        flexDirection: "row",
    },
    buttonWrapperRight: {
        width: "10%",
        // textAlign: "center",
        justifyContent: "flex-end",
        flexDirection: "row",
    },
    nameWrapper: {
        width: "80%"
    }

});

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Calendar);
