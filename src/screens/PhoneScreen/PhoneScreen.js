import React, { Component } from "react";
import {
  View,
  StyleSheet,
  ActivityIndicator,
  Text,
  Platform,
  ScrollView,
  TouchableWithoutFeedback,
  RefreshControl,
  Button,
  StatusBar,
  TouchableNativeFeedback,
  Linking
} from "react-native";
import HelloButton from "../../components/UI/HelloButton";
import ChangeTime from "../../components/UI/ChangeTimeButton";
import { connect } from "react-redux";
import {
  outgoingCall,
  storeLastCall,
  resetLastCall
} from "../../store/actions/outgoingCalls";
import { getActiveFriends } from "../../store/actions/activeFriends";
import { getFriendRequests } from "../../store/actions/friends";
import { getPhoneNumber } from "../../store/actions/users";
import colors from "../../utils/styling";
import CountDown from "react-native-countdown-component";

import firebase from "react-native-firebase";
import SplashScreen from "react-native-splash-screen";
import Icon from "react-native-vector-icons/Ionicons";

class PhoneScreen extends Component {
  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel(
      "Contacts",
      "Contact Says Hello",
      firebase.notifications.Android.Importance.Max
    ).setDescription("Contact Says Hello");
    firebase.notifications().android.createChannel(channel);

    // the listener returns a function you can use to unsubscribe
    this.unsubscribeFromNotificationListener = firebase
      .notifications()
      .onNotification(notification => {
        if (Platform.OS === "android") {
          const localNotification = new firebase.notifications.Notification({
            sound: "default",
            show_in_foreground: true
          })
            .setNotificationId(notification.notificationId)
            .setTitle(notification.title)
            .setSubtitle(notification.subtitle)
            .setBody(notification.body)
            .setData(notification.data)
            .android.setChannelId("Contacts") // e.g. the id you chose above
            //.android.setSmallIcon("ic_stat_notification") // create this icon in Android Studio
            //.android.setColor("#000000") // you can set a color here
            .android.setPriority(firebase.notifications.Android.Priority.High);

          firebase
            .notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));
        } else if (Platform.OS === "ios") {
          const localNotification = new firebase.notifications.Notification()
            //.setNotificationId(notification.notificationId)
            .setTitle(notification.title)
            // .setSubtitle(notification.subtitle)
            .setBody(notification.body)
            .setData(notification.data)
            .ios.setBadge(notification.ios.badge);

          firebase
            .notifications()
            .displayNotification(localNotification)
            .catch(err => console.error(err));
        }
      });

    // listen for notifications
    this.notificationDisplayedListener = firebase
      .notifications()
      .onNotificationDisplayed((notification: Notification) => {
        //listens for notifications
        // Process your notification as required
        // ANDROID: Remote notifications do not contain the channel ID. You will have to specify this manually if you'd like to re-display the notification.
        this.props.onLoadActiveFriends();
      });
    this.notificationListener = firebase
      .notifications()
      .onNotification((notification: Notification) => {
        //listens for notifications
        // Process your notification as required
      });

    // notification opened listener in foreground/app running
    this.notificationOpenedListener = firebase
      .notifications()
      .onNotificationOpened((notificationOpen: NotificationOpen) => {
        // Get the action triggered by the notification being opened
        const action = notificationOpen.action;
        // Get information about the notification that was opened
        const notification: Notification = notificationOpen.notification;
        this.props.onLoadActiveFriends();
        console.log(action);

        //outgoing call notification
        if (notification.data.outgoing) {
          this.props.navigator.switchToTab({
            tabIndex: 2
          });
        }

        // friend request notification
        if (notification.data.friend) {
          this.props.navigator.switchToTab({
            tabIndex: 1
          });
          this.props.onLoadFriendRequests();
        }

        // someone accepted say hello
        if (notification.data.expect_call) {
          this.props.navigator.switchToTab({
            tabIndex: 0
          });
          this.props.getLastCall();
        }
      });

    /// app closed
    firebase
      .notifications()
      .getInitialNotification()
      .then((notificationOpen: NotificationOpen) => {
        // this.props.onLoadActiveFriends();
        if (notificationOpen) {
          // App was opened by a notification
          // Get the action triggered by the notification being opened
          const action = notificationOpen.action;
          // Get information about the notification that was opened
          const notification: Notification = notificationOpen.notification;

          //outgoing call notification
          if (notification.data.outgoing) {
            this.props.navigator.switchToTab({
              tabIndex: 2
            });
          }

          // friend request notification
          if (notification.data.friend) {
            this.props.navigator.switchToTab({
              tabIndex: 1
            });
            this.props.onLoadFriendRequests();
          }

          // someone accepted say hello
          if (notification.data.expect_call) {
            this.props.navigator.switchToTab({
              tabIndex: 0
            });
            this.props.getLastCall();
          }
        }
      })
      .catch(err => alert(err));

    this.props.getLastCall();
    this.props.storePhoneNumber();
    if (Platform.OS === "ios") {
      SplashScreen.hide();
    }

    ////////////////// permissions
    // firebase
    //   .messaging()
    //   .hasPermission()
    //   .then(enabled => {
    //     if (enabled) {
    //       alert("yup");
    //     } else {
    //       alert("nah");
    //       Linking.openURL("app-settings:");
    //     }
    //   });

    firebase
      .messaging()
      .requestPermission()
      .then(() => {})
      .catch(error => {
        alert("nah");
        //Linking.openURL("app-settings:");
      });

    //// end permissions
  }

  appSettings = () => {
    Linking.openURL("app-settings:");
  };

  componentWillUnmount() {
    //listen for notifications
    this.notificationDisplayedListener();
    this.notificationListener();

    //notification opened listener
    this.notificationOpenedListener();

    // this is where you unsubscribe
    this.unsubscribeFromNotificationListener();
  }

  callbutton = () => {
    this.props.onOutgoingCall(this.state.timeSelected);
    this.props.navigator.push({
      screen: "awesome-places.SaidHello"
    });
  };

  optionScreen = () => {
    this.props.navigator.push({
      screen: "awesome-places.OptionScreen",
      title: this.props.username,
      backButtonTitle: ""
    });
  };

  static navigatorStyle = {
    navBarHidden: true,
    navBarBackgroundColor: "#0088CA",
    statusBarColor: "#0088CA"
  };

  // static navigatorButtons = {
  //   rightButtons: [
  //     {
  //       title: "Wayvo", // for a textual button, provide the button title (label)
  //       id: "sideMenu", // id for this button, given in onNavigatorEvent(event) to help understand which button was clicked
  //       //showAsAction: "always",
  //       buttonColor: "#fff", // Optional, iOS only. Set color for the button (can also be used in setButtons function to set different button style programatically)
  //       buttonFontSize: 18, // Set font size for the button (can also be used in setButtons function to set different button style programatically)
  //       buttonFontWeight: "600" // Set font weight for the button (can also be used in setButtons function to set different button style programatically)
  //     }
  //   ]
  // };

  constructor(props) {
    super(props);
  }

  state = {
    timeSelected: 1,
    notificationsEnables: true,
    notificationPreference: true
  };

  changeTime = () => {
    if (this.state.timeSelected === 3) {
      this.setState({
        timeSelected: 0
      });
    } else {
      this.setState({
        timeSelected: this.state.timeSelected + 1
      });
    }
  };

  render() {
    let button = null;
    let content = null;
    let activeSign = null;
    let activeInfo = null;
    let hello = null;
    const timeOptions = [5, 15, 30, 60];

    if (this.props.connected_with) {
      connectedName = (
        <Text style={styles.connectedName}>{this.props.connected_with}</Text>
      );
      hello = (
        <View style={styles.hello}>
          <HelloButton
            color={colors.yellowColor}
            onPress={() => this.callbutton()}
          />
        </View>
      );
    } else {
      connectedName = <Text style={styles.connectedName}>...</Text>;
    }

    if (this.props.isLoadingHello) {
      button = <ActivityIndicator />;
    } else {
      if (this.props.seconds_left === null || this.props.can_say_hello) {
        button = (
          <View style={styles.wrapper}>
            <TouchableWithoutFeedback
              style={styles.button}
              onPress={this.changeTime}
            >
              <View>
                <Text style={styles.timeText}>
                  The first contact to respond within{" "}
                  <Text style={styles.timeNumber}>
                    {timeOptions[this.state.timeSelected]} minutes
                  </Text>{" "}
                  can call me
                </Text>
              </View>
            </TouchableWithoutFeedback>

            {/* Choose how long you want to be active  */}

            <View style={styles.hello}>
              <HelloButton
                color={colors.yellowColor}
                onPress={() => this.callbutton()}
              />
            </View>
          </View>
        );
        activeInfo = (
          <View style={styles.connectedWrapper}>
            <Text style={styles.lastConnected}>Last connected with:</Text>
            {connectedName}
          </View>
        );
        // You will not be notified when a contact Says Hello because you have disabled notifications.
        // Do you want to allow notifications from Wayvo?
        //

        // Hang tight you will receive a call from your first contact to Say Hello back.
      } else {
        button = (
          <CountDown
            until={this.props.seconds_left}
            onFinish={() => this.props.getLastCall()}
            size={40}
            digitBgColor={colors.yellowColor}
            digitTxtColor="#333"
            timeTxtColor="#FFF"
            timeToShow={["M", "S"]}
          />
        );
        activeSign = <Text style={styles.youActive}>You're Active!</Text>;

        activeInfo = (
          <View style={styles.connectedWrapper}>
            <Text style={styles.activeInfo}>
              Contacts will be able to Say Hello back until your time expires.
              You will receive a call from the first contact to Say Hello back.
            </Text>
          </View>
        );
      }
    }

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.props.isLoading}
            onRefresh={() => this.props.getLastCall()}
          />
        }
      >
        <StatusBar barStyle="light-content" backgroundColor="#0088CA" />

        <View style={styles.navBarWrapper}>
          <View style={styles.navBarContent}>
            <TouchableWithoutFeedback
              style={styles.usernameButton}
              onPress={() => this.optionScreen()}
            >
              <View style={styles.usernameView}>
                <Text style={styles.usernameText}>Wayvo</Text>
              </View>
            </TouchableWithoutFeedback>
            <TouchableWithoutFeedback
              style={styles.usernameButton}
              onPress={() => this.optionScreen()}
            >
              <View style={styles.infoButton}>
                <Icon
                  size={30}
                  name={
                    Platform.OS === "ios"
                      ? "ios-information-circle-outline"
                      : "md-information-circle-outline"
                  }
                  color="#fff"
                />
              </View>
            </TouchableWithoutFeedback>
          </View>
        </View>

        <View
          style={[
            styles.container2,
            this.props.seconds_left === null ||
            this.props.can_say_hello === true
              ? { backgroundColor: colors.blueColor }
              : { backgroundColor: colors.greenColor }
          ]}
        >
          {/* <View style={styles.usernameWrapper} /> */}
          <View style={styles.usernameWrapper}>{activeSign}</View>

          {button}

          {activeInfo}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0088CA"
  },
  navBarWrapper: {
    height: 80,
    backgroundColor: "#0088CA"
  },
  navBarContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  infoButton: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    marginTop: Platform.OS === "ios" ? 20 : 0,
    paddingRight: 15
  },
  container2: {
    flex: 1,
    padding: 20,
    backgroundColor: colors.blueColor
  },
  hello: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  usernameWrapper: {
    width: "100%",
    flex: 2,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  youActive: {
    color: "#fff",
    fontSize: 40,
    fontWeight: "900",
    backgroundColor: colors.greenColor,
    padding: 15
  },
  usernameView: {
    flex: 1,
    justifyContent: "flex-start"
  },
  usernameText: {
    fontSize: 25,
    color: "#fff",
    marginTop: Platform.OS === "ios" ? 20 : 0,
    padding: 10,
    fontWeight: "600"
  },
  usernameStyle: {
    color: colors.usernameColor,
    fontWeight: "bold",
    fontSize: 40,
    marginTop: Platform.OS === "ios" ? 20 : 0
  },
  button: {
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row"
  },
  wrapper: {
    flex: 4,
    flexDirection: "column",
    alignItems: "center",
    alignSelf: "center"
  },
  timeText: {
    //marginTop: 30,
    fontSize: 23,
    fontWeight: "700",
    color: "white",
    textAlign: "center"
  },
  timeNumber: {
    color: colors.yellowColor,
    fontWeight: "900",
    fontSize: 23
  },
  connectedWrapper: {
    flex: 3,
    justifyContent: "flex-end"
  },
  lastConnected: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center"
  },
  activeInfo: {
    color: "#fff",
    fontSize: 17,
    fontWeight: "400"
  },
  connectedName: {
    color: colors.greenColor,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center"
  }
});

const mapStateToProps = state => {
  return {
    isLoadingHello: state.ui.isLoadingHello,
    isLoading: state.ui.isLoading,
    seconds_left: state.outgoing.seconds_left,
    can_say_hello: state.outgoing.can_say_hello,
    connected_with: state.outgoing.connected_with,
    username: state.users.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOutgoingCall: seconds => dispatch(outgoingCall(seconds)),
    onLoadActiveFriends: () => dispatch(getActiveFriends()),
    onLoadFriendRequests: () => dispatch(getFriendRequests()),
    getLastCall: () => dispatch(storeLastCall()),
    onResetLastCall: () => dispatch(resetLastCall()),
    storePhoneNumber: () => dispatch(getPhoneNumber())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhoneScreen);
