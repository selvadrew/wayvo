import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Dimensions
} from "react-native";
import colors from "../../utils/styling";

const listItem = props => (
  <TouchableOpacity onPress={props.onItemPressed}>
    <View style={props.status === true ? styles.listItem : styles.grayListItem}>
      <Text style={props.status === true ? styles.names : styles.grayName}>
        {props.userName}
      </Text>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  listItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 11,
    borderBottomWidth: 1,
    borderBottomColor: "#eee"
  },
  grayListItem: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    padding: 11,
    borderBottomWidth: 1,
    borderBottomColor: colors.darkBlue
  },
  names: {
    color: "#fff",
    //#ccdfff
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18
  },
  grayName: {
    color: colors.darkBlue,
    fontWeight: "bold",
    fontSize: Dimensions.get("window").width > 330 ? 20 : 18
  }
});

export default listItem;

{
  /* <View style={styles.listItem}>
      <Text style={styles.names}>Amelia Damacino</Text>
    </View>
    <View style={styles.listItem}>
      <Text style={styles.names}>Arthur Dean Ecclestone</Text>
    </View>
    <View style={styles.listItem}>
      <Text style={styles.names}>Asha Pundy</Text>
    </View>
    <View style={styles.listItem}>
      <Text style={styles.names}>Charlie Desilva</Text>
    </View>
    <View style={styles.listItem}>
      <Text style={styles.names}>Charlotte Katelin Lebar</Text>
    </View>
    <View style={styles.listItem}>
      <Text style={styles.names}>Dhiviyan Valentine</Text>
    </View>
    <View style={styles.listItem}>
      <Text style={styles.names}>Dillon Francis</Text>
    </View>
    <View style={styles.listItem}>
      <Text style={styles.names}>Freya Berlynn Pinto</Text>
    </View>
    <View style={styles.listItem}>
      <Text style={styles.names}>Grace Chen</Text>
    </View>
    <View style={styles.listItem}>
      <Text style={styles.names}>Harry Fernando</Text>
    </View> */
}
