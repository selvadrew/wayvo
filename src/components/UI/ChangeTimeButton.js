import React, { Component } from "react";
import {
  TouchableWithoutFeedback,
  TouchableNativeFeedback,
  Text,
  View,
  StyleSheet,
  Platform,
  Dimensions
} from "react-native";
import colors from "../../utils/styling";
import Icon from "react-native-vector-icons/Ionicons";

class ChangeTime extends Component {
  state = {
    timeSelected: 0
  };

  changeTime = () => {
    if (this.state.timeSelected === 4) {
      this.setState({
        timeSelected: 0
      });
    } else {
      this.setState({
        timeSelected: this.state.timeSelected + 1
      });
    }
  };

  render() {
    const timeOptions = [5, 15, 30, 45, 60];

    const content = (
      <View style={styles.wrapper}>
        <Text style={styles.timeText}>
          The first contact to respond within{" "}
          <Text style={styles.timeNumber}>
            {timeOptions[this.state.timeSelected]} minutes
          </Text>{" "}
          can call me.
        </Text>
      </View>
    );

    return (
      <TouchableWithoutFeedback style={styles.button} onPress={this.changeTime}>
        {content}
      </TouchableWithoutFeedback>
    );
  }
}

const styles = StyleSheet.create({
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  wrapper: {
    //flex: 1,
    alignItems: "center",
    alignSelf: "center"
  },
  timeText: {
    paddingTop: 30,
    fontSize: 25,
    color: "white",
    textAlign: "center"
  },
  timeNumber: {
    color: colors.yellowColor,
    fontWeight: "bold"
  }
});

export default ChangeTime;
