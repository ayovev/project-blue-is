import React, { Component } from "react";
const moment = require(`moment`);

export default class Status extends Component {
  render() {
    return (
      <div>
        <code>datetime: {moment().format(`YYYY-MM-DD HH:mm:ss`)}{`\n\n`}</code>
        <code>service: app-client{`\n\n`}</code>
        <code>status: 200{`\n\n`}</code>
      </div>
    );
  }
}
