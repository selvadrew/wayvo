import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Button
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";

import { logout } from "../../store/actions/users";

class OptionScreen extends Component {
  static navigatorStyle = {
    navBarHidden: false
  };
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.textWrapper}>
          <Button title="Logout" onPress={() => this.props.onLogout()} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

const mapDispatchToProps = dispatch => {
  return {
    onLogout: () => dispatch(logout())
  };
};

export default connect(
  null,
  mapDispatchToProps
)(OptionScreen);
