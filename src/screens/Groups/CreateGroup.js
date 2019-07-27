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
          <Text>You've successfully created your group {this.state.name}.</Text>
          <Text>
            Let others know they can request to join your group by adding your
            secret username: {this.state.username}. Once they send a request,
            you will have to approve them so they can access your group!
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
    marginBottom: 15
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
    borderRadius: 3,
    letterSpacing: 1,
    marginBottom: 25
  },
  inputTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
    color: "#555"
  },
  createButton: {
    marginBottom: 250
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
