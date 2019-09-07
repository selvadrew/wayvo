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

import { saveFullname } from "../../store/actions/users";

class Fullname extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
  }

  state = {
    first: "",
    last: ""
  };

  firstChangedHandler = val => {
    this.setState({
      first: val
    });
  };
  lastChangedHandler = val => {
    this.setState({
      last: val
    });
  };

  concatenateName = (first, last) => {
    return first.trim() + " " + last.trim();
  };

  placeSubmitHandler = () => {
    //check for blanks
    if (this.state.first.trim() === "") {
      return;
    } else if (this.state.last.trim() === "") {
      return;
    }

    Keyboard.dismiss();

    this.props.onSaveName(
      this.concatenateName(this.state.first, this.state.last)
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
          Save
        </GotIt>
      );
    }

    let errorStatement = null;

    // if (this.state.email_error) {
    //   errorStatement = (
    //     <View style={styles.bottomWrapper}>
    //       <Text style={styles.listHeader}>Not a valid email</Text>
    //     </View>
    //   );
    // }

    return (
      <View style={styles.container}>
        <View style={styles.topWrapper}>
          <Text style={styles.topText}>Name</Text>
          <Text style={styles.bottomText}>
            You will not be able to change your name once you save it.
          </Text>
        </View>
        <View style={styles.inputButtonWrapper}>
          <View style={styles.inputWrapper}>
            <TextInput
              placeholder="First Name"
              textContentType="givenName"
              value={this.state.first}
              onChangeText={this.firstChangedHandler}
              style={styles.TextBox}
              autoFocus={true}
              //autoCapitalize="none"
              autoCorrect={false}
            />
            <TextInput
              placeholder="Last Name"
              textContentType="familyName"
              value={this.state.last}
              onChangeText={this.lastChangedHandler}
              style={styles.TextBox}
              //autoCapitalize="none"
              autoCorrect={false}
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
  bottomText: {
    fontSize: 18,
    fontWeight: "400",
    textAlign: "center",
    color: "#555",
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
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    color: "#333"
  },
  listItem: {
    fontSize: 16,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    color: "#333"
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
    onSaveName: fullname => dispatch(saveFullname(fullname))
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Fullname);
