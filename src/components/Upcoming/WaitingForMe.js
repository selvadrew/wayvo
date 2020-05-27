import React from "react";
import { StyleSheet, FlatList, View } from "react-native";

import WaitingForMeItem from "./WaitingForMeItem";

// invitation_id: 1,
// user_id: 155,
// fullname: 'Qw Qw',
// phone_number: '2424232323',
// scheduled_call: null

const waitingForMe = props => {
    return (
        <FlatList
            style={styles.listContainer}
            data={props.invitations}
            renderItem={info => (
                <WaitingForMeItem
                    fullname={info.item.fullname}
                    // status={info.item.status}
                    onItemPressed={() => props.onItemSelected(info.item.invitation_id, info.item.user_id, info.item.first_name)}
                />
            )}
            keyExtractor={(item, index) => item.invitation_id.toString()}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        width: "100%"
    }
});

export default waitingForMe;
