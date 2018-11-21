import React, { Component } from "react";
import styles from "./Home.css";

export default class Home extends Component {
  render() {
    return (
      <div className={styles.container}>
        <h1 className={styles.projectName}>intelligence == null</h1>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <h3 className={styles.projectTagline}>Institutional Analysis for<br></br>the Retail Investor</h3>
      </div>
    );
  }
}
