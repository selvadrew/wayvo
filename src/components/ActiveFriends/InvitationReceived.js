import React from "react";
import { StyleSheet, FlatList } from "react-native";

import InvitationItem from "./InvitationItem";

const invitationReceived = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.invitations}
      renderItem={info => (
        <InvitationItem
          fullname={info.item.fullname}
          onItemPressed={() =>
            props.onItemSelected(
              info.item.invitation_id,
              info.item.user_id,
              info.item.first_name
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
  }
});

export default invitationReceived;
