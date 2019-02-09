import React from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import Home from "./Home/Home";
import Signup from "./Signup/Signup";
import Status from "./Status/Status";
import Team from "./Team/Team";
import Methodology from "./Methodology/Methodology";
import Login from "./Login/Login";
import NotFoundPage from "./NotFoundPage/NotFound"
import PrivateRoute from "./PrivateRoute/PrivateRoute"

const fakeAuth = {
  isAuthenticated: true,
  authenticate(cb) {
    this.isAuthenticated = true
    setTimeout(cb, 100) // fake async
  },
  signout(cb) {
    this.isAuthenticated = false
    setTimeout(cb, 100) // fake async
  }
}

const ProtectedRoute =({component: Component, ...rest}) => (
  <Route {...rest} render={(props) =>(
    //insert auth context. use fake one for now.
    fakeAuth.isAuthenticated === true
    //use the component that was passed
    ?<Component {...rest}/>
    //Otherwise redirect to login or use a error component.. but how do I render the component and just not a redirect?
    :<Redirect to='/login' />
  )}/>
)

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" exact component={Login} />
    <Route path="/methodology" exact component={Methodology} />
    <Route path="/signup" exact component={Signup} />
    <Route path="/status" exact component={Status} />
    <Route path="/team" exact component={Team} />
    <ProtectedRoute path="/protectedTest" exact component={PrivateRoute} />
    <Route path="" component={NotFoundPage} />
    
  </Switch>;
