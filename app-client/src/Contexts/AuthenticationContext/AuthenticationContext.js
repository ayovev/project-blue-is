// should we use localStorage or sessionStorage for this...?
//local right? Because a session could end but a user might want to continue. 

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
    window.location.assign(`/`);
  }

  logout = () => {
    sessionStorage.setItem(IS_AUTHENTICATED, false);
    window.location.assign(`/`);
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

export { AuthenticationContext, AuthenticationConsumer, AuthenticationProvider };
