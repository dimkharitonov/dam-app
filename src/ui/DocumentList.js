import React from 'react';
import Document from './Document';

export default ({assets}) =>
  <div className="assets-list">
    <div className="page-nav">
      Total { assets.length } assets.
    </div>
    <div className="assets-list--asset" key="headerrow">
      <ul className="asset--meta meta--header">
        <li className="meta--title">title</li>
        <li className="meta--type">locale</li>
        <li className="meta--file">file</li>
        <li className="meta--coordinates">coordinates</li>
        <li className="meta--type">Images</li>
        <li className="meta--type">Created</li>
      </ul>
    </div>
    {assets.map((asset, idx) => <Document {...asset} key={idx} />)}
  </div>