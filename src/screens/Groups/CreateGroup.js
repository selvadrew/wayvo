import React, { Component } from "react";
import {
  View,
  Image,
  Text,
  Button,
  StyleSheet,
  TouchableOpacity,
  Platform,
  StatusBar,
  TextInput,
  Alert,
  Dimensions,
  ActivityIndicator,
  ScrollView
} from "react-native";
import { connect } from "react-redux";

import Icon from "react-native-vector-icons/Ionicons";
import {
  createGroup,
  customGroupCreated
} from "../../store/actions/customGroups";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";

class CreateGroup extends Component {
  static navigatorStyle = {
    navBarHidden: false,
    statusBarColor: colors.blueColor,
    navBarBackgroundColor: colors.blueColor,
    navBarButtonColor: "#fff",
    navBarTextColor: "#fff"
  };
  constructor(props) {
    super(props);
  }

  componentWillUnmount() {
    this.props.onBackButton(false);
  }

  state = {
    name: "",
    username: "",
    description: ""
  };

  createGroupHandler = () => {
    if (
      this.state.name != "" &&
      this.state.username != "" &&
      this.state.description != ""
    ) {
      this.props.onCreateGroup(
        this.state.name,
        this.state.username,
        this.state.description
      );
    } else {
      Alert.alert("All fields are required");
    }
  };

  render() {
    let groupCreation = null;
    if (this.props.customGroupCreated) {
      groupCreation = (
        <View>
          <Text style={styles.createdGroupHeader}>
            Successfully created {this.state.name}
          </Text>
          <Text style={styles.createdGroupText}>
            Let others know they can join your group by adding your secret
            username:{" "}
            <Text style={styles.secretUsernameText}>{this.state.username}</Text>
          </Text>
          <Text style={styles.createdGroupText}>
            Once they send a request, you have to approve them so they can
            access your group to make new friends and start plans!
          </Text>
        </View>
      );
    } else {
      groupCreation = (
        <View>
          <Text style={styles.header}>
            Create a group and bring people together!
          </Text>
          <Text style={styles.inputTitle}>Group Name</Text>
          <TextInput
            style={styles.textInputSmall}
            onChangeText={text => this.setState({ name: text })}
            value={this.state.name}
            placeholder="Entrepreneurship"
            autoFocus={true}
          />
          <Text style={styles.inputTitle}>Secret Username</Text>
          <TextInput
            style={styles.textInputSmall}
            onChangeText={text => this.setState({ username: text })}
            value={this.state.username}
            placeholder="NextBigIdea"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <Text style={styles.inputTitle}>Description</Text>
          <TextInput
            style={styles.textInput}
            multiline={true}
            onChangeText={text => this.setState({ description: text })}
            value={this.state.description}
            placeholder="This group is for anyone who is interested in entrepreneurship at our school."
          />
          <View style={styles.createButton}>
            <GotIt
              onPress={() => this.createGroupHandler()}
              backgroundColor={colors.yellowColor}
              color="#333"
            >
              Create
            </GotIt>
          </View>
        </View>
      );
    }
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        style={styles.container}
      >
        <StatusBar
          barStyle="light-content"
          backgroundColor={colors.blueColor}
        />
        {groupCreation}
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    padding: 22,
    paddingTop: 10,
    flex: 1,
    flexDirection: "column"
  },
  header: {
    fontSize: 20,
    color: colors.darkBlue,
    fontWeight: "700",
    marginBottom: 15,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
    // textAlign: "center"
  },
  textInput: {
    borderColor: "#777", //wcolors.blueColor,
    borderWidth: 1,
    height: 150,
    width: "100%",
    padding: 10,
    textAlignVertical: "top",
    fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    marginBottom: 25,
    borderRadius: 3,
    letterSpacing: 1
  },
  textInputSmall: {
    borderColor: "#777",
    borderWidth: 1,
    height: 50,
    width: "100%",
    padding: 10,
    fontSize: Dimensions.get("window").width > 330 ? 18 : 16,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    borderRadius: 3,
    letterSpacing: 1,
    marginBottom: 25
  },
  inputTitle: {
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    fontWeight: "700",
    marginBottom: 5,
    color: "#555"
  },
  createButton: {
    marginBottom: 250
  },
  createdGroupHeader: {
    fontWeight: "bold",
    fontSize: 25,
    color: colors.pinkColor,
    textAlign: "center",
    marginBottom: 25,
    fontFamily: Platform.OS === "android" ? "Roboto" : null
  },
  createdGroupText: {
    fontSize: 18,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    marginBottom: 15
  },
  secretUsernameText: {
    color: colors.pinkColor
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onCreateGroup: (name, username, description) =>
      dispatch(createGroup(name, username, description)),
    onBackButton: status => dispatch(customGroupCreated(status))
  };
};

const mapStateToProps = state => {
  return {
    customGroupCreated: state.custom_groups.custom_group_created
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(CreateGroup);
