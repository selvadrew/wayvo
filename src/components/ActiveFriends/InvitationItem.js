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
import ActiveHelloButton from "../../components/UI/ActiveHelloButton";

const invitationItem = props => (
  <View onPress={props.onItemPressed}>
    <View style={styles.listItem}>
      <Text style={styles.names}>
        {props.fullname}
      </Text>
      <View style={styles.placeButton}>
        <ActiveHelloButton onPress={props.onItemPressed} buttonText="Open" />
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 11,
    // borderBottomWidth: 1,
    // borderBottomColor: "#eee",
    flex: 1
  },
  names: {
    color: "#444",
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
    width: "60%",
    marginRight: 10,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  placeButton: {
    width: "40%",
    flex: 1,
    flexDirection: "row"
  }
});

export default invitationItem;
