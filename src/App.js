import React, { Component } from 'react';
import { BrowserRouter as Router, Link } from 'react-router-dom';
import Routes from './Routes';
import { Auth } from 'aws-amplify';

import './App.css';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isAuthenticated: false,
      isAuthenticating: true
    };

    this._isMounted = false;
  }

  componentDidMount = async () => {
    this._isMounted = true;
    try {
      if(await Auth.currentSession()) {
        if(this._isMounted) {
          this.userHasAuthenticated(true);
        }
      }
    } catch(e) {
      if(e !== 'No current user') {
        console.log('Authenticating error', e);
      }
    }

    if(this._isMounted) {
      this.setState({ isAuthenticating: false });
    }
  };

  componentWillUnmount = () => {
    this._isMounted = false;
  };

  userHasAuthenticated = isAuthenticated => {
    this.setState({ isAuthenticated });
  };

  handleLogout = async event => {
    await Auth.signOut();
    if(this._isMounted) {
      this.userHasAuthenticated(false);
    }
  };

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated.bind(this)
    };
    console.log('render', this.state.assets);
    return (
      this.state.isAuthenticating ?
        <div className="authentificating-progress">authenticating...</div> :

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
