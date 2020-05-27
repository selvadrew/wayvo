import React, { Component } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text,
    Platform,
    ScrollView,
    TouchableWithoutFeedback,
    RefreshControl,
    Button,
    StatusBar,
    TouchableNativeFeedback,
    Linking,
    Dimensions,
    SafeAreaView,
    Alert,
    NetInfo,
    Image,
    Animated,
    Modal,
    TouchableHighlight,
    TouchableOpacity
} from "react-native";
import HelloButton from "../../components/UI/HelloButton";
import ChangeTime from "../../components/UI/ChangeTimeButton";
import { connect } from "react-redux";
import {
    outgoingCall,
    storeLastCall,
    resetLastCall
} from "../../store/actions/outgoingCalls";
import { outgoingGroupCall } from "../../store/actions/groups";
import { outgoingCustomGroupCall } from "../../store/actions/customGroups";
import { getActiveFriends } from "../../store/actions/activeFriends";
import { getActivePlans } from "../../store/actions/activePlans";
import { getFriendRequests } from "../../store/actions/friends";
import { getPhoneNumber, getUserInfo, getContactsFromDB, saveTimeZone, saveContactByUsername, deleteContact } from "../../store/actions/users";
import {
    getUserGroups,
    checkIfUserLiveGroups
} from "../../store/actions/groups";
import { setGroupForPlan } from "../../store/actions/plans";
import colors from "../../utils/styling";
import CountDown from "react-native-countdown-component";

import firebase from "react-native-firebase";
import SplashScreen from "react-native-splash-screen";
import Icon from "react-native-vector-icons/Ionicons";
import GotIt from "../../components/UI/GotItButton";
import { AsyncStorage } from "react-native";
import ModalGroupsList from "../../components/GroupsList/ModalGroupsList";
import { getActiveGroups } from "../../store/actions/activeGroups";

import { savePhoneContacts, selectContact, sendInvite } from "../../store/actions/users";
import RNContacts from 'react-native-contacts';
import { PermissionsAndroid } from "react-native";

import { normalizeContacts, sortContacts } from "../../utils/index";

import ContactsList from "../../components/ContactsList/ContactsList";
import { Touchable } from "../../components/Touchable/Touchable";
import DialogInput from 'react-native-dialog-input';


import * as RNLocalize from "react-native-localize";
import { getCalendar } from "../../store/actions/calendars";


class Invite extends Component {
    componentDidMount() {
        const channel = new firebase.notifications.Android.Channel(
            "Friends",
            "Friends Say Hello",
            firebase.notifications.Android.Importance.Max
        ).setDescription("Friends Say Hello");
        firebase.notifications().android.createChannel(channel);

        // the listener returns a function you can use to unsubscribe
        this.unsubscribeFromNotificationListener = firebase
            .notifications()
            .onNotification(notification => {
                if (Platform.OS === "android") {
                    const localNotification = new firebase.notifications.Notification({
                        sound: "default",
                        show_in_foreground: true
                    })
                        .setNotificationId(notification.notificationId)
                        .setTitle(notification.title)
                        .setSubtitle(notification.subtitle)
                        .setBody(notification.body)
                        .setData(notification.data)
                        //.setVisibility(notification.VISIBILITY_PUBLIC)
                        .android.setAutoCancel(true)
                        .android.setShowWhen(true)
                        .android.setChannelId("Friends") // e.g. the id you chose above
                        .android.setSmallIcon("@mipmap/small_launcher")
                        //.android.setLargeIcon("@mipmap/ic_launcher")
                        .android.setColor(colors.greenColor) // you can set a color here
                        .android.setPriority(firebase.notifications.Android.Priority.High);

                    firebase
                        .notifications()
                        .displayNotification(localNotification)
                        .catch(err => console.error(err));
                } else if (Platform.OS === "ios") {
                    const localNotification = new firebase.notifications.Notification()
                        //.setNotificationId(notification.notificationId)
                        .setTitle(notification.title)
                        // .setSubtitle(notification.subtitle)
                        .setBody(notification.body)
                        .setData(notification.data)
                        .ios.setBadge(notification.ios.badge);

                    firebase
                        .notifications()
                        .displayNotification(localNotification)
                        .catch(err => console.error(err));
                }
            });

        // listen for notifications
        this.notificationDisplayedListener = firebase
            .notifications()
            .onNotificationDisplayed((notification: Notification) => {
                //listens for notifications
                // Process your notification as required
                // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
                this.props.onLoadActiveFriends();
                this.props.onLoadActivePlans();
                this.props.onLoadActiveGroups();
            });
        this.notificationListener = firebase
            .notifications()
            .onNotification((notification: Notification) => {
                //listens for notifications
                // Process your notification as required
            });

        // notification opened listener in foreground/app running
        this.notificationOpenedListener = firebase
            .notifications()
            .onNotificationOpened((notificationOpen: NotificationOpen) => {
                // Get the action triggered by the notification being opened
                const action = notificationOpen.action;
                // Get information about the notification that was opened
                const notification: Notification = notificationOpen.notification;
                this.props.onLoadActiveFriends();
                this.props.onLoadActivePlans();
                this.props.onLoadActiveGroups();
                console.log(action);

                //outgoing call notification
                if (notification.data.outgoing) {
                    this.props.navigator.switchToTab({
                        tabIndex: 3
                    });
                }

                // friend request notification
                if (notification.data.friend) {
                    this.props.navigator.switchToTab({
                        tabIndex: 1
                    });
                    this.props.onLoadFriendRequests();
                }

                // group tab notification
                if (notification.data.group) {
                    this.props.navigator.switchToTab({
                        tabIndex: 2
                    });
                    this.props.getUserGroups();
                }

                // someone accepted say hello
                if (notification.data.expect_call) {
                    this.props.navigator.switchToTab({
                        tabIndex: 0
                    });
                    this.props.getLastCall();
                    Alert.alert(`Expect a call shortly. A friend Said Hello Back!`);
                }

                if (notification.data.expect_group_call) {
                    this.props.navigator.switchToTab({
                        tabIndex: 0
                    });
                    this.props.checkIfUserLiveGroups();
                    Alert.alert("Expect a call shortly. Someone Said Hello Back!");
                }
            });

        /// app closed
        firebase
            .notifications()
            .getInitialNotification()
            .then((notificationOpen: NotificationOpen) => {
                if (notificationOpen) {
                    // App was opened by a notification
                    // Get the action triggered by the notification being opened
                    const action = notificationOpen.action;
                    // Get information about the notification that was opened
                    const notification: Notification = notificationOpen.notification;

                    //outgoing call notification
                    if (notification.data.outgoing) {
                        this.props.navigator.switchToTab({
                            tabIndex: 3
                        });
                    }

                    // friend request notification
                    if (notification.data.friend) {
                        this.props.navigator.switchToTab({
                            tabIndex: 1
                        });
                        this.props.onLoadFriendRequests();
                    }

                    // group tab notification
                    if (notification.data.group) {
                        this.props.navigator.switchToTab({
                            tabIndex: 2
                        });
                        this.props.getUserGroups();
                    }

                    // someone accepted say hello
                    if (notification.data.expect_call) {
                        this.props.navigator.switchToTab({
                            tabIndex: 0
                        });
                        this.props.getLastCall();
                        Alert.alert(`Expect a call shortly. A friend Said Hello Back!`);
                    }

                    if (notification.data.expect_group_call) {
                        this.props.navigator.switchToTab({
                            tabIndex: 0
                        });
                        this.props.checkIfUserLiveGroups();
                        Alert.alert("Expect a call shortly. Someone Said Hello Back!");
                    }
                }
            })
            .catch(err => alert(err));

        // this.props.getLastCall();
        this.props.checkIfUserLiveGroups();
        //this.props.storePhoneNumber();
        if (Platform.OS === "ios") {
            this.props.getUserInfo(true);
        } else {
            this.props.getUserInfo(false);
        }

        if (Platform.OS === "ios") {
            setTimeout(() => {
                SplashScreen.hide();
            }, 2500);
        }

        this.props.getUserGroups();

        // alert(Dimensions.get("window").height);

        this.props.getContactsFromDB()

        //check if users timezone is saved in async
        // this is run in auth tab too so we can load calendar accordingly on sign up 
        // this is run here too in case user changes time zone when phone is opened up
        // if not saved, get it and save in db 
        // RNLocalize.getTimeZone()
        AsyncStorage.getItem("timezone").then(timeZone => {
            currentTimeZone = RNLocalize.getTimeZone()
            timeZoneOffset = new Date().getTimezoneOffset() / -1
            if (timeZone !== currentTimeZone) {
                this.props.onSaveTimeZone(currentTimeZone, timeZoneOffset)
                AsyncStorage.setItem("timezone", currentTimeZone);
            }
        })

    } //did mount end

    appSettings = () => {
        Linking.openURL("app-settings:");
        // change tab so when they come back, it refreshes
        this.props.navigator.switchToTab({
            tabIndex: 1
        });
    };

    componentWillUnmount() {
        //listen for notifications
        this.notificationDisplayedListener();
        this.notificationListener();

        //notification opened listener
        this.notificationOpenedListener();

        // this is where you unsubscribe
        this.unsubscribeFromNotificationListener();
    }

    optionScreen = () => {
        this.props.navigator.push({
            screen: "awesome-places.OptionScreen",
            backButtonTitle: "",
            passProps: {
                fullname: this.props.fullname,
                username: this.props.username,
                phone_number: this.props.phone_number
            }
        });
    };

    howItWorksScreen = () => {
        this.props.navigator.push({
            screen: "awesome-places.HowItWorks",
            //title: "How it Works",
            backButtonTitle: "",
            passProps: {
                username: this.props.username,
                phone_number: this.props.phone_number,
                ios: this.props.ios
            }
        });

    };

    static navigatorStyle = {
        navBarHidden: true,
        navBarBackgroundColor: "#0088CA",
        statusBarColor: "#0088CA"
    };

    constructor(props) {
        super(props);
    }

    state = {
        selectedContactIds: [],
        timeZone: null,
        isDialogVisible: false
    };

    appSettings = () => {
        Alert.alert(
            "Please give Wayvo access to your contacts in app settings to use this feature",
            "",
            [
                {
                    text: "Open app settings",
                    onPress: () => Linking.openURL("app-settings:")
                },
                {
                    text: "Cancel",
                    onPress: () => console.log("cancel")
                }

            ],
            { cancelable: true }
        );
    };

    //Alert.alert("Protip", "Press and hold on a contact to delete")
    onAddPersonButton = () => {
        if (Platform.OS === 'ios') {
            Alert.alert(
                "How would you like to add your friends?",
                "",
                [
                    {
                        text: "Sync from contact list",
                        onPress: () => this.getContacts()
                    },
                    {
                        text: "Add by username",
                        onPress: () => {
                            if (Platform.OS === "ios") {
                                Alert.prompt(
                                    "Enter your friend's Wayvo username",
                                    "",
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel Pressed"),
                                            // style: "cancel"
                                        },
                                        {
                                            text: "Add",
                                            onPress: textInput => this.props.onAddFriend(textInput)
                                        }
                                    ],
                                )
                            } else {
                                this.setState({
                                    isDialogVisible: true
                                })
                            }
                        }
                    },
                    {
                        text: "Cancel",
                        onPress: () => console.log("cancelled"),
                        style: "default"
                    }
                ],
                { cancelable: true }
            );
        } else {
            Alert.alert(
                "How would you like to add your friends?",
                "",
                [
                    {
                        text: "Add by username",
                        onPress: () => {
                            if (Platform.OS === "ios") {
                                Alert.prompt(
                                    "Enter your friend's Wayvo username",
                                    "",
                                    [
                                        {
                                            text: "Cancel",
                                            onPress: () => console.log("Cancel Pressed"),
                                            // style: "cancel"
                                        },
                                        {
                                            text: "Add",
                                            onPress: textInput => this.props.onAddFriend(textInput)
                                        }
                                    ],
                                )
                            } else {
                                this.setState({
                                    isDialogVisible: true
                                })
                            }
                        }
                    },
                    {
                        text: "Sync from contact list",
                        onPress: () => this.getContacts()
                    }
                ],
                { cancelable: true }
            );
        }
    }


    getContacts = () => {
        if (Platform.OS === "ios") {
            RNContacts.getAllWithoutPhotos((err, contacts) => {
                if (err) {
                    // show alert menu that goes to app settings
                    this.appSettings()
                    console.log(err)
                    // throw err;
                } else {
                    console.log("contacts worked")
                    this.props.onSavePhoneContacts(contacts)
                }
            })
        } else {
            PermissionsAndroid.request(PermissionsAndroid.PERMISSIONS.READ_CONTACTS,
                {
                    'title': 'Sync Contacts',
                    'message': 'Allow Wayvo to load your contacts to use this feature',
                    'buttonPositive': 'OK'
                }).then(() => {
                    RNContacts.getAll((err, contacts) => {
                        if (err === 'denied') {
                            alert("permissionDenied")
                            // error
                        } else {
                            this.props.onSavePhoneContacts(contacts)
                        }
                    })
                })
        }
    }


    contactSelectedHandler = id => {
        this.props.onSelectContact(id)
        // this.storeSelectedContactIds(id)
    };

    // storeSelectedContactIds = id => {
    //     const index = this.props.selectedContactIds.indexOf(id);
    //     if (index > -1) {
    //         this.props.selectedContactIds.splice(index, 1)
    //     } else {
    //         this.props.selectedContactIds.push(id)
    //     }
    // }

    onDeleteContact = (id, from_username) => {
        this.props.removeContact(id, from_username)
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

        if (this.props.selectedContactIds.length > count) {
            alert("pick more dude")
            this.props.onGetCalendar(false)
        } else {
            // double check contact is selected - there is a bug with longpress in contactlistitem.js 
            if (this.props.selectedContactIds.length > 0) {
                // check contact is selected and create format to send to backend 
                let arr = []
                let newArr = []
                this.props.syncedContacts.forEach(function (contact) {
                    if (contact.selected) {
                        fullname = contact.givenName + " " + contact.familyName
                        contact.phoneNumbers.forEach(function (details) {
                            arr.push(details.number)
                            newArr.push({ fullname: fullname, phoneNumber: details.number })
                        });
                    }
                });
                this.props.onSendInvite(newArr)

                console.log(this.props.selectedContactIds)
            } else {
                Alert.alert("", "Please select at least one friend to send an invite to")
            }

        }

        // {fullname: "Anna Haro", phoneNumber: "555-522-8243"}
        // need to change SendNotificationToCatchUpJob in api 
    }



    render() {
        let stateOfContacts = null;
        let sendInviteButton = null

        if (this.props.isLoadingFriends) {
            stateOfContacts = <ActivityIndicator />;
        } else {
            if (this.props.syncedContacts.length === 0) {
                stateOfContacts = <Button
                    onPress={() => this.getContacts()}
                    title="Sync Contacts"
                />
            } else {
                stateOfContacts = (
                    <View style={this.props.selectedContactIds.length > 0 ? styles.setMargin : null}>
                        <ContactsList
                            contacts={this.props.syncedContacts} //sending to friendslist component 
                            onItemSelected={this.contactSelectedHandler} //receiving from friendslist component 
                            onDeleteContactSelected={this.onDeleteContact}
                        />
                    </View>
                )
            }
        }


        if (this.props.selectedContactIds.length > 0) {
            if (this.props.isLoading) {
                sendInviteButton = (
                    <View style={styles.overlay}>
                        <Text style={styles.sendInviteText}>SENDING...</Text>
                    </View>
                )
            } else {
                sendInviteButton = (
                    <Touchable onPress={() => this.sendInvitePressed()}>
                        <View style={styles.overlay}>
                            <Text style={styles.sendInviteText}>SEND INVITE TO CATCH UP</Text>
                        </View>
                    </Touchable>
                )
            }
        }

        return (
            <View
                contentContainerStyle={{ flexGrow: 1 }}
                style={styles.container}
            // refreshControl={
            //     <RefreshControl
            //         refreshing={this.props.isLoading}
            //         onRefresh={() => {
            //             // this.props.getLastCall();
            //             // this.props.checkIfUserLiveGroups();
            //         }}
            //     />
            // }
            >
                <StatusBar barStyle="light-content" backgroundColor={colors.blueColor} />
                <SafeAreaView style={{ flex: 1, backgroundColor: colors.blueColor }}>

                    <DialogInput isDialogVisible={this.state.isDialogVisible}
                        title={"Enter your friend's Wayvo username"}
                        // message={""}
                        hintInput={""}
                        submitInput={inputText => {
                            this.props.onAddFriend(inputText)
                            this.setState({
                                isDialogVisible: false
                            })
                        }}
                        closeDialog={() => {
                            this.setState({
                                isDialogVisible: false
                            })
                        }}
                        textInputProps={{ autoCorrect: false, autoCapitalize: false }}
                        dialogStyle={{
                            opacity: 1,
                            // backgroundColor: "red"
                        }}
                    >
                    </DialogInput>


                    <View style={styles.navBarWrapper}>
                        <View style={styles.navBarContent}>
                            <View style={styles.usernameView}>
                                <TouchableWithoutFeedback
                                    style={styles.usernameButton}
                                    onPress={() => this.optionScreen()}
                                >
                                    <View style={{ paddingLeft: 15, padding: 10 }}>
                                        {/* <Text style={styles.usernameText}>Wayvo</Text> */}
                                        <Icon
                                            size={30}
                                            name={Platform.OS === "ios" ? "md-menu" : "md-menu"}
                                            color="#f5f5f5"
                                        //color={colors.yellowColor}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>

                            <View style={styles.infoButton}>
                                <TouchableWithoutFeedback
                                    style={styles.usernameButton}
                                    onPress={() => this.onAddPersonButton()}
                                >
                                    <View style={{ paddingLeft: 15, padding: 10 }}>
                                        <Icon
                                            size={30}
                                            name={
                                                Platform.OS === "ios"
                                                    ? "md-person-add"
                                                    : "md-person-add"
                                            }
                                            color="#f5f5f5"
                                        //color={colors.yellowColor}
                                        />
                                    </View>
                                </TouchableWithoutFeedback>
                            </View>
                        </View>
                    </View>
                    <ScrollView style={styles.container2}>

                        <View style={styles.mainContent}>
                            <Text style={styles.header}>
                                Invite friends to view your calendar and schedule a call.
                                Wayvo will send them a notification or sms to let them know you want to catch up!
                                {/* with a link to your calendar */}
                            </Text>
                            {stateOfContacts}
                        </View>

                    </ScrollView>

                    {sendInviteButton}
                </SafeAreaView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        // backgroundColor: "#0088CA"
        backgroundColor: "#fff"
    },
    // begin styling from old contacts 
    mainContent: {
        padding: 20
    },
    header: {
        fontSize: Dimensions.get("window").width > 330 ? 14 : 13,
        marginBottom: 10,
        color: "#444",
        fontWeight: "600",
        fontFamily: Platform.OS === "android" ? "Roboto" : null
        //fontWeight: "bold"
    },
    overlay: {
        position: 'absolute',
        bottom: 0,
        flexDirection: "column",
        height: 40,
        width: "100%",
        alignItems: "center",
        padding: 10,
        backgroundColor: colors.greenColor
    },
    setMargin: {
        marginBottom: 50
    },
    sendInviteText: {
        color: "#fff",
        fontSize: Dimensions.get("window").width > 330 ? 16 : 14,
        fontWeight: "600",
        fontFamily: Platform.OS === "android" ? "Roboto" : null
    },
    // end styling from old contacts 

    modalWrapper: {
        backgroundColor: "rgba(0,0,0,0.7)",
        flex: 1,
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center"
    },
    closeButtonWrapper: {
        alignContent: "flex-end"
    },
    notVerifiedWrapper: {
        padding: 20,
        paddingTop: 0,
        backgroundColor: "#FAFAFA"
    },
    verifiedWrapper: {
        padding: 20,
        paddingTop: 0,
        backgroundColor: "#FAFAFA",
        borderRadius: 5
        //overflow: "hidden"
    },
    xWrapper: {
        flexDirection: "row",
        justifyContent: "flex-end",
        backgroundColor: "#FAFAFA",
        paddingRight: 5,
        paddingTop: 3
    },
    modalTitleWrapper: {
        borderBottomWidth: 1,
        borderBottomColor: "#777"
    },
    modalTitle: {
        fontSize: 20,
        fontFamily: Platform.OS === "android" ? "Roboto" : null,
        letterSpacing: 0.5,
        paddingBottom: 8,
        color: "#333",
        fontWeight: "700",
        textAlign: "center"
    },
    modal: {
        backgroundColor: "#fff",
        width: "85%",
        //height: "60%",
        borderRadius: 8,
        overflow: "hidden"
    },
    selectionBox: {
        margin: 10,
        borderWidth: 0,
        borderColor: colors.pinkColor,
        width: "80%",
        //height: "80%",
        maxHeight: 120,
        flex: 1,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        borderRadius: 10,
        overflow: "hidden"
    },
    leftBox: {
        height: "100%",
        width: "25%",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        borderRightColor: "#fff",
        borderRightWidth: 0.5
        //backgroundColor: colors.pinkColor
    },
    selectionBox1: {
        backgroundColor: colors.pinkColor
        // backgroundColor: "rgb(255, 90, 95)"
    },
    selectionBox2: {
        backgroundColor: colors.greenColor
    },
    rightBox1: {
        height: "100%",
        width: "75%",
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: "center"
        backgroundColor: colors.blueColor
    },
    rightBox2: {
        height: "100%",
        width: "75%",
        flexDirection: "column",
        justifyContent: "center",
        // alignItems: "center"
    },
    orange: {
        backgroundColor: colors.orange
    },
    green: {
        backgroundColor: colors.greenColor
    },
    red: {
        backgroundColor: "#ff6159"
    },
    default: {
        backgroundColor: colors.blueColor
    },
    goPink: {
        backgroundColor: colors.pinkColor
        //backgroundColor: "#ff7227"
    },
    goGreen: {
        backgroundColor: colors.greenColor
    },
    rightText: {
        fontSize: 28,
        color: "#fff",
        letterSpacing: 1,
        fontWeight: Platform.OS === "ios" ? "700" : "600",
        paddingHorizontal: 15,
        fontFamily: Platform.OS === "android" ? "Roboto" : null
    },
    rightText1: {
        fontSize: 28,
        color: "#fff",
        letterSpacing: 1,
        fontWeight: Platform.OS === "ios" ? "700" : "600",
        paddingHorizontal: 15,
        fontFamily: Platform.OS === "android" ? "Roboto" : null
    },
    newHelloWrapper: {
        flex: 1,
        justifyContent: "flex-end",
        marginBottom: 5,
        width: "100%"
    },
    navBarWrapper: {
        height: 70,
        backgroundColor: colors.blueColor
    },
    navBarContent: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row",
        height: "100%",
        width: "100%"
    },
    infoButton: {
        flex: 1,
        justifyContent: "flex-end",
        flexDirection: "row",
        //marginTop: Platform.OS === "ios" ? 20 : 0,
        paddingRight: 5
    },
    container2: {
        flex: 1,
        paddingBottom: 10,
        backgroundColor: "#Fff"
    },
    hello: {
        alignItems: "center",
        justifyContent: "center",
        flex: 2,
        width: "100%",
        marginTop: 10
    },
    helloDescription: {
        position: "absolute",
        //justifyContent: "center",
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.90)",
        width: "100%",
        justifyContent: "flex-end",
        height:
            Platform.OS === "ios"
                ? 80 + (Dimensions.get("window").height * 2) / 9
                : 60 + (Dimensions.get("window").height * 2) / 9
    },
    learnMore: {
        position: "absolute",
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.90)",
        width: "100%",
        height: "100%",
        justifyContent: "flex-start",
        marginTop: 80,
        textAlign: "right"
    },
    tapDescription: {
        position: "absolute",
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.90)",
        marginTop:
            Platform.OS === "ios"
                ? 75 + (Dimensions.get("window").height * 2) / 9
                : 55 + (Dimensions.get("window").height * 2) / 9,
        width: "100%",
        height: "100%"
    },
    navCover: {
        position: "absolute",
        //justifyContent: "center",
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.9)",
        width: "100%",
        height: 70
    },
    helloBottomCover: {
        position: "absolute",
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.90)",
        marginTop:
            Platform.OS === "ios"
                ? 90 +
                (Dimensions.get("window").height * 2) / 9 +
                Dimensions.get("window").width * 0.6
                : 70 +
                (Dimensions.get("window").height * 2) / 9 +
                Dimensions.get("window").width * 0.6,
        width: "100%",
        height: "100%"
    },
    firstHello: {
        alignItems: "center"
    },
    showTapText: {
        color: "#fff",
        fontSize: 25,
        textAlign: "center",
        padding: 5,
        fontWeight: "500"
    },
    learnTapText: {
        color: "#fff",
        fontSize: 25,
        textAlign: "right",
        fontWeight: "500",
        paddingRight: 15
    },
    endTour: {
        flex: 1,
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "column",
        position: "absolute",
        //justifyContent: "center",
        zIndex: 100,
        backgroundColor: "rgba(0,0,0,0.92)",
        width: "100%",
        height: "100%"
    },
    tourText: {
        color: "#FFF",
        fontSize: 30,
        fontWeight: "800",
        marginBottom: 40
    },
    usernameWrapper: {
        width: "100%",
        flex: 1,
        marginTop: 50
        // alignItems: "center",
        // justifyContent: "center",
        // flexDirection: "column"
    },
    youActive: {
        color: "#fff",
        fontSize: Dimensions.get("window").width > 330 ? 40 : 35,
        fontWeight: "900",
        backgroundColor: colors.greenColor,
        padding: 15,
        paddingVertical: 5,
        textAlign: "center",
        fontFamily: Platform.OS === "android" ? "Roboto" : null
    },
    timeExplanation: {
        color: "#fff",
        fontSize: Dimensions.get("window").width > 330 ? 17 : 17,
        textAlign: "center",
        fontFamily: Platform.OS === "android" ? "Roboto" : null,
        paddingHorizontal: 15
    },
    timeExplanationBig: {
        color: "#fff",
        fontSize: Dimensions.get("window").width > 330 ? 19 : 17,
        textAlign: "center",
        fontFamily: Platform.OS === "android" ? "Roboto" : null,
        paddingHorizontal: 20
    },
    countdown: {
        marginTop: 40
    },
    usernameView: {
        flex: 1,
        justifyContent: "flex-start",
        //alignSelf: "flex-start",
        flexDirection: "row"
    },
    usernameText: {
        fontSize: 25,
        fontFamily: Platform.OS === "android" ? "Roboto" : null,
        color: "#fff",
        //marginTop: Platform.OS === "ios" ? 20 : 0,
        padding: 10,
        fontWeight: "800",
        letterSpacing: 1
    },
    usernameStyle: {
        color: colors.usernameColor,
        fontWeight: "bold",
        fontFamily: Platform.OS === "android" ? "Roboto" : null,
        fontSize: 40
        //marginTop: Platform.OS === "ios" ? 20 : 0
    },
    button: {
        alignItems: "center",
        justifyContent: "center",
        flexDirection: "row"
    },
    wrapper: {
        flex: 4,
        flexDirection: "column",
        alignItems: "center",
        alignSelf: "center",
        width: "100%"
    },
    timeWrapper: {
        //borderRadius: 3,
        backgroundColor: colors.blueColor,
        //backgroundColor: "#222",
        //backgroundColor: "#0b68bd",
        paddingRight: 8,
        paddingLeft: 8,
        paddingTop: 20,
        paddingBottom: 10,
        //borderColor: "rgba(1,125,185,0.3)",
        width: "100%"
    },
    timeText: {
        fontSize: Dimensions.get("window").width > 330 ? 23 : 19,
        fontWeight: "400",
        //color: "#333",
        color: "#fff",
        backgroundColor: colors.blueColor,
        textAlign: "center",
        letterSpacing: Dimensions.get("window").width > 330 ? 0.9 : 0.6,
        fontFamily: Platform.OS === "android" ? "Roboto" : null
    },
    timeNumber: {
        //color: colors.yellowColor,
        fontSize: Dimensions.get("window").width > 330 ? 21 : 18,
        fontWeight: "700",
        letterSpacing: Dimensions.get("window").width > 330 ? 0.9 : 0.6,
        fontFamily: Platform.OS === "android" ? "Roboto" : null
    },
    timeNumberSelect: {
        color: "#555",
        fontWeight: "900",
        fontSize: Dimensions.get("window").width > 330 ? 20 : 17,
        fontFamily: Platform.OS === "android" ? "Roboto" : null,
        backgroundColor: colors.yellowColor
    },
    connectedWrapper: {
        flex: 3,
        justifyContent: "flex-end"
    },
    lastConnected: {
        color: "#797E88",
        fontSize: 16,
        textAlign: "center",
        fontFamily: Platform.OS === "android" ? "Roboto" : null,
        marginTop: 5
    },
    notificationText: {
        color: "#fff",
        fontSize: Dimensions.get("window").width > 330 ? 20 : 16,
        textAlign: "center",
        fontWeight: "400",
        letterSpacing: 0.5,
        fontFamily: Platform.OS === "android" ? "Roboto" : null
    },
    notificationHere: {
        color: colors.greenColor,
        fontSize: Dimensions.get("window").width > 330 ? 20 : 17,
        fontWeight: "700",
        textAlign: "center",
        letterSpacing: 0.5,
        fontFamily: Platform.OS === "android" ? "Roboto" : null
    },
    activeInfo: {
        color: "#fff",
        fontSize: Dimensions.get("window").width > 330 ? 16 : 14,
        fontFamily: Platform.OS === "android" ? "Roboto" : null,
        fontWeight: "400"
        //textAlign: "center"
    },
    connectedName: {
        color: colors.greenColor,
        fontSize: 20,
        fontWeight: "900",
        textAlign: "center",
        fontFamily: Platform.OS === "android" ? "Roboto" : null
    },
    weeklyWrapper: {
        //margin: 10,
        borderWidth: 0,
        backgroundColor: "#fff",
        width: "100%",
        //height: "80%",
        maxHeight: 50,
        flex: 1,
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        borderRadius: 0,
        overflow: "hidden"
    },
    weeklyText: {
        fontSize: 20
    },
    pizza: {
        transform: [{ rotate: '180deg' }]
    }
});

const mapStateToProps = state => {
    return {
        isLoadingHello: state.ui.isLoadingHello,
        isLoading: state.ui.isLoading,
        seconds_left: state.outgoing.seconds_left,
        can_say_hello: state.outgoing.can_say_hello,
        connected_with: state.outgoing.connected_with,
        username: state.users.username,
        fullname: state.users.fullname,
        phone_number: state.users.phoneNumber,
        ios: state.users.ios,
        verified: state.users.verified,
        submitted: state.users.submitted,
        groups: state.groups.userGroups,
        // youLiveGroups: state.ui.groups
        seconds_left_groups: state.groups.seconds_left_groups,
        can_say_hello_groups: state.groups.can_say_hello_groups,

        syncedContacts: state.users.contacts,
        isLoading: state.ui.isLoading,
        isLoadingFriends: state.ui.isLoadingFriends,
        todaysSchedule: state.calendar.todays_schedule,
        tomorrowsSchedule: state.calendar.tomorrows_schedule,
        selectedContactIds: state.users.selectedContactIds
    };
};

const mapDispatchToProps = dispatch => {
    return {
        onOutgoingCall: seconds => dispatch(outgoingCall(seconds)),
        onOutgoingGroupCall: programId => dispatch(outgoingGroupCall(programId)),
        onOutgoingCustomGroupCall: customGroupId =>
            dispatch(outgoingCustomGroupCall(customGroupId)),
        onLoadActiveFriends: () => dispatch(getActiveFriends()),
        onLoadActivePlans: () => dispatch(getActivePlans()),
        onLoadActiveGroups: () => dispatch(getActiveGroups()),
        onLoadFriendRequests: () => dispatch(getFriendRequests()),
        getLastCall: () => dispatch(storeLastCall()),
        onResetLastCall: () => dispatch(resetLastCall()),
        storePhoneNumber: () => dispatch(getPhoneNumber()),
        getUserInfo: ios => dispatch(getUserInfo(ios)),
        getUserGroups: () => dispatch(getUserGroups()),
        checkIfUserLiveGroups: () => dispatch(checkIfUserLiveGroups()),
        onSetGroupForPlan: (id, value, type) =>
            dispatch(setGroupForPlan(id, value, type)),
        onSaveTimeZone: (timeZone, timeZoneOffset) => dispatch(saveTimeZone(timeZone, timeZoneOffset)),

        onSavePhoneContacts: contacts => dispatch(savePhoneContacts(contacts)),
        onSelectContact: contact => dispatch(selectContact(contact)),
        getContactsFromDB: () => dispatch(getContactsFromDB()),
        onSendInvite: nameAndNumber => dispatch(sendInvite(nameAndNumber)),
        onAddFriend: username => dispatch(saveContactByUsername(username)),
        removeContact: (id, from_username) => dispatch(deleteContact(id, from_username)),
        onGetCalendar: updateAlert => dispatch(getCalendar(updateAlert)),
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Invite);
