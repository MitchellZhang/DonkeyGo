import React, { Component }  from 'react';
import { BrowserRouter as Router, Route, /*hashHistory*/ } from "react-router-dom";
import App from "./App";
//import {Provider} from 'react-redux'
export default class AdminRouter extends Component {
  render() {
    return (
    //<Provider store={store}>
    <Router >
      <Route exact path="/" component={App} />
    </Router>
    //</Provider>
    )
  }
}

