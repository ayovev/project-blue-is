import React, { Component } from "react";
import Header from "../Header/Header";
import { Container} from 'reactstrap';
import Footer from "../Footer/Footer";
import Routes from "../Routes";
import styles from "./App.css";

export default class App extends Component {
  render() {
    return (
      <React.Fragment>
        <div className={styles.appContainer}>
        <Header />
        <Routes />
        <Footer />
        </div>
      </React.Fragment>
    );
  }
}
