import React, { Component } from "react";
import { NavLink as RRNavLink, Link } from "react-router-dom";
import { Collapse, Dropdown, DropdownItem, DropdownMenu, DropdownToggle, Media, Nav, Navbar, NavbarBrand, NavbarToggler, NavItem, NavLink } from 'reactstrap';
import axios from "axios";
import { AuthenticationConsumer, AuthenticationContext } from "../../Contexts/AuthenticationContext/AuthenticationContext";
import styles from "./Header.css";

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      dropdownOpen: false,
      isOpen: false,
      profilePicture: undefined
    };
  }

  async componentDidMount() {
    if (this.context.isAuthenticated) {
      const profilePicture = await this.getUserLetter();
      this.setState({ profilePicture });
    }
    else {
      this.setState({ profilePicture: null });
    }
  }

  getUserLetter = async () => {
    const options = {
      method: `GET`,
      url: `/api/users/profilePicture`,
      resolveWithFullResponse: true
    };

    const response = await axios(options);
    return response.data;
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
    if (this.state.profilePicture === undefined) {
      return null;
    }

    return (
      <AuthenticationConsumer>
        {({ isAuthenticated, logout }) => (
          <Navbar sticky="top" className={styles.navbar} expand="xl">
            <NavbarBrand tag={RRNavLink} to="/" className={styles.navlink}><b>IEEN</b></NavbarBrand>
            <NavbarToggler className="navbar-dark" onClick={this.toggleNavbar}/>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav navbar className="mx-auto nav">
                <NavItem className={styles.navitem}>
                  <NavLink to="/" activeClassName="selected" tag={RRNavLink} className={styles.navlink} exact>Home</NavLink>
                </NavItem>
                <NavItem className={styles.navitem}>
                  <a className={[styles.navlink, `nav-link`].join(` `)} href="https://www.cse.unr.edu/~nathanaelf/" target="_blank" rel="noopener noreferrer">Senior Project</a>
                </NavItem>
                <NavItem className={styles.navitem}>
                  <NavLink to="/methodology" activeClassName="selected" tag={RRNavLink} className={styles.navlink}>Methodology</NavLink>
                </NavItem>
                <NavItem className={styles.navitem}>
                  <NavLink to="/team" activeClassName="selected" tag={RRNavLink} className={styles.navlink}>Meet the Team</NavLink>
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
            <Media>
              <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggleDropdown}>
                <DropdownToggle color="link">
                  <img src={this.state.profilePicture} alt="profile initials"/>
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem tag={Link} to="/settings">My Account</DropdownItem>
                  <DropdownItem tag={Link} to="/favorites">My Favorites</DropdownItem>
                  <DropdownItem tag={Link} to="#" onClick={logout}>Logout</DropdownItem>
                </DropdownMenu>
              </Dropdown>
            </Media>
            }
          </Navbar>
        )}
      </AuthenticationConsumer>
    );
  }
}

Header.contextType = AuthenticationContext;
