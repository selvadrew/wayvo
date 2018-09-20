import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";
import colors from "../../utils/styling";
import ActiveHelloButton from "../../components/UI/ActiveHelloButton";

const activeList = props => (
  <View onPress={props.onItemPressed}>
    <View style={styles.listItem}>
      <Text style={styles.names}>{props.userName}</Text>
      <View style={styles.placeButton}>
        <ActiveHelloButton onPress={props.onItemPressed} />
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
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
    flex: 1
  },
  names: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20,
    width: "60%"
  },
  placeButton: {
    width: "40%",
    flex: 1,
    flexDirection: "row"
  }
});

export default activeList;
