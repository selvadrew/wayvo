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

import { setExplodingOfferForPlan } from "../../store/actions/plans";

class PlanExplodingOffer extends Component {
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

  componentDidMount() {
    if (this.props.timeTillPlan >= 240) {
      this.setState({
        show5min: false,
        show30min: true,
        show1hr: true,
        show4hrs: true
      });
    } else if (this.props.timeTillPlan >= 60) {
      this.setState({
        show5min: false,
        show30min: true,
        show1hr: true,
        show4hrs: false
      });
    } else if (this.props.timeTillPlan >= 30) {
      this.setState({
        show5min: false,
        show30min: true,
        show1hr: false,
        show4hrs: false
      });
    } else if (this.props.timeTillPlan < 30) {
      this.setState({
        show5min: true,
        show30min: false,
        show1hr: false,
        show4hrs: false
      });
    }
  }

  state = {
    show5min: null,
    show30min: null,
    show1hr: null,
    show4hrs: null
  };

  timePressed = timer => {
    this.props.onSetExplodingOfferForPlan(timer);

    this.props.navigator.push({
      screen: "awesome-places.PlanSendInvite",
      backButtonTitle: "",
      title: ""
    });
  };

  render() {
    let _5m = null;
    let _30m = null;
    let _1hr = null;
    let _4hrs = null;

    if (this.state.show5min) {
      _5m = (
        <TouchableOpacity onPress={() => this.timePressed(0)}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.button}>5 min</Text>
          </View>
        </TouchableOpacity>
      );
    }

    if (this.state.show30min) {
      _30m = (
        <TouchableOpacity onPress={() => this.timePressed(2)}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.button}>30 min</Text>
          </View>
        </TouchableOpacity>
      );
    }
    if (this.state.show1hr) {
      _1hr = (
        <TouchableOpacity onPress={() => this.timePressed(3)}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.button}>1 hr</Text>
          </View>
        </TouchableOpacity>
      );
    }
    if (this.state.show4hrs) {
      _4hrs = (
        <TouchableOpacity onPress={() => this.timePressed(4)}>
          <View style={styles.buttonWrapper}>
            <Text style={styles.button}>4 hrs</Text>
          </View>
        </TouchableOpacity>
      );
    }

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
      >
        <View>
          <Text style={styles.header}>
            How much time do you want to give members to respond?
          </Text>
          <View style={styles.topRow}>
            <View style={styles.addWrapper}>
              {_5m}
              <TouchableOpacity onPress={() => this.timePressed(1)}>
                <View style={styles.buttonWrapper}>
                  <Text style={styles.button}>10 min</Text>
                </View>
              </TouchableOpacity>
              {_30m}
              {_1hr}
              {_4hrs}
            </View>
          </View>
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
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    color: "#111",
    fontWeight: "400",
    padding: 14,
    letterSpacing: 0.6,
    marginBottom: 10,
    textAlign: "center"
  },
  border: {},
  topRow: {
    flexDirection: "row"
  },
  addWrapper: {
    width: "100%",
    alignItems: "flex-start",
    justifyContent: "space-around",
    flexDirection: "row"
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
    onSetExplodingOfferForPlan: timer =>
      dispatch(setExplodingOfferForPlan(timer))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(PlanExplodingOffer);
