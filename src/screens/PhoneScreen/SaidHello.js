import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";

class SaidHello extends Component {
  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
  }

  render() {
    let helloStatus = null;
    let error = null;

    switch (this.props.isLoadingHello) {
      case true:
        helloStatus = <ActivityIndicator />;
        break;
      case false:
        switch (this.props.saidHello) {
          case true:
            helloStatus = (
              <View>
                <Text style={styles.successText}>
                  Hang tight, you will receive a call from the first contact to
                  Say Hello Back
                </Text>
                <GotIt
                  color={colors.greenColor}
                  onPress={() => this.props.navigator.pop()}
                  backgroundColor={colors.yellowColor}
                  color="#333"
                >
                  GOT IT
                </GotIt>
              </View>
            );
            break;
          case false:
            error = this.props.error;
            helloStatus = (
              <View>
                <Text style={styles.successText}>{error}</Text>
                <GotIt
                  color={colors.greenColor}
                  onPress={() => this.props.navigator.pop()}
                  backgroundColor={colors.yellowColor}
                  color="#333"
                >
                  GOT IT
                </GotIt>
              </View>
            );
            break;
        }
    }

    return (
      <View style={styles.container}>
        <View style={styles.textWrapper}>{helloStatus}</View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.greenColor,
    flex: 1,
    flexDirection: "column",
    alignContent: "center",
    justifyContent: "center"
  },
  textWrapper: {
    alignItems: "center",
    flexDirection: "column",
    justifyContent: "center"
  },
  successText: {
    color: "white",
    fontSize: Dimensions.get("window").width > 330 ? 22 : 20,
    margin: Dimensions.get("window").width > 330 ? 40 : 20,
    fontWeight: "800",
    textAlign: "center"
  }
});

const mapStateToProps = state => {
  return {
    isLoadingHello: state.ui.isLoadingHello,
    saidHello: state.ui.saidHello,
    error: state.ui.error
  };
};

export default connect(mapStateToProps)(SaidHello);
