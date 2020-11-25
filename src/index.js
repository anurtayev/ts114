import React from "react";
import ReactDOM from "react-dom";
import Amplify from "aws-amplify";
import { BrowserRouter as Router } from "react-router-dom";
import { ThemeProvider } from "styled-components";

import reportWebVitals from "./reportWebVitals";
import awsExports from "./aws-exports";
import { App } from "./App";
import { theme } from "common";

import "./index.css";

Amplify.configure(awsExports);

ReactDOM.render(
  <React.StrictMode>
    <ThemeProvider theme={theme}>
      <Router>
        <App />
      </Router>
    </ThemeProvider>
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
