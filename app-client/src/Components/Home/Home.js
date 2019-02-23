import React, { Component } from "react";
import { Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Container, Row, Col } from 'reactstrap';
import styles from "./Home.css";

import What from './assets/what.jpg';
import How from './assets/how.png';
import Who from './assets/who.png';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.myRef = React.createRef();
  }

  scroll = (ref) => {
    ref.current.scrollIntoView({ behavior: `smooth` });
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.containerFrame1}>
          <div className={styles.contentArea}>

            <div className={`typewriter`}>
              <h1 className={styles.projectName}>intelligence == null</h1>
            </div>
            <h3 className={styles.projectTagline}>Institutional Analysis for<br></br>the Retail Investor</h3>

            <hr className={`light`}></hr>
            {/*
              inline Style reference: (for anything above 2 attributes, make a class object in css.)
              remove className and replace with style.
              style={{margin:'auto'}}
            */}

            <div className={styles.centerButtonDiv}>
              <button onClick={() => {
                this.scroll(this.myRef);
              }} className={styles.learnMoreButton}>Learn More <i className={`w3-jumbo fa fa-angle-down`}></i></button>
            </div>
          </div>
        </div>
        <Container className={styles.containerFrame2}>
          <Row className={`FrameTitleText`}>
            <Col>
              <h2>INNOVATIVE SOLUTIONS IN A VOLATILE WORLD</h2>
              <hr className={`dark`}></hr>
            </Col>
          </Row>
          <Row className={`FrameTitleText`}>
            <Col>
              <p>Why wait? Learn about what IEEN has to offer</p>
              <p>Click on the images below!</p>
            </Col>
          </Row>
          <Row className={styles.mediaCardContainer}>
            <Col xs="3" >
              <Card className={styles.mediaCard} onClick={() => this.props.history.push(`#`)}>
                <CardImg top width="100%" src={What} alt="What we do" />
                <CardBody>
                  <CardTitle>What We Do</CardTitle>
                  <CardSubtitle></CardSubtitle>
                  <CardText></CardText>
                </CardBody>
              </Card>
            </Col>

            <Col xs="3" >
              <Card className={styles.mediaCard} onClick={() => this.props.history.push(`/methodology`)}>
                <CardImg top width="100%" src={How} alt="How we do it" />
                <CardBody>
                  <CardTitle>How We Do It</CardTitle>
                  <CardSubtitle></CardSubtitle>
                  <CardText></CardText>
                </CardBody>
              </Card>
            </Col>

            <Col xs="3" >
              <Card className={styles.mediaCard} onClick={() => this.props.history.push(`/team`)}>
                <CardImg top width="100%" src={Who} alt="Who are we" />
                <CardBody>
                  <CardTitle>Who Are We</CardTitle>
                  <CardSubtitle></CardSubtitle>
                  <CardText></CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>

        </Container>
        <Row className={styles.darkContentSeperator}>
          <Col><h2 ref={this.myRef}>High quality analysis shouldn&apos;t be exlusive to firms.</h2></Col>
        </Row>
      </React.Fragment>
    );
  }
}
