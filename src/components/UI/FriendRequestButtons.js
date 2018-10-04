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

const FriendRequestButton = props => {
  const content = (
    <View style={[{ backgroundColor: props.backgroundColor }, styles.button]}>
      <View style={styles.textWrapper}>
        <Text style={[{ color: props.color }, styles.text]}>
          {props.children}
        </Text>
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
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    flex: 1,
    flexDirection: "row",
    color: "black"
  },
  textWrapper: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
    borderRightWidth: 1,
    borderColor: colors.blueColor
  },
  text: {
    fontSize: 18,
    //color: "#fff",
    padding: 10,
    fontWeight: "900"
  }
});

export default FriendRequestButton;
