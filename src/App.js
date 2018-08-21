import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Routes from './Routes';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      assets: [
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
      ]
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
      userHasAuthenticated: this.userHasAuthenticated.bind(this),
      assets: this.state.assets
    };

    return (
      <Router>
        <div className="App">
          <header className="App-header">
            <h1 className="App-title">DAM</h1>
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
