import React, { Component } from "react";
import {
  View,
  Text,
  Button,
  TouchableOpacity,
  StyleSheet,
  Platform,
  Alert,
  Image,
  Dimensions,
  StatusBar,
  TouchableWithoutFeedback,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";

import Icon from "react-native-vector-icons/Ionicons";
import { LoginManager, AccessToken } from "react-native-fbsdk";

import { loginWithFacebook, authAutoSignIn } from "../../store/actions/users";
import SplashScreen from "react-native-splash-screen";

import colors from "../../utils/styling";

class AuthScreen extends Component {
  componentDidMount() {
    if (Platform.OS === "ios") {
      SplashScreen.hide();
    }
  }

  static navigatorStyle = {
    navBarHidden: false,
    navBarTextFontSize: 20,
    navBarBackgroundColor: "#EEE"
    //statusBarColor: "#EEE"
  };
  constructor(props) {
    super(props);
  }

  terms = () => {
    this.props.navigator.push({
      screen: "awesome-places.Terms",
      backButtonTitle: ""
    });
  };

  onFBAuth = () => {
    console.log("Facebook Login");

    LoginManager.logInWithReadPermissions(["public_profile", "email"]).then(
      result => {
        if (result.isCancelled) {
          //Alert.alert("Login cancelled");
          console.log("login cancelled");
        } else {
          AccessToken.getCurrentAccessToken().then(data => {
            this.props.loginWithFacebook(data.accessToken.toString());
            console.log(data.accessToken);
          });
        }
      },
      function (error) {
        alert("Login fail with error: " + error);
        console.log(error);
      }
    );
    console.log("function done");
  };

  onSignUp = () => {
    this.props.navigator.push({
      screen: "awesome-places.SignUp",
      backButtonTitle: ""
      //title: "Let's Get Started"
    });
  };

  onLogIn = () => {
    this.props.navigator.push({
      screen: "awesome-places.LogIn",
      backButtonTitle: "",
      title: "Welcome Back"
    });
  };

  render() {
    let statusBar = null;
    let fbButton = null;
    if (Platform.OS === "ios") {
      statusBar = <StatusBar barStyle="dark-content" backgroundColor="#EEE" />;
    }

    if (this.props.isLoading) {
      fbButton = <ActivityIndicator />;
    } else {
      fbButton = (
        <View>
          <TouchableOpacity
            style={styles.button}
            onPress={() => this.onFBAuth()}
          >
            <Icon
              name="logo-facebook"
              size={25}
              color="#fff"
              style={styles.icon}
            />
            <Text style={styles.buttonText}>Continue with Facebook</Text>
          </TouchableOpacity>
        </View>
      );
    }

    return (
      <View style={styles.container}>
        {statusBar}
        <View style={styles.imageAndLogo}>
          <Image
            source={require("../../assets/WayvoLogo.png")}
            style={styles.logoImage}
          />
          <Text style={styles.slogan}>Connect in real life.</Text>

        </View>
        <View style={styles.bottomContainer}>
          <View style={styles.emailContainer}>
            <View style={styles.oneOfTwo}>
              <TouchableOpacity
                onPress={() => this.onSignUp()}
                style={styles.touchgreen}
              >
                <Text style={styles.emailText}>Sign Up</Text>
              </TouchableOpacity>
            </View>
            <View style={styles.oneOfTwo}>
              <TouchableOpacity
                onPress={() => this.onLogIn()}
                style={styles.touchgreen}
              >
                <Text style={styles.emailText}>Log In</Text>
              </TouchableOpacity>
            </View>
          </View>
          {fbButton}
          <Text style={styles.termsWrapper}>
            By continuing, you agree to our{" "}
            <Text style={styles.termsText} onPress={this.terms}>
              Terms and Data Policy.
            </Text>
          </Text>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    //justifyContent: "center"
    padding: 20,
    paddingBottom: 0,
    backgroundColor: "#fff"
  },
  button: {
    height: 47,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    flexDirection: "row",
    backgroundColor: "#4267b2"
  },
  buttonText: {
    fontSize: 18,
    fontWeight: "500",
    letterSpacing: 0.5,
    color: "#fff",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  icon: {
    marginRight: 15
  },
  slogan: {
    fontSize: Dimensions.get("window").width > 330 ? 25 : 20,
    color: "#444",
    letterSpacing: 2,
    fontWeight: "500",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  imageAndLogo: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  bottomContainer: {
    flex: 1,
    //alignItems: "center",
    justifyContent: "flex-end"
  },
  logoImage: {
    height: Dimensions.get("window").width * 0.7,
    width: Dimensions.get("window").width * 0.7
    //justifyContent: "flex-start"
  },
  termsWrapper: {
    marginTop: 5,
    fontSize: Dimensions.get("window").width > 330 ? 12 : 10,
    textAlign: "center",
    color: "gray",
    paddingBottom: 20,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  termsText: {
    color: colors.blueColor, //"#007B7F",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  emailContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-end",
    marginBottom: 12
  },
  oneOfTwo: {
    height: 47,
    width: "46%",
    backgroundColor: colors.greenColor,
    borderRadius: 5,
    justifyContent: "center",
    alignItems: "center"
  },
  emailText: {
    fontSize: 18,
    fontWeight: "600",
    letterSpacing: 0.5,
    color: "#fff",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  touchgreen: {
    justifyContent: "center",
    alignItems: "center",
    height: "100%",
    width: "100%"
  }
});

const mapStateToProps = state => ({
  accessToken: state.users.accessToken,
  isLoading: state.ui.isLoading
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
