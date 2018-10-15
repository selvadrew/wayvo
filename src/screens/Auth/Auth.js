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
      //title: "How Wayvo Works",
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
      function(error) {
        alert("Login fail with error: " + error);
        console.log(error);
      }
    );
    console.log("function done");
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
          <Text style={styles.slogan}>
            Be better connected,
            {/* Say Hello to everyone in your life. */}
          </Text>
          <Text style={styles.slogan}>one person at a time.</Text>
        </View>
        <View style={styles.fbContainer}>
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
    fontSize: 17,
    color: "#fff"
  },
  icon: {
    marginRight: 15
  },
  slogan: {
    fontSize: Dimensions.get("window").width > 330 ? 25 : 20,
    color: "#333",
    letterSpacing: 2,
    fontWeight: "bold"
  },
  imageAndLogo: {
    flex: 3,
    alignItems: "center",
    justifyContent: "flex-start"
  },
  fbContainer: {
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
    fontSize: 12,
    textAlign: "center",
    color: "gray",
    paddingBottom: 20
  },
  termsText: {
    color: colors.blueColor //"#007B7F"
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
