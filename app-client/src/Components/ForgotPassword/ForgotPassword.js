import React, { Component } from "react";
import { Alert, Button, Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import styles from "./ForgotPassword.css";

export default class ForgotPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      email: ``,

      alertVisible: true,
      buttonDisabled: false,
      response: undefined,
      statusCode: undefined
    };
  }

  handleChange = (event) => {
    this.setState({
      [event.target.id]: event.target.value
    });
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({ buttonDisabled: true });

    const data = {
      email: this.state.email
    };

    const options = {
      method: `POST`,
      url: `/api/emails/forgotPassword`,
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
    return this.state.email.length > 6;
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
        <h1 className={styles.preFormText}>Forgot Password</h1>
        <br/>
        <div className={styles.container}>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="email">Email</Label>
              <Input type="email" id="email" value={this.state.email} placeholder="Enter your email address" onChange={this.handleChange}/>
            </FormGroup>
            <br/>
            <Button type="submit" color="primary" block disabled={!this.validateForm() || this.state.buttonDisabled}>
              Reset Password
            </Button>
          </Form>
        </div>
      </React.Fragment>
    );
  }
}
