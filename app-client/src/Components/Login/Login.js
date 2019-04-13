import React, { Component } from "react";
import { NavLink as RRNavLink } from 'react-router-dom';
import { Button, Form, FormGroup, Input, Label, NavLink } from "reactstrap";
import { LineChart, Line } from "recharts";
import md5 from "md5";
import { AuthenticationContext } from "../../Contexts/AuthenticationContext/AuthenticationContext";
import styles from "./Login.css";

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

    this.context.login(data);
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
              <Input tabIndex={1} type="email" id="email" value={this.state.email} placeholder="Enter your email address" onChange={this.handleChange}/>
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="password">Password</Label>
              <NavLink tabIndex={4} to="/forgotPassword" tag={RRNavLink} className={styles.forgotPasswordLink}>Forgot your password?</NavLink>
              <Input tabIndex={2} type="password" id="password" value={this.state.password} placeholder="Enter your password" onChange={this.handleChange}/>
            </FormGroup>
            <br/>
            <Button tabIndex={3} type="submit" color="primary" block disabled={!this.validateForm()}>
              Login
            </Button>
          </Form>
        </div>
        <div className={styles.container2}>
          New To IEEN?&nbsp;<NavLink tabIndex={5} to="/signup" tag={RRNavLink} className={styles.signupLink}>Sign Up.</NavLink>
        </div>
      </React.Fragment>
    );
  }
}

Login.contextType = AuthenticationContext;
