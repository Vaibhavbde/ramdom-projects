import "react-hot-loader/patch";
import React from "react";
import { render } from "react-dom";
import { AppContainer } from "react-hot-loader";
import Root from "./Root";

// Suppress ResizeObserver errors
const resizeObserverLoopErrRe = /^[^(ResizeObserver loop limit exceeded)]/;
const resizeObserverLoopErr = window.console.error;
window.console.error = (...args) => {
  const resizeObserverErrCheck = args.find(
    (arg) =>
      typeof arg === "string" &&
      (arg.includes("ResizeObserver loop") ||
        arg.includes("ResizeObserver loop completed with undelivered notifications"))
  );
  if (resizeObserverErrCheck) return;
  resizeObserverLoopErr(...args);
};

// Suppress unhandled promise rejection for ResizeObserver
window.addEventListener('error', (e) => {
  if (e.message.includes('ResizeObserver loop')) {
    e.stopImmediatePropagation();
  }
});

render(
  <AppContainer>
    <Root />
  </AppContainer>,
  document.getElementById("root")
);

if (module.hot) {
  module.hot.accept("./Root", () => {
    const NewRoot = require("./Root").default;
    render(
      <AppContainer>
        <NewRoot />
      </AppContainer>,
      document.getElementById("root")
    );
  });
}
