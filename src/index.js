import React from "react";
import { render } from "react-dom";
import { BrowserRouter as Router } from "react-router-dom";
import "bootstrap/dist/css/bootstrap.min.css";
import App from "./App";
import "./index.css";
import Amplify from 'aws-amplify';
import config from './aws-exports';

Amplify.configure(config);

render(
    <Router>
      <App />
    </Router>,
  document.getElementById("app")
);
