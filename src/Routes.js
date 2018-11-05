import React from 'react';
import { Switch } from 'react-router-dom';
import AuthenticatedRoute from "./components/AuthenticatedRoute";
import UnauthenticatedRoute from "./components/UnauthenticatedRoute";
import Home from './containers/Home';
import WikiLinks from './containers/wikiLinks';
import Login from './containers/Login';
import AddText from './containers/AddText';
import ImportWikiCsv from './containers/ImportWikiCsv';
import Assets from './containers/Assets';

export default ({ childProps }) =>
  <Switch>
    <AuthenticatedRoute path="/" exact component={Home} props={childProps}/>
    <AuthenticatedRoute path="/assets" exact component={Assets} props={childProps}/>
    <AuthenticatedRoute path="/assets/:index" component={Assets} props={childProps}/>
    <AuthenticatedRoute path="/wikilinks" component={WikiLinks} props={childProps}/>
    <AuthenticatedRoute path="/wiki-csv" component={ImportWikiCsv} props={childProps}/>
    <AuthenticatedRoute path="/add-text" exact component={AddText} props={childProps}/>
    <UnauthenticatedRoute path="/login" exact component={Login} props={childProps}/>
  </Switch>;