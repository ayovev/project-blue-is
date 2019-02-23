import React, { Component } from "react";
import { Form, FormGroup, Input, Button, Label } from "reactstrap";
import { LineChart, Line } from "recharts";
import md5 from "md5";
import { AuthenticationContext } from "../../Contexts/AuthenticationContext/AuthenticationContext";
import styles from './Login.css';

// test data for chart
const data = [
  { value: 45 },
  { value: 45 },
  { value: 45 },
  { value: 45 },
  { value: 45 },
  { value: 45 },
  { value: 45 },
  { value: 45 },
  { value: 45 }
];

export default class Login extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ``,
      password: ``
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    const data = {
      email: this.state.email,
      password: md5(this.state.password)
    };

    const config = {
      method: `POST`,
      headers: {
        "accept": `application/json`,
        "content-type": `application/json`
      },
      body: JSON.stringify(data)
    };

    let response = await fetch(`/eapi/login`, config);

    switch (response.status) {
      case 401:
        alert(`Incorrect Credentials`);
        break;
      case 404:
        alert(`User Does Not Exist`);
        break;
      case 200:
        alert(`Successfully Authenticated`);
        this.context.login();
        break;
      default:
        alert(`Unkown Error ${response.status}`);
        break;
    }
  }

  // might need to have more validation here but it"s a start
  validateForm = () => {
    return this.state.email.length > 6 && this.state.password.length > 6;
  }

  render() {
    return (
      <React.Fragment>
        <div>
          {/* Possibly include some kind of chart here before the text to add a dynamic branding component to the page? */}
          <LineChart className={styles.chart} width={75} height={75} data={data}>
            <Line type="natural" dataKey="value" stroke="#4286f4" strokeWidth={2} dot={null} animationDuration={1200}/>
          </LineChart>
        </div>
        <h1 className={styles.preFormText}>Login to IEEN</h1>
        <br/>
        <div className={styles.container}>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" id="email" value={this.state.email} onChange={this.handleChange}/>
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" id="password" value={this.state.password} onChange={this.handleChange}/>
            </FormGroup>
            <br/>
            <Button type="submit" color="primary" block disabled={!this.validateForm()}>
              Login
            </Button>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}

Login.contextType = AuthenticationContext;
