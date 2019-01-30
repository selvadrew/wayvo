import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  RefreshControl,
  Platform,
  StatusBar,
  SafeAreaView,
  Image,
  Button,
  Dimensions,
  TouchableWithoutFeedback
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import DropdownAlert from "react-native-dropdownalert";
import GotIt from "../../components/UI/GotItButton";
import { startLoadingGroups, stopLoadingGroups } from "../../store/actions/ui";

import ImagePicker from "../../utils/ImagePickerAndroid";
import { RNS3 } from "react-native-aws3";
import { changeGroupState, joinProgram } from "../../store/actions/groups";
import Icon from "react-native-vector-icons/Ionicons";

class GroupUploadPicture extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: colors.blueColor
  };
  constructor(props) {
    super(props);
  }

  state = {
    pickedImaged: null,
    rotatePosition: 0
  };

  pickImageHandler = () => {
    if (Platform.OS === "ios") {
      // ios
      ImagePicker.showImagePicker(
        { title: "Upload picture of your student ID" },
        res => {
          if (res.didCancel) {
            console.log("User cancelled!");
          } else if (res.error) {
            console.log("Error", res.error);
          } else {
            this.setState({
              pickedImaged: { uri: res.uri },
              rotatePosition: 0
            });
            //console.log(res.uri);
            //this.props.onImagePicked({uri: res.uri, base64: res.data});
          }
        }
      );
    } else {
      // android
      ImagePicker.launchCamera(
        { title: "Upload picture of your student ID" },
        res => {
          if (res.didCancel) {
            console.log("User cancelled!");
          } else if (res.error) {
            console.log("Error", res.error);
          } else {
            this.setState({
              pickedImaged: { uri: res.uri },
              rotatePosition: 0
            });
            console.log(res.uri);
            //this.props.onImagePicked({uri: res.uri, base64: res.data});
          }
        }
      );
    }
  };

  clearImage = () => {
    this.setState({
      pickedImaged: null
    });
  };

  rotateImage = () => {
    if (this.state.rotatePosition === 3) {
      this.setState({
        rotatePosition: 0
      });
    } else {
      this.setState({
        rotatePosition: this.state.rotatePosition + 1
      });
    }
  };

  uploadImage = () => {
    if (this.state.pickedImaged) {
      this.props.onStartLoadingGroups();
      //s3 upload
      const file = {
        // `uri` can also be a file system path (i.e. file://)
        uri: this.state.pickedImaged.uri, //res.uri,
        name: this.props.username,
        type: "image/png"
      };

      const options = {
        keyPrefix: "",
        bucket: "student-id-pictures",
        region: "us-east-1",
        accessKey: "AKIAJVOSR6IRVCZ6IGBA",
        secretKey: "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",
        successActionStatus: 201
      };

      RNS3.put(file, options)
        .then(response => {
          console.log(response);
          if (response.status !== 201) {
            this.props.onStopLoadingGroups();
            alert("Sorry, something went wrong. Please try again.");
            throw new Error("Failed to upload image to S3");
          } else {
            this.props.onJoinProgram(
              this.props.programId,
              this.props.startYear
            );
          }
          /**
           * {
           *   postResponse: {
           *     bucket: "your-bucket",
           *     etag : "9f620878e06d28774406017480a59fd4",
           *     key: "uploads/image.png",
           *     location: "https://your-bucket.s3.amazonaws.com/uploads%2Fimage.png"
           *   }
           * }
           */
        })
        .catch(e => {
          this.props.onStopLoadingGroups();
          alert("Sorry, something went wrong.");
        });
    } else {
      this.props.onStopLoadingGroups();
      Alert.alert("Please take a picture");
    }
  };

  // uploadImage = () => {
  //   console.log(this.state.pickedImaged.uri);
  // };

  getRotation(index) {
    if (index === 1) {
      return {
        transform: [{ rotate: "90deg" }]
      };
    } else if (index === 2) {
      return {
        transform: [{ rotate: "180deg" }]
      };
    } else if (index === 3) {
      return {
        transform: [{ rotate: "270deg" }]
      };
    } else if (index === 4) {
      return {
        transform: [{ rotate: "0deg" }]
      };
    }
  }

  render() {
    let pictureButtonTitle = "Take Picture";
    let placeholder = null;
    let uploadButton = null;
    if (this.props.isLoadingGroups) {
      uploadButton = (
        <ActivityIndicator color="#fff" style={styles.activityIndicator} />
      );
    } else {
      uploadButton = (
        <View style={styles.buttonYellow}>
          <Text onPress={this.uploadImage} style={styles.buttonTextYellow}>
            Upload
          </Text>
        </View>
      );
    }
    if (this.state.pickedImaged) {
      pictureButtonTitle = "Retake Picture";
      placeholder = (
        <View>
          <View style={styles.placeholder}>
            <Image
              source={this.state.pickedImaged}
              style={[
                styles.previewImage,
                this.getRotation(this.state.rotatePosition)
              ]}
            />
          </View>
          <View style={styles.buttonRow}>
            <View style={styles.button}>
              <Text onPress={this.rotateImage} style={styles.buttonText}>
                Rotate
              </Text>
            </View>
            {uploadButton}
            <View style={styles.button}>
              <Text onPress={this.clearImage} style={styles.buttonText}>
                Delete
              </Text>
            </View>
          </View>
        </View>
      );
    } else {
      placeholder = (
        <View style={styles.placeholderBlank}>
          <Text style={styles.uploadExplanation}>
            Upload a selfie of yourself holding your student ID next to your
            face.
            <Text style={styles.learnMore} onPress={() => alert("hi")}>
              {" "}
              Learn more
              {/* We will use this photo to verify your
            identity and enrollment at your university.{"\n"} */}
            </Text>
          </Text>

          <View style={styles.imageWrapper}>
            <Image
              source={require("../../assets/selfie-ID.png")}
              style={styles.infoTwo}
            />
          </View>
          {/* <Text style={styles.uploadExplanation} /> */}

          <GotIt
            onPress={this.pickImageHandler}
            backgroundColor={colors.yellowColor}
            color="#333"
          >
            Take Photo
          </GotIt>
        </View>
      );
    }

    return (
      <View>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between"
          }}
        >
          <TouchableWithoutFeedback
            onPress={() => this.props.onChangeGroupState(1)}
          >
            <Icon
              size={30}
              name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
              color="#fff"
              style={styles.backArrow}
            />
          </TouchableWithoutFeedback>
          <View style={styles.circleWrapper}>
            <View style={styles.circleG} />
            <View style={styles.circleG} />
            <View style={styles.circleG} />
            <View style={styles.circleG} />
            <View style={styles.circleG} />
          </View>
          <TouchableWithoutFeedback>
            <Icon
              size={30}
              name={Platform.OS === "ios" ? "ios-arrow-back" : "md-arrow-back"}
              color={colors.blueColor}
              style={styles.backArrow}
            />
          </TouchableWithoutFeedback>
        </View>
        <View
          style={[
            this.state.pickedImaged
              ? styles.headerWrapperNoBorder
              : styles.headerWrapper
          ]}
        >
          <Text style={styles.header}>Identity Verification</Text>
        </View>
        {placeholder}
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.users.username,
    isLoadingGroups: state.ui.isLoadingGroups,
    programId: state.groups.programId,
    startYear: state.groups.startYear
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeGroupState: position => dispatch(changeGroupState(position)),
    onStartLoadingGroups: () => dispatch(startLoadingGroups()),
    onStopLoadingGroups: () => dispatch(stopLoadingGroups()),
    onJoinProgram: (programId, startYear) =>
      dispatch(joinProgram(programId, startYear))
  };
};

const styles = StyleSheet.create({
  container: {
    //padding: 20,
    backgroundColor: colors.blueColor,
    width: "100%"
  },
  placeholder: {
    backgroundColor: colors.blueColor,
    // width: "100%",
    height: Dimensions.get("window").width
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginHorizontal: 10,
    backgroundColor: colors.darkBlue
  },
  button: {
    margin: 8,
    alignItems: "center"
  },
  buttonYellow: {
    margin: 8,
    alignItems: "center",
    backgroundColor: colors.yellowColor,
    borderRadius: 20
  },
  buttonTextYellow: {
    textAlign: "center",
    fontSize: 20,
    color: "#333",
    padding: 10,
    paddingHorizontal: 15
  },
  buttonText: {
    textAlign: "center",
    fontSize: 20,
    color: "#fff",
    padding: 10
  },
  activityIndicator: {
    alignItems: "center",
    justifyContent: "center"
  },
  previewImage: {
    width: "100%",
    height: Dimensions.get("window").width,
    resizeMode: "contain"
  },
  searchBar: {
    width: "100%"
  },
  friendRequests: {
    margin: 20,
    marginTop: 40
  },
  friends: {
    margin: 20
  },
  friendsHeader: {
    // flexDirection: "row",
    // alignItems: "center",
    // width: "100%",
    color: colors.yellowColor,
    fontWeight: "900",
    fontSize: 25,
    padding: 10,
    letterSpacing: 0.5,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  friendsHeaderWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  requestsHeader: {
    color: colors.yellowColor
  },
  backArrow: {
    paddingHorizontal: 10,
    paddingTop: 10
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
    borderBottomColor: "#eee",
    marginHorizontal: 20
  },
  headerWrapperNoBorder: {
    marginHorizontal: 20
  },
  uploadExplanation: {
    marginHorizontal: 24,
    color: "#fff",
    fontSize: 18,
    marginTop: 5
  },
  infoTwo: {
    resizeMode: "contain",
    height: 150,
    //width: Dimensions.get("window").width * 0.65,
    alignItems: "center",
    marginVertical: 10
  },
  imageWrapper: {
    alignItems: "center"
  },
  learnMore: {
    color: colors.yellowColor
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupUploadPicture);

// When someone adds you as a friend, they will not know if you accepted or rejected their request.
