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

const contactListItem = props => (
    <TouchableOpacity
        onPress={() => { props.onItemPressed() }}
        delayLongPress={700}
        onLongPress={() => {
            if (props.status === true) {
                props.onItemPressed()
            }
            Alert.alert(
                "",
                `Are you sure you want to delete ${props.userName} from your friends list?`,
                [
                    {
                        text: "Cancel",
                        onPress: () => { console.log("s") },
                        style: "default"
                    },
                    {
                        text: "Delete",
                        onPress: () => { props.onDeleteContactPressed() },
                        style: "destructive"
                    }
                ],
                { cancelable: true }
            );
        }}
    >
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
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
    },
    grayName: {
        color: "black",
        fontWeight: "bold",
        fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
    }
});

export default contactListItem;

