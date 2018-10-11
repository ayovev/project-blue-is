import React, { Component } from "react";
import "./Header.css";
import { App as GApp, Header as GHeader, Title, Box, Search, Menu, Anchor } from "grommet";
import MenuIcon from "grommet/components/icons/base/Menu";

export default class Header extends Component {
  render() {
    return (
      <div className="App-header">
        <GApp className="Grommet-header">
          <GHeader size="medium">
            <Title>
              <Anchor className="title" href="/">
                <code className="i">i</code>
                <code className="ee">==</code>
                <code className="n">n</code>
              </Anchor>
            </Title>
            <Box flex={true}
              justify="center"
              direction="row"
              responsive={false}
              align="start">
              <Search className="Grommet-header-search"
                inline={true}
                fill={true}
                size="medium"
                placeHolder="Search"
                dropAlign={{ "right": `right` }} />

            </Box>
            <Menu responsive={true} icon={<MenuIcon />}>
              <Anchor href="#"
                className="active">
                  Profile
              </Anchor>
              <Anchor href="#">
                  Log In
              </Anchor>
              <Anchor href="#">
                  Sign Up
              </Anchor>
            </Menu>
          </GHeader>
        </GApp>
      </div>
    );
  }
}
