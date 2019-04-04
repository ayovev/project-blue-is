import React, { Component } from "react";
import { NavLink as RRNavLink } from 'react-router-dom';
import { Button, Col, Container, NavLink, Row } from 'reactstrap';
import styles from "./Team.css";
import Alex from './assets/alex.png';
import James from './assets/james.png';
import Nate from './assets/nate.png';

export default class Team extends Component {
  render() {
    return (
      <React.Fragment>
        <Container className={styles.containerFrame2}>
          <Row className={`FrameTitleText`}>
            <Col>
              <h2>MEET THE TEAM</h2>
              <hr className="dark"/>
            </Col>
          </Row>
          <Row >
            <Col xs="10" className={`FrameSupportText`}>
              <p>
                Our team is comprised of dedicated engineers and entrepreneurs that all have unique backgrounds in finance, computer science, business, and financial technology.
              </p>
              <p>Get to know us below!</p>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col xs="2">
              <img src={Nate} className={styles.rightTeamImage} alt="Team member Nate"/>
            </Col>
            <Col>
              <p className={styles.teamParagraph}>
                ras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
              </p>
              <h2>Nathanael Fuller</h2>
            </Col>
          </Row>
          <hr className="dark"/>
          <Row className={styles.row}>
            <Col xs ="10">
              <p className={styles.teamParagraph}>
                ras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
              </p>
              <h2 style={{ 'textAlign': `right` }}>James Schnebly</h2>
            </Col>
            <Col xs="2">
              <img src={James} className={styles.rightTeamImage} alt="Team member James"></img>
            </Col>
          </Row>
          <hr className="dark"/>
          <Row className={styles.row}>
            <Col xs="2">
              <img src={Alex} className={styles.rightTeamImage} alt="Team member Alex"></img>
            </Col>
            <Col>
              <p className={styles.teamParagraph}>
                ras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio, vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla. Donec lacinia congue felis in faucibus.
              </p>
              <h2>Alex Yovev</h2>
            </Col>
          </Row>
          <Row>
            <Col className={styles.buttonAlignment}>
              <Button color="primary"><NavLink to="/contactUs" tag={RRNavLink} style={{color: 'white'}}>Contact Us</NavLink></Button>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
