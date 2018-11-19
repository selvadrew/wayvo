import React from "react";
import { StyleSheet, FlatList, View } from "react-native";

import ListItem from "../ListItem/ListItem";

const friendsList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.friends.sort(function(x, y) {
        return (
          y.send_notifications - x.send_notifications ||
          x.fullname.localeCompare(y.fullname)
        );
      })}
      renderItem={info => (
        <ListItem
          userName={info.item.fullname}
          status={info.item.send_notifications}
          onItemPressed={() => props.onItemSelected(info.item.id)}
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

export default friendsList;
