import React, { Component } from "react";
import { NavLink as RRNavLink, Link } from 'react-router-dom';
import { Collapse,  Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import axios from 'axios';
import { AuthenticationConsumer, AuthenticationContext } from "../../Contexts/AuthenticationContext/AuthenticationContext";
import styles from "./Footer.css";

export default class Footer extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <AuthenticationConsumer>
        {({ isAuthenticated}) => (
          <Navbar className={styles.navbar} expand="lg">
            <NavbarToggler className="navbar-dark" onClick={this.toggleNavbar}/>
            <Collapse navbar>
              <Nav navbar className="mx-auto nav">
                <NavItem className={styles.navitem}>
                  <NavLink to="/" tag={RRNavLink} className={styles.navlink} exact>Home</NavLink>
                </NavItem>
                <NavItem className={styles.navitem}>
                  <a className={styles.navlink} href="https://www.cse.unr.edu/~nathanaelf/" target="_blank" rel="noopener noreferrer">Senior Project</a>
                </NavItem>
                <NavItem className={styles.navitem}>
                  <NavLink to="/methodology" tag={RRNavLink} className={styles.navlink}>Methodology</NavLink>
                </NavItem>
                <NavItem className={styles.navitem}>
                  <NavLink to="/team" tag={RRNavLink} className={styles.navlink}>Meet The Team</NavLink>
                </NavItem>
                {isAuthenticated &&
                  <React.Fragment>
                    <NavItem className={styles.navitem}>
                      <NavLink to="/search" tag={RRNavLink} className={styles.navlink}>Securities</NavLink>
                    </NavItem>
                  </React.Fragment>
                }
                <NavItem className={styles.navitem}>
                  <NavLink to="/contactUs" tag={RRNavLink} className={styles.navlink}>Contact Us</NavLink>
                </NavItem>
                <React.Fragment>
                  <div className={styles.navitem}>
                    <p className={styles.testText}>Copyright <span style={{'font-size':'.7rem'}}>&copy; 2019</span> IEEN. All rights reserved.</p>
                  </div>
                </React.Fragment>
              </Nav>
            </Collapse>
          </Navbar>
        )}
      </AuthenticationConsumer>
    );
  }
}

Footer.contextType = AuthenticationContext;
