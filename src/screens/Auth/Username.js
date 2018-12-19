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

import { createUsername } from "../../store/actions/users";
import SplashScreen from "react-native-splash-screen";

class Username extends Component {
  componentDidMount() {
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
    Keyboard.dismiss();
    this.props.onAddUsername(this.state.userName.trim());
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
          Create
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

    return (
      <View style={styles.container}>
        <View style={styles.topWrapper}>
          <Text style={styles.topText}>Create a username</Text>
          <Text style={styles.bottomText}>
            You will not be able to change your username once you create it.
          </Text>
        </View>
        <View style={styles.inputButtonWrapper}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="Your new username"
              value={this.state.userName}
              onChangeText={this.userNameChangedHandler}
              style={styles.TextBox}
              autoFocus={true}
              autoCapitalize="none"
              autoCorrect={false}
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
    color: "#444",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
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
  bottomText: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    color: "#555",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
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
    borderRadius: 5,
    borderColor: "#333",
    //textAlign: "center",
    paddingLeft: 15,
    letterSpacing: 1
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
  isLoading: state.ui.isLoading,
  username_error: state.users.username_error
});

const mapDispatchToProps = dispatch => {
  return {
    onAddUsername: userName => dispatch(createUsername(userName))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Username);
