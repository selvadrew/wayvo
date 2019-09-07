import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  Platform,
  Image,
  ScrollView
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";

class HowItWorks extends Component {
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

  render() {
    const start_bracket = "(";
    const end_bracket = ")";
    const dash = "-";

    let phone_number = this.props.phone_number;
    formatted_phone_number = phone_number.replace(
      /(\d{3})(\d{3})(\d{4})/,
      "$1-$2-$3"
    );

    let throughFT = null;
    if (Platform.OS === "ios") {
      throughFT = <Text>or through FaceTime </Text>;
    }

    return (
      <ScrollView
        style={styles.container}
        contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
      >
        <View>
          {/* <GotIt
            onPress={() => {
              this.sayHello();
              this.defaultButtons();
            }}
            backgroundColor={colors.orange}
            color="#fff"
            fontSize={25}
            width="100%"
          >
            Start a plan example
              </GotIt> */}
          <View style={styles.barwrapper}>
            <View style={styles.barOrange}>
              <Text style={styles.barText}>How Start a Plan Works</Text>
            </View>
          </View>
          <Text style={styles.text}>
            Press "Start a Plan" and choose to start a party with your residence building! Wayvo will send a notification to all the students in your residence to let them know they're invited to your party. Wayvo, then automatically starts a group chat with everyone coming to your party, so you can finalize the party details together!
         </Text>
          <Text style={styles.text}>
            During the day, you can also start a plan to grab food, hang out, or group study!
         </Text>
          <Text style={styles.text}>
            You can start a plan with students from your residence building, program of study, or friend groups.
         </Text>
        </View>


      </ScrollView >
    )

  }
}
//If all your friends are busy and are not able to Say Hello back within the time you selected, nothing happens.

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingTop: 30,
    backgroundColor: "#fff"
    //alignItems: "center"
    // justifyContent: "center",
    // flexDirection: "column"
  },
  text: {
    paddingHorizontal: 20,
    marginTop: 10,
    fontWeight: "400",
    fontSize: Dimensions.get("window").width > 330 ? 19 : 17,
    color: "#222",
    letterSpacing: 1,
    //textAlign: "center",
    // marginBottom: 50,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  barwrapper: {
    width: "100%",
    backgroundColor: colors.orange,
    flexDirection: 'row'
  },
  barOrange: {
    flex: 1,
    backgroundColor: colors.orange,
    textAlign: "center",
    alignItems: "center"
  },
  barGreen: {
    flex: 1,
    backgroundColor: colors.greenColor,
    textAlign: "center",
    alignItems: "center"
  },
  barText: {
    fontSize: 26,
    fontWeight: "700",
    color: "#fff",
    padding: 10,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    letterSpacing: 1
  },
  infoOne: {
    resizeMode: "contain",
    height: Dimensions.get("window").width * 0.6,
    width: Dimensions.get("window").width * 0.6,
    alignItems: "center"
  },
  infoTwo: {
    resizeMode: "contain",
    height: Dimensions.get("window").width * 0.65,
    width: Dimensions.get("window").width * 0.65,
    alignItems: "center"
  },
  titleWrapper: {
    justifyContent: "center",
    width: "100%"
  },
  title: {
    textAlign: "center",
    fontSize: Dimensions.get("window").width > 330 ? 19 : 18,
    fontWeight: "500",
    padding: 5,
    color: "#333",
    letterSpacing: 1,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  wrapper: {
    flexDirection: "row",
    marginBottom: 40
  },
  numberHolder: {
    width: "15%",
    marginLeft: 10,
    marginRight: 10
  },
  numberWrapper1: {
    width: "100%",
    backgroundColor: colors.pinkColor,
    alignItems: "center",
    borderRadius: 100
  },
  numberWrapper2: {
    width: "100%",
    backgroundColor: colors.greenColor,
    alignItems: "center",
    borderRadius: 100
  },
  numberText: {
    fontWeight: "600",
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    textAlign: "center",
    alignItems: "center",
    color: "#fff",
    justifyContent: "center",
    paddingTop: 5,
    paddingBottom: 5
  },
  textWrapper: {
    width: "85%"
  }
});

export default HowItWorks;




// return (
    //   <ScrollView
    //     style={styles.container}
    //     contentContainerStyle={{ flexGrow: 1, alignItems: "center" }}
    //   >
    //     {/* <View style={styles.wrapper}>
    //       <View style={styles.titleWrapper}>
    //         <Text style={styles.title}>What happens when I Say Hello?</Text>
    //       </View>
    //     </View> */}

    //     <Image
    //       source={require("../../assets/Info-1.png")}
    //       style={styles.infoTwo}
    //     />
    //     <View>
    //       <Text style={styles.text}>
    //         When you Say Hello, all your friends or group members receive a
    //         notification
    //       </Text>
    //     </View>

    //     <Image
    //       source={require("../../assets/Info-2.png")}
    //       style={styles.infoTwo}
    //     />
    //     <View>
    //       <Text style={styles.text}>
    //         The first person to Say Hello Back before time expires gets to call
    //         you
    //       </Text>
    //     </View>

    //     <Image
    //       source={require("../../assets/Info-3.png")}
    //       style={styles.infoOne}
    //     />
    //     <View>
    //       <Text style={styles.text}>
    //         You will receive a call at {formatted_phone_number} {throughFT}
    //       </Text>
    //     </View>
    //   </ScrollView>
    // );