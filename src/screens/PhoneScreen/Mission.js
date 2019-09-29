import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
  Image
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";
import { sendFeedback } from "../../store/actions/users";
import { Dropdown } from 'react-native-material-dropdown';

class Mission extends Component {
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
    learnMoreIndex: null
  };

  onChangeTextPress = (value, index) => {
    this.setState({
      learnMoreIndex: index
    })
  }

  render() {
    let data = [{
      value: 'Start a plan',
    }, {
      value: 'Make a new friend',
    }, {
      value: 'Catch up with a friend',
    }, {
      value: 'Groups',
    }, {
      value: 'Live',
    }];

    let learnMoreText = null
    switch (this.state.learnMoreIndex) {
      case 0://start a plan 
        learnMoreText = (
          <Text style={styles.learnMoreText}>plan</Text>
        )
        break
      case 1://make a new friend
        learnMoreText = (
          <Text style={styles.learnMoreText}>plan</Text>
        )
        break
      case 2://catch up with a friend 
        learnMoreText = (
          <Text style={styles.learnMoreText}>plan</Text>
        )
        break
      case 3://groups
        learnMoreText = (
          <Text style={styles.learnMoreText}>plan</Text>
        )
        break
      case 4://Live
        learnMoreText = (
          <Text style={styles.learnMoreText}>plan</Text>
        )
        break
      default:
        learnMoreText = null
        break
    }

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
      >
        <View style={styles.wrapper}>
          <Text style={styles.header}>
            Wayvo helps university students connect with new and existing friends every day.
          </Text>
          <Dropdown
            label='Select a feature to learn more'
            data={data}
            itemCount={5}
            itemColor="#333"
            textColor={colors.darkBlue}
            onChangeText={(value, index) => this.onChangeTextPress(value, index)}
          />
          <View style={styles.learnMoreTextWrapper}>
            {learnMoreText}
          </View>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    //flex: 1,
    backgroundColor: "#fff",
    padding: 20,
    paddingTop: 15
  },
  wrapper: {
    flex: 1,
    // alignContent: "center",
    // justifyContent: "center",
    marginBottom: 10
  },
  header: {
    fontSize: Dimensions.get("window").width > 330 ? 21 : 18,
    color: "#444",
    fontWeight: "500",
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    letterSpacing: 0.5
  },
  learnMoreText: {
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  learnMoreTextWrapper: {
    marginTop: 10
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
)(Mission);
