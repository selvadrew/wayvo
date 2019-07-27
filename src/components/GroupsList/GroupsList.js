import React from "react";
import { StyleSheet, FlatList, View } from "react-native";

import ListItemGroups from "../ListItem/ListItemGroups";

const groupsList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      // data={props.groups}
      data={props.groups.sort(function(x, y) {
        return y.status - x.status || x.value.localeCompare(y.value);
      })}
      renderItem={info => (
        <ListItemGroups
          userName={info.item.value}
          groupType={info.item.type}
          status={info.item.status}
          secretUsername={info.item.secretUsername}
          onItemPressed={() =>
            props.onItemSelected(
              info.item.id,
              info.item.value,
              info.item.type,
              info.item.secretUsername
            )
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
