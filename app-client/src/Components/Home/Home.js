import React, { Component } from "react";
import styles from "./Home.css";
import { Container, Row, Col } from 'reactstrap';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';

import WhatWeDo from './assets/whatwedo.jpg';
import HowWeDo from './assets/HowWeDoIt.png';
import WhoWeAre from './assets/team.png';



export default class Home extends Component {

  constructor(props){
    super(props);
    this.myRef=React.createRef();
  }

  scroll(ref){
    ref.current.scrollIntoView({behavior:'smooth'});
  }

  render() {
    return (
      <React.Fragment>
        <div className={styles.containerFrame1}>
          <div className={styles.contentArea}>

            <div className={"typewriter"}>
              <h1 className={styles.projectName}>intelligence == null</h1>
            </div>
            <h3 className={styles.projectTagline}>Institutional Analysis for<br></br>the Retail Investor</h3>

            <hr className={"light"}></hr>

            {/*
              inline Style reference: (for anything above 2 attributes, make a class object in css.)
              remove className and replace with style.
              style={{margin:'auto'}}

              **IMPORT THE IMAGES>>>>>
            */}

            <div className={styles.centerButtonDiv}>
              <button onClick={() => {this.scroll(this.myRef)}} className={styles.learnMoreButton}>Learn More <i className={"w3-jumbo fa fa-angle-down"}></i></button>
            </div>

          </div>
        </div>
        <Container ref={this.myRef} className={styles.containerFrame2}>
          <Row className={"FrameTitleText"}>
            <Col >
              <h2>INNOVATIVE SOLUTIONS IN A VOLATILE WORLD</h2>
              <hr className={"dark"}></hr>
            </Col>
          </Row>
          <Row className={"FrameTitleText"}>
            <Col >
              <p>Why wait? Learn about what IEEN has to offer</p>
              <p>Click on the images below!</p>
            </Col>
          </Row>
          <Row className={styles.mediaCard}>
            <Col xs="3" >
              <Card>
                <CardImg top width="100%" src={WhatWeDo} alt="What we do" />
                <CardBody>
                  <CardTitle>What We Do</CardTitle>
                  <CardSubtitle></CardSubtitle>
                  <CardText></CardText>

                </CardBody>
              </Card>
            </Col>

            <Col xs="3" >
              <Card>
                <CardImg top width="100%" src={HowWeDo} alt="How we do it" />
                <CardBody>
                  <CardTitle>How We Do It</CardTitle>
                  <CardSubtitle></CardSubtitle>
                  <CardText></CardText>

                </CardBody>
              </Card>
            </Col>

            <Col xs="3" >
              <Card>
                <CardImg top width="100%" src={WhoWeAre} alt="Who are we" />
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
            <Col><h2>High quality analysis shouldn't be exlusive to firms.</h2></Col>
          </Row>
      </React.Fragment>
    );
  }
}
