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

import { logIn } from "../../store/actions/users";

class LogIn extends Component {
  static navigatorStyle = {
    navBarHidden: false
  };
  constructor(props) {
    super(props);
  }

  state = {
    email: "",
    password: "",
    email_error: false
  };

  emailChangedHandler = val => {
    this.setState({
      email: val
    });
  };
  passwordChangedHandler = val => {
    this.setState({
      password: val
    });
  };

  emailValidator = val => {
    if (
      /[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?\.)+[a-zA-Z0-9](?:[a-zA-Z0-9-]*[a-zA-Z0-9])?/.test(
        val
      )
    ) {
      return true;
    } else return false;
  };

  placeSubmitHandler = () => {
    //check for blanks
    if (this.state.email.trim() === "") {
      return;
    } else if (this.state.password.trim() === "") {
      return;
    }

    //check if email is valid
    if (this.emailValidator(this.state.email)) {
      this.setState({
        email_error: false
      });
    } else {
      this.setState({
        email_error: true
      });
      Keyboard.dismiss();
      return;
    }

    Keyboard.dismiss();
    this.props.onLogIn(this.state.email.trim(), this.state.password.trim());
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
          Log In
        </GotIt>
      );
    }

    let errorStatement = null;

    if (this.props.username_error === 2) {
      errorStatement = (
        <View style={styles.bottomWrapper}>
          <Text style={styles.listHeader}>Invalid format. Username must:</Text>
          <View style={styles.listItemWrapper}>
            <Text style={styles.listItem}>
              - Only contain letters and numbers
            </Text>
          </View>
          <View style={styles.listItemWrapper}>
            <Text style={styles.listItem}>
              - Be between 3-15 characters long
            </Text>
          </View>
          <View style={styles.listItemWrapper}>
            <Text style={styles.listItem}>- Not contain any whitespace</Text>
          </View>
        </View>
      );
    } else if (this.props.username_error === 1) {
      errorStatement = (
        <View style={styles.bottomWrapper}>
          <Text style={styles.listHeader}>Username already exists</Text>
        </View>
      );
    }

    if (this.state.email_error) {
      errorStatement = (
        <View style={styles.bottomWrapper}>
          <Text style={styles.listHeader}>Not a valid email</Text>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        <View style={styles.inputButtonWrapper}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Email"
              value={this.state.email}
              onChangeText={this.emailChangedHandler}
              style={styles.TextBox}
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
            <TextInput
              placeholder="Password"
              value={this.state.password}
              onChangeText={this.passwordChangedHandler}
              style={styles.TextBox}
              autoCapitalize="none"
              autoCorrect={false}
              secureTextEntry={true}
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
    paddingTop: 30,
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
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
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
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    borderRadius: 5,
    borderColor: "#333",
    //textAlign: "center",
    paddingLeft: 15,
    letterSpacing: 1,
    marginTop: 10
  },
  listHeader: {
    fontSize: 18,
    color: "#333",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  listItem: {
    fontSize: 16,
    color: "#333",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  listItemWrapper: {
    marginTop: 5
  }
});

const mapStateToProps = state => ({
  isLoading: state.ui.isLoading
});

const mapDispatchToProps = dispatch => {
  return {
    onLogIn: (email, password) => dispatch(logIn(email, password))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(LogIn);
