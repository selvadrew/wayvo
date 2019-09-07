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
  searchGroup,
  customGroupCreated,
  yesJoinGroup
} from "../../store/actions/customGroups";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";

class JoinGroup extends Component {
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
    username: ""
  };

  searchGroupHandler = () => {
    if (this.state.username != "") {
      this.props.onSearchGroup(this.state.username);
    } else {
      Alert.alert("All fields are required");
    }
  };

  joinGroup = (id, admin, name) => {
    this.props.navigator.pop();
    this.props.onJoinGroup(id, admin, name);
  };

  render() {
    let groupCreation = null;
    if (this.props.searchedGroup) {
      switch (this.props.searchedGroup.status) {
        case 1:
          groupCreation = (
            <View>
              <Text style={styles.searchedGroupHeader}>Group Admin:</Text>
              <Text style={styles.searchedGroupText}>
                {this.props.searchedGroup.admin}
              </Text>
              <Text style={styles.searchedGroupHeader}>Group Name:</Text>
              <Text style={styles.searchedGroupText}>
                {this.props.searchedGroup.name}
              </Text>
              <Text style={styles.searchedGroupHeader}>Group Description:</Text>
              <Text style={styles.searchedGroupText}>
                {this.props.searchedGroup.description}
              </Text>

              <View style={styles.joinGroupButton}>
                <GotIt
                  onPress={() =>
                    this.joinGroup(
                      this.props.searchedGroup.id,
                      this.props.searchedGroup.admin,
                      this.props.searchedGroup.name
                    )
                  }
                  backgroundColor={colors.yellowColor}
                  color="#333"
                  fontSize={18}
                >
                  Join Group
                </GotIt>
              </View>
            </View>
          );
          break;
        case 2:
          groupCreation = (
            <View>
              <Text style={styles.searchedGroupHeader}>
                Status: Waiting approval
              </Text>
              <Text style={styles.searchedGroupText}>
                Once {this.props.searchedGroup.admin}, the admin of this group
                approves your request, you'll be able to connect with members
                from the group.
              </Text>
            </View>
          );
          break;
        case 3:
          groupCreation = (
            <View>
              <Text style={styles.searchedGroupText}>
                You're already a member of {this.props.searchedGroup.name}
              </Text>
            </View>
          );
          break;
      }
    } else {
      groupCreation = (
        <View>
          <Text style={styles.header}>
            Did someone invite you to their group? Enter it here!
          </Text>
          <Text style={styles.inputTitle}>Secret Username</Text>
          <TextInput
            style={styles.textInputSmall}
            onChangeText={text => this.setState({ username: text })}
            value={this.state.username}
            placeholder="socialclub2019"
            autoCapitalize="none"
            autoCorrect={false}
          />
          <View style={styles.createButton}>
            <GotIt
              onPress={() => this.searchGroupHandler()}
              backgroundColor={colors.yellowColor}
              color="#333"
            >
              Search
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
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
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
  searchedGroupHeader: {
    color: colors.pinkColor,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    fontSize: 18,
    marginBottom: 5,
    fontWeight: "600"
  },
  searchedGroupText: {
    fontSize: 16,
    fontFamily: Platform.OS === "android" ? "Roboto" : null,
    marginBottom: 15,
    color: "#333"
  },
  joinGroupButton: {
    marginTop: 40
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onSearchGroup: username => dispatch(searchGroup(username)),
    onBackButton: status => dispatch(customGroupCreated(status)),
    onJoinGroup: (id, admin, name) => dispatch(yesJoinGroup(id, admin, name))
  };
};

const mapStateToProps = state => {
  return {
    customGroupCreated: state.custom_groups.custom_group_created,
    searchedGroup: state.custom_groups.searched_group
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(JoinGroup);
