import React, { Component } from 'react';
import './Home.css';

export default class Home extends Component {
  constructor(props) {
    super(props);

    this.assets = [...props.assets];
  }

  render() {
    return (
      <div className="Home">
        <div className="home--title">
          <h1>Assets List</h1>
        </div>
        <div className="home--list">
          {
            this.assets.map(({ id, name, type, modified, author, size }, i) =>
              <div className="list--item" key={id}>
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