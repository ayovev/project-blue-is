import React, { Component } from "react";
import { Button, Col, Container, Form, FormGroup, Input, Label, Media, Row } from 'reactstrap';
import axios from 'axios';
import md5 from 'md5';
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
      url: `/api/users/`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);

    const userData = response.data;
    const { firstName, lastName, birthdate, email, investmentStyle, profilePicture } = userData;
    const createdAt = new Date(userData[`createdAt`]).toLocaleDateString(`en-US`, { month: `long`, year: `numeric` });
    const formattedProfilePicture = profilePicture.replace(`32`, `128`);

    this.setState({
      createdAt,
      formattedProfilePicture,
      current: {
        firstName,
        lastName,
        birthdate,
        email,
        investmentStyle
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

  preprocessRequestData = (data) => {
    for (const key in data) {
      if (data[key] === `` || data[key] === undefined || data[key] === null || key.includes(`confirm`)) {
        delete data[key];
      }
      if (key.includes(`password`)) {
        data[key] = md5(data[key]);
      }
    }
  }

  handleSubmit = async (event) => {
    event.preventDefault();

    this.setState({
      buttonDisabled: true
    });

    const data = this.state.new;
    this.preprocessRequestData(data);

    const options = {
      method: `PUT`,
      url: `/api/users`,
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

  getValue = (key) => {
    return this.state.new[key] === undefined ? this.state.current[key] : this.state.new[key];
  }

  validateForm = () => {
    // passVal & emailVal => check and confirm that new passwords and emails are valid. one keystroke on password will set this flag to false until the other field matches or all is erased.
    // miscEntry => if any of the fields are edited that don't require a confirm field, set to true as the form can be submited.
    let passVal = true;
    let emailVal = true;
    let miscEntry = false;

    if (this.state.new.password || this.state.confirmPassword) {
      passVal = (this.state.new.password === this.state.new.confirmPassword) && this.state.new.password.length > 6;
      // You need to set the miscEntry to true to cover the case if password was the only field changed.
      if (passVal) {
        miscEntry = true;
      }
      else {
        miscEntry = false;
      }
    }
    if (this.state.new.email || this.state.new.confirmEmail) {
      emailVal = this.state.new.email === this.state.new.confirmEmail;
      // Same for the reasons above.
      if (emailVal) {
        miscEntry = true;
      }
      else {
        miscEntry = false;
      }
    }
    if (this.state.new.firstName || this.state.new.lastName || this.state.new.birthdate ||this.state.new.investmentStyle) {
      miscEntry = true;
    }
    return passVal && emailVal && miscEntry;
  }

  render() {
    return (
      <React.Fragment>
        <Container>
          <Row className="FrameTitleText">
            <Col>
              <h2>User Preferences</h2>
              <hr className="dark"></hr>
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
                  <Label for="birthdate">Date of Birth</Label>
                  <Input type="datetime" id="birthdate" value={this.getValue(`birthdate`)} onChange={this.handleChange} placeholder="mm/dd/yyyy"/>
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
                  <Label for="confirmNewEmail">Confirm New Email</Label>
                  <Input type="email" id="confirmEmail" onChange={this.handleChange}/>
                </FormGroup>
              </Col>
              
            </Row>
            <Row className={styles.accountFormRow}>
            <Col md={5}>
                <FormGroup>
                  <Label for="newPassword">New Password</Label>
                  <Input type="password" id="password" onChange={this.handleChange}/>
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
                <Button type="submit" color="primary" block disabled={!this.validateForm()}>
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

