import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
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

  handleLogout = event => this.userHasAuthenticated(false);

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
            {this.state.isAuthenticated
              ? <div className="App-menu"><Link to="/login" onClick={this.handleLogout}>Logout</Link></div>
              : ""
            }

          </header>

          <Routes childProps={childProps} />
        </div>
      </Router>
    );
  }
}

export default App;
