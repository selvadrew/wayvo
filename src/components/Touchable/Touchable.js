import { Platform } from "react-native"
import { TouchableNativeFeedback, TouchableOpacity } from "react-native"
import React from "react"

export const Touchable = (props) => {
    return Platform.OS === 'android'
        ? <TouchableNativeFeedback onPress={props.onPress}>{props.children}</TouchableNativeFeedback>
        : <TouchableOpacity onPress={props.onPress}>{props.children}</TouchableOpacity>
}