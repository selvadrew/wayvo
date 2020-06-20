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
import { setRelationship } from "../../store/actions/users";
import DeleteButton from "../../components/UI/DeleteContactButton";



import RNContacts from 'react-native-contacts';
import { PermissionsAndroid } from "react-native";

import { normalizeContacts, sortContacts } from "../../utils/index";

import ContactsList from "../../components/ContactsList/ContactsList";
import { Touchable } from "../../components/Touchable/Touchable";


class Relationship extends Component {

    componentWillUnmount() {
        // this.props.getContactsFromStorage()
    }

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

    state = {
        selectedContactIds: [],
        timeZone: null
    };


    relationshipSelected = (id, from_username, days) => {
        this.props.onSetRelationship(id, from_username, days)
        this.props.navigator.pop();
    }


    //id, from_username, givenName, relationship_days, last_connecte
    render() {
        clearButton = null
        noteText = null

        if (this.props.relationship_days < 100) {
            clearButton = (
                <View style={styles.deleteContainer}>
                    <DeleteButton onPress={() => this.relationshipSelected(this.props.id, this.props.from_username, 100)}>CLEAR RELATIONSHIP</DeleteButton>
                </View>
            )

        } else {
            noteText = (
                <View style={styles.noteTextWrapper}>
                    <Text style={styles.noteText}>
                        {/* When you have availability in your Calendar, invitations to catch-up are sent automatically via notification or sms */}
                    </Text>
                </View>
            )
        }

        return (
            <View style={styles.container}>
                {/* <ScrollView > */}
                <View style={styles.mainContent}>
                    <Text style={styles.header}>
                        How often do you want to catch-up with {this.props.givenName} over a phone call?
                    </Text>

                    <View style={styles.optionsWrapper}>
                        {/* 1 week */}
                        <TouchableOpacity
                            onPress={() => {
                                this.relationshipSelected(this.props.id, this.props.from_username, 7)
                            }}
                        >
                            <View style={styles.buttonWrapper}>
                                <Text style={styles.button}>Weekly</Text>
                            </View>
                        </TouchableOpacity>

                        {/* 2 week */}
                        <TouchableOpacity
                            onPress={() => {
                                this.relationshipSelected(this.props.id, this.props.from_username, 14)
                            }}
                        >
                            <View style={styles.buttonWrapper}>
                                <Text style={styles.button}>Every 2 weeks</Text>
                            </View>
                        </TouchableOpacity>

                        {/* 1 month */}
                        <TouchableOpacity
                            onPress={() => {
                                this.relationshipSelected(this.props.id, this.props.from_username, 30)
                            }}
                        >
                            <View style={styles.buttonWrapper}>
                                <Text style={styles.button}>Monthly</Text>
                            </View>
                        </TouchableOpacity>

                        {/* 2 month */}
                        <TouchableOpacity
                            onPress={() => {
                                this.relationshipSelected(this.props.id, this.props.from_username, 60)
                            }}
                        >
                            <View style={styles.buttonWrapper}>
                                <Text style={styles.button}>Every 2 months</Text>
                            </View>
                        </TouchableOpacity>

                        {/* 3 month */}
                        <TouchableOpacity
                            onPress={() => {
                                this.relationshipSelected(this.props.id, this.props.from_username, 90)
                            }}
                        >
                            <View style={styles.buttonWrapper}>
                                <Text style={styles.button}>Every 3 months</Text>
                            </View>
                        </TouchableOpacity>

                    </View>
                </View>
                {clearButton}
                {noteText}
                {/* </ScrollView> */}
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
    },
    optionsWrapper: {
        alignItems: "center",
    },
    buttonWrapper: {
        width: Dimensions.get("window").width * 0.75,
        backgroundColor: colors.orange,
        marginBottom: 20,
        alignItems: "center",
        justifyContent: "center",
        borderRadius: 20,
        // flex: 1
    },
    button: {
        padding: 10,
        fontSize: Dimensions.get("window").width > 330 ? 19 : 17,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        color: "#fff",
        // letterSpacing: 1,
        fontWeight: "700"
    },
    mainContent: {
        padding: 20
    },
    header: {
        fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
        marginBottom: 50,
        color: "#111",
        fontWeight: "600",
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        textAlign: "center"
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
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
    },
    deleteContainer: {
        flexDirection: "column",
        justifyContent: "flex-end",
        flex: 1,
        marginBottom: 20
    },
    noteTextWrapper: {
        flexDirection: "column",
        justifyContent: "flex-end",
        flex: 1,
        marginBottom: 10,
        paddingLeft: 20,
        paddingRight: 20,
        paddingBottom: 10
    },
    noteText: {
        fontSize: 15,
        // textAlign: "center"
        // flexDirection: "column",
        // justifyContent: "flex-end",
        // flex: 1,
        // marginBottom: 10,
        // padding: 10,
        // textAlignVertical: "bottom"
    }
});

const mapDispatchToProps = dispatch => {
    return {
        onSetRelationship: (id, from_username, days) => dispatch(setRelationship(id, from_username, days)),
        getContactsFromDB: () => dispatch(getContactsFromDB()),
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
)(Relationship);
