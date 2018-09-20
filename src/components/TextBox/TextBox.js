import React, { Component } from "react";
import { View, TextInput, Button, StyleSheet } from "react-native";

class TextBox extends Component {
  state = {
    userName: ""
  };

  userNameChangedHandler = val => {
    this.setState({
      userName: val
    });
  };

  placeSubmitHandler = () => {
    if (this.state.userName.trim() === "") {
      return;
    }

    this.props.onPlaceAdded(this.state.userName.trim());
  };

  render() {
    return (
      <View style={styles.inputContainer}>
        <TextInput
          placeholder="Create username"
          value={this.state.userName}
          onChangeText={this.userNameChangedHandler}
          style={styles.TextBox}
          autoFocus={true}
          autoCapitalize="none"
          autoCorrect={false}
        />
        <Button
          title="Add"
          style={styles.placeButton}
          onPress={this.placeSubmitHandler}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    // flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 40,
    marginTop: 50
  },
  TextBox: {
    width: "70%"
  },
  placeButton: {
    width: "30%"
  }
});

export default TextBox;
