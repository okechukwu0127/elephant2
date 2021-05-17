import React from "react";
import { Provider } from "react-redux";

import createStore from "./app/reducers";

import createFetch from "./app/createFetch";

import Root from "./app/containers/Root/Root";

import i18n from "./app/i18n/I18n";
import { I18nextProvider } from "react-i18next";

const customFetch = createFetch(fetch);
export const store = createStore({ fetch: customFetch, i18n });

export default class App extends React.Component {
  render() {
    return (
      <Provider store={store}>
        <I18nextProvider i18n={i18n}>
          <Root />
        </I18nextProvider>
      </Provider>
    );
  }
}

if (!__DEV__) {
  // eslint-disable-line no-undef
  [
    "assert",
    "clear",
    "count",
    "debug",
    "dir",
    "dirxml",
    "error",
    "exception",
    "group",
    "groupCollapsed",
    "groupEnd",
    "info",
    "log",
    "profile",
    "profileEnd",
    "table",
    "time",
    "timeEnd",
    "timeStamp",
    "trace",
    "warn",
  ].forEach((methodName) => {
    console[methodName] = () => {
      /* noop */
    };
  });
}
