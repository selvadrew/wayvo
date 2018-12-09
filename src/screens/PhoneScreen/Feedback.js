import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";
import { sendFeedback } from "../../store/actions/users";

class Feedback extends Component {
  static navigatorStyle = {
    navBarHidden: false,
    statusBarColor: colors.darkBlue,
    navBarBackgroundColor: colors.darkBlue,
    navBarButtonColor: "#fff",
    navBarTextColor: "#fff"
  };
  constructor(props) {
    super(props);
  }

  state = {
    text: "",
    feedbackSent: false,
    button: true
  };

  onFeedback = () => {
    if (this.state.text.trim() === "") {
      return;
    }
    this.props.sendFeedback(this.state.text.trim());
    this.setState({
      button: false
    });
    setTimeout(() => {
      this.setState({
        feedbackSent: true
      });
    }, 600);
  };

  render() {
    let content = null;
    let button = null;

    if (this.state.button) {
      button = (
        <GotIt
          onPress={this.onFeedback}
          backgroundColor={colors.yellowColor}
          color="#333"
        >
          Send
        </GotIt>
      );
    } else {
      button = <ActivityIndicator />;
    }

    if (this.state.feedbackSent) {
      //feedback successfully sent
      content = (
        <Text style={styles.successFeedback}>
          Thank you for your feedback, we really appreciate it!
        </Text>
      );
    } else {
      content = (
        //no feedback sent yet
        <View>
          <Text style={styles.header}>Let us know how we can improve. </Text>
          <TextInput
            onChangeText={text => this.setState({ text })}
            value={this.state.text}
            multiline={true}
            //numberOfLines={10}
            style={styles.textInput}
            autoFocus={true}
            autoCorrect={false}
          />
          {button}
        </View>
      );
    }
    return <View style={styles.container}>{content}</View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 20
  },
  header: {
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    marginBottom: 20,
    color: "#333",
    fontWeight: 600,
    fontWeight: "bold"
  },
  textInput: {
    borderColor: colors.blueColor,
    borderWidth: 2,
    height: 150,
    padding: 10,
    textAlignVertical: "top",
    fontSize: Dimensions.get("window").width > 330 ? 16 : 15,
    marginBottom: 20
  },
  successFeedback: {
    fontSize: 22,
    color: colors.blueColor,
    textAlign: "center",
    fontWeight: "bold",
    marginTop: 30
  }
});

const mapDispatchToProps = dispatch => {
  return {
    sendFeedback: description => dispatch(sendFeedback(description))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(Feedback);
