import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

import './App.css';

class App extends Component {
  render() {
    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">DAM Control Center</h1>

          </header>

          <Routes />
        </div>
      </Router>
    );
  }
}

export default App;
