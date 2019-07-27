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

const listItemAdmin = props => {
  let acceptButton = null;
  let nameFormat = null;
  if (props.status == false) {
    acceptButton = (
      <TouchableOpacity onPress={props.onAccept}>
        <Text style={styles.addText}>Accept</Text>
      </TouchableOpacity>
    );
  }

  if (props.blocked) {
    nameFormat = (
      <View style={styles.listItem}>
        <Text style={styles.names}>{props.fullname}</Text>
      </View>
    );
  } else {
    nameFormat = (
      <TouchableOpacity onPress={props.onBlock} style={styles.listItem}>
        <Text style={styles.names}>{props.fullname}</Text>
      </TouchableOpacity>
    );
  }

  return (
    <View style={styles.row}>
      {/* <View style={styles.listItem}>
        <Text style={styles.names}>{props.fullname}</Text>
      </View> */}
      {nameFormat}
      <View style={styles.addWrapper}>{acceptButton}</View>
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
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  }
});

export default listItemAdmin;
