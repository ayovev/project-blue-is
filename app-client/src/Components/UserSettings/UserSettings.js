import React, { Component } from "react";
import { Container, Media, Row, Col, Form, FormGroup, Input, Button, Label } from 'reactstrap';
import styles from "./UserSettings.css";

export default class UserSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: ``,
      lastName: ``,
      birthdate: ``,
      email: ``,
      newEmail: ``,
      newPassword: ``,
      confirmNewPassword: ``,
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
      email: this.state.newEmail
      // Look into handleChange in the login component and adapt for here.
    };

    const options = {
      method: `POST`,
      url: `/api/updatePreferences`,
      data
    };
  }

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
            <Media>
              <Media left href="#">
                <Media object data-src="holder.js/64x64" alt="Generic placeholder image" />
              </Media>
              <Media body>
                <Media heading>
                  Insert User Person
                </Media>
                  Member Since: Insert Date
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
          </Form>
        </Container>
      </React.Fragment>
    );
  }
}
