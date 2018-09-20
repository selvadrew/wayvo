import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ListItem from "../ListItem/ListItem";

const friendsList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.friends}
      renderItem={info => (
        <ListItem
          userName={info.item.fullname}
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
