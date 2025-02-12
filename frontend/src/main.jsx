import "./index.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";

import configureStore from "../store";
import { restoreCSRF, csrfFetch } from "../store/csrf";

import App from "./App";
import { ModalProvider, Modal } from "./context/Modal";

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <ModalProvider>
      <Provider store={store}>
        <App />
        <Modal />
      </Provider>
    </ModalProvider>
  </React.StrictMode>
);
