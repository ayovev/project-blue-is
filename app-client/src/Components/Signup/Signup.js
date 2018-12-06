import React, { Component } from 'react';
import { FormGroup, Input, Button, Label } from 'reactstrap';
import { LineChart, Line } from 'recharts'
import styles from './Signup.css';

const DATA_LENGTH = 8;

export default class Signup extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ``,
      password: ``,
      confirmPassword: ``,
      birthdate: ``,
      investorPreferences: ``,
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value,
    });
  }

  // definitely need to have more validation here but it's a start
  validateForm = () => {
    return this.state.email.length > 6 && this.state.password.length > 6 && (this.state.password === this.state.confirmPassword);
  }

  // may want to replace this function with some hard-coded data for consistency
  generateData = () => {
    let data = [];
    let value;
     for (let index = 0; index < DATA_LENGTH; index++) {
      value = Math.floor(Math.random() * Math.floor(50));
      data.push({value: value});
    }
     return data;
  }

  render() {
    return (
      <React.Fragment>
        <div>
          {/* Possibly include some kind of chart here before the text to add a dynamic branding component to the page? */}
          <LineChart className={styles.chart} width={75} height={75} data={this.generateData()}>
            <Line type="natural" dataKey="value" stroke="#4286f4" strokeWidth={2} dot={null} animationDuration={1200}/>
          </LineChart>
        </div>
        <h1 className={styles.preFormText}>Sign up for IEEN</h1>
        <br/>
        <div className={styles.container}>
          <FormGroup>
            <Label for="email">Email</Label>
            <Input type="email" id="email" value={this.state.email} onChange={this.handleChange} placeholder="Enter your email address" />
          </FormGroup>
          <br/>
          <FormGroup>
            <Label for="password">Password</Label>
            <Input type="password" id="password" value={this.state.password} onChange={this.handleChange} placeholder="Create a password" />
          </FormGroup>
          <br/>
          <FormGroup>
            <Label for="confirmPassword">Confirm Password</Label>
            <Input type="password" id="confirmPassword" value={this.state.confirmPassword} onChange={this.handleChange} placeholder="Confirm your password" />
          </FormGroup>
          <br/>
          <FormGroup>
            <Label for="birthdate">Date of Birth</Label>
            <Input type="datetime" id="birthdate" value={this.state.birthdate} onChange={this.handleChange} placeholder="mm/dd/yyyy" />
          </FormGroup>
          <br/>
          <FormGroup>
            <Label for="investorPreferences">Investor Profile</Label>
            <Input type="select" id="investorPreferences" value={this.state.investorPreferences} onChange={this.handleChange}>
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
        </div>
      </React.Fragment>
    );
  }
}
