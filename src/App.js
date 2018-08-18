import React, { Component } from 'react';
import { BrowserRouter as Router } from 'react-router-dom';
import Routes from './Routes';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false
    };
  }

  userHasAuthenticated = isAuthenticated => {
    console.log(`set authenticated flag to ${isAuthenticated}`);
    this.setState({ isAuthenticated });
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated.bind(this)
    };

    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">DAM Control Center</h1>

          </header>

          <Routes childProps={childProps} />
        </div>
      </Router>
    );
  }
}

export default App;
