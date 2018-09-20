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
    <View>
      <Icon
        size={45}
        name="md-add-circle"
        color={colors.greenColor}
        backgroundColor="white"
        //style={styles.addButton}
      />
      <View style={styles.addButton}>
        <View
          style={{
            backgroundColor: "#fff",
            height: 25,
            width: 25,
            borderRadius: 25 / 2
          }}
        />
      </View>
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
    //backgroundColor: "white",
    borderRadius: 100,
    height: 45,
    width: 45,
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    marginRight: 6
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
  }
});

export default addButton;
