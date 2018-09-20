import React from "react";
import { AppRegistry } from "react-native";
import { Provider } from "react-redux";
import App from "./App";
import configureStore from "./src/store/configureStore";

//import bgMessaging from "./src/utils/bgMessaging";

const store = configureStore();

const RNRedux = () => (
  <Provider store={store}>
    <App />
  </Provider>
);

AppRegistry.registerComponent("mainTest", () => RNRedux);
// AppRegistry.registerHeadlessTask(
//   "RNFirebaseBackgroundMessage",
//   () => bgMessaging
// );
