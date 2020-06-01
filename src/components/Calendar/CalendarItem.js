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
            <View style={[styles.standardBg, props.status === "free" ? styles.yesBg : null, props.status === "call" ? styles.callBg : null]}>
                <Text style={[styles.timeText, props.status === "call" ? styles.colorNames : null, props.status === "free" ? styles.colorNames : null]}>
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
    standardBg: {
        flexDirection: "column",
        alignItems: "center",
        width: "100%",
        padding: 11,
        borderTopWidth: 0.5,
        textAlign: "center",
        borderTopColor: "#999",
    },
    yesBg: {
        borderTopColor: colors.greenColor,
        backgroundColor: colors.greenColor
    },
    callBg: {
        borderTopColor: colors.blueColor,
        backgroundColor: colors.blueColor
    },
    colorNames: {
        color: "#fff"
    },
    grayName: {

    },
    timeText: {
        color: "#777",
        fontWeight: "bold",
        fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
    }
});

export default calendarItem;

