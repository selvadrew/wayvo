import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Platform
} from "react-native";
import { connect } from "react-redux";

import Icon from "react-native-vector-icons/Ionicons";
import { LoginManager, AccessToken } from "react-native-fbsdk";

import { loginWithFacebook, authAutoSignIn } from "../../store/actions/users";
import SplashScreen from "react-native-splash-screen";

class AuthScreen extends Component {
  componentDidMount() {
    if (Platform.OS === "ios") {
      SplashScreen.hide();
    }
  }

  onFBAuth = () => {
    console.log("Facebook Login");

    LoginManager.logInWithReadPermissions(["public_profile", "email"]).then(
      result => {
        if (result.isCancelled) {
          alert("Login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            this.props.loginWithFacebook(data.accessToken.toString());
            console.log(data.accessToken);
          });
        }
      },
      function(error) {
        alert("Login fail with error: " + error);
        console.log(error);
      }
    );
    console.log("function done");
  };

  render() {
    return (
      <View style={styles.container}>
        <TouchableOpacity style={styles.button} onPress={() => this.onFBAuth()}>
          <Icon
            name="logo-facebook"
            size={25}
            color="#007B7F"
            style={styles.icon}
          />
          <Text style={styles.buttonText}>Continue with Facebook</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 20
  },
  button: {
    height: 47,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 25,
    flexDirection: "row",
    backgroundColor: "#E2E2E2"
  },
  buttonText: {
    fontSize: 17,
    color: "#007B7F"
  },
  icon: {
    marginRight: 15
  }
});

const mapStateToProps = state => ({
  accessToken: state.users.accessToken
});

const mapDispatchToProps = dispatch => ({
  loginWithFacebook: facebookAccessToken =>
    dispatch(loginWithFacebook(facebookAccessToken)),
  onAutoSignIn: () => dispatch(authAutoSignIn())
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthScreen);
