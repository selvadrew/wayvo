import React from "react";
import { StyleSheet, FlatList, View, Text, Button } from "react-native";
import FriendRequestButtons from "../../components/UI/FriendRequestButtons";
import colors from "../../utils/styling";

const friendRequests = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.requests}
      renderItem={info => (
        <View style={styles.requestSection}>
          <View style={styles.addNameWrapper}>
            <Text style={styles.addName}>{info.item.fullname}</Text>
          </View>
          <View style={styles.buttonsWrapper}>
            <FriendRequestButtons
              backgroundColor={colors.darkBlue}
              color="#444"
              style={styles.rejectButton}
              onPress={() => props.onRejectFriendDecision(info.item)}
            >
              Ignore
            </FriendRequestButtons>
            <FriendRequestButtons
              backgroundColor={colors.darkBlue}
              color={colors.greenColor}
              style={styles.addButton}
              onPress={() => props.onAddFriendDecision(info.item.username)}
            >
              Add
            </FriendRequestButtons>
          </View>
        </View>
      )}
      keyExtractor={(item, index) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%",
    // borderBottomColor: "#fff",
    // borderWidth: 2,
    marginTop: 10
  },
  requestSection: {
    backgroundColor: colors.darkBlue, //"#0269b8",
    marginBottom: 20,
    borderRadius: 5
  },
  addNameWrapper: {
    flex: 1,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",

    borderBottomColor: colors.blueColor,
    borderBottomWidth: 1
    //backgroundColor: colors.pinkColor
  },
  addName: {
    padding: 10,
    fontSize: 18,
    color: "#fff",
    fontWeight: "800"
  },
  buttonsWrapper: {
    width: "100%",
    height: "100%",
    flex: 1,
    flexDirection: "row"
    // borderBottomColor: "#fff",
    // borderBottomWidth: 2,
  },
  rejectButton: {
    width: "100%",
    flex: 1
  },
  addButton: {
    width: "100%",
    flex: 1
  }
});

export default friendRequests;
