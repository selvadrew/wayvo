import React from "react";
import { StyleSheet, FlatList, View } from "react-native";

import ContactListItem from "../ContactsList/ContactListItem";

const contactsList = props => {
    return (
        <FlatList
            style={styles.listContainer}
            //   data={props.contacts.sort(function (x, y) {
            //     return (
            //       y.send_notifications - x.send_notifications ||
            //       x.fullname.localeCompare(y.fullname)
            //     );
            //   })}
            data={props.contacts}
            renderItem={info => (
                <ContactListItem
                    userName={info.item.givenName + " " + info.item.familyName}
                    status={info.item.selected}
                    onItemPressed={() => {
                        props.onItemSelected(info.item.contactId)
                    }}
                    onDeleteContactPressed={() => {
                        props.onDeleteContactSelected(info.item.contactId, info.item.from_username)
                    }}
                />
            )}
            keyExtractor={(item, index) => item.contactId}
        />
    );
};

const styles = StyleSheet.create({
    listContainer: {
        width: "100%",
        marginTop: 11,
        borderTopWidth: 1,
        borderTopColor: "#eee"
    }
});

export default contactsList;
