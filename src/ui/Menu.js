import React from 'react';
import {Link} from "react-router-dom";
import './Menu.css';

export default ({handleLogout}) => (
  <div className="App-menu">
    <Link className="menu--item" to="/">Assets</Link>
    <Link className="menu--item" to="/wikilinks">Wiki Links</Link>
    <div className="right-side-menu">
      <Link to="/login" onClick={handleLogout}>Logout</Link>
    </div>
  </div>
);
