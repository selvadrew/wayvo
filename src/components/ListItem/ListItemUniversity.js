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

const listItemUniversity = props => (
  <TouchableOpacity onPress={props.onItemPressed}>
    <View style={styles.listItem}>
      <Text style={styles.names}>{props.userName}</Text>
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
    color: "#fff",
    //#ccdfff
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width > 330 ? 18 : 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
  },
  grayName: {
    color: colors.darkBlue,
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
  }
});

export default listItemUniversity;
