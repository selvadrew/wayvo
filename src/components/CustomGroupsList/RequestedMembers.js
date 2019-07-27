import React from "react";
import {
  StyleSheet,
  FlatList,
  View,
  Text,
  Button,
  Platform
} from "react-native";
import FriendRequestButtons from "../../components/UI/FriendRequestButtons";
import ListItemAdmin from "../../components/ListItem/ListItemAdmin";
import colors from "../../utils/styling";

const requestedMembers = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.members}
      renderItem={info => (
        <ListItemAdmin
          fullname={info.item.fullname}
          blocked={info.item.blocked}
          status={info.item.status}
          onAccept={() => props.onAddToGroup(info.item.id)}
          onBlock={() => props.onRejectToGroup(info.item.id)}
        />
        // <View style={styles.requestSection}>
        //   <View style={styles.addNameWrapper}>
        //     <Text style={styles.addName}>{info.item.fullname}</Text>
        //   </View>
        //   <View style={styles.buttonsWrapper}>
        //     <FriendRequestButtons
        //       backgroundColor={colors.greenColor}
        //       color="#444"
        //       borderRightWidth={1}
        //       style={styles.rejectButton}
        //       onPress={() => props.onRejectToGroup(info.item)}
        //     >
        //       Ignore
        //     </FriendRequestButtons>
        //     <FriendRequestButtons
        //       backgroundColor={colors.greenColor}
        //       color={colors.greenColor}
        //       style={styles.addButton}
        //       onPress={() => props.onAddToGroup(info.item.username)}
        //     >
        //       Add
        //     </FriendRequestButtons>
        //   </View>
        // </View>
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
    backgroundColor: colors.greenColor, //"#0269b8",
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
    fontWeight: "800",
    fontFamily: Platform.OS === "android" ? "Roboto" : null
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

export default requestedMembers;
