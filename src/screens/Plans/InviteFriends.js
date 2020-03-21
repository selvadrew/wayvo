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


class InviteFriends extends Component {
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

    };

    componentDidMount() {

    }

    componentWillUnmount() {

    }



    render() {
        return (
            <View><Text>hi</Text></View>
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
)(InviteFriends);
