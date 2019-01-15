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
  Dimensions
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import DropdownAlert from "react-native-dropdownalert";

import ImagePicker from "../../utils/ImagePickerAndroid";
import { RNS3 } from "react-native-aws3";
import { changeGroupState } from "../../store/actions/groups";

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
            //console.log(res.data);
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
            console.log(res.data);
            //this.props.onImagePicked({uri: res.uri, base64: res.data});
          }
        }
      );
    }
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
      //s3 upload
      const file = {
        // `uri` can also be a file system path (i.e. file://)
        uri: this.state.pickedImaged, //res.uri,
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

      RNS3.put(file, options).then(response => {
        console.log(response);
        if (response.status !== 201) {
          alert("Sorry, something went wrong. Please try again.");
          throw new Error("Failed to upload image to S3");
        } else {
          alert("Success");
          this.props.onChangeGroupState(2);
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
      });
    }
  };

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
    if (this.state.pickedImaged) {
      pictureButtonTitle = "Retake Picture";
    }
    return (
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
        <View style={styles.button}>
          <Button title={pictureButtonTitle} onPress={this.pickImageHandler} />
        </View>
        <View style={styles.button}>
          <Button title="Rotate" onPress={this.rotateImage} />
        </View>
        <View style={styles.button}>
          <Button title="Upload" onPress={this.uploadImage} />
        </View>
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    username: state.users.username
  };
};

const mapDispatchToProps = dispatch => {
  return {
    onChangeGroupState: position => dispatch(changeGroupState(position))
  };
};

const styles = StyleSheet.create({
  container: {
    //padding: 20,
    backgroundColor: colors.blueColor,
    width: "100%"
  },
  placeholder: {
    borderWidth: 1,
    borderColor: "black",
    backgroundColor: "#eee",
    // width: "100%",
    height: Dimensions.get("window").width
  },
  button: {
    margin: 8
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
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupUploadPicture);

// When someone adds you as a friend, they will not know if you accepted or rejected their request.
