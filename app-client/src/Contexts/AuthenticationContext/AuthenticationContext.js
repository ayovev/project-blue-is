import React, { Component } from 'react';
import axios from "axios";

const IS_AUTHENTICATED = `isAuthenticated`;

const AuthenticationContext = React.createContext();
const AuthenticationConsumer = AuthenticationContext.Consumer;

class AuthenticationProvider extends Component {
  constructor(props) {
    super(props);

    // TODO: this needs to be broken down into a sequence of more robust and thorough checks (possibly it's own function)
    const isAuthenticated = sessionStorage.getItem(IS_AUTHENTICATED) !== null ? sessionStorage.getItem(IS_AUTHENTICATED).toLowerCase() === `true` : false;

    if (isAuthenticated) {
      setInterval(() => {
        this.validateJWT();
      }, 60000);
    }

    this.state = {
      isAuthenticated
    };
  }

  validateJWT = async () => {
    const options = {
      method: `GET`,
      url: `/api/authentication/validate`
    };

    let response;

    try {
      response = await axios(options);
    }
    catch (error) {
      response = error.response;
    }
    finally {
      let isAuthenticated;

      if (response === 200) {
        isAuthenticated = true;
        sessionStorage.setItem(IS_AUTHENTICATED, `true`);
      }
      else {
        if (sessionStorage.getItem(IS_AUTHENTICATED) === `true`) {
          this.logout();
        }
        isAuthenticated = false;
        sessionStorage.setItem(IS_AUTHENTICATED, `false`);
      }

      this.setState({
        isAuthenticated
      });
    }
  }

  login = async (data) => {
    const options = {
      method: `POST`,
      url: `/api/authentication/login`,
      data
    };

    const response = await axios(options);

    if (response.status === 200) {
      sessionStorage.setItem(IS_AUTHENTICATED, true);
      window.location.assign(`/`);
    }

    return response;
  }

  logout = async () => {
    const options = {
      method: `GET`,
      url: `/api/authentication/logout`
    };

    try {
      await axios(options);
    }
    catch (error) {
    }
    finally {
      sessionStorage.removeItem(IS_AUTHENTICATED);
      window.location.assign(`/`);
    }
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
