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
  Alert
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import DropdownAlert from "react-native-dropdownalert";
import GotIt from "../../components/UI/GotItButton";
import AddButton from "../../components/UI/AddButton";
import GroupsList from "../../components/GroupsList/GroupsList";

class GroupMainScreen extends Component {
  static navigatorStyle = {
    navBarHidden: true,
    statusBarColor: colors.blueColor
  };
  constructor(props) {
    super(props);
  }

  groupsSelectedHandler = id => {
    alert(id);
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={styles.friends}>
          <View style={styles.friendsHeaderWrapper}>
            <Text style={styles.friendsHeader}>Groups</Text>
            <AddButton
              onPress={() =>
                Alert.alert(
                  "You cannot join or create new groups at your school yet. It will be available September 2019."
                )
              }
            />
          </View>
        </View>
        <GroupsList
          groups={this.props.userGroups}
          onItemSelected={this.groupsSelectedHandler}
        />
      </View>
    );
  }
}

const mapStateToProps = state => {
  return {
    isLoadingGroups: state.ui.isLoadingGroups,
    userGroups: state.groups.userGroups,
    enrolledUniversity: state.groups.enrolledUniversity
  };
};

const mapDispatchToProps = dispatch => {
  return {
    //onGetUniversities: () => dispatch(getUniversities())
  };
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    paddingTop: 10,
    flex: 1,
    flexDirection: "column"
  },
  friends: {
    //margin: 10
    //marginHorizontal: 20
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
    borderBottomColor: "#eee",
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between"
  }
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(GroupMainScreen);
