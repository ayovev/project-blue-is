import React, { Component } from "react";
import { Redirect } from "react-router-dom";
import { Alert, Button, Form, FormGroup, Input, Label } from "reactstrap";
import axios from "axios";
import md5 from "md5";
import styles from "../ForgotPassword/ForgotPassword.css";

export default class ResetPassword extends Component {
  constructor(props) {
    super(props);

    this.state = {
      password: ``,
      confirmPassword: ``,

      token: props.match.params.token,
      redirect: undefined,

      alertVisible: true,
      buttonDisabled: false,
      response: undefined,
      statusCode: undefined
    };
  }

  async componentDidMount() {
    await this.validateJWT();
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
      confirmPassword: md5(this.state.confirmPassword),
      password: md5(this.state.password),
      token: this.state.token
    };

    const options = {
      method: `PUT`,
      url: `/api/users/resetPassword`,
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

      if (this.state.statusCode === 200) {
        setTimeout(() => {
          this.setState({ redirect: true });
        }, 3000);
      }
    }
  }

  validateForm = () => {
    return this.state.password.length > 6 && (this.state.password === this.state.confirmPassword);
  }

  validateJWT = async () => {
    const options = {
      method: `GET`,
      url: `/api/authentication/validate`,
      headers: { "authorization": this.state.token }
    };

    let response;

    try {
      response = await axios(options);
    }
    catch (error) {
      response = error.response;
    }

    if (response.status !== 200) {
      this.setState({ redirect: true });
    }
    else {
      this.setState({ redirect: false });
    }
  }

  renderAlert = () => {
    const { response, statusCode } = this.state;

    if (!response || !statusCode) {
      return;
    }

    const alertConfiguration = {
      color: statusCode === 200 ? `success` : `danger`,
      message: response.data || response.statusText
    };

    return (
      <Alert className={styles.alert} color={alertConfiguration.color} isOpen={this.state.alertVisible} toggle={this.dismissAlert}>
        {alertConfiguration.message}
      </Alert>
    );
  }

  render() {
    if (this.state.redirect === undefined) {
      return null;
    }

    if (this.state.redirect) {
      return <Redirect to="/" />;
    }

    return (
      <React.Fragment>
        {this.renderAlert()}
        <h1 className={styles.preFormText}>Reset Password</h1>
        <br/>
        <div className={styles.container}>
          <Form onSubmit={this.handleSubmit}>
            <FormGroup>
              <Label for="password">Password</Label>
              <Input type="password" id="password" value={this.state.password} placeholder="Enter your new password" onChange={this.handleChange}/>
            </FormGroup>
            <br/>
            <FormGroup>
              <Label for="confirmPassword">Confirm Password</Label>
              <Input type="password" id="confirmPassword" value={this.state.confirmPassword} placeholder="Confirm your new password" onChange={this.handleChange}/>
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
