import React, { Component } from "react";
import { Form, FormGroup, Input, Button, Label } from "reactstrap";
import { LineChart, Line } from "recharts";
import axios from "axios";
import styles from './ContactUs.css';

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

export default class ContactUs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ``,
      subject: ``,
      message: ``
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
      subject: this.state.subject,
      message: this.state.message
    };

    const options = {
      method: `POST`,
      url: `/api/email`,
      data
    };

    const response = await axios(options);

    switch (response.status) {
      case 202:
        alert(`Message Sent`);
        break;
      default:
        alert(`Unkown Error ${response.status}`);
        break;
    }
  }

  // need to have validation here
  validateForm = () => {
    // return this.state.email.length > 6 && this.state.subject && this.state.body.length > 20;
    return true;
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
        <h1 className={styles.preFormText}>Contact Us</h1>
        <br/>
        <div className={styles.container}>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" id="email" value={this.state.email} placeholder="Enter your email address" onChange={this.handleChange}/>
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="subject">Subject</Label>
              <Input type="subject" id="subject" value={this.state.subject} placeholder="Enter the subject of your message" onChange={this.handleChange}/>
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="message">Message</Label>
              <Input type="textarea" id="message" value={this.state.message} placeholder="Enter your message" onChange={this.handleChange}/>
            </FormGroup>
            <br/>
            <Button type="submit" color="primary" block disabled={!this.validateForm()}>
              Send Email
            </Button>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}
