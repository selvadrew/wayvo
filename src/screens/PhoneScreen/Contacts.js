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
    Alert
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";
import { saveContacts, selectContact, getContactsFromStorage } from "../../store/actions/users";


import RNContacts from 'react-native-contacts';
import { normalizeContacts, sortContacts } from "../../utils/index";

import ContactsList from "../../components/ContactsList/ContactsList";


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
        selectedContactIds: []
    };

    appSettings = () => {
        Alert.alert(
            "Please enable access to contacts to use this feature.",
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
        RNContacts.getAllWithoutPhotos((err, contacts) => {
            if (err) {
                this.appSettings()
                alert("hi")
                console.log("hi")
                // throw err;
            } else {
                console.log("worked")
                this.props.onSaveContacts(sortContacts(normalizeContacts(contacts)))
                // this.props.onSaveContacts(contacts)

            }
        })
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

    // handle the dont allow sync contacts 
    // show spinner when loading contacts 
    // add checkbox type thing 


    render() {
        let stateOfContacts = null;
        let sendInviteButton = null

        if (this.props.syncedContacts === null) {
            stateOfContacts = <Button
                onPress={() => this.getContacts()}
                title="Sync Contacts"
            />
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
                <View style={styles.overlay}>
                    <Text style={styles.sendInviteText}>Send invite to catch up</Text>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                <ScrollView >
                    <View style={styles.mainContent}>
                        <Text style={styles.header}>
                            Your selected friends will be notified and given
                            access to your calendar so they can schedule a call with you.
                            We'll let them know you want to catch up!
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
        getContactsFromStorage: () => dispatch(getContactsFromStorage())
    };
};

const mapStateToProps = state => {
    return {
        syncedContacts: state.users.contacts
    };
};

export default connect(
    mapStateToProps,
    mapDispatchToProps
)(Contacts);
