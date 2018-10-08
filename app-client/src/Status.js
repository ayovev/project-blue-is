import React, { Component } from "react";
const moment = require(`moment`);

export default class Status extends Component {
  render() {
    return (
      <div>
        {{
          datetime: moment().format(`YYYY-MM-DD HH:mm:ss`),
          service: `app-client`,
          status: 200
        }}
      </div>);
  }
}
