import React, { Component } from "react";
import { Container, Media, Row, Col, Form, FormGroup, Input, Button, Label,Dropdown, DropdownItem, DropdownMenu, DropdownToggle } from 'reactstrap';
import axios from 'axios';
import styles from "./UserSettings.css";
import Login from "../Login/Login";

export default class UserSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: ``,
      lastName: ``,
      birthdate: ``,
      email: ``,
      newEmail: ``,
      confirmNewEmail:``,
      newPassword: ``,
      confirmNewPassword: ``,
      investmentStyle: ``,
      formattedProfilePicture:``,
      createdDate:``
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
    const { profilePicture, firstName, lastName, email, investmentStyle } = userData;
    const createdDate = new Date(userData['createdAt']).toLocaleDateString("en-US",{month: 'long',year: 'numeric'});
    var formattedProfilePicture = profilePicture.replace("32", "128");

    this.setState({
      formattedProfilePicture,email,firstName,lastName,investmentStyle,createdDate
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

    };

    const options = {
      method: `PUT`,
      url: `/api/user/userSettings`,
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

  //This needs to be fine tuned based on the current states of the fields. DOB could potentially be the only thing modified.
  validateForm = () => {
    return this.state.newEmail.length > 6 && this.state.newPassword.length > 6 && (this.state.newPassword === this.state.confirmNewPassword);
  }

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
              <Media left href="#">
                <Media object src={this.state.formattedProfilePicture} alt="User Profile Picture" />
              </Media>
              <Media body>
                <Media heading>
                  {this.state.firstName} {this.state.lastName}
                </Media>
                  Member Since: {this.state.createdDate}
              </Media>
            </Media>
          </Row>
          <hr className={styles.hrSeperator}></hr>
          <Form>
            <Row className={styles.accountFormRow}>
              <Col md={5}>
                <FormGroup>
                  <Label for="firstName">First Name</Label>
                  <Input autoComplete="first name" type="name" id="firstName" value={this.state.firstName} onChange={this.handleChange}/>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label for="lastName">Last Name</Label>
                  <Input autoComplete="last name" type="name" id="lastName" value={this.state.lastName} onChange={this.handleChange}/>
                </FormGroup>
              </Col>
            </Row>
            <Row className={styles.accountFormRow}>
              <Col md={5}>
                <FormGroup>
                  <Label for="email">Current Email</Label>
                  <Input type="email" id="email" value={this.state.email} disabled/>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label for="newPassword">New Password</Label>
                  <Input type="password" id="newPassword" value={this.state.newPassword} onChange={this.handleChange}/>
                </FormGroup>
              </Col>
            </Row>
            <Row className={styles.accountFormRow}>
              <Col md={5}>
                <FormGroup>
                  <Label for="newEmail">New Email</Label>
                  <Input valid={(something)=>console.log(something)} type="email" id="newEmail" value={this.state.newEmail} onChange={this.handleChange}/>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label for="confirmNewPassword" required>Confirm New Password</Label>
                  <Input type="password" id="confirmNewPassword" value={this.state.confirmNewPassword} onChange={this.handleChange}/>
                </FormGroup>
              </Col>
            </Row>
            <Row className={styles.accountFormRow}>
              <Col md={5}>
                <FormGroup>
                  <Label for="confirmNewEmail">Confirm New Email</Label>
                  <Input type="email" id="confirmNewEmail" value={this.state.confirmNewEmail} onChange={this.handleChange}/>
                </FormGroup>
              </Col>
              <Col md={5}>
                <FormGroup>
                  <Label for="birthdate" required>Date of Birth</Label>
                  <Input type="date" id="birthdate" value={this.state.birthdate} onChange={this.handleChange}/>
                </FormGroup>
              </Col>
            </Row>
            <Row className={styles.accountFormRow}>
              <Col md={5}>
                <FormGroup>
                <Label for="investmentStyle" required>Investment Style</Label>
                <Input type="select" id="investmentStyle" value={this.state.investmentStyle} onChange={this.handleChange}>
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
              <Button type="submit" color="primary" block disabled={!this.validateForm() || this.state.buttonDisabled}>
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

