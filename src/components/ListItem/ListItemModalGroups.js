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

const listItemModalGroups = props => {
  let group_status = null;
  if (props.status) {
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
    paddingTop: 15,
    paddingBottom: 5
    //borderBottomWidth: 1,
    //borderBottomColor: "#eee"
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
    fontWeight: "500",
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  grayName: {
    color: colors.darkBlue,
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  }
});

export default listItemModalGroups;
