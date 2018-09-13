import React from 'react';

export default ({checkState, onClick}) =>
  <div className="list-tabs">
    <div className={'list-tabs--tab ' + checkState('documents')} data-type="documents" onClick={onClick}>
      Documents
    </div>
    <div className={'list-tabs--tab ' + checkState('media')} data-type="media" onClick={onClick}>
      Media
    </div>
    <div className={'list-tabs--tab ' + checkState('map')} data-type="map" onClick={onClick}>
      Map
    </div>
    <div className={'list-tabs--tab ' + checkState('cats')} data-type="cats" onClick={onClick}>
      Categories
    </div>
  </div>