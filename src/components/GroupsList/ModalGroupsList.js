import React from "react";
import { StyleSheet, FlatList, View } from "react-native";

import ListItemModalGroups from "../ListItem/ListItemModalGroups";

const modalGroupsList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.groups}
      renderItem={info => (
        <ListItemModalGroups
          userName={info.item.value}
          //status={info.item.send_notifications}
          onItemPressed={() =>
            props.onItemSelected(info.item.id, info.item.value, info.item.type)
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

export default modalGroupsList;
