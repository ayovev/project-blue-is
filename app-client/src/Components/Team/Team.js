import React, { Component } from "react";
import styles from "./Team.css";
import { Container, Row, Col} from 'reactstrap';

import Alex from './assets/AlexImg.png';
import James from './assets/jamesPic.png';
import Nate from './assets/linkedInNate1.png';


export default class Team extends Component {



  render() {
    return (
      <React.Fragment>
<Container className={styles.containerFrame2}>
          <Row className={"FrameTitleText"}>
            <Col>
              <h2>MEET THE TEAM</h2>
              <hr className={"dark"}></hr>
            </Col>
          </Row>
          <Row >
            <Col xs='10' className={"FrameSupportText"}>
              <p>Our team is comprised of dedicated engineers and entrepreneurs that all have unique backgrounds in finance, computer science, business, and financial technology.  </p>
              <p>Get to know us below!</p>
            </Col>
          </Row>
          <Row className={styles.row}>
            <Col xs='2'>
            <img src={Nate} className={styles.rightTeamImage} alt="Team member Nate"></img>
            </Col>
            <Col>
              <p className={styles.teamParagraph}>ras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio,
                vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.
                Donec lacinia congue felis in faucibus.</p>
              <h2>Nathanael Fuller</h2>
            </Col>
          </Row>
          <hr className={"dark"}></hr>
          <Row className={styles.row}>
            <Col xs ='10'>
              <p className={styles.teamParagraph}>ras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio,
                vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.
                Donec lacinia congue felis in faucibus.</p>
              <h2 style={{'textAlign':'right'}}>James Schenbly</h2>
            </Col>
            <Col xs='2'>
            <img src={James} className={styles.rightTeamImage} alt="Team member James"></img>
            </Col>
          </Row>
          <hr className={"dark"}></hr>
          <Row className={styles.row}>
            <Col xs='2'>
            <img src={Alex} className={styles.rightTeamImage} alt="Team member Alex"></img>
            </Col>
            <Col>
              <p className={styles.teamParagraph}>ras sit amet nibh libero, in gravida nulla. Nulla vel metus scelerisque ante sollicitudin commodo. Cras purus odio,
                vestibulum in vulputate at, tempus viverra turpis. Fusce condimentum nunc ac nisi vulputate fringilla.
                Donec lacinia congue felis in faucibus.</p>
              <h2>Alex Yovev</h2>
            </Col>
          </Row>
          <Row>
              <Col className={styles.buttonAlignment}>
                <button href="#" className={styles.ButtonStyle}>Contact Us</button>
              </Col>
          </Row>
        </Container>


      </React.Fragment>
    );
  }
}
