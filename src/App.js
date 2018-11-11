import React, { Component } from 'react';
import { HashRouter as Router } from 'react-router-dom';
import Routes from './Routes';
import NavBar from './ui/NavBar';
import InfiniteProgress from './ui/InfiniteProgress';

import { Auth } from 'aws-amplify';

import CssBaseline from '@material-ui/core/CssBaseline';

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

    return (
      <div>
        <CssBaseline/>
        <NavBar isAuthenticated={this.state.isAuthenticated} handleLogout={this.handleLogout}/>

        {

          this.state.isAuthenticating
            ?
            <InfiniteProgress>authenticating ...</InfiniteProgress>
            :
            <Router>
              <div className="App">
                <Routes childProps={childProps} />
              </div>
            </Router>
        }

      </div>
    );
  }
}

export default App;
