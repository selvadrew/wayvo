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

import { signUp } from "../../store/actions/users";

class SignUp extends Component {
  static navigatorStyle = {
    navBarHidden: false
  };
  constructor(props) {
    super(props);
  }

  state = {
    email: "",
    password: "",
    password_confirmation: "",
    error: false,
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
  confirmationChangedHandler = val => {
    this.setState({
      password_confirmation: val
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
    } else if (this.state.password_confirmation.trim() === "") {
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

    //check if password confirmation matches
    if (this.state.password !== this.state.password_confirmation) {
      this.setState({
        error: true
      });
      Keyboard.dismiss();
      return;
    } else {
      this.setState({
        error: false
      });
    }

    Keyboard.dismiss();

    this.props.onSignUpSubmit(
      this.state.email.trim(),
      this.state.password.trim()
    );
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
          Sign Up
        </GotIt>
      );
    }

    let errorStatement = null;

    if (this.props.signup_error) {
      errorStatement = (
        <View style={styles.bottomWrapper}>
          <Text style={styles.listHeader}>{this.props.signup_error}</Text>
        </View>
      );
    }

    if (this.state.error) {
      errorStatement = (
        <View style={styles.bottomWrapper}>
          <Text style={styles.listHeader}>
            Password confirmation does not match password
          </Text>
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
            <TextInput
              placeholder="Password Confirmation"
              value={this.state.password_confirmation}
              onChangeText={this.confirmationChangedHandler}
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
    //textAlign: "center",
    paddingLeft: 15,
    letterSpacing: 1,
    marginTop: 10
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
  signup_error: state.users.signup_error
});

const mapDispatchToProps = dispatch => {
  return {
    onSignUpSubmit: (email, password) => dispatch(signUp(email, password))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(SignUp);
