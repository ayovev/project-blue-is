import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home/Home";
import Signup from "./Signup/Signup";
import Status from "./Status/Status";
import Team from "./Team/Team";
import Methodology from "./Methodology/Methodology";
import CS426 from "./CS426/CS426";
import Login from "./Login/Login";
import NotFoundPage from "./NotFoundPage/NotFound";
import UserSettings from "./UserSettings/UserSettings";
import ProtectedRoute from "./ProtectedRoute/ProtectedRoute";
import ContactUs from "./ContactUs/ContactUs";
import Security from "./Security/Security";
import SecuritySearch from "./SecuritySearch/SecuritySearch";
import Demo from "./Demo/Demo";

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" exact component={Login} />
    <Route path="/methodology" exact component={Methodology} />
    <Route path="/cs426" exact component={CS426} />
    <Route path="/signup" exact component={Signup} />
    <Route path="/status" exact component={Status} />
    <Route path="/team" exact component={Team} />
    <Route path="/contactUs" exact component={ContactUs} />
    <Route path="/demo" exact component={Demo} />
    <ProtectedRoute path="/search" exact component={SecuritySearch} />
    <ProtectedRoute path="/userSettings" exact component={UserSettings} />
    <ProtectedRoute path="/security/:symbol" exact component={Security} />
    <Route component={NotFoundPage} />
  </Switch>;
