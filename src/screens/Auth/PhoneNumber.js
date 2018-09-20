import React, { Component } from "react";
import { View, Text } from "react-native";
import TextBox from "../../components/TextBox/TextBox";
import { connect } from "react-redux";

import { savePhoneNumber } from "../../store/actions/users";

class PhoneNumber extends Component {
  phoneNumberHandler = phoneNumber => {
    this.props.onAddPhoneNumber(phoneNumber);
  };

  render() {
    return (
      <View>
        <TextBox onPlaceAdded={this.phoneNumberHandler} />
      </View>
    );
  }
}

const mapDispatchToProps = dispatch => {
  return {
    onAddPhoneNumber: phoneNumber => dispatch(savePhoneNumber(phoneNumber))
  };
};

export default connect(
  null,
  mapDispatchToProps
)(PhoneNumber);
