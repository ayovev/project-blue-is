import React, { Component } from "react";
import { Collapse, Navbar, NavbarToggler, NavbarBrand, Nav, NavItem, NavLink } from 'reactstrap';
import { AreaChart, Area } from "recharts";
import { LineChart, Line } from "recharts";
import "./Header.css";

// this will have to be moved somewhere else eventually
let data = [
  { name: `Page A`, uv: 4000, pv: 2400, amt: 2400 },
  { name: `Page B`, uv: 3000, pv: 1398, amt: 2210 },
  { name: `Page C`, uv: 2000, pv: 9800, amt: 2290 },
  { name: `Page D`, uv: 2780, pv: 3908, amt: 2000 },
  { name: `Page E`, uv: 1890, pv: 4800, amt: 2181 },
  { name: `Page F`, uv: 2390, pv: 3800, amt: 2500 },
  { name: `Page G`, uv: 3490, pv: 4300, amt: 2100 }
];

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

  render() {
    return (
      <Navbar className="navbar" expand="sm">
        <NavbarBrand>
          {/* still deciding on which chart to use on load */}

          <AreaChart width={100} height={50} data={data}>
            <Area type="monotone" dataKey="pv" fill="#4286f4" stroke="dark" animationDuration="1200"/>
          </AreaChart>

          <LineChart width={100} height={50} data={data}>
            <Line type="monotone" dataKey="pv" stroke="#4286f4" strokeWidth={2} dot={null} animationDuration="1200"/>
          </LineChart>

        </NavbarBrand>
        <NavbarToggler onClick={this.toggle}/>
          <Collapse isOpen={this.state.isOpen} navbar>
            <Nav className="ml-auto" navbar pills>
              <NavItem>
                <NavLink href="/" className="navlink">Home</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/" className="navlink">Meet The Team</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/" className="navlink">About Us</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/signup" className="navlink">Signup</NavLink>
              </NavItem>
              <NavItem>
                <NavLink href="/" className="navlink">Login</NavLink>
              </NavItem>
            </Nav>
          </Collapse>
      </Navbar>
    );
  }
}
