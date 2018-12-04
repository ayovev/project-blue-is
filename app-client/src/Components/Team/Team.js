import React, { Component } from "react";
import styles from "./Team.css";
import { Container, Row, Col } from 'reactstrap';
import { Card, CardImg, CardText, CardBody,
  CardTitle, CardSubtitle, Button } from 'reactstrap';


export default class Team extends Component {



  render() {
    return (
      <React.Fragment>
      <h1>Team!</h1>
      <button className={styles.ButtonStyle}>I am a button!</button>
      </React.Fragment>
    );
  }
}
