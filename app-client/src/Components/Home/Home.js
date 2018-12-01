import React, { Component } from "react";
import styles from "./Home.css";

export default class Home extends Component {
  render() {
    return (
      <React.Fragment>
        <div className={styles.containerFrame1}>
          <div className={styles.contentArea}>

            <div className={"typewriter"}>
              <h1 className={styles.projectName}>intelligence == null</h1>
            </div>
            <h3 className={styles.projectTagline}>Institutional Analysis for<br></br>the Retail Investor</h3>

            <hr></hr>

            {/*
              inline Style reference: (for anything above 2 attributes, make a class object in css.)
              remove className and replace with style.
              style={{margin:'auto'}}
            */}

            <div className={styles.centerButtonDiv}>
              <button className={styles.learnMoreButton}>Learn More <i className={"w3-jumbo fa fa-angle-down"}></i></button>
            </div>

          </div>
        </div>
        <div className={styles.containerFrame2}>
          <h1>test</h1>
        </div>
      </React.Fragment>
    );
  }
}
