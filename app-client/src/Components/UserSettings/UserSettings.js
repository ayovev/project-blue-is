import React, { Component } from "react";
import {Container, Media, Row, Col,Form, FormGroup, Input, Button, Label } from 'reactstrap';
import styles from "./UserSettings.css";

export default class UserSettings extends Component {
  constructor(props) {
    super(props);

    this.state = {
      firstName: ``,
      lastName: ``,
      newEmail: ``,
      newPassword: ``,
      DOB: ``,
      investorStyle: ``
    };
  }

  testVar = true;
  handleSubmit = async (event) => {
    event.preventDefault();
  
    const data = {
      
      //Look into handleChange in the login component and adapt for here. 
      /*if(conditionTrue)
      {
        newEmail: this.state.newEmail
      },
      newPassword: md5(this.state.newPassword)*/
    };
  
    const options = {
      method: `POST`,
      url: `/api/updatePreferences`,
      data
    };
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
          <Row>
            <Col md={5}>
              <Form>
                <FormGroup>
                  <Label for="FNAME">First Name</Label>
                  <Input/>
                </FormGroup>
              </Form>
            </Col>
            <Col md={5}>
              <Form>
                <FormGroup>
                  <Label for="LNAME">Last Name</Label>
                  <Input/>
                </FormGroup>
              </Form>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
