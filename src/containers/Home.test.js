import React from 'react';
import ReactDOM from 'react-dom';
import { MemoryRouter } from 'react-router'
import Home from './Home';

it('renders without crashing', () => {
  let assets = [
    {
      id: 'XXXX-XXXX-XXXX-XX01',
      name: 'superfile image contains cats.jpg',
      type: 'image',
      modified: '2018-05-05 12:34',
      author: 'John Smith',
      size: '1.5Mb'
    },
    {
      id: 'XXXX-XXXX-XXXX-XX02',
      name: 'superfile image contains cats.jpg',
      type: 'image',
      modified: '2018-05-05 12:34',
      author: 'John Smith',
      size: '1.5Mb'
    },
    {
      id: 'XXXX-XXXX-XXXX-XX03',
      name: 'superfile image contains cats.jpg',
      type: 'image',
      modified: '2018-05-05 12:34',
      author: 'John Smith',
      size: '1.5Mb'
    },
    {
      id: 'XXXX-XXXX-XXXX-XX04',
      name: 'superfile image contains cats.jpg',
      type: 'image',
      modified: '2018-05-05 12:34',
      author: 'John Smith',
      size: '1.5Mb'
    }
  ];
  const div = document.createElement('div');
  ReactDOM.render(<MemoryRouter><Home assets={assets}/></MemoryRouter>, div);
  ReactDOM.unmountComponentAtNode(div);
});
