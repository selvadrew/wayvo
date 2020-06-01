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
  Image,
  TouchableOpacity
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";

import { setActivityForPlan } from "../../store/actions/plans";

class PlanActivitySelection extends Component {
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
    activities: ["grab food", "hang out", "group study", "party"]
  };

  activitySelected = activity => {
    this.props.onSetActivityForPlan(activity);

    this.props.navigator.push({
      screen: "awesome-places.PlanTimeSelection",
      backButtonTitle: "",
      title: "Select Time",
      passProps: {
        activity_selected: this.state.activities[activity]
      }
    });
  };

  render() {
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
      >
        <View>
          <Text style={styles.header}>
            Select an activity to start with members of {this.props.group_name}
            {/* Select an activity to start with members of your residence */}
          </Text>
        </View>
        {/* grab food, hang out, study, party */}
        <View style={styles.viewWrapper}>
          <TouchableOpacity
            onPress={() => {
              this.activitySelected(0);
            }}
            style={styles.buttonWrapper}
          >
            <Text style={styles.button}>Grab food</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.activitySelected(1);
            }}
            style={styles.buttonWrapper}
          >
            <Text style={styles.button}>Hang out</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.activitySelected(2);
            }}
            style={styles.buttonWrapper}
          >
            <Text style={styles.button}>Group Study</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => {
              this.activitySelected(3);
            }}
            style={styles.buttonWrapper}
          >
            <Text style={styles.button}>Party</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  },
  header: {
    fontSize: Dimensions.get("window").width > 330 ? 22 : 20,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    color: "#111",
    fontWeight: "400",
    padding: 14,
    letterSpacing: 0.6,
    marginTop: 10,
    textAlign: "center"
  },
  viewWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  buttonWrapper: {
    backgroundColor: colors.orange,
    width: "80%",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 25,
    borderRadius: 50
  },
  button: {
    paddingVertical: 18,
    color: "#fff",
    fontSize: 26,
    fontFamily: Platform.OS === "android" ? "Roboto" : "Arial Rounded MT Bold",
    letterSpacing: 1,
    fontWeight: "700"
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onSetActivityForPlan: plan => dispatch(setActivityForPlan(plan))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(PlanActivitySelection);
