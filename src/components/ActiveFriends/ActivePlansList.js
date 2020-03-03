import React from "react";
import { StyleSheet, FlatList } from "react-native";

import ActivePlan from "../ActiveFriends/ActivePlan";

const activePlansList = props => {
  return (
    <FlatList
      style={styles.listContainer}
      data={props.active_plans}
      renderItem={info => (
        <ActivePlan
          data={info.item}
          onItemPressed={title =>
            props.onItemSelected(info.item.going, info.item.plan_id, title)
          }
          onInviteFriends={title =>
            props.onInviteFriendsSelected(info.item.going, info.item.plan_id, title)
          }
        />
      )}
      keyExtractor={(item, index) => item.plan_id.toString()}
    />
  );
};

const styles = StyleSheet.create({
  listContainer: {
    width: "100%"
  }
});

export default activePlansList;
