import { createStore, combineReducers, compose, applyMiddleware } from "redux";
import thunk from "redux-thunk";

import placesReducer from "./reducers/places";
import usersReducer from "./reducers/users";
import friendsReducer from "./reducers/friends";
import activeFriendsReducer from "./reducers/activeFriends";
import uiReducer from "./reducers/ui";
import outgoingReducer from "./reducers/outgoingCalls";
import groupsReducer from "./reducers/groups";
import activeGroupsReducer from "./reducers/activeGroups";
import customGroupsReducer from "./reducers/customGroups";
import plansReducer from "./reducers/plans";
import activePlansReducer from "./reducers/activePlans";

const rootReducer = combineReducers({
  users: usersReducer,
  friends: friendsReducer,
  active_friends: activeFriendsReducer,
  ui: uiReducer,
  outgoing: outgoingReducer,
  groups: groupsReducer,
  active_groups: activeGroupsReducer,
  custom_groups: customGroupsReducer,
  plans: plansReducer,
  active_plans: activePlansReducer
});

let composeEnhancers = compose;

if (__DEV__) {
  composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
}

const configureStore = () => {
  return createStore(rootReducer, composeEnhancers(applyMiddleware(thunk)));
};

export default configureStore;
