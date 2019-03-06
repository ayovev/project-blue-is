import React, { Component } from "react";
import { Container, Media, Row, Col, Form, FormGroup, Input, Button, Label } from 'reactstrap';
import axios from 'axios';
import styles from "./UserSettings.css";

export default class UserSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      formattedProfilePicture: ``,
      createdAt: ``,

      current: {
        firstName: ``,
        lastName: ``,
        birthdate: ``,
        email: ``,
        investmentStyle: ``
      },

      new: {}
    };
  }

  async componentDidMount() {
    await this.getUserInfo();
  }

  getUserInfo = async () => {
    const options = {
      method: `GET`,
      url: `/api/user/userSettings`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);
    const userData = response.data;
    const { profilePicture, firstName, lastName, email, investmentStyle, birthdate } = userData;
    const createdAt = new Date(userData[`createdAt`]).toLocaleDateString(`en-US`, { month: `long`, year: `numeric` });
    const formattedProfilePicture = profilePicture.replace(`32`, `128`);

    this.setState({
      createdAt,
      formattedProfilePicture,
      current: {
        email, firstName, lastName, investmentStyle, birthdate
      }
    });
  }

  handleChange = async (event) => {
    this.setState({
      new: {
        ...this.state.new,
        [event.target.id]: event.target.value
      }
    });
  }

  preprocessData = (data) => {
    for (const key in data) {
      if (data[key] === `` || data[key] === undefined || data[key === null]) {
        delete data[key];
      }
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      buttonDisabled: true
    });

    const data = this.state.new;
    this.preprocessData(data);

    // const options = {
    //   method: `PUT`,
    //   url: `/api/user`,
    //   data
    // };

    // let response;

    // try {
    //   response = await axios(options);
    // }
    // catch (error) {
    //   response = error.response;
    // }
    // finally {
    //   this.setState({
    //     response,
    //     statusCode: response.status
    //   });
    // }
  }

  getValue = (key) => {
    return this.state.new[key] === undefined ? this.state.current[key] : this.state.new[key];
  }

  // This needs to be fine tuned based on the current states of the fields. DOB could potentially be the only thing modified.
  // validateForm = () => {
  //   return this.state.newEmail.length > 6 && this.state.newPassword.length > 6 && (this.state.newPassword === this.state.confirmNewPassword);
  // }

  render() {
    return (
      <React.Fragment>
        <Container className={styles.containerFrame2}>
          <Row className={`FrameTitleText`}>
            <Col>
              <h2>User Preferences</h2>
              <hr className={`dark`}></hr>
            </Col>
          </Row>
          <Row className={styles.memberDisplay}>
            <Media middle>
              <Media left>
                <Media object src={this.state.formattedProfilePicture} alt="User Profile Picture" />
              </Media>
              <Media body>
                <Media heading>
                  {this.state.current.firstName} {this.state.current.lastName}
                </Media>
                  Member Since: {this.state.createdAt}
              </Media>
            </Media>
          </Row>
          <hr className={styles.hrSeperator}></hr>
          <Form onSubmit={this.handleSubmit}>
            <Row className={styles.accountFormRow}>
              <Col md={5}>
                <FormGroup>
                  <Label for="firstName">First Name</Label>
                  <Input autoComplete="first name" type="name" id="firstName" value={this.getValue(`firstName`)} onChange={this.handleChange}/>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <Input autoComplete="last name" type="name" id="lastName" value={this.getValue(`lastName`)} onChange={this.handleChange}/>
                </FormGroup>
              </Col>
            </Row>
            <Row className={styles.accountFormRow}>
              <Col md={5}>
                <FormGroup>
                  <Label for="email">Current Email</Label>
                  <Input type="email" value={this.state.current.email} disabled/>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label for="newPassword">New Password</Label>
                  <Input type="password" id="password" onChange={this.handleChange}/>
                </FormGroup>
              </Col>
            </Row>
            <Row className={styles.accountFormRow}>
              <Col md={5}>
                <FormGroup>
                  <Label for="newEmail">New Email</Label>
                  <Input type="email" id="email" onChange={this.handleChange}/>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label for="confirmNewPassword" required>Confirm New Password</Label>
                  <Input type="password" id="confirmPassword" onChange={this.handleChange}/>
                </FormGroup>
              </Col>
            </Row>
            <Row className={styles.accountFormRow}>
              <Col md={5}>
                <FormGroup>
                  <Label for="confirmNewEmail">Confirm New Email</Label>
                  <Input type="email" id="confirmEmail" onChange={this.handleChange}/>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label for="birthdate">Date of Birth</Label>
                  <Input type="datetime" id="birthdate" value={this.getValue(`birthdate`)} onChange={this.handleChange} placeholder="mm/dd/yyyy"/>
                </FormGroup>
              </Col>
            </Row>
            <Row className={styles.accountFormRow}>
              <Col md={5}>
                <FormGroup>
                  <Label for="investmentStyle" required>Investment Style</Label>
                  <Input type="select" id="investmentStyle" value={this.getValue(`investmentStyle`)} onChange={this.handleChange}>
                    <option></option>
                    <option value="scalper">Scalper</option>
                    <option value="dayTrader">Day Trader</option>
                    <option value="swingTrader">Swing Trader</option>
                    <option value="investor">Investor</option>
                    <option value="economist">Economist</option>
                  </Input>
                </FormGroup>
              </Col>
              <Col md={5} className={styles.submitButtonCol}>
                <Button type="submit" color="primary" block /* disabled={!this.validateForm() || this.state.buttonDisabled }*/>
                Update Account
                </Button>
              </Col>
            </Row>
          </Form>
        </Container>
      </React.Fragment>
    );
  }
}

