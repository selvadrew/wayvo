import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Platform,
  Dimensions,
  TouchableWithoutFeedback,
  Alert
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";

import { changeGroupState, cacheContinue } from "../../store/actions/groups";
import UniversityList from "../../components/UniversityList/UniversityList";
import { getPrograms } from "../../store/actions/groups";
import Icon from "react-native-vector-icons/Ionicons";

class GroupSelectUniversity extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: colors.blueColor
  };
  constructor(props) {
    super(props);
  }

  state = {
    step: 0,
    uni: null,
    program: null,
    programId: null,
    startYear: null
  };

  onSelectedUni = (value, index, data) => {
    console.log(value, index, data[index].id);
  };

  universitySelectedHandler = (id, value) => {
    this.props.onGetPrograms(id);
    this.setState({
      step: 1,
      uni: value
    });
  };

  programSelectedHandler = (id, value) => {
    this.setState({
      step: 2,
      program: value,
      programId: id
    });
  };

  yearSelectedHandler = value => {
    this.setState({
      step: 3,
      startYear: value
    });
    // Alert.alert(
    //   "You cannot change this information once you continue, please make sure it's correct"
    // );
  };

  backToUni = () => {
    this.setState({
      step: 0
    });
  };
  backToProg = () => {
    this.setState({
      step: 1
    });
  };
  backToYear = () => {
    this.setState({
      step: 2
    });
  };

  yesContinue = (programId, startYear) => {
    this.props.onContinue(programId, startYear);
    this.props.onChangeGroupState(2);
  };

  // <Button title="sup" onPress={() => this.props.onChangeGroupState(3)} />
  render() {
    let screen = null;
    let uniSelect = null;
    let progSelect = null;
    let the = null;
    let an = "a";
    let vowels = ["a", "e", "i", "o", "u"];
    let startYear = [
      { id: 2012, value: 2012 },
      { id: 2013, value: 2013 },
      { id: 2014, value: 2014 },
      { id: 2015, value: 2015 },
      { id: 2016, value: 2016 },
      { id: 2017, value: 2017 },
      { id: 2018, value: 2018 },
      { id: 2019, value: 2019 }
    ];
    if (this.state.uni) {
      if (this.state.uni.toLowerCase().substring(0, 10) === "university") {
        the = "the ";
      }
    }
    if (this.state.program) {
      if (vowels.indexOf(this.state.program.toLowerCase().charAt(0)) > -1) {
        an = "an";
      }
    }

    if (this.props.isLoadingGroups) {
      uniSelect = <ActivityIndicator color="#fff" />;
    } else {
      uniSelect = (
        <UniversityList
          universities={this.props.universities}
          onItemSelected={this.universitySelectedHandler}
        />
      );
    }
    if (this.props.isLoadingGroups) {
      progSelect = <ActivityIndicator color="#fff" />;
    } else {
      progSelect = (
        <UniversityList
          universities={this.props.programs}
          onItemSelected={this.programSelectedHandler}
        />
      );
    }

    if (this.state.step === 0) {
      /////0
      screen = (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <TouchableWithoutFeedback
              onPress={() => this.props.onChangeGroupState(0)}
            >
              <Icon
                size={30}
                name={
                  Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"
                }
                color="#fff"
                style={styles.backArrow}
              />
            </TouchableWithoutFeedback>
            <View style={styles.circleWrapper}>
              <View style={styles.circleG} />
              <View style={styles.circleB} />
              <View style={styles.circleB} />
              <View style={styles.circleB} />
              <View style={styles.circleB} />
            </View>
            <TouchableWithoutFeedback>
              <Icon
                size={30}
                name={
                  Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"
                }
                color={colors.blueColor}
                style={styles.backArrow}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.container2}>
            <View style={styles.headerWrapper}>
              <Text style={styles.header}>
                Select the university you currently attend
              </Text>
            </View>
            {uniSelect}
          </View>
        </View>
      );
    } else if (this.state.step === 1) {
      /////1
      screen = (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <TouchableWithoutFeedback onPress={() => this.backToUni()}>
              <Icon
                size={30}
                name={
                  Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"
                }
                color="#fff"
                style={styles.backArrow}
              />
            </TouchableWithoutFeedback>
            <View style={styles.circleWrapper}>
              <View style={styles.circleG} />
              <View style={styles.circleG} />
              <View style={styles.circleB} />
              <View style={styles.circleB} />
              <View style={styles.circleB} />
            </View>
            <TouchableWithoutFeedback>
              <Icon
                size={30}
                name={
                  Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"
                }
                color={colors.blueColor}
                style={styles.backArrow}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.container2}>
            <View style={styles.headerWrapper}>
              <Text style={styles.header}>
                Select the program you're enrolled in at {the}
                {this.state.uni}
              </Text>
            </View>
            {progSelect}
          </View>
        </View>
      );
    } else if (this.state.step === 2) {
      /////1
      screen = (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <TouchableWithoutFeedback onPress={() => this.backToProg()}>
              <Icon
                size={30}
                name={
                  Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"
                }
                color="#fff"
                style={styles.backArrow}
              />
            </TouchableWithoutFeedback>
            <View style={styles.circleWrapper}>
              <View style={styles.circleG} />
              <View style={styles.circleG} />
              <View style={styles.circleG} />
              <View style={styles.circleB} />
              <View style={styles.circleB} />
            </View>
            <TouchableWithoutFeedback>
              <Icon
                size={30}
                name={
                  Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"
                }
                color={colors.blueColor}
                style={styles.backArrow}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.container2}>
            <View style={styles.headerWrapper}>
              <Text style={styles.header}>
                What year did you START university?
              </Text>
            </View>
            <UniversityList
              universities={startYear}
              onItemSelected={this.yearSelectedHandler}
            />
          </View>
        </View>
      );
    } else if (this.state.step === 3) {
      /////2
      screen = (
        <View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between"
            }}
          >
            <TouchableWithoutFeedback onPress={() => this.backToYear()}>
              <Icon
                size={30}
                name={
                  Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"
                }
                color="#fff"
                style={styles.backArrow}
              />
            </TouchableWithoutFeedback>
            <View style={styles.circleWrapper}>
              <View style={styles.circleG} />
              <View style={styles.circleG} />
              <View style={styles.circleG} />
              <View style={styles.circleG} />
              <View style={styles.circleB} />
            </View>
            <TouchableWithoutFeedback>
              <Icon
                size={30}
                name={
                  Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"
                }
                color={colors.blueColor}
                style={styles.backArrow}
              />
            </TouchableWithoutFeedback>
          </View>

          <View style={styles.container}>
            <View style={styles.darkBlueWrapper}>
              <Text style={styles.white}>Are you {an}</Text>
              <Text style={styles.main}>{this.state.program}</Text>
              <Text style={styles.white}>student at {the}</Text>
              <Text style={styles.main}>{this.state.uni}</Text>
              <Text style={styles.white}>who began in</Text>
              <Text style={styles.main}>{this.state.startYear}?</Text>
            </View>

            <View style={styles.confirmationWrapper}>
              <View style={styles.bottomBox}>
                {/* <Text style={styles.notes}>
                You will NOT be able to change this information, please make
                sure it's correct
              </Text> */}
                <TouchableWithoutFeedback onPress={() => this.backToUni()}>
                  <View style={styles.iconWrapper}>
                    <View style={styles.imageWrapper}>
                      <Icon
                        size={38}
                        name="ios-close-circle-outline"
                        color="#fff"
                      />
                    </View>
                    <Text style={[styles.logoutText]}>No, go back</Text>
                  </View>
                </TouchableWithoutFeedback>

                <TouchableWithoutFeedback
                  onPress={() =>
                    this.yesContinue(this.state.programId, this.state.startYear)
                  }
                >
                  <View style={styles.iconWrapper}>
                    <View style={styles.imageWrapper}>
                      <Icon
                        size={38}
                        name="ios-checkmark-circle-outline"
                        color="#fff"
                      />
                    </View>
                    <Text style={[styles.logoutText]}>Yes, continue</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            </View>
          </View>
        </View>
      );
    }
    return <View>{screen}</View>;
  }
}

const mapStateToProps = state => {
  return {
    universities: state.groups.universities,
    programs: state.groups.programs,
    isLoadingGroups: state.ui.isLoadingGroups
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeGroupState: position => dispatch(changeGroupState(position)),
    onGetPrograms: id => dispatch(getPrograms(id)),
    onContinue: (programId, startYear) =>
      dispatch(cacheContinue(programId, startYear))
  };
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.blueColor,
    width: "100%"
  },
  container2: {
    paddingHorizontal: 20,
    paddingBottom: 20,
    backgroundColor: colors.blueColor,
    width: "100%"
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    color: colors.yellowColor,
    fontWeight: "700",
    fontSize: 25,
    padding: 10,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  headerWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  white: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "700",
    fontSize: 25,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  main: {
    textAlign: "center",
    color: colors.yellowColor,
    fontWeight: "700",
    fontSize: 25,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  backArrow: {
    paddingHorizontal: 10,
    paddingTop: 10
  },
  darkBlueWrapper: {
    backgroundColor: colors.darkBlue,
    paddingVertical: 20,
    borderRadius: 5,
    marginTop: 5
  },
  notes: {
    color: "#333",
    textAlign: "center",
    marginTop: 10,
    backgroundColor: "#fff",
    padding: 5,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    fontSize: 14
  },
  circleWrapper: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    marginTop: 10
  },
  circleG: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: colors.greenColor,
    margin: 8
  },
  circleB: {
    width: 15,
    height: 15,
    borderRadius: 15 / 2,
    backgroundColor: colors.darkBlue,
    margin: 8
  },
  /////
  bottomBox: {
    flex: 2,
    alignItems: "center",
    justifyContent: "flex-start",
    flexDirection: "column"
  },
  text: {
    color: "#fff",
    padding: 15,
    width: 300,
    fontWeight: "600",
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    textAlign: "center",
    marginBottom: 20
  },

  name: {
    fontWeight: "bold",
    fontSize: 25,
    color: colors.blueColor,
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  username: {
    fontWeight: "bold",
    fontSize: 25,
    color: colors.pinkColor,
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  iconWrapper: {
    width: "100%",
    //flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 30,
    backgroundColor: colors.darkBlue,
    borderRadius: 20
    // borderWidth: 1,
    // borderColor: colors.yellowColor
  },
  logoutText: {
    color: "#fff",
    //padding: 10,
    //width: 250,
    width: "70%",
    fontWeight: "500",
    fontSize: Dimensions.get("window").width > 330 ? 23 : 20,
    //textAlign: "center",
    //marginBottom: 20,
    //borderWidth: 1,
    borderColor: "#444",
    borderRadius: 0,
    letterSpacing: 1,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  imageWrapper: {
    width: "30%",
    alignItems: "flex-end",
    marginRight: 20
  },
  logo: {
    resizeMode: "contain",
    height: Dimensions.get("window").width > 330 ? 40 : 35,
    width: Dimensions.get("window").width > 330 ? 50 : 45,
    alignItems: "center"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupSelectUniversity);

// When someone adds you as a friend, they will not know if you accepted or rejected their request.
