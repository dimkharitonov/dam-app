import React from 'react';
import { Link } from 'react-router-dom';
import WikiLinksListItems from './WikiLinksListItems';

const styles = {
  navbar: {
    margin: '3.5rem 1rem 1rem'
  },
  noitems: {
    margin: '5rem',
    width: '100%',
    textAlign: 'center'
  },
  linksStat: {
    width: '100%',
    textAlign: 'center',
    fontSize: '0.75rem',
    lineHeight: '2rem',
    fontWeight: 'bold',
    marginBottom: '-2.5rem'
  }
};

export default ({isLoaded, items}) => (
  <div>
    <div style={styles.navbar}>
      <Link className="navbutton" to="/wiki-csv">Add from CSV</Link>
    </div>
    {
      isLoaded
      ?(<div>
          <div style={styles.linksStat}>{items.length} links</div>
          <WikiLinksListItems items={items}/>
        </div>)
      : <div style={styles.noitems}>No items yet</div>
    }
  </div>
)