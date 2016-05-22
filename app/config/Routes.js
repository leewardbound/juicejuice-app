import React from 'react';
import { Router, Route, RouteHandler, DefaultRoute, NotFoundRoute, State,
  Redirect } from 'react-router';
import ApplicationComponent from '../components/ApplicationComponent';
import NotFoundComponent from '../components/NotFoundComponent';
import HomeComponent from '../components/HomeComponent';
import ListDevicesComponent from '../components/ListDevicesComponent';

const components = [ListDevicesComponent];

const routes = (
  <Route name="ApplicationComponent" path="/" handler={ApplicationComponent}>
    {components.map(function (component) {
      return <Route name={component.config.name}
        path={component.config.path}
        handler={component} key={component.config.name} />;
    })}
    <DefaultRoute handler={HomeComponent} name='home' key='home' />
    <NotFoundRoute name="404" handler={NotFoundComponent} />
  </Route>
);

module.exports = routes;
