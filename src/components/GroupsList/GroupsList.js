import React from "react";
import { StyleSheet, FlatList, View } from "react-native";

import ListItemGroups from "../ListItem/ListItemGroups";

const groupsList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.groups}
      renderItem={info => (
        <ListItemGroups
          userName={info.item.value}
          //status={info.item.send_notifications}
          onItemPressed={() =>
            props.onItemSelected(info.item.id, info.item.value)
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

export default groupsList;
