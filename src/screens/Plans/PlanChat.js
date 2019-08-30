import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  StatusBar,
  Dimensions,
  TextInput,
  ScrollView,
  ActivityIndicator,
  Platform,
  Image,
  TouchableOpacity,
  Picker
} from "react-native";
import { connect } from "react-redux";
import colors from "../../utils/styling";
import GotIt from "../../components/UI/GotItButton";
import { GiftedChat } from "react-native-gifted-chat";
import { ActionCable, Cable } from "@kesha-antonov/react-native-action-cable";

import { setTimeForPlan, sendInvite } from "../../store/actions/plans";
import {
  getMessages,
  incomingWebsocketMessage,
  sendMessage
} from "../../store/actions/activePlans";

class PlanChat extends Component {
  static navigatorStyle = {
    navBarHidden: false,
    statusBarColor: colors.darkBlue,
    navBarBackgroundColor: colors.darkBlue,
    navBarButtonColor: "#fff",
    navBarTextColor: "#fff"
  };
  constructor(props) {
    super(props);
  }

  state = {
    messages: [],
    loader: false
  };

  componentDidMount() {
    this.props.onGetMessages(this.props.id);

    const actionCable = ActionCable.createConsumer(
      // "wss://4e390740.ngrok.io/cable"
      "wss://sheltered-escarpment-63295.herokuapp.com/cable"
    );
    const cable = new Cable({});

    const channel = cable.setChannel(
      `plan_channel_${this.props.id}`, // channel name to which we will pass data from Rails app with `stream_from`
      actionCable.subscriptions.create({
        channel: "PlanChannel", // from Rails app app/channels/chat_channel.rb
        plan_id: this.props.id
      })
    );
    const channelName = "PlanChannel";

    channel.connected = () => {
      // setTimeout(() => {
      //   cable.channel("plan_channel").perform("speak", { message: "Hey123" });
      // }, 1000);
      // alert("connected");
    };

    channel.received = incoming => {
      this.handleReceived(incoming);
    };
    channel.rejected = () => {
      alert("Connection Rejected");
    };
    channel.disconnected = () => {
      console.log("disconnected");
    };

    this.setState({
      channel: channel,
      current_message_id: 0
    });
  }

  componentWillUnmount() {
    if (this.state.channel) {
      this.state.channel
        .removeListener("received", this.handleReceived)
        .removeListener("connected", this.handleConnected)
        .removeListener("rejected", this.handleDisconnected)
        .removeListener("disconnected", this.handleDisconnected);
      this.state.channel.unsubscribe();
      // delete cable.channels[channelName];
    }

    console.log(this.state.channel);
  }

  incrementId() {
    this.setState({
      current_message_id: this.state.current_message_id += 1
    }
    )
    return this.state.current_message_id
  }

  onSend(messages) {
    this.props.onSendMessage(this.props.id, messages[0].text);
    console.log(messages[0].text)
    // 
    let message_data = {
      _id: this.incrementId(),
      text: messages[0].text,
      createdAt: new Date(),
      user: {
        _id: parseInt(this.props.user_id),
        name: "Me"
      }
    }
    this.props.onIncomingWebsocketMessage(
      this.props.id,//plan id 
      message_data
    );
  }

  handleReceived = incoming => {
    // better way to do this. - checks if user is not current user or system message to show message
    if (incoming.incoming_message.message_data.user) {
      if (incoming.incoming_message.message_data.user._id !== parseInt(this.props.user_id)) {
        this.props.onIncomingWebsocketMessage(
          incoming.incoming_message.plan_id,
          incoming.incoming_message.message_data
        );
      }
    } else if (incoming.incoming_message.message_data.system) {
      this.props.onIncomingWebsocketMessage(
        incoming.incoming_message.plan_id,
        incoming.incoming_message.message_data
      );
    }
  };

  state = {
    channel: null
  };

  render() {
    return (
      <GiftedChat
        messages={this.props.messages[this.props.id]}
        onSend={messages => this.onSend(messages)}
        user={{
          _id: parseInt(this.props.user_id)
        }}
        renderUsernameOnMessage={true}
        renderAvatar={null}
        showUserAvatar={false}
        inverted={true}
      />
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff"
  }
});

const mapDispatchToProps = dispatch => {
  return {
    onSetTimeForPlan: time => dispatch(setTimeForPlan(time)),
    onGetMessages: id => dispatch(getMessages(id)),
    onIncomingWebsocketMessage: (plan_id, message_data) =>
      dispatch(incomingWebsocketMessage(plan_id, message_data)),
    onSendMessage: (plan_id, content) => dispatch(sendMessage(plan_id, content))
  };
};

const mapStateToProps = state => {
  return {
    messages: state.active_plans.messages,
    user_id: state.users.user_id
  };
};

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(PlanChat);
