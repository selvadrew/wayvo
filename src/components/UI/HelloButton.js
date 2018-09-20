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

const helloButton = props => {
  const content = (
    <View
      elevation={5}
      style={[{ backgroundColor: props.color }, styles.button]}
    >
      <View style={styles.textSayWrapper}>
        <Text style={styles.textSay}>SAY</Text>
      </View>
      <View style={styles.textHelloWrapper}>
        <Text style={styles.textHello}>HELLO</Text>
      </View>
    </View>
  );
  if (Platform.OS === "android") {
    return (
      <TouchableNativeFeedback onPress={props.onPress}>
        {content}
      </TouchableNativeFeedback>
    );
  }
  return <TouchableOpacity onPress={props.onPress}>{content}</TouchableOpacity>;
};

const styles = StyleSheet.create({
  button: {
    borderRadius: (Dimensions.get("window").width * 0.6) / 2,
    width: Dimensions.get("window").width * 0.6,
    height: Dimensions.get("window").width * 0.6,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "#0076DF",
    shadowOffset: {
      width: 0,
      height: 3
    },
    shadowRadius: 5,
    shadowOpacity: 1.0
  },
  textSayWrapper: {
    //flex: 1,
    alignItems: "center",
    flexDirection: "row"
  },
  textSay: {
    fontSize: 40,
    color: "#333",
    alignItems: "flex-end",
    flexDirection: "row",
    fontWeight: "bold"
  },
  textHelloWrapper: {
    //flex: 1,
    alignItems: "center",
    flexDirection: "row"
  },
  textHello: {
    fontSize: 40,
    fontWeight: "bold",
    color: "#333"
  }
});

export default helloButton;
