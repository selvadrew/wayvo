import React, { Component } from "react";
import { View, Text, Button, TouchableOpacity, StyleSheet } from "react-native";
import { connect } from "react-redux";

import { authAutoSignIn } from "../../store/actions/users";
import colors from "../../utils/styling";

class LoadingScreen extends Component {
  componentDidMount() {
    this.props.onAutoSignIn();
  }

  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
  }

  render() {
    return <View style={styles.container} />;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.blueColor,
    flex: 1
  }
});

const mapDispatchToProps = dispatch => ({
  onAutoSignIn: () => dispatch(authAutoSignIn())
});

export default connect(
  null,
  mapDispatchToProps
)(LoadingScreen);
