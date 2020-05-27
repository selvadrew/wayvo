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
import Icon from "react-native-vector-icons/Ionicons";

const addButton = props => {
  const content = (
    <View style={styles.helloWrapper}>
      <Text style={styles.helloText}>{props.buttonText}</Text>
    </View>
  );
  //   if (Platform.OS === "android") {
  //     return (
  //       <TouchableNativeFeedback style={styles.button} onPress={props.onPress}>
  //         {content}
  //       </TouchableNativeFeedback>
  //     );
  //   }
  return (
    <TouchableOpacity style={styles.button} onPress={props.onPress}>
      {content}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  button: {
    borderRadius: 100,
    // height: "100%",
    // width: "100%",
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 0
  },
  addButton: {
    position: "absolute",
    backgroundColor: "white",
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    marginTop: 10,
    borderRadius: 10,
    zIndex: -100
  },
  helloWrapper: {
    backgroundColor: colors.greenColor,
    borderRadius: 20,
    flex: 1,
    alignItems: "center",
    alignSelf: "center"
  },
  helloText: {
    color: "#fff",
    fontWeight: "bold",
    margin: 8,
    alignItems: "center",
    alignSelf: "center",
    flexDirection: "row",
    fontSize: Dimensions.get("window").width > 330 ? 17 : 15,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  }
});

export default addButton;
