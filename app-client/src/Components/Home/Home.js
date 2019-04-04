import React, { Component } from "react";
import { Card, CardBody, CardImg, CardSubtitle, CardText, CardTitle, Container, Row, Col, Button } from "reactstrap";
import styles from "./Home.css";

import Search from "./assets/securitySearch.png";
import Security from "./assets/securityResults.png";
import What from "./assets/what.jpg";
import How from "./assets/how.png";
import Who from "./assets/who.png";

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
            <div className="typewriter">
              <h1 className={styles.projectName}>intelligence == null</h1>
            </div>
            <h3 className={styles.projectTagline}>Institutional Analysis for<br></br>the Retail Investor</h3>

            <hr className="light"></hr>
            {/*
              inline Style reference: (for anything above 2 attributes, make a class object in css.)
              remove className and replace with style.
              style={{margin:'auto'}}
            */}

            <div className={styles.centerButtonDiv}>
              <button onClick={() => this.scroll(this.myRef)} className={styles.learnMoreButton}>Learn More <i className={`w3-jumbo fa fa-angle-down`}></i></button>
            </div>
          </div>
          <div style={{ marginTop: `250px` }} ref={this.myRef}/>
        </div>
        
        <Container className={styles.containerFrame2}>
          {/* What Section */}
          <Row className={styles.homePageRow}>
            <Col md={12} className={styles.informationHeader}>
              <h1 >What We Do</h1>
            </Col>
            <Col md={3} className={styles.contentSeperatorRight}>
              {/* Image insert */}
              <Card className={styles.mediaCard} onClick={() => this.props.history.push(`#`)}>
                <CardImg top width="100%" src={What} alt="What we do" />
              </Card>
            </Col>
            <Col md={7}>
              <p>IEEN is a FinTech-based project that combines computer science and finance to provide its users with wealth-building insights that aim to strengthen an 
                investor's portfolio. The primary goal of this service is to provide a one stop shop that individuals can utilize in order to learn more about finance and make 
                more informed investment decisions. The broader importance of this project is its combination of advanced yet easily digestible analysis that appeals to investors of 
                all backgrounds and levels of experience.</p>
              <div className={styles.buttonDiv}>
                <Button color="primary" href="#">Check out something</Button>
              </div>
            </Col>
          </Row>
        </Container>
        <Row className={styles.darkContentSeperator}>
          <Col><h2>High quality analysis shouldn&apos;t be exlusive to firms.</h2></Col>
        </Row>
        <Container className={styles.containerFrame2}>
        {/* How Section */}
          <Row className={styles.homePageRow}>
            <Col md={12} className={styles.informationHeader}>
              <h1 style={{ textAlign: `right`, marginRight: `80px` }}>How We Do It</h1>
            </Col>
            <Col md={7}>
              <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris sollicitudin hendrerit rhoncus. Aenean ut volutpat magna. Mauris semper blandit pellentesque. 
                Etiam in orci eget ante vulputate lobortis non a sapien. Proin eu posuere sem. Curabitur eget dui at ligula suscipit porttitor. Morbi ac maximus libero, quis 
                malesuada tortor. Integer lacinia condimentum velit sed lobortis. Quisque vitae rutrum nibh. Mauris imperdiet tellus ac blandit facilisis. Nam vel enim elit.</p>
              <div className={styles.buttonDiv}>
                <Button color="primary" href="#">Learn More!</Button>
              </div>
            </Col>
            <Col md={3} className={styles.contentSeperatorLeft}>
              <Card className={styles.mediaCard} onClick={() => this.props.history.push(`#`)}>
                <CardImg top width="100%" src={How} alt="How we do it" />
              </Card>
            </Col>
          </Row>
        </Container>
        <Row className={styles.darkContentSeperator}>
          <Col><h2>IEEN allows for all to learn while strengthening their portfolio.</h2></Col>
        </Row>
        <Container>
          <Row className="FrameTitleText">
            <Col md={12}>
              <h1>Demo IEEN Today</h1>
              <hr className="dark"></hr>
            </Col>
            <Col md={12}>
              <p>Why wait? Check out our demo page below and see for yourself!</p>
              <p>Find out why people <b>just like you</b> are using IEEN for their investment analysis. </p>
            </Col>
          </Row>
          <Row className={styles.mediaCardContainer}>
            <Col xs="3" >
              <Card className={styles.mediaCard} onClick={() => this.props.history.push(`#`)}>
                <CardImg top width="100%" src={Security} alt="What we do" />
                <CardBody>
                  <CardTitle>Investability Index</CardTitle>
                  <CardSubtitle>check out our super cool thing</CardSubtitle>
                  <CardText></CardText>
                </CardBody>
              </Card>
            </Col>

            <Col xs="3" >
              <Card className={styles.mediaCard} onClick={() => this.props.history.push(`#`)}>
                <CardImg top width="100%" src={Security} alt="How we do it" />
                <CardBody>
                  <CardTitle>Historical Performance Chart</CardTitle>
                  <CardSubtitle>Check out how this cool thing does stuff.</CardSubtitle>
                  <CardText></CardText>
                </CardBody>
              </Card>
            </Col>

            <Col xs="3" >
              <Card className={styles.mediaCard} onClick={() => this.props.history.push(`#`)}>
                <CardImg top width="100%" src={Search} alt="Who are we" />
                <CardBody>
                  <CardTitle>Something Else?</CardTitle>
                  <CardSubtitle>Some cool text to follow</CardSubtitle>
                  <CardText></CardText>
                </CardBody>
              </Card>
            </Col>
          </Row>
          <Row className={styles.homePageRow}>
            {/* Add the styling for this */}
            <Col>
              <div className={styles.buttonDiv}>
                <Button color="primary" href="#">Check it out!</Button>
              </div>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
