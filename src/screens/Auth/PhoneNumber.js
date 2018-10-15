import React, { Component } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Button,
  ActivityIndicator,
  Keyboard,
  Platform
} from "react-native";
import TextBox from "../../components/TextBox/TextBox";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";

import { savePhoneNumber } from "../../store/actions/users";
import SplashScreen from "react-native-splash-screen";

class PhoneNumber extends Component {
  componentDidMount() {
    if (this.props.phoneNumber) {
      this.setState({
        userName: this.props.phoneNumber
      });
    }

    if (Platform.OS === "ios") {
      SplashScreen.hide();
    }
  }

  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
  }

  state = {
    userName: "",
    phone_number_error: null
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
    if (this.state.userName.length !== 10) {
      Keyboard.dismiss();
      this.setState({
        phone_number_error: 1
      });
      return;
    }

    if (/^\d+$/.test(this.state.userName) === false) {
      Keyboard.dismiss();
      this.setState({
        phone_number_error: 2
      });
      return;
    }

    Keyboard.dismiss();
    this.props.onAddPhoneNumber(this.state.userName.trim());
  };

  render() {
    if (this.props.isLoading) {
      createButton = <ActivityIndicator />;
    } else {
      createButton = (
        <GotIt
          onPress={this.placeSubmitHandler}
          backgroundColor={colors.yellowColor}
          color="#333"
        >
          Save
        </GotIt>
      );
    }

    let errorStatement = null;

    if (this.state.phone_number_error === 1) {
      errorStatement = (
        <View style={styles.bottomWrapper}>
          <Text style={styles.listHeader}>Must contain 10 digits</Text>
        </View>
      );
    } else if (this.state.phone_number_error === 2) {
      errorStatement = (
        <View style={styles.bottomWrapper}>
          <Text style={styles.listHeader}>
            Can only contain numbers (no special characters)
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.topWrapper}>
          <Text style={styles.topText}>
            Save your phone number to allow contacts to call you
          </Text>
        </View>
        <View style={styles.inputButtonWrapper}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Your 10-digit phone number"
              value={this.state.userName}
              onChangeText={this.userNameChangedHandler}
              style={styles.TextBox}
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="numeric"
              //textContentType="telephoneNumber"
              maxLength={10}
              textContentType="telephoneNumber"
              onSubmitEditing={this.placeSubmitHandler}
            />
          </View>

          {createButton}

          {errorStatement}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 50,
    backgroundColor: "#fff"
  },
  topWrapper: {
    flex: 2,
    width: "100%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center"
  },
  topText: {
    fontSize: 20,
    fontWeight: "600",
    textAlign: "center",
    color: "#444"
  },
  inputButtonWrapper: {
    flex: 5,
    width: "100%"
  },
  bottomWrapper: {
    marginTop: 35,
    width: "100%",
    backgroundColor: "#fff1f4",
    padding: 10,
    borderRadius: 3
  },
  bottomText: {},
  inputWrapper: {
    marginBottom: 20,
    width: "100%"
  },
  TextBox: {
    borderWidth: 1,
    width: "100%",
    height: 50,
    fontSize: 18,
    borderRadius: 5,
    borderColor: "#333",
    textAlign: "center"
  },
  listHeader: {
    fontSize: 18,
    color: "#333"
  },
  listItem: {
    fontSize: 16,
    color: "#333"
  },
  listItemWrapper: {
    marginTop: 5
  }
});

const mapStateToProps = state => ({
  isLoading: state.ui.isLoading,
  phoneNumber: state.users.phoneNumber
});

const mapDispatchToProps = dispatch => {
  return {
    onAddPhoneNumber: phoneNumber => dispatch(savePhoneNumber(phoneNumber))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhoneNumber);
