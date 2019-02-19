import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ActiveList from "../ActiveFriends/ActiveList";

const callStatusGroups = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.groups}
      renderItem={info => (
        <ActiveList
          userName={info.item.program_name}
          onItemPressed={() => props.onItemSelected(info.item.program_id)}
        />
      )}
      keyExtractor={(item, index) => item.program_id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%"
  }
});

export default callStatusGroups;
