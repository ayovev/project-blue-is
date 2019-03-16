import React, { Component } from "react";
import { NavLink as RRNavLink, Link } from 'react-router-dom';
import { Collapse, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import axios from 'axios';
import { AuthenticationConsumer, AuthenticationContext } from "../../Contexts/AuthenticationContext/AuthenticationContext";
import styles from "./Header.css";

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      dropdownOpen: false,
      profilePicture: null
    };
  }

  async componentDidMount() {
    if (this.context.isAuthenticated) {
      await this.getUserLetter();
    }
  }

  getUserLetter = async () => {
    const options = {
      method: `GET`,
      url: `/api/user/profilePicture`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);
    const profilePicture = response.data;

    this.setState({
      profilePicture
    });
  }

  toggleDropdown = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  toggleNavbar = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  render() {
    return (
      <AuthenticationConsumer>
        {({ isAuthenticated, logout }) => (
          <Navbar sticky="top" className={styles.navbar} expand="lg">
            <NavbarBrand href="/" className={styles.navlink}><b>ieen</b></NavbarBrand>
            <NavbarToggler className="navbar-dark" onClick={this.toggleNavbar}/>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav navbar className="mx-auto nav">
                <NavItem className={styles.navitem}>
                  <NavLink to="/" activeClassName="selected" tag={RRNavLink} className={styles.navlink} exact>Home</NavLink>
                </NavItem>
                <NavItem className={styles.navitem}>
                  <a className={styles.navlink} href="https://www.cse.unr.edu/~nathanaelf/" target="_blank" rel="noopener noreferrer">Senior Project</a>
                </NavItem>
                <NavItem className={styles.navitem}>
                  <NavLink to="/methodology" activeClassName="selected" tag={RRNavLink} className={styles.navlink}>Methodology</NavLink>
                </NavItem>
                <NavItem className={styles.navitem}>
                  <NavLink to="/team" activeClassName="selected" tag={RRNavLink} className={styles.navlink}>Meet The Team</NavLink>
                </NavItem>
                {isAuthenticated &&
                  <React.Fragment>
                    <NavItem className={styles.navitem}>
                      <NavLink to="/search" activeClassName="selected" tag={RRNavLink} className={styles.navlink}>Securities</NavLink>
                    </NavItem>
                  </React.Fragment>
                }
                <NavItem className={styles.navitem}>
                  <NavLink to="/contactUs" activeClassName="selected" tag={RRNavLink} className={styles.navlink}>Contact Us</NavLink>
                </NavItem>
                {!isAuthenticated &&
                  <React.Fragment>
                    <NavItem className={styles.navitem}>
                      <NavLink to="/login" activeClassName="selected" tag={RRNavLink} className={styles.navlink}>Login</NavLink>
                    </NavItem>
                    <NavItem className={styles.navitem}>
                      <NavLink to="/signup" activeClassName="selected" tag={RRNavLink} className={styles.navlink}>Signup</NavLink>
                    </NavItem>
                  </React.Fragment>
                }
              </Nav>
            </Collapse>
            {isAuthenticated && this.state.profilePicture &&
              <NavbarBrand tag="span" className={styles.navlink}>
                <Dropdown className={styles.dropdown} isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                  <DropdownToggle color="link" className={styles.dropdownToggle}>
                    <img src={this.state.profilePicture} alt="profile initials"></img>
                  </DropdownToggle>
                  <DropdownMenu right>
                    <DropdownItem tag={Link} to="/userSettings">My Account</DropdownItem>
                    <DropdownItem onClick={logout}>Logout</DropdownItem>
                  </DropdownMenu>
                </Dropdown>
              </NavbarBrand>
            }
          </Navbar>
        )}
      </AuthenticationConsumer>
    );
  }
}

Header.contextType = AuthenticationContext;
