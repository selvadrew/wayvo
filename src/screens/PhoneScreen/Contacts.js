import React, { Component } from "react";
import {
    View,
    Text,
    StyleSheet,
    StatusBar,
    Dimensions,
    TextInput,
    ScrollView,
    ActivityIndicator,
    Platform,
    Button,
    Linking,
    Alert,
    TouchableWithoutFeedback,
    TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";
import { saveContacts, selectContact, getContactsFromStorage, sendInvite } from "../../store/actions/users";


import RNContacts from 'react-native-contacts';
import { PermissionsAndroid } from "react-native";

import { normalizeContacts, sortContacts } from "../../utils/index";

import ContactsList from "../../components/ContactsList/ContactsList";
import { Touchable } from "../../components/Touchable/Touchable";


class Contacts extends Component {

    componentWillUnmount() {
        this.props.getContactsFromStorage()
    }

    static navigatorStyle = {
        navBarHidden: false,
        statusBarColor: colors.darkBlue,
        navBarBackgroundColor: colors.darkBlue,
        navBarButtonColor: "#fff",
        navBarTextColor: "#fff"
    };
    constructor(props) {
        super(props);
    }

    state = {
        selectedContactIds: [],
        timeZone: null
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
                    this.props.onSaveContacts(sortContacts(normalizeContacts(contacts)))
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
                            this.props.onSaveContacts(sortContacts(normalizeContacts(contacts)))
                        }
                    })
                })
        }
    }


    contactSelectedHandler = id => {
        this.props.onSelectContact(id)
        this.storeSelectedContactIds(id)
    };

    storeSelectedContactIds = id => {
        const index = this.state.selectedContactIds.indexOf(id);
        if (index > -1) {
            this.state.selectedContactIds.splice(index, 1)
        } else {
            this.state.selectedContactIds.push(id)
        }

        console.log(this.state.selectedContactIds)
    }

    sendInvitePressed = () => {
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
        this.props.navigator.pop()

        console.log(newArr)
        // {fullname: "Anna Haro", phoneNumber: "555-522-8243"}
        // need to change SendNotificationToCatchUpJob in api 
    }

    // add checkbox type thing 
    render() {
        let stateOfContacts = null;
        let sendInviteButton = null

        if (this.props.syncedContacts === null) {
            if (this.props.isLoading) {
                stateOfContacts = <ActivityIndicator />;
            } else {
                stateOfContacts = <Button
                    onPress={() => this.getContacts()}
                    title="Sync Contacts"
                />
            }
        } else {
            stateOfContacts = (
                <View style={this.state.selectedContactIds.length > 0 ? styles.setMargin : null}>
                    <ContactsList
                        contacts={this.props.syncedContacts} //sending to friendslist component 
                        onItemSelected={this.contactSelectedHandler} //receiving from friendslist component 
                    />
                </View>
            )
        }

        if (this.state.selectedContactIds.length > 0) {
            sendInviteButton = (
                <Touchable onPress={() => this.sendInvitePressed()}>
                    <View style={styles.overlay}>
                        <Text style={styles.sendInviteText}>SEND INVITE TO CATCH UP</Text>
                    </View>
                </Touchable>
            )
        }

        return (
            <View style={styles.container}>
                <ScrollView >
                    <View style={styles.mainContent}>
                        <Text style={styles.header}>
                            Invite friends to view your calendar and schedule a call with you.
                            We'll send them a notification or sms to let them know you want to catch up!
                        </Text>
                        {stateOfContacts}
                    </View>
                </ScrollView>
                {sendInviteButton}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    mainContent: {
        padding: 20
    },
    header: {
        fontSize: Dimensions.get("window").width > 330 ? 16 : 14,
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
        backgroundColor: colors.orange
    },
    setMargin: {
        marginBottom: 50
    },
    sendInviteText: {
        color: "#444",
        fontSize: Dimensions.get("window").width > 330 ? 16 : 14,
        fontWeight: "600",
        fontFamily: Platform.OS === "android" ? "Roboto" : null
    }
});

const mapDispatchToProps = dispatch => {
    return {
        sendFeedback: description => dispatch(sendFeedback(description)),
        onSaveContacts: contacts => dispatch(saveContacts(contacts)),
        onSelectContact: contact => dispatch(selectContact(contact)),
        getContactsFromStorage: () => dispatch(getContactsFromStorage()),
        onSendInvite: nameAndNumber => dispatch(sendInvite(nameAndNumber))
    };
};

const mapStateToProps = state => {
    return {
        syncedContacts: state.users.contacts,
        isLoading: state.ui.isLoading
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Contacts);
