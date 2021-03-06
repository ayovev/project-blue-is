import React, { Component } from "react";
import { Col, Container, Row } from 'reactstrap';
import styles from "./NotFound.css";

export default class NotFound extends Component {
  render() {
    return (
      <React.Fragment>
        <Container className={styles.Frame1}>
          <Row className={styles.headerText}>
            <Col>
              <h1 className={styles.notFoundText}>404</h1>
            </Col>
          </Row>
          <Row>
            <Col>
              <p>We're sorry, the page you requested could not be found.</p>
              <p>Try refining your search, or use the navigation above to locate your page.</p>
            </Col>
          </Row>
        </Container>
      </React.Fragment>
    );
  }
}
