import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ActiveList from "../ActiveFriends/ActiveList";

const callStatus = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.friends}
      renderItem={info => (
        <ActiveList
          userName={info.item.fullname}
          onItemPressed={() =>
            props.onItemSelected(
              info.item.outgoing_id,
              info.item.fullname,
              info.item.phone_number
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

export default callStatus;
