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
  Image,
  Animated
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
import { getUserGroups } from "../../store/actions/groups";
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
      "Friends",
      "Friends Say Hello",
      firebase.notifications.Android.Importance.Max
    ).setDescription("Friends Say Hello");
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
            //.setVisibility(notification.VISIBILITY_PUBLIC)
            .android.setAutoCancel(true)
            .android.setShowWhen(true)
            .android.setChannelId("Friends") // e.g. the id you chose above
            .android.setSmallIcon("@mipmap/small_launcher")
            //.android.setLargeIcon("@mipmap/ic_launcher")
            .android.setColor(colors.greenColor) // you can set a color here
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
            tabIndex: 3
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
              tabIndex: 3
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
    if (Platform.OS === "ios") {
      this.props.getUserInfo(true);
    } else {
      this.props.getUserInfo(false);
    }

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

    this.props.getUserGroups();

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
      //title: "How it Works",
      backButtonTitle: "",
      passProps: {
        username: this.props.username,
        phone_number: this.props.phone_number,
        ios: this.props.ios
      }
    });

    this.increaseTap();
  };

  static navigatorStyle = {
    navBarHidden: true,
    navBarBackgroundColor: "#0088CA",
    statusBarColor: "#0088CA"
  };

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
    sliderValue: 10,
    helloAnim: new Animated.Value(0),
    catchUp: false,
    newFriend: false,
    iconCatchUp: false,
    iconNewFriend: false
  };
  // catchUp: false,
  // newFriend: false,
  // iconCatchUp: true,
  // iconNewFriend: true

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

  helloAnimation = () => {
    Animated.timing(this.state.helloAnim, {
      toValue: 1,
      duration: 1600
    }).start();
  };

  catchUp = () => {
    this.setState({
      catchUp: true,
      newFriend: false,
      iconCatchUp: true,
      iconNewFriend: false
    });
    this.helloAnimation();
  };

  newFriend = () => {
    this.setState({
      catchUp: false,
      newFriend: true,
      iconCatchUp: false,
      iconNewFriend: true
    });
    this.helloAnimation();
  };

  sayHello = () => {
    if (this.state.catchUp || this.state.newFriend) {
      alert("hi");
    }
  };

  render() {
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
    let toWho = null;

    if (this.state.catchUp) {
      toWho = <Text>to all my selected friends</Text>;
    }
    if (this.state.newFriend) {
      toWho = <Text>to everyone in my program</Text>;
    }

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
            <View style={styles.timeWrapper}>
              <Text style={styles.timeText}>How do you want to connect?</Text>
            </View>

            <View style={styles.hello}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.catchUp();
                }}
              >
                <View style={styles.selectionBox}>
                  <View
                    style={[
                      styles.leftBox,
                      styles.selectionBox1,
                      this.state.iconCatchUp ? styles.goPink : styles.default
                    ]}
                  >
                    <Icon size={50} name="ios-people" color="#fff" />
                  </View>
                  <View
                    style={[
                      styles.rightBox1,
                      this.state.catchUp ? styles.goPink : null
                    ]}
                  >
                    <Text style={styles.rightText1}>
                      Catch up with a friend
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>

              <TouchableWithoutFeedback
                onPress={() => {
                  this.newFriend();
                }}
              >
                <View style={styles.selectionBox}>
                  <View
                    style={[
                      styles.leftBox,
                      styles.selectionBox2,
                      this.state.iconNewFriend ? null : styles.default
                    ]}
                  >
                    <Icon size={50} name="ios-school" color="#fff" />
                  </View>
                  <View
                    style={[
                      styles.rightBox2,
                      this.state.newFriend ? styles.goGreen : null
                    ]}
                  >
                    <Text style={[styles.rightText]}>Make a new friend</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>

              {/* <HelloButton
                color={colors.yellowColor}
                onPress={() => this.callbutton()}
              /> */}
            </View>
            <Animated.View
              style={[
                styles.newHelloWrapper,
                { opacity: this.state.helloAnim }
              ]}
            >
              <GotIt
                onPress={() => this.sayHello()}
                backgroundColor={colors.yellowColor}
                color="#333"
                fontSize={25}
                width="80%"
              >
                SAY HELLO
              </GotIt>
            </Animated.View>
            <Text style={styles.lastConnected}>{toWho}</Text>
          </View>
        );
        // button finishes here - button is actually all of main wave screen

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
                <Text style={styles.notificationText}>
                  Allow notifications{" "}
                  <Text
                    style={styles.notificationHere}
                    onPress={this.appSettings}
                  >
                    here{" "}
                  </Text>
                  if you want to be notified when friends Say Hello
                </Text>
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
                  <Text style={styles.notificationHere}>
                    Allow Notifications{" "}
                  </Text>
                  if you want to be notified when friends Say Hello
                </Text>
              </View>
            );
          }
        }
        // You will not be notified when a friend Says Hello because you have disabled notifications.
        // Do you want to allow notifications from Wayvo?
        //

        // Hang tight you will receive a call from your first friend to Say Hello back.
      } else {
        button = (
          <CountDown
            until={this.props.seconds_left}
            onFinish={() => this.props.getLastCall()}
            // onPress={() =>
            //   Alert.alert(
            //     "Expect a call from the first friend to Say Hello back before this timer expires"
            //   )
            // }
            size={40}
            digitBgColor={colors.yellowColor}
            digitTxtColor="#333"
            timeTxtColor="#FFF"
            timeToShow={["M", "S"]}
          />
        );
        activeSign = (
          <View style={styles.usernameWrapper}>
            <Text style={styles.youActive}>You're Live</Text>
            <Text style={styles.timeExplanation}>
              Friends can Say Hello Back
            </Text>
            <Text style={styles.timeExplanation}>until time expires.</Text>
          </View>
        );

        activeInfo = (
          <View style={styles.connectedWrapper}>
            {/* <Text style={styles.activeInfo}>
              If connected, let your friend know whether you prefer a call to
              your phone number or a video calling app (e.g., FaceTime,
              Messenger).
            </Text> */}
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
                  <View style={{ paddingLeft: 15, padding: 10 }}>
                    {/* <Text style={styles.usernameText}>Wayvo</Text> */}
                    <Icon
                      size={30}
                      name={Platform.OS === "ios" ? "md-menu" : "md-menu"}
                      color="#f5f5f5"
                      //color={colors.yellowColor}
                    />
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
                      color="#f5f5f5"
                      //color={colors.yellowColor}
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
            {/* <View style={styles.usernameWrapper}>{activeSign}</View> */}
            {activeSign}
            {button}

            {/* active info includes last connected with and request to turn on notifications - include this in live screen */}
            {/* {activeInfo} */}
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
  selectionBox: {
    margin: 10,
    borderWidth: 0,
    borderColor: colors.pinkColor,
    width: "80%",
    //height: "80%",
    maxHeight: 110,
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 10,
    overflow: "hidden"
  },
  leftBox: {
    height: "100%",
    width: "25%",
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRightColor: colors.blueColor,
    borderRightWidth: 2
    //backgroundColor: colors.pinkColor
  },
  selectionBox1: {
    backgroundColor: colors.pinkColor
    // backgroundColor: "rgb(255, 90, 95)"
  },
  selectionBox2: {
    backgroundColor: colors.greenColor
  },
  rightBox1: {
    height: "100%",
    width: "75%",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center"
    backgroundColor: colors.darkBlue
  },
  rightBox2: {
    height: "100%",
    width: "75%",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center"
    backgroundColor: colors.darkBlue
  },
  default: {
    backgroundColor: colors.darkBlue
  },
  goPink: {
    // backgroundColor: colors.pinkColor
    backgroundColor: "#EF5350"
  },
  goGreen: {
    backgroundColor: colors.greenColor
  },
  rightText: {
    fontSize: 28,
    color: "#fff",
    letterSpacing: 1,
    fontWeight: "500",
    paddingHorizontal: 15
  },
  rightText1: {
    fontSize: 28,
    color: "#fff",
    letterSpacing: 1,
    fontWeight: "500",
    paddingHorizontal: 15
  },
  newHelloWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 5,
    width: "100%"
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
    height: "100%",
    width: "100%"
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
    //paddingTop: 20,
    //padding: 8,
    backgroundColor: colors.blueColor
  },
  hello: {
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
    width: "100%"
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
    padding: 15,
    paddingBottom: 5,
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  timeExplanation: {
    color: "#fff",
    fontSize: Dimensions.get("window").width > 330 ? 20 : 17,
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
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
    fontWeight: "800",
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
    alignSelf: "center",
    width: "100%"
  },
  timeWrapper: {
    //borderRadius: 3,
    backgroundColor: colors.darkBlue,
    //backgroundColor: "#222",
    //backgroundColor: "#0b68bd",
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 10,
    paddingBottom: 10,
    //borderColor: "rgba(1,125,185,0.3)",
    width: "100%"
  },
  timeText: {
    fontSize: Dimensions.get("window").width > 330 ? 24 : 19,
    fontWeight: "400",
    // color: colors.yellowColor,
    color: "#fff",
    textAlign: "center",
    letterSpacing: Dimensions.get("window").width > 330 ? 0.9 : 0.6,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  timeNumber: {
    //color: colors.yellowColor,
    fontSize: Dimensions.get("window").width > 330 ? 21 : 18,
    fontWeight: "700",
    letterSpacing: Dimensions.get("window").width > 330 ? 0.9 : 0.6,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
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
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  notificationText: {
    color: "#fff",
    fontSize: Dimensions.get("window").width > 330 ? 20 : 16,
    textAlign: "center",
    fontWeight: "400",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  notificationHere: {
    color: colors.greenColor,
    fontSize: Dimensions.get("window").width > 330 ? 20 : 17,
    fontWeight: "700",
    textAlign: "center",
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
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
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
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
    phone_number: state.users.phoneNumber,
    ios: state.users.ios
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
    getUserInfo: ios => dispatch(getUserInfo(ios)),
    getUserGroups: () => dispatch(getUserGroups())
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhoneScreen);
