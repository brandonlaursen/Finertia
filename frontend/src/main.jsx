import "./index.css";
import "./styles/theme.css";

import React from "react";
import ReactDOM from "react-dom/client";

import { Provider } from "react-redux";

import configureStore from "../store";
import { restoreCSRF, csrfFetch } from "../store/csrf";

import App from "./App";
// import ThemeToggle from "./components/ThemeToggle/ThemeToggle";

import { ModalProvider, Modal } from "./context/Modal";

import { ThemeProvider } from "./context/ThemeContext";
import { AccentThemeProvider } from "./context/AccentThemeContext";

const store = configureStore();

if (import.meta.env.MODE !== "production") {
  restoreCSRF();

  window.csrfFetch = csrfFetch;
  window.store = store;
}

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <AccentThemeProvider>
      <ThemeProvider>
        <ModalProvider>
          <Provider store={store}>
            <App />
            <Modal />
            {/* <ThemeToggle /> */}
          </Provider>
        </ModalProvider>
      </ThemeProvider>
    </AccentThemeProvider>
  </React.StrictMode>
);
