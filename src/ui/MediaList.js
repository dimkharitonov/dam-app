import React from 'react';
import Media from './Media';

export default ({assets}) =>
  <div className="media-cards">
    <div className="page-nav">
      Total { assets.length } assets. Show 1–100
    </div>
    {assets.splice(0,Math.min(100, assets.length))
      .map((asset, idx) => <Media {...asset } key={idx} />)}
  </div>
