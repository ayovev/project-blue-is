import { Component } from 'react';
const moment = require(`moment`);

export default class Status extends Component {
  render() {
    return ({
      datetime: moment().format(`YYYY-MM-DD HH:mm:ss`),
      service: `app-server`,
      status: 200,
    });
  }
}
