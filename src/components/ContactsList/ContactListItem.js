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

let list = { 7: "Weekly", 14: "2 weeks", 30: "Monthly", 60: "2 Months", 90: "3 months" }
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
        <View style={styles.listItem}>
            <View style={styles.nameWrapper}>

                <Text style={props.status === true ? styles.names : styles.grayName}>
                    {props.userName}
                </Text>

            </View>

            {/* why is it 100? see utils/index.js */}
            <View style={props.relationshipDays === 100 || props.relationshipDays === 0 ? styles.dontShow : styles.relationshipButtonView}>
                <View style={styles.relationshipButton}>
                    <Text style={styles.relationshipButtonText}>
                        {list[props.relationshipDays]}
                    </Text>
                </View>
            </View>
        </View>
    </TouchableOpacity>

);

const styles = StyleSheet.create({
    dontShow: {
        display: "none"
    },
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
        fontSize: Dimensions.get("window").width > 330 ? 19 : 17,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
    },
    grayName: {
        color: "black",
        fontWeight: "bold",
        fontSize: Dimensions.get("window").width > 330 ? 19 : 17,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    },
    nameWrapper: {
        width: "60%"
    },
    relationshipButtonView: {
        alignItems: "flex-end",
        width: "40%",
    },
    relationshipButton: {
        backgroundColor: colors.orange,
        borderRadius: 20,
        paddingLeft: 5,
        paddingRight: 5
    },
    relationshipButtonText: {
        color: "#fff",
        padding: 7,
        fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
        fontSize: 18,
    }
});

export default contactListItem;

