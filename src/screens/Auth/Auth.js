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
  Keyboard,
  AsyncStorage
} from "react-native";
import { connect } from "react-redux";
import GotIt from "../../components/UI/GotItButton";

import Icon from "react-native-vector-icons/Ionicons";
import { LoginManager, AccessToken } from "react-native-fbsdk";

import { loginWithFacebook, authAutoSignIn, savePhoneNumber } from "../../store/actions/users";
import SplashScreen from "react-native-splash-screen";

import colors from "../../utils/styling";
import { schoolEmailSignup, signUpError } from "../../store/actions/users";



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

  // state = {
  //   school: null,
  //   email_error: false,
  //   email: ""
  // };
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
          onPress={this.placeSubmitHandler}
          backgroundColor={colors.yellowColor}
          color="#333"
        >
          Send Code
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

    if (this.props.nextScreen) {
      this.props.navigator.push({
        screen: "awesome-places.EmailCode",
        passProps: {
          phoneNumber: this.state.userName.trim()
        },
        backButtonTitle: ""
      });
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
            <Text style={styles.continueText}>Continue with your phone number</Text>
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
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
  },
  icon: {
    marginRight: 15
  },
  slogan: {
    fontSize: Dimensions.get("window").width > 330 ? 25 : 20,
    color: "#444",
    letterSpacing: 2,
    fontWeight: "500",
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
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
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
  },
  continueText: {
    fontSize: Dimensions.get("window").width > 330 ? 19 : 16,
    textAlign: "center",
    color: "#222",
    marginTop: 20
  },
  termsText: {
    color: colors.blueColor, //"#007B7F",
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
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
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
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
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
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
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold"
  },
});

const mapStateToProps = state => ({
  accessToken: state.users.accessToken,
  isLoading: state.ui.isLoading,
  signup_error: state.users.signup_error,
  nextScreen: state.users.nextScreen,
  phoneNumber: state.users.phoneNumber
});

const mapDispatchToProps = dispatch => ({
  loginWithFacebook: facebookAccessToken =>
    dispatch(loginWithFacebook(facebookAccessToken)),
  onAutoSignIn: () => dispatch(authAutoSignIn()),
  onAddPhoneNumber: phoneNumber => dispatch(schoolEmailSignup(phoneNumber)),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(AuthScreen);
