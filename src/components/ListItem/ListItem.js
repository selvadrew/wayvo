import React from "react";
import { View, Text, StyleSheet, TouchableOpacity, Image } from "react-native";

const listItem = props => (
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
  names: {
    color: "white",
    fontWeight: "bold",
    fontSize: 20
  }
});

export default listItem;
