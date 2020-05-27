import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ActiveList from "../ActiveFriends/ActiveList";

const callStatus = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.upcomingCalls}
      renderItem={info => (
        <ActiveList
          firstName={info.item.first_name}
          time={info.item.time_in_user_tz}
          day={info.item.day}
          onItemPressed={() =>
            props.onItemSelected(
              info.item.first_name,
              info.item.phone_number,
              info.item.scheduled_call_utc,
              info.item.day,
              info.item.time_in_user_tz,
              info.item.ios
            )
          }
        />
      )}
      keyExtractor={(item, index) => item.invitation_id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%",
    // height: "100%"
  }
});

export default callStatus;
