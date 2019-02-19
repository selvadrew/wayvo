import React, { Component } from "react";
import {
  View,
  TextInput,
  Button,
  StyleSheet,
  Text,
  AsyncStorage
} from "react-native";

class Phrases extends Component {
  componentDidMount() {
    AsyncStorage.getItem("pp:verified").then(verified_status => {
      if (verified_status === "true") {
        AsyncStorage.getItem("phrase").then(phrase => {
          if (phrase) {
            let index = null;
            index = parseInt(phrase, 10);
            if (index === 9) {
              newIndex = 0;
            } else {
              newIndex = index + 1;
            }

            this.setState({
              phrase: newIndex
            });
            AsyncStorage.setItem("phrase", newIndex.toString());
          } else {
            AsyncStorage.setItem("phrase", "0");
          }
        });
      }
    });
  }

  state = {
    phrase: 0
  };

  selectedPhrase = [
    "How would you like to connect?",
    "What are you in the mood for?",
    "Get out of your bubble, make a new friend today.",
    "Talk to another human right now.",
    "Make a new friend on your way to class today.",
    "Need advice? Ask a friend.",
    "Share your positive vibes with a friend, make their day.",
    "Ask a friend how their day is going.",
    "Make a new friend, learn something new.",
    "Take a break, Say Hello!"
  ];

  render() {
    // return <Text>{this.selectedPhrase[this.state.phrase]}</Text>;
    return <Text>{this.selectedPhrase[0]}</Text>;
  }
}

const styles = StyleSheet.create({});

export default Phrases;
