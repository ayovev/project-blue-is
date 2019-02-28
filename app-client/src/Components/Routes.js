import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home/Home";
import Signup from "./Signup/Signup";
import Status from "./Status/Status";
import Team from "./Team/Team";
import Methodology from "./Methodology/Methodology";
import Login from "./Login/Login";
import ContactUs from "./ContactUs/ContactUs";

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/login" exact component={Login} />
    <Route path="/methodology" exact component={Methodology} />
    <Route path="/signup" exact component={Signup} />
    <Route path="/status" exact component={Status} />
    <Route path="/team" exact component={Team} />
    <Route patch="/contactUs" exact component={ContactUs} />
  </Switch>;
