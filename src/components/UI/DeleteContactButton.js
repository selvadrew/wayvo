import React from "react";
import {
  TouchableOpacity,
  TouchableNativeFeedback,
  Text,
  View,
  StyleSheet,
  Platform,
  Dimensions
} from "react-native";
import colors from "../../utils/styling";

const DeleteContact = props => {
  const content = (
    <View style={styles.button}>
      <View
        style={[{ backgroundColor: props.backgroundColor }, styles.textWrapper]}
      >
        <Text style={[{ color: props.color }, styles.text]}>
          {props.children}
        </Text>
      </View>
    </View>
  );

  return <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>;
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flexDirection: "column"
    //marginTop: 50
  },
  textWrapper: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
    // borderRadius: 5,
    // borderWidth: 2,
    // borderColor: "#555"
  },
  text: {
    fontSize: 14,
    //padding: 10,
    fontWeight: "bold",
    borderColor: "#555",
    color: "gray",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  }
});

export default DeleteContact;
