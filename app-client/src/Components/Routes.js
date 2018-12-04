import React from "react";
import { Route, Switch } from "react-router-dom";
import Home from "./Home/Home";
import Signup from "./Signup/Signup";
import Status from "./Status/Status";
import Team from "./Team/Team"

export default () =>
  <Switch>
    <Route path="/" exact component={Home} />
    <Route path="/signup" exact component={Signup} />
    <Route path="/status" exact component={Status} />
    <Route path="/team" exact component={Team} />
  </Switch>;
