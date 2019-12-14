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
  ActivityIndicator,
  TextInput,
  Keyboard
} from "react-native";
import { connect } from "react-redux";
import GotIt from "../../components/UI/GotItButton";

import Icon from "react-native-vector-icons/Ionicons";
import { LoginManager, AccessToken } from "react-native-fbsdk";

import { loginWithFacebook, authAutoSignIn } from "../../store/actions/users";
import SplashScreen from "react-native-splash-screen";

import colors from "../../utils/styling";
import { signUp } from "../../store/actions/users";


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

  state = {
    school: null,
    email_error: false,
    email: ""
  };

  emailChangedHandler = val => {
    this.setState({
      email: val
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

  emailSubmitHandler = () => {
    //check for blanks
    if (this.state.email.trim() === "") {
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

    this.props.submitEmailForVerification(
      this.state.email.trim()
    );
  };


  render() {
    let statusBar = null;
    let fbButton = null;
    if (Platform.OS === "ios") {
      statusBar = <StatusBar barStyle="dark-content" backgroundColor="#EEE" />;
    }

    if (this.props.isLoading) {
      createButton = <ActivityIndicator />;
    } else {
      createButton = (
        <GotIt
          onPress={this.emailSubmitHandler}
          backgroundColor={colors.yellowColor}
          color="#333"
        >
          Continue
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
    if (this.state.email_error) {
      errorStatement = (
        <View style={styles.bottomWrapper}>
          <Text style={styles.listHeader}>Not a valid email</Text>
        </View>
      );
    }


    return (
      <View style={styles.container}>
        {statusBar}
        <View style={styles.topContainer}>
          <View style={styles.imageAndLogo}>
            <Image
              source={require("../../assets/WayvoLogo.png")}
              style={styles.logoImage}
            />
            {/* <Text style={styles.slogan}></Text> */}
          </View>

          <View>
            <Text style={styles.continueText}>Continue with your university email</Text>
          </View>

          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="University Email"
              value={this.state.email}
              onChangeText={this.emailChangedHandler}
              style={styles.TextBox}
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
              keyboardType="email-address"
            />
          </View>
          {createButton}
          {errorStatement}
        </View>



        <View style={styles.bottomContainer}>
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
    // flex: 1,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  topContainer: {
    flex: 5
  },
  bottomContainer: {
    flex: 1,
    //alignItems: "center",
    justifyContent: "flex-end",
    marginBottom: 20
  },
  logoImage: {
    height: Dimensions.get("window").width * 0.4,
    width: Dimensions.get("window").width * 0.4
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
  continueText: {
    fontSize: Dimensions.get("window").width > 330 ? 19 : 16,
    textAlign: "center",
    color: "#222",
    marginTop: 20
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
  },
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
  bottomWrapper: {
    marginTop: 35,
    width: "100%",
    backgroundColor: "#fff1f4",
    padding: 10,
    borderRadius: 3
  },
  listHeader: {
    fontSize: 18,
    color: "#333",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
});

const mapStateToProps = state => ({
  accessToken: state.users.accessToken,
  isLoading: state.ui.isLoading,
  signup_error: state.users.signup_error
});

const mapDispatchToProps = dispatch => ({
  loginWithFacebook: facebookAccessToken =>
    dispatch(loginWithFacebook(facebookAccessToken)),
  onAutoSignIn: () => dispatch(authAutoSignIn()),
  submitEmailForVerification: email => dispatch(signUp(email))
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthScreen);
