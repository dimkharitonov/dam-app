import React, { Component } from 'react';
import './Home.css';

export default class Home extends Component {
  render() {
    return (
      <div className="Home">
        <div>
          <h1>DAM Control Center</h1>
          <p>Restricted area. Please Login.</p>
        </div>
      </div>
    );
  }
}