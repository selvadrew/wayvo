import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ActiveList from "../ActiveFriends/ActiveList";

const callStatusCustomGroups = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.custom_groups}
      renderItem={info => (
        <ActiveList
          userName={info.item.group_name}
          onItemPressed={() =>
            props.onItemSelected(
              info.item.outgoing_id,
              info.item.group_name,
              info.item.phone_number,
              info.item.ios
            )
          }
        />
      )}
      keyExtractor={(item, index) => item.outgoing_id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%"
  }
});

export default callStatusCustomGroups;
