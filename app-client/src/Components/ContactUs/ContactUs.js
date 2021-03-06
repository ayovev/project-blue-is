import React, { Component } from "react";
import { Alert, Button, Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import styles from "./ContactUs.css";

export default class ContactUs extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ``,
      inquiryType: ``,
      subject: ``,
      message: ``,

      alertVisible: true,
      buttonDisabled: false,
      response: undefined,
      statusCode: undefined
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
      inquiryType: this.state.inquiryType,
      subject: this.state.subject,
      message: this.state.message
    };

    const options = {
      method: `POST`,
      url: `/api/emails/contactUs`,
      data
    };

    let response;

    try {
      response = await axios(options);
    }
    catch (error) {
      response = error.response;
    }
    finally {
      this.setState({
        response,
        statusCode: response.status
      });
    }
  }

  validateForm = () => {
    return this.state.email && this.state.subject && this.state.message;
  }

  renderAlert = () => {
    const { response, statusCode } = this.state;

    if (!response || !statusCode) {
      return;
    }

    const alertConfiguration = {
      color: statusCode === 202 ? `success` : `danger`,
      message: response.data || response.statusText
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
        <h1 className={styles.preFormText}>Contact Us</h1>
        <br/>
        <div className={styles.container}>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input required={true} type="email" id="email" value={this.state.email} placeholder="Enter your email address" onChange={this.handleChange}/>
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="inquiryType">Inquiry Type</Label>
              <Input required={true} type="select" id="inquiryType" value={this.state.inquiryType} onChange={this.handleChange}>
                <option></option>
                <option value="bugReporting">Bug Reporting</option>
                <option value="generalInquiry">General Inquiry</option>
                <option value="salesQuestion">Sales Question</option>
                <option value="technicalSupport">Technical Support</option>
              </Input>
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="subject">Subject</Label>
              <Input required={true} type="text" id="subject" value={this.state.subject} placeholder="Enter the subject of your message" onChange={this.handleChange}/>
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="message">Message</Label>
              <Input required={true} type="textarea" id="message" value={this.state.message} placeholder="Enter your message" onChange={this.handleChange} rows={5}/>
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
