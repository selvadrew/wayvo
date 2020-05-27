import { SET_ACCESS_TOKEN, SET_PROFILE } from "../../store/actions/users";
import {
  USERNAME_ERROR,
  STORE_PHONE_NUMBER,
  SIGNUP_ERROR,
  LOGIN_ERROR,
  SUBMITTED,
  STORE_CONTACTS,
  SELECT_CONTACT,
  CLEAR_SELECTED_CONTACTS
} from "../actions/actionTypes";

const initialState = {
  accessToken: null,
  username: null,
  username_error: null,
  signup_error: null,
  login_error: null,
  phoneNumber: null,
  fullname: null,
  ios: null,
  verified: null,
  enrollment: null,
  instagram: null,
  snapchat: null,
  twitter: null,
  submitted: null,
  user_id: null,
  nextScreen: null,
  contacts: [],
  selectedContactIds: []
};

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case SET_ACCESS_TOKEN:
      return {
        ...state,
        accessToken: action.accessToken
      };
    case SET_PROFILE:
      return {
        ...state,
        profile: action.profile
      };
    case USERNAME_ERROR:
      return {
        ...state,
        username_error: action.error
      };
    case SIGNUP_ERROR:
      return {
        ...state,
        signup_error: action.error,
        nextScreen: action.nextScreen
      };
    case LOGIN_ERROR:
      return {
        ...state,
        login_error: action.error
      };
    case STORE_PHONE_NUMBER:
      return {
        ...state,
        fullname: action.fullname,
        phoneNumber: action.phoneNumber,
        username: action.username,
        ios: action.ios,
        verified: action.verified,
        enrollment: action.enrollment,
        instagram: action.instagram,
        snapchat: action.snapchat,
        twitter: action.twitter,
        submitted: action.submitted,
        user_id: action.user_id
      };
    case SUBMITTED:
      return {
        ...state,
        submitted: true
      };
    case STORE_CONTACTS:
      return {
        ...state,
        contacts: action.contacts,
        selectedContactIds: []
      };
    case SELECT_CONTACT:
      const index = state.selectedContactIds.indexOf(action.contactId)
      if (index > -1) {
        state.selectedContactIds.splice(index, 1)
      } else {
        state.selectedContactIds.push(action.contactId)
      }
      return {
        ...state,
        contacts: state.contacts.map(
          contact =>
            contact.contactId === action.contactId ? { ...contact, selected: !contact.selected } : contact
        )
      };
    case CLEAR_SELECTED_CONTACTS:
      return {
        ...state,
        contacts: state.contacts.map(
          contact =>
            contact.selected === true ? { ...contact, selected: false } : contact
        ),
        selectedContactIds: []
      }
    default:
      return state;
  }
};

export default reducer;
