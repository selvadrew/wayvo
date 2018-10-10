import React, { Component } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  ActivityIndicator,
  Platform
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import AddButton from "../../components/UI/AddButton";

class SearchBar extends Component {
  state = {
    usernameSearch: ""
  };

  usernameChangedHandler = val => {
    this.setState({
      usernameSearch: val
    });
  };

  addUsernameHandler = () => {
    if (this.state.usernameSearch.trim() === "") {
      return;
    }
    this.props.searchUsername(this.state.usernameSearch.trim());
    this.setState({
      usernameSearch: ""
    });
  };

  render() {
    let addButton = null;
    if (this.props.isLoadingAddFriend) {
      addButton = <ActivityIndicator style={styles.spinnerStyle} />;
    } else {
      if (this.state.usernameSearch !== "") {
        addButton = (
          <View style={styles.placeButton}>
            <AddButton onPress={this.addUsernameHandler} />
          </View>
        );
      }
    }
    return (
      <View style={styles.inputContainer}>
        <View style={styles.textWrapper}>
          <TextInput
            placeholder="🔎 Add by username"
            placeholderTextColor="rgba(255,255,255,0.7)"
            placeholderFontSize="10"
            value={this.state.usernameSearch}
            onChangeText={this.usernameChangedHandler}
            style={styles.TextBox}
            autoCorrect={false}
            autoCapitalize="none"
            onSubmitEditing={this.addUsernameHandler}
          />
          {addButton}
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  inputContainer: {
    flex: 1,
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
    // backgroundColor: colors.pinkColor,
    height: 50
  },
  textWrapper: {
    margin: 10,
    borderWidth: 1,
    borderRadius: 100,
    borderColor: "#eeecea",
    backgroundColor: colors.pinkColor,
    width: "100%",
    height: "100%",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center"
  },
  TextBox: {
    width: "80%",
    color: "#fff",
    fontSize: 18,
    marginLeft: 15
  },
  placeButton: {
    width: "20%",
    flex: 1,
    flexDirection: "row"
  },
  spinnerStyle: {
    marginRight: 10,
    color: "#fff"
  }
});

const mapStateToProps = state => {
  return {
    isLoadingAddFriend: state.ui.isLoadingAddFriend
  };
};

export default connect(mapStateToProps)(SearchBar);
