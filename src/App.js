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
      isAuthenticating: true,
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
        alert(e);
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

  handleLogout = event => this.userHasAuthenticated(false);

  render() {
    const childProps = {
      isAuthenticated: this.state.isAuthenticated,
      userHasAuthenticated: this.userHasAuthenticated.bind(this),
      assets: this.state.assets
    };

    return (
      this.state.isAuthenticating ?
        <div className="authentificating-progress">authentificating...</div> :

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
