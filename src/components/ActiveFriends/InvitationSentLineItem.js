import React from "react";
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image,
    Dimensions,
    Platform,
    Alert
} from "react-native";
import colors from "../../utils/styling";

const invitationSentLineItem = props => (
    // <TouchableOpacity
    //     onPress={() => { props.onItemPressed() }}
    // >
    <View style={styles.listItem}>
        <Text style={styles.grayName}>
            {props.fullname}
        </Text>
    </View>
    // </TouchableOpacity>
);

const styles = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 8,
        paddingLeft: 15
        // borderBottomWidth: 1,
        // borderBottomColor: "#eee"
    },
    grayListItem: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 11,
        borderBottomWidth: 1,
        borderBottomColor: colors.darkBlue
    },
    names: {
        color: colors.darkBlue,
        //#ccdfff
        fontWeight: "bold",
        fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
    },
    grayName: {
        color: colors.blueColor,
        fontWeight: "bold",
        fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
    }
});

export default invitationSentLineItem;

