import React from 'react';
import Taxonomy from './Taxonomy';

export default ({stats}) =>
  <div className="taxonomy-stat">
    <Taxonomy name="Categories" data={stats.Category}/>
    <Taxonomy name="Категории" data={stats.Category_ru}/>
    <Taxonomy name="Locations" data={stats.Location}/>
    <Taxonomy name="Types" data={stats.Type}/>
    <Taxonomy name="Tags" data={stats.Tag}/>
  </div>