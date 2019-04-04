import React, { Component } from "react";
import { Navbar } from "reactstrap";
import styles from "./Footer.css";

export default class Footer extends Component {
  render() {
    return (
      <Navbar className={styles.navbar} expand="lg">
        <div className={styles.navitem}>
          <p className={styles.copyright}>Copyright &copy; 2019 IEEN. All Rights Reserved.</p>
        </div>
      </Navbar>
    );
  }
}

