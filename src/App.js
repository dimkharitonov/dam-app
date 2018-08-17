import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './App.css';

class App extends Component {
  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h1 className="App-title">DAM Control Center</h1>

        </header>
        <p className="App-intro">
          Welcome to DAM Control Center
        </p>
        <div>
          <Link to="/">Login</Link>
        </div>
      </div>
    );
  }
}

export default App;
