import React, { Component } from 'react';
import './Home.css';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.assets = [
      {
        id: 'XXXX-XXXX-XXXX-XXXX',
        name: 'superfile image contains cats.jpg',
        type: 'image',
        modified: '2018-05-05 12:34',
        author: 'John Smith',
        size: '1.5Mb'
      },
      {
        id: 'XXXX-XXXX-XXXX-XXXX',
        name: 'superfile image contains cats.jpg',
        type: 'image',
        modified: '2018-05-05 12:34',
        author: 'John Smith',
        size: '1.5Mb'
      },
      {
        id: 'XXXX-XXXX-XXXX-XXXX',
        name: 'superfile image contains cats.jpg',
        type: 'image',
        modified: '2018-05-05 12:34',
        author: 'John Smith',
        size: '1.5Mb'
      },
      {
        id: 'XXXX-XXXX-XXXX-XXXX',
        name: 'superfile image contains cats.jpg',
        type: 'image',
        modified: '2018-05-05 12:34',
        author: 'John Smith',
        size: '1.5Mb'
      }
    ];
  }

  render() {
    return (
      <div className="Home">
        <div className="home--title">
          <h1>Assets List</h1>
        </div>
        <div className="home--list">
          {
            this.assets.map(({ id, name, type, modified, author, size }) =>
              <div className="list--item" key="{id}">
                <div>{name} - { id } {size}</div>
                <div>{type}, author { author}</div>
                <div>{modified}</div>
              </div>
            )
          }
        </div>
      </div>
    );
  }
}