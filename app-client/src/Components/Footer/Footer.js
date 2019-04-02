import React, { Component } from "react";
import { NavLink as RRNavLink} from 'react-router-dom';
import { Collapse,  Nav, Navbar, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import styles from "./Footer.css";

export default class Footer extends Component {
  render() {
    return (
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
                <NavItem className={styles.navitem}>
                  <NavLink to="/contactUs" tag={RRNavLink} className={styles.navlink}>Contact Us</NavLink>
                </NavItem>
                <React.Fragment>
                  <div className={styles.navitem}>
                    <p className={styles.testText}>Copyright <span style={{fontSize: '.7rem'}}>&copy; 2019</span> IEEN. All rights reserved.</p>
                  </div>
                </React.Fragment>
              </Nav>
            </Collapse>
          </Navbar>
    );
  }
}

