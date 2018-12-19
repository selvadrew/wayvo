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

const GotIt = props => {
  const content = (
    <View style={[styles.button]}>
      <View
        style={[
          { backgroundColor: props.backgroundColor, minWidth: props.minWidth },
          styles.textWrapper
        ]}
      >
        <Text style={[{ color: props.color }, styles.text]}>
          {props.children}
        </Text>
      </View>
    </View>
  );
  //   if (Platform.OS === "android") {
  //     return (
  //       <TouchableNativeFeedback onPress={props.onPress}>
  //         {content}
  //       </TouchableNativeFeedback>
  //     );
  //   }
  return <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>;
};

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    // height: "100%",
    // flex: 1,
    flexDirection: "column"
  },
  textWrapper: {
    // flex: 1,
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center",
    borderRadius: 40,
    minWidth: 120
  },
  text: {
    fontSize: 20,
    padding: 12,
    fontWeight: "bold",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  }
});

export default GotIt;
