import React from "react";
import { StyleSheet, FlatList, View } from "react-native";

import ContactListItem from "../ContactsList/ContactListItem";

const contactsList = props => {
    return (
        <FlatList
            style={styles.listContainer}
            data={props.contacts.sort(function (x, y) {
                if (x.relationship_days === 0) {
                    x.relationship_days = 100
                }
                if (y.relationship_days === 0) {
                    y.relationship_days = 100
                }

                return (
                    x.relationship_days - y.relationship_days || x.givenName.localeCompare(y.givenName)


                )

            })}
            // data={props.contacts}
            renderItem={info => (
                <ContactListItem
                    userName={info.item.givenName + " " + info.item.familyName}
                    status={info.item.selected}
                    relationshipDays={info.item.relationship_days}
                    onItemPressed={() => {
                        props.onItemSelected(
                            info.item.contactId,
                            info.item.from_username,
                            info.item.givenName,
                            info.item.relationship_days,
                            info.item.last_connected
                        )
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
