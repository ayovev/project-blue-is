import React, { Component } from "react";
import Header from "../Header/Header";
import Routes from "../Routes";
import "./App.css";

export default class App extends Component {
  render() {
    return (
      <div>
        <Header />
        Hello World
        <Routes />
      </div>
    );
  }
}
