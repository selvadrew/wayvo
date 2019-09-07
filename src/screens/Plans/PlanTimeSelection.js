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
  TouchableOpacity,
  Picker
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";

import { setTimeForPlan } from "../../store/actions/plans";

class PlanTimeSelection extends Component {
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

  //set hour and minute to use to show time selection options
  componentDidMount() {
    this.setState({
      dateNow: new Date(),
      hour: new Date().getHours(),
      minutes: new Date().getMinutes(),
      bump: Math.floor(new Date().getMinutes() / 15),
      bump2: Math.floor(new Date().getMinutes() / 45)
    });
  }
  //right now it adds multiple for bump if its 30min+. make it so it minuses instead

  state = {
    hour: null,
    minute: null,
    ampm: null,
    timeTillPlan: null,
    bump: 0,
    bump2: 0,
    times: [
      "12:00AM",
      "12:30AM",
      "1:00AM",
      "1:30AM",
      "2:00AM",
      "2:30AM",
      "3:00AM",
      "3:30AM",
      "4:00AM",
      "4:30AM",
      "5:00AM",
      "5:30AM",
      "6:00AM",
      "6:30AM",
      "7:00AM",
      "7:30AM",
      "8:00AM",
      "8:30AM",
      "9:00AM",
      "9:30AM",
      "10:00AM",
      "10:30AM",
      "11:00AM",
      "11:30AM",
      "12:00PM",
      "12:30PM",
      "1:00PM",
      "1:30PM",
      "2:00PM",
      "2:30PM",
      "3:00PM",
      "3:30PM",
      "4:00PM",
      "4:30PM",
      "5:00PM",
      "5:30PM",
      "6:00PM",
      "6:30PM",
      "7:00PM",
      "7:30PM",
      "8:00PM",
      "8:30PM",
      "9:00PM",
      "9:30PM",
      "10:00PM",
      "10:30PM",
      "11:00PM",
      "11:30PM"
    ]
  };

  timeSelected = index => {
    this.props.onSetTimeForPlan(index);

    // alert(
    //   Math.floor(
    //     (new Date().setHours(index / 2, (index % 2) * 30, 0) - new Date()) /
    //       60000
    //   )
    // );

    this.props.navigator.push({
      screen: "awesome-places.PlanExplodingOffer",
      backButtonTitle: "",
      title: "Set Exploding Offer",
      passProps: {
        timeTillPlan: Math.floor(
          (new Date().setHours(index / 2, (index % 2) * 30, 0) - new Date()) /
          60000
        )
      }
    });
  };

  timesList() {
    if (this.state.bump > 0) {
      return this.state.times.map((data, index) => {
        if (
          index >= this.state.hour * 2 + 2 + this.state.bump2 &&
          index >= 14
        ) {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                this.timeSelected(index);
              }}
            >
              <View style={styles.buttonWrapper}>
                <Text style={styles.button}>{data}</Text>
              </View>
            </TouchableOpacity>
          );
        }
      });
    } else {
      return this.state.times.map((data, index) => {
        if (
          index >= this.state.hour * 2 + 1 + this.state.bump2 &&
          index >= 14
        ) {
          return (
            <TouchableOpacity
              key={index}
              onPress={() => {
                this.timeSelected(index);
              }}
            >
              <View style={styles.buttonWrapper}>
                <Text style={styles.button}>{data}</Text>
              </View>
            </TouchableOpacity>
          );
        }
      });
    }
  }

  render() {
    let tooLate = null;
    if (this.state.hour * 2 + 2 + this.state.bump2 >= 48) {
      tooLate = (
        <Text style={styles.header}>
          Isn't it too late to start a plan? Go to bed 👀
        </Text>
        // <TouchableOpacity
        //   onPress={() => {
        //     this.timeSelected(3);
        //   }}
        // >
        //   <View style={styles.buttonWrapper}>
        //     <Text style={styles.button}>1:00AM</Text>
        //   </View>
        // </TouchableOpacity>
      );
    }
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
      >
        <View>
          <Text style={styles.header}>
            What time do you want to {this.props.activity_selected} today?
          </Text>
        </View>
        {/* grab food, hang out, study, party */}
        <View style={styles.viewWrapper}>{tooLate}</View>
        <View style={styles.viewWrapper}>{this.timesList()}</View>
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
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
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
    marginBottom: 15,
    alignItems: "center",
    justifyContent: "center"
  },
  button: {
    // width: "50%",
    padding: 10,
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    color: "#fff",
    letterSpacing: 1,
    fontWeight: "700"
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onSetTimeForPlan: time => dispatch(setTimeForPlan(time))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(PlanTimeSelection);

{
  /* 
- when can people set plans?
8am to 11:30pm 

get UTC time
get device time
show options





*/
}
