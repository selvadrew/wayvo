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
  Button
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

class PhoneScreen extends Component {
  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel(
      "Friends",
      "Friend Says Hello",
      firebase.notifications.Android.Importance.Max
    ).setDescription("Friends who Say Hello");
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
            .android.setChannelId("Friends") // e.g. the id you chose above
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
  }

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
      backButtonTitle: ""
    });
  };

  static navigatorStyle = {
    navBarHidden: true
  };
  constructor(props) {
    super(props);
  }

  state = {
    timeSelected: 1
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
    const timeOptions = [5, 15, 30, 60];

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
                  can call me.
                </Text>
              </View>
            </TouchableWithoutFeedback>

            <View style={styles.hello}>
              <HelloButton
                color={colors.yellowColor}
                onPress={() => this.callbutton()}
              />
            </View>
          </View>
        );
      } else {
        button = (
          <CountDown
            until={this.props.seconds_left}
            onFinish={() => this.props.getLastCall()}
            onPress={() => alert("hello")}
            size={40}
            digitBgColor={colors.yellowColor}
            digitTxtColor="#333"
            timeTxtColor="#FFF"
            timeToShow={["M", "S"]}
          />
        );
      }
    }

    if (this.props.connected_with) {
      connectedName = (
        <Text style={styles.connectedName}>{this.props.connected_with}</Text>
      );
    } else {
      connectedName = <Text style={styles.connectedName}>...</Text>;
    }

    return (
      <ScrollView
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.props.isLoading}
            onRefresh={() => this.props.getLastCall()}
          />
        }
      >
        <View style={styles.usernameWrapper}>
          {/* <Text style={styles.usernameStyle}>selvadrew</Text> */}
          <Button title="username" onPress={() => this.optionScreen()} />
        </View>

        {button}

        <View style={styles.connectedWrapper}>
          <Text style={styles.lastConnected}>Last connected with:</Text>
          {connectedName}
        </View>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
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
    // borderBottomWidth: 5,
    // borderBottomColor: "green"
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
    flex: 6,
    alignItems: "center",
    alignSelf: "center"
  },
  timeText: {
    paddingTop: 30,
    fontSize: 23,
    color: "white",
    textAlign: "center"
  },
  timeNumber: {
    color: colors.yellowColor,
    fontWeight: "900"
  },
  connectedWrapper: {
    flex: 1,
    justifyContent: "flex-end"
  },
  lastConnected: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center"
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
    connected_with: state.outgoing.connected_with
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
