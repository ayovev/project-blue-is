import React, { Component } from 'react';
import { Form, FormGroup, Input, Button, Label } from 'reactstrap';
import { Line, LineChart } from 'recharts';
import md5 from "md5";
import axios from "axios";
import styles from './Signup.css';

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

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: ``,
      lastName: ``,
      birthdate: ``,
      email: ``,
      password: ``,
      confirmPassword: ``,
      investmentStyle: ``
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
      firstName: this.state.firstName,
      lastName: this.state.lastName,
      birthdate: this.state.birthdate,
      email: this.state.email,
      password: md5(this.state.password),
      investmentStyle: this.state.investmentStyle
    };

    const options = {
      method: `POST`,
      url: `/api/signup`,
      data
    };

    const response = await axios(options);

    switch (response.status) {
      case 201:
        alert(`Signed Up`);
        window.location.assign(`/`);
        break;
      case 422:
        alert(`User Already Exists`);
        break;
      default:
        alert(`Unknown Error ${response.status}`);
        break;
    }
  }

  // definitely need to have more validation here but it's a start
  validateForm = () => {
    return this.state.email.length > 6 && this.state.password.length > 6 && (this.state.password === this.state.confirmPassword);
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
        <h1 className={styles.preFormText}>Sign up for IEEN</h1>
        <br/>
        <div className={styles.container}>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="firstName">First Name</Label>
              <Input autoComplete="first name" type="name" id="firstName" value={this.state.firstName} onChange={this.handleChange} placeholder="Enter your first name" />
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="lastName">Last Name</Label>
              <Input autoComplete="last name" type="name" id="lastName" value={this.state.lastName} onChange={this.handleChange} placeholder="Enter your last name" />
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="birthdate">Date of Birth</Label>
              <Input type="datetime" id="birthdate" value={this.state.birthdate} onChange={this.handleChange} placeholder="mm/dd/yyyy" />
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input autoComplete="username email" type="email" id="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter your email address" />
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input autoComplete="new-password" type="password" id="password" value={this.state.password} onChange={this.handleChange} placeholder="Create a password" />
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input autoComplete="new-password" type="password" id="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} placeholder="Confirm your password" />
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="investmentStyle">Investment Style</Label>
              <Input type="select" id="investmentStyle" value={this.state.investmentStyle} onChange={this.handleChange}>
                <option></option>
                <option value="scalper">Scalper</option>
                <option value="dayTrader">Day Trader</option>
                <option value="swingTrader">Swing Trader</option>
                <option value="investor">Investor</option>
                <option value="economist">Economist</option>
              </Input>
            </FormGroup>
            <br/>
            <Button type="submit" color="primary" block disabled={!this.validateForm()}>
              Create Account
            </Button>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}
