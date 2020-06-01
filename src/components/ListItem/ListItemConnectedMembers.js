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

const listItemConnectedMembers = props => {
  let status = null;
  if (!props.friendStatus) {
    status = (
      <TouchableOpacity onPress={props.onItemPressed}>
        <Text style={styles.addText}>Add</Text>
      </TouchableOpacity>
    );
  }
  return (
    <View style={styles.row}>
      <View style={styles.listItem}>
        <Text style={styles.names}>{props.userName}</Text>
      </View>
      <View style={styles.addWrapper}>{status}</View>
    </View>
  );
};

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    flex: 1,
    paddingBottom: 20
  },
  addWrapper: {
    width: "35%",
    alignItems: "flex-start",
    justifyContent: "flex-end",
    flexDirection: "row"
  },
  addText: {
    backgroundColor: colors.greenColor,
    color: "#fff",
    padding: 10,
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    fontWeight: "500"
  },
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "65%"
  },

  names: {
    color: "#333",
    fontWeight: "500",
    fontSize: Dimensions.get("window").width > 330 ? 23 : 20,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
  }
});

export default listItemConnectedMembers;
