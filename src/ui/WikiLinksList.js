import React from 'react';
import { Link } from 'react-router-dom';
import WikiLinksListItems from './WikiLinksListItems';

import './WikiLinksList.css';

export default ({isLoaded, items}) => (
  <div className="links-list">
    <Link className="navbutton" to="/wiki-csv">Add from CSV</Link>
    {
      isLoaded
      ? <WikiLinksListItems items={items}/>
      : <div>No items yet</div>
    }
  </div>
)