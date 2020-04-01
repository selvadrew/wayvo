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
  Animated,
  Modal,
  TouchableHighlight,
  TouchableOpacity
} from "react-native";
import HelloButton from "../../components/UI/HelloButton";
import ChangeTime from "../../components/UI/ChangeTimeButton";
import { connect } from "react-redux";
import {
  outgoingCall,
  storeLastCall,
  resetLastCall
} from "../../store/actions/outgoingCalls";
import { outgoingGroupCall } from "../../store/actions/groups";
import { outgoingCustomGroupCall } from "../../store/actions/customGroups";
import { getActiveFriends } from "../../store/actions/activeFriends";
import { getActivePlans } from "../../store/actions/activePlans";
import { getFriendRequests } from "../../store/actions/friends";
import { getPhoneNumber, getUserInfo, getContactsFromStorage } from "../../store/actions/users";
import {
  getUserGroups,
  checkIfUserLiveGroups
} from "../../store/actions/groups";
import { setGroupForPlan } from "../../store/actions/plans";
import colors from "../../utils/styling";
import CountDown from "react-native-countdown-component";

import firebase from "react-native-firebase";
import SplashScreen from "react-native-splash-screen";
import Icon from "react-native-vector-icons/Ionicons";
import GotIt from "../../components/UI/GotItButton";
import { AsyncStorage } from "react-native";
import ModalGroupsList from "../../components/GroupsList/ModalGroupsList";
import { getActiveGroups } from "../../store/actions/activeGroups";

import Phrases from "../../components/Phrases/Phrases";

// import Slider from "react-native-slider";

import { ActionCable, Cable } from "@kesha-antonov/react-native-action-cable";
import TimeZone from 'react-native-timezone';


class PhoneScreen extends Component {
  componentDidMount() {
    getTimeZone = async () => {
      const timeZone = await TimeZone.getTimeZone().then(zone => zone);
      console.log({ timeZone });
    }
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
        this.props.onLoadActivePlans();
        this.props.onLoadActiveGroups();
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
        this.props.onLoadActivePlans();
        this.props.onLoadActiveGroups();
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

        // group tab notification
        if (notification.data.group) {
          this.props.navigator.switchToTab({
            tabIndex: 2
          });
          this.props.getUserGroups();
        }

        // someone accepted say hello
        if (notification.data.expect_call) {
          this.props.navigator.switchToTab({
            tabIndex: 0
          });
          this.props.getLastCall();
          Alert.alert(`Expect a call shortly. A friend Said Hello Back!`);
        }

        if (notification.data.expect_group_call) {
          this.props.navigator.switchToTab({
            tabIndex: 0
          });
          this.props.checkIfUserLiveGroups();
          Alert.alert("Expect a call shortly. Someone Said Hello Back!");
        }
      });

    /// app closed
    firebase
      .notifications()
      .getInitialNotification()
      .then((notificationOpen: NotificationOpen) => {
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

          // group tab notification
          if (notification.data.group) {
            this.props.navigator.switchToTab({
              tabIndex: 2
            });
            this.props.getUserGroups();
          }

          // someone accepted say hello
          if (notification.data.expect_call) {
            this.props.navigator.switchToTab({
              tabIndex: 0
            });
            this.props.getLastCall();
            Alert.alert(`Expect a call shortly. A friend Said Hello Back!`);
          }

          if (notification.data.expect_group_call) {
            this.props.navigator.switchToTab({
              tabIndex: 0
            });
            this.props.checkIfUserLiveGroups();
            Alert.alert("Expect a call shortly. Someone Said Hello Back!");
          }
        }
      })
      .catch(err => alert(err));

    this.props.getLastCall();
    this.props.checkIfUserLiveGroups();
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

    this.props.getUserGroups();

    // alert(Dimensions.get("window").height);

    this.props.getContactsFromStorage()

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
  }

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
    iconNewFriend: false,
    modalVisible: false,
    planModalVisible: false,
    selectedGroupID: null,
    selectedGroupType: null,
    selectedGroupName: null
  };

  defaultButtons = () => {
    // Animated.timing(this.state.helloAnim, {
    //   toValue: 0,
    //   duration: 800
    // }).start();
    this.setState({
      catchUp: false,
      newFriend: false,
      iconCatchUp: false,
      iconNewFriend: false,
      helloAnim: new Animated.Value(0)
    });
  };

  setModalVisible(visible) {
    this.setState({ modalVisible: visible });
  }
  setPlanModalVisible(visible) {
    this.setState({ planModalVisible: visible });
  }

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
      iconNewFriend: false,
      selectedGroupType: null
    });
    this.helloAnimation();
  };

  // checkStatus = is_start_plan => {
  //   if (!this.props.verified && !this.props.submitted) {
  //     Alert.alert(
  //       "Wayvo Groups",
  //       "You need to join your university and get verified to use this feature.",
  //       [
  //         {
  //           text: "Cancel",
  //           onPress: () => console.log("Cancel Pressed"),
  //           style: "cancel"
  //         },
  //         {
  //           text: "Learn more",
  //           onPress: () => {
  //             this.props.navigator.switchToTab({
  //               tabIndex: 2
  //             });
  //           },
  //           style: "default"
  //         }
  //       ],
  //       { cancelable: true }
  //     );
  //   } else if (!this.props.verified && this.props.submitted) {
  //     Alert.alert(
  //       "We are reviewing your submission for access to Wayvo Groups. ",
  //       "You will hear back within 24 hours."
  //     );
  //   } else if (this.props.verified) {
  //     if (is_start_plan) {
  //       this.startPlan();
  //     } else {
  //       this.newFriend();
  //     }
  //   } else {
  //     Alert.alert("Sorry, there was an error.");
  //   }
  // };


  checkStatus = is_start_plan => {
    Alert.alert(
      "Wayvo Plans",
      "Due to COVID-19, we have disabled this feature until further notice",
    )
  };

  newFriend = () => {
    if (this.props.groups) {
      this.setModalVisible(true);

      Animated.timing(this.state.helloAnim, {
        toValue: 0,
        duration: 800
      }).start();
      this.setState({
        catchUp: false,
        newFriend: false,
        iconCatchUp: false,
        iconNewFriend: false
      });
    } else {
      Alert.alert("Sorry there was an error, check your internet connection");
    }
  };

  startPlan = () => {
    if (this.props.groups) {
      this.setPlanModalVisible(true);

      Animated.timing(this.state.helloAnim, {
        toValue: 0,
        duration: 800
      }).start();
      this.setState({
        catchUp: false,
        newFriend: false,
        iconCatchUp: false,
        iconNewFriend: false
      });
    } else {
      Alert.alert("Sorry there was an error, check your internet connection");
    }
  };

  groupSelected = (id, value, type) => {
    this.setState({
      catchUp: false,
      newFriend: true,
      iconCatchUp: false,
      iconNewFriend: true,
      selectedGroupID: id,
      selectedGroupType: type,
      selectedGroupName: value
    });
    this.setModalVisible(!this.state.modalVisible);

    this.helloAnimation();
  };

  plansGroupSelected = (id, value, type) => {
    this.setPlanModalVisible(!this.state.planModalVisible);
    this.props.onSetGroupForPlan(id, value, type);
    this.props.navigator.push({
      screen: "awesome-places.PlanActivitySelection",
      backButtonTitle: "",
      title: "Select Activity",
      passProps: {
        group_name: value
      }
    });
  };

  saidHelloCatchUp = () => {
    this.props.onOutgoingCall(this.state.sliderValue);
    this.props.navigator.push({
      screen: "awesome-places.SaidHello"
    });
  };

  saidHelloNewFriend = () => {
    this.props.onOutgoingGroupCall(this.state.selectedGroupID);
    this.props.navigator.push({
      screen: "awesome-places.SaidHelloGroups"
    });
  };

  saidHelloCustomGroupNewFriend = () => {
    this.props.onOutgoingCustomGroupCall(this.state.selectedGroupID);
    this.props.navigator.push({
      screen: "awesome-places.SaidHelloGroups"
    });
  };

  sayHello = () => {
    if (this.state.catchUp) {
      this.saidHelloCatchUp();
    } else if (this.state.newFriend && this.state.selectedGroupType == 0) {
      this.saidHelloNewFriend();
    } else if (this.state.newFriend && this.state.selectedGroupID) {
      this.saidHelloCustomGroupNewFriend();
    }
  };

  render() {
    let button = null;
    let content = null;
    let activeSign = null;
    let liveVersion = null;
    let activeInfo = null;
    let tapDescription = null;
    let navCover = null;
    let helloDescription = null;
    let helloBottomCover = null;
    let learnMore = null;
    let endTour = null;
    const timeOptions = [5, 15, 30, 60];
    let toWho = null;
    let dots = null;
    let verifiedStatus = null;
    let planWithVerifiedStatus = null;

    if (this.state.catchUp) {
      toWho = <Text>to my friends</Text>;
    }
    if (this.state.selectedGroupType == 0) {
      toWho = <Text>to everyone in my program</Text>;
    } else if (this.state.selectedGroupType) {
      if (this.state.selectedGroupName.length > 20) {
        dots = "...";
      }
      toWho = (
        <Text>
          to everyone in {this.state.selectedGroupName.substring(0, 20)}
          {dots}
        </Text>
      );
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
      if (
        (this.props.seconds_left === null &&
          this.props.seconds_left_groups === null) ||
        (this.props.can_say_hello && this.props.can_say_hello_groups)
      ) {
        button = (
          <View style={styles.wrapper}>
            <View style={styles.hello}>
              <TouchableWithoutFeedback
                onPress={() => {
                  this.checkStatus(true);
                }}
              >
                <View style={styles.selectionBox}>
                  <View
                    style={[
                      styles.leftBox,
                      styles.selectionBox2,
                      styles.default,
                      styles.orange
                    ]}
                  >
                    <Icon size={55} name="ios-pin" color="#fff" />
                  </View>
                  <View style={[styles.rightBox2, styles.orange]}>
                    <Text style={[styles.rightText]}>Start a plan</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>



              <TouchableWithoutFeedback
                onPress={() => this.props.navigator.push({
                  screen: "awesome-places.Contacts",
                  backButtonTitle: "",
                })}
              >
                <View style={styles.selectionBox}>
                  <View
                    style={[
                      styles.leftBox,
                      styles.selectionBox1,
                      styles.green
                    ]}
                  >
                    <Icon size={50} name="ios-call" color="#fff" />
                  </View>
                  <View
                    style={[
                      styles.rightBox1,
                      styles.green
                    ]}
                  >
                    <Text style={styles.rightText1}>
                      Catch up with a friend
                    </Text>
                  </View>
                </View>
              </TouchableWithoutFeedback>

              {/* <TouchableWithoutFeedback
                onPress={() => {
                  this.checkStatus(false);
                }}
              >
                <View style={styles.selectionBox}>
                  <View
                    style={[
                      styles.leftBox,
                      styles.selectionBox2,
                      styles.green
                    ]}
                  >
                    <Icon size={50} name="ios-chatboxes" color="#fff" />
                  </View>
                  <View
                    style={[
                      styles.rightBox2,
                      styles.green
                    ]}
                  >
                    <Text style={[styles.rightText]}>Make a new friend</Text>
                  </View>
                </View>
              </TouchableWithoutFeedback> */}

            </View>
            <Animated.View
              style={[
                styles.newHelloWrapper,
                { opacity: this.state.helloAnim }
              ]}
            >
              <GotIt
                onPress={() => {
                  this.sayHello();
                  this.defaultButtons();
                }}
                backgroundColor={colors.yellowColor}
                color="#333"
                fontSize={25}
                width="80%"
              >
                SAY HELLO
              </GotIt>
              <Text style={styles.lastConnected}>{toWho}</Text>
            </Animated.View>
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
        button = null;
        // (
        //   <CountDown
        //     until={this.props.seconds_left}
        //     onFinish={() => this.props.getLastCall()}
        //     // onPress={() =>
        //     //   Alert.alert(
        //     //     "Expect a call from the first friend to Say Hello back before this timer expires"
        //     //   )
        //     // }
        //     size={40}
        //     digitBgColor={colors.yellowColor}
        //     digitTxtColor="#333"
        //     timeTxtColor="#FFF"
        //     timeToShow={["M", "S"]}
        //   />
        // );
        if (this.props.seconds_left_groups) {
          liveVersion = (
            <Text style={styles.timeExplanation}>
              The group members you have not yet met have been notified. The
              first one to Say Hello Back before time expires gets to call you.
            </Text>
          );
          activeSign = (
            <View style={styles.usernameWrapper}>
              <Text style={styles.youActive}>You're Live</Text>
              {liveVersion}
              <CountDown
                until={this.props.seconds_left_groups}
                onFinish={() => {
                  this.props.checkIfUserLiveGroups();
                  this.defaultButtons();
                }}
                size={40}
                digitBgColor={colors.yellowColor}
                digitTxtColor="#333"
                timeLabelStyle={{ color: "#fff" }}
                timeTxtColor="#FFF"
                timeToShow={["M", "S"]}
                style={styles.countdown}
              />
            </View>
          );
        } else {
          liveVersion = (
            <Text style={styles.timeExplanationBig}>
              Your friends have been notified. The first friend to Say Hello
              Back before time expires gets to call you.
            </Text>
          );
          activeSign = (
            <View style={styles.usernameWrapper}>
              <Text style={styles.youActive}>You're Live</Text>
              {liveVersion}
              <CountDown
                until={this.props.seconds_left}
                onFinish={() => {
                  this.props.getLastCall();
                  this.defaultButtons();
                }}
                size={40}
                digitStyle={{ backgroundColor: colors.yellowColor }}
                digitTxtColor="#333"
                digitTxtStyle={{ color: "#333", fontFamily: Platform.OS === "android" ? "Roboto" : null }}
                timeLabelStyle={{ color: "#fff" }}
                timeTxtColor="#FFF"
                timeToShow={["M", "S"]}
                style={styles.countdown}
              />
            </View>
          );
        }

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

    if (this.props.verified) {
      verifiedStatus = (
        <View>
          <View style={styles.xWrapper}>
            <TouchableWithoutFeedback
              onPress={() => this.setModalVisible(false)}
            >
              <Icon size={30} name={"md-close-circle"} color={"#555"} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.verifiedWrapper}>
            <View style={styles.modalTitleWrapper}>
              <Text style={styles.modalTitle}>
                From which group do you want to make a new friend?
              </Text>
            </View>

            <ModalGroupsList
              groups={this.props.groups}
              onItemSelected={(id, value, type) =>
                this.groupSelected(id, value, type)
              }
            />
          </View>
        </View>
      );
      planWithVerifiedStatus = (
        <View>
          <View style={styles.xWrapper}>
            <TouchableWithoutFeedback
              onPress={() => this.setPlanModalVisible(false)}
            >
              <Icon size={30} name={"md-close-circle"} color={"#555"} />
            </TouchableWithoutFeedback>
          </View>
          <View style={styles.verifiedWrapper}>
            <View style={styles.modalTitleWrapper}>
              <Text style={styles.modalTitle}>
                Select a group to start a plan with
              </Text>
            </View>

            <ModalGroupsList
              groups={this.props.groups}
              onItemSelected={(id, value, type) =>
                this.plansGroupSelected(id, value, type)
              }
            />
          </View>
        </View>
      );
    } else {
      verifiedStatus = <Text>Sorry, there was an error</Text>;
      planWithVerifiedStatus = <Text>Sorry, there was an error</Text>;
    }

    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
        refreshControl={
          <RefreshControl
            refreshing={this.props.isLoading}
            onRefresh={() => {
              this.props.getLastCall();
              this.props.checkIfUserLiveGroups();
            }}
          />
        }
      >
        <StatusBar barStyle="light-content" backgroundColor={colors.darkBlue} />
        <SafeAreaView style={{ flex: 1, backgroundColor: colors.darkBlue }}>
          {/* modal */}

          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
            onRequestClose={() => {
              this.setModalVisible(!this.state.modalVisible);
            }}
          >
            <View style={styles.modalWrapper}>
              <View style={styles.modal}>
                <View>{verifiedStatus}</View>
              </View>
            </View>
          </Modal>

          {/* modal end */}

          {/* plan modal */}
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.planModalVisible}
            onRequestClose={() => {
              this.setPlanModalVisible(!this.state.planModalVisible);
            }}
          >
            <View style={styles.modalWrapper}>
              <View style={styles.modal}>
                <View>{planWithVerifiedStatus}</View>
              </View>
            </View>
          </Modal>
          {/* modal end */}

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
              (this.props.seconds_left === null &&
                this.props.seconds_left_groups === null) ||
                (this.props.can_say_hello && this.props.can_say_hello_groups)
                ? { backgroundColor: "#F0F1F5" }
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
  modalWrapper: {
    backgroundColor: "rgba(0,0,0,0.7)",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center"
  },
  closeButtonWrapper: {
    alignContent: "flex-end"
  },
  notVerifiedWrapper: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: "#FAFAFA"
  },
  verifiedWrapper: {
    padding: 20,
    paddingTop: 0,
    backgroundColor: "#FAFAFA",
    borderRadius: 5
    //overflow: "hidden"
  },
  xWrapper: {
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#FAFAFA",
    paddingRight: 5,
    paddingTop: 3
  },
  modalTitleWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#777"
  },
  modalTitle: {
    fontSize: 20,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    letterSpacing: 0.5,
    paddingBottom: 8,
    color: "#333",
    fontWeight: "700",
    textAlign: "center"
  },
  modal: {
    backgroundColor: "#fff",
    width: "85%",
    //height: "60%",
    borderRadius: 8,
    overflow: "hidden"
  },
  selectionBox: {
    margin: 10,
    borderWidth: 0,
    borderColor: colors.pinkColor,
    width: "80%",
    //height: "80%",
    maxHeight: 120,
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
    borderRightColor: "#fff",
    borderRightWidth: 0.5
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
    backgroundColor: colors.blueColor
  },
  rightBox2: {
    height: "100%",
    width: "75%",
    flexDirection: "column",
    justifyContent: "center",
    // alignItems: "center"
  },
  orange: {
    backgroundColor: colors.orange
  },
  green: {
    backgroundColor: colors.greenColor
  },
  red: {
    backgroundColor: "#ff6159"
  },
  default: {
    backgroundColor: colors.blueColor
  },
  goPink: {
    backgroundColor: colors.pinkColor
    //backgroundColor: "#ff7227"
  },
  goGreen: {
    backgroundColor: colors.greenColor
  },
  rightText: {
    fontSize: 28,
    color: "#fff",
    letterSpacing: 1,
    fontWeight: Platform.OS === "ios" ? "700" : "600",
    paddingHorizontal: 15,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  rightText1: {
    fontSize: 28,
    color: "#fff",
    letterSpacing: 1,
    fontWeight: Platform.OS === "ios" ? "700" : "600",
    paddingHorizontal: 15,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  newHelloWrapper: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: 5,
    width: "100%"
  },
  navBarWrapper: {
    height: 70,
    backgroundColor: colors.darkBlue
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
    paddingBottom: 10,
    //paddingTop: 20,
    //padding: 8,
    backgroundColor: colors.blueColor
  },
  hello: {
    alignItems: "center",
    justifyContent: "center",
    flex: 2,
    width: "100%",
    marginTop: 10
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
    marginTop: 50
    // alignItems: "center",
    // justifyContent: "center",
    // flexDirection: "column"
  },
  youActive: {
    color: "#fff",
    fontSize: Dimensions.get("window").width > 330 ? 40 : 35,
    fontWeight: "900",
    backgroundColor: colors.greenColor,
    padding: 15,
    paddingVertical: 5,
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  timeExplanation: {
    color: "#fff",
    fontSize: Dimensions.get("window").width > 330 ? 17 : 17,
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    paddingHorizontal: 15
  },
  timeExplanationBig: {
    color: "#fff",
    fontSize: Dimensions.get("window").width > 330 ? 19 : 17,
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    paddingHorizontal: 20
  },
  countdown: {
    marginTop: 40
  },
  usernameView: {
    flex: 1,
    justifyContent: "flex-start",
    //alignSelf: "flex-start",
    flexDirection: "row"
  },
  usernameText: {
    fontSize: 25,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    color: "#fff",
    //marginTop: Platform.OS === "ios" ? 20 : 0,
    padding: 10,
    fontWeight: "800",
    letterSpacing: 1
  },
  usernameStyle: {
    color: colors.usernameColor,
    fontWeight: "bold",
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
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
    backgroundColor: colors.blueColor,
    //backgroundColor: "#222",
    //backgroundColor: "#0b68bd",
    paddingRight: 8,
    paddingLeft: 8,
    paddingTop: 20,
    paddingBottom: 10,
    //borderColor: "rgba(1,125,185,0.3)",
    width: "100%"
  },
  timeText: {
    fontSize: Dimensions.get("window").width > 330 ? 23 : 19,
    fontWeight: "400",
    //color: "#333",
    color: "#fff",
    backgroundColor: colors.blueColor,
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
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    backgroundColor: colors.yellowColor
  },
  connectedWrapper: {
    flex: 3,
    justifyContent: "flex-end"
  },
  lastConnected: {
    color: "#797E88",
    fontSize: 16,
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    marginTop: 5
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
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    fontWeight: "400"
    //textAlign: "center"
  },
  connectedName: {
    color: colors.greenColor,
    fontSize: 20,
    fontWeight: "900",
    textAlign: "center",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  weeklyWrapper: {
    //margin: 10,
    borderWidth: 0,
    backgroundColor: "#fff",
    width: "100%",
    //height: "80%",
    maxHeight: 50,
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 0,
    overflow: "hidden"
  },
  weeklyText: {
    fontSize: 20
  },
  pizza: {
    transform: [{ rotate: '180deg' }]
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
    ios: state.users.ios,
    verified: state.users.verified,
    submitted: state.users.submitted,
    groups: state.groups.userGroups,
    // youLiveGroups: state.ui.groups
    seconds_left_groups: state.groups.seconds_left_groups,
    can_say_hello_groups: state.groups.can_say_hello_groups
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onOutgoingCall: seconds => dispatch(outgoingCall(seconds)),
    onOutgoingGroupCall: programId => dispatch(outgoingGroupCall(programId)),
    onOutgoingCustomGroupCall: customGroupId =>
      dispatch(outgoingCustomGroupCall(customGroupId)),
    onLoadActiveFriends: () => dispatch(getActiveFriends()),
    onLoadActivePlans: () => dispatch(getActivePlans()),
    onLoadActiveGroups: () => dispatch(getActiveGroups()),
    onLoadFriendRequests: () => dispatch(getFriendRequests()),
    getLastCall: () => dispatch(storeLastCall()),
    onResetLastCall: () => dispatch(resetLastCall()),
    storePhoneNumber: () => dispatch(getPhoneNumber()),
    getUserInfo: ios => dispatch(getUserInfo(ios)),
    getUserGroups: () => dispatch(getUserGroups()),
    checkIfUserLiveGroups: () => dispatch(checkIfUserLiveGroups()),
    onSetGroupForPlan: (id, value, type) =>
      dispatch(setGroupForPlan(id, value, type)),
    getContactsFromStorage: () => dispatch(getContactsFromStorage())

  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PhoneScreen);
