import React from "react";
import { StyleSheet, FlatList, View } from "react-native";

import CalendarItem from "./CalendarItem";

const calendarList = props => {
    return (
        <FlatList
            style={styles.listContainer}
            data={props.day}
            renderItem={info => (
                <CalendarItem
                    userName={info.item.time}
                    status={info.item.status}
                    onItemPressed={() => props.onItemSelected(info.item.id)}
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

export default calendarList;
