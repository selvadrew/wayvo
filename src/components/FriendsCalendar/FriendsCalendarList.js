import React from "react";
import { StyleSheet, FlatList, View } from "react-native";

import FriendsCalendarItem from "./FriendsCalendarItem";

const friendsCalendarList = props => {
    return (
        <FlatList
            style={styles.listContainer}
            data={props.day}
            renderItem={info => (
                < FriendsCalendarItem
                    time={info.item} // since its an array without ids, info.item works 
                    onItemPressed={() => props.onItemSelected(info.item)}
                />
            )
            }
            keyExtractor={(item, index) => index.toString()}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        width: "100%"
    }
});

export default friendsCalendarList;
