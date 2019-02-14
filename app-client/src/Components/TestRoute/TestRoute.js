import React, { Component } from "react";
import { Container, Row, Col } from 'reactstrap';


export default class Home extends Component {
  constructor(props) {
    super(props);

  }
  render() {
    return (
      <React.Fragment>
        <Container >
          <Row>
            <Col>
              <h1>Protected Route Test</h1>
            </Col>
          </Row>
          <Row className={``}>
            <Col>
              <p>You should be authenticated.</p>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
