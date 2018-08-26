import React from 'react';
import { Switch } from 'react-router-dom';
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from './containers/Home';
import Login from './containers/Login';
import AddText from './containers/AddText';
import ImportWikiArticles from './containers/ImportWikiArticles';

export default ({ childProps }) =>
  <Switch>
    <AuthenticatedRoute path="/" exact component={Home} props={childProps}/>
    <AuthenticatedRoute path="/add-text" exact component={AddText} props={childProps}/>
    <AuthenticatedRoute path="/import-wiki-articles" exact component={ImportWikiArticles} props={childProps}/>
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps}/>
  </Switch>;