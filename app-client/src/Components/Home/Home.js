import React, { Component } from "react";
import styles from "./Home.css";


export default class Home extends Component {
  render() {
    return (
      <div className={styles.container}>
        <div className={styles.contentArea}>
          <h1 className={styles.projectName}>intelligence == null</h1>

          <h3 className={styles.projectTagline}>Institutional Analysis for<br></br>the Retail Investor</h3>
          <hr></hr>
          {/*
            inline Style reference: (for anything above 2 attributes, make a class object in css.)
            remove className and replace with style.
            style={{margin:'auto'}}
          */}

          <div className={styles.centerButtonDiv}>
            <button className={styles.learnMoreButton}>Learn More</button>
          </div>

        </div>
      </div>
    );
  }
}
