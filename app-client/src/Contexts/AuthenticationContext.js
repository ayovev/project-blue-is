// should we use localStorage or sessionStorage for this...?

import React, { Component } from 'react';

const IS_AUTHENTICATED = `isAuthenticated`;

const AuthenticationContext = React.createContext();
const AuthenticationConsumer = AuthenticationContext.Consumer;

class AuthenticationProvider extends Component {
  constructor(props) {
    super(props);

    // TODO: this needs to be broken down into a sequence of more robust and thorough checks (possibly it's own function)
    const authentication = sessionStorage.getItem(IS_AUTHENTICATED) !== null ? sessionStorage.getItem(IS_AUTHENTICATED).toLowerCase() === `true` : false;

    this.state = {
      isAuthenticated: authentication
    };
  }

  login = () => {
    sessionStorage.setItem(IS_AUTHENTICATED, true);
  }

  logout = () => {
    sessionStorage.setItem(IS_AUTHENTICATED, false);
  }

  render() {
    return (
      <AuthenticationContext.Provider
        value={{
          isAuthenticated: this.state.isAuthenticated,
          login: this.login,
          logout: this.logout
        }}
      >
        {this.props.children}
      </AuthenticationContext.Provider>
    );
  }
}

export { AuthenticationConsumer, AuthenticationProvider };
