import React, { Component } from "react";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { Dropdown, DropdownMenu, DropdownItem, DropdownToggle } from 'reactstrap';
import { NavLink as RRNavLink } from 'react-router-dom';
import { AuthenticationConsumer } from "../../Contexts/AuthenticationContext/AuthenticationContext";
import styles from "./Header.css";

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false,
      dropdownOpen: false
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  toggleDropdown = () => {
    this.setState({
      dropdownOpen: !this.state.dropdownOpen
    });
  }

  getUserLetter = () => {
    // https://ui-avatars.com/api/?name=John+Doe
    // console.log(`Letter`);
  }

  render() {
    return (
      <AuthenticationConsumer>
        {({ isAuthenticated, logout }) => (
          <Navbar sticky="top" className={styles.navbar} expand="lg">
            <NavbarBrand href="/" className={styles.navlink}><b>ieen</b></NavbarBrand>
            <NavbarToggler className="navbar-dark" onClick={this.toggle}/>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav navbar className="mx-auto nav">
                <NavItem className={styles.navitem}>
                  <NavLink to="/" activeClassName="selected" tag={RRNavLink} className={styles.navlink} exact>Home</NavLink>
                </NavItem>
                <NavItem className={styles.navitem}>
                  <NavLink to="/methodology" activeClassName="selected" tag={RRNavLink} className={styles.navlink}>Methodology</NavLink>
                </NavItem>
                <NavItem className={styles.navitem}>
                  <NavLink to="/team" activeClassName="selected" tag={RRNavLink} className={styles.navlink}>Meet The Team</NavLink>
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
                {isAuthenticated &&
                  <React.Fragment>
                    <NavItem className={styles.navitem}>
                      <NavLink to="/securities" activeClassName="selected" tag={RRNavLink} className={styles.navlink}>Securities</NavLink>
                    </NavItem>
                    <NavItem className={styles.navitem}>
                      <NavLink href="#" className={styles.navlink} onClick={logout}>Logout</NavLink>
                    </NavItem>
                  </React.Fragment>
                }
              </Nav>
            </Collapse>
            {!this.state.isOpen &&
              <NavbarBrand className={styles.navlink}>
                <Dropdown className={styles.dropdown} isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                  <DropdownToggle color="link" className={styles.dropdownToggle}>
                    <img src={`https://ui-avatars.com/api/?rounded=true&size=32`}></img>
                  </DropdownToggle>
                  <DropdownMenu /* className={styles.dropdownMenu}*/ right>
                    <DropdownItem /* className={styles.dropdownItem}*/>Profile</DropdownItem>
                    <DropdownItem /* className={styles.dropdownItem}*/>Settings</DropdownItem>
                    <DropdownItem /* className={styles.dropdownItem}*/>Logout</DropdownItem>
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
