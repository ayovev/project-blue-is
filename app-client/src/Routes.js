import React from 'react';
import { Route, Switch } from 'react-router-dom';
import { App } from './App';
import { Status } from './Status';

export default () =>
  <Switch>
    <Route path="/" exact component={App} />
    <Route path="/status" exact component={Status} />
  </Switch>;
