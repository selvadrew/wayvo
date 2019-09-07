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

const listItemGroups = props => {
  let group_status = null;
  if (props.groupType == 1 && props.status == false) {
    group_status = (
      <TouchableOpacity
        onPress={() =>
          Alert.alert("Waiting for approval from the admin of this group")
        }
      >
        <View style={styles.grayListItem}>
          <Text style={styles.grayName}>{props.userName}</Text>
        </View>
      </TouchableOpacity>
    );
  } else {
    group_status = (
      <TouchableOpacity onPress={props.onItemPressed}>
        <View style={styles.listItem}>
          <Text style={styles.names}>{props.userName}</Text>
        </View>
      </TouchableOpacity>
    );
  }
  return <View>{group_status}</View>;
};

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
    color: "#fff",
    //#ccdfff
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  grayName: {
    color: colors.darkBlue,
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  waitingForApprovalText: {
    color: colors.yellowColor,
    fontSize: 14,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  }
});

export default listItemGroups;
