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

const contactListItem = props => (
    <TouchableOpacity onPress={() => {
        props.onItemPressed()
    }}>
        <View style={props.status === true ? styles.listItem : styles.listItem}>
            <Text style={props.status === true ? styles.names : styles.grayName}>
                {props.userName}
            </Text>
        </View>
    </TouchableOpacity>
);

const styles = StyleSheet.create({
    listItem: {
        flexDirection: "row",
        alignItems: "center",
        width: "100%",
        padding: 11,
        borderBottomWidth: 1,
        borderBottomColor: "#eee"
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
        fontFamily: Platform.OS === "android" ? "Roboto" : null
    },
    grayName: {
        color: "#333",
        fontWeight: "bold",
        fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
        fontFamily: Platform.OS === "android" ? "Roboto" : null
    }
});

export default contactListItem;

