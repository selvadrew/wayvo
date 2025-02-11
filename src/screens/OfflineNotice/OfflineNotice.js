import React, { PureComponent } from "react";
import {
  View,
  Text,
  NetInfo,
  Dimensions,
  StyleSheet,
  Platform
} from "react-native";

const { width } = Dimensions.get("window");

function MiniOfflineSign() {
  return (
    <View style={styles.offlineContainer}>
      <Text style={styles.offlineText}>No Internet Connection</Text>
    </View>
  );
}

class OfflineNotice extends PureComponent {
  state = {
    isConnected: true
  };

  componentDidMount() {
    NetInfo.isConnected
      .fetch()
      .then()
      .done(() => {
        NetInfo.isConnected.addEventListener(
          "connectionChange",
          this.handleConnectivityChange
        );
      });
  }

  componentWillUnmount() {
    NetInfo.isConnected.removeEventListener(
      "connectionChange",
      this.handleConnectivityChange
    );
  }

  handleConnectivityChange = isConnected => {
    if (isConnected) {
      this.setState({ isConnected: isConnected });
      //alert(isConnected);
    } else {
      this.setState({ isConnected: isConnected });
      //alert(isConnected);
    }
  };

  render() {
    if (!this.state.isConnected) {
      return <MiniOfflineSign />;
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  offlineContainer: {
    backgroundColor: "#b52424",
    height: 30,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    width
    // position: "absolute",
    // top: 30
  },
  offlineText: {
    color: "#fff",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  }
});

export default OfflineNotice;
