import React from "react";
import { StyleSheet, FlatList, View } from "react-native";

import ConnectedMembers from "../ListItem/ListItemConnectedMembers";

const connectedMembersList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.members}
      renderItem={info => (
        <ConnectedMembers
          userName={info.item.fullname}
          friendStatus={info.item.friends}
          //status={info.item.send_notifications}
          onItemPressed={() =>
            props.onItemSelected(info.item.id, info.item.username)
          }
        />
      )}
      keyExtractor={(item, index) => item.id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%"
  }
});

export default connectedMembersList;
