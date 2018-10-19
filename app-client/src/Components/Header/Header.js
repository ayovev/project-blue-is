import React, { Component } from "react";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { LineChart, Line, XAxis, YAxis, ResponsiveContainer } from "recharts";
import "./Header.css";

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
      <Navbar className="navbar" expand="md">
        <NavbarBrand>

          {/* <AreaChart width={100} height={50} data={this.generateData()} >
            <Area type="natural" dataKey="value" fill="#4286f4" stroke="dark" animationDuration={1200}/>
          </AreaChart> */}

          <LineChart width={100} height={50} data={this.generateData()}>
            <Line type="natural" dataKey="value" stroke="#4286f4" strokeWidth={2} dot={null} animationDuration={1200}/>
            {/* <XAxis tick={false}/>
            <YAxis tick={false}/> */}
          </LineChart>

        </NavbarBrand>
        <NavbarToggler color={"#ffffff"} className="navbarToggler" onClick={this.toggle}/>
        <Collapse isOpen={this.state.isOpen} navbar>
          <Nav navbar className="ml-auto">
            <NavItem className="navitem">
              <NavLink href="/" className="navlink">Home</NavLink>
            </NavItem>
            <NavItem className="navitem">
              <NavLink href="/" className="navlink">Meet The Team</NavLink>
            </NavItem>
            <NavItem className="navitem">
              <NavLink href="/" className="navlink">About Us</NavLink>
            </NavItem>
            <NavItem className="navitem">
              <NavLink href="/signup" className="navlink">Signup</NavLink>
            </NavItem>
            <NavItem className="navitem">
              <NavLink href="/" className="navlink">Login</NavLink>
            </NavItem>
          </Nav>
        </Collapse>
      </Navbar>
    );
  }
}
