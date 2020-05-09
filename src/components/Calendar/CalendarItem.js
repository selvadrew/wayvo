import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform
} from "react-native";
import colors from "../../utils/styling";

const calendarItem = props => (

    < View style={props.status === "dont show" ? styles.dontShowView : null} >
        <TouchableOpacity onPress={props.onItemPressed}>
            <View style={props.status === "busy" ? styles.noBg : styles.yesBg}>
                <Text style={props.status === "busy" ? styles.grayName : styles.names}>
                    {props.userName}
                </Text>
            </View>
        </TouchableOpacity>
    </View >

);

const styles = StyleSheet.create({
    dontShowView: {
        display: "none"
    },
    noBg: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: 11,
        borderTopWidth: 0.5,
        borderTopColor: "#999",
        textAlign: "center",
    },
    yesBg: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: 11,
        borderTopWidth: 0.5,
        borderTopColor: colors.greenColor,
        textAlign: "center",
        backgroundColor: colors.greenColor
    },
    names: {
        color: "#fff",
        fontWeight: "bold",
        fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
        fontFamily: Platform.OS === "android" ? "Roboto" : null
    },
    grayName: {
        color: "#777",
        fontWeight: "bold",
        fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
        fontFamily: Platform.OS === "android" ? "Roboto" : null,
        textAlign: "center",

    }
});

export default calendarItem;

