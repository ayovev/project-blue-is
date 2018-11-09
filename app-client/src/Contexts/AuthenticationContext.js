import React, { Component } from 'react';

const AuthenticationContext = React.createContext();

class AuthenticationProvider extends Component {
  constructor(props) {
    super(props);

    this.state = {
      isAuthenticated: localStorage.getItem("isAuthenticated").toLowerCase() === "true"
    };
  }

  login = () => {
    localStorage.setItem("isAuthenticated", true);
  }

  logout = () => {
    localStorage.setItem("isAuthenticated", false);
  }

  render() {
    return(
      <AuthenticationContext.Provider
        value={{
          isAuthenticated: this.state.isAuthenticated,
          login: this.login,
          logout: this.logout
        }}
      >
        {this.props.children}
      </AuthenticationContext.Provider>
    )
  }
}

const AuthenticationConsumer = AuthenticationContext.Consumer;

export { AuthenticationProvider, AuthenticationConsumer };
