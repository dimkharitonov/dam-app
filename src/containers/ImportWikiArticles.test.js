import React from 'react';
import ReactDOM from 'react-dom';
import ImportWikiArticles from './ImportWikiArticles';

it('renders without crashing', () => {
  const div = document.createElement('div');
  ReactDOM.render(<ImportWikiArticles />, div);
  ReactDOM.unmountComponentAtNode(div);
});
