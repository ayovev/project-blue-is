import React, { Component } from "react";
import styles from "./Home.css";

//Need to remove the border off that typewriter
if(window.location.pathname === '/')
{
  //If this invokes on any other page, we get errors because the typewriter class doesn't exist.
  //For later: -- small shift once typewriter is removed due to border (blink-caret) .. maybe we can modify the border directly instead to transparent?
  //That way no shift...
  window.addEventListener('load', () => {

    window.setTimeout(() => {
      //document.querySelector('.typewriter').classList.remove('typewriter')
      document.querySelector('.typewriter').classList.remove('typewriter')
    }, 4500)
  })
}



export default class Home extends Component {
  render() {
    return (
      <div className={styles.container}>
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
            <button className={styles.learnMoreButton}>Learn More <span className={styles.arrow}><i className={"w3-jumbo fa fa-angle-down"}></i></span></button>
          </div>

        </div>
      </div>
    );
  }
}
