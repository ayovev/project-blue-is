import React, { Component } from "react";
const moment = require(`moment`);

export default class Status extends Component {
  render() {
    return (
      <div>
        <code>datetime: {moment().format(`YYYY-MM-DD HH:mm:ss`)}</code>
        <br></br>
        <code>service: app-client</code>
        <br></br>
        <code>status: 200</code>
      </div>
    );
  }
}
