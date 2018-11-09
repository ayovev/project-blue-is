import React, { Component } from "react";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
// import { LineChart, Line } from "recharts";
import { AuthenticationConsumer } from "../../Contexts/AuthenticationContext";
import styles from "./Header.css";

const DATA_LENGTH = 8;

export default class Header extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isOpen: false
    };
  }

  toggle = () => {
    this.setState({
      isOpen: !this.state.isOpen
    });
  }

  generateData = () => {
    let data = [];
    let value;

    for (let index = 0; index < DATA_LENGTH; index++) {
      value = Math.floor(Math.random() * Math.floor(50));
      data.push({value: value});
    }

    return data;
  }

  render() {
    return (
      <AuthenticationConsumer>
        {({isAuthenticated, login, logout}) => (
          <Navbar sticky="top" className={styles.navbar} expand="lg">
            <NavbarBrand style={{color: "white"}}>

              {/* <AreaChart width={100} height={50} data={this.generateData()} >
                <Area type="natural" dataKey="value" fill="#4286f4" stroke="dark" animationDuration={1200}/>
              </AreaChart> */}

              {/* <LineChart width={100} height={50} data={this.generateData()}>
                <Line type="natural" dataKey="value" stroke="#4286f4" strokeWidth={2} dot={null} animationDuration={1200}/>
              </LineChart> */}

              <NavLink href="/" className={styles.navlink}><b>ieen</b></NavLink>
            </NavbarBrand>
            <NavbarToggler className="navbar-dark" onClick={this.toggle}/>
            <Collapse isOpen={this.state.isOpen} navbar>
              <Nav navbar className="mx-auto nav">
                <NavItem className={styles.navitem}>
                  <NavLink href="/" className={styles.navlink}>Home</NavLink>
                </NavItem>
                <NavItem className={styles.navitem}>
                  {/* Maybe rephrase / reword this link? */}
                  <NavLink href="/" className={styles.navlink}>Our Algorithm</NavLink>
                </NavItem>
                <NavItem className={styles.navitem}>
                  <NavLink href="/" className={styles.navlink}>Meet The Team</NavLink>
                </NavItem>
                {!isAuthenticated &&
                  <React.Fragment>
                    <NavItem className={styles.navitem}>
                      <NavLink href="/" className={styles.navlink} onClick={login}>Login</NavLink>
                    </NavItem>
                    <NavItem className={styles.navitem}>
                      <NavLink href="/signup" className={styles.navlink}>Signup</NavLink>
                    </NavItem>
                  </React.Fragment>
                }
                {isAuthenticated &&
                  <React.Fragment>
                    <NavItem className={styles.navitem}>
                      <NavLink href="/" className={styles.navlink}>Securities</NavLink>
                    </NavItem>
                    <NavItem className={styles.navitem}>
                      <NavLink href="/" className={styles.navlink} onClick={logout}>Logout</NavLink>
                    </NavItem>
                  </React.Fragment>
                }
              </Nav>
            </Collapse>
            {!this.state.isOpen &&
              <NavbarBrand style={{color: "white"}}>
                <b>user stuff</b>
              </NavbarBrand>
            }
          </Navbar>
        )}
      </AuthenticationConsumer>
    );
  }
}
