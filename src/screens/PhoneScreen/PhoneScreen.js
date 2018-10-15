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
  Linking,
  Dimensions,
  SafeAreaView,
  Alert,
  NetInfo,
  Image
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
import { getPhoneNumber, getUserInfo } from "../../store/actions/users";
import colors from "../../utils/styling";
import CountDown from "react-native-countdown-component";

import firebase from "react-native-firebase";
import SplashScreen from "react-native-splash-screen";
import Icon from "react-native-vector-icons/Ionicons";
import GotIt from "../../components/UI/GotItButton";
import { AsyncStorage } from "react-native";

import OfflineNotice from "../../screens/OfflineNotice/OfflineNotice.js";

import Slider from "react-native-slider";

class PhoneScreen extends Component {
  componentDidMount() {
    const channel = new firebase.notifications.Android.Channel(
      "Contacts",
      "Contacts Say Hello",
      firebase.notifications.Android.Importance.Max
    ).setDescription("Contacts Say Hello");
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
            .android.setAutoCancel(true)
            .android.setChannelId("Contacts") // e.g. the id you chose above
            .android.setSmallIcon("ic_launcher")
            //.android.setSmallIcon("@mipmap/ic_custom_notif")
            // .android.setSmallIcon("ic_stat_notification") // create this icon in Android Studio
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
    //this.props.storePhoneNumber();
    this.props.getUserInfo();

    if (Platform.OS === "ios") {
      setTimeout(() => {
        SplashScreen.hide();
      }, 2500);
    }

    AsyncStorage.getItem("tour").then(tourStatus => {
      if (tourStatus === "finished") {
        this.setState({
          tapped: 2
        });
      } else {
        this.setState({
          tapped: 0
        });
      }
    });

    // alert(Dimensions.get("window").height);
  } //did mount end

  appSettings = () => {
    Linking.openURL("app-settings:");
    // change tab so when they come back, it refreshes
    this.props.navigator.switchToTab({
      tabIndex: 1
    });
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
    this.props.onOutgoingCall(this.state.sliderValue);
    this.props.navigator.push({
      screen: "awesome-places.SaidHello"
    });
  };

  optionScreen = () => {
    this.props.navigator.push({
      screen: "awesome-places.OptionScreen",
      backButtonTitle: "",
      passProps: {
        fullname: this.props.fullname,
        username: this.props.username,
        phone_number: this.props.phone_number
      }
    });
  };

  howItWorksScreen = () => {
    this.props.navigator.push({
      screen: "awesome-places.HowItWorks",
      //title: "How Wayvo Works",
      backButtonTitle: "",
      passProps: {
        username: this.props.username,
        phone_number: this.props.phone_number
      }
    });

    this.increaseTap();
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
    this.props.navigator.setOnNavigatorEvent(this.onNavigatorEvent);
  }

  onNavigatorEvent = event => {
    if (event.type === "ScreenChangedEvent") {
      if (event.id === "willAppear") {
        ////////////////// permissions

        firebase
          .messaging()
          .hasPermission()
          .then(enabled => {
            if (enabled) {
              this.setState({
                androidNotificationsEnabled: true
              });
            } else {
              this.setState({
                androidNotificationsEnabled: false
              });
            }
          });

        firebase
          .messaging()
          .requestPermission()
          .then(() => {
            this.setState({
              notificationsEnabled: true
            });
          })
          .catch(error => {
            this.setState({
              notificationsEnabled: false
            });

            //Linking.openURL("app-settings:");
          });

        //// end permissions
      }
    }
  };

  state = {
    timeSelected: 1,
    notificationsEnabled: true,
    androidNotificationsEnabled: true,
    tapped: 2,
    sliderValue: 20
  };

  onSliderChange = chosenValue => {
    this.setState({
      sliderValue: chosenValue
    });
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

    this.increaseTap();
  };

  increaseTap = () => {
    if (this.state.tapped < 2) {
      this.setState({
        tapped: this.state.tapped + 1
      });

      AsyncStorage.setItem("tour", "finished");
    }
  };

  lastTap = () => {
    this.setState({
      tapped: 6
    });
  };

  render() {
    let select = null;
    let button = null;
    let content = null;
    let activeSign = null;
    let activeInfo = null;
    let tapDescription = null;
    let navCover = null;
    let helloDescription = null;
    let helloBottomCover = null;
    let learnMore = null;
    let endTour = null;
    const timeOptions = [5, 15, 30, 60];

    select = (
      <Text style={styles.timeNumber}>
        {/* {timeOptions[this.state.timeSelected]} minutes */}
        {this.state.sliderValue} minutes
      </Text>
    );

    if (this.props.connected_with) {
      connectedName = (
        <Text style={styles.connectedName}>{this.props.connected_with}</Text>
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
              <View style={styles.timeWrapper}>
                <Text style={styles.timeText}>
                  The first contact to Say Hello Back within {select} can call
                  me
                  {/* Receive a call from the first contact to Say Hello back within{" "}
                  {select} */}
                </Text>
                <Slider
                  value={this.state.sliderValue}
                  minimumValue={10}
                  maximumValue={60}
                  step={1}
                  onValueChange={this.onSliderChange}
                  minimumTrackTintColor={colors.yellowColor}
                  maximumTrackTintColor={colors.blueColor}
                  thumbTintColor={colors.yellowColor}
                  style={{ marginTop: 3 }}

                  // thumbStyle={{ borderColor: colors.greenColor, borderWidth: 2 }}
                />
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
        if (Platform.OS === "ios") {
          if (this.state.notificationsEnabled) {
            activeInfo = (
              <View style={styles.connectedWrapper}>
                <Text style={styles.lastConnected}>Last connected with:</Text>
                {connectedName}
              </View>
            );
          } else {
            activeInfo = (
              <View style={styles.connectedWrapper}>
                <TouchableWithoutFeedback
                  //style={styles.button}
                  onPress={this.appSettings}
                >
                  <View>
                    <Text style={styles.notificationText}>
                      <Text style={styles.connectedName}>
                        Allow Notifications{" "}
                      </Text>
                      if you want to be notified when contacts Say Hello
                    </Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>
            );
          }
        } else {
          if (this.state.androidNotificationsEnabled) {
            activeInfo = (
              <View style={styles.connectedWrapper}>
                <Text style={styles.lastConnected}>Last connected with:</Text>
                {connectedName}
              </View>
            );
          } else {
            activeInfo = (
              <View style={styles.connectedWrapper}>
                <Text style={styles.notificationText}>
                  <Text style={styles.connectedName}>Allow Notifications </Text>
                  if you want to be notified when contacts Say Hello
                </Text>
              </View>
            );
          }
        }
        // You will not be notified when a contact Says Hello because you have disabled notifications.
        // Do you want to allow notifications from Wayvo?
        //

        // Hang tight you will receive a call from your first contact to Say Hello back.
      } else {
        button = (
          <CountDown
            until={this.props.seconds_left}
            onFinish={() => this.props.getLastCall()}
            // onPress={() =>
            //   Alert.alert(
            //     "Expect a call from the first contact to Say Hello back before this timer expires"
            //   )
            // }
            size={40}
            digitBgColor={colors.yellowColor}
            digitTxtColor="#333"
            timeTxtColor="#FFF"
            timeToShow={["M", "S"]}
          />
        );
        activeSign = <Text style={styles.youActive}>You're Active</Text>;

        activeInfo = (
          <View style={styles.connectedWrapper}>
            <Text style={styles.activeInfo}>
              Contacts can Say Hello Back until time expires.
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
        <StatusBar barStyle="light-content" backgroundColor={colors.darkBlue} />
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkBlue }}>
          {learnMore}

          {navCover}
          {tapDescription}

          {helloDescription}
          {helloBottomCover}

          {endTour}
          {/* <OfflineNotice /> */}
          <View style={styles.navBarWrapper}>
            <View style={styles.navBarContent}>
              <View style={styles.usernameView}>
                <TouchableWithoutFeedback
                  style={styles.usernameButton}
                  onPress={() => this.optionScreen()}
                >
                  <View>
                    <Text style={styles.usernameText}>Wayvo</Text>
                  </View>
                </TouchableWithoutFeedback>
              </View>

              <View style={styles.infoButton}>
                <TouchableWithoutFeedback
                  style={styles.usernameButton}
                  onPress={() => this.howItWorksScreen()}
                >
                  <View style={{ paddingLeft: 15, padding: 10 }}>
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
        </SafeAreaView>
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
    height: 70,
    backgroundColor: "#0088CA"
  },
  navBarContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "row",
    height: "100%"
  },
  infoButton: {
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
    //marginTop: Platform.OS === "ios" ? 20 : 0,
    paddingRight: 5
  },
  container2: {
    flex: 1,
    paddingBottom: 20,
    paddingTop: 20,
    padding: Dimensions.get("window").width > 330 ? 10 : 10,
    backgroundColor: colors.blueColor
  },
  hello: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1
  },
  helloDescription: {
    position: "absolute",
    //justifyContent: "center",
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.90)",
    width: "100%",
    justifyContent: "flex-end",
    height:
      Platform.OS === "ios"
        ? 80 + (Dimensions.get("window").height * 2) / 9
        : 60 + (Dimensions.get("window").height * 2) / 9
  },
  learnMore: {
    position: "absolute",
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.90)",
    width: "100%",
    height: "100%",
    justifyContent: "flex-start",
    marginTop: 80,
    textAlign: "right"
  },
  tapDescription: {
    position: "absolute",
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.90)",
    marginTop:
      Platform.OS === "ios"
        ? 75 + (Dimensions.get("window").height * 2) / 9
        : 55 + (Dimensions.get("window").height * 2) / 9,
    width: "100%",
    height: "100%"
  },
  navCover: {
    position: "absolute",
    //justifyContent: "center",
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.9)",
    width: "100%",
    height: 70
  },
  helloBottomCover: {
    position: "absolute",
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.90)",
    marginTop:
      Platform.OS === "ios"
        ? 90 +
          (Dimensions.get("window").height * 2) / 9 +
          Dimensions.get("window").width * 0.6
        : 70 +
          (Dimensions.get("window").height * 2) / 9 +
          Dimensions.get("window").width * 0.6,
    width: "100%",
    height: "100%"
  },
  firstHello: {
    alignItems: "center"
  },
  showTapText: {
    color: "#fff",
    fontSize: 25,
    textAlign: "center",
    padding: 5,
    fontWeight: "500"
  },
  learnTapText: {
    color: "#fff",
    fontSize: 25,
    textAlign: "right",
    fontWeight: "500",
    paddingRight: 15
  },
  endTour: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    position: "absolute",
    //justifyContent: "center",
    zIndex: 100,
    backgroundColor: "rgba(0,0,0,0.92)",
    width: "100%",
    height: "100%"
  },
  tourText: {
    color: "#FFF",
    fontSize: 30,
    fontWeight: "800",
    marginBottom: 40
  },
  usernameWrapper: {
    width: "100%",
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column"
  },
  youActive: {
    color: "#fff",
    fontSize: Dimensions.get("window").width > 330 ? 40 : 35,
    fontWeight: "900",
    backgroundColor: colors.greenColor,
    padding: 15
  },
  usernameView: {
    flex: 1,
    justifyContent: "flex-start",
    //alignSelf: "flex-start",
    flexDirection: "row"
  },
  usernameText: {
    fontSize: 25,
    color: "#fff",
    //marginTop: Platform.OS === "ios" ? 20 : 0,
    padding: 10,
    fontWeight: "600",
    letterSpacing: 1
  },
  usernameStyle: {
    color: colors.usernameColor,
    fontWeight: "bold",
    fontSize: 40
    //marginTop: Platform.OS === "ios" ? 20 : 0
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
  timeWrapper: {
    borderRadius: 3,
    backgroundColor: colors.darkBlue,
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 10,
    paddingBottom: 10
  },
  timeText: {
    //marginTop: 30,
    fontSize: Dimensions.get("window").width > 330 ? 20 : 17,
    fontWeight: "700",
    color: "white",
    textAlign: "center"
    //borderColor: "#FFF",
    //borderWidth: 1,

    //padding: 2
  },
  timeNumber: {
    color: colors.yellowColor,
    //fontWeight: "900",
    fontSize: Dimensions.get("window").width > 330 ? 20 : 17
  },
  timeNumberSelect: {
    color: "#555",
    fontWeight: "900",
    fontSize: Dimensions.get("window").width > 330 ? 20 : 17,
    backgroundColor: colors.yellowColor
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
  notificationText: {
    color: "#fff",
    fontSize: 20,
    textAlign: "center"
  },
  activeInfo: {
    color: "#fff",
    fontSize: Dimensions.get("window").width > 330 ? 16 : 14,
    fontWeight: "400"
    //textAlign: "center"
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
    username: state.users.username,
    fullname: state.users.fullname,
    phone_number: state.users.phoneNumber
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOutgoingCall: seconds => dispatch(outgoingCall(seconds)),
    onLoadActiveFriends: () => dispatch(getActiveFriends()),
    onLoadFriendRequests: () => dispatch(getFriendRequests()),
    getLastCall: () => dispatch(storeLastCall()),
    onResetLastCall: () => dispatch(resetLastCall()),
    storePhoneNumber: () => dispatch(getPhoneNumber()),
    getUserInfo: () => dispatch(getUserInfo())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhoneScreen);
