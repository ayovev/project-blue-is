import React, { Component } from "react";
import { Alert, Button, Form, FormGroup, Input, Label } from "reactstrap";
import { Line, LineChart } from "recharts";
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
      message: ``,

      alertVisible: true,
      buttonDisabled: false,
      statusCode: undefined
      // still debating on whether to use a status state for rendering...
      // status: undefined
    };
  }

  dismissAlert = () => {
    this.setState({
      alertVisible: false
    });
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      buttonDisabled: true
    });

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

    this.setState({
      statusCode: response.status
    });
  }

  validateForm = () => {
    return this.state.email && this.state.subject && this.state.message;
  }

  renderAlert = () => {
    const { statusCode } = this.state;

    if (!statusCode) {
      return;
    }

    const alertConfiguration = {
      color: statusCode === 202 ? `success` : `danger`,
      // TODO @Nate: modify this to use some better more specific verbiage
      message: statusCode === 202 ? `Message sent successfully 👍` : `There was a problem sending your message 👎`
    };

    return (
      <Alert className={styles.alert} color={alertConfiguration.color} isOpen={this.state.alertVisible} toggle={this.dismissAlert}>
        {alertConfiguration.message}
      </Alert>
    );
  }

  render() {
    return (
      <React.Fragment>
        {this.renderAlert()}
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
              <Input type="text" id="subject" value={this.state.subject} placeholder="Enter the subject of your message" onChange={this.handleChange}/>
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="message">Message</Label>
              <Input type="textarea" id="message" value={this.state.message} placeholder="Enter your message" onChange={this.handleChange} rows={5}/>
            </FormGroup>
            <br/>
            <Button type="submit" color="primary" block disabled={!this.validateForm() || this.state.buttonDisabled}>
              Send Message
            </Button>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}
